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

        let rawPicks = payload.picks || payload
        if (rawPicks && !Array.isArray(rawPicks)) {
            rawPicks = [rawPicks]
        }

        if (!rawPicks || !Array.isArray(rawPicks)) {
            throw new Error('Invalid payload')
        }

        const getNum = (val: any) => {
            const n = parseFloat(val)
            return isNaN(n) ? null : n
        }

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
            horse_id: p.horse_uuid, // Maps 'horse_uuid' from input to 'horse_id' in DB
            updated_at: new Date().toISOString(),
        }))

        const validUpdates = updates.filter((p: any) => p.id)

        if (validUpdates.length === 0) {
            return new Response(
                JSON.stringify({ message: 'No valid data', count: 0 }),
                { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
            )
        }

        await supabase.from('saturday_picks').delete().neq('id', '00000000-0000-0000-0000-000000000000')
        const { error } = await supabase.from('saturday_picks').insert(validUpdates)

        if (error) throw error

        return new Response(
            JSON.stringify({ message: 'Success', count: validUpdates.length }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
        )
    } catch (error) {
        return new Response(
            JSON.stringify({ error: error.message }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        )
    }
})
