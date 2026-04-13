-- Lägger till kolumnen 'horse_id' i alla speltabeller
-- och skapar en koppling (Foreign Key) till tabellen 'horse_info'.

-- 1. Daily Picks
ALTER TABLE daily_picks 
ADD COLUMN IF NOT EXISTS horse_id TEXT;

-- Lägg till relationen (gör att Supabase förstår kopplingen automatiskt)
ALTER TABLE daily_picks
ADD CONSTRAINT fk_daily_horse
FOREIGN KEY (horse_id) 
REFERENCES horse_info (id)
ON DELETE SET NULL; -- Om hästen tas bort, behåll spelet men nolla kopplingen


-- 2. Saturday Picks
ALTER TABLE saturday_picks 
ADD COLUMN IF NOT EXISTS horse_id TEXT;

ALTER TABLE saturday_picks
ADD CONSTRAINT fk_saturday_horse
FOREIGN KEY (horse_id) 
REFERENCES horse_info (id)
ON DELETE SET NULL;


-- 3. Weekly Scout
ALTER TABLE weekly_scout 
ADD COLUMN IF NOT EXISTS horse_id TEXT;

ALTER TABLE weekly_scout
ADD CONSTRAINT fk_weekly_horse
FOREIGN KEY (horse_id) 
REFERENCES horse_info (id)
ON DELETE SET NULL;

-- Bekräftelse
SELECT 'Horse ID columns and relations added successfully' as status;
