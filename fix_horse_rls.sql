-- Enable RLS on horse_info if not already enabled
ALTER TABLE horse_info ENABLE ROW LEVEL SECURITY;

-- 1. Policy for Reading (SELECT): Only Admins
CREATE POLICY "Allow Admins to View Horses"
ON horse_info
FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    )
);

-- 2. Policy for Inserting (INSERT): Only Admins
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

-- 3. Policy for Updating (UPDATE): Only Admins
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

-- 4. Policy for Deleting (DELETE): Only Admins
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
