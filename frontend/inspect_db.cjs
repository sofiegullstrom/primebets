
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load env manully
try {
    const envPath = path.resolve(__dirname, '.env');
    const envFile = fs.readFileSync(envPath, 'utf8');
    const envVars = {};
    envFile.split('\n').forEach(line => {
        const [key, value] = line.split('=');
        if (key && value) {
            envVars[key.trim()] = value.trim().replace(/^["']|["']$/g, '');
        }
    });

    const supabaseUrl = envVars.VITE_SUPABASE_URL;
    const supabaseKey = envVars.VITE_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
        console.error("Missing Supabase keys in .env");
        process.exit(1);
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    async function inspect() {
        console.log("--- Inspecting daily_picks ---");
        const { data: picks, error } = await supabase.from('daily_picks').select('*').limit(1);
        if (error) {
            console.error("Error fetching daily_picks:", error);
        } else if (picks.length > 0) {
            console.log("Columns in daily_picks:", Object.keys(picks[0]).join(', '));
        } else {
            console.log("daily_picks is empty.");
        }

        console.log("\n--- Checking for 'horse' related tables ---");
        // We can't list tables easily with client, so we guess common names based on user description
        // User said "Adam har börjat lagt in data i häst info delen".
        const potentialTables = ['horses', 'horse_info', 'horse_data', 'horse_profiles', 'startlist_horses'];

        for (const t of potentialTables) {
            const { data, error } = await supabase.from(t).select('*').limit(1);
            if (!error) {
                console.log(`\nFOUND TABLE: '${t}'`);
                if (data.length > 0) {
                    console.log(`Columns in '${t}':`, Object.keys(data[0]).join(', '));
                    console.log("Sample row:", data[0]);
                } else {
                    console.log(`Table '${t}' exists but is empty.`);
                }
            }
        }
    }

    inspect();

} catch (err) {
    console.error("Error reading .env or executing:", err);
}
