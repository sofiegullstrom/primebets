
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://aaczctiwtdyxcxxxhkcm.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFhY3pjdGl3dGR5eGN4eHhoa2NtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMyNTk3MzEsImV4cCI6MjA3ODgzNTczMX0.5V8-_bepObRR8ipkuyQl9kXZeaKJi8YlUe-wYRg9XpA'
const supabase = createClient(supabaseUrl, supabaseKey)

async function verify() {
    console.log('Checking Supabase connection...')
    
    // 1. Check latest race_date
    const { data: latestPicks, error: latestError } = await supabase
        .from('daily_picks')
        .select('race_date, created_at, horse_name')
        .order('race_date', { ascending: false })
        .limit(5)

    if (latestError) {
        console.error('Error fetching latest picks:', latestError)
    } else {
        console.log('\n=== LATEST PICKS (by race_date) ===')
        if (latestPicks.length > 0) {
            console.log(`Most recent race_date found: ${latestPicks[0].race_date}`)
            latestPicks.forEach(p => {
                console.log(`- ${p.race_date}: ${p.horse_name} (Created at: ${p.created_at})`)
            })
        } else {
            console.log('No picks found in database.')
        }
    }

    // 2. Check latest created_at (when was data last inserted?)
    const { data: recentlyAdded, error: recentError } = await supabase
        .from('daily_picks')
        .select('race_date, created_at, horse_name')
        .order('created_at', { ascending: false })
        .limit(5)

    if (recentError) {
         // created_at might not exist or be accessible, ignore if so
    } else {
        console.log('\n=== MOST RECENTLY ADDED (by created_at) ===')
        if (recentlyAdded.length > 0) {
             console.log(`Last data insertion: ${recentlyAdded[0].created_at}`)
             recentlyAdded.forEach(p => {
                console.log(`- Added: ${p.created_at} | Race Date: ${p.race_date} | Horse: ${p.horse_name}`)
            })
        }
    }

    // 3. Count total
    const { count, error: countError } = await supabase
        .from('daily_picks')
        .select('*', { count: 'exact', head: true })
    
    if (!countError) {
        console.log(`\nTotal picks in database: ${count}`)
    }

}

verify()
