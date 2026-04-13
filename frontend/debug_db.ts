
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: './.env' }); // Adjust path if needed

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || '';

// If env vars are not loaded here (because .env is in frontend), I might need to harcode them for a sec or read them properly.
// checking where .env is. Usually in root or frontend.
// Let's assume frontend/.env based on previous commands context.

const supabase = createClient(supabaseUrl, supabaseKey);

async function inspect() {
    console.log("Checking daily_picks columns...");
    const { data: picks, error: pickError } = await supabase.from('daily_picks').select('*').limit(1);
    if (pickError) console.error("Error fetching picks:", pickError);
    else if (picks && picks.length > 0) {
        console.log("Sample Pick Keys:", Object.keys(picks[0]));
    }

    console.log("\nChecking potential horse tables...");
    const tables = ['horses', 'horse_info', 'horse_profiles', 'horse_stats'];
    for (const t of tables) {
        const { data, error } = await supabase.from(t).select('*').limit(1);
        if (!error) {
            console.log(`Table '${t}' EXISTS! Sample data:`, data);
        } else {
            // console.log(`Table '${t}' error:`, error.message);
        }
    }
}

inspect();
