-- 005 Scores and rank tokens
--
-- PR-3 (A1 Finding 4): scores carries BOTH claimed and verified raw scores.
-- The client submits claimed_raw_score; the server replays the GameEvent log
-- through the headless sim and writes verified_raw_score.
-- percentile is always computed from verified_raw_score, never the claim.
-- verified_raw_score IS NULL until server replay completes.

create table scores (
  id                   uuid primary key default gen_random_uuid(),
  tournament_round_id  uuid not null references tournament_rounds(id),
  player_id            uuid not null references players(id),
  -- PR-3: CLAIM. What the client reported. Never used for rank.
  claimed_raw_score    numeric not null,
  -- PR-3: AUTHORITATIVE. Set after server replays the GameEvent log through sim.
  -- NULL = replay pending. R2 writes this; R3 reads this.
  verified_raw_score   numeric,
  -- PR-5 + PR-4: percentile computed from verified_raw_score against the
  -- (game_id, game_version) distribution. NULL until both replay and normalizer run.
  percentile           numeric check (percentile between 0 and 100),
  -- Storage key for the GameEvent log used in server-side replay.
  input_log_ref        text not null,
  verified_at          timestamptz,
  created_at           timestamptz not null default now(),
  unique (tournament_round_id, player_id)
);

create index scores_player_idx on scores(player_id);
create index scores_round_idx  on scores(tournament_round_id);
create index scores_verified_idx on scores(verified_raw_score) where verified_raw_score is not null;

-- Firewall Doctrine: rank_tokens are status-only. No cash or crypto value. Ever.
create table rank_tokens (
  id         uuid primary key default gen_random_uuid(),
  player_id  uuid not null references players(id),
  amount     numeric not null,
  reason     text not null,
  earned_at  timestamptz not null default now()
);

comment on table rank_tokens is
  'NON-CONVERTIBLE. No cash value. No crypto value. Never redeemable for anything of monetary worth. '
  'Status-only. Firewall Doctrine §1: eligibility ≠ entitlement.';

create index rank_tokens_player_idx on rank_tokens(player_id);
