-- Phase 4 — employee roster per business (Homebase-inspired).
create table employees (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references businesses(id) on delete cascade,
  name text not null,
  title text,
  hourly_rate numeric,
  status text not null default 'active' check (status in ('active', 'inactive')),
  created_by uuid not null references profiles(id),
  created_at timestamptz not null default now()
);
alter table employees enable row level security;
create index employees_business_idx on employees (business_id);
