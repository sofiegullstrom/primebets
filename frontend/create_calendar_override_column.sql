-- Add column to allow calendar events to override the daily PrimePick
ALTER TABLE calendar_events 
ADD COLUMN IF NOT EXISTS replace_primepick BOOLEAN DEFAULT FALSE;

-- Update the comment to explain usage
COMMENT ON COLUMN calendar_events.replace_primepick IS 'If true, this event will be shown on the dashboard instead of the daily PrimePick (e.g., for cancellations or special notices).';
