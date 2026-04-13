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

async function updatePicks() {
    console.log('Manually updating picks for 2025-11-25...')

    // 1. Set G.G.Qurre (ID 74) as Rank 1 (Prime Pick)
    const { error: err1 } = await supabase
        .from('daily_picks')
        .update({
            prime_pick_rank: 1,
            ai_score: 85,
            final_output_message: "Dagens PrimePick: G.G.Qurre\n• Form: Kraftigt uppåt, såg fin ut senast.\n• Kommentar: Perfekt läge och möter passande motstånd.\n• Startspår/distans: Spår 1 passar utmärkt.\n• Oddsanalys: Spelvärde 40%, aktuellt odds 3.50.\nDetta är dagens starkaste spel enligt PrimeBets AI."
        })
        .eq('id', '74')

    if (err1) console.error('Error updating 74:', err1)
    else console.log('Updated G.G.Qurre to Rank 1')

    // 2. Set Lizmark (ID 75) as Rank 2
    const { error: err2 } = await supabase
        .from('daily_picks')
        .update({
            prime_pick_rank: 2,
            ai_score: 75
        })
        .eq('id', '75')

    if (err2) console.error('Error updating 75:', err2)
    else console.log('Updated Lizmark to Rank 2')

    // 3. Set Stuve Skarp (ID 76) as Rank 3
    const { error: err3 } = await supabase
        .from('daily_picks')
        .update({
            prime_pick_rank: 3,
            ai_score: 65
        })
        .eq('id', '76')

    if (err3) console.error('Error updating 76:', err3)
    else console.log('Updated Stuve Skarp to Rank 3')
}

updatePicks()
