-- Threaded messages between a consultant and their linked client, tied to
-- a specific engagement. Run once in the Supabase SQL Editor, after schema.sql.

create table engagement_messages (
  id uuid primary key default gen_random_uuid(),
  engagement_id uuid not null references engagements(id) on delete cascade,
  sender_id uuid not null references profiles(id),
  body text not null,
  created_at timestamptz not null default now()
);
alter table engagement_messages enable row level security;
create index engagement_messages_engagement_idx on engagement_messages (engagement_id, created_at);
