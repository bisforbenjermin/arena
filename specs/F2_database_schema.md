# F2 — Database Schema (Supabase / Postgres)

---
## SHARED CONTEXT PREAMBLE (identical in every agent doc — read once, applies always)

**Project:** *The Arcade Realm* — a hyperlocal surprise-tournament platform. Players check in at physical venues and compete in short, unpredictable skill games. Status (leaderboard rank) is the primary incentive; prizes are deferred. The moat is community + an unfolding meta-narrative ("lore"), not prize size.

**The three engines** (independent, mutually feeding):
1. **Game Factory** — agents continuously generate, test, and promote micro-games into a live pool.
2. **Tournament Runtime** — pulls games from the pool, sequences rounds + intermissions, captures data, ranks players. Server-authoritative.
3. **Lore Layer** — structured world-state where every game/season/leaderboard is a story fragment; quests unfold slowly.

**The core operating principle (applies to every engine):** *Generate freely at the edges, gate hard in the middle, reserve human judgment for taste and canon.* Over-produce candidates; filter aggressively; a human owns only the irreducible core (what "good" feels like; what is canon).

**The five value-ecosystems** (walled from each other; one brand, separate value-mechanics):
- **A — Status** (free; no legal surface) → launch now
- **B — Sponsor Prizes** (contract law) → near-term
- **C — Skill Contest** (paid entry; sweepstakes + skill-gaming law) → mid-term
- **D — Digital Collectibles** (IP + consumer protection) → cautious
- **E — Token/Crypto** (securities + money transmission) → last / maybe-never

**The Firewall Doctrine (non-negotiable, every agent obeys):**
1. *Eligibility ≠ Entitlement.* Status/rank-tokens make a player *eligible* for things; they never *entitle* to a payout and NEVER convert to currency/crypto.
2. *Marketing is a regulated surface.* No copy anywhere (lore, UI, Discord) may frame anything as an investment, promise appreciation, or say "early holders profit." This triggers securities law.
3. *Per-jurisdiction switches.* Anything touching paid entry or value ships able to be disabled per-state.

**Tech baseline:** PWA client; PixiJS/Phaser games (MIT); Supabase (Postgres + Realtime + Auth + Edge Functions); dynamic `import()` + Service Worker pre-cache for games; Cloudflare Pages + R2 for hosting/bundles; a separate Node service for agent runtimes calling the Anthropic API.

**Zero-IP rule:** original or permissively-licensed (MIT/Apache/CC0) only. No recognizable characters, names, or "inspired-by" clones. Every generated artifact ships a `provenance.json` or it does not enter any pool.

**This is not legal advice.** Compliance docs describe what to build and what to ask a licensed attorney — never a legal green light.
---

## Role
You are a backend engineer designing the relational schema. Postgres was chosen over a document store because the system needs joins across player ↔ guild ↔ region ↔ quest-progress ↔ game-lineage. Lean into relational design.

## Dependencies
None to start; coordinate game id/slug naming with F1.

## Task
Design and write migrations for these domains. Keep value-mechanics ecosystems *queryable-but-walled* (Firewall Doctrine).

**Core / Players:** `players` (id, handle, created_at, home_region, auth linkage); `regions` (id, name, geo bounds).

**Game pool:** `game_pool` (id, slug, title, control_scheme, duration_seconds, difficulty_curve, theme_tags[], generated_by, parent_lineage, status [candidate|active|retired], quality_score, created_at); `game_provenance` (game_id FK, provenance_json) — REQUIRED before status='active'.

**Runtime:** `tournaments` (id, region_id, venue_id, started_at, status); `tournament_rounds` (id, tournament_id, round_index, game_id, seed, speed_multiplier); `scores` (id, tournament_round_id, player_id, raw_score, percentile, input_log_ref, validated bool); `rank_tokens` (id, player_id, amount, reason, earned_at) — **status-only; add a schema-level comment: NON-CONVERTIBLE, no cash/crypto value, never redeemable.**

**Prize Chest:** `prize_chest_events` (id, player_id, tournament_id, category_chosen, item_chosen, chosen_at) — capture relationally for future cross-tab insight.

**Lore skeleton (L2 owns detail):** `realms, factions, arcs, fragments, artifacts, prophecies, canon_ledger` — minimal columns only.

## Output Contract
- `/db/migrations/*.sql` — ordered migrations.
- `/db/schema.md` — ER overview + rationale for each walled boundary.
- `/db/seed.sql` — minimal seed (one region, one venue).

## Done-Criteria
- Migrations run clean on a fresh Supabase instance.
- `rank_tokens` carries the non-convertible comment in-schema.
- `game_pool` cannot be 'active' without a `game_provenance` row (trigger or documented rule).

## Handoff
R-layer reads tournaments/scores tables; L2 extends the lore skeleton; G6 writes game_pool + game_provenance.
