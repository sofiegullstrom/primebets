-- Fix for Admin Access Issue
-- This allows users to verify their admin status and admins to manage other users.

-- Ensure RLS is enabled
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 1. Allow users to read their own profile 
-- (Critical for UserDropdown.tsx to check 'role'. Without this, 'isAdmin' is always false for non-hardcoded users)
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
CREATE POLICY "Users can view own profile"
ON profiles FOR SELECT
TO authenticated
USING ( auth.uid() = id );

-- 2. Allow Admins to view ALL profiles 
-- (Critical for AdminPage.tsx to list users)
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
CREATE POLICY "Admins can view all profiles"
ON profiles FOR SELECT
TO authenticated
USING (
  -- Check if user is admin in their own profile
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
  -- OR hardcoded backup for specific emails (Sofie)
  OR auth.jwt() ->> 'email' IN ('sofie.g63@outlook.com', 'primebets.se@gmail.com')
);

-- 3. Allow Admins to update profiles 
-- (Critical for 'Make Admin', 'Block User' etc)
DROP POLICY IF EXISTS "Admins can update profiles" ON profiles;
CREATE POLICY "Admins can update profiles"
ON profiles FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
  OR auth.jwt() ->> 'email' IN ('sofie.g63@outlook.com', 'primebets.se@gmail.com')
);
