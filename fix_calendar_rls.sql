
-- Drop existing policy if it exists (to avoid errors, or just use create if not exists which pg doesn't support easily for policies)
DROP POLICY IF EXISTS "Enable read access for all users" ON calendar_events;
DROP POLICY IF EXISTS "Enable public read access" ON calendar_events;

-- Enable RLS
ALTER TABLE calendar_events ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Enable read access for all users" ON calendar_events
    FOR SELECT USING (true);

-- Ensure anon role has permissions
GRANT SELECT ON calendar_events TO anon;
GRANT SELECT ON calendar_events TO authenticated;
GRANT SELECT ON calendar_events TO service_role;
