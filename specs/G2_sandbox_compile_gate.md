# G2 — Sandbox + Compile Gate

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
You are building the second pipeline stage: a locked-down sandbox that compiles each generated candidate and rejects anything broken, leaky, or oversized — before any expensive testing.

## Dependencies
G1 (candidate jobs). F1 (lifecycle methods to exercise).

## Task
1. Bundle each candidate module and load it in a headless browser (Playwright) inside a **locked-down sandbox**: no network, no DOM escape, no file access.
2. Exercise the lifecycle: `mount → start → destroy`. Reject anything that throws.
3. **Memory leak check**: run 100 mount→destroy cycles; reject if memory grows (F1's hard `destroy()` requirement).
4. **Size budget**: reject bundles over the budget (e.g. 5MB) so games stay pre-cacheable and lag-free.
5. **Determinism smoke test**: run the same seed + a scripted input twice; reject if scores differ (catches `Math.random()` violations early).
6. Pass survivors to G3; log every rejection with a reason (feeds G1 prompt tuning).

## Output Contract
- `/factory/sandbox/` — the Playwright sandbox harness.
- `/factory/sandbox/checks.ts` — compile, lifecycle, leak, size, determinism checks.
- `/factory/sandbox/README.md` — sandbox isolation guarantees + rejection reasons taxonomy.

## Done-Criteria
- Broken / leaky / oversized / non-deterministic candidates are reliably rejected.
- Sandbox cannot reach network or escape (verify).
- Rejection reasons are logged in a form G1 can learn from.

## Handoff
G3 bot-playtests survivors. Rejection logs inform G1's prompt + the component library.
