# G3 — Bot-Playtest Harness

Headless, seeded, reproducible bot runs that produce the per-candidate skill-evidence record used downstream by G4 (quality score) and C3 (skill-vs-chance evidence).

## The three skill-profile bots

- **random** — random valid inputs at human-plausible frequency; drawn from a seeded PRNG so each run reproduces exactly.
- **greedy** — a simple sensible-per-controlScheme heuristic. Deterministic given the sim state and tick.
- **expert** — the game's own `games/<slug>/controller.ts` (named export `expert`) when it ships one. If absent, falls back to a generic expert per `controlScheme` (G3 spec).

Every bot sees only what a player would see (the sim), reacts no faster than 12 ticks (`REACTION_LIMIT_TICKS`, forge rule 2 "human-plausible expert"), and runs the sim for the game's declared `durationSeconds × 60` ticks.

## The skill gradient

FORMAT-1 point 2 fixes score direction: **higher raw score is better**. The gradient is therefore `expert_mean − random_mean`. A game is **REJECTED** when:

- `skillGradient ≤ 0` (random matches or beats the expert — luck decided it), or
- `random_mean > expert_mean / 2` (bar `randomAtMostHalfOfExpert` fails — random is too close to expert).

The provisional bars (`randomAtMostHalfOfExpert`, `greedyBetween`, `expertVariationAtMost15Percent`) come from canon.md BUILD step 5 and stand until G3 tunes them from real data.

## Reproducibility

Seeds, bot definitions, and the `rerun` note are stored in the record. Anyone must be able to reproduce any number from this file alone. The random bot's randomness is drawn from the per-seed PRNG, so the same seed replays bit-for-bit.

## Record shape

The record follows `.claude/skills/arena-forge/assets/skill-evidence.example.json` (the forge canon shape used by `/build-next`). G3 extends it with `completionRate`, `frameStability`, `skillGradient`, and `verdict`. The extension is logged in `governance/00-COMMAND/FRICTION_LOG.md`; the forge example asset mirrors the extended shape.

## Files

- `stats-schema.ts` — the record type.
- `bots.ts` — three controllers and the per-seed runner.
- `harness.ts` — top-level `playtest(slug, mod)` entry point.
