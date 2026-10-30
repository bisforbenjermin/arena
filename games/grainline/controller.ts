/**
 * GRAINLINE — bot players for skill evidence (forge canon rule 2).
 *
 * Every bot drives the sim through registerSwipe, the same input a player
 * produces, and sees only what the screen shows: the active grain. Each bot has
 * its own seeded PRNG, separate from the round's, so it can't see ahead.
 *
 * expert  reads the grain, ±8° hand error, reacts 12–18 ticks after a glyph appears
 *         (12 ticks = 200 ms, the canon floor for unpredictable events)
 * greedy  reads the grain but sloppily: ±32° error, 15% misreads, 22–55 ticks
 * random  ignores the glyph: any angle, any time in 6–60 ticks
 */

import type { PrngFactory, RoundConfig } from '../../contracts/game-module';
import { GrainlineSim } from './index';

export type BotProfile = 'random' | 'greedy' | 'expert';

export const BOT_TUNING = {
  random: { reactMin: 6,  reactMax: 60, noiseDeg: 0,  misread: 0 },
  greedy: { reactMin: 22, reactMax: 55, noiseDeg: 32, misread: 0.15 },
  expert: { reactMin: 12, reactMax: 18, noiseDeg: 8,  misread: 0 },
} as const;

const GRAIN_BASE = [0, 90, 45, 135];

/** Mulberry32: the bots' own seeded PRNG. */
export function botRng(seed: number): () => number {
  let s = seed >>> 0;
  return (): number => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) >>> 0;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Play one full round. The caller destroys the returned sim. */
export function playRound(profile: BotProfile, config: RoundConfig, prngFactory: PrngFactory, botSeed: number): GrainlineSim {
  const sim = new GrainlineSim();
  sim.init(config, prngFactory);
  const r = botRng(botSeed);
  const tune = BOT_TUNING[profile];
  let planned = -1;
  let angle = 0;
  let tracking = false;

  while (!sim.isDone()) {
    const grain = sim.getActiveGrain();
    const now = sim.getCurrentTick();
    if (grain === null) tracking = false;
    else if (!tracking) {
      tracking = true;
      planned = now + tune.reactMin + Math.floor(r() * (tune.reactMax - tune.reactMin + 1));
      if (profile === 'random') angle = Math.floor(r() * 360);
      else {
        const read = r() < tune.misread ? Math.floor(r() * 4) : grain;
        angle = GRAIN_BASE[read] + (r() < 0.5 ? 0 : 180) + (r() * 2 - 1) * tune.noiseDeg;
      }
    }
    if (grain !== null && now >= planned) { sim.registerSwipe(angle); tracking = false; }
    sim.tick(1 / 60);
  }
  return sim;
}
