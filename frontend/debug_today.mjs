import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const envPath = '/Users/sofiegullstrom/Desktop/Primebets/frontend/.env';
const envContent = fs.readFileSync(envPath, 'utf8');
const url = envContent.match(/VITE_SUPABASE_URL=(.*)/)?.[1]?.trim();
const key = envContent.match(/VITE_SUPABASE_ANON_KEY=(.*)/)?.[1]?.trim();

const supabase = createClient(url, key);

async function run() {
  const todayStr = new Date().toISOString().split('T')[0];
  console.log("Searching for race_date:", todayStr);
  const { data, error } = await supabase
    .from('daily_picks')
    .select('id, horse_name, net_result, status, race_date, prime_pick_rank, stake')
    .eq('race_date', todayStr);
    
  if (error) {
    console.error(error);
  } else {
    console.log("TODAYS PICKS:", JSON.stringify(data, null, 2));
  }
}

run();
