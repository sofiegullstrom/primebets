-- Create a table for public profiles
create table profiles (
  id uuid references auth.users not null primary key,
  updated_at timestamp with time zone,
  username text unique,
  full_name text,
  avatar_url text,
  website text,
  subscription_tier text check (subscription_tier in ('free', 'premium')) default 'free',

  constraint username_length check (char_length(username) >= 3)
);

-- Set up Row Level Security (RLS)
alter table profiles enable row level security;

create policy "Public profiles are viewable by everyone." on profiles
  for select using (true);

create policy "Users can insert their own profile." on profiles
  for insert with check (auth.uid() = id);

create policy "Users can update own profile." on profiles
  for update using (auth.uid() = id);

-- Create a table for Daily Picks
create table daily_picks (
  id text primary key, -- This MUST match the Google Sheet UUID (can be text now)
  race_date date not null,
  track_name text not null, -- 'bana'
  race_number integer not null, -- 'lopp'
  horse_name text not null, -- 'hast' (mapped from 'sektion' or separate col?)
  odds decimal(5, 2), -- 'odds'
  bet_type text, -- 'spelform'
  adam_notes text, -- 'motivering'
  
  -- New Columns for Cody Spec
  distance text, -- 'distans'
  start_method text, -- 'startform'
  start_lane integer, -- 'startspar'
  bookmaker text, -- 'spelbolag'
  interview_info text, -- 'intervju information'
  statistics text, -- 'statistik'
  expected_odds decimal(5, 2), -- 'forvantat odds'
  value_percent decimal(5, 2), -- 'spelvarde %'
  
  -- Results & Stats
  status text check (status in ('pending', 'won', 'lost', 'void')) default 'pending',
  result_payout decimal(10, 2) default 0, -- 'resultat'
  net_result decimal(10, 2) default 0, -- 'netto'
  yesterday_result decimal(10, 2), -- 'gardagens resultat'
  
  -- AI & Ranking
  ai_score decimal(5, 2), -- 'AI_score'
  prime_pick_rank integer, -- 'PrimePick_rank'
  form_score_7d decimal(5, 2), -- '7day_form_score'
  form_score_30d decimal(5, 2), -- '30day_form_score'
  final_output_message text, -- 'final_output_message'
  
  -- Legacy/Flexible
  ai_analysis jsonb,
  
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on daily_picks
alter table daily_picks enable row level security;

-- Policy: Everyone (or just auth users) can read picks
create policy "Daily picks are viewable by everyone." on daily_picks
  for select using (true);

-- Policy: Only Service Role can insert/update (for n8n)
create policy "Service Role can manage picks" on daily_picks
    for all
    using ( auth.role() = 'service_role' );

-- Function to handle new user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger the function every time a user is created
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
