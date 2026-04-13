-- Migration to add start_time column to game tables

-- Add start_time to daily_picks
ALTER TABLE daily_picks 
ADD COLUMN IF NOT EXISTS start_time TEXT;

-- Add start_time to saturday_picks
ALTER TABLE saturday_picks 
ADD COLUMN IF NOT EXISTS start_time TEXT;

-- Add start_time to weekly_scout
ALTER TABLE weekly_scout 
ADD COLUMN IF NOT EXISTS start_time TEXT;

-- Comments for documentation (optional, supported by some tools)
COMMENT ON COLUMN daily_picks.start_time IS 'Preliminary start time of the race (e.g. 18:30)';
COMMENT ON COLUMN saturday_picks.start_time IS 'Preliminary start time of the race';
COMMENT ON COLUMN weekly_scout.start_time IS 'Preliminary start time of the race';
