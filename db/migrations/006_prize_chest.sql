-- 006 Prize chest events
-- Captured relationally for future cross-tab insight (per F2 spec).
-- CP-0: no prize event rows should exist until the solvency model is in place.

create table prize_chest_events (
  id              uuid primary key default gen_random_uuid(),
  player_id       uuid not null references players(id),
  tournament_id   uuid not null references tournaments(id),
  category_chosen text not null,
  item_chosen     text not null,
  chosen_at       timestamptz not null default now()
);

create index prize_chest_player_idx     on prize_chest_events(player_id);
create index prize_chest_tournament_idx on prize_chest_events(tournament_id);
