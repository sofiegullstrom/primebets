
const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')

async function checkCounts() {
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

    const tables = ['daily_picks', 'weekly_scout', 'saturday_picks']

    console.log('--- Row Counts ---')
    for (const t of tables) {
        const { count, error } = await supabase.from(t).select('*', { count: 'exact', head: true })
        if (error) {
            console.log(`${t}: Error - ${error.message}`)
        } else {
            console.log(`${t}: ${count} rows`)
        }
    }

    // Check if we have mixed content in daily_picks that should be elsewhere
    // Only if daily_picks has rows
    const { data: mixedData } = await supabase
        .from('daily_picks')
        .select('id')
        .or('id.ilike.VS%,id.ilike.LS%')
        .limit(5)

    if (mixedData && mixedData.length > 0) {
        console.log('\n⚠️ Found VS/LS IDs in daily_picks! (Examples: ' + mixedData.map(d => d.id).join(', ') + ')')
    } else {
        console.log('\n✅ No VS/LS IDs found in daily_picks.')
    }
}

checkCounts()
