-- 008 Lore skeleton
-- L2 owns the detail. These are minimal columns only — do not add business logic here.

create table realms (
  id         uuid primary key default gen_random_uuid(),
  name       text not null unique,
  created_at timestamptz not null default now()
);

create table factions (
  id         uuid primary key default gen_random_uuid(),
  realm_id   uuid references realms(id),
  name       text not null,
  created_at timestamptz not null default now()
);

create table arcs (
  id          uuid primary key default gen_random_uuid(),
  faction_id  uuid references factions(id),
  title       text not null,
  status      text not null default 'pending',
  created_at  timestamptz not null default now()
);

create table fragments (
  id          uuid primary key default gen_random_uuid(),
  arc_id      uuid references arcs(id),
  content     text not null,
  revealed_at timestamptz,
  created_at  timestamptz not null default now()
);

create table artifacts (
  id          uuid primary key default gen_random_uuid(),
  name        text not null unique,
  description text,
  created_at  timestamptz not null default now()
);

create table prophecies (
  id           uuid primary key default gen_random_uuid(),
  arc_id       uuid references arcs(id),
  content      text not null,
  fulfilled_at timestamptz,
  created_at   timestamptz not null default now()
);

create table canon_ledger (
  id          uuid primary key default gen_random_uuid(),
  entity_type text not null,
  entity_id   uuid not null,
  canon_since timestamptz not null default now(),
  notes       text
);

create index canon_ledger_entity_idx on canon_ledger(entity_type, entity_id);
