
-- Enable Row Level Security (if not already enabled, mostly good practice)
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;

-- Allow anonymous and authenticated users to insert into subscribers
CREATE POLICY "Allow public insert to subscribers"
ON subscribers
FOR INSERT
TO public
WITH CHECK (true);

-- Allow users to read their own data? 
-- Actually, for a simple newsletter signup, we might just want to allow insert. 
-- Do we need to allow SELECT? Probably not for the frontend, but for the edge function (service role) it bypasses RLS anyway.

-- Optional: Allow SELECT if we want to check for duplicates on frontend?
-- The frontend doesn't seem to select, it just blindly inserts and catches duplicates (23505).
