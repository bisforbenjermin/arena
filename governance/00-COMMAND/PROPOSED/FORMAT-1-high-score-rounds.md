# FORMAT-1 — High-score rounds, standardized

Status: PROPOSED — not a ruling until the founder ratifies | Reversibility: EXPENSIVE | Undo cost: a rewrite of every generated game once the factory ships them; a day today while only two reference games exist | Confidence: MEDIUM-HIGH

## The problem
R1 (orchestrator spec) sequences `ROUND → INTERMISSION → ROUND`. R2 (normalizer spec) ranks scores. F1 (contract) produces a numeric score. Nothing anywhere says what shape a *round* takes — length bounds, how many scores it emits, which direction wins, how session points add up — so every generated game is free to invent its own, and the orchestrator cannot sequence them without per-game branches. PR-8 (score direction) and PR-5 (cold-start) each nibble at one corner. The founder stated 2026-10-23 that "high score rounds are standardized as per canon," but no DECISIONS file carries that rule. Writing it closes the surface before the factory starts producing games.

## Ruling (proposed)

Every game that enters the pool obeys all seven points. The orchestrator, normalizer and factory assume these; the contract enforces them.

1. **One round, one score, one player.** A round is a single play of one game by one player, emitting exactly one terminal numeric score at round end. No partial-credit emissions, no mid-round rank changes, no shared/co-op scores.
2. **Higher is better.** Raw score direction is fixed. A game that measures time, misses, or depth-reached converts internally and emits a higher-is-better integer. Ratifies PR-8 point #1.
3. **Declared range.** Every `GameMeta` carries `scoreRange: { min: integer; max: integer }` with `min < max`. The factory rejects any game missing it. Ratifies PR-8 point #2.
4. **Round length bounds.** A round runs between 20 and 120 seconds of in-game time (tick-counted per PR-2, not wall-clock). A game declares `roundTicks: integer` in `GameMeta`; the orchestrator uses this to budget the slot. Games outside the bounds are rejected by G6 (pool promotion).
5. **No elimination, no survival, no accumulation across rounds.** A game may end early on the player's own trigger (fire, drop, finish), but ending-condition games (last-player-standing, time-to-death, lives-remaining) are not permitted as game modes. If a developer wants that feel, they map it to a score (e.g., time-survived → integer ms).
6. **Session points come from the normalizer, not the raw score.** R2 (per PR-5 and PR-8) converts every raw score to a rank point on a shared scale. Session leaderboards sum rank points. Games cannot be compared on raw scores at the session level.
7. **Multiplayer compatibility.** If a game is run as a shared-seed heat (every player sees the same inputs/world), each player still emits one terminal score; the orchestrator ranks within the heat and feeds the normalizer. Head-to-head formats (one player's inputs affect another's game state) are *not* high-score rounds and are out of scope until a separate ruling.

## Options, with the undo cost of each

- **A. Ratify as above.** Undo cost: a day today (edit F1 contract to add `scoreRange` and `roundTicks`, update both F4 games, edit G1 prompt). Grows to a rewrite of every generated game once the factory ships; the longer this stays unruled the more it costs. **Recommended.**
- **B. Ratify only points 1–3 (score shape); leave length, elimination ban, and aggregation open.** Undo cost: minutes. Cost: G6 pool-promotion criteria remain fuzzy; the factory can still accept 10-minute marathons or lives-based games that break R1's sequencing.
- **C. Do not rule; infer per game.** Undo cost: none. Cost: R1, R2, G3, G4, G6 all branch per game forever. Bulk generation becomes impossible — the point user stated as the current goal.

## Why

The factory's "generate freely at the edges, gate hard in the middle" principle (G3 preamble) only holds if the middle is a narrow spec. Round shape is the narrowest point: get it wrong once and every downstream gate carries the compensation code. Fixed shape is also the C3 skill-gradient story — a judge comparing a 30-second tap game to a 90-second rhythm game needs the same score grammar on both.

Multiplayer PvP (per the 2026-10-23 side request) is deliberately excluded. That is a separate game *mode*, with its own synchronization, latency and legal surface; folding it into high-score rounds would re-couple the two decisions and jam both. If PvP is wanted, it ships as a mode flag on top of a FORMAT-2 ruling, not inside this one.

## Downstream

- **F1 contract (`contracts/game-module.ts`)** — add required `scoreRange` and `roundTicks` on `GameMeta`; version bump to 2.0.0 or 3.0.0 depending on how it merges with PR-7/PR-8.
- **F4 reference games** — both re-declare the new fields; both already satisfy points 1–2 modulo PR-8 ratification.
- **G1 generation prompt** — tells the model "produce a high-score round in [20, 120] ticks\*60; declare `scoreRange`." Rejects anything else.
- **G2 sandbox** — adds a check that `roundTicks` is in bounds and `scoreRange` is coherent (`min < max`, both integers, score at end falls inside).
- **G3 bot-playtest** — compares (near-optimal median − random median) ÷ (max − min) on raw scores; also asserts the bot never exits by a non-score ending condition.
- **G6 pool promotion** — gates on all of the above.
- **R1 orchestrator** — uses `roundTicks` to budget each slot.
- **R2 normalizer** — assumes direction and range are declared; non-ranking state (PR-5) still applies.
- **R3 leaderboard** — operates on rank points, not raw scores (already in spec; this ruling confirms).
- **PR-7 (PROPOSED, replayable input)** and **PR-8 (PROPOSED, score direction and range)** — this ruling ratifies PR-8 implicitly in points 2 and 3; PR-7 still needs its own ruling but is compatible.
- **BRAND-3 (core line)** — "Fast, Fair, Local" compatible: short rounds, declared scoring, no PvP ambiguity.
- **AUD-1 (investor audience)** — the pitch now has a one-line format story: "Every game is a 20-to-120-second round with one high score. The platform ranks across them."

## Note

- Written 2026-10-23 by Claude Code at founder's instruction "high score rounds are standardized as per canon." The founder's own words are brief; this file expands them into something the factory can enforce. The founder should rule by (a) accepting as drafted — change the first line to `Ruled: 2026-10-23 | Reversibility: EXPENSIVE | Undo cost: a day today, rewrite later | Confidence: HIGH | Ratified by founder` and move to `governance/10-CANON/DECISIONS/FORMAT-1-high-score-rounds.md`; or (b) rewriting any point in his own words before ratification; or (c) rejecting with a one-line reason.
- Points 2 and 3 collide with the PR-8 PROPOSED ruling. If FORMAT-1 ratifies first, PR-8 can be withdrawn as subsumed; otherwise rule PR-8 first and this ruling cites it.
- The 20–120 tick bound is a value judgment, not a derivation. Shorter rounds (10s) hurt the sense of agency; longer (180s+) break tournament pacing and attention. Playtest once there are more than two games in the pool and tighten or widen then.
- Run the cold-critic agent on this file before ratification. Guidance from CLAUDE.md says every hard call runs one loop: design, cold critique, the founder rules, build.
