
-- Function to ingest Daily Picks (Dagens)
CREATE OR REPLACE FUNCTION ingest_daily_picks(p_data jsonb)
RETURNS jsonb
LANGUAGE plpgsql
AS $$
DECLARE
    item jsonb;
    v_inserted_count int := 0;
BEGIN
    FOR item IN SELECT * FROM jsonb_array_elements(p_data)
    LOOP
        INSERT INTO daily_picks (
            id, -- Optional if we trust the sheet UUID
            race_date,
            horse_name,
            track_name,
            race_number,
            bet_type,
            odds,
            stake,
            equipment,
            interview_info,
            adam_notes,
            start_method,
            distance,
            bookmaker
        ) VALUES (
            COALESCE((item->>'uuid')::text, (item->>'id')::text, gen_random_uuid()::text),
            (item->>'Datum')::date,
            item->>'Häst',
            item->>'Bana',
            (item->>'Lopp')::int,
            item->>'Spelform',
            (item->>'Odds')::numeric,
            COALESCE(item->>'Insats', item->>'stake'), -- Handle both mapped and raw
            item->>'Utrostning',
            COALESCE(item->>'Intervju', item->>'interview_info'),
            COALESCE(item->>'Analys', item->>'Motivering'), -- Map analysis to adam_notes
            item->>'Startmetod',
            item->>'Distans',
            item->>'Spelbolag'
        )
        ON CONFLICT (id) DO UPDATE SET
            race_date = EXCLUDED.race_date,
            horse_name = EXCLUDED.horse_name,
            track_name = EXCLUDED.track_name,
            race_number = EXCLUDED.race_number,
            bet_type = EXCLUDED.bet_type,
            odds = EXCLUDED.odds,
            stake = EXCLUDED.stake,
            equipment = EXCLUDED.equipment,
            interview_info = EXCLUDED.interview_info,
            adam_notes = EXCLUDED.adam_notes,
            start_method = EXCLUDED.start_method,
            distance = EXCLUDED.distance,
            bookmaker = EXCLUDED.bookmaker,
            updated_at = NOW();
            
        v_inserted_count := v_inserted_count + 1;
    END LOOP;
    
    RETURN jsonb_build_object('status', 'success', 'inserted', v_inserted_count);
END;
$$;

-- Function to ingest Saturday Picks (Lördagens)
CREATE OR REPLACE FUNCTION ingest_saturday_picks(p_data jsonb)
RETURNS jsonb
LANGUAGE plpgsql
AS $$
DECLARE
    item jsonb;
    v_inserted_count int := 0;
BEGIN
    FOR item IN SELECT * FROM jsonb_array_elements(p_data)
    LOOP
        INSERT INTO saturday_picks (
            id,
            race_date,
            horse_name,
            track_name,
            race_number,
            bet_type,
            odds,
            stake,
            equipment,
            interview_info,
            adam_notes,
            start_method,
            distance,
            bookmaker
        ) VALUES (
            COALESCE((item->>'uuid')::text, (item->>'id')::text, gen_random_uuid()::text),
            (item->>'Datum')::date,
            item->>'Häst',
            item->>'Bana',
            (item->>'Lopp')::int,
            item->>'Spelform',
            (item->>'Odds')::numeric,
            COALESCE(item->>'Insats', item->>'stake'),
            item->>'Utrostning',
            COALESCE(item->>'Intervju', item->>'interview_info'),
            COALESCE(item->>'Analys', item->>'Motivering'),
            item->>'Startmetod',
            item->>'Distans',
            item->>'Spelbolag'
        )
        ON CONFLICT (id) DO UPDATE SET
            equipment = EXCLUDED.equipment,
            stake = EXCLUDED.stake,
            interview_info = EXCLUDED.interview_info,
            adam_notes = EXCLUDED.adam_notes,
            odds = EXCLUDED.odds,
            updated_at = NOW();
            
        v_inserted_count := v_inserted_count + 1;
    END LOOP;
    
    RETURN jsonb_build_object('status', 'success', 'inserted', v_inserted_count);
END;
$$;

-- Function to ingest Weekly Scout (Veckans Spaning)
CREATE OR REPLACE FUNCTION ingest_weekly_scout(p_data jsonb)
RETURNS jsonb
LANGUAGE plpgsql
AS $$
DECLARE
    item jsonb;
    v_inserted_count int := 0;
BEGIN
    FOR item IN SELECT * FROM jsonb_array_elements(p_data)
    LOOP
        INSERT INTO weekly_scout (
            id,
            race_date,
            horse_name,
            track_name,
            race_number,
            bet_type,
            odds,
            stake,
            equipment,
            interview_info,
            adam_notes,
            start_method,
            distance,
            bookmaker
        ) VALUES (
            COALESCE((item->>'uuid')::text, (item->>'id')::text, gen_random_uuid()::text),
            (item->>'Datum')::date,
            item->>'Häst',
            item->>'Bana',
            (item->>'Lopp')::int,
            item->>'Spelform',
            (item->>'Odds')::numeric,
            COALESCE(item->>'Insats', item->>'stake'),
            item->>'Utrostning',
            COALESCE(item->>'Intervju', item->>'interview_info'),
            COALESCE(item->>'Analys', item->>'Motivering'),
            item->>'Startmetod',
            item->>'Distans',
            item->>'Spelbolag'
        )
        ON CONFLICT (id) DO UPDATE SET
            equipment = EXCLUDED.equipment,
            stake = EXCLUDED.stake,
            interview_info = EXCLUDED.interview_info,
            adam_notes = EXCLUDED.adam_notes,
            odds = EXCLUDED.odds,
            updated_at = NOW();
            
        v_inserted_count := v_inserted_count + 1;
    END LOOP;
    
    RETURN jsonb_build_object('status', 'success', 'inserted', v_inserted_count);
END;
$$;

-- Ensure unique constraint for calendar events to handle duplicates
CREATE UNIQUE INDEX IF NOT EXISTS idx_calendar_events_unique ON calendar_events (race_date, title);

-- Function to ingest Calendar Events
CREATE OR REPLACE FUNCTION ingest_calendar_events(p_data jsonb)
RETURNS jsonb
LANGUAGE plpgsql
AS $$
DECLARE
    item jsonb;
    v_inserted_count int := 0;
BEGIN
    FOR item IN SELECT * FROM jsonb_array_elements(p_data)
    LOOP
        INSERT INTO calendar_events (
            race_date,
            title,
            type,
            description,
            status,
            priority,
            bet_type,
            risk_level,
            comment,
            is_visible,
            detailed_description,
            motivation
        ) VALUES (
            (item->>'Datum')::date,
            item->>'Titel',
            item->>'Typ',
            item->>'Beskrivning',
            item->>'Status',
            item->>'Prioritet',
            item->>'Spelform',
            item->>'Risknivå',
            item->>'Kommentar',
            COALESCE((item->>'Synlig på sida')::boolean, true),
            item->>'Fördjupad beskrivning',
            item->>'Motivering'
        )
        -- Can't rely on UUID from sheet for calendar usually, so maybe upsert on date+title constraint?
        -- For now, simple insert or if we add a constraint.
        -- Let's assume title+date is unique enough for conflict if we had a constraint.
        -- Since we just created the table without unique constraints besides ID, we will just insert.
        -- To prevent dupes, we might want to check existence.
        ON CONFLICT DO NOTHING;
            
        v_inserted_count := v_inserted_count + 1;
    END LOOP;
    
    RETURN jsonb_build_object('status', 'success', 'inserted', v_inserted_count);
END;
$$;

-- Generic ingest_picks wrapper if they use that name
CREATE OR REPLACE FUNCTION ingest_picks(p_data jsonb)
RETURNS jsonb
LANGUAGE plpgsql
AS $$
BEGIN
    -- This defaults to daily picks if used generically, or could try to detect.
    -- For safety, let's map it to daily_picks for now as that seems to be the main "picks".
    RETURN ingest_daily_picks(p_data);
END;
$$;
