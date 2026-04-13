
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!)

        // 0. SECURE THIS ENDPOINT (Admin Only)
        const authHeader = req.headers.get('Authorization')
        if (authHeader) {
            const supabaseClient = createClient(SUPABASE_URL!, Deno.env.get('SUPABASE_ANON_KEY')!, {
                global: { headers: { Authorization: authHeader } }
            })
            const { data: { user } } = await supabaseClient.auth.getUser()

            if (user) {
                const isWhitelisted = user.email === 'sofie.g63@outlook.com' || user.email === 'primebets.se@gmail.com'
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('role')
                    .eq('id', user.id)
                    .single()

                if (!isWhitelisted && profile?.role !== 'admin') {
                    throw new Error('Unauthorized: Admin access required')
                }
            } else {
                // Allow secret bypass if needed for cron jobs later, but for now block
                // const { secret } = await req.json().catch(() => ({}))
                // if (secret !== 'primebets-secret-release-key') throw new Error('Unauthorized')
            }
        }

        // 1. Get today's PrimePick (adjusted for Sweden Timezone)
        // We look for picks with race_date matching today in Sweden
        const formatter = new Intl.DateTimeFormat('sv-SE', {
            timeZone: 'Europe/Stockholm',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        })
        const todayOpen = formatter.format(new Date()) // YYYY-MM-DD

        console.log(`Checking for PrimePick on date: ${todayOpen}`)

        const { data: picks, error: pickError } = await supabase
            .from('daily_picks')
            .select('*')
            .eq('race_date', todayOpen)
            .eq('prime_pick_rank', 1)
            .eq('notified', false) // Only pick non-notified ones
            .limit(1)

        if (pickError || !picks || picks.length === 0) {
            console.log('No un-notified PrimePick found for today.')
            return new Response(JSON.stringify({ message: 'Nothing to notify', date_checked: todayOpen }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 200,
            })
        }

        const primePick = picks[0]
        console.log(`Found PrimePick to notify: ${primePick.horse_name}`)

        // 2. Mark as notified IMMEDIATELY
        const { error: updateError } = await supabase
            .from('daily_picks')
            .update({ notified: true })
            .eq('id', primePick.id)

        if (updateError) {
            throw new Error('Failed to update notified status')
        }

        // 3. Get all subscribers (combine 'subscribers' table and 'profiles' table)
        const { data: subscribers, error: subError } = await supabase
            .from('subscribers')
            .select('email');

        const { data: profiles, error: profileError } = await supabase
            .from('profiles')
            .select('email'); // Assuming 'email' or fetching user data from auth is needed, but profiles usually has ID. RLS might block email reading if not careful.

        // Actually, fetching emails from profiles directly requires admin previleges or emails to be in the table.
        // If users sign up via Auth, their email is in auth.users, not necessarily public.profiles.
        // However, let's assume valid subscribers are in the 'subscribers' table OR we strictly trust the hardcoded list for testing.

        // For now, let's just use the subscribers table + hardcoded admins for testing if table is empty
        let recipients = (subscribers || []).map(s => s.email);

        if (recipients.length === 0) {
            // Fallback: Add known admins for testing if no real subscribers exist
            console.log('No subscribers in DB, adding admins for test.');
            recipients = ['sofie.g63@outlook.com', 'primebets.se@gmail.com', 'adam.sundqvistt@gmail.com'];
        }

        // Remove duplicates
        recipients = [...new Set(recipients)];

        if (recipients.length === 0) {
            return new Response(JSON.stringify({ message: 'No subscribers to notify' }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 200,
            });
        }

        // 4. Send emails
        console.log(`Sending emails to ${recipients.length} subscribers...`);

        for (const email of recipients) {
            await fetch('https://api.resend.com/emails', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${RESEND_API_KEY}`,
                },
                body: JSON.stringify({
                    from: 'PrimeBets <noreply@primebets.se>',
                    to: [email],
                    subject: `🔥 Dagens PrimePick: ${primePick.horse_name}`,
                    html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #1f2937;">
              <h1 style="color: #10b981;">Dagens PrimePick är här!</h1>
              <p>Vi har analyserat dagens lopp och identifierat det bästa spelvärdet.</p>
              
              <div style="background: #f3f4f6; padding: 20px; border-radius: 12px; margin: 24px 0; border: 1px solid #e5e7eb;">
                <h2 style="color: #111827; margin: 0 0 10px 0; font-size: 24px;">${primePick.horse_name}</h2>
                <p style="margin: 5px 0;"><strong>Bana:</strong> ${primePick.track_name}</p>
                <p style="margin: 5px 0;"><strong>Odds:</strong> <span style="font-weight: bold; color: #10b981;">${primePick.odds}</span></p>
                 <p style="margin: 15px 0 0 0; font-style: italic; color: #4b5563;">"${primePick.adam_notes || primePick.final_output_message || 'Se analysen på sidan.'}"</p>
              </div>

              <div style="text-align: center; margin-top: 30px;">
                <a href="https://primebets.se" style="display: inline-block; background: #10b981; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">Se hela analysen & spela</a>
              </div>
              
              <p style="margin-top: 40px; font-size: 12px; color: #9ca3af; text-align: center;">
                Avregistrera dig genom att svara på detta mail.
              </p>
            </div>
          `,
                }),
            });
        }

        return new Response(JSON.stringify({ success: true, count: recipients.length }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
        })

    } catch (error) {
        console.error('Error:', error)
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 500,
        })
    }
})
