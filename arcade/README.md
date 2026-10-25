# Arcade build — four games on `build/arcade-games`

Built 2026-10-23 in one session at the founder's request ("build this one out… both and 2 more"). Nothing here is merged, and nothing in `contracts/` or `governance/` was touched.

**Update 2026-10-25 (`build/bow-hunt-phaser`, stacked on this branch):** Bow Hunt was rebuilt as a portrait Phaser 3 game from the founder's newer spec and left this preview page; it has its own link and `bow-hunt/README.md`. The React UI and Vercel/Postgres contest described below for Bow Hunt exist only on `build/arcade-games`.

| Path | What it is | Status |
|---|---|---|
| `bow-hunt/` | Bow Hunt: Thanksgiving, a standalone project. On `build/arcade-games`: React game (P1–P6) plus Vercel contest (C1–C7). On `build/bow-hunt-phaser`: Phaser 3 portrait game, Phase 1 of the newer spec. | Prize contest **blocked by an open HANDOFF** (below). |
| `games/tailspin/` | Raccoon cave flyer. Hold to climb. | F1 game, 60 s, `hold` |
| `games/stack-shift/` | 8×12 placement puzzle. Rows and columns clear. | F1 game, 60 s, `drag` |
| `games/glyph-trace/` | Trace seeded connect-the-dots shapes. | F1 game, 60 s, `drag` |
| `tests/arcade-games.ts` | Gate for the three F1 games, run by `npm test` and CI | 29 tests; repo total 37/37 |
| `arcade/` | Preview page for the F1 games in one file, with a replay check after each run (Bow Hunt removed on `build/bow-hunt-phaser`) | Published as a private artifact |

## Run it

```
npm test                               # repo root: determinism gate + arcade gate
cd arcade && npm install && npm run dev       # play all four locally
cd arcade && npm run build             # writes dist/arena-arcade.html (single file)
cd bow-hunt && npm install && npm test && npm run dev   # Bow Hunt (see bow-hunt/README.md)
```

## How the three F1 games meet the contract

- **PR-1:** all randomness comes from the injected `prngFactory`, drawn once in `init()`.
- **PR-2:** everything is tick-based; the files contain none of the banned clock or random calls (the gate checks).
- **PR-3:** sims are DOM-free and integer-only; views read sim state.
- **PR-4:** `contractVersion` 1.0.0 and `gameVersion` 1.0.0. The gate pins golden scores, so a balance change fails CI until `gameVersion` is bumped.
- **PR-6:** no `tilt`.
- **PR-7 (PROPOSED):** each sim takes input through `input(event)`, the method PR-7 proposes. The gate replays a JSON round-tripped event log through a fresh sim and gets the same score, the check R2 will run. The contract itself is unchanged, so views still cast to the concrete sim, like the F4 games.
- **FORMAT-1 (PROPOSED):** every round lasts exactly 3600 ticks. A Tailspin crash costs the streak and 1.5 s; a missed glyph scores 0. Neither ends the round. These are reversible design calls.

## Needs a ruling (OPS-1, not decided in code)

1. **Bow Hunt stakes.** `governance/00-COMMAND/PROPOSED/HANDOFF-bow-hunt-stakes.md` is still open. In chat on 2026-10-23 the founder chose: players pick a sponsor's pool, sponsors set fixed prizes, free entry, prizes funded by both the house and sponsors, winners daily. That isn't recorded as a DECISIONS file. House-funded prizes fall under CP-0 (solvency gate). No real-prize day should run until this is ruled and counsel has written the Official Rules (`bow-hunt/public/rules.html` is a placeholder). Phase 2 of the newer spec rebuilds the contest on Supabase, which matches STACK-1's auth ruling.
2. **The runtime PRNG needs warm-up.** `factory/components/prng.ts` seeds sfc32 so that the first draw is 0.662788 for every seed from 0 to 1000. Small seeds therefore start nearly the same round. The three new sims discard 12 draws in `init()` as a local fix. The F4 games and anything G1 generates don't. Fixing it in the runtime changes PRNG output, which is PR-1 territory. That's cheap today, with no stored replays, and expensive later.
3. **Bow Hunt isn't an F1 game.** It runs minutes, not 25–60 s, and ends when you miss a quota, which conflicts with PROPOSED FORMAT-1's no-elimination point. It ships fine as its own Thanksgiving product. Entering the Arena pool would need a 60-second variant.
4. **Stack Shift runs 60 s.** The concept said 90 s; F1 caps rounds at 60.
5. **Score ranges (PR-8, PROPOSED).** Each game exports an honest `SCORE_RANGE`. Tailspin's is exact (20 550). For Stack Shift and Glyph Trace the true ceiling is set by machine speed (one action per tick), far above any human. A range-normalized skill gap (PR-8 point 3) would understate skill for those two.

## Bow Hunt deviations from the packets

- `api/handler.ts` is `api/_handler.ts`. Vercel deploys every file in `api/` as a function; the underscore keeps the shared helper from becoming one.
- Added `src/vite-env.d.ts`. TypeScript 7 rejects the CSS import without it.
- With no pools that day, the contest page goes straight to free play, before asking anyone to join.
- Every packet test value matched the reference implementation on the first run. None was edited.
