
-- Add optional betting details to calendar_events for flexible display
ALTER TABLE calendar_events 
ADD COLUMN IF NOT EXISTS horse_name TEXT,
ADD COLUMN IF NOT EXISTS driver TEXT,
ADD COLUMN IF NOT EXISTS odds NUMERIC,
ADD COLUMN IF NOT EXISTS stake TEXT;
