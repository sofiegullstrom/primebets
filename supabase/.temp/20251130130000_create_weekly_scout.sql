-- Create weekly_scout table
create table if not exists public.weekly_scout (
    id uuid primary key default gen_random_uuid(),
    race_date text not null,
    track_name text,
    race_number integer,
    horse_name text not null,
    odds numeric,
    bet_type text,
    adam_notes text,
    distance text,
    start_method text,
    start_lane integer,
    bookmaker text,
    interview_info text,
    statistics text,
    expected_odds numeric,
    value_percent numeric,
    ai_score numeric,
    final_output_message text,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

-- Enable RLS
alter table public.weekly_scout enable row level security;

-- Policy: Allow authenticated users to read
create policy "Allow authenticated read access"
    on public.weekly_scout
    for select
    to authenticated
    using (true);

-- Policy: Allow service role full access
create policy "Allow service role full access"
    on public.weekly_scout
    for all
    to service_role
    using (true);
