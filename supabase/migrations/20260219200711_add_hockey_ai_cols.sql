-- Create an enum for the source of the pick
CREATE TYPE pick_source_type AS ENUM ('human', 'ai');

-- Add new columns to hockey_games table
ALTER TABLE hockey_games
ADD COLUMN IF NOT EXISTS source pick_source_type DEFAULT 'human',
ADD COLUMN IF NOT EXISTS external_id TEXT, -- ID from The Odds API / API-Sports
ADD COLUMN IF NOT EXISTS ai_confidence INTEGER CHECK (ai_confidence >= 0 AND ai_confidence <= 100),
ADD COLUMN IF NOT EXISTS raw_api_data JSONB; -- Store full API response for future training

-- Make sure RLS policies allow reading these new columns (usually handled by existing SELECT * policies, but good to double check)
-- No changes needed if policy is "true" for authenticated users.

-- Create an index on external_id for faster lookups when syncing
CREATE INDEX IF NOT EXISTS idx_hockey_games_external_id ON hockey_games(external_id);
