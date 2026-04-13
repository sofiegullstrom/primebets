
-- Remove temp policies
DROP POLICY IF EXISTS "Allow public insert for dev" ON calendar_events;
DROP POLICY IF EXISTS "Allow public update for dev" ON calendar_events;
-- Revoke INSERT/UPDATE from anon (optional, but good practice to reset)
REVOKE INSERT, UPDATE ON calendar_events FROM anon;
