
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://aaczctiwtdyxcxxxhkcm.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFhY3pjdGl3dGR5eGN4eHhoa2NtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMyNTk3MzEsImV4cCI6MjA3ODgzNTczMX0.5V8-_bepObRR8ipkuyQl9kXZeaKJi8YlUe-wYRg9XpA'

const supabase = createClient(supabaseUrl, supabaseKey)

async function getElitloppet() {
    const { data, error } = await supabase
        .from('calendar_events')
        .select('*')
        .ilike('title', '%Elitloppet%')
        .maybeSingle()

    if (error) {
        console.error('Error fetching event:', error)
        return
    }

    if (data) {
        console.log('DESCRIPTION_START')
        console.log(data.description)
        console.log('DESCRIPTION_END')
        console.log('COMMENT_START')
        console.log(data.comment)
        console.log('COMMENT_END')
    } else {
        console.log('No Elitloppet event found.')
    }
}

getElitloppet()
