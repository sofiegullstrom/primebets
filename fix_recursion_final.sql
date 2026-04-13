-- Drop the problematic policies causing recursion
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;

-- Create a cleaner, non-recursive policy structure

-- 1. Users can always view their own profile
CREATE POLICY "Users can view own profile" 
ON profiles FOR SELECT 
USING (auth.uid() = id);

-- 2. Users can update their own profile
CREATE POLICY "Users can update own profile" 
ON profiles FOR UPDATE 
USING (auth.uid() = id);

-- 3. Allow public read access to specific columns if needed (like nickname/avatar)
-- Or just allow authenticated users to view profiles (often needed for joins)
CREATE POLICY "Authenticated users can view profiles" 
ON profiles FOR SELECT 
TO authenticated 
USING (true);

-- 4. Service role (admin scripts/edge functions) always has access via bypass rls, 
-- but we can add an explicit admin policy if you use client-side admin logic
-- CAUTION: Avoid checking "role" in the profile table itself inside the policy for the profile table if it causes recursion
-- A better way for admin check is usually via App Metadata (claims) or a separate admin table, 
-- but for now, the "Authenticated users can view profiles" covers the read need for admins.

-- Fix for infinite recursion often involves ensuring we don't select from the same table in the USING clause 
-- in a way that triggers the policy again. 
-- The simple "true" for authenticated select is safe.
