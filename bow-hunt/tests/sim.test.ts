import { describe, expect, it } from 'vitest';
import { generateRunPlan } from '../src/engine/plan';
import { createInitialState, step } from '../src/engine/sim';
import { botInput } from '../src/engine/bot';
import type { GameState, Input } from '../src/engine/types';
import { deepFreeze } from './helpers';

const plan = deepFreeze(generateRunPlan('gobble-2026'));
const IDLE: Input = { aimX: 480, aimY: 100, drawing: false };
const DRAW: Input = { aimX: 480, aimY: 100, drawing: true };
const run = (s: GameState, input: Input, n: number) => { for (let i = 0; i < n; i++) s = step(s, input); return s; };

describe('sim', () => {
  it('starts wave 1 after the gap', () => {
    const s = run(createInitialState(plan), IDLE, 60);
    expect(s.phase).toBe('playing');
    expect(s.turkeys.length).toBe(2);
    expect(s.arrowsLeft).toBe(3);
    expect(s.tick).toBe(60);
  });

  it('fires on release after a full draw', () => {
    let s = run(createInitialState(plan), IDLE, 60);
    s = run(s, DRAW, 45);
    s = step(s, IDLE);
    expect(s.shotsFired).toBe(1);
    expect(s.arrowsLeft).toBe(2);
    expect(s.arrows.length).toBe(1);
    expect(s.drawTicks).toBe(0);
  });

  it('a too-short draw does not fire', () => {
    let s = run(createInitialState(plan), IDLE, 60);
    s = run(s, DRAW, 3);
    s = step(s, IDLE);
    expect(s.shotsFired).toBe(0);
  });

  it('an idle player fails after exactly 2537 steps', () => {
    let s = createInitialState(plan);
    let n = 0;
    while (s.phase !== 'over' && n < 10000) { s = step(s, IDLE); n++; }
    expect(n).toBe(2537);
    expect(s.outcome).toBe('failed');
    expect(s.score).toBe(0);
    expect(s.waveIndex).toBe(4);
  });

  it('scores a constructed hit on the first eligible turkey', () => {
    const base = createInitialState(plan);
    const s0: GameState = deepFreeze({
      ...base, phase: 'playing', arrowsLeft: 2,
      turkeys: [
        { id: 0, pos: { x: 480000, y: 200000 }, vel: { x: 0, y: 0 }, segIndex: 0, segTicksLeft: 1000, age: 0, status: 'flying' },
        { id: 1, pos: { x: 100000, y: 100000 }, vel: { x: 0, y: 0 }, segIndex: 0, segTicksLeft: 1000, age: 0, status: 'flying' },
      ],
      arrows: [{ id: 0, pos: { x: 480000, y: 210000 }, vel: { x: 0, y: -20000 } }],
    });
    const s = step(s0, IDLE);
    expect(s.totalHits).toBe(1);
    expect(s.roundHits).toBe(1);
    expect(s.score).toBe(500);
    expect(s.turkeys[0].status).toBe('falling');
    expect(s.turkeys[1].status).toBe('flying');
    expect(s.arrows.length).toBe(0);
  });

  it('the reference bot run is exact and deterministic', () => {
    const play = () => {
      let s = createInitialState(generateRunPlan('gobble-2026'));
      for (let t = 0; t < 20000 && s.phase !== 'over'; t++) {
        deepFreeze(s);
        s = step(s, botInput(s, t));
      }
      return s;
    };
    const a = play();
    expect(a.tick).toBe(4134);
    expect(a.outcome).toBe('failed');
    expect(a.score).toBe(13000);
    expect(a.totalHits).toBe(19);
    expect(a.shotsFired).toBe(43);
    expect(a.waveIndex).toBe(14);
    expect(JSON.stringify(play())).toBe(JSON.stringify(a));
  });

  it('over is terminal', () => {
    const s = deepFreeze({ ...createInitialState(plan), phase: 'over' as const });
    expect(step(s, DRAW)).toBe(s);
  });
});
