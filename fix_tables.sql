
-- Run this in your Supabase SQL Editor to make sure all tables have the same columns
-- This enables us to store AI analysis and results for Weekly Scout and Saturday picks too.

-- 1. FIX WEEKLY_SCOUT
ALTER TABLE weekly_scout ADD COLUMN IF NOT EXISTS ai_analysis JSONB;
ALTER TABLE weekly_scout ADD COLUMN IF NOT EXISTS ai_score NUMERIC;
ALTER TABLE weekly_scout ADD COLUMN IF NOT EXISTS final_output_message TEXT;
ALTER TABLE weekly_scout ADD COLUMN IF NOT EXISTS prime_pick_rank INTEGER;
ALTER TABLE weekly_scout ADD COLUMN IF NOT EXISTS form_score_7d NUMERIC;
ALTER TABLE weekly_scout ADD COLUMN IF NOT EXISTS form_score_30d NUMERIC;
ALTER TABLE weekly_scout ADD COLUMN IF NOT EXISTS value_percent NUMERIC;
ALTER TABLE weekly_scout ADD COLUMN IF NOT EXISTS is_prime_pick BOOLEAN DEFAULT FALSE;
ALTER TABLE weekly_scout ADD COLUMN IF NOT EXISTS result_payout NUMERIC DEFAULT 0;
ALTER TABLE weekly_scout ADD COLUMN IF NOT EXISTS net_result NUMERIC DEFAULT 0;
ALTER TABLE weekly_scout ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending';

-- 2. FIX/CREATE SATURDAY_PICKS -> Just creating it as a copy of daily_picks is easiest if it doesn't exist
CREATE TABLE IF NOT EXISTS saturday_picks (LIKE daily_picks INCLUDING ALL);

-- If it already existed but was missing columns, let's patch it too:
ALTER TABLE saturday_picks ADD COLUMN IF NOT EXISTS ai_analysis JSONB;
ALTER TABLE saturday_picks ADD COLUMN IF NOT EXISTS ai_score NUMERIC;
ALTER TABLE saturday_picks ADD COLUMN IF NOT EXISTS final_output_message TEXT;
ALTER TABLE saturday_picks ADD COLUMN IF NOT EXISTS prime_pick_rank INTEGER;
ALTER TABLE saturday_picks ADD COLUMN IF NOT EXISTS form_score_7d NUMERIC;
ALTER TABLE saturday_picks ADD COLUMN IF NOT EXISTS form_score_30d NUMERIC;
ALTER TABLE saturday_picks ADD COLUMN IF NOT EXISTS value_percent NUMERIC;
ALTER TABLE saturday_picks ADD COLUMN IF NOT EXISTS is_prime_pick BOOLEAN DEFAULT FALSE;
ALTER TABLE saturday_picks ADD COLUMN IF NOT EXISTS result_payout NUMERIC DEFAULT 0;
ALTER TABLE saturday_picks ADD COLUMN IF NOT EXISTS net_result NUMERIC DEFAULT 0;
ALTER TABLE saturday_picks ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending';

-- Enable Row Level Security (RLS) just in case
ALTER TABLE weekly_scout ENABLE ROW LEVEL SECURITY;
ALTER TABLE saturday_picks ENABLE ROW LEVEL SECURITY;

-- Allow public read access (same as daily_picks)
CREATE POLICY "Weekly picks are viewable by everyone." ON weekly_scout FOR SELECT USING (true);
CREATE POLICY "Saturday picks are viewable by everyone." ON saturday_picks FOR SELECT USING (true);

-- Allow Service Role (n8n) to write
CREATE POLICY "Service Role can manage weekly" ON weekly_scout FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service Role can manage saturday" ON saturday_picks FOR ALL USING (auth.role() = 'service_role');
