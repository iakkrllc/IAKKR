-- Phase 4 — clock-in/clock-out records per employee (Homebase-inspired time clock).
create table employee_shifts (
  id uuid primary key default gen_random_uuid(),
  employee_id uuid not null references employees(id) on delete cascade,
  business_id uuid not null references businesses(id) on delete cascade,
  clock_in timestamptz not null default now(),
  clock_out timestamptz,
  note text,
  created_by uuid not null references profiles(id),
  created_at timestamptz not null default now()
);
alter table employee_shifts enable row level security;
create index employee_shifts_employee_idx on employee_shifts (employee_id, clock_in);
create index employee_shifts_business_idx on employee_shifts (business_id, clock_in);
