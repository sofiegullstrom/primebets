-- Void the race for "Princess Märtha"
-- We assume it is for today or recent (no date check needed if name is unique enough for 'pending' items, but adding date check is safer)

UPDATE daily_picks
SET 
    status = 'struken',
    net_result = 0
WHERE 
    horse_name ILIKE '%Princess Märtha%'
    AND (status = 'pending' OR status IS NULL);
