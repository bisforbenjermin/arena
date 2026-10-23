import { describe, expect, it } from 'vitest';
import { createRng, cyrb128 } from '../src/engine/rng';

describe('rng', () => {
  it('hashes the seed', () => {
    expect(cyrb128('gobble-2026')).toEqual([2128659087, 377130720, 3616792137, 3834409593]);
  });

  it('produces the known sfc32 sequence', () => {
    const r = createRng('gobble-2026');
    expect([r.next(), r.next(), r.next()]).toEqual([2045232104, 2402350770, 3577587183]);
  });
});
