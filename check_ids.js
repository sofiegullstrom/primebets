
const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')

async function checkIds() {
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

    const { data, error } = await supabase
        .from('daily_picks')
        .select('id')
        .limit(10)

    if (error) {
        console.error('Error fetching IDs:', error)
        return
    }


    console.log('--- daily_picks ---')
    console.log(data)

    const { data: weekly, error: wErr } = await supabase
        .from('weekly_picks')
        .select('id')
        .limit(3)

    if (wErr) console.log('weekly_picks error:', wErr.message)
    else {
        console.log('--- weekly_picks ---')
        console.log(weekly)
    }

    const { data: sat, error: sErr } = await supabase
        .from('saturday_picks')
        .select('id')
        .limit(3)

    if (sErr) console.log('saturday_picks error:', sErr.message)
    else {
        console.log('--- saturday_picks ---')
        console.log(sat)
    }
}

checkIds()
