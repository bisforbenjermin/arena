# Bow Hunt: Thanksgiving

Portrait mobile archery game. Ducks, geese, turkeys and a rare golden turkey cross a dusk sky; you draw a bow at the bottom of the screen and lead them. Phase 1 of the founder's Phaser spec: the game itself. Phase 2 (daily sponsor pools on Supabase) comes after, and its prize side waits on the stakes ruling (see Open items below).

## Play

- **Aim and shoot:** press anywhere, drag back like a bowstring, let go. The arrow flies opposite the drag. Holding longer draws harder; the ring turns gold at full power.
- **Keyboard:** ← → (or A/D) swing the bow, ↑ re-centers it, hold space to draw, let go to shoot. Esc or P pauses. On the title, Enter starts the daily hunt and space starts practice.
- **Rounds:** 5 rounds of 10 birds with 15 arrows each. Hit the round's quota (5, 6, 6, 7, 8) to move on. Miss it and the hunt is over. Birds get faster and change height more often each round.
- **Bow choices:** after clearing round 1, pick A or B; again after round 3. The choice is recorded in the replay log, so a re-scored run uses the same bows.

  | After | A | B |
  |---|---|---|
  | Round 1 | Recurve bow: quick draw, 17 arrows | Longbow: slow draw, 14 arrows, double multi-kill bonus |
  | Round 3 | Compound bow: fastest draw, 17 arrows | Crossbow: dead-flat bolts, only 11 |

- **Bonus targets** (don't count toward the quota):
  - **Shooting stars:** one per round, high and fast. Each pays 250; hitting 3 in one hunt adds 3,000.
  - **Hummingbirds:** about every other round, one zips across just under the HUD. Tiny and very fast. Pays 2,000.
- **Multi-kills:** arrows pass through what they hit. A second bird on one arrow pays +200, a third +600, a fourth +1,500 (doubled with the Longbow). From round 2, some rounds send 3 birds (4 from round 4) in a slanted line, so a triple or quad is possible but takes a well-timed, well-aimed shot.
- **Points:** goose 75, turkey 100, duck 150, golden turkey 1,000 (about one round in six has one).
  - Hits more than 600 units from the bow pay +50%.
  - Each arrow that hits after another adds +25% to the combo, up to ×3. A miss resets it.
  - Unused arrows pay 25 each when you pass a round. A perfect round adds 1,000.
- **Modes:**
  - **Daily hunt:** today's flock (Pacific date), same for everyone, no aim guide.
  - **Practice:** a new flock every time, with the aim guide drawn from the engine's own arc.
- **Pause:** the pause button, or automatic when you switch apps.

## Commands

```
npm install
npm test            # 51 tests: engine rules, scoring, replay, skill gradient, aim mapping, run loop
npm run dev         # http://localhost:5173
npm run dev:phone   # same, reachable from a phone on your Wi-Fi (open the Network URL it prints)
npm run build       # static site in dist/
npm run fixture     # regenerate fixtures/replay-bot.json after a deliberate balance change
npm run verify -- fixtures/replay-bot.json fixtures/replay-bot.expected.json
```

Add `?canvas` to the URL to force the 2D renderer (old phones with flaky WebGL; headless test browsers).

## Test on your phone

1. **Easiest:** open the published playtest link on your phone while signed in to Claude.
2. **Local:** run `npm run dev:phone` on a computer on the same Wi-Fi. Open the `Network:` address it prints in the phone's browser.
3. **Hosted:** deploy `dist/` to Vercel as a static site: import the repo, set the root to `bow-hunt`, build `npm run build`, output `dist`.
4. Add it to the home screen for full-screen play.

## How it's built

```
src/engine/    deterministic rules: integer math, seeded sfc32, no DOM, no clock. Runs on Deno for the Phase 2 Edge Function.
src/game/      Phaser 3 layer. Reads engine state, never changes it.
  art/         every texture drawn in code at boot (birds, scenery, props)
  scenes/      Title, Play, Results (round card), GameOver
  ui/          HUD, bow, kraft-tag widgets, backdrop
  fx/, audio/  feathers, popups, shake; synthesized WebAudio sound
  run.ts       fixed 60 Hz step loop that records inputs for the replay
src/contest/   day math, ranking, replay shape check. Kept for Phase 2.
src/testing/   lead, naive and random bots for tests
```

- **Determinism:** the engine draws every random value up front from the seed, steps at a fixed 60 Hz, and uses only integer math. Bird paths come from a hardcoded sine table, because native sine can differ between JavaScript engines. A test bans `Math.random`, `Date` and float trig in `src/engine/`.
- **Replays:** the game records the input for every tick (aim point and whether the bow is drawn) plus each A/B bow pick. `runReplay` re-runs the hunt from the seed and those inputs. The game-over card runs that check and shows the result, and the server will run the same check in Phase 2.
- **Skill:** the tests check that the bot that leads its birds scores more than three times the one that aims straight at them, which in turn beats random shooting. Three golden scores are pinned, so any balance change shows up in CI.

## Open items

- **Stakes (HANDOFF-bow-hunt-stakes):** still not a DECISIONS file. Phase 2's free daily pools can be built; real prizes wait for the ruling and counsel's Official Rules (`public/rules.html` is a placeholder).
- **Daily attempts:** Phase 1 allows unlimited retries of the daily flock. Phase 2 needs a rule: one attempt, several with the best counting, or unlimited.
- **Aim guide:** it shows only in practice. That is a display choice, not a security control: a modified client could draw its own guide. The real defenses are server-side replay checks and score anomaly review.
- **Look:** the art is original, drawn in code, and stays clear of Duck Hunt's name and look.
