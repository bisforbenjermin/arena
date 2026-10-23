import {
  MILLI as M, TURKEY_RADIUS as R, BOW_X, BOW_Y, WORLD_W, WORLD_H,
  ARROW_MIN_SPEED, ARROW_MAX_SPEED, ARROW_GRAVITY, DRAW_MAX_TICKS,
} from './constants';
import { isqrt } from './math';
import type { Arrow, Turkey } from './types';

export function fireArrow(drawTicks: number, aimX: number, aimY: number, id: number): Arrow {
  const dx = (aimX - BOW_X) * M;
  const dy = Math.min((aimY - BOW_Y) * M, -M);
  const len = isqrt(dx * dx + dy * dy);
  const speed = ARROW_MIN_SPEED * M + Math.trunc((ARROW_MAX_SPEED - ARROW_MIN_SPEED) * M * drawTicks / DRAW_MAX_TICKS);
  return {
    id,
    pos: { x: BOW_X * M, y: BOW_Y * M },
    vel: { x: Math.trunc(dx * speed / len), y: Math.trunc(dy * speed / len) },
  };
}

export function stepArrow(a: Arrow): Arrow {
  const vy = a.vel.y + ARROW_GRAVITY;
  return { ...a, vel: { x: a.vel.x, y: vy }, pos: { x: a.pos.x + a.vel.x, y: a.pos.y + vy } };
}

export function arrowOut(a: Arrow): boolean {
  return a.pos.x < 0 || a.pos.x > WORLD_W * M || a.pos.y > WORLD_H * M;
}

export function arrowHitsTurkey(a: Arrow, t: Turkey): boolean {
  const dx = a.pos.x - t.pos.x, dy = a.pos.y - t.pos.y;
  return dx * dx + dy * dy <= (R * M) * (R * M);
}
