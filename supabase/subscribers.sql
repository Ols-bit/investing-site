create table if not exists public.subscribers (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  created_at timestamptz default now()
);

alter table public.subscribers enable row level security;
