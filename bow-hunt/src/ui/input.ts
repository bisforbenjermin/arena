import { BOW_X, BOW_Y, WORLD_H, WORLD_W } from '../engine/constants';

export type Point = { x: number; y: number };
export type RectLike = { left: number; top: number; width: number; height: number };

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

export function toWorld(clientX: number, clientY: number, rect: RectLike): Point {
  return {
    x: clamp(Math.round((clientX - rect.left) * WORLD_W / rect.width), 0, WORLD_W),
    y: clamp(Math.round((clientY - rect.top) * WORLD_H / rect.height), 0, WORLD_H),
  };
}

/** Slingshot aim: the arrow flies opposite the drag, like pulling a bowstring. */
export function dragAim(anchor: Point, current: Point): Point {
  const dx = anchor.x - current.x;
  const dy = anchor.y - current.y;
  const len = Math.hypot(dx, dy);
  if (len < 4) return { x: 480, y: 100 };
  return {
    x: clamp(Math.round(BOW_X + dx / len * 400), 0, WORLD_W),
    y: clamp(Math.round(BOW_Y + dy / len * 400), 0, WORLD_H),
  };
}
