-- 002 Regions, venues, players

create table regions (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  geo_bounds jsonb,                          -- {lat_min, lat_max, lng_min, lng_max}
  created_at timestamptz not null default now()
);

create table venues (
  id         uuid primary key default gen_random_uuid(),
  region_id  uuid not null references regions(id),
  name       text not null,
  created_at timestamptz not null default now()
);

create table players (
  id             uuid primary key default gen_random_uuid(),
  handle         text not null unique,
  home_region_id uuid references regions(id),
  auth_id        text unique,                -- supabase auth.users.id
  created_at     timestamptz not null default now()
);

create index players_auth_id_idx on players(auth_id);
create index players_region_idx  on players(home_region_id);
