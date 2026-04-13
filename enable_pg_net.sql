-- Enable the pg_net extension to allow database triggers to make HTTP requests
CREATE EXTENSION IF NOT EXISTS "pg_net" WITH SCHEMA "extensions";

-- Verify it was created
SELECT * FROM pg_extension WHERE extname = 'pg_net';
