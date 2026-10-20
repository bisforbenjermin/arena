# G1 — Generation Agent Brief

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
You are building the FIRST stage of the Game Factory: the agent (and its prompt/harness) that *invents* games. This stage is intentionally high-volume and low-precision — most output will be mediocre, and that is correct. Volume + downstream gates produce quality; this stage just generates.

## Dependencies
F1 (the GameModule contract — output must conform), F4 (gold-standard reference games + ANATOMY.md as in-context exemplars).

## Task
1. Build a Node service that calls the Anthropic API to generate games. Each call receives a **generation brief**: target controlScheme, target duration (25–60s), a theme tag (pulled from the *currently active lore arc* when available), and a mutation directive: either "novel" or "evolve <gameId>" (using a high-performing parent from G7's loop).
2. The agent must output: (a) code conforming exactly to `GameModule` (seeded PRNG, no `Math.random()`, full `destroy()`), and (b) a `provenance.json` declaring what was generated vs. seeded and every dependency + license.
3. Provide the contract + ANATOMY.md + a reference bundle as in-context exemplars so output matches the house format and quality bar.
4. **Skill-gradient directive**: instruct the agent to design a clear skill gradient (skilled beats random) and to *abstract mechanics* — never replicate a known title's look/feel/name (zero-IP rule).
5. Support **parallel, budgeted** generation: many jobs at once, capped to a daily cost budget. Track cost-per-generation.
6. Maintain a shared **component library** (good particle bursts, input handlers, etc.) the agent can compose from — raises baseline quality, cuts cost. Seed it from F4.
7. Emit each candidate as a job into the pipeline queue for G2.

## Output Contract
- `/factory/generate/` — the generation service.
- `/factory/generate/brief-schema.ts` — the generation-brief format.
- `/factory/generate/prompt/` — the agent prompt + exemplar injection.
- `/factory/components/` — the shared composable component library (seeded).
- `/factory/generate/README.md` — how briefs are formed, budget controls, cost-per-generation metric.

## Done-Criteria
- Produces conforming `GameModule` candidates + `provenance.json` at volume.
- Theme tag wiring reads from active arc when present, else defaults.
- Parallel generation respects a daily budget; cost-per-generation is tracked.

## Handoff
G2 compiles + sandboxes each candidate. G5 audits the provenance. G7 feeds back high-performers as "evolve" parents.
