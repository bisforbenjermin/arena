/**
 * PRNG composable — seeded from RoundConfig.seed.
 *
 * PR-1: games never import this directly. The runtime injects PrngFactory.
 * This file is a reference implementation for:
 *   (a) the runtime (which builds its own PrngFactory from sfc32), and
 *   (b) the G1 prompt (injected as an exemplar so the agent never reinvents it).
 *
 * Games call:  const rand = prngFactory();  then  rand()  for [0,1) floats.
 */

/** SFC32 — fast, 128-bit state, passes PractRand. Output: uint32. */
export function sfc32(a: number, b: number, c: number, d: number): () => number {
  return function (): number {
    a |= 0; b |= 0; c |= 0; d |= 0;
    const t = (a + b | 0) + d | 0;
    d = d + 1 | 0;
    a = b ^ b >>> 9;
    b = c + (c << 3) | 0;
    c = (c << 21 | c >>> 11);
    c = c + t | 0;
    return (t >>> 0) / 4294967296;
  };
}

/**
 * Build a seeded PrngFactory from a uint32 seed.
 * The runtime calls this with RoundConfig.seed; the result is passed to sim.init().
 */
export function makePrngFactory(seed: number): () => () => number {
  return (): (() => number) => sfc32(seed ^ 0xdeadbeef, seed ^ 0xcafebabe, seed, seed >>> 16);
}
