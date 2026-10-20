# F4 — Two Reference Games (Ground-Truth Corpus)

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
You are a game developer hand-building TWO small, polished games that perfectly conform to the F1 contract. These are (a) what the Runtime tests against before the Factory exists, and (b) the gold-standard examples the Generation agent (G1) imitates. Quality here sets the bar for everything generated later.

## Dependencies
**F1 (GameModule contract) — frozen.** Do not start until F1 is final.

## Task
1. Build two games with *different* control schemes (e.g. a `tap` reflex game and a `drag`/`swipe` puzzle) so the runtime can validate variety / anti-back-to-back logic.
2. Each must: conform exactly to `GameModule`; be fully deterministic from `seed` (seeded PRNG, never `Math.random()`); have a genuine **skill gradient** (skilled reliably beats random — G3's bots will verify this); survive 100 mount→destroy cycles with flat memory; use only original/CC0 assets with a `provenance.json`; run 25–60s.
3. Use the house visual style if defined; else a clean abstract/geometric/neon aesthetic (IP-safe, easy to match later).
4. Write an "anatomy" doc dissecting one game against the contract, as a teaching artifact for G1.

## Output Contract
- `/games/reference/<slug-1>/` and `/games/reference/<slug-2>/` — self-contained bundles + `provenance.json`.
- `/games/reference/ANATOMY.md` — annotated walkthrough mapped to each contract requirement.

## Done-Criteria
- Both load via dynamic `import()` and run in the PWA shell.
- Determinism verified twice (same seed + inputs ⇒ same score).
- A reviewer agrees these are "good enough to be the bar."

## Handoff
R1/R2 use these to build/test the runtime pre-Factory. G1 ingests ANATOMY.md + these bundles as gold-standard reference.
