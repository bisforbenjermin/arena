# PR-7 — Replayable input: one input path for live play, replay and bots
Status: PROPOSED — not a ruling until the founder ratifies | Reversibility: EXPENSIVE | Undo cost: about 2 hours today (two games); a rewrite of every game once the factory ships them | Confidence: MEDIUM

## The problem (checked against main on 2026-10-20)
- `GameSim` in `contracts/game-module.ts` has no method that accepts player input. Each game invents its own: `PrecisionTapSim.registerTap()`, `PressureHoldSim.registerHoldStart()` and `registerHoldEnd()`.
- Views reach those methods by casting the read-only sim to the concrete class (`games/precision-tap/index.ts:156` and `:166`; `games/pressure-hold/index.ts:159–160`). The contract says the view "never mutates sim state" (`contracts/game-module.ts:151`). Both reference games break that rule because the contract gives them no other way in.
- So nothing generic can replay a recorded event log. R2's replay validator, G2's repeatability check and G3's bots would each need hand-wiring per game.
- `tests/determinism.ts` proves a sim repeats when the same scripted calls run twice. It never feeds a recorded log back into a fresh sim, which is what the server will do.

## Ruling (proposed)
1. `GameSim` gains `input(event: GameEvent): void`. It applies one player input and appends it to the event log. The sim recomputes outcomes (hit, miss, score); it never reads them from `event.payload`.
2. Timing: every event stamped tick t is applied after t calls to `tick()` and before call t + 1, in log order. Live play, server replay and bots all run this same loop.
3. Views stop mutating the sim. `GameView.mount` receives an `emit(type, payload?)` callback. The runtime stamps the current tick, queues the event and calls `sim.input()` at the next tick boundary.
4. The contract becomes 2.0.0 under PR-4: a new required method breaks existing games. precision-tap and pressure-hold move to it in the same change.
5. The determinism test gains a true replay case: play with scripted inputs, take `getEventLog()`, feed it through a fresh sim via `input()`, and assert the same score and the same log.

## Options, with the undo cost of each
- **A. `input()` on the sim plus `emit` for views (above).** Undo: revert one commit today. Recommended.
- **B. Each game exports its own `replay(sim, events)` adapter; the contract stays 1.0.0.** Undo: minutes. Cost: every generated game writes its own adapter, the validator trusts per-game code paths, and bots still need per-game wiring.
- **C. Leave it; R2 and G3 hand-wire each game.** Undo: none. Cost: it stops scaling after a handful of games, which defeats the factory.

## Why
Cheap now, expensive later: the same reason PR-2, PR-3 and PR-4 were front-loaded. Two games exist today. Every game the factory generates before this lands is another rewrite.

## Related risk (test first, rule only if it fails)
pressure-hold computes its gauge with `Math.sin`. JavaScript leaves the precision of `Math.sin` to each engine, so the server (Node, V8) and an iPhone (Safari, JavaScriptCore) may disagree in the last digit ([MDN: Math](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math)). At a zone edge that can flip one tick of score, and the server would then reject an honest player's claim. G2 should replay every game in both Chromium and WebKit and compare. If they ever disagree, rule then, for example: sims use only + − × ÷ and the contract's own math helpers.

## Downstream
`contracts/game-module.ts`, both F4 games, `tests/determinism.ts`, F4's ANATOMY.md (not yet written), G1's generation prompt, G2, G3, R1, R2.

## Note
Drafted by an assistant on 2026-10-20 from main at a57b6f1. Run the cold-critic agent on this file before ruling. To ratify: change the first line to `Ruled: <date> | … | Ratified by founder` and move the file to `governance/10-CANON/DECISIONS/`.
