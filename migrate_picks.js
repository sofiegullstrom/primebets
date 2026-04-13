
const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')

async function migrateData() {
    let url = ''
    let key = ''

    try {
        const envFile = fs.readFileSync('frontend/.env', 'utf8')
        const lines = envFile.split('\n')
        for (const line of lines) {
            if (line.startsWith('VITE_SUPABASE_URL=')) url = line.split('=')[1].trim()
            if (line.startsWith('VITE_SUPABASE_ANON_KEY=')) key = line.split('=')[1].trim()
        }
    } catch (e) {
        console.log('Could not read frontend/.env')
    }

    if (!url || !key) {
        console.log('Could not find Supabase credentials.')
        return
    }

    const supabase = createClient(url, key)

    console.log('🚀 Starting migration...')

    // 1. Fetch all data from daily_picks
    const { data: allPicks, error: fetchError } = await supabase
        .from('daily_picks')
        .select('*')

    if (fetchError) {
        console.error('❌ Error fetching daily_picks:', fetchError)
        return
    }

    console.log(`Fetched ${allPicks.length} total rows from daily_picks.`)

    const weeklyPicks = []
    const saturdayPicks = []
    const idsToDelete = []

    // 2. Filter data
    for (const pick of allPicks) {
        const id = String(pick.id).toUpperCase()
        if (id.startsWith('VS')) {
            weeklyPicks.push(pick)
            idsToDelete.push(pick.id)
        } else if (id.startsWith('LS')) {
            saturdayPicks.push(pick)
            idsToDelete.push(pick.id)
        }
    }

    console.log(`Found ${weeklyPicks.length} Weekly Scout picks (VS...)`)
    console.log(`Found ${saturdayPicks.length} Saturday picks (LS...)`)

    // Helper to sanitize pick for move (whitelist safe columns)
    const sanitizeForMove = (pick) => {
        // Explicitly only take fields we know exist or are crucial
        return {
            id: pick.id,
            race_date: pick.race_date,
            track_name: pick.track_name,
            race_number: pick.race_number,
            horse_name: pick.horse_name,
            odds: pick.odds,
            bet_type: pick.bet_type,
            adam_notes: pick.adam_notes,
            status: pick.status,
            final_output_message: pick.final_output_message,

            // These we added via SQL, if they fail, we might need to remove them too, 
            // but let's try to keep the important ones.
            ai_score: pick.ai_score,
            prime_pick_rank: pick.prime_pick_rank
        }
    }

    // 3. Move Weekly Scout Data
    if (weeklyPicks.length > 0) {
        const sanitizedWeekly = weeklyPicks.map(sanitizeForMove)
        const { error: wError } = await supabase
            .from('weekly_scout')
            .upsert(sanitizedWeekly, { onConflict: 'id' })

        if (wError) {
            console.error('❌ Error inserting into weekly_scout:', wError)
            // Stop here if insert fails to avoid deleting data
            return
        }
        console.log('✅ Successfully copied data to weekly_scout')
    }

    // 4. Move Saturday Data
    if (saturdayPicks.length > 0) {
        const sanitizedSat = saturdayPicks.map(sanitizeForMove)
        const { error: sError } = await supabase
            .from('saturday_picks')
            .upsert(sanitizedSat, { onConflict: 'id' })

        if (sError) {
            console.error('❌ Error inserting into saturday_picks:', sError)
            return
        }
        console.log('✅ Successfully copied data to saturday_picks')
    }

    // 5. Delete moved data from daily_picks
    if (idsToDelete.length > 0) {
        console.log(`Deleting ${idsToDelete.length} moved rows from daily_picks...`)

        const { error: dError } = await supabase
            .from('daily_picks')
            .delete()
            .in('id', idsToDelete)

        if (dError) {
            console.error('❌ Error deleting from daily_picks:', dError)
        } else {
            console.log('✅ Cleanup complete!')
        }
    } else {
        console.log('No data needed moving.')
    }
}

migrateData()
