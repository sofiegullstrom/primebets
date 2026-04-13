
-- Allow public insert temporarily to fix data
CREATE POLICY "Allow public insert for dev" ON calendar_events FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Allow public update for dev" ON calendar_events FOR UPDATE TO public USING (true);
