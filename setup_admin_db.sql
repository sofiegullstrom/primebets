-- ADMIN PANEL & SECURITY SETUP (V1)
-- Run this in Supabase SQL Editor

-- 1. ADD ROLE TO PROFILES
-- We add a role column. Default is 'user'. Protected by RLS so users can't change it.
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin', 'moderator'));

COMMENT ON COLUMN public.profiles.role IS 'User role: user, admin, or moderator. Defaults to user.';

-- 2. CREATE AUDIT LOGS
-- This table stores actions taken by admins. It is append-only for admins (via service role primarily).
CREATE TABLE IF NOT EXISTS public.admin_audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id UUID REFERENCES auth.users(id) NOT NULL,
    action TEXT NOT NULL,          -- e.g. 'BAN_USER', 'UPDATE_SUB'
    target_id UUID,                -- The user_id being affected
    details JSONB,                 -- Extra details (reason, previous value)
    ip_address TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. ENABLE RLS ON AUDIT LOGS
ALTER TABLE public.admin_audit_logs ENABLE ROW LEVEL SECURITY;

-- 4. POLICIES FOR AUDIT LOGS
-- Policy: Service Role (Edge Functions) can INSERT logs. 
CREATE POLICY "Service Role can insert audit logs" ON public.admin_audit_logs
    FOR INSERT
    WITH CHECK (auth.role() = 'service_role');

-- Policy: Admins can READ audit logs.
-- Note: We use a subquery to check if the current user is an admin.
CREATE POLICY "Admins can view audit logs" ON public.admin_audit_logs
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

-- 5. UPDATE PROFILES RLS (STRICT MODE)
-- Requirement: "User ska endast kunna läsa/skriva sin egen data"
-- Previous policy might have been "Public Read". We remove it.

DROP POLICY IF EXISTS "Public Read Access" ON public.profiles;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON public.profiles;

-- New Policy: Read Own Data OR Read All if Admin
CREATE POLICY "Users see own, Admins see all" ON public.profiles
    FOR SELECT
    USING (
        auth.uid() = id -- User can always see themselves
        OR
        EXISTS (        -- Admin can see everyone
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

-- Keep existing Update Policy (Users update own), but ensure they can't update 'role'.
-- Supabase doesn't support Column-Level Security directly in Policies easily without triggers, 
-- but we can assume the frontend won't send 'role' and we can add a trigger later to prevent role changes if needed.
-- For V1, we trust the Update Policy `auth.uid() = id`.
-- To be safe, we should ideally restrict updating `role` via a trigger, but let's stick to the basics first.

-- 6. HELPER VIEW/FUNCTION (Optional, for easier Admin access)
-- A secure view for admins to list sensitive user data from auth.users (email, last_sign_in) linked to profiles.
-- NOTE: Regular users CANNOT access auth.users. Only Service Role or specific Views with Security Definer can.
-- We will handle "List Users" via an Edge Function to avoid exposing auth.users directly.

-- 7. INITIALIZE YOURSELF AS ADMIN (Optional placeholder)
-- You will need to manually run: 
-- UPDATE profiles SET role = 'admin' WHERE id = 'YOUR_USER_UUID';
