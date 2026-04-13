const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://aaczctiwtdyxcxxxhkcm.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFhY3pjdGl3dGR5eGN4eHhoa2NtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMyNTk3MzEsImV4cCI6MjA3ODgzNTczMX0.5V8-_bepObRR8ipkuyQl9kXZeaKJi8YlUe-wYRg9XpA'

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkLatest() {
    console.log('🔍 Checking latest daily_picks...\n')

    const { data, error } = await supabase
        .from('daily_picks')
        .select('id, race_date, horse_name, track_name, odds, is_prime_pick, created_at')
        .order('created_at', { ascending: false })
        .limit(5)

    if (error) {
        console.error('Error:', error)
        return
    }

    console.log('📊 Latest 5 picks:')
    data.forEach((pick, i) => {
        console.log(`\n${i + 1}. ${pick.horse_name} (${pick.track_name})`)
        console.log(`   Race Date: ${pick.race_date}`)
        console.log(`   Odds: ${pick.odds}`)
        console.log(`   Prime Pick: ${pick.is_prime_pick ? 'YES' : 'No'}`)
        console.log(`   Added: ${new Date(pick.created_at).toLocaleString('sv-SE')}`)
    })
}

checkLatest()
