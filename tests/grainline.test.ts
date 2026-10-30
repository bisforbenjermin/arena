/**
 * Grainline — determinism, teardown, contract checks and skill evidence.
 * Sim only: no DOM, no jsdom (PR-3). Follows tests/determinism.ts.
 *
 * The evidence run reads its seeds and bars from games/grainline/skill-evidence.json
 * and must reproduce that file's numbers exactly. To regenerate the file after a
 * balance change: GRAINLINE_WRITE_EVIDENCE=1 npx tsx --test tests/grainline.test.ts
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, writeFileSync } from 'node:fs';

import GrainlineModule, { GrainlineSim, replayGrainline, normalizeAngle, TOTAL_TICKS } from '../games/grainline/index.js';
import { playRound, botRng, BOT_TUNING, type BotProfile } from '../games/grainline/controller.js';
import { RESERVED_CONTROL_SCHEMES, type PrngFactory, type RoundConfig } from '../contracts/game-module.js';

const DT = 1 / 60;
const roundPrng = (seed: number): PrngFactory => () => botRng(seed);
const cfg = (seed: number, speedMultiplier = 1): RoundConfig => ({ seed, speedMultiplier });
const botSeedFor = (seed: number): number => (seed * 7919 + 1) >>> 0;
const EVIDENCE_URL = new URL('../games/grainline/skill-evidence.json', import.meta.url);
const GAME_DIR = new URL('../games/grainline/', import.meta.url);

// ─── CONTRACT ────────────────────────────────────────────────────────────────

test('grainline: meta conforms (PR-4 versions, PR-6 scheme, 25–60 s, agent-built)', () => {
  const m = GrainlineModule.meta;
  assert.equal(m.contractVersion, '1.0.0');
  assert.equal(m.gameVersion, '1.0.0');
  assert.equal(m.generatedBy, 'agent');
  assert.ok(!RESERVED_CONTROL_SCHEMES.has(m.controlScheme));
  assert.ok(m.durationSeconds >= 25 && m.durationSeconds <= 60);
});

test('grainline: no forbidden strings anywhere in the game folder (G2 compile gate)', () => {
  for (const f of ['index.ts', 'controller.ts', 'provenance.json', 'skill-evidence.json']) {
    const src = readFileSync(new URL(f, GAME_DIR), 'utf8');
    for (const s of ['Math.random', 'Date.now', 'performance.now']) assert.ok(!src.includes(s), `${f} contains ${s}`);
  }
});

test('grainline: round length is exactly 1800 ticks (30 s) and ignores dt (PR-2)', () => {
  const sim = new GrainlineSim();
  sim.init(cfg(5), roundPrng(5));
  let n = 0;
  while (!sim.isDone()) { sim.tick(n % 2 ? 0.5 : 999); n++; }
  assert.equal(n, TOTAL_TICKS);
  sim.tick(DT);
  assert.equal(sim.getCurrentTick(), TOTAL_TICKS);
  sim.destroy();
});

// ─── DETERMINISM ─────────────────────────────────────────────────────────────

test('grainline: identical seed + input log give identical score and event log (PR-1)', () => {
  for (const seed of [1, 42, 0xc0ffee42, 2026]) {
    const a = playRound('expert', cfg(seed), roundPrng(seed), 7);
    const b = playRound('expert', cfg(seed), roundPrng(seed), 7);
    assert.strictEqual(a.getScore(), b.getScore());
    assert.deepStrictEqual(a.getEventLog(), b.getEventLog());
    a.destroy(); b.destroy();
  }
});

test('grainline: replay from seed + swipe log reproduces live play for every bot', () => {
  for (const p of ['random', 'greedy', 'expert'] as BotProfile[]) {
    for (let seed = 1; seed <= 25; seed++) {
      const live = playRound(p, cfg(seed), roundPrng(seed), botSeedFor(seed));
      const rep = replayGrainline(cfg(seed), roundPrng(seed), live.getInputLog());
      assert.strictEqual(rep.getScore(), live.getScore(), `${p} seed ${seed}`);
      assert.deepStrictEqual(rep.getEventLog(), live.getEventLog());
      live.destroy(); rep.destroy();
    }
  }
});

test('grainline: speedMultiplier is clamped and stays deterministic', () => {
  for (const sp of [0.1, 0.5, 1, 2, 3, 99, Number.NaN]) {
    const a = playRound('expert', cfg(11, sp), roundPrng(11), 3);
    const b = playRound('expert', cfg(11, sp), roundPrng(11), 3);
    assert.strictEqual(a.getScore(), b.getScore());
    a.destroy(); b.destroy();
  }
});

// ─── RULES ───────────────────────────────────────────────────────────────────

test('grainline: input hygiene rejects NaN, double swipes and swipes with no glyph', () => {
  assert.equal(normalizeAngle(Number.NaN), null);
  assert.equal(normalizeAngle(-90), 270);
  assert.equal(normalizeAngle(719.6), 0);
  const sim = new GrainlineSim();
  sim.init(cfg(9), roundPrng(9));
  assert.equal(sim.registerSwipe(0), false);
  while (sim.getActiveGrain() === null) sim.tick(DT);
  assert.equal(sim.registerSwipe(Number.NaN), false);
  assert.equal(sim.registerSwipe(0), true);
  assert.equal(sim.registerSwipe(0), false);
  sim.destroy();
});

test('grainline: a wrong swipe scores 0, resolves the glyph and resets the combo', () => {
  const sim = new GrainlineSim();
  sim.init(cfg(3), roundPrng(3));
  while (sim.getActiveGrain() === null) sim.tick(DT);
  const g = sim.getActiveGrain()!;
  sim.registerSwipe([90, 0, 135, 45][g]); // perpendicular to the grain
  assert.equal(sim.getScore(), 0);
  assert.equal(sim.getCombo(), 0);
  assert.equal(sim.getMisses(), 1);
  assert.equal(sim.getActiveGrain(), null);
  sim.destroy();
});

test('grainline: higher score is better (FORMAT-1 point 2) — expert out-scores random', () => {
  const e = playRound('expert', cfg(21), roundPrng(21), 1);
  const r = playRound('random', cfg(21), roundPrng(21), 1);
  assert.ok(e.getScore() > r.getScore());
  e.destroy(); r.destroy();
});

// ─── TEARDOWN ────────────────────────────────────────────────────────────────

test('grainline: 100 create→init→play→destroy cycles leave nothing behind', () => {
  for (let i = 0; i < 100; i++) {
    const sim = GrainlineModule.createSim() as GrainlineSim;
    sim.init(cfg(i + 1), roundPrng(i + 1));
    for (let t = 0; t < 120; t++) sim.tick(DT);
    sim.destroy();
    assert.equal(sim.getEventLog().length, 0);
    assert.equal(sim.getInputLog().length, 0);
    assert.equal(sim.getActiveGrain(), null);
    assert.ok(sim.isDone());
    sim.tick(DT); // a destroyed sim stays inert
    assert.equal(sim.getEventLog().length, 0);
  }
});

// ─── SKILL EVIDENCE ──────────────────────────────────────────────────────────

interface BotStats { mean: number; sd: number; min: number; max: number; }
const r2 = (x: number): number => Math.round(x * 100) / 100;
function stats(xs: number[]): BotStats {
  const mean = xs.reduce((a, b) => a + b, 0) / xs.length;
  const sd = Math.sqrt(xs.reduce((a, b) => a + (b - mean) ** 2, 0) / xs.length);
  return { mean: r2(mean), sd: r2(sd), min: Math.min(...xs), max: Math.max(...xs) };
}

function measure(from: number, to: number, speed: number): Record<BotProfile, BotStats> {
  const out = {} as Record<BotProfile, BotStats>;
  for (const p of ['random', 'greedy', 'expert'] as BotProfile[]) {
    const xs: number[] = [];
    for (let seed = from; seed <= to; seed++) {
      const sim = playRound(p, cfg(seed, speed), roundPrng(seed), botSeedFor(seed));
      xs.push(sim.getScore());
      sim.destroy();
    }
    out[p] = stats(xs);
  }
  return out;
}

function topEnd(seed: number, players: number): { distinctScores: number; tiedForFirst: number } {
  const counts = new Map<number, number>();
  for (let p = 1; p <= players; p++) {
    const sim = playRound('expert', cfg(seed), roundPrng(seed), p);
    counts.set(sim.getScore(), (counts.get(sim.getScore()) ?? 0) + 1);
    sim.destroy();
  }
  return { distinctScores: counts.size, tiedForFirst: counts.get(Math.max(...counts.keys()))! };
}

test('grainline: skill evidence meets the provisional bars and matches skill-evidence.json', () => {
  const SEEDS = { from: 1, to: 200, count: 200 };
  const bots1 = measure(SEEDS.from, SEEDS.to, 1);
  const bots2 = measure(SEEDS.from, SEEDS.to, 2);
  const cv1 = r2(bots1.expert.sd / bots1.expert.mean * 100) / 100;
  const cv2 = r2(bots2.expert.sd / bots2.expert.mean * 100) / 100;
  const ties = topEnd(777, 50);

  const bars = {
    source: 'Provisional bars from canon BUILD step 5, until G3 sets real ones.',
    randomAtMostHalfOfExpert: bots1.random.mean <= bots1.expert.mean / 2 && bots2.random.mean <= bots2.expert.mean / 2,
    greedyBetween: bots1.random.mean < bots1.greedy.mean && bots1.greedy.mean < bots1.expert.mean
      && bots2.random.mean < bots2.greedy.mean && bots2.greedy.mean < bots2.expert.mean,
    expertVariationAtMost15Percent: cv1 <= 0.15 && cv2 <= 0.15,
  };

  const evidence = {
    gameId: 'grainline',
    gameVersion: GrainlineModule.meta.gameVersion,
    generatedAt: '2026-10-29',
    kind: 'measured',
    note: 'Measured by tests/grainline.test.ts on Node. Speed 1 is the casual setting, speed 2 a broadcast final.',
    rerun: 'npm test (runs tests/grainline.test.ts, which recomputes every number below and fails on any difference).',
    seeds: { ...SEEDS, roundPrng: 'mulberry32(seed), the house test PRNG from tests/determinism.ts', botPrng: 'mulberry32(seed * 7919 + 1), separate from the round' },
    reactionLimitTicks: 12,
    bots: {
      random: { description: 'Ignores the glyph: uniform angle, swipes 6–60 ticks after it appears.', tuning: BOT_TUNING.random, ...bots1.random },
      greedy: { description: 'Reads the grain sloppily: ±32°, 15% misreads, 22–55 ticks.', tuning: BOT_TUNING.greedy, ...bots1.greedy },
      expert: { description: 'Reads the grain from the screen, ±8°, reacts 12–18 ticks (never under 200 ms).', tuning: BOT_TUNING.expert, ...bots1.expert },
    },
    speed2: bots2,
    seedConsistency: { expertCoefficientOfVariation: cv1, expertCoefficientOfVariationSpeed2: cv2 },
    topEnd: { seed: 777, expertPlayers: 50, ...ties, why: 'Prize rounds share a seed; experts must separate rather than tie at a ceiling.' },
    bars,
  };

  if (process.env.GRAINLINE_WRITE_EVIDENCE === '1') {
    writeFileSync(EVIDENCE_URL, JSON.stringify(evidence, null, 2) + '\n');
  }
  console.log(`grainline evidence: random ${bots1.random.mean}±${bots1.random.sd} · greedy ${bots1.greedy.mean}±${bots1.greedy.sd} · expert ${bots1.expert.mean}±${bots1.expert.sd} · CV ${cv1} · speed2 expert CV ${cv2} · top-end ${ties.distinctScores} distinct, ${ties.tiedForFirst} at first`);

  assert.ok(bars.randomAtMostHalfOfExpert, 'random mean exceeds half the expert mean');
  assert.ok(bars.greedyBetween, 'greedy mean is not between random and expert');
  assert.ok(bars.expertVariationAtMost15Percent, `expert CV ${cv1} / ${cv2} exceeds 15%`);
  assert.ok(ties.tiedForFirst <= 5, `${ties.tiedForFirst} of 50 experts tied for first`);

  const committed = JSON.parse(readFileSync(EVIDENCE_URL, 'utf8'));
  assert.deepStrictEqual(committed, JSON.parse(JSON.stringify(evidence)), 'skill-evidence.json is stale; regenerate it');
});
