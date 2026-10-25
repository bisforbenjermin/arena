import {
  MILLI as M, BOW_X, BOW_Y, LONG_RANGE, MULTI_HIT_BONUS, COMBO_STEP_QUARTERS, COMBO_MAX_STEPS,
} from './constants';
import { SPECIES, type Species } from './species';

export function isLongShot(x: number, y: number): boolean {
  const dx = x - BOW_X * M, dy = y - BOW_Y * M;
  return dx * dx + dy * dy > (LONG_RANGE * M) * (LONG_RANGE * M);
}

/** Combo multiplier in quarters: 4 = ×1, 5 = ×1.25 … 12 = ×3. `streak` counts hitting arrows in a row, this one included. */
export function comboQuarters(streak: number): number {
  const steps = Math.min(Math.max(streak - 1, 0), COMBO_MAX_STEPS);
  return 4 + steps * COMBO_STEP_QUARTERS;
}

/**
 * Points for one target hit.
 * base, +50% if long, times the combo multiplier, plus a flat bonus for each target this arrow already hit.
 */
export function hitPoints(species: Species, long: boolean, streak: number, priorHitsOnArrow: number): number {
  const base = SPECIES[species].points;
  const withRange = base + (long ? Math.trunc(base / 2) : 0);
  return Math.trunc(withRange * comboQuarters(streak) / 4) + priorHitsOnArrow * MULTI_HIT_BONUS;
}
