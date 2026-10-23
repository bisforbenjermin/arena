import { describe, expect, it } from 'vitest';
import * as C from '../src/engine/constants';

describe('shared contracts', () => {
  it('has 8 headings', () => {
    expect(C.HEADINGS.length).toBe(8);
  });

  it('has one entry per round in per-round tables', () => {
    expect(C.TURKEY_SPEED.length).toBe(C.ROUNDS);
    expect(C.ROUND_QUOTA.length).toBe(C.ROUNDS);
    expect(C.HIT_POINTS.length).toBe(C.ROUNDS);
  });

  it('every numeric export is an integer', () => {
    const nums: number[] = [];
    const collect = (v: unknown): void => {
      if (typeof v === 'number') nums.push(v);
      else if (Array.isArray(v)) v.forEach(collect);
    };
    Object.values(C).forEach(collect);
    expect(nums.length).toBeGreaterThan(30);
    for (const n of nums) expect(Number.isInteger(n)).toBe(true);
  });
});
