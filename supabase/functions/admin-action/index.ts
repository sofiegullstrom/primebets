
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const supabaseAdmin = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!)

        // 1. Verify Requesting User is Admin
        const authHeader = req.headers.get('Authorization')
        if (!authHeader) throw new Error('No authorization header')

        const supabaseClient = createClient(SUPABASE_URL!, SUPABASE_ANON_KEY!, {
            global: { headers: { Authorization: authHeader } }
        })

        const { data: { user } } = await supabaseClient.auth.getUser()
        if (!user) throw new Error('Unauthorized')

        // Check admin role
        const { data: profile } = await supabaseAdmin
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single()

        // Allow 'sofie.g63@outlook.com' backend bypass or database role check
        const isBypass = user.email === 'sofie.g63@outlook.com' || user.email === 'primebets.se@gmail.com'

        if (profile?.role !== 'admin' && !isBypass) {
            throw new Error('Forbidden: Not an admin')
        }

        // 2. Parse Action
        const { action, userId, duration } = await req.json()
        if (!userId || !action) throw new Error('Missing userId or action')

        console.log(`Admin ${user.email} performing ${action} on ${userId}`)

        let result;

        switch (action) {
            case 'delete':
                // Check if trying to delete self
                if (userId === user.id) throw new Error('Cannot delete yourself')
                const { error: delError } = await supabaseAdmin.auth.admin.deleteUser(userId)
                if (delError) throw delError
                result = { message: 'User deleted' }
                break

            case 'block':
                // duration in hours, default 100 years
                const banDuration = duration ? `${duration}h` : '876000h'
                const { error: blockError } = await supabaseAdmin.auth.admin.updateUserById(userId, { ban_duration: banDuration })
                if (blockError) throw blockError

                // Also update profile status for UI consistency (optional but good)
                // Assuming we might have a status field in profiles? If not, auth status is enough.
                // But AdminPage checks 'user.status === active'. This usually comes from auth metadata.
                result = { message: 'User blocked' }
                break

            case 'unblock':
                const { error: unblockError } = await supabaseAdmin.auth.admin.updateUserById(userId, { ban_duration: '0s' })
                if (unblockError) throw unblockError
                result = { message: 'User unblocked' }
                break

            case 'set_premium':
                const { error: premError } = await supabaseAdmin
                    .from('profiles')
                    .update({ subscription_tier: 'premium' })
                    .eq('id', userId)

                if (premError) throw premError
                result = { message: 'User set to Premium' }
                break

            case 'remove_premium':
                const { error: freeError } = await supabaseAdmin
                    .from('profiles')
                    .update({ subscription_tier: 'free' })
                    .eq('id', userId)

                if (freeError) throw freeError
                result = { message: 'User set to Free' }
                break

            case 'make_admin':
                const { error: makeAdminErr } = await supabaseAdmin
                    .from('profiles')
                    .update({ role: 'admin' })
                    .eq('id', userId)
                if (makeAdminErr) throw makeAdminErr
                result = { message: 'User promoted to Admin' }
                break

            case 'remove_admin':
                const { error: removeAdminErr } = await supabaseAdmin
                    .from('profiles')
                    .update({ role: 'user' })
                    .eq('id', userId)
                if (removeAdminErr) throw removeAdminErr
                result = { message: 'User demoted to User' }
                break

            default:
                throw new Error('Invalid action')
        }

        return new Response(JSON.stringify(result), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
        })

    } catch (error: any) {
        console.error('Admin Action Error:', error)
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400,
        })
    }
})
