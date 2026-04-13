-- Add 'value' column to daily_picks and saturday_picks
ALTER TABLE daily_picks ADD COLUMN IF NOT EXISTS value TEXT;
ALTER TABLE saturday_picks ADD COLUMN IF NOT EXISTS value TEXT;

-- Ensure 'driver' column exists (just in case)
ALTER TABLE daily_picks ADD COLUMN IF NOT EXISTS driver TEXT;
ALTER TABLE saturday_picks ADD COLUMN IF NOT EXISTS driver TEXT;
