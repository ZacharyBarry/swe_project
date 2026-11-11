-- Run in the Supabase SQL Editor. Safe to rerun for this starter setup.
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz not null default now()
);
create table if not exists public.sheets (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id),
  filename text not null check (char_length(filename) between 1 and 255),
  storage_path text not null unique,
  created_at timestamptz not null default now()
);
create index if not exists sheets_project_id_idx on public.sheets(project_id);
grant select, insert, update, delete on public.projects, public.sheets to service_role;
-- No anonymous browser access. Express uses the backend-only secret key.
alter table public.projects enable row level security;
alter table public.sheets enable row level security;
insert into public.projects (id, name)
values ('00000000-0000-4000-8000-000000000001', 'Campus renovation')
on conflict (id) do nothing;
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('drawings', 'drawings', false, 10485760, array['application/pdf'])
on conflict (id) do update set public = false,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;
