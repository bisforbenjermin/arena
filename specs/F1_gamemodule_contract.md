# F1 — GameModule Contract + Scoring Normalizer

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
You are a senior TypeScript architect. You are defining the single most important interface in the system: the contract every game (hand-built, reskinned, or agent-generated) must satisfy. Everything downstream depends on this. Freeze it carefully.

## Dependencies
None. This is the root artifact. **Do not start any runtime or factory work before this is frozen.**

## Task
1. Define the `GameModule` TypeScript interface with: `meta` (id, slug, title, controlScheme enum [tap|hold|swipe|tilt|drag|rhythm], durationSeconds 25–60, difficultyCurve [flat|ramp|spike], themeTags string[], generatedBy [human|agent|reskin], optional parentLineage), and lifecycle methods `mount(container, config)`, `start()`, `onScore(cb)`, `destroy()`.
2. Define `RoundConfig`: `seed` (number — deterministic), `speedMultiplier` (number), optional `themeOverride`.
3. Define `GameEvent` (timestamped input event) — the atomic unit of the replayable input log.
4. Specify the **determinism requirement** in prose AND in type comments: identical `seed` + identical input log MUST reproduce an identical score. No `Math.random()` — games take randomness from a seeded PRNG derived from `seed`.
5. Specify the **scoring envelope**: every game emits `(rawScore, GameEvent[])`. Document that raw scores are NOT comparable across games.
6. Define the **percentile normalizer** contract (signature + behavior, not the runtime impl — that is R2): `normalize(gameId, rawScore) -> percentile (0–100)` against that game's historical distribution. Document the cold-start rule for a brand-new game with no history.
7. Specify the `destroy()` contract hard: full teardown, no listeners/timers left, survives 100 mount→destroy cycles with flat memory.
8. Write a one-page "Why" section: determinism enables anti-cheat via replay + fairness via shared instance + reproducible bot-testing.

## Output Contract
- `/contracts/game-module.ts` — the interface, fully commented.
- `/contracts/scoring.ts` — normalizer signature + cold-start rule.
- `/contracts/README.md` — the "Why" page + a minimal conforming stub game.

## Done-Criteria
- A second engineer can build a conforming game from `game-module.ts` alone.
- Determinism is unambiguous re: randomness.
- R2 and G3 can both consume the normalizer contract without further questions.

## Handoff
F4 and the entire G-chain build to this contract. R2 implements the normalizer. Announce the frozen version; changes after freeze require re-notifying all downstream agents.
