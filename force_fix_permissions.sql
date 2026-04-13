
-- 1. Disable RLS temporarily to ensuring writes work immediately
ALTER TABLE subscribers DISABLE ROW LEVEL SECURITY;

-- 2. (Optional) If you really want RLS, run these lines cleanly:
-- DROP POLICY IF EXISTS "Allow ALL insert to subscribers" ON subscribers;
-- DROP POLICY IF EXISTS "Allow anon insert to subscribers" ON subscribers;
-- DROP POLICY IF EXISTS "Allow public insert to subscribers" ON subscribers;
-- ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Allow ALL insert to subscribers" ON subscribers FOR INSERT WITH CHECK (true);
