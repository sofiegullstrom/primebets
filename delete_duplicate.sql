-- Deletes the duplicate 'Prix D’Amerique' event
-- ID: 6540a773-5984-4274-a2f9-7abc1a97fc8a matches "Prix D’Amerique" (found via script)
-- The other event is "Prix d'Amérique 2026" (ID: 307134ef-05cd-4383-816e-111d986c0df8) which we will keep.

DELETE FROM calendar_events 
WHERE id = '6540a773-5984-4274-a2f9-7abc1a97fc8a';
