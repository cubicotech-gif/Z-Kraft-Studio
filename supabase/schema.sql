-- Z Kraft Studio: run once in the Supabase SQL editor.
-- Security model: RLS is ON and there are NO public policies, so the anon key can neither read
-- nor write orders or files. Only the Next.js server (service-role key) inserts orders and mints
-- one-time signed upload URLs. View orders in the dashboard's Table Editor.

create table if not exists public.orders (
  id                uuid primary key default gen_random_uuid(),
  created_at        timestamptz not null default now(),
  status            text not null default 'new' check (status in ('new', 'in_progress', 'done', 'cancelled')),
  tier              text not null check (tier in ('common', 'rare', 'epic', 'legendary')),
  character_name    text check (char_length(character_name) <= 100),
  description       text not null check (char_length(description) between 10 and 2000),
  name              text not null check (char_length(name) between 1 and 100),
  email             text not null check (char_length(email) <= 254),
  handle            text check (char_length(handle) <= 100),
  discount_code     text check (char_length(discount_code) <= 40),
  inspiration_paths text[] not null default '{}' check (cardinality(inspiration_paths) <= 5)
);

alter table public.orders enable row level security;

-- Private bucket for inspiration images, with server-side size/type limits.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('inspiration', 'inspiration', false, 5242880, array['image/png', 'image/jpeg', 'image/webp', 'image/gif'])
on conflict (id) do update
  set file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;
