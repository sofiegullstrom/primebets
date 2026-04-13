-- Migrering för att tillåta tomma fält för flexibel inmatning
-- Kör detta script i Supabase SQL Editor.

-- 1. Daily Picks - Gör alla icke-kritiska fält valfria
ALTER TABLE daily_picks ALTER COLUMN horse_name DROP NOT NULL;
ALTER TABLE daily_picks ALTER COLUMN track_name DROP NOT NULL;
ALTER TABLE daily_picks ALTER COLUMN race_number DROP NOT NULL;
ALTER TABLE daily_picks ALTER COLUMN race_date DROP NOT NULL;
ALTER TABLE daily_picks ALTER COLUMN odds DROP NOT NULL;
ALTER TABLE daily_picks ALTER COLUMN bet_type DROP NOT NULL;
ALTER TABLE daily_picks ALTER COLUMN start_method DROP NOT NULL;
ALTER TABLE daily_picks ALTER COLUMN distance DROP NOT NULL;
ALTER TABLE daily_picks ALTER COLUMN bookmaker DROP NOT NULL;

-- 2. Saturday Picks - Samma sak
ALTER TABLE saturday_picks ALTER COLUMN horse_name DROP NOT NULL;
ALTER TABLE saturday_picks ALTER COLUMN track_name DROP NOT NULL;
ALTER TABLE saturday_picks ALTER COLUMN race_number DROP NOT NULL;
ALTER TABLE saturday_picks ALTER COLUMN race_date DROP NOT NULL;
ALTER TABLE saturday_picks ALTER COLUMN odds DROP NOT NULL;
ALTER TABLE saturday_picks ALTER COLUMN bet_type DROP NOT NULL;
ALTER TABLE saturday_picks ALTER COLUMN start_method DROP NOT NULL;
ALTER TABLE saturday_picks ALTER COLUMN distance DROP NOT NULL;
ALTER TABLE saturday_picks ALTER COLUMN bookmaker DROP NOT NULL;

-- 3. Weekly Scout - Samma sak
ALTER TABLE weekly_scout ALTER COLUMN horse_name DROP NOT NULL;
ALTER TABLE weekly_scout ALTER COLUMN track_name DROP NOT NULL;
ALTER TABLE weekly_scout ALTER COLUMN race_number DROP NOT NULL;
ALTER TABLE weekly_scout ALTER COLUMN race_date DROP NOT NULL;
ALTER TABLE weekly_scout ALTER COLUMN odds DROP NOT NULL;
ALTER TABLE weekly_scout ALTER COLUMN bet_type DROP NOT NULL;
ALTER TABLE weekly_scout ALTER COLUMN start_method DROP NOT NULL;
ALTER TABLE weekly_scout ALTER COLUMN distance DROP NOT NULL;
ALTER TABLE weekly_scout ALTER COLUMN bookmaker DROP NOT NULL;

-- Bekräftelse för loggen (valfritt)
SELECT 'Constraints relaxed successfully' as status;
