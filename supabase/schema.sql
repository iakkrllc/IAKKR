-- iakkr Phase 1 schema — multi-vertical business consulting SaaS.
-- Run this once in the Supabase SQL Editor (or via a direct psql/pg connection).
--
-- Same conventions as the reference project (mysplitwise): RLS enabled on
-- every table, NO client-facing policies — all reads/writes go through
-- server-side Next.js API routes using the secret key. profiles are created
-- from the application layer right after a successful signup call, never via
-- a trigger on auth.users (a trigger there runs inside the signup
-- transaction itself, so a failing trigger would fail the signup too).

create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  name text not null,
  role text not null check (role in ('consultant', 'client')),
  created_at timestamptz not null default now()
);
alter table profiles enable row level security;
create unique index profiles_email_lower_idx on profiles (lower(email));

-- "vertical" is data, not code — adding a new industry (e.g. a tenth
-- vertical) is a row insert here, never a schema migration or code change.
create table verticals (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  created_at timestamptz not null default now()
);
alter table verticals enable row level security;

-- The client company being consulted. owner_client_id is nullable: a
-- consultant can create a business before its owner has a client account,
-- then link it once they sign up (Phase 1 has no placeholder-invite flow).
create table businesses (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  vertical_id uuid not null references verticals(id),
  owner_client_id uuid references profiles(id) on delete set null,
  created_by_consultant_id uuid not null references profiles(id),
  created_at timestamptz not null default now()
);
alter table businesses enable row level security;
create index businesses_vertical_idx on businesses (vertical_id);
create index businesses_owner_idx on businesses (owner_client_id);

create table engagements (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references businesses(id) on delete cascade,
  consultant_id uuid not null references profiles(id),
  status text not null default 'active' check (status in ('active', 'paused', 'completed')),
  notes text,
  started_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);
alter table engagements enable row level security;
create index engagements_business_idx on engagements (business_id);
create index engagements_consultant_idx on engagements (consultant_id);

-- Vertical-specific assessment definitions. `questions` is a jsonb array of
-- {id, label, type} objects — keeps per-vertical question sets flexible
-- without a dedicated table per vertical.
create table checklist_templates (
  id uuid primary key default gen_random_uuid(),
  vertical_id uuid not null references verticals(id),
  title text not null,
  description text,
  questions jsonb not null default '[]',
  created_by uuid not null references profiles(id),
  created_at timestamptz not null default now()
);
alter table checklist_templates enable row level security;
create index checklist_templates_vertical_idx on checklist_templates (vertical_id);

create table assessments (
  id uuid primary key default gen_random_uuid(),
  engagement_id uuid not null references engagements(id) on delete cascade,
  template_id uuid not null references checklist_templates(id),
  answers jsonb not null default '{}',
  score numeric,
  completed_at timestamptz,
  created_by uuid not null references profiles(id),
  created_at timestamptz not null default now()
);
alter table assessments enable row level security;
create index assessments_engagement_idx on assessments (engagement_id);

-- vertical_id null = general article, visible across all verticals.
create table content_articles (
  id uuid primary key default gen_random_uuid(),
  vertical_id uuid references verticals(id),
  title text not null,
  body text not null,
  published_at timestamptz,
  created_by uuid not null references profiles(id),
  created_at timestamptz not null default now()
);
alter table content_articles enable row level security;
create index content_articles_vertical_idx on content_articles (vertical_id);

-- Seed the two verticals named in the initial product brief. Add more later
-- with a plain insert — no code or migration needed.
insert into verticals (slug, name) values
  ('restaurant', 'Restaurant Consulting'),
  ('gas_station', 'Gas Station Consulting')
on conflict (slug) do nothing;
