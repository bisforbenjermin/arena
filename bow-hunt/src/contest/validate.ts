import { WORLD_H, WORLD_W } from '../engine/constants';
import type { ReplayLog } from '../engine/types';
import { MAX_REPLAY_TICKS } from './constants';

const isInt = (v: unknown): v is number => typeof v === 'number' && Number.isInteger(v);

/** Shape-checks untrusted replay JSON without expanding it. Runs on the server before any re-simulation. */
export function validateReplay(x: unknown): ReplayLog | null {
  if (typeof x !== 'object' || x === null) return null;
  const o = x as Record<string, unknown>;
  if (o.version !== 2) return null;
  if (o.mode !== 'daily' && o.mode !== 'practice') return null;
  if (typeof o.seed !== 'string' || o.seed.length < 1 || o.seed.length > 64) return null;
  if (!Array.isArray(o.inputs)) return null;
  let total = 0;
  for (const run of o.inputs) {
    if (!Array.isArray(run) || run.length !== 4) return null;
    const [count, aimX, aimY, drawing] = run;
    if (!isInt(count) || count < 1) return null;
    if (!isInt(aimX) || aimX < 0 || aimX > WORLD_W) return null;
    if (!isInt(aimY) || aimY < 0 || aimY > WORLD_H) return null;
    if (drawing !== 0 && drawing !== 1) return null;
    total += count;
    if (total > MAX_REPLAY_TICKS) return null;
  }
  return { version: 2, mode: o.mode, seed: o.seed, inputs: o.inputs as ReplayLog['inputs'] };
}
