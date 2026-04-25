-- Run this in your Supabase SQL editor

create table public.reports (
  id          uuid             default gen_random_uuid() primary key,
  lat         double precision not null,
  lng         double precision not null,
  address     text,
  description text,
  created_at  timestamptz      default now() not null
);

alter table public.reports enable row level security;

create policy "Public read" on public.reports
  for select using (true);

create policy "Public insert" on public.reports
  for insert with check (true);
