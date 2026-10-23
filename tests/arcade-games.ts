/**
 * Arcade games gate — tailspin, stack-shift, glyph-trace
 *
 * Runs under Node with no DOM (PR-3: an import error here is a PR-3 failure).
 * For each game:
 *   - F1 meta: contract 1.0.0, durationSeconds 25–60, no reserved control scheme (PR-4, PR-6)
 *   - no banned strings anywhere in the bundle source (PR-1/PR-2, G2's rule)
 *   - determinism: same seed + same bot inputs → identical score and event log (PR-1, PR-2)
 *   - true replay: the event log, JSON round-tripped the way a server receives it, fed
 *     through a fresh sim via input() at its stamped ticks reproduces the score (PR-3, PR-7 shape)
 *   - fixed round length: every round ends at exactly 3600 ticks (PROPOSED FORMAT-1)
 *   - skill gradient: a competent bot clearly beats an idle or sloppy one (G3's question)
 *   - 100 init→destroy cycles
 *   - golden scores pinned for one seed: a balance change must bump gameVersion (PR-4).
 *     The pins are regression values taken from this implementation on 2026-10-23, not
 *     independently derived; they exist so a balance change can't slip through silently.
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

import type { GameEvent, GameModule, GameSim } from '../contracts/game-module.js';
import { makePrngFactory } from '../factory/components/prng.js';

import TailspinModule, { TailspinSim, speedAt, SCORE_RANGE as TS_RANGE } from '../games/tailspin/index.js';
import StackShiftModule, { StackShiftSim, ROTATIONS, COLS, ROWS, SCORE_RANGE as SS_RANGE } from '../games/stack-shift/index.js';
import GlyphTraceModule, { GlyphTraceSim, segDist, SCORE_RANGE as GT_RANGE } from '../games/glyph-trace/index.js';

const DT = 1 / 60;
const SEEDS = [0xc0ffee42, 1, 42, 7777, 2026];

type Inputtable = GameSim & { input(e: GameEvent): void; isDone(): boolean; getCurrentTick(): number };

function start<T extends GameSim>(mod: GameModule, seed: number): T {
  const sim = mod.createSim();
  sim.init({ seed, speedMultiplier: 1 }, makePrngFactory(seed));
  return sim as T;
}

/** Plays a round: before each tick the bot may call input methods on the sim. */
function play<T extends Inputtable>(mod: GameModule, seed: number, bot: (sim: T) => void) {
  const sim = start<T>(mod, seed);
  while (!sim.isDone()) {
    bot(sim);
    sim.tick(DT);
  }
  return { score: sim.getScore(), log: sim.getEventLog(), ticks: sim.getCurrentTick(), sim };
}

/** The server's path: a fresh sim, events applied after `tick` ticks and before tick + 1. */
function replay(mod: GameModule, seed: number, log: readonly GameEvent[]) {
  const sim = start<Inputtable>(mod, seed);
  let i = 0;
  while (!sim.isDone()) {
    while (i < log.length && log[i].tick === sim.getCurrentTick()) sim.input(log[i++]);
    sim.tick(DT);
  }
  return { score: sim.getScore(), log: sim.getEventLog(), ticks: sim.getCurrentTick() };
}

// ─── BOTS ─────────────────────────────────────────────────────────────────────

/** Tailspin lookahead pilot: compares holding vs releasing over the next `horizon` ticks. */
function tailspinPilot(horizon: number) {
  return (sim: TailspinSim): void => {
    const s = sim.getState();
    let best = false;
    let bestCost = Infinity;
    for (const hold of [false, true]) {
      let { y, vy, spin } = s;
      let x = s.scrollX + 140_000;
      let cost = 0;
      for (let i = 0; i < horizon; i++) {
        spin = hold ? Math.min(1000, spin + 60) : Math.max(0, spin - 40);
        vy = Math.min(8000, Math.max(-7000, vy + 450 - Math.trunc((spin * 9) / 10)));
        y += vy;
        x += speedAt(s.tick + i);
        const c = sim.corridorAt(x);
        let target = c.center;
        for (const g of sim.getGates()) if (Math.abs(g.x * 1000 - x) < 120_000) target = g.gap * 1000;
        cost += ((y - target) / 1000) ** 2;
        if (y - 14_000 < c.center - c.half || y + 14_000 > c.center + c.half) cost += 1e6;
      }
      if (cost < bestCost) { bestCost = cost; best = hold; }
    }
    if (best !== s.holding) (best ? sim.press() : sim.release());
  };
}

/** Stack Shift greedy: every `every` ticks, take the placement that scores most, then hugs walls and pieces. */
function stackGreedy(every: number) {
  return (sim: StackShiftSim): void => {
    const s = sim.getState();
    if (s.tick % every !== 0) return;
    const shape = sim.currentShape();
    let best: { rot: number; col: number; row: number; value: number } | null = null;
    for (let rot = 0; rot < 4; rot++) {
      for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
          if (!sim.fits(col, row, rot, shape)) continue;
          const cells = ROTATIONS[shape][rot].map(([dx, dy]) => [col + dx, row + dy] as const);
          const filled = new Set(cells.map(([x, y]) => y * COLS + x));
          let value = 0;
          const occ = (x: number, y: number) => x < 0 || y < 0 || x >= COLS || y >= ROWS || s.grid[y * COLS + x] !== 0 || filled.has(y * COLS + x);
          for (let y = 0; y < ROWS; y++) {
            let n = 0;
            for (let x = 0; x < COLS; x++) if (occ(x, y)) n++;
            if (n === COLS) value += 1000;
            else value += n * n;
          }
          for (let x = 0; x < COLS; x++) {
            let n = 0;
            for (let y = 0; y < ROWS; y++) if (occ(x, y)) n++;
            if (n === ROWS) value += 1000;
          }
          if (!best || value > best.value) best = { rot, col, row, value };
        }
      }
    }
    if (!best) return;
    for (let r = s.rot; r !== best.rot; r = (r + 1) % 4) sim.rotate();
    sim.place(best.col, best.row);
  };
}

/** Stack Shift random: a valid placement chosen by a seeded generator (not the game's PRNG). */
function stackRandom(every: number, seed: number) {
  const rand = makePrngFactory(seed)();
  return (sim: StackShiftSim): void => {
    const s = sim.getState();
    if (s.tick % every !== 0) return;
    const shape = sim.currentShape();
    const options: [number, number][] = [];
    for (let row = 0; row < ROWS; row++) for (let col = 0; col < COLS; col++) if (sim.fits(col, row, s.rot, shape)) options.push([col, row]);
    if (options.length === 0) return;
    const [col, row] = options[Math.floor(rand() * options.length)];
    sim.place(col, row);
  };
}

/** Glyph tracer: waits `react` ticks, then moves `speed` px per tick along the lines, offset by `wobble` px. */
function glyphTracer(react: number, speed: number, wobble: number) {
  let path: { x: number; y: number }[] = [];
  let glyph = -1;
  let step = 0;
  return (sim: GlyphTraceSim): void => {
    const s = sim.getState();
    if (s.phase !== 'show') return;
    if (glyph !== s.glyphIndex) {
      glyph = s.glyphIndex;
      step = 0;
      const nodes = sim.currentGlyph();
      path = [];
      for (let k = 1; k < nodes.length; k++) {
        const a = nodes[k - 1], b = nodes[k];
        const len = Math.max(1, Math.round(Math.hypot(b.x - a.x, b.y - a.y) / speed));
        for (let i = 1; i <= len; i++) {
          const off = wobble * (i % 2 === 0 ? 1 : -1);
          path.push({ x: Math.round(a.x + ((b.x - a.x) * i) / len) + off, y: Math.round(a.y + ((b.y - a.y) * i) / len) + off });
        }
      }
      const last = nodes[nodes.length - 1];
      path.push({ x: last.x, y: last.y });
    }
    const t = s.tick - s.glyphStart;
    if (t < react) return;
    if (t === react) {
      const n0 = sim.currentGlyph()[0];
      sim.touch(n0.x, n0.y);
      return;
    }
    if (step < path.length) sim.drag(path[step].x, path[step++].y);
  };
}

const idle = () => (): void => {};

// ─── GAME TABLE ───────────────────────────────────────────────────────────────

type Case = {
  mod: GameModule;
  file: string;
  range: { min: number; max: number };
  good: () => (sim: any) => void;
  weak: () => (sim: any) => void;
  golden: { good: number; weak: number };
};

const CASES: Case[] = [
  {
    mod: TailspinModule, file: '../games/tailspin/index.ts', range: TS_RANGE,
    good: () => tailspinPilot(20), weak: () => idle(),
    golden: { good: 18250, weak: 550 },
  },
  {
    mod: StackShiftModule, file: '../games/stack-shift/index.ts', range: SS_RANGE,
    good: () => stackGreedy(30), weak: () => stackRandom(30, 99),
    golden: { good: 4080, weak: 120 },
  },
  {
    mod: GlyphTraceModule, file: '../games/glyph-trace/index.ts', range: GT_RANGE,
    good: () => glyphTracer(12, 10, 0), weak: () => glyphTracer(40, 3, 14),
    golden: { good: 6600, weak: 1141 },
  },
];

for (const c of CASES) {
  const id = c.mod.meta.id;

  test(`${id}: F1 meta (PR-4, PR-6)`, () => {
    const m = c.mod.meta;
    assert.equal(m.contractVersion, '1.0.0');
    assert.match(m.gameVersion, /^\d+\.\d+\.\d+$/);
    assert.ok(m.durationSeconds >= 25 && m.durationSeconds <= 60, 'durationSeconds must be 25–60');
    assert.notEqual(m.controlScheme, 'tilt');
    assert.equal(m.id, m.slug);
  });

  test(`${id}: no banned strings in the bundle source (PR-1, PR-2, G2)`, () => {
    const src = readFileSync(fileURLToPath(new URL(c.file, import.meta.url)), 'utf8');
    for (const banned of ['Math.random', 'Date.now', 'performance.now']) {
      assert.ok(!src.includes(banned), `${id} contains ${banned}`);
    }
  });

  test(`${id}: deterministic, replayable, fixed-length, in range`, () => {
    const a = play(c.mod, SEEDS[0], c.good());
    const b = play(c.mod, SEEDS[0], c.good());
    assert.equal(a.score, b.score);
    assert.deepEqual(a.log, b.log);
    assert.equal(a.ticks, 3600, 'round must last exactly 60 s');

    const wire = JSON.parse(JSON.stringify(a.log)) as GameEvent[];
    const r = replay(c.mod, SEEDS[0], wire);
    assert.equal(r.score, a.score, 'replayed score must match the live score');
    assert.deepEqual(r.log, a.log, 'replayed log must match the live log');
    assert.equal(r.ticks, 3600);

    const nothing = play(c.mod, SEEDS[0], idle());
    assert.equal(nothing.ticks, 3600, 'an idle round also lasts exactly 60 s');
    for (const s of [a.score, nothing.score]) {
      assert.ok(Number.isInteger(s) && s >= c.range.min && s <= c.range.max, `score ${s} outside ${c.range.min}–${c.range.max}`);
    }
  });

  test(`${id}: skill separates scores on every seed`, () => {
    for (const seed of SEEDS) {
      const good = play(c.mod, seed, c.good()).score;
      const weak = play(c.mod, seed, c.weak()).score;
      assert.ok(good > weak, `seed ${seed}: competent ${good} should beat weak ${weak}`);
      assert.ok(weak <= good * 0.75, `seed ${seed}: weak ${weak} is within 25% of competent ${good}`);
    }
  });

  test(`${id}: seeds change the round`, () => {
    const scores = new Set(SEEDS.map((s) => JSON.stringify(play(c.mod, s, c.weak()).log)));
    const goods = new Set(SEEDS.map((s) => play(c.mod, s, c.good()).score));
    assert.ok(scores.size > 1 || goods.size > 1, 'different seeds should produce different rounds');
  });

  test(`${id}: 100 init→destroy cycles`, () => {
    const sim = c.mod.createSim();
    for (let i = 0; i < 100; i++) {
      sim.init({ seed: i, speedMultiplier: 1 }, makePrngFactory(i));
      sim.tick(DT);
      sim.destroy();
    }
    const fresh = start<Inputtable>(c.mod, SEEDS[0]);
    assert.equal(fresh.getCurrentTick(), 0);
    assert.equal(fresh.getScore(), 0);
    assert.equal(fresh.getEventLog().length, 0);
  });

  test(`${id}: golden scores for seed 0xc0ffee42 (bump gameVersion if these move — PR-4)`, () => {
    const actual = { good: play(c.mod, SEEDS[0], c.good()).score, weak: play(c.mod, SEEDS[0], c.weak()).score };
    assert.deepEqual(actual, c.golden);
  });
}

// ─── GAME-SPECIFIC RULES ──────────────────────────────────────────────────────

test('tailspin: crashing costs the streak, not the round', () => {
  const r = play(TailspinModule, SEEDS[0], idle());
  const s = (r.sim as TailspinSim).getState();
  assert.ok(s.bonks > 10);
  assert.equal(r.ticks, 3600);
});

test('tailspin: duplicate presses are not logged', () => {
  const sim = start<TailspinSim>(TailspinModule, 5);
  sim.press();
  sim.press();
  sim.tick(DT);
  sim.release();
  sim.release();
  assert.deepEqual(sim.getEventLog().map((e) => e.type), ['hold_start', 'hold_end']);
});

test('stack-shift: invalid placements are ignored and unlogged', () => {
  const sim = start<StackShiftSim>(StackShiftModule, 5);
  sim.place(-1, 0);
  sim.place(COLS, 0);
  sim.input({ tick: 0, type: 'place', payload: { col: 1.5, row: 0 } });
  assert.equal(sim.getEventLog().length, 0);
  assert.equal(sim.getState().placed, 0);
});

test('stack-shift: a full row clears for 10 per cell; two lines double', () => {
  // White-box: find a seed whose first piece is a mono, then preset the board.
  let seed = 0;
  while (seed < 5000 && start<StackShiftSim>(StackShiftModule, seed).currentShape() !== 0) seed++;
  assert.ok(seed < 5000, 'no seed starts with a mono');
  const withBoard = (cells: [number, number][]) => {
    const sim = start<StackShiftSim>(StackShiftModule, seed);
    const base = sim.getState();
    const grid = base.grid.slice();
    for (const [x, y] of cells) grid[y * COLS + x] = 1;
    (sim as unknown as { s_: typeof base }).s_ = { ...base, grid };
    return sim;
  };
  const rowCells: [number, number][] = Array.from({ length: COLS - 1 }, (_, x) => [x, ROWS - 1]);
  const colCells: [number, number][] = Array.from({ length: ROWS - 1 }, (_, y) => [COLS - 1, y]);

  const one = withBoard(rowCells);
  one.place(COLS - 1, ROWS - 1);
  assert.equal(one.getState().linesCleared, 1);
  assert.equal(one.getScore(), COLS * 10);
  assert.ok(one.getState().grid.every((v) => v === 0));

  const two = withBoard([...rowCells, ...colCells]);
  two.place(COLS - 1, ROWS - 1);
  assert.equal(two.getState().linesCleared, 2);
  assert.equal(two.getScore(), (COLS + ROWS - 1) * 10 * 2);
  assert.ok(two.getState().grid.every((v) => v === 0));
});

test('stack-shift: one placement per tick; the queue never runs out', () => {
  const sim = start<StackShiftSim>(StackShiftModule, 9);
  let placedThisTick = 0;
  for (let i = 0; i < 3; i++) {
    const before = sim.getState().placed;
    outer: for (let row = 0; row < ROWS; row++) for (let col = 0; col < COLS; col++) if (sim.fits(col, row)) { sim.place(col, row); break outer; }
    placedThisTick += sim.getState().placed - before;
  }
  assert.equal(placedThisTick, 1);
  const r = play(StackShiftModule, 9, stackGreedy(1));
  assert.equal(r.ticks, 3600);
  assert.ok((r.sim as StackShiftSim).getState().queueIndex > 240, 'a one-per-tick bot cycles past the queue length');
});

test('glyph-trace: segDist is exact on simple cases', () => {
  assert.equal(segDist({ x: 5, y: 5 }, { x: 0, y: 0 }, { x: 10, y: 0 }), 5);
  assert.equal(segDist({ x: -3, y: 4 }, { x: 0, y: 0 }, { x: 10, y: 0 }), 5);
  assert.equal(segDist({ x: 13, y: 4 }, { x: 0, y: 0 }, { x: 10, y: 0 }), 5);
  assert.equal(segDist({ x: 2, y: 2 }, { x: 2, y: 2 }, { x: 2, y: 2 }), 0);
});

test('glyph-trace: touching away from the first node does nothing; lifting restarts', () => {
  const sim = start<GlyphTraceSim>(GlyphTraceModule, 5);
  const n = sim.currentGlyph();
  sim.touch(n[0].x + 200 > 400 ? n[0].x - 200 : n[0].x + 200, n[0].y);
  assert.equal(sim.getState().tracing, false);
  assert.equal(sim.getEventLog().length, 0);
  sim.touch(n[0].x, n[0].y);
  assert.equal(sim.getState().tracing, true);
  sim.lift();
  assert.equal(sim.getState().tracing, false);
  assert.equal(sim.getState().nextNode, 0);
});

test('glyph-trace: idle play misses every glyph and scores 0', () => {
  const r = play(GlyphTraceModule, SEEDS[0], idle());
  const s = (r.sim as GlyphTraceSim).getState();
  assert.equal(r.score, 0);
  assert.ok(s.misses >= 14);
});
