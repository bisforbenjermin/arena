import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { BOWS, DEFAULT_SEED } from '../src/engine/constants';
import { compressInputs, expandInputs, makeReplay, runReplay } from '../src/engine/replay';
import { comboQuarters, hitPoints } from '../src/engine/scoring';
import { generateRunPlan } from '../src/engine/plan';
import { createInitialState, nextRound, step } from '../src/engine/sim';
import { makeLeadBot, makeNaiveBot, makeRandomBot, playRun, type Bot } from '../src/testing/bots';
import type { GameEvent, Input, ReplayLog } from '../src/engine/types';

function mulberry(a: number) {
  return () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
const bots: [string, () => Bot][] = [['lead', makeLeadBot], ['naive', makeNaiveBot], ['random', () => makeRandomBot(mulberry(3))]];

describe('replay', () => {
  it('compress and expand round-trip', () => {
    const inputs: Input[] = [
      { aimX: 1, aimY: 2, drawing: true }, { aimX: 1, aimY: 2, drawing: true },
      { aimX: 1, aimY: 2, drawing: false }, { aimX: 5, aimY: 2, drawing: false },
    ];
    expect(compressInputs(inputs)).toEqual([[2, 1, 2, 1], [1, 1, 2, 0], [1, 5, 2, 0]]);
    expect(expandInputs(compressInputs(inputs))).toEqual(inputs);
  });

  it('rescoring a JSON round-tripped log gives the live score, for every bot and seed', () => {
    for (const [name, mk] of bots) {
      for (let i = 0; i < 6; i++) {
        const { state, inputs, picks } = playRun(`replay-${name}-${i}`, mk(), (r) => (i + r) % 2);
        const log = JSON.parse(JSON.stringify(makeReplay('daily', `replay-${name}-${i}`, inputs, picks))) as ReplayLog;
        expect(runReplay(log), `${name} ${i}`).toEqual({
          ticks: state.tick, score: state.score, hits: state.stats.hits, shots: state.stats.shots,
          roundsCleared: state.summaries.filter((r) => r.passed).length, outcome: state.outcome,
        });
      }
    }
  });

  it('a log cut short mid-run rescoring stops where it ends', () => {
    const { inputs } = playRun('cut', makeLeadBot());
    const r = runReplay(makeReplay('practice', 'cut', inputs.slice(0, 700)));
    expect(r.ticks).toBe(700);
    expect(r.outcome).toBe('none');
  });

  it('the checked-in fixture still verifies', () => {
    const log = JSON.parse(readFileSync('fixtures/replay-bot.json', 'utf8')) as ReplayLog;
    const expected = JSON.parse(readFileSync('fixtures/replay-bot.expected.json', 'utf8'));
    expect(runReplay(log)).toEqual(expected);
  });
});

describe('scoring in a real run', () => {
  it('every hit pays exactly its formula, and a miss resets the combo', () => {
    let s = createInitialState(generateRunPlan(DEFAULT_SEED));
    const bot = makeLeadBot();
    const events: GameEvent[] = [];
    const bowAt = new Map<number, number>();
    while (s.phase !== 'over') {
      if (s.phase === 'roundEnd') { s = nextRound(s); continue; }
      s = step(s, bot(s));
      for (const e of s.events) if (e.type === 'fire') bowAt.set(e.arrowId, s.bow);
      events.push(...s.events);
    }
    let streak = 0, sawCombo = false;
    const arrowStreak = new Map<number, number>();
    for (const e of events) {
      if (e.type === 'miss') streak = 0;
      if (e.type !== 'hit') continue;
      if (e.multi === 1) { streak += 1; arrowStreak.set(e.arrowId, streak); }
      expect(e.streak).toBe(arrowStreak.get(e.arrowId));
      expect(e.points).toBe(hitPoints(e.species, e.long, e.streak, e.multi - 1, BOWS[bowAt.get(e.arrowId) ?? 0].multiPct));
      if (comboQuarters(e.streak) > 4) sawCombo = true;
    }
    expect(sawCombo).toBe(true);
    const fromEvents = events.reduce((n, e) => n + (e.type === 'hit' ? e.points : e.type === 'roundEnd' ? e.summary.arrowBonus + e.summary.perfectBonus : e.type === 'starBonus' ? e.points : 0), 0);
    expect(fromEvents).toBe(s.score);
  });
});

describe('bow choice', () => {
  it('is part of the replay: the same shots with the other bow score differently', () => {
    const { inputs, picks, state } = playRun('choice', makeLeadBot(), () => 1);
    expect(picks.length).toBeGreaterThan(0);
    expect(runReplay(makeReplay('daily', 'choice', inputs, picks)).score).toBe(state.score);
    expect(runReplay(makeReplay('daily', 'choice', inputs, picks.map(() => 0))).score).not.toBe(state.score);
  });
});

describe('skill gradient', () => {
  it('leading beats aiming at the bird, which beats random shooting', () => {
    const avg = (mk: () => Bot) => {
      let t = 0;
      for (let i = 0; i < 16; i++) t += playRun(`grad-${i}`, mk()).state.score;
      return t / 16;
    };
    const lead = avg(makeLeadBot), naive = avg(makeNaiveBot), random = avg(() => makeRandomBot(mulberry(11)));
    expect(lead).toBeGreaterThan(naive * 3);
    expect(naive).toBeGreaterThan(random);
  });
});

describe('golden scores', () => {
  // Pinned so a balance change can't slip in unnoticed. If you change a constant on purpose, update these and say so.
  it('pins the lead bot on three seeds', () => {
    const scores = [DEFAULT_SEED, 'daily-2026-11-26', 'practice-abc'].map((seed) => playRun(seed, makeLeadBot()).state.score);
    expect(scores).toEqual(PINNED);
  });
});

const PINNED: number[] = [23347, 20925, 25480];
