# L2 — World-State Schema + Canon Ledger

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
You are a backend engineer turning the lore from a script into *queryable world-state*, plus a canon ledger that keeps infinite generated lore coherent (the same generate-freely/gate-hard pattern as the Game Factory).

## Dependencies
F2 (lore skeleton tables), L1 (BIBLE.md — the fixed truths the ledger enforces).

## Task
1. Flesh out the lore schema (extending F2's skeleton): `realms` (territories ↔ regions/cities), `factions`, `arcs` (overarching quests with hidden `stages`), `fragments` (atomic lore pieces), `artifacts` (special games/events that are story beats), `prophecies` (long-horizon goals tied to platform milestones).
2. **Canon ledger**: every accepted fragment/arc-development is recorded. New lore is checked for contradiction against (a) the BIBLE fixed truths and (b) prior canon, BEFORE acceptance. Contradictions are rejected or reconciled. This is the gate that lets agents over-produce safely.
3. Define how fragments *attach* to things: a fragment can be linked to a game, a region, a leaderboard position, a time-of-day, a win-streak (so they can be scattered — see L3).
4. Define arc `stages` as partially-hidden, advanced by metrics (L5 drives progression).
5. Provide an API for L3/L4/L5 to read/write world-state through the ledger (never around it).

## Output Contract
- `/lore/db/migrations/*.sql` — full lore schema.
- `/lore/ledger/` — canon ledger + contradiction-check service.
- `/lore/api/` — read/write interface enforcing ledger checks.
- `/lore/db/README.md` — schema + how contradiction-checking works.

## Done-Criteria
- A fragment contradicting a BIBLE fixed truth is rejected by the ledger.
- Fragments can attach to games/regions/streaks/etc.
- All lore writes go through the ledger (no bypass path).

## Handoff
L3 mass-generates fragments through this API; L4's Loremaster writes via the ledger; L5 advances arc stages.
