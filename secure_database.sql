-- SECURITY HARDENING SCRIPT
-- Run this in the Supabase SQL Editor to ensure all tables are secure.

-- 1. DAILY PICKS
ALTER TABLE daily_picks ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Daily picks are viewable by everyone." ON daily_picks;
DROP POLICY IF EXISTS "Service Role can manage picks" ON daily_picks;
-- Re-create safe policies
CREATE POLICY "Public Read Access" ON daily_picks FOR SELECT USING (true);
CREATE POLICY "Service Role Full Access" ON daily_picks FOR ALL USING (auth.role() = 'service_role');

-- 2. SATURDAY PICKS
ALTER TABLE saturday_picks ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Saturday picks are viewable by everyone." ON saturday_picks;
DROP POLICY IF EXISTS "Service Role can manage saturday" ON saturday_picks;
-- Re-create safe policies
CREATE POLICY "Public Read Access" ON saturday_picks FOR SELECT USING (true);
CREATE POLICY "Service Role Full Access" ON saturday_picks FOR ALL USING (auth.role() = 'service_role');

-- 3. WEEKLY SCOUT
ALTER TABLE weekly_scout ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Weekly picks are viewable by everyone." ON weekly_scout;
DROP POLICY IF EXISTS "Service Role can manage weekly" ON weekly_scout;
DROP POLICY IF EXISTS "Allow authenticated read access" ON weekly_scout; -- removing old duplicates
DROP POLICY IF EXISTS "Allow service role full access" ON weekly_scout; -- removing old duplicates
-- Re-create safe policies
CREATE POLICY "Public Read Access" ON weekly_scout FOR SELECT USING (true);
CREATE POLICY "Service Role Full Access" ON weekly_scout FOR ALL USING (auth.role() = 'service_role');

-- 4. CALENDAR EVENTS
ALTER TABLE calendar_events ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable read access for all users" ON calendar_events;
-- Re-create safe policies
CREATE POLICY "Public Read Access" ON calendar_events FOR SELECT USING (true);
CREATE POLICY "Service Role Full Access" ON calendar_events FOR ALL USING (auth.role() = 'service_role');

-- 5. PROFILES
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile." ON profiles;
DROP POLICY IF EXISTS "Users can update own profile." ON profiles;
-- Re-create safe policies
CREATE POLICY "Public Read Access" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users allow insert own" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users allow update own" ON profiles FOR UPDATE USING (auth.uid() = id);
-- Note: Profiles are usually managed by the `handle_new_user` trigger, but manual updates by users are allowed here.

-- 6. AUDIT: REVOKE write access from 'anon' and 'authenticated' on critical tables just in case default privileges were changed
REVOKE INSERT, UPDATE, DELETE ON daily_picks FROM anon, authenticated;
REVOKE INSERT, UPDATE, DELETE ON saturday_picks FROM anon, authenticated;
REVOKE INSERT, UPDATE, DELETE ON weekly_scout FROM anon, authenticated;
REVOKE INSERT, UPDATE, DELETE ON calendar_events FROM anon, authenticated;
-- Profiles needs update access for 'authenticated', so we skip revoking UPDATE/INSERT there for them (handled by policies)
