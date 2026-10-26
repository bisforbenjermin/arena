/**
 * G2 — individual gate checks.
 * Each check returns a CheckResult: pass or rejection with a loggable reason.
 */

import { readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { build } from 'esbuild';
import { JSDOM } from 'jsdom';
import { makePrngFactory } from '../components/prng.js';
import type { GameModule, GameSim } from '../../contracts/game-module.js';

export interface CheckResult {
  pass: boolean;
  gate: string;
  reason?: string; // present on failure — logged for G1 prompt tuning
}

const CONTRACT_PATH = join(import.meta.dirname, '..', '..', 'contracts', 'game-module.ts');
const SIZE_LIMIT_BYTES = 5 * 1024 * 1024; // 5 MB

// ─── GATE 1 — FORBIDDEN APIs ─────────────────────────────────────────────────

const FORBIDDEN = ['Math.random()', 'Date.now()', 'performance.now()'];

export function checkForbiddenApis(source: string): CheckResult {
  for (const f of FORBIDDEN) {
    if (source.includes(f)) {
      return { pass: false, gate: 'forbidden-apis', reason: `source contains "${f}" (PR-1)` };
    }
  }
  return { pass: true, gate: 'forbidden-apis' };
}

// ─── GATE 2 — BUNDLE + SIZE ───────────────────────────────────────────────────

export async function bundleCandidate(
  indexPath: string,
  outfile: string,
): Promise<{ pass: boolean; error?: string }> {
  try {
    await build({
      entryPoints: [indexPath],
      bundle:      true,
      format:      'esm',
      outfile,
      platform:    'browser',
      alias: {
        '../../contracts/game-module': CONTRACT_PATH,
      },
      logLevel: 'silent',
    });
    return { pass: true };
  } catch (e) {
    return { pass: false, error: String(e) };
  }
}

export function checkBundleSize(bundlePath: string): CheckResult {
  const bytes = statSync(bundlePath).size;
  if (bytes > SIZE_LIMIT_BYTES) {
    return {
      pass:   false,
      gate:   'bundle-size',
      reason: `bundle is ${(bytes / 1024 / 1024).toFixed(2)} MB, limit is 5 MB`,
    };
  }
  return { pass: true, gate: 'bundle-size' };
}

// ─── GATE 3 — DETERMINISM (Node sim only, no DOM) ────────────────────────────

async function loadModule(bundlePath: string): Promise<GameModule> {
  // esbuild outputs ESM; dynamic import works in Node ESM context
  const mod = await import(bundlePath) as { default: GameModule };
  return mod.default;
}

function runSim(mod: GameModule, seed: number, inputTicks: number[]): number {
  const sim = mod.createSim();
  const prngFactory = makePrngFactory(seed);
  sim.init({ seed, speedMultiplier: 1 }, prngFactory);

  // Run for the declared duration (durationSeconds × 60 ticks)
  const totalTicks = mod.meta.durationSeconds * 60;
  const inputSet   = new Set(inputTicks);

  for (let tick = 1; tick <= totalTicks; tick++) {
    sim.tick(1 / 60);
    // Fire the most common input types on scheduled ticks
    const s = sim as unknown as Record<string, (() => void) | undefined>;
    if (inputSet.has(tick)) {
      (s['registerTap'] ?? s['registerHoldStart'] ?? (() => undefined))();
    }
  }
  const score = sim.getScore();
  sim.destroy();
  return score;
}

export async function checkDeterminism(bundlePath: string): Promise<CheckResult> {
  const SEED        = 0xdeadbeef;
  const INPUT_TICKS = [30, 60, 120, 240, 360, 480, 600, 720, 900];

  let mod: GameModule;
  try {
    mod = await loadModule(bundlePath);
  } catch (e) {
    return { pass: false, gate: 'determinism', reason: `import failed: ${String(e)}` };
  }

  const score1 = runSim(mod, SEED, INPUT_TICKS);
  const score2 = runSim(mod, SEED, INPUT_TICKS);

  if (score1 !== score2) {
    return {
      pass:   false,
      gate:   'determinism',
      reason: `scores diverged: run1=${score1} run2=${score2} (PR-1/PR-2 violation)`,
    };
  }
  return { pass: true, gate: 'determinism' };
}

// ─── GATE 3b — SCORE TYPE (FORMAT-1 point 1/2: terminal numeric, non-NaN) ────

export async function checkScoreNumeric(bundlePath: string): Promise<CheckResult> {
  let mod: GameModule;
  try {
    mod = await loadModule(bundlePath);
  } catch (e) {
    return { pass: false, gate: 'score-numeric', reason: `import failed: ${String(e)}` };
  }

  const sim: GameSim = mod.createSim();
  const prngFactory  = makePrngFactory(0xf07a71);
  sim.init({ seed: 0xf07a71, speedMultiplier: 1 }, prngFactory);
  const totalTicks = mod.meta.durationSeconds * 60;
  for (let tick = 1; tick <= totalTicks; tick++) sim.tick(1 / 60);
  const score = sim.getScore();
  sim.destroy();

  if (typeof score !== 'number') {
    return { pass: false, gate: 'score-numeric', reason: `getScore() returned ${typeof score}, not number (FORMAT-1 point 1)` };
  }
  if (Number.isNaN(score)) {
    return { pass: false, gate: 'score-numeric', reason: `getScore() returned NaN (FORMAT-1 point 1)` };
  }
  return { pass: true, gate: 'score-numeric' };
}

// ─── GATE 4 — LIFECYCLE (jsdom, view mount + destroy) ────────────────────────

export async function checkLifecycle(bundlePath: string): Promise<CheckResult> {
  let mod: GameModule;
  try {
    mod = await loadModule(bundlePath);
  } catch (e) {
    return { pass: false, gate: 'lifecycle', reason: `import failed: ${String(e)}` };
  }

  const dom = new JSDOM('<!DOCTYPE html><body></body>', {
    pretendToBeVisual: true,
    resources: 'usable',
  });
  const { document } = dom.window;

  // Provide a minimal canvas stub (view checks for null ctx and bails gracefully)
  const origCreate = document.createElement.bind(document);
  (document as unknown as Record<string, unknown>)['createElement'] = (tag: string) => {
    const el = origCreate(tag);
    if (tag === 'canvas') {
      (el as unknown as Record<string, unknown>)['getContext'] = () => null;
    }
    return el;
  };

  // Inject globals the view may reference
  const g = dom.window as unknown as Record<string, unknown>;
  g['document'] = document;

  try {
    const sim  = mod.createSim();
    const view = mod.createView();

    const prng = makePrngFactory(42);
    sim.init({ seed: 42, speedMultiplier: 1 }, prng);

    const container = document.createElement('div');
    view.mount(container, sim);
    view.onScore(() => undefined);

    // Advance a few ticks
    for (let i = 0; i < 10; i++) {
      sim.tick(1 / 60);
      view.render();
    }

    view.destroy();
    sim.destroy();
  } catch (e) {
    return { pass: false, gate: 'lifecycle', reason: `threw during lifecycle: ${String(e)}` };
  }

  return { pass: true, gate: 'lifecycle' };
}

// ─── GATE 5 — MEMORY LEAK (100 mount → destroy cycles) ───────────────────────

export async function checkMemoryLeak(bundlePath: string): Promise<CheckResult> {
  let mod: GameModule;
  try {
    mod = await loadModule(bundlePath);
  } catch (e) {
    return { pass: false, gate: 'memory-leak', reason: `import failed: ${String(e)}` };
  }

  const CYCLES = 100;
  // 2 MB growth across 100 cycles is a signal — adjust if legit allocations grow it
  const GROWTH_LIMIT_BYTES = 2 * 1024 * 1024;

  const dom = new JSDOM('<!DOCTYPE html><body></body>', { pretendToBeVisual: true });
  const { document } = dom.window;
  const origCreate = document.createElement.bind(document);
  (document as unknown as Record<string, unknown>)['createElement'] = (tag: string) => {
    const el = origCreate(tag);
    if (tag === 'canvas') {
      (el as unknown as Record<string, unknown>)['getContext'] = () => null;
    }
    return el;
  };

  if (global.gc) global.gc();
  const before = process.memoryUsage().heapUsed;

  for (let i = 0; i < CYCLES; i++) {
    const sim  = mod.createSim();
    const view = mod.createView();
    const prng = makePrngFactory(i);
    sim.init({ seed: i, speedMultiplier: 1 }, prng);
    const container = document.createElement('div');
    view.mount(container, sim);
    view.onScore(() => undefined);
    sim.tick(1 / 60);
    view.render();
    view.destroy();
    sim.destroy();
  }

  if (global.gc) global.gc();
  const after = process.memoryUsage().heapUsed;
  const growth = after - before;

  if (growth > GROWTH_LIMIT_BYTES) {
    return {
      pass:   false,
      gate:   'memory-leak',
      reason: `heap grew ${(growth / 1024).toFixed(0)} KB over ${CYCLES} cycles (limit: ${GROWTH_LIMIT_BYTES / 1024} KB)`,
    };
  }
  return { pass: true, gate: 'memory-leak' };
}
