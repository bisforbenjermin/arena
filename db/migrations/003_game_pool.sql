-- 003 Game pool
-- PR-4: contract_version and game_version are required on every row.
-- PR-6: tilt cannot be active (constraint enforced here and in G6).
-- Done-criteria: game_pool cannot reach status='active' without a game_provenance row.

create table game_pool (
  id               uuid primary key default gen_random_uuid(),
  slug             text not null unique,
  title            text not null,
  control_scheme   control_scheme not null,
  duration_seconds int  not null check (duration_seconds between 25 and 60),
  difficulty_curve difficulty_curve not null,
  theme_tags       text[] not null default '{}',
  generated_by     generated_by not null,
  parent_lineage   text references game_pool(slug),   -- slug of source if reskin/derived
  -- PR-4: both fields required. Bump game_version on any balance change;
  -- this starts a fresh percentile distribution (keyed in scores via tournament_rounds).
  contract_version text not null,
  game_version     text not null,
  status           game_status not null default 'candidate',
  quality_score    numeric,
  created_at       timestamptz not null default now(),
  -- PR-6: tilt is reserved and unimplemented. It must never reach active status.
  constraint no_active_tilt check (
    not (control_scheme = 'tilt' and status = 'active')
  )
);

-- provenance is required before any game goes active (Done-criteria).
create table game_provenance (
  game_id        uuid primary key references game_pool(id) on delete cascade,
  provenance_json jsonb not null,
  created_at     timestamptz not null default now()
);

-- Trigger: block status='active' if no provenance row exists.
create or replace function enforce_provenance_before_active()
returns trigger language plpgsql as $$
begin
  if new.status = 'active' then
    if not exists (
      select 1 from game_provenance where game_id = new.id
    ) then
      raise exception
        'game_pool: cannot set status=active without a game_provenance row (id: %)', new.id;
    end if;
  end if;
  return new;
end;
$$;

create trigger trg_provenance_before_active
  before insert or update of status on game_pool
  for each row execute function enforce_provenance_before_active();

create index game_pool_status_idx  on game_pool(status);
create index game_pool_slug_idx    on game_pool(slug);
