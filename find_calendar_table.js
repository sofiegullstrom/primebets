
const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')

async function listTables() {
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
        return
    }

    const supabase = createClient(url, key)

    // Try to list tables via rpc if available, or just guess common names if not.
    // Since we don't have direct SQL access here easily, let's try to query 'calendar' and 'calendar_events'

    const candidates = ['calendar', 'calendar_events', 'events', 'schedule']

    for (const t of candidates) {
        const { data, error } = await supabase.from(t).select('*').limit(1)
        if (!error) {
            console.log(`Found table: ${t}`)
            console.log('Sample data:', data)
        } else {
            console.log(`Could not access '${t}': ${error.message}`)
        }
    }
}

listTables()
