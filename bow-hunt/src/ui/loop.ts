import { TICK_HZ } from '../engine/constants';

export const STEP_MS = 1000 / TICK_HZ;
export const MAX_STEPS = 5;

/** Fixed-timestep accumulator: how many sim ticks to run for this frame. */
export function ticksToRun(accMs: number, frameMs: number): { steps: number; accMs: number } {
  let acc = accMs + frameMs;
  const steps = Math.min(Math.floor(acc / STEP_MS), MAX_STEPS);
  if (steps === MAX_STEPS) acc = 0;
  else acc -= steps * STEP_MS;
  return { steps, accMs: acc };
}
