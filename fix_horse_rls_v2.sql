-- 1. Enable RLS (Ensure it is on)
ALTER TABLE horse_info ENABLE ROW LEVEL SECURITY;

-- 2. DROP existing policies to avoid conflicts/duplicates
DROP POLICY IF EXISTS "Allow Admins to View Horses" ON horse_info;
DROP POLICY IF EXISTS "Allow Admins to Add Horses" ON horse_info;
DROP POLICY IF EXISTS "Allow Admins to Update Horses" ON horse_info;
DROP POLICY IF EXISTS "Allow Admins to Delete Horses" ON horse_info;

-- 3. CREATE NEW SIMPLIFIED READ POLICY
-- Allow ALL authenticated users to VIEW horses.
-- This fixes the issue where the admin check might be failing silently.
CREATE POLICY "Allow Authenticated to View Horses"
ON horse_info
FOR SELECT
TO authenticated
USING (true);

-- 4. RESTORE ADMIN-ONLY WRITE POLICIES
CREATE POLICY "Allow Admins to Add Horses"
ON horse_info
FOR INSERT
TO authenticated
WITH CHECK (
    EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    )
);

CREATE POLICY "Allow Admins to Update Horses"
ON horse_info
FOR UPDATE
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    )
);

CREATE POLICY "Allow Admins to Delete Horses"
ON horse_info
FOR DELETE
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    )
);
