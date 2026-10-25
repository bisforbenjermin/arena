import { createRng, type Rng } from './rng';
import {
  ROUNDS, TARGETS_PER_ROUND, SPAWN_GAP, JINKS, JINK_RANGE, SPECIES_WEIGHTS, GOLDEN_ONE_IN,
  HUMMER_ONE_IN, FORMATION_ONE_IN, FORMATION_SIZE, FORMATION_GAP, FORMATION_STEP, SKY_TOP, SKY_BOTTOM,
} from './constants';
import { SPECIES, SPECIES_ORDER, type Species } from './species';
import type { Jink, RoundPlan, RunPlan, TargetPlan } from './types';

function pickSpecies(rng: Rng, round: number): Species {
  const w = SPECIES_WEIGHTS[round];
  let roll = rng.int(1, w[0] + w[1] + w[2]);
  for (let i = 0; i < 3; i++) {
    if (roll <= w[i]) return SPECIES_ORDER[i];
    roll -= w[i];
  }
  return SPECIES_ORDER[2];
}

function planTarget(rng: Rng, round: number, species: Species): TargetPlan {
  const s = SPECIES[species];
  const dir: 1 | -1 = rng.int(0, 1) === 0 ? 1 : -1;
  const entryY = rng.int(s.yMin, s.yMax);
  const path = s.paths[rng.int(0, s.paths.length - 1)];
  const amp = rng.int(s.amp[0], s.amp[1]);
  const period = rng.int(s.period[0], s.period[1]);
  const phase = rng.int(0, 255);
  const speedPct = rng.int(90, 110);
  const gap = rng.int(SPAWN_GAP[round][0], SPAWN_GAP[round][1]);
  const jinks: Jink[] = [];
  let at = 0;
  for (let k = 0; k < JINKS[round]; k++) {
    at += rng.int(35, 90);
    jinks.push({ at, dy: rng.int(-JINK_RANGE[round], JINK_RANGE[round]) });
  }
  return { species, dir, entryY, path, amp, period, phase, speedPct, gap, jinks };
}

/** Draws every random value for the run up front, in a fixed order. Same seed, same flock. */
export function generateRunPlan(seed: string): RunPlan {
  const rng = createRng(seed);
  const rounds: RoundPlan[] = [];
  for (let r = 0; r < ROUNDS; r++) {
    const golden = rng.int(1, GOLDEN_ONE_IN) === 1;
    const goldenSlot = golden ? rng.int(3, TARGETS_PER_ROUND - 1) : -1;
    const targets: TargetPlan[] = [];
    for (let i = 0; i < TARGETS_PER_ROUND; i++) {
      const species = i === goldenSlot ? 'golden' : pickSpecies(rng, r);
      targets.push(planTarget(rng, r, species));
    }
    // Some rounds send birds in a slanted line, so one arrow can take three or four. Possible, not easy.
    if (FORMATION_SIZE[r] > 0 && rng.int(1, FORMATION_ONE_IN) === 1) {
      const size = FORMATION_SIZE[r];
      const first = rng.int(1, TARGETS_PER_ROUND - size);
      const lead = planTarget(rng, r, rng.int(0, 1) === 0 ? 'goose' : 'duck');
      const step = rng.int(FORMATION_STEP[0], FORMATION_STEP[1]) * (rng.int(0, 1) === 0 ? 1 : -1);
      const top = Math.max(SKY_TOP + 20, Math.min(SKY_BOTTOM - 20 - (size - 1) * Math.abs(step), lead.entryY));
      const y0 = step > 0 ? top : top + (size - 1) * -step;
      for (let k = 0; k < size; k++) {
        if (targets[first + k].species === 'golden') continue;
        targets[first + k] = {
          ...lead, path: 'glide', amp: 8, jinks: [], entryY: y0 + k * step,
          gap: k === 0 ? targets[first].gap : FORMATION_GAP,
        };
      }
    }
    // one shooting star per round, and sometimes a hummingbird; neither counts toward the quota
    targets.splice(rng.int(2, TARGETS_PER_ROUND - 2), 0, planTarget(rng, r, 'star'));
    if (rng.int(1, HUMMER_ONE_IN) === 1) targets.splice(rng.int(3, targets.length - 1), 0, planTarget(rng, r, 'hummer'));
    rounds.push({ golden, targets });
  }
  return { seed, rounds };
}
