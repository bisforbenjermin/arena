# THE ARCADE REALM — LAUNCH KIT

MOC: [[ARENA_MOC]]

### Command-center operating model + 24 copy-paste agent launch packets

You (the founder) are running this project as a **command center**: keep ONE ongoing chat (the one that produced this kit) as your coordinator. Each task below gets launched in its OWN fresh chat by copy-pasting its packet. The agent in that chat does the task, hands you outputs + a STATUS BLOCK, and you paste that STATUS BLOCK back to command center so it can verify against the architecture and tell you what's unblocked next.

---

## TWO WAYS TO USE THIS KIT

**Option A — Copy-paste (portable, works anywhere).**
For each task: open a new chat → copy the entire packet (everything between its `LAUNCH PACKET` and `END LAUNCH PACKET` markers) → paste → the agent executes. Each packet is fully self-contained; it carries the shared context preamble inside it, so the new chat needs nothing else.

**Option B — Project files (cleaner, less pasting).**
You also have the `agent-docs/` folder (and its zip). If you drop that folder into THIS Project's files, every chat *inside this Project* can read those docs directly. Then a launch can be as short as:
> "You are execution agent for task F2 of The Arcade Realm. Open the project file `00_foundations/F2_database_schema.md`, follow it exactly, and end with the STATUS BLOCK it implies. The preamble is embedded in that file — obey it."
Use Option B when you're working inside the Project; use the full packets (Option A) for agents outside it or when you want zero ambiguity. The packets below are the Option-A version.

> Note on memory: a new chat does NOT inherit this chat's memory or files. That's why packets are self-contained. Command center holds the architecture; the agents hold only their one task. You are the courier between them via the STATUS BLOCKS.

---

## THE COORDINATION LOOP (how you actually run a week)

1. **Command center tells you what's launchable** (respecting dependencies — see order below).
2. **You launch each ready task** in its own chat using its packet.
3. **The agent returns outputs + a STATUS BLOCK.**
4. **You paste the STATUS BLOCK back here** to command center.
5. Command center **verifies it against the architecture**, notes any drift, and tells you what the completed task just unblocked.
6. Repeat.

You don't need to understand the dependency graph yourself — just paste status back and ask "what's next?" Command center tracks it.

---

## LAUNCH ORDER (what command center will tell you, summarized)

- **Start solo, this week:** `F1` (freeze the game contract) and `L1` (write the lore bible — this one is YOU, not an agent). Nothing else should start until F1 is frozen.
- **Then the spine:** `F2` → `F3` → `F4` (you create the accounts/credentials; agents build).
- **Then prove the loop:** `R1`–`R4` on the two reference games, at ONE real venue. Answer: do people replay for rank alone? Do NOT build the Factory yet.
- **Then, only after the loop is proven:** the Factory `G1`→`G7` (sequential), the rest of Lore `L2`–`L5` (needs L1 done), and Compliance `C1`–`C4`. `C1` must land before `L4`.
- **In parallel, early & cheap:** form the entity + draft a basic ToS with the eligibility-≠-entitlement language. The full attorney brief (`C4`) waits until you approach real prizes.

---

## THE 24 LAUNCH PACKETS

Index: F1 F2 F3 F4 | R1 R2 R3 R4 | G1 G2 G3 G4 G5 G6 G7 | L1 L2 L3 L4 L5 | C1 C2 C3 C4

---


## ▶ F1 — F1 - GameModule Contract + Scoring Normalizer

<!-- ============================================================= -->
<!-- LAUNCH PACKET: F1  —  copy everything from the line below   -->
<!-- down to the matching END marker, paste into a brand-new chat.  -->
<!-- ============================================================= -->

You are an execution agent for a software/creative project called **The Arcade Realm**. You are being given exactly ONE task (F1) from a larger build that is coordinated by a separate "command center" chat. You do not need any other conversation or file — this message is fully self-contained. Read it, do the task, and return the outputs and a status line in the format specified at the very end.

Important operating notes for you, the agent:
- The "## Dependencies" section lists ARTIFACTS (files/outputs) produced by other tasks. If a dependency artifact is not provided to you in this chat, ask the human for it before building anything that needs it — or, if it's a contract/spec, ask them to paste it. Do not invent the contents of an upstream contract.
- Follow the "## Output Contract" exactly — those are the files/deliverables you must produce.
- Obey every rule in the SHARED CONTEXT PREAMBLE below, especially the Firewall Doctrine and the zero-IP rule. These are non-negotiable.
- When done, end your final message with the STATUS BLOCK described at the bottom so the human can paste it back to command center.

Here is your complete task specification:

================================================================
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
================================================================

## STATUS BLOCK — paste this back to command center when you finish (or if you're blocked)

```
TASK: F1
STATUS: [DONE | BLOCKED | PARTIAL]
OUTPUTS PRODUCED:
  - <list each file/deliverable you actually created>
DEPENDENCY ARTIFACTS I STILL NEED (if any):
  - <e.g. "F1 game-module.ts contract — not provided">
DECISIONS I MADE THAT COMMAND CENTER SHOULD KNOW:
  - <anything you chose that affects other tasks, e.g. framework picked>
OPEN QUESTIONS:
  - <anything you need a human ruling on>
```

<!-- =================== END LAUNCH PACKET: F1 =================== -->

---

## ▶ F2 — F2 - Database Schema (Supabase / Postgres)

<!-- ============================================================= -->
<!-- LAUNCH PACKET: F2  —  copy everything from the line below   -->
<!-- down to the matching END marker, paste into a brand-new chat.  -->
<!-- ============================================================= -->

You are an execution agent for a software/creative project called **The Arcade Realm**. You are being given exactly ONE task (F2) from a larger build that is coordinated by a separate "command center" chat. You do not need any other conversation or file — this message is fully self-contained. Read it, do the task, and return the outputs and a status line in the format specified at the very end.

Important operating notes for you, the agent:
- The "## Dependencies" section lists ARTIFACTS (files/outputs) produced by other tasks. If a dependency artifact is not provided to you in this chat, ask the human for it before building anything that needs it — or, if it's a contract/spec, ask them to paste it. Do not invent the contents of an upstream contract.
- Follow the "## Output Contract" exactly — those are the files/deliverables you must produce.
- Obey every rule in the SHARED CONTEXT PREAMBLE below, especially the Firewall Doctrine and the zero-IP rule. These are non-negotiable.
- When done, end your final message with the STATUS BLOCK described at the bottom so the human can paste it back to command center.

Here is your complete task specification:

================================================================
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
================================================================

## STATUS BLOCK — paste this back to command center when you finish (or if you're blocked)

```
TASK: F2
STATUS: [DONE | BLOCKED | PARTIAL]
OUTPUTS PRODUCED:
  - <list each file/deliverable you actually created>
DEPENDENCY ARTIFACTS I STILL NEED (if any):
  - <e.g. "F1 game-module.ts contract — not provided">
DECISIONS I MADE THAT COMMAND CENTER SHOULD KNOW:
  - <anything you chose that affects other tasks, e.g. framework picked>
OPEN QUESTIONS:
  - <anything you need a human ruling on>
```

<!-- =================== END LAUNCH PACKET: F2 =================== -->

---

## ▶ F3 — F3 - PWA Shell + Auth + Eligibility-Gating Layer

<!-- ============================================================= -->
<!-- LAUNCH PACKET: F3  —  copy everything from the line below   -->
<!-- down to the matching END marker, paste into a brand-new chat.  -->
<!-- ============================================================= -->

You are an execution agent for a software/creative project called **The Arcade Realm**. You are being given exactly ONE task (F3) from a larger build that is coordinated by a separate "command center" chat. You do not need any other conversation or file — this message is fully self-contained. Read it, do the task, and return the outputs and a status line in the format specified at the very end.

Important operating notes for you, the agent:
- The "## Dependencies" section lists ARTIFACTS (files/outputs) produced by other tasks. If a dependency artifact is not provided to you in this chat, ask the human for it before building anything that needs it — or, if it's a contract/spec, ask them to paste it. Do not invent the contents of an upstream contract.
- Follow the "## Output Contract" exactly — those are the files/deliverables you must produce.
- Obey every rule in the SHARED CONTEXT PREAMBLE below, especially the Firewall Doctrine and the zero-IP rule. These are non-negotiable.
- When done, end your final message with the STATUS BLOCK described at the bottom so the human can paste it back to command center.

Here is your complete task specification:

================================================================
# F3 — PWA Shell + Auth + Eligibility-Gating Layer

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
You are a frontend engineer building the installable app skeleton and a *generic eligibility-gating layer* that serves double duty: venue check-in now, per-jurisdiction feature switches later (Firewall rule 3; doc C2).

## Dependencies
F2 (auth linkage, regions). Coordinate the eligibility-switch interface with C2.

## Task
1. Scaffold a PWA: installable, manifest, Service Worker pre-caching the app shell AND able to pre-cache game bundles by URL (runtime warms them).
2. Auth via Supabase Auth; minimal onboarding (handle + home region).
3. Build the **eligibility-gating layer** as one abstraction: `checkEligibility({ playerId, action, location }) -> { allowed, reason }`, composing:
   - **Venue geofence** (~100m, browser Geolocation).
   - **QR fallback** scanned from a venue tablet — the *trust anchor* (GPS is spoofable).
   - **Jurisdiction switch** (stub now; real spec in C2): is `action` (e.g. 'paid_entry') permitted in this region?
4. Adding a new gate later must be one function, not a refactor.
5. UI states: not-checked-in, checked-in, in-lobby. Keep minimal.

## Output Contract
- `/app/` — PWA shell (document framework choice).
- `/app/lib/eligibility.ts` — gating abstraction + geofence/QR gates; jurisdiction gate stubbed with a clear extension point.
- `/app/sw.js` — Service Worker with app-shell + game-bundle pre-cache.
- `/app/README.md` — how check-in works; how to add a gate.

## Done-Criteria
- Installs to home screen on iOS + Android.
- Check-in works via geofence with QR fallback.
- Jurisdiction gate is a stub but the seam is real (C2 fills it without touching callers).

## Handoff
R1 mounts tournaments inside this shell; C2 implements the jurisdiction gate behind your seam.
================================================================

## STATUS BLOCK — paste this back to command center when you finish (or if you're blocked)

```
TASK: F3
STATUS: [DONE | BLOCKED | PARTIAL]
OUTPUTS PRODUCED:
  - <list each file/deliverable you actually created>
DEPENDENCY ARTIFACTS I STILL NEED (if any):
  - <e.g. "F1 game-module.ts contract — not provided">
DECISIONS I MADE THAT COMMAND CENTER SHOULD KNOW:
  - <anything you chose that affects other tasks, e.g. framework picked>
OPEN QUESTIONS:
  - <anything you need a human ruling on>
```

<!-- =================== END LAUNCH PACKET: F3 =================== -->

---

## ▶ F4 — F4 - Two Reference Games (Ground-Truth Corpus)

<!-- ============================================================= -->
<!-- LAUNCH PACKET: F4  —  copy everything from the line below   -->
<!-- down to the matching END marker, paste into a brand-new chat.  -->
<!-- ============================================================= -->

You are an execution agent for a software/creative project called **The Arcade Realm**. You are being given exactly ONE task (F4) from a larger build that is coordinated by a separate "command center" chat. You do not need any other conversation or file — this message is fully self-contained. Read it, do the task, and return the outputs and a status line in the format specified at the very end.

Important operating notes for you, the agent:
- The "## Dependencies" section lists ARTIFACTS (files/outputs) produced by other tasks. If a dependency artifact is not provided to you in this chat, ask the human for it before building anything that needs it — or, if it's a contract/spec, ask them to paste it. Do not invent the contents of an upstream contract.
- Follow the "## Output Contract" exactly — those are the files/deliverables you must produce.
- Obey every rule in the SHARED CONTEXT PREAMBLE below, especially the Firewall Doctrine and the zero-IP rule. These are non-negotiable.
- When done, end your final message with the STATUS BLOCK described at the bottom so the human can paste it back to command center.

Here is your complete task specification:

================================================================
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
================================================================

## STATUS BLOCK — paste this back to command center when you finish (or if you're blocked)

```
TASK: F4
STATUS: [DONE | BLOCKED | PARTIAL]
OUTPUTS PRODUCED:
  - <list each file/deliverable you actually created>
DEPENDENCY ARTIFACTS I STILL NEED (if any):
  - <e.g. "F1 game-module.ts contract — not provided">
DECISIONS I MADE THAT COMMAND CENTER SHOULD KNOW:
  - <anything you chose that affects other tasks, e.g. framework picked>
OPEN QUESTIONS:
  - <anything you need a human ruling on>
```

<!-- =================== END LAUNCH PACKET: F4 =================== -->

---

## ▶ R1 — R1 - Tournament Orchestrator State Machine

<!-- ============================================================= -->
<!-- LAUNCH PACKET: R1  —  copy everything from the line below   -->
<!-- down to the matching END marker, paste into a brand-new chat.  -->
<!-- ============================================================= -->

You are an execution agent for a software/creative project called **The Arcade Realm**. You are being given exactly ONE task (R1) from a larger build that is coordinated by a separate "command center" chat. You do not need any other conversation or file — this message is fully self-contained. Read it, do the task, and return the outputs and a status line in the format specified at the very end.

Important operating notes for you, the agent:
- The "## Dependencies" section lists ARTIFACTS (files/outputs) produced by other tasks. If a dependency artifact is not provided to you in this chat, ask the human for it before building anything that needs it — or, if it's a contract/spec, ask them to paste it. Do not invent the contents of an upstream contract.
- Follow the "## Output Contract" exactly — those are the files/deliverables you must produce.
- Obey every rule in the SHARED CONTEXT PREAMBLE below, especially the Firewall Doctrine and the zero-IP rule. These are non-negotiable.
- When done, end your final message with the STATUS BLOCK described at the bottom so the human can paste it back to command center.

Here is your complete task specification:

================================================================
# R1 — Tournament Orchestrator State Machine

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
You are a backend engineer building the server-authoritative orchestrator that sequences a tournament session. The client renders; the server decides. Players must not be able to influence flow, game selection, or scoring from the client.

## Dependencies
F1 (contract), F2 (tournaments/rounds/scores tables), F3 (app shell to mount into), F4 (reference games to run). Selection logic also reads game_pool once the Factory fills it.

## Task
1. Implement the session state machine in Supabase Edge Functions (Deno): `CHECK_IN → LOBBY(90s) → ROUND_1 → INTERMISSION → BONUS → ROUND_2 → INTERMISSION → FINAL_LEADERBOARD`.
2. **Game selection logic** (the convergence point of Factory + Lore): pull games from `game_pool` (status='active') that (a) match the *active lore arc's* theme tags when set, (b) vary controlScheme round-to-round (no two same-scheme games consecutively), (c) respect a difficulty curve across rounds, (d) exclude games the player saw recently. Fall back to reference games if the pool is thin.
3. Each round writes a `tournament_rounds` row with a freshly generated `seed` and `speed_multiplier`; the SAME seed is broadcast to all players in that tournament (fairness).
4. Broadcast round start / intermission / results over Supabase Realtime channels.
5. Intermissions invoke: a 15s ad slot, the Prize Chest (R4), a lore beat (L-layer hook — emit an event the lore service can fill).
6. The bonus mini-game uses round-currency (R3 owns the currency; orchestrator just sequences it).
7. Server is the only writer of authoritative state; clients send scores+logs to R2 for validation.

## Output Contract
- `/runtime/orchestrator/` — Edge Functions implementing the state machine.
- `/runtime/orchestrator/selection.ts` — the game-selection algorithm, documented.
- `/runtime/orchestrator/README.md` — state diagram + how Lore/Prize-Chest hooks fire.

## Done-Criteria
- A full session runs end-to-end with the two reference games.
- Same seed reaches all players in a round; no two consecutive same-scheme games.
- Lore-beat and Prize-Chest hooks emit events even before those services are built (no-op safe).

## Handoff
R2 validates scores it receives; R3 renders the leaderboard from results; R4 fills the Prize-Chest hook; L5 fills the lore-beat hook.
================================================================

## STATUS BLOCK — paste this back to command center when you finish (or if you're blocked)

```
TASK: R1
STATUS: [DONE | BLOCKED | PARTIAL]
OUTPUTS PRODUCED:
  - <list each file/deliverable you actually created>
DEPENDENCY ARTIFACTS I STILL NEED (if any):
  - <e.g. "F1 game-module.ts contract — not provided">
DECISIONS I MADE THAT COMMAND CENTER SHOULD KNOW:
  - <anything you chose that affects other tasks, e.g. framework picked>
OPEN QUESTIONS:
  - <anything you need a human ruling on>
```

<!-- =================== END LAUNCH PACKET: R1 =================== -->

---

## ▶ R2 — R2 - Score Validation + Percentile Normalizer

<!-- ============================================================= -->
<!-- LAUNCH PACKET: R2  —  copy everything from the line below   -->
<!-- down to the matching END marker, paste into a brand-new chat.  -->
<!-- ============================================================= -->

You are an execution agent for a software/creative project called **The Arcade Realm**. You are being given exactly ONE task (R2) from a larger build that is coordinated by a separate "command center" chat. You do not need any other conversation or file — this message is fully self-contained. Read it, do the task, and return the outputs and a status line in the format specified at the very end.

Important operating notes for you, the agent:
- The "## Dependencies" section lists ARTIFACTS (files/outputs) produced by other tasks. If a dependency artifact is not provided to you in this chat, ask the human for it before building anything that needs it — or, if it's a contract/spec, ask them to paste it. Do not invent the contents of an upstream contract.
- Follow the "## Output Contract" exactly — those are the files/deliverables you must produce.
- Obey every rule in the SHARED CONTEXT PREAMBLE below, especially the Firewall Doctrine and the zero-IP rule. These are non-negotiable.
- When done, end your final message with the STATUS BLOCK described at the bottom so the human can paste it back to command center.

Here is your complete task specification:

================================================================
# R2 — Score Validation + Percentile Normalizer

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
You are a backend engineer implementing anti-cheat and fair cross-game scoring. This is what makes "mix a reflex game and a memory maze in one tournament" fair, and what kills most cheating cheaply.

## Dependencies
F1 (determinism + normalizer contract), F2 (scores table). Consumes input logs produced by games + clients.

## Task
1. **Replay validator**: given `(gameId, seed, inputLog, claimedRawScore)`, re-run the game headlessly with that seed + input log and confirm the resulting score matches the claim. Mismatch ⇒ mark `validated=false`, discard from ranking. This is cheap *because* games are deterministic (F1).
2. **Percentile normalizer**: implement the F1 contract — `normalize(gameId, rawScore) -> 0–100` against that game's historical raw-score distribution. Maintain per-game distributions incrementally (don't recompute from scratch each time).
3. **Cold-start rule**: implement exactly what F1 specified for games with little/no history (e.g. provisional percentile + flag until N scores exist).
4. Tournament points come from **percentile**, never raw score — so a tapper and a maze are comparable.
5. Expose validation + normalization as functions R1/R3 call; never trust a client-supplied percentile.

## Output Contract
- `/runtime/scoring/validator.ts` — replay validation.
- `/runtime/scoring/normalizer.ts` — percentile implementation of the F1 contract + cold-start.
- `/runtime/scoring/README.md` — how validation defeats cheating; how distributions are maintained.

## Done-Criteria
- A tampered score (good seed, inconsistent log) is caught and discarded.
- Two different games produce comparable percentiles for equivalently-skilled play.
- Distributions update incrementally without full recompute.

## Handoff
R3 ranks players by validated percentile points; G3's skill-gradient stats can reuse the distribution machinery; C3 references the validator as part of the skill-evidence record.
================================================================

## STATUS BLOCK — paste this back to command center when you finish (or if you're blocked)

```
TASK: R2
STATUS: [DONE | BLOCKED | PARTIAL]
OUTPUTS PRODUCED:
  - <list each file/deliverable you actually created>
DEPENDENCY ARTIFACTS I STILL NEED (if any):
  - <e.g. "F1 game-module.ts contract — not provided">
DECISIONS I MADE THAT COMMAND CENTER SHOULD KNOW:
  - <anything you chose that affects other tasks, e.g. framework picked>
OPEN QUESTIONS:
  - <anything you need a human ruling on>
```

<!-- =================== END LAUNCH PACKET: R2 =================== -->

---

## ▶ R3 — R3 - Real-Time Leaderboard + Rank-Tokens

<!-- ============================================================= -->
<!-- LAUNCH PACKET: R3  —  copy everything from the line below   -->
<!-- down to the matching END marker, paste into a brand-new chat.  -->
<!-- ============================================================= -->

You are an execution agent for a software/creative project called **The Arcade Realm**. You are being given exactly ONE task (R3) from a larger build that is coordinated by a separate "command center" chat. You do not need any other conversation or file — this message is fully self-contained. Read it, do the task, and return the outputs and a status line in the format specified at the very end.

Important operating notes for you, the agent:
- The "## Dependencies" section lists ARTIFACTS (files/outputs) produced by other tasks. If a dependency artifact is not provided to you in this chat, ask the human for it before building anything that needs it — or, if it's a contract/spec, ask them to paste it. Do not invent the contents of an upstream contract.
- Follow the "## Output Contract" exactly — those are the files/deliverables you must produce.
- Obey every rule in the SHARED CONTEXT PREAMBLE below, especially the Firewall Doctrine and the zero-IP rule. These are non-negotiable.
- When done, end your final message with the STATUS BLOCK described at the bottom so the human can paste it back to command center.

Here is your complete task specification:

================================================================
# R3 — Real-Time Leaderboard + Rank-Tokens

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
You are a backend+frontend engineer building the status engine: live leaderboards (the core incentive) and rank-tokens (persistent status currency). Per the Firewall Doctrine, rank-tokens are NON-CONVERTIBLE — they create standing, never a payout.

## Dependencies
F2 (rank_tokens, scores), R2 (validated percentile points). Real-time via Supabase Realtime.

## Task
1. **Live leaderboard**: during a tournament, rank players by validated percentile points in real time (Realtime channel). After the session, persist standings.
2. **Multi-scope leaderboards**: per-venue, per-region/city, and (later) cross-region. The city leaderboard is the social hook ("Top 5 in my city").
3. **Round currency**: ephemeral, earned/spent within a session for wagers + the bonus mini-game; resets each session.
4. **Rank-tokens**: persistent status currency awarded for ranking. Enforce in code AND copy that they are non-convertible and never redeemable for money/crypto. They may later make a player *eligible* for rewards (eligibility ≠ entitlement) — never wire them to currency.
5. Surface shareable artifacts (screenshot-friendly rank cards) — this drives grassroots growth.

## Output Contract
- `/runtime/leaderboard/` — real-time + persisted leaderboard logic.
- `/runtime/currency/round-currency.ts` and `/runtime/currency/rank-tokens.ts`.
- `/runtime/leaderboard/README.md` — scopes, currency rules, and the non-convertibility firewall note.

## Done-Criteria
- Live leaderboard updates within a round as scores validate.
- City-scope leaderboard renders and is shareable.
- Code path for converting rank-tokens to money/crypto does not exist (by design).

## Handoff
R4's Prize Chest reads eligibility from standings; L5 can mythologize top players/streaks; Ecosystem-B prizes (later) reference rank for winner selection.
================================================================

## STATUS BLOCK — paste this back to command center when you finish (or if you're blocked)

```
TASK: R3
STATUS: [DONE | BLOCKED | PARTIAL]
OUTPUTS PRODUCED:
  - <list each file/deliverable you actually created>
DEPENDENCY ARTIFACTS I STILL NEED (if any):
  - <e.g. "F1 game-module.ts contract — not provided">
DECISIONS I MADE THAT COMMAND CENTER SHOULD KNOW:
  - <anything you chose that affects other tasks, e.g. framework picked>
OPEN QUESTIONS:
  - <anything you need a human ruling on>
```

<!-- =================== END LAUNCH PACKET: R3 =================== -->

---

## ▶ R4 — R4 - Prize Chest (Preference Data Engine)

<!-- ============================================================= -->
<!-- LAUNCH PACKET: R4  —  copy everything from the line below   -->
<!-- down to the matching END marker, paste into a brand-new chat.  -->
<!-- ============================================================= -->

You are an execution agent for a software/creative project called **The Arcade Realm**. You are being given exactly ONE task (R4) from a larger build that is coordinated by a separate "command center" chat. You do not need any other conversation or file — this message is fully self-contained. Read it, do the task, and return the outputs and a status line in the format specified at the very end.

Important operating notes for you, the agent:
- The "## Dependencies" section lists ARTIFACTS (files/outputs) produced by other tasks. If a dependency artifact is not provided to you in this chat, ask the human for it before building anything that needs it — or, if it's a contract/spec, ask them to paste it. Do not invent the contents of an upstream contract.
- Follow the "## Output Contract" exactly — those are the files/deliverables you must produce.
- Obey every rule in the SHARED CONTEXT PREAMBLE below, especially the Firewall Doctrine and the zero-IP rule. These are non-negotiable.
- When done, end your final message with the STATUS BLOCK described at the bottom so the human can paste it back to command center.

Here is your complete task specification:

================================================================
# R4 — Prize Chest (Preference Data Engine)

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
You are a product engineer building the intermission "Prize Chest" — the explicit-intent data-capture moment, framed in-world so it reads as quest progression, not a survey. This is the future ad/data upsell, captured relationally from day one even before monetization.

## Dependencies
F2 (prize_chest_events), R1 (intermission hook). In-world framing coordinates with the Lore Layer tone.

## Task
1. During intermissions, present the Prize Chest: player earns "keys", unlocks a category (Tech / Fashion / Food & Drink / Gaming Gear / Experiences), then picks a specific item from 2–3 options.
2. **In-world framing**: not "pick a prize" — frame as "choose which Cache to pledge toward" (ties data capture to narrative; feels like progressing the quest). Coordinate exact wording with L-layer.
3. **Capture relationally** (F2 `prize_chest_events`): category chosen, specific item chosen, plus joinable context (which game preceded it, time of day, region) so future cross-tab questions are answerable — e.g. "racing-game players → which beverage". Do NOT pre-aggregate; store the events.
4. **Privacy + Firewall**: this is preference data, never PII sale. No copy may imply the chosen prize is owed or guaranteed (eligibility ≠ entitlement). The Prize Chest is data capture + aspiration, not a prize promise.
5. Keep latency low; it runs inside a 15s-ish window.

## Output Contract
- `/runtime/prize-chest/` — the capture flow + UI.
- `/runtime/prize-chest/schema-notes.md` — what is stored and how it joins for cross-tab analysis later.
- `/runtime/prize-chest/README.md` — in-world framing + privacy/firewall rules.

## Done-Criteria
- Choices persist as relational events with joinable context.
- Framing reads as quest progression and never promises a specific prize.
- A sample cross-tab query (game-type → item preference) runs against captured data.

## Handoff
Future Ecosystem-B/C analytics + the eventual data-insights upsell consume these events; L-layer aligns the Cache framing with active arcs.
================================================================

## STATUS BLOCK — paste this back to command center when you finish (or if you're blocked)

```
TASK: R4
STATUS: [DONE | BLOCKED | PARTIAL]
OUTPUTS PRODUCED:
  - <list each file/deliverable you actually created>
DEPENDENCY ARTIFACTS I STILL NEED (if any):
  - <e.g. "F1 game-module.ts contract — not provided">
DECISIONS I MADE THAT COMMAND CENTER SHOULD KNOW:
  - <anything you chose that affects other tasks, e.g. framework picked>
OPEN QUESTIONS:
  - <anything you need a human ruling on>
```

<!-- =================== END LAUNCH PACKET: R4 =================== -->

---

## ▶ G1 — G1 - Generation Agent Brief

<!-- ============================================================= -->
<!-- LAUNCH PACKET: G1  —  copy everything from the line below   -->
<!-- down to the matching END marker, paste into a brand-new chat.  -->
<!-- ============================================================= -->

You are an execution agent for a software/creative project called **The Arcade Realm**. You are being given exactly ONE task (G1) from a larger build that is coordinated by a separate "command center" chat. You do not need any other conversation or file — this message is fully self-contained. Read it, do the task, and return the outputs and a status line in the format specified at the very end.

Important operating notes for you, the agent:
- The "## Dependencies" section lists ARTIFACTS (files/outputs) produced by other tasks. If a dependency artifact is not provided to you in this chat, ask the human for it before building anything that needs it — or, if it's a contract/spec, ask them to paste it. Do not invent the contents of an upstream contract.
- Follow the "## Output Contract" exactly — those are the files/deliverables you must produce.
- Obey every rule in the SHARED CONTEXT PREAMBLE below, especially the Firewall Doctrine and the zero-IP rule. These are non-negotiable.
- When done, end your final message with the STATUS BLOCK described at the bottom so the human can paste it back to command center.

Here is your complete task specification:

================================================================
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
================================================================

## STATUS BLOCK — paste this back to command center when you finish (or if you're blocked)

```
TASK: G1
STATUS: [DONE | BLOCKED | PARTIAL]
OUTPUTS PRODUCED:
  - <list each file/deliverable you actually created>
DEPENDENCY ARTIFACTS I STILL NEED (if any):
  - <e.g. "F1 game-module.ts contract — not provided">
DECISIONS I MADE THAT COMMAND CENTER SHOULD KNOW:
  - <anything you chose that affects other tasks, e.g. framework picked>
OPEN QUESTIONS:
  - <anything you need a human ruling on>
```

<!-- =================== END LAUNCH PACKET: G1 =================== -->

---

## ▶ G2 — G2 - Sandbox + Compile Gate

<!-- ============================================================= -->
<!-- LAUNCH PACKET: G2  —  copy everything from the line below   -->
<!-- down to the matching END marker, paste into a brand-new chat.  -->
<!-- ============================================================= -->

You are an execution agent for a software/creative project called **The Arcade Realm**. You are being given exactly ONE task (G2) from a larger build that is coordinated by a separate "command center" chat. You do not need any other conversation or file — this message is fully self-contained. Read it, do the task, and return the outputs and a status line in the format specified at the very end.

Important operating notes for you, the agent:
- The "## Dependencies" section lists ARTIFACTS (files/outputs) produced by other tasks. If a dependency artifact is not provided to you in this chat, ask the human for it before building anything that needs it — or, if it's a contract/spec, ask them to paste it. Do not invent the contents of an upstream contract.
- Follow the "## Output Contract" exactly — those are the files/deliverables you must produce.
- Obey every rule in the SHARED CONTEXT PREAMBLE below, especially the Firewall Doctrine and the zero-IP rule. These are non-negotiable.
- When done, end your final message with the STATUS BLOCK described at the bottom so the human can paste it back to command center.

Here is your complete task specification:

================================================================
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
================================================================

## STATUS BLOCK — paste this back to command center when you finish (or if you're blocked)

```
TASK: G2
STATUS: [DONE | BLOCKED | PARTIAL]
OUTPUTS PRODUCED:
  - <list each file/deliverable you actually created>
DEPENDENCY ARTIFACTS I STILL NEED (if any):
  - <e.g. "F1 game-module.ts contract — not provided">
DECISIONS I MADE THAT COMMAND CENTER SHOULD KNOW:
  - <anything you chose that affects other tasks, e.g. framework picked>
OPEN QUESTIONS:
  - <anything you need a human ruling on>
```

<!-- =================== END LAUNCH PACKET: G2 =================== -->

---

## ▶ G3 — G3 - Bot-Playtest Harness (Skill-Profile Bots)

<!-- ============================================================= -->
<!-- LAUNCH PACKET: G3  —  copy everything from the line below   -->
<!-- down to the matching END marker, paste into a brand-new chat.  -->
<!-- ============================================================= -->

You are an execution agent for a software/creative project called **The Arcade Realm**. You are being given exactly ONE task (G3) from a larger build that is coordinated by a separate "command center" chat. You do not need any other conversation or file — this message is fully self-contained. Read it, do the task, and return the outputs and a status line in the format specified at the very end.

Important operating notes for you, the agent:
- The "## Dependencies" section lists ARTIFACTS (files/outputs) produced by other tasks. If a dependency artifact is not provided to you in this chat, ask the human for it before building anything that needs it — or, if it's a contract/spec, ask them to paste it. Do not invent the contents of an upstream contract.
- Follow the "## Output Contract" exactly — those are the files/deliverables you must produce.
- Obey every rule in the SHARED CONTEXT PREAMBLE below, especially the Firewall Doctrine and the zero-IP rule. These are non-negotiable.
- When done, end your final message with the STATUS BLOCK described at the bottom so the human can paste it back to command center.

Here is your complete task specification:

================================================================
# G3 — Bot-Playtest Harness (Skill-Profile Bots)

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
You are building the cleverest stage: synthetic players that play each candidate hundreds of times to verify it is actually playable AND has a skill gradient. This is what lets the Factory run 24/7 with no humans — and it doubles as the legal evidence that games are skill-based (see C3).

## Dependencies
G2 (sandboxed survivors). F1 (deterministic seeds make reproducible bot runs possible). Reuses R2's distribution machinery if convenient.

## Task
1. For each candidate, run three **skill-profile bots** over many seeded playthroughs:
   - **Random bot** — random valid inputs.
   - **Greedy-heuristic bot** — simple sensible strategy.
   - **Near-optimal bot** — strong play. (Ask the generation agent to also emit a simple controller for its own game; if absent, use a generic heuristic per controlScheme.)
2. Compute the **skill gradient**: optimal-score minus random-score spread, plus score variance and completion rate, across the runs.
3. **Reject luck-not-skill games**: if random ≈ optimal (no meaningful gradient), reject. This keeps the pool skill-based — quality AND legal (predominance-of-skill).
4. Produce a per-candidate stats record: skill gradient, variance, completion rate, frame stability.
5. Because seeds are deterministic (F1), all of this is reproducible — store seeds used so any result can be re-verified.

## Output Contract
- `/factory/playtest/` — the harness + the three bot profiles.
- `/factory/playtest/stats-schema.ts` — the per-candidate stats record (this becomes the C3 compliance artifact).
- `/factory/playtest/README.md` — bot profiles, the skill-gradient definition, and why reproducibility matters.

## Done-Criteria
- Each survivor gets a reproducible stats record.
- A pure-luck game (random ≈ optimal) is rejected.
- Stored seeds allow re-verification of any playtest result.

## Handoff
G4 folds these stats into the quality score. C3 packages the skill-gradient records as the skill-vs-chance evidence base.
================================================================

## STATUS BLOCK — paste this back to command center when you finish (or if you're blocked)

```
TASK: G3
STATUS: [DONE | BLOCKED | PARTIAL]
OUTPUTS PRODUCED:
  - <list each file/deliverable you actually created>
DEPENDENCY ARTIFACTS I STILL NEED (if any):
  - <e.g. "F1 game-module.ts contract — not provided">
DECISIONS I MADE THAT COMMAND CENTER SHOULD KNOW:
  - <anything you chose that affects other tasks, e.g. framework picked>
OPEN QUESTIONS:
  - <anything you need a human ruling on>
```

<!-- =================== END LAUNCH PACKET: G3 =================== -->

---

## ▶ G4 — G4 - Quality Scoring (Auto-Metrics + LLM Judge)

<!-- ============================================================= -->
<!-- LAUNCH PACKET: G4  —  copy everything from the line below   -->
<!-- down to the matching END marker, paste into a brand-new chat.  -->
<!-- ============================================================= -->

You are an execution agent for a software/creative project called **The Arcade Realm**. You are being given exactly ONE task (G4) from a larger build that is coordinated by a separate "command center" chat. You do not need any other conversation or file — this message is fully self-contained. Read it, do the task, and return the outputs and a status line in the format specified at the very end.

Important operating notes for you, the agent:
- The "## Dependencies" section lists ARTIFACTS (files/outputs) produced by other tasks. If a dependency artifact is not provided to you in this chat, ask the human for it before building anything that needs it — or, if it's a contract/spec, ask them to paste it. Do not invent the contents of an upstream contract.
- Follow the "## Output Contract" exactly — those are the files/deliverables you must produce.
- Obey every rule in the SHARED CONTEXT PREAMBLE below, especially the Firewall Doctrine and the zero-IP rule. These are non-negotiable.
- When done, end your final message with the STATUS BLOCK described at the bottom so the human can paste it back to command center.

Here is your complete task specification:

================================================================
# G4 — Quality Scoring (Auto-Metrics + LLM Judge)

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
You are building the stage that decides if a candidate is *fun and good*, combining objective metrics with an LLM judge. Below threshold ⇒ archived (not deleted — archives are future mutation parents).

## Dependencies
G3 (skill-gradient + stability stats). G2 (the runnable bundle for the judge to play/inspect).

## Task
1. **Auto-metrics** (from G3 + sandbox): skill gradient, score variance, completion rate, frame stability. Normalize into a composite.
2. **LLM judge**: an agent plays or reviews the game and rates *fun*, *clarity*, and *surprise factor* (1–10 each) with brief rationale.
3. Combine auto-metrics + judge into a single **quality_score**.
4. **Threshold + archive**: below threshold ⇒ status 'retired'/archived (kept as a mutation parent for G1's "evolve" directive). At/above ⇒ pass to G5/G6.
5. Make the threshold tunable; track the distribution of quality_scores over time to recalibrate.

## Output Contract
- `/factory/quality/` — scoring service.
- `/factory/quality/judge-prompt/` — the LLM-judge prompt + rubric.
- `/factory/quality/README.md` — metric weights, threshold policy, archive-as-parent rationale.

## Done-Criteria
- Every candidate gets a quality_score combining objective + judged signals.
- Sub-threshold games are archived (recoverable), not destroyed.
- Threshold is tunable and score distribution is observable.

## Handoff
G5 audits provenance/similarity; G6 promotes survivors. Archived games return to G1 as evolve-parents.
================================================================

## STATUS BLOCK — paste this back to command center when you finish (or if you're blocked)

```
TASK: G4
STATUS: [DONE | BLOCKED | PARTIAL]
OUTPUTS PRODUCED:
  - <list each file/deliverable you actually created>
DEPENDENCY ARTIFACTS I STILL NEED (if any):
  - <e.g. "F1 game-module.ts contract — not provided">
DECISIONS I MADE THAT COMMAND CENTER SHOULD KNOW:
  - <anything you chose that affects other tasks, e.g. framework picked>
OPEN QUESTIONS:
  - <anything you need a human ruling on>
```

<!-- =================== END LAUNCH PACKET: G4 =================== -->

---

## ▶ G5 — G5 - Provenance / License + Similarity Gates

<!-- ============================================================= -->
<!-- LAUNCH PACKET: G5  —  copy everything from the line below   -->
<!-- down to the matching END marker, paste into a brand-new chat.  -->
<!-- ============================================================= -->

You are an execution agent for a software/creative project called **The Arcade Realm**. You are being given exactly ONE task (G5) from a larger build that is coordinated by a separate "command center" chat. You do not need any other conversation or file — this message is fully self-contained. Read it, do the task, and return the outputs and a status line in the format specified at the very end.

Important operating notes for you, the agent:
- The "## Dependencies" section lists ARTIFACTS (files/outputs) produced by other tasks. If a dependency artifact is not provided to you in this chat, ask the human for it before building anything that needs it — or, if it's a contract/spec, ask them to paste it. Do not invent the contents of an upstream contract.
- Follow the "## Output Contract" exactly — those are the files/deliverables you must produce.
- Obey every rule in the SHARED CONTEXT PREAMBLE below, especially the Firewall Doctrine and the zero-IP rule. These are non-negotiable.
- When done, end your final message with the STATUS BLOCK described at the bottom so the human can paste it back to command center.

Here is your complete task specification:

================================================================
# G5 — Provenance / License + Similarity Gates

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
You are building the legal-cleanliness gates: verify every dependency is permissively licensed, and reject anything that resembles a known commercial game or duplicates the existing pool. This is the technical backbone of the zero-IP rule and a real defensibility asset.

## Dependencies
G1 (the `provenance.json` per candidate). A maintained registry of known-game signatures + the current pool for self-comparison.

## Task
1. **Provenance + license audit**: parse `provenance.json`; verify every dependency is on the allowlist (MIT/Apache/CC0). Reject unknown/again-licensed deps. No provenance ⇒ automatic reject.
2. **Similarity check**: compute a mechanic + visual signature for the candidate; compare against (a) a registry of known commercial games (reject clones — protects IP-cleanliness) and (b) the existing active pool (reject near-duplicates — protects surprise/variety).
3. Reject any asset that reads as a recognizable character/brand.
4. Log rejections with reasons; flag borderline cases for the human spot-gate (G6).
5. **This gate is non-optional.** An autonomous codegen pipeline can inadvertently reproduce copyrighted patterns; this is what keeps "agents build games forever" from becoming a liability.

## Output Contract
- `/factory/audit/` — provenance + license auditor.
- `/factory/audit/similarity.ts` — signature computation + comparison.
- `/factory/audit/known-signatures/` — the registry (seed it; document how to extend).
- `/factory/audit/README.md` — allowlist policy, similarity method, why this gate is mandatory.

## Done-Criteria
- A candidate with a non-allowlisted dependency is rejected.
- A near-duplicate of a pool game and a clone of a known title are both caught.
- No-provenance candidates never proceed.

## Handoff
G6 promotes only candidates that clear this gate; borderline cases route to the human spot-gate.
================================================================

## STATUS BLOCK — paste this back to command center when you finish (or if you're blocked)

```
TASK: G5
STATUS: [DONE | BLOCKED | PARTIAL]
OUTPUTS PRODUCED:
  - <list each file/deliverable you actually created>
DEPENDENCY ARTIFACTS I STILL NEED (if any):
  - <e.g. "F1 game-module.ts contract — not provided">
DECISIONS I MADE THAT COMMAND CENTER SHOULD KNOW:
  - <anything you chose that affects other tasks, e.g. framework picked>
OPEN QUESTIONS:
  - <anything you need a human ruling on>
```

<!-- =================== END LAUNCH PACKET: G5 =================== -->

---

## ▶ G6 — G6 - Human Spot-Gate + Promotion to Pool

<!-- ============================================================= -->
<!-- LAUNCH PACKET: G6  —  copy everything from the line below   -->
<!-- down to the matching END marker, paste into a brand-new chat.  -->
<!-- ============================================================= -->

You are an execution agent for a software/creative project called **The Arcade Realm**. You are being given exactly ONE task (G6) from a larger build that is coordinated by a separate "command center" chat. You do not need any other conversation or file — this message is fully self-contained. Read it, do the task, and return the outputs and a status line in the format specified at the very end.

Important operating notes for you, the agent:
- The "## Dependencies" section lists ARTIFACTS (files/outputs) produced by other tasks. If a dependency artifact is not provided to you in this chat, ask the human for it before building anything that needs it — or, if it's a contract/spec, ask them to paste it. Do not invent the contents of an upstream contract.
- Follow the "## Output Contract" exactly — those are the files/deliverables you must produce.
- Obey every rule in the SHARED CONTEXT PREAMBLE below, especially the Firewall Doctrine and the zero-IP rule. These are non-negotiable.
- When done, end your final message with the STATUS BLOCK described at the bottom so the human can paste it back to command center.

Here is your complete task specification:

================================================================
# G6 — Human Spot-Gate + Promotion to Pool

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
You are building the only stage with a human in the loop — and deliberately a *light* one. Per the core principle, humans own taste, not throughput. You sample rather than review everything, and shrink the sample as the quality model proves itself.

## Dependencies
G4 (quality_score), G5 (cleared provenance/similarity), F2 (game_pool + game_provenance to write into).

## Task
1. Build a lightweight **review queue UI**: shows a candidate, its quality_score, skill-gradient stats, judge rationale, and lets a human approve/reject quickly (playable inline).
2. **Sampling policy**: auto-queue (a) a random 10–20% of above-threshold candidates and (b) all candidates near the threshold or flagged borderline by G5. The rest auto-promote.
3. **Promotion**: on approval (or auto-promote), write the game to `game_pool` with status='active', tagged by theme/difficulty/controlScheme, AND write the `game_provenance` row (F2 requires it before 'active').
4. **Adaptive sample**: track human-agreement rate with the quality model; as agreement stays high, reduce the random-sample percentage. Document the policy so the human bottleneck keeps shrinking.

## Output Contract
- `/factory/spot-gate/` — the review queue UI + promotion logic.
- `/factory/spot-gate/sampling-policy.md` — the sampling + adaptive-shrink rules.
- `/factory/spot-gate/README.md` — how promotion writes pool + provenance atomically.

## Done-Criteria
- Above-threshold games auto-promote except the sampled fraction.
- Promotion always writes game_provenance (game can't be 'active' without it).
- Sample size provably shrinks as model agreement rises.

## Handoff
The Tournament Runtime (R1 selection) now has live games to pull. G7 watches them in real play.
================================================================

## STATUS BLOCK — paste this back to command center when you finish (or if you're blocked)

```
TASK: G6
STATUS: [DONE | BLOCKED | PARTIAL]
OUTPUTS PRODUCED:
  - <list each file/deliverable you actually created>
DEPENDENCY ARTIFACTS I STILL NEED (if any):
  - <e.g. "F1 game-module.ts contract — not provided">
DECISIONS I MADE THAT COMMAND CENTER SHOULD KNOW:
  - <anything you chose that affects other tasks, e.g. framework picked>
OPEN QUESTIONS:
  - <anything you need a human ruling on>
```

<!-- =================== END LAUNCH PACKET: G6 =================== -->

---

## ▶ G7 — G7 - Live Telemetry + Evolve/Retire Loop

<!-- ============================================================= -->
<!-- LAUNCH PACKET: G7  —  copy everything from the line below   -->
<!-- down to the matching END marker, paste into a brand-new chat.  -->
<!-- ============================================================= -->

You are an execution agent for a software/creative project called **The Arcade Realm**. You are being given exactly ONE task (G7) from a larger build that is coordinated by a separate "command center" chat. You do not need any other conversation or file — this message is fully self-contained. Read it, do the task, and return the outputs and a status line in the format specified at the very end.

Important operating notes for you, the agent:
- The "## Dependencies" section lists ARTIFACTS (files/outputs) produced by other tasks. If a dependency artifact is not provided to you in this chat, ask the human for it before building anything that needs it — or, if it's a contract/spec, ask them to paste it. Do not invent the contents of an upstream contract.
- Follow the "## Output Contract" exactly — those are the files/deliverables you must produce.
- Obey every rule in the SHARED CONTEXT PREAMBLE below, especially the Firewall Doctrine and the zero-IP rule. These are non-negotiable.
- When done, end your final message with the STATUS BLOCK described at the bottom so the human can paste it back to command center.

Here is your complete task specification:

================================================================
# G7 — Live Telemetry + Evolve/Retire Loop

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
You are building the genetic loop that makes the pool *improve on its own*. Once real humans play promoted games, you capture how they perform, mythologize the winners (lore hook), evolve them into variants, and retire the duds. This is what keeps "surprise" alive long-term.

## Dependencies
G6 (live games in the pool), real player sessions via the Runtime, G1 (to feed evolve-parents back in). Game lineage data feeds L4/L5.

## Task
1. **Live telemetry**: per active game, capture rage-quits, replay rate, score distribution, and "fun" signals (do players seek it out?).
2. **Evolve**: best performers become **mutation parents** — emit "evolve <gameId>" briefs to G1 ("produce N variants of this loved game"). Track `parentLineage` so the family tree is explicit.
3. **Retire**: underperformers get status='retired' (recoverable as parents).
4. **Lore hook**: surface cult-favorite games and notable lineages to the Lore Layer (L4 Loremaster) so popular games get mythologized and the game family-tree becomes in-world history.
5. Close the loop: this runs continuously, so the pool freshens and quality compounds without manual curation.

## Output Contract
- `/factory/telemetry/` — live metric capture.
- `/factory/evolve/` — parent-selection + evolve-brief emission to G1.
- `/factory/telemetry/README.md` — metrics defined, evolve/retire policy, the lineage→lore hook.

## Done-Criteria
- Active games accrue real-play telemetry.
- A loved game spawns evolve-variants via G1; lineage is tracked.
- Cult favorites + lineages are exposed to the Lore Layer.

## Handoff
G1 generates variants from evolve-parents (loop closes). L4/L5 turn lineage + cult favorites into canon.
================================================================

## STATUS BLOCK — paste this back to command center when you finish (or if you're blocked)

```
TASK: G7
STATUS: [DONE | BLOCKED | PARTIAL]
OUTPUTS PRODUCED:
  - <list each file/deliverable you actually created>
DEPENDENCY ARTIFACTS I STILL NEED (if any):
  - <e.g. "F1 game-module.ts contract — not provided">
DECISIONS I MADE THAT COMMAND CENTER SHOULD KNOW:
  - <anything you chose that affects other tasks, e.g. framework picked>
OPEN QUESTIONS:
  - <anything you need a human ruling on>
```

<!-- =================== END LAUNCH PACKET: G7 =================== -->

---

## ▶ L1 — L1 - Lore Bible (HUMAN-AUTHORED)

<!-- ============================================================= -->
<!-- LAUNCH PACKET: L1  —  copy everything from the line below   -->
<!-- down to the matching END marker, paste into a brand-new chat.  -->
<!-- ============================================================= -->

You are an execution agent for a software/creative project called **The Arcade Realm**. You are being given exactly ONE task (L1) from a larger build that is coordinated by a separate "command center" chat. You do not need any other conversation or file — this message is fully self-contained. Read it, do the task, and return the outputs and a status line in the format specified at the very end.

Important operating notes for you, the agent:
- The "## Dependencies" section lists ARTIFACTS (files/outputs) produced by other tasks. If a dependency artifact is not provided to you in this chat, ask the human for it before building anything that needs it — or, if it's a contract/spec, ask them to paste it. Do not invent the contents of an upstream contract.
- Follow the "## Output Contract" exactly — those are the files/deliverables you must produce.
- Obey every rule in the SHARED CONTEXT PREAMBLE below, especially the Firewall Doctrine and the zero-IP rule. These are non-negotiable.
- When done, end your final message with the STATUS BLOCK described at the bottom so the human can paste it back to command center.

Here is your complete task specification:

================================================================
# L1 — Lore Bible (HUMAN-AUTHORED)

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
**This doc is for the human founder, not an agent.** You own the irreducible creative core. Per the operating principle, agents grow the connective tissue but a human sets the skeleton and the fixed truths. Everything the Loremaster agent later generates must respect what you write here.

## Dependencies
None. This is the creative root of the entire Lore Layer. L2–L5 are blocked until a first version exists.

## Task
Write a *small, fixed* foundational document. Resist over-writing — you are defining constraints and tone, not the whole story (the story accretes via L3/L4).
1. **Cosmology**: what is the Realm? The core premise that "we exist to reward gamers for their time" expressed as myth — the world's origin, its central tension, the "us vs them" embodied in-world (e.g. a force that extracts attention vs. those reclaiming it).
2. **The handful of fixed truths**: 5–10 canonical facts that can never be contradicted (these anchor the contradiction-check in L2).
3. **Tone + voice**: how lore reads (mysterious, mythic, fragmentary). Define what's evocative vs. what's off-limits.
4. **Factions**: seed a few with names + motives (players will align; players will also shape them over time).
5. **The prize/prophecy frame**: how deferred prizes are mythologized — e.g. "Caches" that open as the Realm reaches milestones. **Firewall**: write this as mission/aspiration, NEVER as investment, appreciation, or guaranteed payout. The prophecy fulfilling is proof-of-mission, not a financial promise.
6. **Naming ledger seed**: list the proper nouns you're claiming (factions, places, artifacts) so L3/L4 don't collide and you can trademark-sniff them.

## Output Contract
- `/lore/BIBLE.md` — cosmology, fixed truths, tone, factions, prophecy frame.
- `/lore/naming-ledger.md` — claimed proper nouns (seed; the canon ledger extends it).

## Done-Criteria
- A reader understands the world, its tension, and its tone in a few pages.
- The fixed truths are explicit enough to mechanically check contradictions against.
- The prophecy/prize frame is purely mission-aspirational (no investment framing).

## Handoff
L2 encodes this into world-state + the contradiction-check; L4's Loremaster receives BIBLE.md as immutable context; C1's marketing rules reference the prophecy frame.
================================================================

## STATUS BLOCK — paste this back to command center when you finish (or if you're blocked)

```
TASK: L1
STATUS: [DONE | BLOCKED | PARTIAL]
OUTPUTS PRODUCED:
  - <list each file/deliverable you actually created>
DEPENDENCY ARTIFACTS I STILL NEED (if any):
  - <e.g. "F1 game-module.ts contract — not provided">
DECISIONS I MADE THAT COMMAND CENTER SHOULD KNOW:
  - <anything you chose that affects other tasks, e.g. framework picked>
OPEN QUESTIONS:
  - <anything you need a human ruling on>
```

<!-- =================== END LAUNCH PACKET: L1 =================== -->

---

## ▶ L2 — L2 - World-State Schema + Canon Ledger

<!-- ============================================================= -->
<!-- LAUNCH PACKET: L2  —  copy everything from the line below   -->
<!-- down to the matching END marker, paste into a brand-new chat.  -->
<!-- ============================================================= -->

You are an execution agent for a software/creative project called **The Arcade Realm**. You are being given exactly ONE task (L2) from a larger build that is coordinated by a separate "command center" chat. You do not need any other conversation or file — this message is fully self-contained. Read it, do the task, and return the outputs and a status line in the format specified at the very end.

Important operating notes for you, the agent:
- The "## Dependencies" section lists ARTIFACTS (files/outputs) produced by other tasks. If a dependency artifact is not provided to you in this chat, ask the human for it before building anything that needs it — or, if it's a contract/spec, ask them to paste it. Do not invent the contents of an upstream contract.
- Follow the "## Output Contract" exactly — those are the files/deliverables you must produce.
- Obey every rule in the SHARED CONTEXT PREAMBLE below, especially the Firewall Doctrine and the zero-IP rule. These are non-negotiable.
- When done, end your final message with the STATUS BLOCK described at the bottom so the human can paste it back to command center.

Here is your complete task specification:

================================================================
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
================================================================

## STATUS BLOCK — paste this back to command center when you finish (or if you're blocked)

```
TASK: L2
STATUS: [DONE | BLOCKED | PARTIAL]
OUTPUTS PRODUCED:
  - <list each file/deliverable you actually created>
DEPENDENCY ARTIFACTS I STILL NEED (if any):
  - <e.g. "F1 game-module.ts contract — not provided">
DECISIONS I MADE THAT COMMAND CENTER SHOULD KNOW:
  - <anything you chose that affects other tasks, e.g. framework picked>
OPEN QUESTIONS:
  - <anything you need a human ruling on>
```

<!-- =================== END LAUNCH PACKET: L2 =================== -->

---

## ▶ L3 — L3 - Fragment Pre-Generation + Scattering

<!-- ============================================================= -->
<!-- LAUNCH PACKET: L3  —  copy everything from the line below   -->
<!-- down to the matching END marker, paste into a brand-new chat.  -->
<!-- ============================================================= -->

You are an execution agent for a software/creative project called **The Arcade Realm**. You are being given exactly ONE task (L3) from a larger build that is coordinated by a separate "command center" chat. You do not need any other conversation or file — this message is fully self-contained. Read it, do the task, and return the outputs and a status line in the format specified at the very end.

Important operating notes for you, the agent:
- The "## Dependencies" section lists ARTIFACTS (files/outputs) produced by other tasks. If a dependency artifact is not provided to you in this chat, ask the human for it before building anything that needs it — or, if it's a contract/spec, ask them to paste it. Do not invent the contents of an upstream contract.
- Follow the "## Output Contract" exactly — those are the files/deliverables you must produce.
- Obey every rule in the SHARED CONTEXT PREAMBLE below, especially the Firewall Doctrine and the zero-IP rule. These are non-negotiable.
- When done, end your final message with the STATUS BLOCK described at the bottom so the human can paste it back to command center.

Here is your complete task specification:

================================================================
# L3 — Fragment Pre-Generation + Scattering

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
You are building the system that creates the *feeling* the founder asked for: "long-winded overarching quests all over the place, story unfolding slowly." The trick is front-loading *fragments* without front-loading *explanation*.

## Dependencies
L2 (world-state + ledger API + attachment model), L1 (tone + fixed truths).

## Task
1. Use an agent to **pre-generate hundreds of fragments** at launch — atomic lore pieces (a line of myth, a glyph description, a "discovered" log entry), all respecting BIBLE tone and passing the ledger.
2. **Scatter** them: attach fragments to specific games, regions, leaderboard positions, times of day, win-streaks — so players *encounter* them organically and theorize. No single fragment explains the whole.
3. **Seed 3–5 overarching arcs simultaneously**, each only partially revealed — no quest-giver says "do X"; players notice patterns (a recurring glyph after certain games, a faction name that recurs, a prophecy counter ticking with total games played).
4. **Mystery-box discipline**: reveal *questions* faster than *answers*. The slow unfolding is the retention mechanic; the community does the interpretive work (this is the grassroots-lore moat).
5. Ensure scattering is data-driven (rules linking fragment → trigger) so new fragments can be slotted later by L4.

## Output Contract
- `/lore/seed/generate-fragments.ts` — the mass-generation agent + ledger submission.
- `/lore/seed/scatter-rules.ts` — fragment→trigger attachment rules.
- `/lore/seed/README.md` — the mystery-box / questions-over-answers discipline; how arcs are seeded partially-revealed.

## Done-Criteria
- Hundreds of fragments exist, all ledger-valid, scattered across multiple trigger types.
- 3–5 arcs are live and only partially revealed.
- Encountering fragments raises questions without dumping answers.

## Handoff
L4's Loremaster adds reality-responsive fragments on top of this seeded substrate; L5 advances the seeded arcs.
================================================================

## STATUS BLOCK — paste this back to command center when you finish (or if you're blocked)

```
TASK: L3
STATUS: [DONE | BLOCKED | PARTIAL]
OUTPUTS PRODUCED:
  - <list each file/deliverable you actually created>
DEPENDENCY ARTIFACTS I STILL NEED (if any):
  - <e.g. "F1 game-module.ts contract — not provided">
DECISIONS I MADE THAT COMMAND CENTER SHOULD KNOW:
  - <anything you chose that affects other tasks, e.g. framework picked>
OPEN QUESTIONS:
  - <anything you need a human ruling on>
```

<!-- =================== END LAUNCH PACKET: L3 =================== -->

---

## ▶ L4 — L4 - Loremaster Agent Loop

<!-- ============================================================= -->
<!-- LAUNCH PACKET: L4  —  copy everything from the line below   -->
<!-- down to the matching END marker, paste into a brand-new chat.  -->
<!-- ============================================================= -->

You are an execution agent for a software/creative project called **The Arcade Realm**. You are being given exactly ONE task (L4) from a larger build that is coordinated by a separate "command center" chat. You do not need any other conversation or file — this message is fully self-contained. Read it, do the task, and return the outputs and a status line in the format specified at the very end.

Important operating notes for you, the agent:
- The "## Dependencies" section lists ARTIFACTS (files/outputs) produced by other tasks. If a dependency artifact is not provided to you in this chat, ask the human for it before building anything that needs it — or, if it's a contract/spec, ask them to paste it. Do not invent the contents of an upstream contract.
- Follow the "## Output Contract" exactly — those are the files/deliverables you must produce.
- Obey every rule in the SHARED CONTEXT PREAMBLE below, especially the Firewall Doctrine and the zero-IP rule. These are non-negotiable.
- When done, end your final message with the STATUS BLOCK described at the bottom so the human can paste it back to command center.

Here is your complete task specification:

================================================================
# L4 — Loremaster Agent Loop

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
You are building the narrative analogue of the Game Factory: an agent loop that continuously generates lore *conditioned on what's actually happening in the platform*, so the world responds to reality. Critically, it operates under the marketing-firewall guardrails (C1) — it can never frame anything as an investment.

## Dependencies
L2 (ledger API — all writes go through it), C1 (marketing-governance rules — hard guardrails), L1 (BIBLE as immutable context). Reads real events from the Runtime + Factory (G7 lineage/cult-favorites).

## Task
1. Build a **Loremaster agent** that watches real platform events: a player hits a 50-game streak, a city crosses 100 players, a specific game becomes a cult favorite (from G7), a faction gains members.
2. It **writes those events into canon** as new fragments or arc developments (via the L2 ledger, which contradiction-checks them). Examples: the cult-favorite game gets mythologized; the streak-holder is named in a faction's records; a notable game lineage becomes "descended from the First Trial."
3. **Hard guardrails (C1)**: the agent is forbidden from generating any copy that frames status/tokens/collectibles as investments, promises appreciation, or implies a guaranteed payout — exactly as it is forbidden from violating canon. Wire C1's forbidden-frames list in as a non-negotiable constraint and gate its output against it.
4. Pass BIBLE.md as immutable context every generation; reject output that violates tone or fixed truths.
5. Run continuously and budgeted, like G1 — over-produce, gate hard via ledger + C1.

## Output Contract
- `/lore/loremaster/` — the agent loop + event-watchers.
- `/lore/loremaster/guardrails.ts` — the C1 forbidden-frames gate applied to every output.
- `/lore/loremaster/README.md` — what events it reacts to, how it writes via the ledger, and the marketing-firewall enforcement.

## Done-Criteria
- A real event (e.g. a streak) produces a ledger-valid canon fragment.
- Output that frames anything as an investment is blocked by the C1 gate.
- Game lineage/cult-favorites from G7 become in-world mythology.

## Handoff
L5 consumes ongoing canon to advance arcs/prophecies; the world now visibly responds to community activity.
================================================================

## STATUS BLOCK — paste this back to command center when you finish (or if you're blocked)

```
TASK: L4
STATUS: [DONE | BLOCKED | PARTIAL]
OUTPUTS PRODUCED:
  - <list each file/deliverable you actually created>
DEPENDENCY ARTIFACTS I STILL NEED (if any):
  - <e.g. "F1 game-module.ts contract — not provided">
DECISIONS I MADE THAT COMMAND CENTER SHOULD KNOW:
  - <anything you chose that affects other tasks, e.g. framework picked>
OPEN QUESTIONS:
  - <anything you need a human ruling on>
```

<!-- =================== END LAUNCH PACKET: L4 =================== -->

---

## ▶ L5 — L5 - Arc + Prophecy Progression (Wired to Metrics)

<!-- ============================================================= -->
<!-- LAUNCH PACKET: L5  —  copy everything from the line below   -->
<!-- down to the matching END marker, paste into a brand-new chat.  -->
<!-- ============================================================= -->

You are an execution agent for a software/creative project called **The Arcade Realm**. You are being given exactly ONE task (L5) from a larger build that is coordinated by a separate "command center" chat. You do not need any other conversation or file — this message is fully self-contained. Read it, do the task, and return the outputs and a status line in the format specified at the very end.

Important operating notes for you, the agent:
- The "## Dependencies" section lists ARTIFACTS (files/outputs) produced by other tasks. If a dependency artifact is not provided to you in this chat, ask the human for it before building anything that needs it — or, if it's a contract/spec, ask them to paste it. Do not invent the contents of an upstream contract.
- Follow the "## Output Contract" exactly — those are the files/deliverables you must produce.
- Obey every rule in the SHARED CONTEXT PREAMBLE below, especially the Firewall Doctrine and the zero-IP rule. These are non-negotiable.
- When done, end your final message with the STATUS BLOCK described at the bottom so the human can paste it back to command center.

Here is your complete task specification:

================================================================
# L5 — Arc + Prophecy Progression (Wired to Metrics)

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
You are wiring the meta-narrative to reality: overarching arcs advance and prophecies fulfill based on *aggregate platform metrics*, so the story progresses as the community grows — and the first big prize event becomes a narrative payoff (proof-of-mission), exactly as the strategy intends.

## Dependencies
L2 (arcs/prophecies + stages, ledger), R3 (leaderboard/player metrics), G7 (game/play metrics). Coordinates with the Runtime's lore-beat hook (R1) and the prophecy/Cache frame from L1.

## Task
1. Define **arc progression**: arc `stages` advance when aggregate metrics cross thresholds (total games played across the Realm, total players, city milestones, etc.). Advancement reveals the next partial layer of the story (questions-over-answers, per L3).
2. Define **prophecies** tied to platform milestones — e.g. "when the Realm reaches N souls, the First Cache opens." The prophecy counter is publicly visible and ticks with real metrics, so scale itself feels like collective story progress.
3. **The convergence with prizes**: a fulfilled prophecy is the in-world wrapper for the first major (sponsor-funded, Ecosystem-B) prize event. When it fires, the deferred-reward narrative becomes self-fulfilling. **Firewall**: the prophecy is mission/aspiration; the actual prize is governed by Ecosystem-B contract law and the eligibility-≠-entitlement rule. Never frame the prophecy as an owed financial return.
4. Feed arc/prophecy state to the Runtime so R1 selects on-theme games and intermissions deliver the current lore beat.
5. All progression writes go through the L2 ledger.

## Output Contract
- `/lore/progression/` — metric-thresholds → arc-stage + prophecy advancement.
- `/lore/progression/prophecy-counter.ts` — the public milestone counter.
- `/lore/progression/README.md` — how metrics drive story; the prophecy↔prize convergence and its firewall.

## Done-Criteria
- An arc stage advances when its metric threshold is crossed.
- The prophecy counter reflects real platform metrics publicly.
- The prophecy↔prize handoff is documented as mission-framing, not a financial promise.

## Handoff
The Runtime themes itself to the active arc; when the first prophecy fulfills, Ecosystem-B fires the prize event under its legal gate. The three engines are now converged.
================================================================

## STATUS BLOCK — paste this back to command center when you finish (or if you're blocked)

```
TASK: L5
STATUS: [DONE | BLOCKED | PARTIAL]
OUTPUTS PRODUCED:
  - <list each file/deliverable you actually created>
DEPENDENCY ARTIFACTS I STILL NEED (if any):
  - <e.g. "F1 game-module.ts contract — not provided">
DECISIONS I MADE THAT COMMAND CENTER SHOULD KNOW:
  - <anything you chose that affects other tasks, e.g. framework picked>
OPEN QUESTIONS:
  - <anything you need a human ruling on>
```

<!-- =================== END LAUNCH PACKET: L5 =================== -->

---

## ▶ C1 — C1 - Firewall Doctrine + Marketing-Governance Rules

<!-- ============================================================= -->
<!-- LAUNCH PACKET: C1  —  copy everything from the line below   -->
<!-- down to the matching END marker, paste into a brand-new chat.  -->
<!-- ============================================================= -->

You are an execution agent for a software/creative project called **The Arcade Realm**. You are being given exactly ONE task (C1) from a larger build that is coordinated by a separate "command center" chat. You do not need any other conversation or file — this message is fully self-contained. Read it, do the task, and return the outputs and a status line in the format specified at the very end.

Important operating notes for you, the agent:
- The "## Dependencies" section lists ARTIFACTS (files/outputs) produced by other tasks. If a dependency artifact is not provided to you in this chat, ask the human for it before building anything that needs it — or, if it's a contract/spec, ask them to paste it. Do not invent the contents of an upstream contract.
- Follow the "## Output Contract" exactly — those are the files/deliverables you must produce.
- Obey every rule in the SHARED CONTEXT PREAMBLE below, especially the Firewall Doctrine and the zero-IP rule. These are non-negotiable.
- When done, end your final message with the STATUS BLOCK described at the bottom so the human can paste it back to command center.

Here is your complete task specification:

================================================================
# C1 — Firewall Doctrine + Marketing-Governance Rules

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
You are a governance engineer encoding the Firewall Doctrine into an enforceable rule set — specifically the marketing-as-regulated-surface principle. This is consumed directly by L4 (the Loremaster guardrails) and applied to all player-facing copy. **Not legal advice; this operationalizes counsel-validated boundaries.**

## Dependencies
L1 (the prophecy/Cache frame this must keep clean). Feeds L4. Pairs with C4 (the attorney validates these boundaries).

## Task
1. Encode the three firewall rules as concrete, checkable policy:
   - **Eligibility ≠ Entitlement**: rules/copy must never state or imply status/rank-tokens convert to currency/crypto or guarantee a specific payout.
   - **Marketing is regulated**: a **forbidden-frames list** — no "investment", "appreciate(s) in value", "early holders profit", "returns", "guaranteed prize", "buy in now", or equivalents — applied to lore, UI, landing pages, Discord.
   - **Per-jurisdiction switches**: anything touching paid entry/value must be region-gateable (defines the requirement C2 implements).
2. Build a **forbidden-frames linter**: a function that scans a text block and flags violating phrases/semantics (regex + a lightweight LLM classifier for paraphrased violations). L4 calls this on every generated fragment; it can also run in CI over static marketing copy.
3. Document *why* each rule exists (securities/Howey exposure) in plain language so future contributors don't "soften" the rules back into liability.
4. Provide an allow-list of *safe* framings (mission, aspiration, status, standing, "proof of mission") as positive guidance.

## Output Contract
- `/compliance/firewall/rules.md` — the three rules as checkable policy + the forbidden-frames list + the rationale.
- `/compliance/firewall/linter.ts` — the forbidden-frames linter (regex + classifier).
- `/compliance/firewall/safe-framings.md` — approved positive language.

## Done-Criteria
- The linter flags both literal and paraphrased investment framing.
- L4 can import the linter as a hard output gate.
- Each rule has a plain-language rationale a non-lawyer won't undo.

## Handoff
L4 wires the linter as a non-negotiable guardrail; C2 implements the per-jurisdiction switch requirement; C4 hands the rule set to counsel for validation.
================================================================

## STATUS BLOCK — paste this back to command center when you finish (or if you're blocked)

```
TASK: C1
STATUS: [DONE | BLOCKED | PARTIAL]
OUTPUTS PRODUCED:
  - <list each file/deliverable you actually created>
DEPENDENCY ARTIFACTS I STILL NEED (if any):
  - <e.g. "F1 game-module.ts contract — not provided">
DECISIONS I MADE THAT COMMAND CENTER SHOULD KNOW:
  - <anything you chose that affects other tasks, e.g. framework picked>
OPEN QUESTIONS:
  - <anything you need a human ruling on>
```

<!-- =================== END LAUNCH PACKET: C1 =================== -->

---

## ▶ C2 — C2 - Per-Jurisdiction Eligibility-Switch Spec

<!-- ============================================================= -->
<!-- LAUNCH PACKET: C2  —  copy everything from the line below   -->
<!-- down to the matching END marker, paste into a brand-new chat.  -->
<!-- ============================================================= -->

You are an execution agent for a software/creative project called **The Arcade Realm**. You are being given exactly ONE task (C2) from a larger build that is coordinated by a separate "command center" chat. You do not need any other conversation or file — this message is fully self-contained. Read it, do the task, and return the outputs and a status line in the format specified at the very end.

Important operating notes for you, the agent:
- The "## Dependencies" section lists ARTIFACTS (files/outputs) produced by other tasks. If a dependency artifact is not provided to you in this chat, ask the human for it before building anything that needs it — or, if it's a contract/spec, ask them to paste it. Do not invent the contents of an upstream contract.
- Follow the "## Output Contract" exactly — those are the files/deliverables you must produce.
- Obey every rule in the SHARED CONTEXT PREAMBLE below, especially the Firewall Doctrine and the zero-IP rule. These are non-negotiable.
- When done, end your final message with the STATUS BLOCK described at the bottom so the human can paste it back to command center.

Here is your complete task specification:

================================================================
# C2 — Per-Jurisdiction Eligibility-Switch Spec

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
You are a compliance-minded engineer implementing the per-jurisdiction switch behind the seam F3 exposed. This is what lets paid play (Ecosystem C) and any heavy feature go live *only* where counsel has cleared it, state by state. **Not legal advice; the legal state-map comes from C4/counsel — you build the mechanism that consumes it.**

## Dependencies
F3 (the stubbed jurisdiction gate + the `checkEligibility` seam), F2 (regions). The actual permitted-states data is supplied by counsel via C4.

## Task
1. Design a **jurisdiction policy store**: a region/state → permitted-actions mapping (e.g. for 'paid_entry', 'token_features', 'collectible_sale'), updatable without a code deploy (data, not hardcode).
2. Implement the jurisdiction gate behind F3's seam: `checkEligibility({action, location})` consults the policy store; default-deny for any region not explicitly permitted for a given action.
3. **Default-deny** is the safety posture: a new state is OFF for paid/heavy features until explicitly turned on.
4. Resolve a player's effective jurisdiction robustly (venue region + the QR trust anchor from F3, not just GPS).
5. Provide an admin interface to flip a state on/off per action as counsel clears it, with an audit log of who changed what when.
6. Document clearly: this is the *mechanism*; the *contents* (which states are on) are a legal decision owned by counsel.

## Output Contract
- `/compliance/jurisdiction/policy-store.ts` — the data-driven mapping + updater.
- `/compliance/jurisdiction/gate.ts` — the gate behind F3's seam (default-deny).
- `/compliance/jurisdiction/admin/` — flip-switch UI + audit log.
- `/compliance/jurisdiction/README.md` — mechanism vs. legal-content separation; default-deny rationale.

## Done-Criteria
- A non-permitted region returns allowed=false for paid_entry by default.
- States can be enabled per-action without a deploy, with an audit trail.
- Jurisdiction resolution uses the QR trust anchor, not GPS alone.

## Handoff
Ecosystem-C (paid contest) activation in the Runtime reads this gate; C4 supplies the cleared-states data to load into the policy store.
================================================================

## STATUS BLOCK — paste this back to command center when you finish (or if you're blocked)

```
TASK: C2
STATUS: [DONE | BLOCKED | PARTIAL]
OUTPUTS PRODUCED:
  - <list each file/deliverable you actually created>
DEPENDENCY ARTIFACTS I STILL NEED (if any):
  - <e.g. "F1 game-module.ts contract — not provided">
DECISIONS I MADE THAT COMMAND CENTER SHOULD KNOW:
  - <anything you chose that affects other tasks, e.g. framework picked>
OPEN QUESTIONS:
  - <anything you need a human ruling on>
```

<!-- =================== END LAUNCH PACKET: C2 =================== -->

---

## ▶ C3 — C3 - Skill-Gradient Compliance-Artifact Spec

<!-- ============================================================= -->
<!-- LAUNCH PACKET: C3  —  copy everything from the line below   -->
<!-- down to the matching END marker, paste into a brand-new chat.  -->
<!-- ============================================================= -->

You are an execution agent for a software/creative project called **The Arcade Realm**. You are being given exactly ONE task (C3) from a larger build that is coordinated by a separate "command center" chat. You do not need any other conversation or file — this message is fully self-contained. Read it, do the task, and return the outputs and a status line in the format specified at the very end.

Important operating notes for you, the agent:
- The "## Dependencies" section lists ARTIFACTS (files/outputs) produced by other tasks. If a dependency artifact is not provided to you in this chat, ask the human for it before building anything that needs it — or, if it's a contract/spec, ask them to paste it. Do not invent the contents of an upstream contract.
- Follow the "## Output Contract" exactly — those are the files/deliverables you must produce.
- Obey every rule in the SHARED CONTEXT PREAMBLE below, especially the Firewall Doctrine and the zero-IP rule. These are non-negotiable.
- When done, end your final message with the STATUS BLOCK described at the bottom so the human can paste it back to command center.

Here is your complete task specification:

================================================================
# C3 — Skill-Gradient Compliance-Artifact Spec

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
You are turning the Game Factory's bot-playtest output into a *durable compliance artifact*: the evidentiary record that games are predominantly skill-based. This is a genuine legal advantage — most contest operators can't prove per-game skill-dominance; this pipeline does it by construction. **Not legal advice; you assemble the evidence counsel will use.**

## Dependencies
G3 (the skill-profile bot stats — random vs greedy vs optimal, with stored seeds), R2 (replay validator). Feeds C4.

## Task
1. Define a **per-game skill-evidence record** built from G3's stats: the skill gradient (optimal−random spread), variance, completion rate, the bot methodology, and the **stored seeds** that make every result reproducible/re-verifiable.
2. Define an **aggregate skill report** across the active pool: distribution of skill gradients, proportion of pool meeting a "predominance of skill" bar, methodology writeup.
3. Specify **retention**: these records are kept as compliance artifacts (not just transient QA), versioned, and tied to each game's pool entry.
4. Explain the legal relevance in plain language: predominance-of-skill (and the stricter "any chance" standard some states apply) is the line between a skill contest and gambling; this record is what an attorney uses to argue the former. (The state-by-state determination itself is counsel's, via C4.)
5. Make the report exportable in a clean form to hand to counsel/regulators.

## Output Contract
- `/compliance/skill-evidence/record-schema.ts` — the per-game evidence record.
- `/compliance/skill-evidence/aggregate-report.ts` — pool-wide report generator.
- `/compliance/skill-evidence/README.md` — retention policy + plain-language legal relevance + export format.

## Done-Criteria
- Every active game has a reproducible skill-evidence record (with seeds).
- An aggregate report can be exported for counsel.
- Records are retained/versioned, not transient.

## Handoff
C4 folds the aggregate skill report into the attorney brief (it is the core evidence for the Ecosystem-C skill-vs-chance question).
================================================================

## STATUS BLOCK — paste this back to command center when you finish (or if you're blocked)

```
TASK: C3
STATUS: [DONE | BLOCKED | PARTIAL]
OUTPUTS PRODUCED:
  - <list each file/deliverable you actually created>
DEPENDENCY ARTIFACTS I STILL NEED (if any):
  - <e.g. "F1 game-module.ts contract — not provided">
DECISIONS I MADE THAT COMMAND CENTER SHOULD KNOW:
  - <anything you chose that affects other tasks, e.g. framework picked>
OPEN QUESTIONS:
  - <anything you need a human ruling on>
```

<!-- =================== END LAUNCH PACKET: C3 =================== -->

---

## ▶ C4 — C4 - Attorney-Brief Assembler

<!-- ============================================================= -->
<!-- LAUNCH PACKET: C4  —  copy everything from the line below   -->
<!-- down to the matching END marker, paste into a brand-new chat.  -->
<!-- ============================================================= -->

You are an execution agent for a software/creative project called **The Arcade Realm**. You are being given exactly ONE task (C4) from a larger build that is coordinated by a separate "command center" chat. You do not need any other conversation or file — this message is fully self-contained. Read it, do the task, and return the outputs and a status line in the format specified at the very end.

Important operating notes for you, the agent:
- The "## Dependencies" section lists ARTIFACTS (files/outputs) produced by other tasks. If a dependency artifact is not provided to you in this chat, ask the human for it before building anything that needs it — or, if it's a contract/spec, ask them to paste it. Do not invent the contents of an upstream contract.
- Follow the "## Output Contract" exactly — those are the files/deliverables you must produce.
- Obey every rule in the SHARED CONTEXT PREAMBLE below, especially the Firewall Doctrine and the zero-IP rule. These are non-negotiable.
- When done, end your final message with the STATUS BLOCK described at the bottom so the human can paste it back to command center.

Here is your complete task specification:

================================================================
# C4 — Attorney-Brief Assembler

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
You are assembling the structured brief a licensed securities/fintech/gaming attorney receives, so their engagement *validates a coherent structure* rather than inventing one at high cost. **This is explicitly not legal advice — it is the question set + evidence package for counsel.** Its purpose is to make legal review cheap, fast, and focused.

## Dependencies
C1 (firewall rules to validate), C3 (skill-evidence aggregate report), plus the ecosystem/corporate structure from the project's build+legal architecture. Outputs feed C2 (counsel returns the cleared-states data).

## Task
Compile a single brief containing:
1. **The structure**: the five walled ecosystems (A–E), the launch-left-to-right sequencing, and the proposed corporate shape (Delaware C-corp holdco + opco; conditional ring-fenced subsidiaries for C/E).
2. **The ordered question set** for counsel:
   - Entity + whether to ring-fence C/E.
   - Ecosystem A: confirm non-convertible status carries no prize/securities surface; validate eligibility-≠-entitlement ToS language (attach C1 rules).
   - Ecosystem B: MSA template; per-state prize-value registration/bonding thresholds for no-fee skill contests.
   - Ecosystem C: the **state map** (which states permit paid skill contests; which apply the stricter "any chance" test; which prohibit); registration; whether holding entry fees triggers money transmission. **Attach the C3 aggregate skill report as evidence.**
   - Narrative reservoir: does a transparent, public revenue-share-to-prize-pool commitment stay clear of being an investment promise, and how must it be worded?
   - Ecosystem D: when does a lore-tied collectible's design+marketing become a security vs. digital merch? What marketing is forbidden? (cross-ref C1).
   - Ecosystem E: full Howey analysis; registration vs. exemption; money-transmission/MSB/AML obligations; realistic cost + timeline; at what scale it makes sense.
   - AI-generated IP: ownership/authorship of agent-generated games + lore; sufficiency of the provenance manifest as chain-of-title.
   - Insurance: GL (venues as additional insured) + E&O; what underwriters need.
3. **A return-data spec**: define the format in which counsel returns the cleared-states list so it loads directly into C2's policy store.

## Output Contract
- `/compliance/attorney-brief/BRIEF.md` — the structure + ordered question set + attached evidence references.
- `/compliance/attorney-brief/cleared-states-format.md` — the schema for counsel's answer that C2 ingests.
- `/compliance/attorney-brief/README.md` — how to keep the brief updated as the build evolves; the not-legal-advice framing.

## Done-Criteria
- The brief is self-contained enough that an attorney can quote-and-validate without a long discovery call.
- The C3 skill report is attached to the Ecosystem-C question.
- Counsel's cleared-states answer maps 1:1 into C2's policy store.

## Handoff
Counsel's answers gate Ecosystem activation (per the legal gates in the INDEX); the cleared-states output flows into C2; firewall confirmations feed back to C1/L4.
================================================================

## STATUS BLOCK — paste this back to command center when you finish (or if you're blocked)

```
TASK: C4
STATUS: [DONE | BLOCKED | PARTIAL]
OUTPUTS PRODUCED:
  - <list each file/deliverable you actually created>
DEPENDENCY ARTIFACTS I STILL NEED (if any):
  - <e.g. "F1 game-module.ts contract — not provided">
DECISIONS I MADE THAT COMMAND CENTER SHOULD KNOW:
  - <anything you chose that affects other tasks, e.g. framework picked>
OPEN QUESTIONS:
  - <anything you need a human ruling on>
```

<!-- =================== END LAUNCH PACKET: C4 =================== -->

---
