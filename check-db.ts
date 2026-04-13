import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL || ''
const supabaseKey = process.env.SUPABASE_ANON_KEY || ''
const supabase = createClient(supabaseUrl, supabaseKey)

async function checkData() {
    // Check total picks
    const { data: allPicks, error: allError } = await supabase
        .from('daily_picks')
        .select('*')

    if (allError) {
        console.error('Error fetching all picks:', allError)
        return
    }

    console.log('\n=== DATABASE STATS ===')
    console.log('Total picks:', allPicks?.length || 0)

    const finishedPicks = allPicks?.filter(p => p.status !== 'pending') || []
    console.log('Finished picks:', finishedPicks.length)

    const wonPicks = allPicks?.filter(p => p.status === 'won') || []
    console.log('Won picks:', wonPicks.length)

    const lostPicks = allPicks?.filter(p => p.status === 'lost') || []
    console.log('Lost picks:', lostPicks.length)

    console.log('\n=== SAMPLE DATA (Latest 5) ===')
    const latest = allPicks?.slice(0, 5) || []
    latest.forEach(pick => {
        console.log(`${pick.race_date} | ${pick.horse_name} | Status: ${pick.status} | Net: ${pick.net_result} | Payout: ${pick.result_payout}`)
    })

    console.log('\n=== CHECKING FOR RESULTS DATA ===')
    const withResults = allPicks?.filter(p => p.net_result !== null || p.result_payout !== null) || []
    console.log('Picks with result data:', withResults.length)
}

checkData()
