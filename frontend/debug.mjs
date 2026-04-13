import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const envContent = fs.readFileSync('.env.local', 'utf8');
const urlMatch = envContent.match(/VITE_SUPABASE_URL=(.*)/);
const keyMatch = envContent.match(/VITE_SUPABASE_ANON_KEY=(.*)/);

if (!urlMatch || !keyMatch) {
  console.log("No env found");
  process.exit();
}

const supabase = createClient(urlMatch[1], keyMatch[1]);

async function run() {
  const { data, error } = await supabase
    .from('daily_picks')
    .select('horse_name, net_result, status, created_at, id')
    .order('created_at', { ascending: false })
    .limit(3);
  console.log("DB RESULT:", JSON.stringify(data, null, 2));
}

run();
