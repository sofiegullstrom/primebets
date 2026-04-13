-- HEALTH CHECK & FIX MIGRATION
-- Runs safely to ensure all necessary columns exist for the features to work.

-- 1. Daily Picks - AI & Notifications
ALTER TABLE daily_picks ADD COLUMN IF NOT EXISTS notified BOOLEAN DEFAULT FALSE;
ALTER TABLE daily_picks ADD COLUMN IF NOT EXISTS ai_analysis JSONB; -- Stores the full AI object
ALTER TABLE daily_picks ADD COLUMN IF NOT EXISTS final_output_message TEXT; -- Stores the generated text
ALTER TABLE daily_picks ADD COLUMN IF NOT EXISTS ai_score NUMERIC;

-- 2. Profiles - Ensure columns for Admin View exist
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS subscription_tier TEXT DEFAULT 'free';
-- (role column usually exists, but good to be sure if using standard auth, though usually in auth.users or profiles depending on setup. 
-- In this project we use 'profiles.role')
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user';

-- 3. Subscribers - Ensure consent tracking
ALTER TABLE subscribers ADD COLUMN IF NOT EXISTS consent_given BOOLEAN DEFAULT FALSE;
