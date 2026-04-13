-- Forcefully drop all existing profile policies to ensure a clean slate
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Authenticated users can view profiles" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Enable read access for all authenticated users" ON profiles;

-- Create simple, non-recursive policies
-- 1. READ: All authenticated users can read all profiles (simplest fix for admin checks)
CREATE POLICY "profiles_read_all_auth" 
ON profiles FOR SELECT 
TO authenticated 
USING (true);

-- 2. UPDATE: Users can only update their own profile
CREATE POLICY "profiles_update_own" 
ON profiles FOR UPDATE 
USING (auth.uid() = id);

-- 3. INSERT: Users can only insert their own profile
CREATE POLICY "profiles_insert_own" 
ON profiles FOR INSERT 
WITH CHECK (auth.uid() = id);
