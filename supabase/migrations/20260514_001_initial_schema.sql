create extension if not exists postgis;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  full_name text,
  role text not null default 'registered' check (role in ('registered', 'editor', 'admin', 'super_admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  description text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists public.data_sources (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  description text not null default '',
  contact_info text,
  created_at timestamptz not null default now()
);

create table if not exists public.layers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text not null default '',
  category_id uuid references public.categories(id),
  geometry_type text not null check (geometry_type in ('point', 'line', 'polygon', 'raster', 'tabular')),
  source text not null,
  license text not null check (license in ('open', 'internal', 'private')),
  crs text not null default 'EPSG:4326',
  file_url text not null,
  preview_geojson_url text not null,
  records_count integer not null default 0,
  file_size bigint not null default 0,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  is_public boolean not null default false,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  bbox jsonb,
  quality_summary jsonb not null default '{}'::jsonb
);

create table if not exists public.layer_files (
  id uuid primary key default gen_random_uuid(),
  layer_id uuid not null references public.layers(id) on delete cascade,
  storage_path text not null,
  file_name text not null,
  file_type text not null,
  file_format text not null,
  file_size bigint not null default 0,
  is_preview boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.downloads (
  id uuid primary key default gen_random_uuid(),
  layer_id uuid not null references public.layers(id) on delete cascade,
  user_id uuid references public.profiles(id),
  download_format text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.activity_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references public.profiles(id),
  action_type text not null,
  target_type text not null,
  target_id uuid,
  target_name text,
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  layer_id uuid not null references public.layers(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, layer_id)
);

create table if not exists public.access_requests (
  id uuid primary key default gen_random_uuid(),
  layer_id uuid not null references public.layers(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  message text not null default '',
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now()
);

create or replace function public.current_user_role()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select role from public.profiles where id = auth.uid()
$$;

create or replace function public.has_role(required_roles text[])
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(public.current_user_role() = any(required_roles), false)
$$;

alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.data_sources enable row level security;
alter table public.layers enable row level security;
alter table public.layer_files enable row level security;
alter table public.downloads enable row level security;
alter table public.activity_logs enable row level security;
alter table public.favorites enable row level security;
alter table public.access_requests enable row level security;

create policy "profiles can read own profile"
on public.profiles for select
using (id = auth.uid() or public.has_role(array['admin', 'super_admin']));

create policy "public can read categories"
on public.categories for select
using (true);

create policy "admins can manage categories"
on public.categories for all
using (public.has_role(array['admin', 'super_admin']))
with check (public.has_role(array['admin', 'super_admin']));

create policy "public can read published public layers"
on public.layers for select
using (status = 'published' and is_public = true);

create policy "editors and admins can read managed layers"
on public.layers for select
using (public.has_role(array['editor', 'admin', 'super_admin']));

create policy "editors can create layers"
on public.layers for insert
with check (public.has_role(array['editor', 'admin', 'super_admin']) and created_by = auth.uid());

create policy "admins can update layers"
on public.layers for update
using (public.has_role(array['admin', 'super_admin']))
with check (public.has_role(array['admin', 'super_admin']));

create policy "super admins can delete layers"
on public.layers for delete
using (public.has_role(array['super_admin']));

create policy "public can read public layer files"
on public.layer_files for select
using (
  exists (
    select 1 from public.layers
    where layers.id = layer_files.layer_id
      and layers.status = 'published'
      and layers.is_public = true
  )
);

create policy "editors can manage layer files"
on public.layer_files for all
using (public.has_role(array['editor', 'admin', 'super_admin']))
with check (public.has_role(array['editor', 'admin', 'super_admin']));

create policy "users can insert downloads"
on public.downloads for insert
with check (user_id is null or user_id = auth.uid());

create policy "admins can read downloads"
on public.downloads for select
using (public.has_role(array['admin', 'super_admin']));

create policy "admins can read activity"
on public.activity_logs for select
using (public.has_role(array['admin', 'super_admin']));

create policy "editors can write activity"
on public.activity_logs for insert
with check (public.has_role(array['editor', 'admin', 'super_admin']));

create policy "users manage own favorites"
on public.favorites for all
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "users create own access requests"
on public.access_requests for insert
with check (user_id = auth.uid());

create policy "users read own access requests"
on public.access_requests for select
using (user_id = auth.uid() or public.has_role(array['admin', 'super_admin']));

insert into storage.buckets (id, name, public)
values ('layer-assets', 'layer-assets', false)
on conflict (id) do nothing;

create policy "public can read preview assets"
on storage.objects for select
using (
  bucket_id = 'layer-assets'
  and name like 'layers/previews/%'
);

create policy "editors can upload layer assets"
on storage.objects for insert
with check (
  bucket_id = 'layer-assets'
  and public.has_role(array['editor', 'admin', 'super_admin'])
);

create index if not exists layers_status_public_idx on public.layers(status, is_public);
create index if not exists layers_category_idx on public.layers(category_id);
create index if not exists activity_logs_created_at_idx on public.activity_logs(created_at desc);
