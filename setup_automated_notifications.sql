
-- 1. Add the 'notified' column to prevent duplicates
ALTER TABLE daily_picks ADD COLUMN IF NOT EXISTS notified BOOLEAN DEFAULT FALSE;

-- 2. Create the Trigger Function
-- This special function runs inside the database and calls our Edge Function
CREATE OR REPLACE FUNCTION trigger_notify_subscribers()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if it's a PrimePick (Rank 1) AND we haven't notified yet
  IF (NEW.prime_pick_rank = 1 AND NEW.notified = FALSE) THEN
    
    -- Call the Edge Function (fire and forget)
    -- We use net.http_post (standard Supabase extension)
    PERFORM net.http_post(
      url := 'https://aaczctiwtdyxcxxxhkcm.supabase.co/functions/v1/notify-subscribers',
      headers := '{"Content-Type": "application/json"}'::jsonb,
      body := '{}'::jsonb
    );
    
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Create the Trigger
DROP TRIGGER IF EXISTS on_primepick_update ON daily_picks;
CREATE TRIGGER on_primepick_update
AFTER INSERT OR UPDATE
ON daily_picks
FOR EACH ROW
EXECUTE FUNCTION trigger_notify_subscribers();
