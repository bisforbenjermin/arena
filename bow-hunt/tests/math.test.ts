import { describe, expect, it } from 'vitest';
import { isqrt } from '../src/engine/math';

describe('isqrt', () => {
  it('matches known floors', () => {
    expect([0, 1, 15, 16, 250000000000, 999999999999].map(isqrt)).toEqual([0, 1, 3, 4, 500000, 999999]);
  });
});
