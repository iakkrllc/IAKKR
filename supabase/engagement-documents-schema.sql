-- Documents attached to an engagement — files live in the private
-- `engagement-documents` Storage bucket, this table tracks metadata and
-- access. Run once in the Supabase SQL Editor, after schema.sql.

create table engagement_documents (
  id uuid primary key default gen_random_uuid(),
  engagement_id uuid not null references engagements(id) on delete cascade,
  uploaded_by uuid not null references profiles(id),
  file_name text not null,
  storage_path text not null,
  file_size bigint not null,
  content_type text not null,
  created_at timestamptz not null default now()
);
alter table engagement_documents enable row level security;
create index engagement_documents_engagement_idx on engagement_documents (engagement_id);
