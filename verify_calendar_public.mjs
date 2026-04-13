
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://aaczctiwtdyxcxxxhkcm.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFhY3pjdGl3dGR5eGN4eHhoa2NtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMyNTk3MzEsImV4cCI6MjA3ODgzNTczMX0.5V8-_bepObRR8ipkuyQl9kXZeaKJi8YlUe-wYRg9XpA'

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkCalendar() {
    console.log('--- Checking Calendar Access (Public Role) ---')

    const { data, error } = await supabase
        .from('calendar_events')
        .select('*')

    if (error) {
        console.error('❌ Error fetching events:', error)
    } else {
        console.log(`✅ Success! Found ${data.length} events.`)
        if (data.length > 0) {
            console.log('Sample event:', JSON.stringify(data[0], null, 2))
            console.log('Dates found:', data.map(e => e.race_date).join(', '))
        } else {
            console.log('⚠️ No events found in table (or RLS is hiding them).')
        }
    }
}

checkCalendar()
