import {
  MILLI as M, ROUNDS, TARGETS_PER_ROUND, ARROWS_PER_ROUND, MAX_ON_SCREEN, ROUND_QUOTA, INTRO_TICKS,
  FIRST_SPAWN_TICKS, DRAW_MIN_TICKS, PERFECT_ROUND_BONUS, ARROW_LEFT_BONUS, BOW_TIERS, TIER_BY_ROUND,
  STARS_FOR_BONUS, STAR_BONUS,
} from './constants';
import { SPECIES } from './species';
import { fireArrow, stepArrow, arrowOut, segmentHitsCircle } from './arrows';
import { spawnTarget, stepTarget, fleeTarget, hitTarget, isHittable } from './targets';
import { hitPoints, isLongShot } from './scoring';
import type { Arrow, GameEvent, GameState, Input, RoundSummary, RunPlan, Target } from './types';

/** Which bow the player has in a round: upgrades come from clearing rounds, so everyone on a seed gets the same ones. */
export function tierFor(round: number): number {
  return TIER_BY_ROUND[round];
}

export function createInitialState(plan: RunPlan): GameState {
  return {
    tick: 0, phase: 'intro', phaseTicks: 0, round: 0, outcome: 'none',
    targets: [], arrows: [], nextId: 0, spawned: 0, spawnTimer: FIRST_SPAWN_TICKS, outOfArrows: false,
    arrowsLeft: ARROWS_PER_ROUND, drawTicks: 0, wasDrawing: false,
    score: 0, roundHits: 0, roundPoints: 0, streak: 0,
    stats: { shots: 0, hits: 0, longShots: 0, multiHits: 0, goldenHits: 0, bestStreak: 0, stars: 0 },
    summaries: [], events: [], plan,
  };
}

/** Starts the next round after a 'roundEnd'. The view calls it when the player taps Next Round. */
export function nextRound(s: GameState): GameState {
  if (s.phase !== 'roundEnd') return s;
  return {
    ...s, round: s.round + 1, phase: 'intro', phaseTicks: 0,
    targets: [], arrows: [], spawned: 0, spawnTimer: FIRST_SPAWN_TICKS, outOfArrows: false,
    arrowsLeft: ARROWS_PER_ROUND, drawTicks: 0, wasDrawing: false, roundHits: 0, roundPoints: 0, events: [],
  };
}

/** Advances the game by exactly one fixed tick. Pure: same state and input, same result. */
export function step(s: GameState, input: Input): GameState {
  if (s.phase === 'over' || s.phase === 'roundEnd') return s;
  const tick = s.tick + 1;
  const events: GameEvent[] = [];

  if (s.phase === 'intro') {
    const phaseTicks = s.phaseTicks + 1;
    if (phaseTicks >= INTRO_TICKS) {
      events.push({ type: 'roundStart', round: s.round });
      return { ...s, tick, phase: 'playing', phaseTicks: 0, drawTicks: 0, wasDrawing: input.drawing, events };
    }
    return { ...s, tick, phaseTicks, wasDrawing: input.drawing, events };
  }

  const round = s.round;
  const roundPlan = s.plan.rounds[round];
  const tier = tierFor(round);
  const total = roundPlan.targets.length;
  let { nextId, arrowsLeft, drawTicks, streak, score, roundHits, roundPoints, spawned, spawnTimer, outOfArrows } = s;
  const stats = { ...s.stats };

  // a. Bow: hold to draw, release to fire.
  let arrows: Arrow[] = s.arrows;
  if (input.drawing) {
    drawTicks = Math.min(drawTicks + 1, BOW_TIERS[tier].drawMax);
  } else if (s.wasDrawing) {
    if (drawTicks >= DRAW_MIN_TICKS && arrowsLeft > 0) {
      const a = fireArrow(drawTicks, input.aimX, input.aimY, nextId++, tier);
      arrows = [...arrows, a];
      arrowsLeft -= 1;
      stats.shots += 1;
      events.push({ type: 'fire', arrowId: a.id, power: drawTicks });
    }
    drawTicks = 0;
  }

  // b. Targets move.
  const targets: Target[] = s.targets.map((t) => {
    const n = stepTarget(t, roundPlan.targets[t.slot], round);
    if (n.status === 'gone') {
      if (t.status === 'falling') events.push({ type: 'landed', targetId: t.id, x: n.x });
      else events.push({ type: 'escape', targetId: t.id });
    }
    return n;
  });

  // c. Spawn the next target once its gap has passed and a slot is free.
  if (!outOfArrows && spawned < total) {
    spawnTimer -= 1;
    const flying = targets.reduce((n, t) => n + (t.status === 'flying' && t.species !== 'star' ? 1 : 0), 0);
    if (spawnTimer <= 0 && flying < MAX_ON_SCREEN) {
      const t = spawnTarget(roundPlan.targets[spawned], round, nextId++, spawned);
      targets.push(t);
      events.push({ type: 'spawn', targetId: t.id, species: t.species });
      spawned += 1;
      spawnTimer = spawned < total ? roundPlan.targets[spawned].gap : 0;
    }
  }

  // d. Arrows fly. Each arrow pierces, so it can take several targets.
  const kept: Arrow[] = [];
  for (const a0 of arrows) {
    let a = stepArrow(a0);
    for (let i = 0; i < targets.length; i++) {
      const t = targets[i];
      if (!isHittable(t)) continue;
      if (!segmentHitsCircle(a0.x, a0.y, a.x, a.y, t.x, t.y, SPECIES[t.species].radius * M)) continue;
      if (a.hits === 0) {
        streak += 1;
        a = { ...a, streakAt: streak };
        if (streak > stats.bestStreak) stats.bestStreak = streak;
      }
      const long = isLongShot(t.x, t.y);
      const points = hitPoints(t.species, long, a.streakAt, a.hits);
      if (a.hits >= 1) stats.multiHits += 1;
      a = { ...a, hits: a.hits + 1 };
      targets[i] = hitTarget(t);
      score += points; roundPoints += points;
      if (t.species !== 'star') { roundHits += 1; stats.hits += 1; }
      if (long) stats.longShots += 1;
      if (t.species === 'golden') stats.goldenHits += 1;
      events.push({ type: 'hit', targetId: t.id, arrowId: a.id, species: t.species, x: t.x, y: t.y, points, long, multi: a.hits, streak: a.streakAt });
      if (t.species === 'star') {
        stats.stars += 1;
        if (stats.stars === STARS_FOR_BONUS) {
          score += STAR_BONUS; roundPoints += STAR_BONUS;
          events.push({ type: 'starBonus', points: STAR_BONUS });
        }
      }
    }
    if (arrowOut(a)) {
      if (a.hits === 0) { streak = 0; events.push({ type: 'miss', arrowId: a.id }); }
    } else {
      kept.push(a);
    }
  }
  arrows = kept;

  // e. Quiver empty and nothing in the air: the rest of the flock flees and no more come.
  let live = targets;
  if (arrowsLeft === 0 && arrows.length === 0 && !outOfArrows) {
    outOfArrows = true;
    events.push({ type: 'outOfArrows' });
    live = live.map((t) => (t.status === 'flying' ? fleeTarget(t) : t));
  }
  live = live.filter((t) => t.status !== 'gone');

  const next: GameState = {
    ...s, tick, targets: live, arrows, nextId, spawned, spawnTimer, outOfArrows,
    arrowsLeft, drawTicks, wasDrawing: input.drawing, score, roundHits, roundPoints, streak, stats, events,
  };

  // f. Round over: nothing left to come and nothing left in the sky.
  const pending = !outOfArrows && spawned < total;
  if (pending || live.length > 0) return next;

  for (const a of arrows) {
    if (a.hits === 0) { next.streak = 0; events.push({ type: 'miss', arrowId: a.id }); }
  }
  const quota = ROUND_QUOTA[round];
  const passed = roundHits >= quota;
  const arrowBonus = passed ? arrowsLeft * ARROW_LEFT_BONUS : 0;
  const perfectBonus = roundHits === TARGETS_PER_ROUND ? PERFECT_ROUND_BONUS : 0;
  const summary: RoundSummary = { round, hits: roundHits, quota, arrowsLeft, hitPoints: roundPoints, arrowBonus, perfectBonus, passed };
  events.push({ type: 'roundEnd', summary });
  const base = { ...next, arrows: [], drawTicks: 0, score: score + arrowBonus + perfectBonus, summaries: [...s.summaries, summary] };
  if (!passed) return { ...base, phase: 'over', outcome: 'failed' };
  if (round === ROUNDS - 1) return { ...base, phase: 'over', outcome: 'cleared' };
  return { ...base, phase: 'roundEnd' };
}
