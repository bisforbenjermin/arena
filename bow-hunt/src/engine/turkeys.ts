import {
  MILLI as M, TURKEY_RADIUS as R, HEADINGS, TURKEY_SPEED, GROUND_Y, WORLD_W,
  ESCAPE_AFTER_TICKS, ESCAPE_SPEED, FALL_SPEED, SEGMENTS_PER_TURKEY,
} from './constants';
import type { Turkey, TurkeyPlan, Vec } from './types';

export function headingVel(h: number, round: number): Vec {
  return { x: HEADINGS[h][0] * TURKEY_SPEED[round], y: HEADINGS[h][1] * TURKEY_SPEED[round] };
}

export function spawnTurkey(tp: TurkeyPlan, round: number, id: number): Turkey {
  const seg0 = tp.segments[0];
  return {
    id,
    pos: { x: tp.spawnX, y: GROUND_Y * M },
    vel: headingVel(seg0.heading, round),
    segIndex: 0,
    segTicksLeft: seg0.ticks,
    age: 0,
    status: 'flying',
  };
}

export function escapeTurkey(t: Turkey): Turkey {
  return { ...t, status: 'escaping', vel: { x: 0, y: -ESCAPE_SPEED * M } };
}

export function hitTurkey(t: Turkey): Turkey {
  return { ...t, status: 'falling', vel: { x: 0, y: FALL_SPEED * M } };
}

function moveEscaping(t: Turkey, age: number): Turkey {
  const y = t.pos.y - ESCAPE_SPEED * M;
  return { ...t, age, pos: { x: t.pos.x, y }, vel: { x: 0, y: -ESCAPE_SPEED * M }, status: y < -R * M ? 'gone' : 'escaping' };
}

export function stepTurkey(t: Turkey, tp: TurkeyPlan, round: number): Turkey {
  if (t.status === 'gone') return t;
  if (t.status === 'falling') {
    const y = t.pos.y + FALL_SPEED * M;
    return { ...t, pos: { x: t.pos.x, y }, vel: { x: 0, y: FALL_SPEED * M }, status: y >= (GROUND_Y + R) * M ? 'gone' : 'falling' };
  }
  if (t.status === 'escaping') return moveEscaping(t, t.age + 1);

  const age = t.age + 1;
  if (age >= ESCAPE_AFTER_TICKS) return moveEscaping(escapeTurkey(t), age);

  let segIndex = t.segIndex;
  let segTicksLeft = t.segTicksLeft - 1;
  const vel = { x: t.vel.x, y: t.vel.y };
  if (segTicksLeft <= 0) {
    segIndex = (segIndex + 1) % SEGMENTS_PER_TURKEY;
    const seg = tp.segments[segIndex];
    const v = headingVel(seg.heading, round);
    vel.x = v.x; vel.y = v.y;
    segTicksLeft = seg.ticks;
  }
  let x = t.pos.x + vel.x;
  let y = t.pos.y + vel.y;
  const minX = R * M, maxX = (WORLD_W - R) * M, minY = R * M, maxY = GROUND_Y * M;
  if (x < minX) { x = minX; vel.x = Math.abs(vel.x); }
  if (x > maxX) { x = maxX; vel.x = -Math.abs(vel.x); }
  if (y < minY) { y = minY; vel.y = Math.abs(vel.y); }
  if (y > maxY) { y = maxY; vel.y = -Math.abs(vel.y); }
  return { ...t, age, segIndex, segTicksLeft, vel, pos: { x, y } };
}
