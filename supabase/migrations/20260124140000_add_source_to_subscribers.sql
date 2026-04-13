-- Add source column to subscribers table to track where they signed up (e.g., 'hockey_waitlist', 'general')
ALTER TABLE subscribers 
ADD COLUMN IF NOT EXISTS source TEXT DEFAULT 'general';

-- Optional: Create an index on source for faster filtering
CREATE INDEX IF NOT EXISTS idx_subscribers_source ON subscribers(source);
