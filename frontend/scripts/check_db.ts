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

async function checkData() {
    const today = '2025-11-25'
    console.log(`Checking picks for ${today}...`)

    const { data, error } = await supabase
        .from('daily_picks')
        .select('*')
        .eq('race_date', today)

    if (error) {
        console.error('Error fetching picks:', error)
        return
    }

    console.log(`Found ${data.length} picks for today.`)
    if (data.length > 0) {
        console.table(data.map(p => ({
            id: p.id,
            horse: p.horse_name,
            rank: p.prime_pick_rank,
            status: p.status,
            ai_score: p.ai_score
        })))
    } else {
        console.log('No data found. n8n might not have synced yet.')
    }
}

checkData()
