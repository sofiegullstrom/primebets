-- Force set today's pick as PrimePick so the notification can be tested.
-- Also resets 'notified' flag in case it was already triggered.

UPDATE daily_picks
SET prime_pick_rank = 1, notified = false
WHERE race_date = '2026-01-21' AND horse_name = 'Miss Lynx';

-- Also ensure duplication deletion (from previous step) if not already run
DELETE FROM calendar_events 
WHERE id = '6540a773-5984-4274-a2f9-7abc1a97fc8a';
