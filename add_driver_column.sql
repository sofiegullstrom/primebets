-- Add driver column to daily_picks if it doesn't exist
ALTER TABLE daily_picks ADD COLUMN IF NOT EXISTS driver TEXT;

-- Add driver column to saturday_picks if it doesn't exist
ALTER TABLE saturday_picks ADD COLUMN IF NOT EXISTS driver TEXT;

-- We don't strictly need a 'status' constraint update if it is just TEXT, 
-- but good to know we will use: 'pending', 'draft', 'won', 'lost', 'void'.
