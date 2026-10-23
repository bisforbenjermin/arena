import { createRng } from './rng';
import {
  MILLI, ROUNDS, WAVES_PER_ROUND, TURKEYS_PER_WAVE, SEGMENTS_PER_TURKEY,
  SPAWN_X_MIN, SPAWN_X_MAX, SEG_TICKS_MIN, SEG_TICKS_MAX,
} from './constants';
import type { RunPlan, Segment, TurkeyPlan, WavePlan } from './types';

/** Draws every random value for the run up front, in a fixed order. */
export function generateRunPlan(seed: string): RunPlan {
  const rng = createRng(seed);
  const waves: WavePlan[] = [];
  for (let w = 0; w < ROUNDS * WAVES_PER_ROUND; w++) {
    const turkeys: TurkeyPlan[] = [];
    for (let t = 0; t < TURKEYS_PER_WAVE; t++) {
      const spawnX = rng.int(SPAWN_X_MIN, SPAWN_X_MAX) * MILLI;
      const segments: Segment[] = [];
      for (let k = 0; k < SEGMENTS_PER_TURKEY; k++) {
        const heading = rng.int(0, 7);
        const ticks = rng.int(SEG_TICKS_MIN, SEG_TICKS_MAX);
        segments.push({ heading, ticks });
      }
      turkeys.push({ spawnX, segments });
    }
    waves.push({ round: Math.trunc(w / WAVES_PER_ROUND), turkeys });
  }
  return { seed, waves };
}
