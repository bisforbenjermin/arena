import { DRAW_MIN_TICKS } from './constants';
import { fireArrow, stepArrow, arrowOut } from './arrows';

export type PathPoint = { x: number; y: number };   // milli-units

/**
 * The exact arc an arrow would fly if released now, sampled every `every` ticks.
 * Uses the same functions as the sim, so the guide never lies. Display only: practice mode draws it, the sim never reads it.
 */
export function previewPath(drawTicks: number, aimX: number, aimY: number, maxTicks = 75, every = 3): PathPoint[] {
  let a = fireArrow(Math.max(drawTicks, DRAW_MIN_TICKS), aimX, aimY, -1);
  const out: PathPoint[] = [];
  for (let t = 1; t <= maxTicks; t++) {
    a = stepArrow(a);
    if (arrowOut(a)) break;
    if (t % every === 0) out.push({ x: a.x, y: a.y });
  }
  return out;
}
