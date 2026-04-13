
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load env vars
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, 'frontend', '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSaturdayPicks() {
    console.log('Checking saturday_picks table...');
    const { data, error } = await supabase
        .from('saturday_picks')
        .select('*')
        .order('race_date', { ascending: false });

    if (error) {
        console.error('Error fetching saturday_picks:', error);
        return;
    }

    console.log(`Found ${data.length} records.`);
    data.forEach(pick => {
        console.log(`- Date: ${pick.race_date}, Horse: ${pick.horse_name}, Track: ${pick.track_name}`);
    });
}

checkSaturdayPicks();
