# PR-8 — Score direction and range
Status: PROPOSED — not a ruling until the founder ratifies | Reversibility: REVERSIBLE today | Undo cost: under an hour today; grows with every generated game | Confidence: MEDIUM

## The problem
- The July contract carried `scoringDirection` and `scoringEnvelope`. v1.0.0 dropped both (INBOX delta, 2026-10-20). Nothing now says whether a higher raw score is better.
- G3 calls a game "luck, not skill" when its near-optimal bot barely beats its random bot. Without a direction, that comparison can run backwards. Without a range, the gap can't be compared across games, so one threshold can't serve the whole pool.

## Ruling (proposed)
1. Raw scores are always higher-is-better. A game that measures time or misses converts them to points before reporting.
2. `GameMeta` gains a required `scoreRange: { min: number; max: number }`: the lowest and highest raw score the game can produce.
3. G3 reports the skill gap as a share of that range: (near-optimal median − random median) ÷ (max − min). One threshold then works for every game.

Ship it with PR-7 in contract 2.0.0, so each game changes once.

## Options, with the undo cost of each
- **A. Mandate higher-is-better and add `scoreRange` (above).** Undo: minutes today. Recommended.
- **B. Restore `scoringDirection` as a field.** Undo: minutes. Cost: every consumer (R2, R3, G3, G4) branches on it forever.
- **C. No rule; G3 infers direction from bot results.** Cost: a broken game can pass as a skilled one.

## Why
One fixed convention removes a branch from every consumer. The range turns G3's gate into one number for the whole pool, which is also what C3's skill-evidence report needs.

## Downstream
`contracts/game-module.ts`, both F4 games, G1's generation prompt, G3, G4, R2, C3.

## Note
Drafted by an assistant on 2026-10-20. Today precision-tap reports 0–100 (percent of targets hit) and pressure-hold reports 0–1800 (ticks held in the zone). Run the cold-critic agent on this file before ruling.
