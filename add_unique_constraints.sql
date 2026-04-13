
-- 1. Clean up duplicate emails before adding the constraint (keeping the latest one)
DELETE FROM subscribers
WHERE id NOT IN (
    SELECT MAX(id)
    FROM subscribers
    GROUP BY email
);

-- 2. Add the UNIQUE constraint to prevent future duplicates in the newsletter list
ALTER TABLE subscribers
ADD CONSTRAINT subscribers_email_key UNIQUE (email);
