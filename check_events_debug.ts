
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://aaczctiwtdyxcxxxhkcm.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFhY3pjdGl3dGR5eGN4eHhoa2NtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMyNTk3MzEsImV4cCI6MjA3ODgzNTczMX0.5V8-_bepObRR8ipkuyQl9kXZeaKJi8YlUe-wYRg9XpA'

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkEvents() {
    console.log('Checking events...');
    const todayStr = new Date().toISOString().split('T')[0];
    const { data, error } = await supabase
        .from('calendar_events')
        .select('*')
        .gte('race_date', '2025-01-01'); // Check broad range

    if (error) {
        console.error('Error fetching events:', error);
    } else {
        console.log('Events found:', data);
    }
}

checkEvents();
