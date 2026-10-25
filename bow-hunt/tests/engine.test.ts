import { describe, expect, it } from 'vitest';
import * as C from '../src/engine/constants';
import { generateRunPlan } from '../src/engine/plan';
import { SPECIES } from '../src/engine/species';
import { spawnTarget, stepTarget } from '../src/engine/targets';
import { aimDirection, fireArrow, launchSpeed, segmentHitsCircle, stepArrow } from '../src/engine/arrows';
import { comboQuarters, hitPoints, isLongShot } from '../src/engine/scoring';
import { createInitialState, nextRound, step } from '../src/engine/sim';
import { previewPath } from '../src/engine/preview';
import type { GameEvent, GameState, Input, RunPlan, TargetPlan } from '../src/engine/types';

const M = C.MILLI;
const idle: Input = { aimX: 270, aimY: 400, drawing: false };

function run(s: GameState, inputs: Input[]): { s: GameState; events: GameEvent[] } {
  const events: GameEvent[] = [];
  for (const i of inputs) { s = step(s, i); events.push(...s.events); }
  return { s, events };
}
const repeat = (i: Input, n: number) => Array.from({ length: n }, () => i);
const toPlaying = (s: GameState) => run(s, repeat(idle, C.INTRO_TICKS)).s;
const shot = (aimX: number, aimY: number, draw = C.DRAW_MAX_TICKS): Input[] =>
  [...repeat({ aimX, aimY, drawing: true }, draw), { aimX, aimY, drawing: false }];

describe('plan', () => {
  it('is fixed by the seed', () => {
    expect(generateRunPlan('a')).toEqual(generateRunPlan('a'));
    expect(generateRunPlan('a')).not.toEqual(generateRunPlan('b'));
  });

  it('has 5 rounds of 10 targets inside the sky band, with at most one golden turkey per round', () => {
    for (let i = 0; i < 50; i++) {
      const p = generateRunPlan(`shape-${i}`);
      expect(p.rounds).toHaveLength(C.ROUNDS);
      for (const r of p.rounds) {
        expect(r.targets).toHaveLength(C.TARGETS_PER_ROUND + 1);
        expect(r.targets.filter((t) => t.species === 'star')).toHaveLength(1);
        const golds = r.targets.filter((t) => t.species === 'golden').length;
        expect(golds).toBe(r.golden ? 1 : 0);
        for (const t of r.targets) {
          expect(t.entryY).toBeGreaterThanOrEqual(C.SKY_TOP);
          expect(t.entryY).toBeLessThanOrEqual(C.SKY_BOTTOM);
        }
      }
    }
  });

  it('rolls a golden turkey in about 1 round in 6', () => {
    let golden = 0, rounds = 0;
    for (let i = 0; i < 400; i++) for (const r of generateRunPlan(`gold-${i}`).rounds) { rounds++; if (r.golden) golden++; }
    expect(golden / rounds).toBeGreaterThan(0.12);
    expect(golden / rounds).toBeLessThan(0.22);
  });

  it('gets harder: later rounds are faster, more erratic and spawn sooner', () => {
    for (let r = 1; r < C.ROUNDS; r++) {
      expect(C.ROUND_SPEED[r]).toBeGreaterThan(C.ROUND_SPEED[r - 1]);
      expect(C.JINKS[r]).toBeGreaterThan(C.JINKS[r - 1]);
      expect(C.SPAWN_GAP[r][1]).toBeLessThan(C.SPAWN_GAP[r - 1][1]);
    }
  });
});

describe('targets', () => {
  const tp: TargetPlan = { species: 'duck', dir: 1, entryY: 300, path: 'zigzag', amp: 80, period: 90, phase: 0, speedPct: 100, gap: 60, jinks: [{ at: 40, dy: 120 }] };

  it('cross the sky inside the band and leave the far side', () => {
    let t = spawnTarget(tp, 2, 0, 0);
    expect(t.x).toBeLessThan(0);
    let ticks = 0;
    while (t.status === 'flying' && ticks < 2000) {
      t = stepTarget(t, tp, 2);
      ticks++;
      expect(t.y).toBeGreaterThanOrEqual(C.SKY_TOP * M);
      expect(t.y).toBeLessThanOrEqual(C.SKY_BOTTOM * M);
    }
    expect(t.status).toBe('gone');
    expect(t.x).toBeGreaterThan(C.WORLD_W * M);
  });

  it('come from the right when dir is -1', () => {
    const t = stepTarget(spawnTarget({ ...tp, dir: -1 }, 0, 0, 0), { ...tp, dir: -1 }, 0);
    expect(t.vx).toBeLessThan(0);
    expect(t.x).toBeLessThan((C.WORLD_W + SPECIES.duck.radius) * M);
  });
});

describe('arrows', () => {
  it('each bow upgrade draws faster and shoots harder', () => {
    for (let t = 1; t < C.BOW_TIERS.length; t++) {
      expect(C.BOW_TIERS[t].drawMax).toBeLessThan(C.BOW_TIERS[t - 1].drawMax);
      expect(launchSpeed(C.BOW_TIERS[t].drawMax, t)).toBeGreaterThan(launchSpeed(C.BOW_TIERS[t - 1].drawMax, t - 1));
    }
    expect(C.TIER_BY_ROUND).toHaveLength(C.ROUNDS);
  });

  it('launch speed scales with draw time and caps at full draw', () => {
    expect(launchSpeed(0)).toBe(C.ARROW_MIN_SPEED * M);
    expect(launchSpeed(C.DRAW_MAX_TICKS)).toBe(C.ARROW_MAX_SPEED * M);
    expect(launchSpeed(C.DRAW_MAX_TICKS * 3)).toBe(C.ARROW_MAX_SPEED * M);
    expect(launchSpeed(20)).toBeGreaterThan(launchSpeed(10));
  });

  it('always fire upward, never flatter than the slope limit', () => {
    expect(aimDirection(270, 960).dy).toBeLessThan(0);
    const d = aimDirection(0, 859);
    expect(Math.abs(d.dx)).toBeLessThanOrEqual(-d.dy * C.AIM_MAX_SLOPE);
  });

  it('arc under gravity', () => {
    let a = fireArrow(C.DRAW_MAX_TICKS, 270, 0, 0);
    const vy0 = a.vy;
    a = stepArrow(a);
    expect(a.vy).toBe(vy0 + C.ARROW_GRAVITY);
  });

  it('catch a small bird the tip would skip over', () => {
    // Tip moves 30 units in one tick; a 22-unit duck sits in the middle of that step.
    const cx = 15 * M, cy = 5 * M, r = 8 * M;
    const tipHits = (x: number, y: number) => (x - cx) ** 2 + (y - cy) ** 2 <= r * r;
    expect(tipHits(0, 0) || tipHits(30 * M, 0)).toBe(false);
    expect(segmentHitsCircle(0, 0, 30 * M, 0, cx, cy, r)).toBe(true);
    expect(segmentHitsCircle(0, 0, 30 * M, 0, cx, 20 * M, r)).toBe(false);
  });
});

describe('scoring', () => {
  it('combo adds 25% per streak step, up to ×3', () => {
    expect([1, 2, 3, 9, 50].map(comboQuarters)).toEqual([4, 5, 6, 12, 12]);
  });

  it('long shots pay +50%, extra targets on one arrow pay +200 each', () => {
    expect(hitPoints('duck', false, 1, 0)).toBe(150);
    expect(hitPoints('duck', true, 1, 0)).toBe(225);
    expect(hitPoints('duck', true, 3, 0)).toBe(337);
    expect(hitPoints('goose', false, 1, 1)).toBe(275);
    expect(hitPoints('golden', false, 1, 0)).toBe(1000);
  });

  it('long range is 600 units from the bow', () => {
    expect(isLongShot(C.BOW_X * M, (C.BOW_Y - 600) * M)).toBe(false);
    expect(isLongShot(C.BOW_X * M, (C.BOW_Y - 601) * M)).toBe(true);
  });
});

describe('sim', () => {
  const plan = generateRunPlan(C.DEFAULT_SEED);

  it('waits through the round intro before anything happens', () => {
    const s = run(createInitialState(plan), repeat(idle, C.INTRO_TICKS - 1)).s;
    expect(s.phase).toBe('intro');
    expect(step(s, idle).phase).toBe('playing');
  });

  it('needs a minimum draw to fire', () => {
    const s0 = toPlaying(createInitialState(plan));
    expect(run(s0, shot(270, 100, C.DRAW_MIN_TICKS - 1)).s.stats.shots).toBe(0);
    expect(run(s0, shot(270, 100, C.DRAW_MIN_TICKS)).s.stats.shots).toBe(1);
  });

  it('gives 15 arrows a round; an empty quiver sends the flock away and ends the round', () => {
    let s = toPlaying(createInitialState(plan));
    const events: GameEvent[] = [];
    for (let k = 0; k < 20 && s.phase === 'playing'; k++) {
      const r = run(s, shot(0, 860, C.DRAW_MIN_TICKS));   // flat to the left: always a miss
      s = r.s; events.push(...r.events);
    }
    expect(s.stats.shots).toBe(C.ARROWS_PER_ROUND);
    expect(events.some((e) => e.type === 'outOfArrows')).toBe(true);
    s = run(s, repeat(idle, 600)).s;
    expect(s.phase).toBe('over');
    expect(s.outcome).toBe('failed');
    expect(s.summaries[0]).toMatchObject({ hits: 0, passed: false, arrowBonus: 0 });
  });

  it('ends a round with no shots once every target has crossed', () => {
    const s = run(createInitialState(plan), repeat(idle, 8000)).s;
    expect(s.phase).toBe('over');
    expect(s.summaries).toHaveLength(1);
    expect(s.stats.shots).toBe(0);
  });

  it('nextRound refills the quiver and moves on', () => {
    const s: GameState = { ...createInitialState(plan), phase: 'roundEnd', arrowsLeft: 3, round: 1, roundHits: 7 };
    const n = nextRound(s);
    expect(n).toMatchObject({ phase: 'intro', round: 2, arrowsLeft: C.ARROWS_PER_ROUND, roundHits: 0, spawned: 0 });
    expect(step(s, idle)).toBe(s);
  });

  it('one arrow pierces two birds in line and pays the multi-hit bonus', () => {
    const still: TargetPlan = { species: 'goose', dir: 1, entryY: 0, path: 'glide', amp: 0, period: 100, phase: 0, speedPct: 100, gap: 1, jinks: [] };
    const custom: RunPlan = { seed: 'x', rounds: plan.rounds.map(() => ({ golden: false, targets: Array(10).fill(still) })) };
    const place = (id: number, y: number) => ({ ...spawnTarget(still, 0, id, 0), x: 270 * M, y: y * M, baseY: y * M, goalY: y * M, vx: 0 });
    let s: GameState = { ...toPlaying(createInitialState(custom)), spawned: 10, nextId: 2, targets: [place(0, 700), place(1, 500)] };
    const r = run(s, [...shot(270, 0), ...repeat(idle, 150)]);
    const hits = r.events.filter((e) => e.type === 'hit');
    expect(hits.map((h) => h.type === 'hit' && h.points)).toEqual([75, 275]);
    expect(r.s.stats).toMatchObject({ shots: 1, hits: 2, multiHits: 1, bestStreak: 1 });
    s = r.s;
    expect(s.summaries[0]).toMatchObject({ hits: 2, passed: false });
  });
});

describe('preview', () => {
  it('matches the arrow the sim actually fires, tick for tick', () => {
    for (const [draw, ax, ay] of [[40, 270, 0], [12, 100, 300], [25, 500, 600]] as const) {
      const pts = previewPath(draw, ax, ay, 60, 1);
      let a = fireArrow(draw, ax, ay, 0);
      for (const p of pts) { a = stepArrow(a); expect([a.x, a.y]).toEqual([p.x, p.y]); }
      expect(pts.length).toBeGreaterThan(10);
    }
  });
});
