
const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')

async function checkWeekly() {
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

    if (!url || !key) return

    const supabase = createClient(url, key)

    console.log('--- Weekly Scout Content ---')
    const { data, error } = await supabase
        .from('weekly_scout')
        .select('id, race_date, horse_name')

    if (error) console.log(error)
    else console.table(data)

    console.log('\n--- Checking daily_picks for VS... ---')
    const { data: daily } = await supabase
        .from('daily_picks')
        .select('id, race_date')
        .ilike('id', 'VS%')

    if (daily && daily.length > 0) console.table(daily)
    else console.log('No VS-picks left in daily_picks')
}

checkWeekly()
