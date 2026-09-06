# F2 — Database Schema
The Arcade Realm · Supabase / Postgres · Built against F1 v1.0.0

## Migration order

| File | Domain |
|---|---|
| 001_extensions_and_enums.sql | pgcrypto, pg_trgm, all enum types |
| 002_players_and_regions.sql | regions, venues, players |
| 003_game_pool.sql | game_pool, game_provenance, provenance trigger |
| 004_tournaments_and_rounds.sql | tournaments, tournament_rounds |
| 005_scores_and_rank_tokens.sql | scores (claim/verified split), rank_tokens |
| 006_prize_chest.sql | prize_chest_events |
| 007_credit_rails.sql | player_keys, vault_points, credit_ledger |
| 008_lore_skeleton.sql | realms, factions, arcs, fragments, artifacts, prophecies, canon_ledger |
| 009_views.sql | game_version_score_stats (cold-start support) |

---

## ER overview

```
regions ──< venues ──< tournaments ──< tournament_rounds ──< scores
   │                                          │                  │
players ───────────────────────────────── (player_id)      (player_id)
   │
   ├── player_keys        (Rail 1 — CREDIT-1)
   ├── vault_points       (Rail 2 — CREDIT-1)
   ├── credit_ledger      (immutable audit log, both rails)
   ├── rank_tokens        (status-only, NON-CONVERTIBLE)
   └── prize_chest_events

game_pool ──< game_provenance
    │
tournament_rounds.game_id + game_version (snapshot at round creation)

lore: realms ──< factions ──< arcs ──< fragments
                                  └──< prophecies
      artifacts (standalone)
      canon_ledger (entity index)
```

---

## Walled boundaries (Firewall Doctrine)

### scores: claim vs. verified (PR-3)
`claimed_raw_score` is always a CLAIM — what the client submitted. It is never used for rank, percentile, or any eligibility decision. `verified_raw_score` is what the server produced by replaying the `input_log_ref` GameEvent log through the headless sim. R2 reads `verified_raw_score`; nothing else should. `percentile` is computed from `verified_raw_score` only. A score row with `verified_raw_score IS NULL` is pending replay — treat it as unranked.

### game_version isolation (PR-4)
`tournament_rounds` snapshots `game_version` at creation. `game_version_score_stats` groups by `(game_id, game_version)`. A balance change bumps `game_version` and the new version starts with zero scores — cold-start applies again (PR-5). Historical percentiles for the old version are untouched.

### rank_tokens: non-convertible (Firewall Doctrine §1)
The `rank_tokens` table carries a schema-level `COMMENT` declaring it NON-CONVERTIBLE with no cash or crypto value. Application code must never expose a conversion path. Rank tokens make a player *eligible* for things; they never *entitle*.

### credit rails: never merged (CREDIT-1)
`player_keys` (Rail 1) and `vault_points` (Rail 2) are separate tables. The `credit_ledger` records all events for both rails but the `rail` column is `CHECK`-constrained to `'keys'` or `'vault_points'`. Application code must never aggregate across rails or move value between them. This separation is the legal structure that keeps Rail 2 in loyalty-program territory.

### tilt: reserved (PR-6)
The `control_scheme` enum includes `'tilt'` for forward-compatibility. A `CHECK` constraint on `game_pool` blocks `status='active'` when `control_scheme='tilt'`. G6 must enforce the same check before writing a provenance row.

### prize_chest_events: gated (CP-0)
This table must contain zero rows until the solvency model exists (CP-0 gate). The schema captures the structure; the gate is enforced operationally, not at the DB level.

### lore skeleton: L2 boundary
Tables 008 are stubs. L2 will extend them. Do not add business logic to these tables in any migration before L2 runs — additions may conflict with L2's design.

---

## Done-criteria verification

| Criterion | How satisfied |
|---|---|
| rank_tokens non-convertible comment | `COMMENT ON TABLE rank_tokens` in 005 |
| game_pool cannot go active without provenance | trigger `trg_provenance_before_active` in 003 |
| Migrations run clean on fresh Supabase | sequential numbered files, no circular deps |
| PR-3 claim/verified split | `claimed_raw_score` + `verified_raw_score` in scores (005) |
| PR-4 version keying | `contract_version` + `game_version` in game_pool; `game_version` snapshot in tournament_rounds |
| PR-5 cold-start support | `game_version_score_stats` view (009) |
| PR-6 tilt gated | CHECK constraint in game_pool (003) |
| CREDIT-1 two-rail separation | separate tables + CHECK on credit_ledger.rail (007) |

---

## Handoff notes

- **R2** reads `scores.verified_raw_score` and `game_version_score_stats`. It writes `verified_raw_score`, `percentile`, and `verified_at`.
- **R3** reads `rank_tokens` and `scores.percentile` to build leaderboards.
- **G6** writes `game_pool` + `game_provenance`. Must check `no_active_tilt` constraint before promotion.
- **L2** extends the lore skeleton tables in migration 008 — coordinate column additions.
