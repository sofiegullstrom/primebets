
const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')

async function checkTables() {
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

    // Listing tables is not directly supported by JS client easily without hitting information_schema or using rpc
    // simpler way: try to select from expected tables and see errors/success

    const tables = ['daily_picks', 'weekly_scout', 'saturday_picks', 'weekly_picks']

    for (const t of tables) {
        const { data, error } = await supabase.from(t).select('count', { count: 'exact', head: true })
        if (error) {
            console.log(`Table '${t}': ❌ Error - ${error.message}`)
        } else {
            console.log(`Table '${t}': ✅ Exists (accessible)`)
        }
    }
}

checkTables()
