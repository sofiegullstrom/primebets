
-- Create a secure function to check admin status without triggering RLS recursion
CREATE OR REPLACE FUNCTION public.check_is_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER -- This is the key: it runs with the privileges of the creator (postgres), bypassing RLS
SET search_path = public -- Secure search path
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM profiles 
    WHERE id = auth.uid() 
    AND role = 'admin'
  );
END;
$$;

-- Grant execution to authenticated users
GRANT EXECUTE ON FUNCTION public.check_is_admin TO authenticated;
GRANT EXECUTE ON FUNCTION public.check_is_admin TO anon; -- Maybe needed if we check it in anon policies (though we shouldn't)

-- Update calendar_events policies to use the function
DROP POLICY IF EXISTS "Admins can manage calendar_events" ON calendar_events;

CREATE POLICY "Admins can manage calendar_events"
ON calendar_events FOR ALL
TO authenticated
USING (
    check_is_admin()
    OR auth.jwt() ->> 'email' IN ('sofie.g63@outlook.com', 'primebets.se@gmail.com')
);

-- Note: "Public can view calendar_events" is already fine as USING (true).

-- Also fix profiles policy if it exists and is recursive
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
-- Create a safe admin view policy if needed
CREATE POLICY "Admins can view all profiles"
ON profiles FOR SELECT
TO authenticated
USING (
    check_is_admin() -- Uses the security definer function, avoids recursion
);
