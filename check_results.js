
const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')

async function checkResults() {
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

    const tables = ['daily_picks', 'weekly_scout', 'saturday_picks']

    for (const table of tables) {
        console.log(`\n--- ${table} (Completed games) ---`)
        const { data, error } = await supabase
            .from(table)
            .select('id, horse_name, status, net_result, result_payout')
            .neq('status', 'pending')

        if (error) console.log(error.message)
        else if (data.length === 0) console.log('No completed games found.')
        else console.table(data)
    }
}

checkResults()
