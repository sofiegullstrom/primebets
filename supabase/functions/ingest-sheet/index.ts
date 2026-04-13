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

    // Handle both { picks: [...] } and direct array (just in case)
    let rawPicks = payload.picks || payload

    // If it's a single object (n8n sending one-by-one), wrap it
    if (rawPicks && !Array.isArray(rawPicks)) {
      rawPicks = [rawPicks]
    }

    if (!rawPicks || !Array.isArray(rawPicks)) {
      throw new Error('Invalid payload: "picks" array or single object is required')
    }

    console.log(`Processing ${rawPicks.length} picks...`)

    // Map incoming data using bracket notation for keys with spaces/special chars
    const updates = rawPicks.map((p: any) => {
      // Helper to safely get number
      const getNum = (val: any) => {
        const n = parseFloat(val)
        return isNaN(n) ? null : n
      }

      return {
        id: p.uuid,
        race_date: p.datum,
        track_name: p.bana,
        race_number: getNum(p.lopp),
        horse_name: p.hast || p.sektion, // Fallback if needed
        odds: getNum(p.odds),
        bet_type: p.spelform,
        adam_notes: p.motivering,

        distance: p.distans,
        start_method: p.startform,
        start_lane: getNum(p.startspar),
        bookmaker: p.spelbolag,

        // Keys with spaces/special chars
        interview_info: p['intervju information'],
        statistics: p.statistik,
        expected_odds: getNum(p['forvantat odds']),
        value_percent: getNum(p['spelvarde %']),
        horse_id: p.horse_uuid, // Maps 'horse_uuid' from input

        // Stake mapping (Adam writes "2" -> "2 units")
        stake: p.Insats ? (String(p.Insats).toLowerCase().includes('unit') ? p.Insats : `${p.Insats} units`) : null,

        result_payout: getNum(p.resultat),
        net_result: getNum(p.netto),
        yesterday_result: getNum(p['gardagens resultat']),

        ai_score: getNum(p.AI_score),
        prime_pick_rank: getNum(p.PrimePick_rank),
        form_score_7d: getNum(p['7day_form_score']),
        form_score_30d: getNum(p['30day_form_score']),
        final_output_message: p.final_output_message,
        is_prime_pick: p.DP?.toLowerCase() === 'ja',

        // Derive status based on results
        // Only use netto since resultat column contains text ("Vinst"/"Förlust")
        status: (() => {
          const nettoValue = getNum(p.netto)
          if (nettoValue === null) return 'pending'
          if (nettoValue > 0) return 'won'
          if (nettoValue < 0) return 'lost'
          return 'pending'
        })(),

        updated_at: new Date().toISOString(),
      }
    })

    // Filter out invalid entries (no UUID)
    const validUpdates = updates.filter((p: any) => p.id)

    // Deduplicate updates by ID (keep the last one if duplicates exist)
    const uniqueUpdatesMap = new Map()
    validUpdates.forEach((p: any) => {
      uniqueUpdatesMap.set(p.id, p)
    })
    const uniqueUpdates = Array.from(uniqueUpdatesMap.values())

    if (uniqueUpdates.length === 0) {
      console.log('No valid updates found (missing UUIDs?)')
      return new Response(
        JSON.stringify({ message: 'No valid data found', count: 0 }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      )
    }

    // Split updates into categories
    const dailyPicks: any[] = []
    const weeklyScoutPicks: any[] = []
    const saturdayPicks: any[] = []

    uniqueUpdates.forEach((p: any) => {
      const id = String(p.id).toUpperCase()
      if (id.startsWith('VS')) {
        weeklyScoutPicks.push(p)
      } else if (id.startsWith('LS')) {
        saturdayPicks.push(p)
      } else {
        dailyPicks.push(p)
      }
    })

    // Upsert into respective tables
    const upsertPromises = []

    if (dailyPicks.length > 0) {
      upsertPromises.push(
        supabase.from('daily_picks').upsert(dailyPicks, { onConflict: 'id' })
      )
    }
    if (weeklyScoutPicks.length > 0) {
      upsertPromises.push(
        supabase.from('weekly_scout').upsert(weeklyScoutPicks, { onConflict: 'id' })
      )
    }
    if (saturdayPicks.length > 0) {
      upsertPromises.push(
        supabase.from('saturday_picks').upsert(saturdayPicks, { onConflict: 'id' })
      )
    }

    const results = await Promise.all(upsertPromises)

    // Check for errors
    const errors = results.filter(r => r.error).map(r => r.error)
    if (errors.length > 0) {
      console.error('Supabase Upsert Errors:', errors)
      throw new Error(`Failed to upsert some batches: ${JSON.stringify(errors)}`)
    }


    // 3. Trigger AI Analysis for each pick (Fire and Forget)
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''

    const analysisPromises = uniqueUpdates.map(async (pick: any) => {
      try {
        await fetch(`${supabaseUrl}/functions/v1/analyze-pick`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${serviceRoleKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ record: pick }),
        })
      } catch (err) {
        console.error(`Failed to trigger analysis for ${pick.id}:`, err)
      }
    })

    // Prepare response
    const response = new Response(
      JSON.stringify({ message: 'Success', count: uniqueUpdates.length, analysis_triggered: true }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

    // Use EdgeRuntime.waitUntil to keep the function alive for background tasks
    // @ts-ignore
    if (typeof EdgeRuntime !== 'undefined' && EdgeRuntime.waitUntil) {
      // @ts-ignore
      EdgeRuntime.waitUntil(Promise.all(analysisPromises))
    } else {
      console.log('EdgeRuntime.waitUntil not found, waiting for promises (may timeout)...')
      await Promise.all(analysisPromises)
    }

    return response
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
