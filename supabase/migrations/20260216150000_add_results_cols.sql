-- Add betting result columns to hockey_games and calendar_events
-- This allows them to be included in the global stats calculation (ROI, Win Rate, etc.)

-- 1. Hockey Games
ALTER TABLE hockey_games 
ADD COLUMN IF NOT EXISTS net_result NUMERIC DEFAULT NULL, -- Positive for win, negative for loss, 0 for void
ADD COLUMN IF NOT EXISTS result_status TEXT DEFAULT NULL; -- 'won', 'lost', 'void'

-- 2. Calendar Events (For Longterm Bets & Big Races)
ALTER TABLE calendar_events 
ADD COLUMN IF NOT EXISTS net_result NUMERIC DEFAULT NULL,
ADD COLUMN IF NOT EXISTS result_status TEXT DEFAULT NULL,
ADD COLUMN IF NOT EXISTS odds NUMERIC DEFAULT NULL, -- Should exist based on AdminForm, but good to ensure
ADD COLUMN IF NOT EXISTS stake TEXT DEFAULT NULL,
ADD COLUMN IF NOT EXISTS horse_name TEXT DEFAULT NULL,
ADD COLUMN IF NOT EXISTS driver TEXT DEFAULT NULL,
ADD COLUMN IF NOT EXISTS location TEXT DEFAULT NULL; -- For track name mapping

-- Policy update might be needed if not 'public' by default, 
-- but usually ADD COLUMN doesn't break existing SELECT policies if they use defined columns or *.
