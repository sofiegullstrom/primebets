
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://aaczctiwtdyxcxxxhkcm.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFhY3pjdGl3dGR5eGN4eHhoa2NtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMyNTk3MzEsImV4cCI6MjA3ODgzNTczMX0.5V8-_bepObRR8ipkuyQl9kXZeaKJi8YlUe-wYRg9XpA';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkDates() {
    const { data, error } = await supabase
        .from('daily_picks')
        .select('race_date')
        .order('race_date', { ascending: true });

    if (error) {
        console.error('Error:', error);
        return;
    }

    if (!data || data.length === 0) {
        console.log('No bets found.');
        return;
    }

    const first = data[0].race_date;
    const last = data[data.length - 1].race_date;
    console.log(`First bet date: ${first}`);
    console.log(`Last bet date: ${last}`);
    console.log(`Total bets: ${data.length}`);

    const now = new Date();
    const threeMonthsAgo = new Date(); threeMonthsAgo.setMonth(now.getMonth() - 3);
    const sixMonthsAgo = new Date(); sixMonthsAgo.setMonth(now.getMonth() - 6);
    const twelveMonthsAgo = new Date(); twelveMonthsAgo.setMonth(now.getMonth() - 12);

    const extremelyRecent = data.filter(d => new Date(d.race_date) >= threeMonthsAgo);
    const recent = data.filter(d => new Date(d.race_date) >= sixMonthsAgo);
    const medium = data.filter(d => new Date(d.race_date) < sixMonthsAgo && new Date(d.race_date) >= twelveMonthsAgo);
    const old = data.filter(d => new Date(d.race_date) < twelveMonthsAgo);

    console.log(`Extremely Recent (< 3 mo): ${extremelyRecent.length}`);
    console.log(`Recent (< 6 mo): ${recent.length}`);
    console.log(`Medium (6-12 mo): ${medium.length}`);
    console.log(`Old (> 12 mo): ${old.length}`);
}

checkDates();
