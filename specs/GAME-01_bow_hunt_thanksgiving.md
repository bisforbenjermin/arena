# Bow Hunt: Thanksgiving — Build Packets

Six packets for a Sonnet subagent. Run order and parallelism:

```
P1 ─┬─ P2 ─┐
    └─ P3 ─┴─ P4 ─ P5 ─ P6
```

Every test value below was computed from a reference implementation of this exact spec.

---

## GLOBAL RULES — prepend to every packet

- Project root `bow-hunt/`. TypeScript strict, Node 20+.
- **Engine code (`src/engine/**`)**: pure functions only; never mutate arguments, always return new objects. Integer math only — every division wrapped in `Math.trunc` or `Math.floor` exactly as written. Forbidden in engine: `Math.random`, `Date`, `performance`, `Math.sin/cos/tan/atan2/sqrt/pow/hypot`.
- Units: positions and velocities are integer **milli-pixels** (px × 1000). `Input.aimX/aimY` are integer **world pixels**.
- Touch only the files your packet lists. Add no dependencies beyond those named.
- You cannot ask questions. If the spec conflicts with reality, implement the most literal reading and record it under DEVIATIONS.
- **Never edit an expected value in a test to make it pass.** If a test with a given value fails, stop and report BLOCKED with the failing output.
- End by printing the STATUS BLOCK, filled in.

---

## P1 — Scaffold + shared contracts

**Role:** Build engineer setting up the repo every other packet depends on.

**Dependencies:** none.

**Task**
1. Create `bow-hunt/package.json`: `"name":"bow-hunt"`, `"private":true`, `"type":"module"`, scripts: `dev: vite`, `build: tsc --noEmit && vite build`, `typecheck: tsc --noEmit`, `test: vitest run`, `verify: tsx scripts/verify-replay.ts`.
2. `npm i react react-dom` and `npm i -D typescript vite @vitejs/plugin-react vitest jsdom @testing-library/react @types/react @types/react-dom @types/node tsx`.
3. `tsconfig.json`: strict true, target ES2022, module ESNext, moduleResolution Bundler, jsx react-jsx, noEmit true, skipLibCheck true, lib `["ES2022","DOM","DOM.Iterable"]`, types `["node"]`, include `["src","tests","scripts"]`.
4. `vite.config.ts`: `defineConfig` from `vitest/config`; plugins `[react()]`; `test: { environment: 'node', include: ['tests/**/*.test.ts','tests/**/*.test.tsx'] }`.
5. `index.html` with `<div id="root"></div>` and `<script type="module" src="/src/main.tsx">`. `src/main.tsx` renders `<h1>Bow Hunt</h1>` into `#root` (P6 replaces it).
6. `src/engine/types.ts`, exactly:
```ts
export type Vec = { x: number; y: number };
export type Segment = { heading: number; ticks: number };
export type TurkeyPlan = { spawnX: number; segments: Segment[] };
export type WavePlan = { round: number; turkeys: TurkeyPlan[] };
export type RunPlan = { seed: string; waves: WavePlan[] };
export type TurkeyStatus = 'flying' | 'escaping' | 'falling' | 'gone';
export type Turkey = { id: number; pos: Vec; vel: Vec; segIndex: number; segTicksLeft: number; age: number; status: TurkeyStatus };
export type Arrow = { id: number; pos: Vec; vel: Vec };
export type Input = { aimX: number; aimY: number; drawing: boolean };
export type Phase = 'intermission' | 'playing' | 'over';
export type Outcome = 'none' | 'cleared' | 'failed';
export type GameState = { tick: number; phase: Phase; phaseTicks: number; waveIndex: number;
  turkeys: Turkey[]; arrows: Arrow[]; arrowsLeft: number; drawTicks: number; wasDrawing: boolean;
  score: number; roundHits: number; totalHits: number; shotsFired: number; outcome: Outcome; plan: RunPlan };
export type InputRun = [count: number, aimX: number, aimY: number, drawing: 0 | 1];
export type ReplayLog = { version: 1; seed: string; inputs: InputRun[] };
export type ReplayResult = { ticks: number; score: number; totalHits: number; shotsFired: number; outcome: Outcome };
```
7. `src/engine/constants.ts`, exactly:
```ts
export const MILLI = 1000, TICK_HZ = 60;
export const WORLD_W = 960, WORLD_H = 540, GROUND_Y = 430, BOW_X = 480, BOW_Y = 500;
export const ROUNDS = 5, WAVES_PER_ROUND = 5, TURKEYS_PER_WAVE = 2, SEGMENTS_PER_TURKEY = 12;
export const SPAWN_X_MIN = 100, SPAWN_X_MAX = 860, SEG_TICKS_MIN = 40, SEG_TICKS_MAX = 100;
export const HEADINGS: readonly (readonly [number, number])[] =
  [[1000,0],[707,-707],[0,-1000],[-707,-707],[-1000,0],[-707,707],[0,1000],[707,707]];
export const TURKEY_SPEED = [3, 4, 5, 6, 7];
export const TURKEY_RADIUS = 28, ESCAPE_AFTER_TICKS = 420, ESCAPE_SPEED = 8, FALL_SPEED = 6;
export const ARROWS_PER_WAVE = 3, DRAW_MIN_TICKS = 6, DRAW_MAX_TICKS = 45;
export const ARROW_MIN_SPEED = 12, ARROW_MAX_SPEED = 28, ARROW_GRAVITY = 300;
export const WAVE_GAP_TICKS = 60;
export const ROUND_QUOTA = [6, 6, 7, 8, 9];
export const HIT_POINTS = [500, 750, 1000, 1250, 1500];
export const PERFECT_ROUND_BONUS = 5000;
export const DEFAULT_SEED = 'gobble-2026';
```
8. `tests/contracts.test.ts`: (a) `HEADINGS.length === 8`; (b) `TURKEY_SPEED`, `ROUND_QUOTA`, `HIT_POINTS` each have length `ROUNDS`; (c) every numeric export (arrays flattened) satisfies `Number.isInteger`.

**Output Contract:** files above; `types.ts` and `constants.ts` byte-for-byte as given.

**Done Criteria**
- `npm install` exits 0.
- `npm run typecheck` exits 0.
- `npm test` passes 3+ tests.
- `npm run build` exits 0 and `dist/index.html` exists.

**Handoff:** P2 and P3 may start in parallel. `types.ts`/`constants.ts` are frozen; later packets report needed changes as DEVIATIONS, never edit them.

```
STATUS: DONE | BLOCKED
PACKET: P1
FILES: <paths>
CHECKS: <command → pass/fail, test counts>
DEVIATIONS: none | <bullets>
BLOCKER: none | <command + first 20 lines of output>
```

---

## P2 — Seeded RNG + run plan

**Role:** Determinism engineer. You own the only randomness in the game.

**Dependencies:** P1.

**Task**
1. `src/engine/rng.ts`, exactly:
```ts
export type Rng = { next(): number; int(min: number, max: number): number };
export function cyrb128(str: string): [number, number, number, number] {
  let h1 = 1779033703, h2 = 3144134277, h3 = 1013904242, h4 = 2773480762;
  for (let i = 0, k; i < str.length; i++) {
    k = str.charCodeAt(i);
    h1 = h2 ^ Math.imul(h1 ^ k, 597399067); h2 = h3 ^ Math.imul(h2 ^ k, 2869860233);
    h3 = h4 ^ Math.imul(h3 ^ k, 951274213); h4 = h1 ^ Math.imul(h4 ^ k, 2716044179);
  }
  h1 = Math.imul(h3 ^ (h1 >>> 18), 597399067); h2 = Math.imul(h4 ^ (h2 >>> 22), 2869860233);
  h3 = Math.imul(h1 ^ (h3 >>> 17), 951274213); h4 = Math.imul(h2 ^ (h4 >>> 19), 2716044179);
  h1 ^= (h2 ^ h3 ^ h4); h2 ^= h1; h3 ^= h1; h4 ^= h1;
  return [h1 >>> 0, h2 >>> 0, h3 >>> 0, h4 >>> 0];
}
export function sfc32(a: number, b: number, c: number, d: number): () => number {
  return () => {
    a |= 0; b |= 0; c |= 0; d |= 0;
    const t = (((a + b) | 0) + d) | 0;
    d = (d + 1) | 0; a = b ^ (b >>> 9); b = (c + (c << 3)) | 0;
    c = (c << 21) | (c >>> 11); c = (c + t) | 0;
    return t >>> 0;
  };
}
export function createRng(seed: string): Rng {
  const n = sfc32(...cyrb128(seed));
  return { next: n, int: (min, max) => min + (n() % (max - min + 1)) };
}
```
2. `src/engine/plan.ts`: `export function generateRunPlan(seed: string): RunPlan`. One `createRng(seed)`. Draw order is fixed (tests depend on it):
   for `w` in `0 … ROUNDS*WAVES_PER_ROUND-1`, for `t` in `0 … TURKEYS_PER_WAVE-1`:
   `spawnX = rng.int(SPAWN_X_MIN, SPAWN_X_MAX) * MILLI`; then for `k` in `0 … SEGMENTS_PER_TURKEY-1`: `heading = rng.int(0, 7)`, then `ticks = rng.int(SEG_TICKS_MIN, SEG_TICKS_MAX)`.
   `round = Math.trunc(w / WAVES_PER_ROUND)`.
   `plan.ts` is the only file allowed to import `rng.ts`. All randomness is drawn before play, so player input can never change turkey behavior.
3. `tests/rng.test.ts` and `tests/plan.test.ts` asserting:
   - `cyrb128('gobble-2026')` → `[2128659087, 377130720, 3616792137, 3834409593]`
   - `createRng('gobble-2026').next()` ×3 → `2045232104, 2402350770, 3577587183`
   - `generateRunPlan('gobble-2026')`: 25 waves × 2 turkeys × 12 segments; `waves[0].turkeys[0].spawnX === 566000`; its `segments[0]` = `{heading:2, ticks:53}`, `segments[1]` = `{heading:3, ticks:69}`; `waves[24].round === 4`; `waves[24].turkeys[1].spawnX === 166000`, `segments[11]` = `{heading:1, ticks:86}`
   - `generateRunPlan('gobble-2027').waves[0].turkeys[0].spawnX === 667000`
   - Two calls with the same seed are `toEqual`.

**Output Contract:** `src/engine/rng.ts`, `src/engine/plan.ts`, two test files.

**Done Criteria**
- `npm run typecheck` exits 0; `npm test` all pass.
- `grep -rl "/rng'" src` prints exactly `src/engine/plan.ts`.

**Handoff:** P4 calls `generateRunPlan`.

```
STATUS: DONE | BLOCKED
PACKET: P2
FILES: <paths>
CHECKS: <command → pass/fail, test counts>
DEVIATIONS: none | <bullets>
BLOCKER: none | <command + first 20 lines of output>
```

---

## P3 — Turkey + arrow physics

**Role:** Gameplay physics engineer. Pure per-entity functions, no game flow.

**Dependencies:** P1. (Parallel with P2.)

**Task.** `M` = `MILLI`, `R` = `TURKEY_RADIUS`.
1. `src/engine/math.ts`:
```ts
export function isqrt(n: number): number {
  if (n < 2) return n;
  let x = n, y = Math.floor((x + 1) / 2);
  while (y < x) { x = y; y = Math.floor((x + Math.floor(n / x)) / 2); }
  return x;
}
```
2. `src/engine/turkeys.ts`:
   - `headingVel(h, round): Vec` → `{x: HEADINGS[h][0]*TURKEY_SPEED[round], y: HEADINGS[h][1]*TURKEY_SPEED[round]}`
   - `spawnTurkey(tp: TurkeyPlan, round, id): Turkey` → pos `{tp.spawnX, GROUND_Y*M}`, vel `headingVel(seg0.heading)`, segIndex 0, segTicksLeft `seg0.ticks`, age 0, `'flying'`.
   - `escapeTurkey(t)` → status `'escaping'`, vel `{0, -ESCAPE_SPEED*M}`. `hitTurkey(t)` → status `'falling'`, vel `{0, FALL_SPEED*M}`.
   - `stepTurkey(t, tp, round): Turkey`:
     - `'gone'`: return `t`.
     - `'falling'`: pos.y += `FALL_SPEED*M`; age unchanged; becomes `'gone'` if pos.y ≥ `(GROUND_Y+R)*M`.
     - `'escaping'`: age+1; pos.y −= `ESCAPE_SPEED*M`; `'gone'` if pos.y < `-R*M`.
     - `'flying'`: age+1. If age ≥ `ESCAPE_AFTER_TICKS` → `escapeTurkey`, then move as escaping this same tick (no second age increment). Else: segTicksLeft−1; if it hits 0 → segIndex = `(segIndex+1) % SEGMENTS_PER_TURKEY`, vel = `headingVel(newSeg.heading)`, segTicksLeft = `newSeg.ticks`. Then pos += vel. Then bounce: x in `[R*M, (WORLD_W-R)*M]`, y in `[R*M, GROUND_Y*M]`; below min → clamp, that vel component = +abs; above max → clamp, component = −abs.
3. `src/engine/arrows.ts`:
   - `fireArrow(drawTicks, aimX, aimY, id): Arrow`: `dx=(aimX-BOW_X)*M`; `dy=Math.min((aimY-BOW_Y)*M, -M)`; `len=isqrt(dx*dx+dy*dy)`; `speed=ARROW_MIN_SPEED*M + Math.trunc((ARROW_MAX_SPEED-ARROW_MIN_SPEED)*M*drawTicks/DRAW_MAX_TICKS)`; vel `{Math.trunc(dx*speed/len), Math.trunc(dy*speed/len)}`; pos `{BOW_X*M, BOW_Y*M}`.
   - `stepArrow(a)`: vel.y += `ARROW_GRAVITY`, then pos += new vel.
   - `arrowOut(a)`: `pos.x<0 || pos.x>WORLD_W*M || pos.y>WORLD_H*M`.
   - `arrowHitsTurkey(a, t)`: `dx²+dy² ≤ (R*M)²`. No status check.
4. Tests `tests/math.test.ts`, `tests/turkeys.test.ts`, `tests/arrows.test.ts` (plan `TP` = spawnX 566000, segments `[{2,53},{3,69}]` + 10× `{0,40}`):
   - isqrt: 0→0, 1→1, 15→3, 16→4, 250000000000→500000, 999999999999→999999
   - `fireArrow(45,480,0,0).vel` `{0,-28000}`; `(45,780,100,1)` `{16800,-22400}`; `(6,480,900,2)` `{0,-14133}`
   - `stepArrow` from pos `{480000,500000}` vel `{0,-28000}` → pos `{480000,472300}`, vel `{0,-27700}`
   - `spawnTurkey(TP,0,0)` → pos `{566000,430000}`, vel `{0,-3000}`, segTicksLeft 53; one step → pos.y 427000, segTicksLeft 52, age 1
   - Base B = flying, pos `{500000,300000}`, vel `{0,0}`, segIndex 0, age 10. B with segTicksLeft 1 → segIndex 1, segTicksLeft 69, vel `{-2121,-2121}`, pos `{497879,297879}`
   - B with pos.x 930000, vel `{3000,0}`, segTicksLeft 10 → pos.x 932000, vel.x −3000
   - B with age 419, segTicksLeft 10 → age 420, `'escaping'`, pos.y 292000
   - falling at y 455000 → y 461000, `'gone'`; escaping at y −25000 → y −33000, `'gone'`
   - Hit: arrow `(100000,100000)` vs turkey `(128000,100000)` → true; `(128001,100000)` → false
   - Purity: deep-freeze every argument; no function throws.

**Done Criteria**
- `npm run typecheck` exits 0; `npm test` all pass.
- `grep -rnE "Math\.(random|sin|cos|tan|atan2|sqrt|pow|hypot)|Date|performance" src/engine` prints nothing.

**Handoff:** P4 composes these functions.

```
STATUS: DONE | BLOCKED
PACKET: P3
FILES: <paths>
CHECKS: <command → pass/fail, test counts>
DEVIATIONS: none | <bullets>
BLOCKER: none | <command + first 20 lines of output>
```

---

## P4 — Simulation step + game flow

**Role:** Game-loop engineer. One pure `step` function drives the whole game.

**Dependencies:** P1, P2, P3.

**Task**
1. `src/engine/sim.ts`:
   - `createInitialState(plan)`: tick 0, `'intermission'`, phaseTicks 0, waveIndex 0, turkeys `[]`, arrows `[]`, arrowsLeft 0, drawTicks 0, wasDrawing false, score/roundHits/totalHits/shotsFired 0, outcome `'none'`, plan.
   - `currentRound(s)` = `s.plan.waves[s.waveIndex].round`.
   - `step(s, input): GameState`, in this exact order. `wave = plan.waves[waveIndex]`, `round = wave.round`.
     0. `'over'` → return `s` itself.
     1. tick+1.
     2. `'intermission'`: phaseTicks+1. If ≥ `WAVE_GAP_TICKS`: phase `'playing'`, phaseTicks 0, turkeys = `wave.turkeys.map((tp,i) => spawnTurkey(tp, round, waveIndex*TURKEYS_PER_WAVE+i))`, arrows `[]`, arrowsLeft `ARROWS_PER_WAVE`, drawTicks 0. Set wasDrawing = `input.drawing`. Return.
     3. `'playing'`:
        a. Bow: if `input.drawing` → drawTicks = `min(drawTicks+1, DRAW_MAX_TICKS)`. Else if `wasDrawing` (release): if drawTicks ≥ `DRAW_MIN_TICKS` and arrowsLeft > 0 → append `fireArrow(drawTicks, input.aimX, input.aimY, shotsFired)`, arrowsLeft−1, shotsFired+1; then drawTicks = 0. wasDrawing = `input.drawing`.
        b. arrows = `arrows.map(stepArrow).filter(a => !arrowOut(a))`.
        c. turkeys = `turkeys.map((t,i) => stepTurkey(t, wave.turkeys[i], round))`.
        d. If arrowsLeft 0 and no arrows: every `'flying'` turkey → `escapeTurkey`.
        e. Hits: each arrow in order checks turkeys in index order with status `'flying'|'escaping'`; first hit → `hitTurkey`, remove arrow, roundHits+1, totalHits+1, score += `HIT_POINTS[round]`.
        f. If every turkey is `'gone'`: set arrows `[]`, drawTicks 0. If `waveIndex % WAVES_PER_ROUND === WAVES_PER_ROUND-1`: if roundHits === `WAVES_PER_ROUND*TURKEYS_PER_WAVE` add `PERFECT_ROUND_BONUS`; then if roundHits < `ROUND_QUOTA[round]` → `'over'`/`'failed'`; else if round === `ROUNDS-1` → `'over'`/`'cleared'`; else roundHits = 0. If not over: waveIndex+1, `'intermission'`, phaseTicks 0.
2. `src/engine/bot.ts`: `botInput(s, t): Input` — first `'flying'` turkey `f`: aim `{Math.trunc(f.pos.x/MILLI), Math.trunc(f.pos.y/MILLI)}`, else `{480,100}`; `drawing = (t % 60) < 45`.
3. `tests/sim.test.ts` with plan `generateRunPlan('gobble-2026')`, IDLE `{480,100,false}`, DRAW `{480,100,true}`:
   - 60 IDLE → `'playing'`, 2 turkeys, arrowsLeft 3, tick 60.
   - then 45 DRAW + 1 IDLE → shotsFired 1, arrowsLeft 2, arrows.length 1, drawTicks 0.
   - fresh: 60 IDLE, 3 DRAW, 1 IDLE → shotsFired 0.
   - IDLE until `'over'` → after exactly 2537 steps: `'failed'`, score 0, waveIndex 4.
   - Constructed: initial state with phase `'playing'`, arrowsLeft 2, turkeys `[flying (480000,200000) vel 0 segTicksLeft 1000 age 0 id 0, same at (100000,100000) id 1]`, arrows `[{id 0, pos (480000,210000), vel (0,-20000)}]`; one IDLE step → totalHits 1, roundHits 1, score 500, turkeys[0] `'falling'`, turkeys[1] `'flying'`, arrows empty.
   - Bot: for t from 0, deep-freeze state, `state = step(state, botInput(state, t))`, stop at `'over'` or t = 20000 → tick 4134, `'failed'`, score 13000, totalHits 19, shotsFired 43, waveIndex 14. A second run is `JSON.stringify`-equal.

**Done Criteria:** `npm run typecheck` exits 0; `npm test` all pass; P3's grep still prints nothing.

**Handoff:** P5 replays `step`; P6 renders it.

```
STATUS: DONE | BLOCKED
PACKET: P4
FILES: <paths>
CHECKS: <command → pass/fail, test counts>
DEVIATIONS: none | <bullets>
BLOCKER: none | <command + first 20 lines of output>
```

---

## P5 — Replay verification + determinism guard

**Role:** Integrity engineer. Prove a score from inputs alone.

**Dependencies:** P4.

**Task**
1. `src/engine/replay.ts`:
   - `compressInputs(inputs: Input[]): InputRun[]` — merge consecutive inputs with equal aimX, aimY, drawing; drawing stored as `1`/`0`.
   - `expandInputs(runs: InputRun[]): Input[]` — exact inverse.
   - `runReplay(log: ReplayLog): ReplayResult` — if `log.version !== 1` throw `Error('Unsupported replay version')`. `state = createInitialState(generateRunPlan(log.seed))`; for each expanded input: break if `'over'`, else `state = step(state, input)`. Return `{ticks: state.tick, score, totalHits, shotsFired, outcome}`.
2. `scripts/make-fixture.ts`: play `botInput` on `DEFAULT_SEED` (same loop as P4's bot test), record each input, write `fixtures/replay-bot.json` (`{version:1, seed, inputs: compressInputs(...)}`) and `fixtures/replay-bot.expected.json` (`runReplay` result, 2-space JSON). Run it once: `npx tsx scripts/make-fixture.ts`.
3. `scripts/verify-replay.ts`: args `<replay.json> [expected.json]`. Prints result JSON. With an expected file: deep-compare; print `OK` and exit 0, or print `MISMATCH` plus both objects and exit 1.
4. `tests/replay.test.ts`:
   - `compressInputs` of 3× `{480,100,false}` + 2× `{480,100,true}` → `[[3,480,100,0],[2,480,100,1]]`; expand round-trips to the original.
   - Fixture replays to exactly `{ticks:4134, score:13000, totalHits:19, shotsFired:43, outcome:'failed'}`.
   - Version 2 throws.
5. `tests/guard.test.ts`: read every `.ts` file in `src/engine` with `fs`; assert none matches `/Math\.(random|sin|cos|tan|atan2|sqrt|pow|hypot)\b|\bDate\b|\bperformance\b/`; assert only `plan.ts` contains `/rng'`.

**Done Criteria**
- `npm run typecheck` exits 0; `npm test` all pass.
- `fixtures/replay-bot.json` and `fixtures/replay-bot.expected.json` exist.
- `npm run verify -- fixtures/replay-bot.json fixtures/replay-bot.expected.json` prints `OK`, exit 0.

**Handoff:** P6 uses `compressInputs` for "Copy replay." Any server-side checker runs `runReplay`.

```
STATUS: DONE | BLOCKED
PACKET: P5
FILES: <paths>
CHECKS: <command → pass/fail, test counts>
DEVIATIONS: none | <bullets>
BLOCKER: none | <command + first 20 lines of output>
```

---

## P6 — React UI

**Role:** Front-end engineer. Render state and capture input. Change no game logic.

**Dependencies:** P4, P5. UI files may use floats and `Math.atan2`; engine files may not.

**Task**
1. `src/ui/loop.ts`: `STEP_MS = 1000/TICK_HZ`, `MAX_STEPS = 5`. `ticksToRun(accMs, frameMs)`: `acc = accMs+frameMs`; `steps = min(floor(acc/STEP_MS), MAX_STEPS)`; if steps === MAX_STEPS → acc 0, else acc −= steps*STEP_MS; return `{steps, accMs: acc}`.
2. `src/ui/input.ts`: `toWorld(clientX, clientY, rect)` → `x = round((clientX−left)*WORLD_W/width)`, `y = round((clientY−top)*WORLD_H/height)`, clamped to `[0,WORLD_W]`/`[0,WORLD_H]`.
3. `src/ui/App.tsx`: seed = `?seed=` or `DEFAULT_SEED`. State, pointer and input log live in refs. requestAnimationFrame loop (skip if `requestAnimationFrame` is undefined): per tick, build `Input` from the pointer, push it to the log, `step`. Stop stepping at `'over'`. Re-render HUD once per frame. Pointer: move → aim; down → drawing true + `setPointerCapture`; up/cancel → false. At `'over'`, show an overlay: `Feast secured!` (cleared) or `The turkeys got away.` (failed), `Final score {n}`, a `Play again` button (same seed, clear log) and a `Copy replay` button (`navigator.clipboard.writeText(JSON.stringify({version:1, seed, inputs: compressInputs(log)}))`). `<h1>Bow Hunt: Thanksgiving</h1>` above the canvas.
4. `src/ui/GameCanvas.tsx`: `<canvas width=960 height=540>`, CSS width 100%, max-width 960px, `aspect-ratio:16/9`, `touch-action:none`. Skip drawing if `getContext` returns null.
5. `src/ui/draw.ts` `drawFrame(ctx, s, aim)`, shapes only, no assets: sky gradient `#F4A259→#F7D08A` down to GROUND_Y; ground `#6B8F3A`. Turkey: body circle r=`TURKEY_RADIUS` `#7A4A2A`, 5-feather fan behind in `#C1502E/#E0A458/#8C3B1E`, head r=8 `#B23A48`; falling turkeys rotated 180°; skip `'gone'`. Arrow: 24px line `#3B2A1A` along velocity. Bow: arc r=30 at (BOW_X,BOW_Y), string pulled back `drawTicks/DRAW_MAX_TICKS*20`px, dashed 120px aim line. Power bar bottom-left 200×12.
6. `src/ui/Hud.tsx`: spans with `data-testid` `hud-round|hud-score|hud-arrows|hud-hits` and text `Round {r+1}/5`, `Score {score}`, `Arrows {arrowsLeft}`, `Hits {roundHits}/{ROUND_QUOTA[r]}`, `r = currentRound(s)`.
7. Replace `src/main.tsx` to render `<App/>` with `src/ui/styles.css`.
8. `tests/ui.test.tsx` (first line `// @vitest-environment jsdom`):
   - `ticksToRun(0,40).steps` 2; `ticksToRun(0,1000)` → `{steps 5, accMs 0}`; `ticksToRun(10,5)` → `{steps 0, accMs 15}`
   - `toWorld(240,135,{left:0,top:0,width:480,height:270})` → `{480,270}`; `toWorld(-50,900, same)` → `{0,540}`
   - `<Hud>` with initial state → `Round 1/5`, `Score 0`, `Arrows 0`, `Hits 0/6`
   - `<App/>` renders the title and a `canvas`.

**Done Criteria**
- `npm run typecheck` exits 0; `npm test` all pass.
- `npm run build` exits 0; `dist/index.html` exists.
- `grep -rn "Math.random" src` prints nothing.

**Handoff:** Ship-ready for a static host. The founder plays it in `npm run dev` and tunes the game.

```
STATUS: DONE | BLOCKED
PACKET: P6
FILES: <paths>
CHECKS: <command → pass/fail, test counts>
DEVIATIONS: none | <bullets>
BLOCKER: none | <command + first 20 lines of output>
```

---

## FOUNDER CALLS — rule on these separately

1. **Stakes.** Leaderboard only, or prizes/sponsors? The replay files make server-side verification possible, but no packet builds the server. Prizes need three more things: server-issued seeds, server-run `runReplay`, and a legal pass on skill-contest rules, which vary by state.
2. **Seed policy.** Option A: one seed per day for everyone. Fair comparison, but turkey paths get memorized and shared. Option B: a fresh seed per run, issued by a server to stop seed-shopping. The packets currently use `?seed=` or `gobble-2026`.
3. **Name and art.** Don't ship under "Duck Hunt" or with its dog or look; that's Nintendo IP. "Bow Hunt: Thanksgiving" is a working title. The packets ship primitive shapes only, so you still need to decide who makes the sprites.
4. **Touch controls.** With point-at-target aiming, a finger covers the turkey on mobile. The alternative is slingshot drag-back from the bow. Only P6 changes, since the sim takes an aim point either way. Decide before running P6.
5. **Tuning.** The quotas, speeds, arrow counts, draw window and gravity are all unplaytested. They're set so a bot that aims straight at turkeys without leading them fails in round 3, meaning leading the target is required. Changing any constant changes the exact values in P4 and P5. After tuning, rerun `make-fixture.ts` and update those numbers on purpose.
6. **Launch scope.** Thanksgiving is Nov 26, five weeks out. Hosting, analytics, sound and score sharing aren't in these packets. Add a P7 if you want them.
