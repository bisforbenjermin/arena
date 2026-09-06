-- 004 Tournaments and rounds

create table tournaments (
  id         uuid primary key default gen_random_uuid(),
  region_id  uuid not null references regions(id),
  venue_id   uuid not null references venues(id),
  started_at timestamptz not null default now(),
  status     tournament_status not null default 'pending'
);

create table tournament_rounds (
  id              uuid primary key default gen_random_uuid(),
  tournament_id   uuid not null references tournaments(id),
  round_index     int  not null,
  game_id         uuid not null references game_pool(id),
  -- PR-4: snapshot game_version at round creation time.
  -- Percentile distributions are keyed (game_id, game_version) — snapshotting here
  -- ensures a mid-season game_version bump does not corrupt existing round scores.
  game_version    text not null,
  -- PR-1: seed is the deterministic entropy source for this round's sfc32 PRNG.
  seed            bigint not null,
  speed_multiplier numeric not null default 1.0,
  unique (tournament_id, round_index)
);

create index rounds_tournament_idx on tournament_rounds(tournament_id);
create index rounds_game_idx       on tournament_rounds(game_id, game_version);
