-- Run this in Supabase SQL Editor to create custom Views with your preferred column order.
-- You can then use these Views in the Table Editor to see data in this specific order.

-- 1. ORDERED VIEW FOR DAGENS PRIMEPICK (daily_picks)
CREATE OR REPLACE VIEW view_dagens_primepick_koll AS
SELECT
    race_date,
    horse_name,
    -- Requested Order being kept together:
    odds,
    status,
    result_payout,
    net_result,
    stake,
    -- Other useful columns after:
    prime_pick_rank,
    final_output_message,
    track_name,
    race_number,
    bet_type,
    start_method,
    start_time,
    value_percent,
    ai_score,
    id -- keeping ID last or accessible
FROM daily_picks;

-- 2. ORDERED VIEW FOR LÖRDAGENS SPEL (saturday_picks)
CREATE OR REPLACE VIEW view_lordagens_spel_koll AS
SELECT
    race_date,
    horse_name,
    -- Requested Order being kept together:
    odds,
    status,
    result_payout,
    net_result,
    stake,
    -- Other useful columns after:
    final_output_message,
    track_name,
    race_number,
    bet_type,
    start_method,
    value_percent,
    ai_score,
    id
FROM saturday_picks;
