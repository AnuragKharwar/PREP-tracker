-- Run this in the Supabase SQL Editor (Dashboard → SQL → New query).
-- Links tracker JSON to auth.users.id (email login uses the same user row).

create table if not exists public.tracker_data (
  user_id uuid primary key references auth.users (id) on delete cascade,
  payload jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create index if not exists tracker_data_updated_at_idx on public.tracker_data (updated_at desc);

alter table public.tracker_data enable row level security;

create policy "tracker_select_own"
  on public.tracker_data for select
  using (auth.uid() = user_id);

create policy "tracker_insert_own"
  on public.tracker_data for insert
  with check (auth.uid() = user_id);

create policy "tracker_update_own"
  on public.tracker_data for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

comment on table public.tracker_data is 'DSA tracker app state per authenticated user';
