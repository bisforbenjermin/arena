/**
 * Determinism gate — PR-1, PR-2, PR-3
 *
 * Runs under Node with no DOM, no jsdom, no browser shim of any kind.
 * Imports only the sim half of each F4 reference game.
 *
 * PR-3: if the sim imports fail, it means the sim references a browser global.
 *       An import error here is a PR-3 failure, not a test harness failure.
 * PR-1: both runs must produce a byte-identical score and identical event log.
 * PR-2: the sim uses tick-based timing; a drifting timestep would break the
 *       second run. dt is always 1/60 — identical between both runs.
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';

import { PrecisionTapSim } from '../games/precision-tap/index.js';
import { PressureHoldSim } from '../games/pressure-hold/index.js';

import type { PrngFactory, RoundConfig, GameEvent } from '../contracts/game-module.js';

// ─── PRNG ────────────────────────────────────────────────────────────────────
// Mulberry32 — a deterministic, seeded PRNG with no browser dependencies.
// Stands in for whatever PrngFactory the runtime will inject.
function makePrngFactory(seed: number): PrngFactory {
  return (): (() => number) => {
    let s = seed >>> 0;
    return (): number => {
      s = (s + 0x6d2b79f5) >>> 0;
      let t = Math.imul(s ^ (s >>> 15), 1 | s);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) >>> 0;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  };
}

const SEED   = 0xc0ffee42;
const CONFIG: RoundConfig = { seed: SEED, speedMultiplier: 1 };
const TOTAL  = 1800; // 30 s × 60 ticks/s
const DT     = 1 / 60; // fixed timestep — PR-2

// ─── PRECISION TAP ───────────────────────────────────────────────────────────

// Fixed input: send one tap shortly after each target's expected spawn tick.
// Spacing = floor(1800 / 15) = 120; first spawn ≈ base=0*120+30 so tap at 60,
// then every 120 ticks. Exact hit/miss is PRNG-dependent and irrelevant to the
// test — what matters is that both runs record the identical outcome.
const PRECISION_TAP_TICKS = new Set<number>(
  Array.from({ length: 15 }, (_, i) => 60 + i * 120),
);

function runPrecisionTap(): { score: number; log: readonly GameEvent[] } {
  const sim = new PrecisionTapSim();
  sim.init(CONFIG, makePrngFactory(SEED));
  for (let i = 0; i < TOTAL; i++) {
    sim.tick(DT);
    if (PRECISION_TAP_TICKS.has(sim.getCurrentTick())) {
      sim.registerTap();
    }
  }
  const result = { score: sim.getScore(), log: sim.getEventLog() };
  sim.destroy();
  return result;
}

// ─── PRESSURE HOLD ───────────────────────────────────────────────────────────

// Fixed input: four hold/release pairs spread across the round.
// registerHoldStart/End are called BEFORE tick() so the state is active during
// that tick's scoring pass.
const HOLD_SCRIPT: Array<[number, 'start' | 'end']> = [
  [  60, 'start'], [ 180, 'end'],
  [ 300, 'start'], [ 480, 'end'],
  [ 600, 'start'], [ 900, 'end'],
  [1000, 'start'], [1400, 'end'],
];

function runPressureHold(): { score: number; log: readonly GameEvent[] } {
  const sim = new PressureHoldSim();
  sim.init(CONFIG, makePrngFactory(SEED));
  const script = new Map(HOLD_SCRIPT);
  for (let tick = 1; tick <= TOTAL; tick++) {
    const action = script.get(tick);
    if (action === 'start') sim.registerHoldStart();
    if (action === 'end')   sim.registerHoldEnd();
    sim.tick(DT);
  }
  const result = { score: sim.getScore(), log: sim.getEventLog() };
  sim.destroy();
  return result;
}

// ─── TESTS ───────────────────────────────────────────────────────────────────

test('precision-tap: two runs with identical seed + input log produce identical score and event log', () => {
  const run1 = runPrecisionTap();
  const run2 = runPrecisionTap();

  assert.strictEqual(run1.score, run2.score, 'scores differ between runs');
  assert.deepStrictEqual(run1.log, run2.log, 'event logs differ between runs');
});

test('pressure-hold: two runs with identical seed + input log produce identical score and event log', () => {
  const run1 = runPressureHold();
  const run2 = runPressureHold();

  assert.strictEqual(run1.score, run2.score, 'scores differ between runs');
  assert.deepStrictEqual(run1.log, run2.log, 'event logs differ between runs');
});
