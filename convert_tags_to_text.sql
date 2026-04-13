-- Ändrar kolumnerna från array (text[]) till vanlig text
-- Detta gör att man kan skriva "Stark, Snabb" istället för ["Stark", "Snabb"]

ALTER TABLE horse_info
ALTER COLUMN strength_tags TYPE text USING array_to_string(strength_tags, ', '),
ALTER COLUMN weakness_tags TYPE text USING array_to_string(weakness_tags, ', ');
