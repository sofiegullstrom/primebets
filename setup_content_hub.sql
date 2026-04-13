
-- 1. Create the Articles Tables
CREATE TABLE IF NOT EXISTS articles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content TEXT, -- HTML content
  excerpt TEXT, -- Short summary for preview/SEO
  type TEXT CHECK (type IN ('blog', 'news', 'report', 'guide')) DEFAULT 'blog',
  status TEXT CHECK (status IN ('draft', 'published')) DEFAULT 'draft',
  published_at TIMESTAMPTZ,
  meta_title TEXT,
  meta_description TEXT,
  cover_image TEXT, -- URL to image
  author_id UUID REFERENCES auth.users
);

-- 2. Security (RLS)
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

-- Policy: Everyone can read 'published' articles
CREATE POLICY "Public can view published articles"
ON articles FOR SELECT
TO public
USING (status = 'published');

-- Policy: Admins can do EVERYTHING (Create, Update, Delete, Read Drafts)
CREATE POLICY "Admins have full access"
ON articles FOR ALL
TO authenticated
USING (
    -- Check if user is admin in profiles table
    EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    )
    -- OR hardcoded backup for your specific emails
    OR auth.jwt() ->> 'email' IN ('sofie.g63@outlook.com', 'primebets.se@gmail.com')
);

-- 3. Storage Policies (for 'article-images' bucket)
-- NOTE: Please create a new Public Bucket named 'article-images' in the Storage Dashboard first!
-- These policies control who can upload to it.

-- Allow public to see images
CREATE POLICY "Public can view article images"
ON storage.objects FOR SELECT
TO public
USING ( bucket_id = 'article-images' );

-- Allow admins to upload images
CREATE POLICY "Admins can upload article images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'article-images' AND (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
        OR auth.jwt() ->> 'email' IN ('sofie.g63@outlook.com', 'primebets.se@gmail.com')
    )
);
