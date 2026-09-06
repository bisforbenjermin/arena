-- 007 Credit rails
--
-- CREDIT-1: two rails, never merged.
--
-- Rail 1 — Keys: free entry access. Zero legal surface.
--   Earned through gameplay and promotions. Spent to enter rounds.
--
-- Rail 2 — Vault Points: lore-denominated loyalty credit.
--   NON-PURCHASABLE, NON-TRANSFERABLE, NON-CASH-CONVERTIBLE.
--   Seven anti-speculation laws keep Rail 2 in loyalty-program territory (see CREDIT-1 ruling).
--   The prize-chance-consideration triangle must never close on a single person;
--   this separation is what keeps it open.
--
-- The rails share a ledger table for auditability but are never joined in application logic.

create table player_keys (
  id         uuid primary key default gen_random_uuid(),
  player_id  uuid not null unique references players(id),
  balance    int  not null default 0 check (balance >= 0),
  updated_at timestamptz not null default now()
);

comment on table player_keys is 'CREDIT-1 Rail 1: free entry access. No monetary value.';

create table vault_points (
  id         uuid primary key default gen_random_uuid(),
  player_id  uuid not null unique references players(id),
  balance    numeric not null default 0 check (balance >= 0),
  updated_at timestamptz not null default now()
);

comment on table vault_points is
  'CREDIT-1 Rail 2: NON-PURCHASABLE, NON-TRANSFERABLE, NON-CASH-CONVERTIBLE. '
  'Lore-denominated loyalty credit only. Firewall Doctrine §1 applies.';

-- Immutable ledger: one row per credit event, both rails.
-- rail column enforces the wall — application code must never move value across rails.
create table credit_ledger (
  id         uuid primary key default gen_random_uuid(),
  player_id  uuid not null references players(id),
  rail       text not null check (rail in ('keys', 'vault_points')),
  delta      numeric not null,
  reason     text not null,
  created_at timestamptz not null default now()
);

comment on column credit_ledger.rail is
  'CREDIT-1: rail identity. Never aggregate or transfer across rails in application logic.';

create index credit_ledger_player_idx on credit_ledger(player_id, rail);
