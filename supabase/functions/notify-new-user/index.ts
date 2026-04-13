import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface NewUserPayload {
    type: 'INSERT'
    table: string
    record: {
        id: string
        email: string
        created_at: string
    }
}

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const payload: NewUserPayload = await req.json()

        console.log('New user signup:', payload.record.email)

        // Send email to PrimeBets
        const res = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${RESEND_API_KEY}`,
            },
            body: JSON.stringify({
                from: 'PrimeBets <noreply@primebets.se>',
                to: ['primebets.se@gmail.com'],
                subject: '🎉 Ny användare registrerad!',
                html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #10b981;">Ny användare har registrerat sig!</h2>
            
            <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0;"><strong>E-post:</strong> ${payload.record.email}</p>
              <p style="margin: 10px 0 0 0;"><strong>Registrerad:</strong> ${new Date(payload.record.created_at).toLocaleString('sv-SE')}</p>
              <p style="margin: 10px 0 0 0;"><strong>User ID:</strong> ${payload.record.id}</p>
            </div>
            
            <p style="color: #6b7280; font-size: 14px;">
              Detta är en automatisk notifikation från PrimeBets.
            </p>
          </div>
        `,
            }),
        })

        const data = await res.json()

        if (!res.ok) {
            throw new Error(`Resend API error: ${JSON.stringify(data)}`)
        }

        console.log('Email sent successfully:', data)

        return new Response(JSON.stringify({ success: true }), {
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
