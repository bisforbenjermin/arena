import { MILLI } from './constants';
import type { GameState, Input } from './types';

/** Naive reference bot: aims straight at the first flying turkey, never leads. */
export function botInput(s: GameState, t: number): Input {
  const f = s.turkeys.find((x) => x.status === 'flying');
  const aimX = f ? Math.trunc(f.pos.x / MILLI) : 480;
  const aimY = f ? Math.trunc(f.pos.y / MILLI) : 100;
  return { aimX, aimY, drawing: (t % 60) < 45 };
}
