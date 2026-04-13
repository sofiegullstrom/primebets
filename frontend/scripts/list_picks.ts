import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'

// Manually parse .env
const envPath = path.resolve(process.cwd(), '.env')
const envContent = fs.readFileSync(envPath, 'utf-8')
const env: Record<string, string> = {}
envContent.split('\n').forEach(line => {
    const [key, value] = line.split('=')
    if (key && value) {
        env[key.trim()] = value.trim()
    }
})

const supabaseUrl = env.VITE_SUPABASE_URL
const supabaseKey = env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase env vars')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function listAllPicks() {
    console.log('Listing ALL picks...')

    const { data, error } = await supabase
        .from('daily_picks')
        .select('id, race_date, horse_name, prime_pick_rank')
        .order('race_date', { ascending: false })
        .limit(50)

    if (error) {
        console.error('Error:', error)
        return
    }

    console.table(data)
}

listAllPicks()
