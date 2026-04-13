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
        const supabase = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        )

        const payload = await req.json()

        // Handle both { picks: [...] } and direct array
        let rawPicks = payload.picks || payload

        // If it's a single object, wrap it
        if (rawPicks && !Array.isArray(rawPicks)) {
            rawPicks = [rawPicks]
        }

        if (!rawPicks || !Array.isArray(rawPicks)) {
            throw new Error('Invalid payload: "picks" array or single object is required')
        }

        console.log(`Processing ${rawPicks.length} weekly scout picks...`)

        // Helper to safely get number
        const getNum = (val: any) => {
            const n = parseFloat(val)
            return isNaN(n) ? null : n
        }

        // Map incoming data
        const updates = rawPicks.map((p: any) => ({
            id: p.uuid,
            race_date: p.datum,
            track_name: p.bana,
            race_number: getNum(p.lopp),
            horse_name: p.hast || p.sektion,
            odds: getNum(p.odds),
            bet_type: p.spelform,
            adam_notes: p.motivering,
            distance: p.distans,
            start_method: p.startform,
            start_lane: getNum(p.startspar),
            bookmaker: p.spelbolag,
            interview_info: p['intervju information'],
            statistics: p.statistik,
            expected_odds: getNum(p['forvantat odds']),
            value_percent: getNum(p['spelvarde %']),
            ai_score: getNum(p.AI_score),
            final_output_message: p.final_output_message,
            horse_id: p.horse_uuid, // Maps 'horse_uuid' from input
            updated_at: new Date().toISOString(),
        }))

        // Filter out invalid entries (no UUID)
        const validUpdates = updates.filter((p: any) => p.id)

        if (validUpdates.length === 0) {
            console.log('No valid updates found (missing UUIDs?)')
            return new Response(
                JSON.stringify({ message: 'No valid data found', count: 0 }),
                { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
            )
        }

        // Clear existing weekly scout picks and insert new ones
        // This ensures only the latest weekly scout is shown
        const { error: deleteError } = await supabase
            .from('weekly_scout')
            .delete()
            .neq('id', '00000000-0000-0000-0000-000000000000') // Delete all

        if (deleteError) {
            console.error('Delete Error:', deleteError)
        }

        const { error } = await supabase
            .from('weekly_scout')
            .insert(validUpdates)

        if (error) {
            console.error('Supabase Insert Error:', error)
            throw error
        }

        return new Response(
            JSON.stringify({ message: 'Success', count: validUpdates.length }),
            {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 200,
            }
        )
    } catch (error) {
        console.error('Ingest Error:', error)
        return new Response(
            JSON.stringify({ error: error.message }),
            {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 400,
            }
        )
    }
})
