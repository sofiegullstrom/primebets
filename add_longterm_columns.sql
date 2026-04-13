
-- Add missing columns for Long Term Bets if they don't exist
-- We need: location, value_percent (or just value text?)
-- Image shows "Bedömt värde: +18 %". So numeric or text. Numeric is better for calculations, but text is more flexible. 
-- Let's add 'value_percentage' (numeric) and 'location' (text).

ALTER TABLE calendar_events ADD COLUMN IF NOT EXISTS location TEXT DEFAULT 'Sverige';
ALTER TABLE calendar_events ADD COLUMN IF NOT EXISTS value_percentage NUMERIC; 

-- Note: We already have 'bet_type' (Typ: Vinnare / Topp-3).

-- Also update existing check constraint for 'type' if it exists to include 'Långtidsspel'
-- (Usually constraints are not strict unless explicitly added, let's assume it's free text or check existing instructions)
