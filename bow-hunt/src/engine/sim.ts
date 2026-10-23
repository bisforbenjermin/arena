import {
  WAVE_GAP_TICKS, TURKEYS_PER_WAVE, ARROWS_PER_WAVE, DRAW_MIN_TICKS, DRAW_MAX_TICKS,
  HIT_POINTS, WAVES_PER_ROUND, PERFECT_ROUND_BONUS, ROUND_QUOTA, ROUNDS,
} from './constants';
import { spawnTurkey, stepTurkey, escapeTurkey, hitTurkey } from './turkeys';
import { fireArrow, stepArrow, arrowOut, arrowHitsTurkey } from './arrows';
import type { Arrow, GameState, Input, RunPlan, Turkey } from './types';

export function createInitialState(plan: RunPlan): GameState {
  return {
    tick: 0, phase: 'intermission', phaseTicks: 0, waveIndex: 0,
    turkeys: [], arrows: [], arrowsLeft: 0, drawTicks: 0, wasDrawing: false,
    score: 0, roundHits: 0, totalHits: 0, shotsFired: 0, outcome: 'none', plan,
  };
}

export function currentRound(s: GameState): number {
  return s.plan.waves[s.waveIndex].round;
}

/** Advances the game by exactly one fixed tick. Pure. */
export function step(s: GameState, input: Input): GameState {
  if (s.phase === 'over') return s;
  const tick = s.tick + 1;
  const waveIndex = s.waveIndex;
  const wave = s.plan.waves[waveIndex];
  const round = wave.round;

  if (s.phase === 'intermission') {
    const phaseTicks = s.phaseTicks + 1;
    if (phaseTicks >= WAVE_GAP_TICKS) {
      return {
        ...s, tick, phase: 'playing', phaseTicks: 0,
        turkeys: wave.turkeys.map((tp, i) => spawnTurkey(tp, round, waveIndex * TURKEYS_PER_WAVE + i)),
        arrows: [], arrowsLeft: ARROWS_PER_WAVE, drawTicks: 0, wasDrawing: input.drawing,
      };
    }
    return { ...s, tick, phaseTicks, wasDrawing: input.drawing };
  }

  // a. Bow
  let drawTicks = s.drawTicks;
  let arrowsLeft = s.arrowsLeft;
  let shotsFired = s.shotsFired;
  let arrows: Arrow[] = s.arrows;
  if (input.drawing) {
    drawTicks = Math.min(drawTicks + 1, DRAW_MAX_TICKS);
  } else if (s.wasDrawing) {
    if (drawTicks >= DRAW_MIN_TICKS && arrowsLeft > 0) {
      arrows = [...arrows, fireArrow(drawTicks, input.aimX, input.aimY, shotsFired)];
      arrowsLeft -= 1;
      shotsFired += 1;
    }
    drawTicks = 0;
  }
  const wasDrawing = input.drawing;

  // b. Arrows
  arrows = arrows.map(stepArrow).filter((a) => !arrowOut(a));

  // c. Turkeys
  let turkeys: Turkey[] = s.turkeys.map((t, i) => stepTurkey(t, wave.turkeys[i], round));

  // d. Out of arrows: remaining flyers escape
  if (arrowsLeft === 0 && arrows.length === 0) {
    turkeys = turkeys.map((t) => (t.status === 'flying' ? escapeTurkey(t) : t));
  }

  // e. Hits
  let score = s.score, roundHits = s.roundHits, totalHits = s.totalHits;
  const kept: Arrow[] = [];
  for (const a of arrows) {
    let hit = false;
    for (let i = 0; i < turkeys.length; i++) {
      const t = turkeys[i];
      if ((t.status === 'flying' || t.status === 'escaping') && arrowHitsTurkey(a, t)) {
        turkeys = turkeys.map((x, j) => (j === i ? hitTurkey(x) : x));
        roundHits += 1; totalHits += 1; score += HIT_POINTS[round];
        hit = true;
        break;
      }
    }
    if (!hit) kept.push(a);
  }
  arrows = kept;

  const next: GameState = {
    ...s, tick, turkeys, arrows, arrowsLeft, shotsFired, drawTicks, wasDrawing, score, roundHits, totalHits,
  };

  // f. Wave end
  if (turkeys.every((t) => t.status === 'gone')) {
    let endScore = score;
    let endRoundHits = roundHits;
    if (waveIndex % WAVES_PER_ROUND === WAVES_PER_ROUND - 1) {
      if (roundHits === WAVES_PER_ROUND * TURKEYS_PER_WAVE) endScore += PERFECT_ROUND_BONUS;
      if (roundHits < ROUND_QUOTA[round]) {
        return { ...next, score: endScore, arrows: [], drawTicks: 0, phase: 'over', outcome: 'failed' };
      }
      if (round === ROUNDS - 1) {
        return { ...next, score: endScore, arrows: [], drawTicks: 0, phase: 'over', outcome: 'cleared' };
      }
      endRoundHits = 0;
    }
    return {
      ...next, score: endScore, roundHits: endRoundHits, arrows: [], drawTicks: 0,
      waveIndex: waveIndex + 1, phase: 'intermission', phaseTicks: 0,
    };
  }
  return next;
}
