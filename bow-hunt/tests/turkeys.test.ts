import { describe, expect, it } from 'vitest';
import { escapeTurkey, hitTurkey, spawnTurkey, stepTurkey } from '../src/engine/turkeys';
import type { Turkey, TurkeyPlan } from '../src/engine/types';
import { deepFreeze } from './helpers';

const TP: TurkeyPlan = deepFreeze({
  spawnX: 566000,
  segments: [{ heading: 2, ticks: 53 }, { heading: 3, ticks: 69 }, ...Array.from({ length: 10 }, () => ({ heading: 0, ticks: 40 }))],
});

const B: Turkey = deepFreeze({
  id: 0, pos: { x: 500000, y: 300000 }, vel: { x: 0, y: 0 }, segIndex: 0, segTicksLeft: 1, age: 10, status: 'flying',
});

describe('turkeys', () => {
  it('spawns on the ground with segment 0', () => {
    const t = deepFreeze(spawnTurkey(TP, 0, 0));
    expect(t.pos).toEqual({ x: 566000, y: 430000 });
    expect(t.vel).toEqual({ x: 0, y: -3000 });
    expect(t.segTicksLeft).toBe(53);
    const s = stepTurkey(t, TP, 0);
    expect(s.pos.y).toBe(427000);
    expect(s.segTicksLeft).toBe(52);
    expect(s.age).toBe(1);
  });

  it('switches segment when ticks run out', () => {
    const s = stepTurkey(B, TP, 0);
    expect(s.segIndex).toBe(1);
    expect(s.segTicksLeft).toBe(69);
    expect(s.vel).toEqual({ x: -2121, y: -2121 });
    expect(s.pos).toEqual({ x: 497879, y: 297879 });
  });

  it('bounces off the right wall', () => {
    const s = stepTurkey(deepFreeze({ ...B, pos: { x: 930000, y: 300000 }, vel: { x: 3000, y: 0 }, segTicksLeft: 10 }), TP, 0);
    expect(s.pos.x).toBe(932000);
    expect(s.vel.x).toBe(-3000);
  });

  it('escapes at the age limit and moves the same tick', () => {
    const s = stepTurkey(deepFreeze({ ...B, age: 419, segTicksLeft: 10 }), TP, 0);
    expect(s.age).toBe(420);
    expect(s.status).toBe('escaping');
    expect(s.pos.y).toBe(292000);
  });

  it('falling and escaping turkeys disappear past the edges', () => {
    const f = stepTurkey(deepFreeze({ ...B, status: 'falling', pos: { x: 500000, y: 455000 } }), TP, 0);
    expect(f.pos.y).toBe(461000);
    expect(f.status).toBe('gone');
    const e = stepTurkey(deepFreeze({ ...B, status: 'escaping', pos: { x: 500000, y: -25000 } }), TP, 0);
    expect(e.pos.y).toBe(-33000);
    expect(e.status).toBe('gone');
  });

  it('gone turkeys are returned unchanged', () => {
    const g = deepFreeze({ ...B, status: 'gone' as const });
    expect(stepTurkey(g, TP, 0)).toBe(g);
  });

  it('state changes never mutate their input', () => {
    expect(escapeTurkey(B).status).toBe('escaping');
    expect(hitTurkey(B).status).toBe('falling');
    expect(B.status).toBe('flying');
  });
});
