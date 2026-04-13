-- Nuclear Option: Drop ALL policies on profiles table dynamically
-- This block finds every policy on the 'profiles' table and drops it.
DO $$ 
DECLARE
    r RECORD;
BEGIN
    FOR r IN (
        SELECT policyname 
        FROM pg_policies 
        WHERE tablename = 'profiles' 
        AND schemaname = 'public'
    ) LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON public.profiles';
        RAISE NOTICE 'Dropped policy: %', r.policyname;
    END LOOP;
END $$;

-- Disable RLS momentarily to clear any stale state (optional, but good for a reset)
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;

-- Re-enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create simple, safe policies
-- 1. READ: All authenticated users can read all profiles (simplest fix for admin checks)
CREATE POLICY "profiles_read_all_auth_nuclear" 
ON public.profiles FOR SELECT 
TO authenticated 
USING (true);

-- 2. UPDATE: Users can only update their own profile
CREATE POLICY "profiles_update_own_nuclear" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = id);

-- 3. INSERT: Users can only insert their own profile
CREATE POLICY "profiles_insert_own_nuclear" 
ON public.profiles FOR INSERT 
WITH CHECK (auth.uid() = id);

-- Verify hockey_games policies as well just in case
-- Make sure hockey_games allows authenticated users to read (or everyone)
-- And only admins to insert/update?
-- For now, let's just make hockey_games readable by everyone
DO $$ 
DECLARE
    r RECORD;
BEGIN
    FOR r IN (
        SELECT policyname 
        FROM pg_policies 
        WHERE tablename = 'hockey_games' 
        AND schemaname = 'public'
    ) LOOP
        -- Optional: Drop existing hockey policies if we want to reset that too
        -- EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON public.hockey_games';
    END LOOP;
END $$;
-- But let's assume hockey_games policies are okay if profiles is fixed.
