-- Phase 4 — lightweight task/job tracking per engagement (Klipboard-inspired).
create table engagement_tasks (
  id uuid primary key default gen_random_uuid(),
  engagement_id uuid not null references engagements(id) on delete cascade,
  title text not null,
  status text not null default 'open' check (status in ('open', 'in_progress', 'done')),
  due_date date,
  assigned_to uuid references profiles(id),
  created_by uuid not null references profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table engagement_tasks enable row level security;
create index engagement_tasks_engagement_idx on engagement_tasks (engagement_id, status);
