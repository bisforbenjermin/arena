# FORMAT-1 — High-score rounds, standardized
Ruled: 2026-10-25 | Reversibility: REVERSIBLE | Undo cost: minutes | Confidence: HIGH | Ratified by founder

## Ruling

A **high-score round** is defined by these existing rules. FORMAT-1 adds nothing new except point 2.

1. **One terminal numeric score per play.** The contract already produces exactly one score at the end of a sim (`contracts/game-module.ts: sim.getScore(): number`). See also `contracts/scoring.ts` — `ScoreSubmission` carries one `rawScore`.
2. **Higher raw score is better.** NEW. A game that measures time or misses converts internally and emits a higher-is-better number. (Previously implicit; PR-8 PROPOSED point 1 covers the same ground. If PR-8 ratifies later, this point is withdrawn; FORMAT-1 then cites PR-8.)
3. **Round length is 25–60 seconds.** Already in the contract: `GameMeta.durationSeconds` with range comment `25-60` at `contracts/game-module.ts:33`. Also in the G1 generation brief at `specs/G1_generation_agent_brief.md:41`.
4. **Shared seed per bracket.** Already ruled in CANON-2 as rule PD-2: identical seeded rounds per bracket. See `governance/10-CANON/DECISIONS/CANON-2-board-fold.md`.
5. **Cold-start applies.** A new game is playable but NON-RANKING until 200 scores across 30 players. Already ruled in PR-5. See `governance/10-CANON/DECISIONS/PR-5-cold-start.md`.
6. **Fixed timestep.** Already ruled in PR-2 at 1/60 s. See `governance/10-CANON/DECISIONS/PR-2-fixed-timestep.md`.

Everything else — session aggregation, elimination/survival game modes, multi-score games, `scoreRange` as a contract field, replayable input — is **out of scope for this ruling** and lives in its own file (PR-7, PR-8, or TBD).

## Why

Founder's words at ratification: "I rule FORMAT-1: A. Ratify as-is. Reversible in minutes, and both reference games already score this way."

The scope of the directive was "standardize what already exists." v1 misread this as a mandate to invent six rules; v2 obeys the directive literally. The only new content is point 2 (direction), which is the single piece of the picture that *isn't* already ruled or shipped. Everything else is a cite. Keeping the ruling thin preserves optionality on the harder questions (session aggregation, scoreRange as a type) that deserve their own hearings.

## Downstream

- **G1 generation prompt** — references point 2 (direction) when prompting.
- **G2 sandbox** — adds a check that the sim's final `getScore()` call is numeric and non-NaN. No field changes.
- **G3 bot-playtest** — uses direction (point 2) to orient the skill-gradient test.
- **G6 pool promotion gate** — gates on cold-start (PR-5) and direction (point 2) only. No new fields.
- **PR-7, PR-8 PROPOSED** — unaffected by FORMAT-1. Ruled separately on their own merits. If PR-8 ratifies later, FORMAT-1 point 2 is withdrawn and cites PR-8.

## Note

- Ratified 2026-10-25 (founder: "A. Ratify as-is"). Drafting history (v1 critique, v2) retained in `governance/90-ARCHIVE/2026-10-25/`.
- v1 ("FORMAT-1-high-score-rounds.md" first draft) was killed by cold-critic with 6 KILLs on 2026-10-23. v2 was rewritten thin per founder's path A. v2 is the content ratified here.
