-- Remove strict status constraints to allow manual entry of Swedish terms (e.g. 'öppen', 'vinst', 'förlust')

ALTER TABLE daily_picks DROP CONSTRAINT IF EXISTS daily_picks_status_check;
ALTER TABLE saturday_picks DROP CONSTRAINT IF EXISTS saturday_picks_status_check;
ALTER TABLE weekly_scout DROP CONSTRAINT IF EXISTS weekly_scout_status_check;

-- Optional: Add a comment to guide users
COMMENT ON COLUMN daily_picks.status IS 'Status of the bet. Recommended: pending/won/lost OR öppen/vinst/förlust';
