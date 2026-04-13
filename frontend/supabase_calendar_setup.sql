
-- Create calendar_events table
CREATE TABLE IF NOT EXISTS calendar_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    race_date DATE NOT NULL,
    title TEXT NOT NULL,
    type TEXT, -- 'V75', 'V86', 'Big Slam', etc.
    description TEXT,
    status TEXT, -- 'upcoming', 'completed', etc.
    priority TEXT, -- 'high', 'medium', 'low'
    bet_type TEXT,
    risk_level TEXT,
    comment TEXT,
    is_visible BOOLEAN DEFAULT true,
    detailed_description TEXT,
    motivation TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE calendar_events ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Enable read access for all users" ON calendar_events
    FOR SELECT USING (true);

-- Create policy for service role/admin write access (standard usually allows anon if we are lax, or specific roles. For now, public read is key)
-- We will assume the ingestion script (n8n) uses the service_role key or proper auth.
