
-- Add core columns if missing
ALTER TABLE calendar_events ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE calendar_events ADD COLUMN IF NOT EXISTS detailed_description TEXT;
ALTER TABLE calendar_events ADD COLUMN IF NOT EXISTS motivation TEXT;

-- Add betting columns if missing
ALTER TABLE calendar_events ADD COLUMN IF NOT EXISTS horse_name TEXT;
ALTER TABLE calendar_events ADD COLUMN IF NOT EXISTS driver TEXT;
ALTER TABLE calendar_events ADD COLUMN IF NOT EXISTS odds NUMERIC;
ALTER TABLE calendar_events ADD COLUMN IF NOT EXISTS stake TEXT;
ALTER TABLE calendar_events ADD COLUMN IF NOT EXISTS bet_type TEXT;

-- Add extra columns
ALTER TABLE calendar_events ADD COLUMN IF NOT EXISTS location TEXT DEFAULT 'Sverige';
ALTER TABLE calendar_events ADD COLUMN IF NOT EXISTS value_percentage NUMERIC;
