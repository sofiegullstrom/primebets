-- CHECK 1: Ensure daily_picks has the 'notified' column
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'daily_picks' AND column_name = 'notified') THEN 
        ALTER TABLE daily_picks ADD COLUMN notified BOOLEAN DEFAULT FALSE; 
    END IF; 
END $$;

-- CHECK 2: Ensure subscribers table exists
CREATE TABLE IF NOT EXISTS subscribers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- CHECK 3: Ensure RLS is sane on subscribers (only admins can view/manage)
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can insert subscribers" ON subscribers;
CREATE POLICY "Public can insert subscribers" ON subscribers FOR INSERT TO public WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can view subscribers" ON subscribers;
CREATE POLICY "Admins can view subscribers" ON subscribers FOR SELECT TO authenticated 
USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
    OR auth.jwt() ->> 'email' IN ('sofie.g63@outlook.com', 'primebets.se@gmail.com')
);
