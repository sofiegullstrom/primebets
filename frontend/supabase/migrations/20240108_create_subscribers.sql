
-- Create subscribers table
create table if not exists public.subscribers (
  id uuid default gen_random_uuid() primary key,
  email text not null unique,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  is_active boolean default true,
  consent_given boolean default false
);

-- Turn on RLS
alter table public.subscribers enable row level security;

-- Allow insert from public (for the form)
create policy "Allow public insert to subscribers"
on public.subscribers
for insert
to public
with check (true);

-- Allow read only by service role or authenticated users if implied, 
-- but for privacy, public shouldn't read.
