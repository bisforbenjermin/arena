// Drag-back aiming. Pure functions so they can be tested without a browser.
import { BOW_X, BOW_Y, WORLD_W, WORLD_H, AIM_MAX_SLOPE } from '../engine/constants';

/** Drags shorter than this (world units) keep the previous aim, so a tap-and-hold doesn't snap the bow. */
export const DEAD_ZONE = 10;
export const MAX_ANGLE = Math.atan(AIM_MAX_SLOPE);   // from straight up, either side

export type Aim = { aimX: number; aimY: number; angle: number };   // angle: radians from straight up, + is right

export const STRAIGHT_UP: Aim = { aimX: BOW_X, aimY: 0, angle: 0 };

/** Aim point for an angle: the farthest point along the ray that stays inside the world, so integer rounding barely bends it. */
export function aimForAngle(angle: number): Aim {
  const a = Math.max(-MAX_ANGLE, Math.min(MAX_ANGLE, angle));
  const ux = Math.sin(a), uy = -Math.cos(a);
  let t = BOW_Y / -uy;
  if (ux > 1e-9) t = Math.min(t, (WORLD_W - BOW_X) / ux);
  if (ux < -1e-9) t = Math.min(t, BOW_X / -ux);
  t -= 1;
  return {
    aimX: Math.max(0, Math.min(WORLD_W, Math.round(BOW_X + ux * t))),
    aimY: Math.max(0, Math.min(WORLD_H, Math.round(BOW_Y + uy * t))),
    angle: a,
  };
}

/** Slingshot aim: the arrow flies opposite the drag, like pulling a bowstring. Points are in world units. */
export function aimFromDrag(anchorX: number, anchorY: number, x: number, y: number, previous: Aim): Aim {
  const dx = anchorX - x, dy = anchorY - y;
  if (Math.hypot(dx, dy) < DEAD_ZONE) return previous;
  if (dy > 0 && Math.abs(dx) < dy * 0.2) return aimForAngle(previous.angle);   // pulled upward: no sensible shot, hold aim
  return aimForAngle(Math.atan2(dx, -dy));
}
