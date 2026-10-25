import {
  MILLI as M, WORLD_W, SKY_TOP, SKY_BOTTOM, GROUND_Y, ROUND_SPEED, JINK_RATE, FLEE_SPEED, FALL_GRAVITY,
} from './constants';
import { SPECIES } from './species';
import { sin256, tri256 } from './trig';
import type { Target, TargetPlan } from './types';

const clamp = (v: number, lo: number, hi: number) => (v < lo ? lo : v > hi ? hi : v);

export function targetSpeed(tp: TargetPlan, round: number): number {
  return Math.trunc(ROUND_SPEED[round] * SPECIES[tp.species].speedPct / 100 * tp.speedPct / 100);
}

export function spawnTarget(tp: TargetPlan, round: number, id: number, slot: number): Target {
  const r = SPECIES[tp.species].radius;
  const y = tp.entryY * M;
  return {
    id, slot, species: tp.species, dir: tp.dir,
    x: tp.dir > 0 ? -r * M : (WORLD_W + r) * M, y, baseY: y, goalY: y,
    vx: tp.dir * targetSpeed(tp, round), vy: 0, age: 0, jinkIndex: 0,
    status: 'flying', hit: false,
  };
}

/** Path offset from the base height, in milli-units. Positive is down. */
export function pathOffset(t: Target, tp: TargetPlan): number {
  const amp = tp.amp * M;
  const idx = Math.trunc(t.age * 256 / tp.period) + tp.phase;
  switch (tp.path) {
    case 'glide':
    case 'wave': return Math.trunc(amp * sin256(idx) / 1000);
    case 'hop': return -Math.trunc(amp * Math.abs(sin256(Math.trunc(idx / 2))) / 1000);
    case 'zigzag': return Math.trunc(amp * tri256(idx) / 1000);
    case 'dive': {
      const r = SPECIES[t.species].radius;
      const span = (WORLD_W + 2 * r) * M;
      const travelled = t.dir > 0 ? t.x + r * M : (WORLD_W + r) * M - t.x;
      const half = clamp(Math.trunc(travelled * 128 / span), 0, 128);
      return Math.trunc(amp * 2 * sin256(half) / 1000);
    }
  }
}

export function fleeTarget(t: Target): Target {
  return { ...t, status: 'fleeing', vy: -FLEE_SPEED * M };
}

export function hitTarget(t: Target): Target {
  return { ...t, status: 'falling', hit: true, vx: Math.trunc(t.vx / 3), vy: -2 * M };
}

export function isHittable(t: Target): boolean {
  return t.status === 'flying' || t.status === 'fleeing';
}

/** One tick of motion. Returns the moved target; status 'gone' once it has left or landed. */
export function stepTarget(t: Target, tp: TargetPlan, round: number): Target {
  const r = SPECIES[t.species].radius * M;
  if (t.status === 'gone') return t;
  if (t.status === 'falling') {
    const vy = t.vy + FALL_GRAVITY;
    const y = t.y + vy;
    return { ...t, x: t.x + t.vx, y, vy, age: t.age + 1, status: y >= GROUND_Y * M + r ? 'gone' : 'falling' };
  }
  if (t.status === 'fleeing') {
    const y = t.y + t.vy;
    const x = t.x + t.vx;
    const out = y < -r || x < -r || x > WORLD_W * M + r;
    return { ...t, x, y, age: t.age + 1, status: out ? 'gone' : 'fleeing' };
  }

  const age = t.age + 1;
  let jinkIndex = t.jinkIndex, goalY = t.goalY;
  while (jinkIndex < tp.jinks.length && age >= tp.jinks[jinkIndex].at) {
    goalY = clamp(t.baseY + tp.jinks[jinkIndex].dy * M, SKY_TOP * M, SKY_BOTTOM * M);
    jinkIndex++;
  }
  let baseY = t.baseY;
  const rate = JINK_RATE[round];
  if (baseY < goalY) baseY = Math.min(goalY, baseY + rate);
  else if (baseY > goalY) baseY = Math.max(goalY, baseY - rate);

  const moved: Target = { ...t, age, jinkIndex, goalY, baseY, x: t.x + t.vx };
  const y = clamp(baseY + pathOffset(moved, tp), SKY_TOP * M, SKY_BOTTOM * M);
  const out = t.dir > 0 ? moved.x > WORLD_W * M + r : moved.x < -r;
  return { ...moved, vy: y - t.y, y, status: out ? 'gone' : 'flying' };
}
