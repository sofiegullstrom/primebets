
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://aaczctiwtdyxcxxxhkcm.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFhY3pjdGl3dGR5eGN4eHhoa2NtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMyNTk3MzEsImV4cCI6MjA3ODgzNTczMX0.5V8-_bepObRR8ipkuyQl9kXZeaKJi8YlUe-wYRg9XpA'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function inspectSchema() {
    console.log('--- Inspecting calendar_events Schema ---')

    // We can't query information_schema easily via js client without rpc/admin, 
    // BUT we can fetch a row and see what keys it has, assuming at least one row exists.
    // Or we can try to insert a dummy row with all fields we expect and see IF it errors (but that's messy).
    // Better: Query a single row and print keys.
    const { data, error } = await supabase
        .from('calendar_events')
        .select('*')
        .limit(1)

    if (error) {
        console.error('Error:', error)
    } else if (data && data.length > 0) {
        console.log('Existing columns found in first row:', Object.keys(data[0]))
    } else {
        console.log('No rows found, cannot infer schema easily via client.')
    }
}

inspectSchema()
