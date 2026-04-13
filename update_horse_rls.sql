-- Allow Admins to manage 'horse_info'

-- Drop existing restricted policy if it conflicts or just add new one
DROP POLICY IF EXISTS "Admin full access" ON horse_info;

CREATE POLICY "Admin full access" ON horse_info
    FOR ALL
    USING (
        auth.role() = 'service_role' OR
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );
