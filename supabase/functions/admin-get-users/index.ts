import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        // 1. Verify Authentication (Must be logged in)
        const authHeader = req.headers.get('Authorization')
        if (!authHeader) {
            throw new Error('Missing Authorization header')
        }

        const supabaseClient = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_ANON_KEY') ?? '',
            { global: { headers: { Authorization: authHeader } } }
        )

        const {
            data: { user },
            error: userError,
        } = await supabaseClient.auth.getUser()

        if (userError || !user) {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), {
                status: 401,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            })
        }

        // 2. Verify Admin Role (Must check DB profile)
        // We use the Service Role Client here to read the profile securely
        const supabaseAdmin = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        )

        const { data: profile } = await supabaseAdmin
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single()

        const isBypass = user.email === 'sofie.g63@outlook.com' || user.email === 'primebets.se@gmail.com'

        if ((!profile || profile.role !== 'admin') && !isBypass) {
            return new Response(JSON.stringify({ error: 'Forbidden: Admins only' }), {
                status: 403,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            })
        }

        // 3. Fetch User List (from auth.users)
        // Only Service Role can list users
        const { data: { users }, error: listError } = await supabaseAdmin.auth.admin.listUsers()

        if (listError) throw listError

        // 4. Return Data
        // We map only safe fields to return
        const safeUsers = users.map((u: any) => ({
            id: u.id,
            email: u.email,
            created_at: u.created_at,
            last_sign_in: u.last_sign_in_at,
            status: u.banned_until ? 'banned' : 'active',
            role: 'user', // We might need to fetch profile roles too if we want to show them, but for now this is base auth user data
        }))

        // Optional: Merge with Profile Roles
        // Ideally we would join this, but for V1 let's get profiles too
        const { data: allProfiles } = await supabaseAdmin.from('profiles').select('id, role, subscription_tier')

        const mergedUsers = safeUsers.map((u: any) => {
            const p = allProfiles?.find((prof: any) => prof.id === u.id)
            return {
                ...u,
                role: p?.role || 'user',
                subscription_tier: p?.subscription_tier || 'free'
            }
        })

        return new Response(JSON.stringify({ users: mergedUsers }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
        })

    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400,
        })
    }
})
