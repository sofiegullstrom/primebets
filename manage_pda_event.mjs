
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://aaczctiwtdyxcxxxhkcm.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFhY3pjdGl3dGR5eGN4eHhoa2NtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMyNTk3MzEsImV4cCI6MjA3ODgzNTczMX0.5V8-_bepObRR8ipkuyQl9kXZeaKJi8YlUe-wYRg9XpA'

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function manageEvent() {
    console.log('----- STARTING DEBUG SCRIPT -----');

    // 1. Check if event exists
    const title = "Prix d'Amérique 2026";
    console.log(`Checking for existing event: ${title}`);

    const { data: existing, error: fetchError } = await supabase
        .from('calendar_events')
        .select('*')
        .eq('title', title);

    if (fetchError) {
        console.error('Error fetching:', fetchError);
        return;
    }

    if (existing && existing.length > 0) {
        console.log('Event ALREADY EXISTS:', existing[0]);
        // Update type just in case
        const { error: updateError } = await supabase
            .from('calendar_events')
            .update({ type: 'Stort spel' })
            .eq('title', title);

        if (updateError) console.error('Error updating type:', updateError);
        else console.log('Successfully updated event type to "Stort spel".');

    } else {
        console.log('Event NOT found. Inserting now...');
        const { data: newEvent, error: insertError } = await supabase.from('calendar_events').insert([
            {
                race_date: '2026-01-25',
                title: title,
                type: 'Stort spel',
                location: 'Vincennes, Paris',
                description: 'Världens tuffaste travlopp avgörs på kolstybben i Paris.',
                detailed_description: "Det är dags för årets höjdpunkt, Prix d'Amérique på Vincennes. Vi följer givetvis de svenska hoppen med stort intresse.",
                motivation: 'Ett av årets absolut största spelobjekt. Vi har scoutat formen på de franska kanonerna.',
                bet_type: 'Vinnare',
                status: 'pending'
            }
        ]).select();

        if (insertError) {
            console.error('Error inserting event:', insertError);
        } else {
            console.log('Success! Event inserted:', newEvent);
        }
    }

    console.log('----- SCRIPT FINISHED -----');
}

manageEvent();
