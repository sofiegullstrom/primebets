-- Create calendar_events table if it doesn't exist
CREATE TABLE IF NOT EXISTS calendar_events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT now(),
    race_date DATE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    detailed_description TEXT,
    motivation TEXT,
    replace_primepick BOOLEAN DEFAULT FALSE,
    type TEXT DEFAULT 'info' -- 'info', 'warning', 'promotion'
);

-- Enable RLS
ALTER TABLE calendar_events ENABLE ROW LEVEL SECURITY;

-- Policies for calendar_events
DROP POLICY IF EXISTS "Public can view calendar_events" ON calendar_events;
CREATE POLICY "Public can view calendar_events"
ON calendar_events FOR SELECT
TO public
USING (true);

DROP POLICY IF EXISTS "Admins can manage calendar_events" ON calendar_events;
CREATE POLICY "Admins can manage calendar_events"
ON calendar_events FOR ALL
TO authenticated
USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
    OR auth.jwt() ->> 'email' IN ('sofie.g63@outlook.com', 'primebets.se@gmail.com')
);

-- Ensure other tables have correct RLS for Admins (Just in case)
---- Daily Picks
DROP POLICY IF EXISTS "Admins can manage daily_picks" ON daily_picks;
CREATE POLICY "Admins can manage daily_picks"
ON daily_picks FOR ALL
TO authenticated
USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
    OR auth.jwt() ->> 'email' IN ('sofie.g63@outlook.com', 'primebets.se@gmail.com')
);

---- Weekly Scout
DROP POLICY IF EXISTS "Admins can manage weekly_scout" ON weekly_scout;
CREATE POLICY "Admins can manage weekly_scout"
ON weekly_scout FOR ALL
TO authenticated
USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
    OR auth.jwt() ->> 'email' IN ('sofie.g63@outlook.com', 'primebets.se@gmail.com')
);

---- Saturday Picks
DROP POLICY IF EXISTS "Admins can manage saturday_picks" ON saturday_picks;
CREATE POLICY "Admins can manage saturday_picks"
ON saturday_picks FOR ALL
TO authenticated
USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
    OR auth.jwt() ->> 'email' IN ('sofie.g63@outlook.com', 'primebets.se@gmail.com')
);
