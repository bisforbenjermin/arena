import { describe, expect, it } from 'vitest';
import { arrowHitsTurkey, arrowOut, fireArrow, stepArrow } from '../src/engine/arrows';
import type { Arrow, Turkey } from '../src/engine/types';
import { deepFreeze } from './helpers';

const turkeyAt = (x: number, y: number): Turkey => deepFreeze({
  id: 0, pos: { x, y }, vel: { x: 0, y: 0 }, segIndex: 0, segTicksLeft: 10, age: 0, status: 'flying',
});

describe('arrows', () => {
  it('fires with draw-scaled speed toward the aim point', () => {
    expect(fireArrow(45, 480, 0, 0).vel).toEqual({ x: 0, y: -28000 });
    expect(fireArrow(45, 780, 100, 1).vel).toEqual({ x: 16800, y: -22400 });
    expect(fireArrow(6, 480, 900, 2).vel).toEqual({ x: 0, y: -14133 });
    expect(fireArrow(45, 480, 0, 0).pos).toEqual({ x: 480000, y: 500000 });
  });

  it('applies gravity then moves', () => {
    const a: Arrow = deepFreeze({ id: 0, pos: { x: 480000, y: 500000 }, vel: { x: 0, y: -28000 } });
    const b = stepArrow(a);
    expect(b.pos).toEqual({ x: 480000, y: 472300 });
    expect(b.vel).toEqual({ x: 0, y: -27700 });
  });

  it('detects leaving the world', () => {
    expect(arrowOut({ id: 0, pos: { x: -1, y: 0 }, vel: { x: 0, y: 0 } })).toBe(true);
    expect(arrowOut({ id: 0, pos: { x: 100, y: 540001 }, vel: { x: 0, y: 0 } })).toBe(true);
    expect(arrowOut({ id: 0, pos: { x: 100, y: -50000 }, vel: { x: 0, y: 0 } })).toBe(false);
  });

  it('hits within the turkey radius inclusive', () => {
    const a: Arrow = deepFreeze({ id: 0, pos: { x: 100000, y: 100000 }, vel: { x: 0, y: 0 } });
    expect(arrowHitsTurkey(a, turkeyAt(128000, 100000))).toBe(true);
    expect(arrowHitsTurkey(a, turkeyAt(128001, 100000))).toBe(false);
  });
});
