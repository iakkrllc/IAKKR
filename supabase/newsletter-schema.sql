-- iakkr newsletter signups — public marketing-page capture, unrelated to the
-- authenticated app. Run once in the Supabase SQL Editor, after schema.sql.

create table newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  created_at timestamptz not null default now()
);
alter table newsletter_subscribers enable row level security;
-- No client-facing policies: the /api/newsletter route (secret key) is the only writer.
