alter table public.layers
  alter column file_url drop not null,
  alter column preview_geojson_url drop not null;

alter table public.layers
  add column if not exists source_url text,
  add column if not exists download_url text,
  add column if not exists license_url text,
  add column if not exists coverage text,
  add column if not exists update_frequency text,
  add column if not exists data_access_type text not null default 'supabase'
    check (data_access_type in ('external', 'local', 'supabase')),
  add column if not exists is_downloadable boolean not null default true,
  add column if not exists is_previewable boolean not null default true,
  add column if not exists records_count_label text,
  add column if not exists file_size_label text,
  add column if not exists tags text[] not null default '{}';

create index if not exists layers_tags_gin_idx on public.layers using gin(tags);
create index if not exists layers_data_access_type_idx on public.layers(data_access_type);
