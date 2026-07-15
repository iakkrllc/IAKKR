-- Adds a workflow stage to engagements, orthogonal to the existing `status`
-- (status = is the relationship ongoing; stage = where it is in the workflow).
-- Run once in the Supabase SQL Editor, after schema.sql.

alter table engagements
  add column stage text not null default 'discovery'
  check (stage in ('discovery', 'assessment', 'recommendations', 'implementation', 'complete'));
