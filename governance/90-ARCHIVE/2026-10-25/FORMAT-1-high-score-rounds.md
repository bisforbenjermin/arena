# FORMAT-1 — High-score rounds, standardized

Status: PROPOSED — not a ruling until the founder ratifies | Reversibility: REVERSIBLE | Undo cost: minutes today (declaration-only ruling) | Confidence: HIGH

Supersedes draft v1 (critiqued 2026-10-23 in [[FORMAT-1-high-score-rounds.critique.md]]: 6 KILLs, verdict NOT READY). v1 invented a `roundTicks` field, widened the duration window, introduced "rank points," and banned R3's live leaderboard. v2 is thin: it names what is already in canon.

## The problem
Founder stated 2026-10-23 that "high score rounds are standardized as per canon." The pieces exist — one in F1, two in the PR-series, one in CANON-2, one in R2 — but no file collects them. Agents reading the pool-promotion gate have to cross-reference five documents to know what shape a game must be. FORMAT-1 is the index, not a new design.

## Ruling (proposed)

A **high-score round** is defined by these existing rules. FORMAT-1 adds nothing new except point 2.

1. **One terminal numeric score per play.** The contract already produces exactly one score at the end of a sim (`contracts/game-module.ts: sim.getScore(): number`). See also `contracts/scoring.ts` — `ScoreSubmission` carries one `rawScore`.
2. **Higher raw score is better.** NEW. A game that measures time or misses converts internally and emits a higher-is-better number. (Previously implicit; PR-8 PROPOSED point 1 covers the same ground. If PR-8 ratifies before FORMAT-1, this point is withdrawn; FORMAT-1 then cites PR-8.)
3. **Round length is 25–60 seconds.** Already in the contract: `GameMeta.durationSeconds` with range comment `25-60` at `contracts/game-module.ts:33`. Also in the G1 generation brief at `specs/G1_generation_agent_brief.md:41`.
4. **Shared seed per bracket.** Already ruled in CANON-2 as rule PD-2: identical seeded rounds per bracket. See `governance/10-CANON/DECISIONS/CANON-2-board-fold.md`.
5. **Cold-start applies.** A new game is playable but NON-RANKING until 200 scores across 30 players. Already ruled in PR-5. See `governance/10-CANON/DECISIONS/PR-5-cold-start.md`.
6. **Fixed timestep.** Already ruled in PR-2 at 1/60 s. See `governance/10-CANON/DECISIONS/PR-2-fixed-timestep.md`.

Everything else — session aggregation, elimination/survival game modes, multi-score games, `scoreRange` as a contract field, replayable input — is **out of scope for this ruling** and lives in its own file (PR-7, PR-8, or TBD).

## Options, with the undo cost of each

- **A. Ratify v2 as above.** Undo cost: minutes. The only new rule is "higher-is-better" (point 2), and it's already how both reference games behave (`games/precision-tap/index.ts:136` and `games/pressure-hold/index.ts`). **Recommended.**
- **B. Ratify PR-8 first (direction + range) and skip FORMAT-1.** Undo cost: zero. Cost: no single pointer file collects "what a high-score round is"; every agent cross-references five documents.
- **C. Do not rule; close FORMAT-1.** Cost: founder's directive isn't recorded in canon. Downstream agents don't know "high-score rounds" is the shipping format.

## Why

The scope of the founder's directive was "standardize what already exists." v1 misread this as a mandate to invent six rules; v2 obeys the directive literally. The only new content is point 2 (direction), which is the single piece of the picture that *isn't* already ruled or shipped. Everything else is a cite.

Keeping the ruling thin preserves optionality on the harder questions (session aggregation, scoreRange as a type) that deserve their own hearings.

## Downstream

- **G1 generation prompt** — references point 2 (direction) when prompting.
- **G2 sandbox** — adds a check that the sim's final `getScore()` call is numeric and non-NaN. No field changes.
- **G3 bot-playtest** — uses direction (point 2) to orient the skill gradient test.
- **G6 pool promotion gate** — gates on cold-start (PR-5) and direction (point 2) only. No new fields.
- **PR-7, PR-8 PROPOSED** — unaffected by FORMAT-1 v2. Rule them separately on their own merits. If PR-8 ratifies first, FORMAT-1 point 2 is withdrawn and cites PR-8.

## Note

- Written 2026-10-23 by Claude Code at founder's instruction, path A ("kill v1, write thin v2") after cold critique. v1 and critique retained for the record.
- To ratify: change the first line to `Ruled: 2026-10-23 | Reversibility: REVERSIBLE | Undo cost: minutes | Confidence: HIGH | Ratified by founder` and move to `governance/10-CANON/DECISIONS/FORMAT-1-high-score-rounds.md`.
- Run the cold-critic agent again before ratification if there is any new content beyond what's listed. If no new content, the critic has already judged the component rulings — skip.
