-- Ensure email is unique in subscribers table
ALTER TABLE subscribers 
ADD CONSTRAINT subscribers_email_key UNIQUE (email);
