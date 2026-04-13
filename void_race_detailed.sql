-- Void the race for "Princess Märtha" with new text
UPDATE daily_picks
SET 
    status = 'struken',
    net_result = 0,
    final_output_message = 'På grund av skada så kom hästen aldrig fram till start. Man blir återbetalad för sin insats.'
WHERE 
    horse_name ILIKE '%Princess Märtha%';
