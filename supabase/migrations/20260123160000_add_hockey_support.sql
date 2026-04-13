-- Create generic hockey_games table
CREATE TABLE IF NOT EXISTS hockey_games (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT now(),
    
    -- Core Data
    game_date DATE NOT NULL, -- Datum
    sport TEXT DEFAULT 'Hockey', -- Sport
    league TEXT NOT NULL, -- Liga
    match_name TEXT NOT NULL, -- Match (Home - Away)
    
    -- Betting Data
    bet_selection TEXT, -- Spel
    odds NUMERIC, -- Odds
    expected_odds NUMERIC, -- Förväntat odds
    value_percentage NUMERIC, -- Spelvärde %
    
    -- Content
    motivation TEXT, -- Motivering
    statistics_text TEXT, -- Statistik
    
    -- Meta
    status TEXT DEFAULT 'pending', -- 'draft', 'pending' (published)
    category TEXT DEFAULT 'daily' -- 'daily', 'upcoming'
);

-- Add sport column to calendar_events if it fits, or just use type?
-- Let's check if we can add 'sport' to calendar_events to distinguish.
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'calendar_events' AND column_name = 'sport') THEN 
        ALTER TABLE calendar_events ADD COLUMN sport TEXT DEFAULT 'Trav'; 
    END IF; 
END $$;

-- Enable RLS for hockey_games
ALTER TABLE hockey_games ENABLE ROW LEVEL SECURITY;

-- Public Read
CREATE POLICY "Public can view hockey_games"
ON hockey_games FOR SELECT
TO public
USING (true);

-- Admin Manage
CREATE POLICY "Admins can manage hockey_games"
ON hockey_games FOR ALL
TO authenticated
USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
    OR auth.jwt() ->> 'email' IN ('sofie.g63@outlook.com', 'primebets.se@gmail.com', 'adam.sundqvistt@gmail.com')
);

