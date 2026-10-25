import {
  MILLI as M, BOW_X, BOW_Y, WORLD_W, WORLD_H, ARROW_MIN_SPEED, ARROW_GRAVITY,
  AIM_MAX_SLOPE, ARROW_MARGIN, BOWS,
} from './constants';
import { isqrt } from './math';
import type { Arrow } from './types';

/** Launch speed for a draw of `drawTicks` with bow `bow` (index into BOWS), in milli-units per tick. */
export function launchSpeed(drawTicks: number, bow = 0): number {
  const b = BOWS[bow];
  const d = Math.min(drawTicks, b.drawMax);
  return ARROW_MIN_SPEED * M + Math.trunc((b.maxSpeed - ARROW_MIN_SPEED) * M * d / b.drawMax);
}

/** Unit-free aim direction from the bow toward (aimX, aimY), forced upward and no flatter than AIM_MAX_SLOPE. */
export function aimDirection(aimX: number, aimY: number): { dx: number; dy: number } {
  let dx = (aimX - BOW_X) * M;
  const dy = Math.min((aimY - BOW_Y) * M, -M);
  const maxDx = -dy * AIM_MAX_SLOPE;
  if (dx > maxDx) dx = maxDx;
  if (dx < -maxDx) dx = -maxDx;
  return { dx, dy };
}

export function fireArrow(drawTicks: number, aimX: number, aimY: number, id: number, bow = 0): Arrow {
  const { dx, dy } = aimDirection(aimX, aimY);
  const len = isqrt(dx * dx + dy * dy);
  const speed = launchSpeed(drawTicks, bow);
  return {
    id, x: BOW_X * M, y: BOW_Y * M,
    vx: Math.trunc(dx * speed / len), vy: Math.trunc(dy * speed / len),
    hits: 0, streakAt: 0,
  };
}

export function stepArrow(a: Arrow): Arrow {
  const vy = a.vy + ARROW_GRAVITY;
  return { ...a, vy, x: a.x + a.vx, y: a.y + vy };
}

export function arrowOut(a: Arrow): boolean {
  return a.x < -ARROW_MARGIN * M || a.x > (WORLD_W + ARROW_MARGIN) * M || a.y > (WORLD_H + ARROW_MARGIN) * M;
}

/**
 * True when the segment (x0,y0)→(x1,y1) passes within `radius` of (cx,cy). All milli-units.
 * Testing the swept segment, not just the tip, stops fast arrows from skipping through small birds.
 */
export function segmentHitsCircle(x0: number, y0: number, x1: number, y1: number, cx: number, cy: number, radius: number): boolean {
  // Box reject first. It also keeps every product below 2^53, so the integer math stays exact.
  if (cx < Math.min(x0, x1) - radius || cx > Math.max(x0, x1) + radius) return false;
  if (cy < Math.min(y0, y1) - radius || cy > Math.max(y0, y1) + radius) return false;
  const sx = x1 - x0, sy = y1 - y0;
  const px = cx - x0, py = cy - y0;
  const len2 = sx * sx + sy * sy;
  const dot = px * sx + py * sy;
  let qx = x0, qy = y0;
  if (len2 > 0 && dot > 0) {
    if (dot >= len2) { qx = x1; qy = y1; }
    else { qx = x0 + Math.trunc(sx * dot / len2); qy = y0 + Math.trunc(sy * dot / len2); }
  }
  const ex = cx - qx, ey = cy - qy;
  return ex * ex + ey * ey <= radius * radius;
}
