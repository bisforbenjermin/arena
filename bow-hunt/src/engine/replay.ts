import { generateRunPlan } from './plan';
import { createInitialState, step } from './sim';
import type { Input, InputRun, ReplayLog, ReplayResult } from './types';

export function compressInputs(inputs: Input[]): InputRun[] {
  const out: InputRun[] = [];
  for (const i of inputs) {
    const d: 0 | 1 = i.drawing ? 1 : 0;
    const last = out[out.length - 1];
    if (last && last[1] === i.aimX && last[2] === i.aimY && last[3] === d) {
      out[out.length - 1] = [last[0] + 1, last[1], last[2], last[3]];
    } else {
      out.push([1, i.aimX, i.aimY, d]);
    }
  }
  return out;
}

export function expandInputs(runs: InputRun[]): Input[] {
  const out: Input[] = [];
  for (const [count, aimX, aimY, d] of runs) {
    for (let k = 0; k < count; k++) out.push({ aimX, aimY, drawing: d === 1 });
  }
  return out;
}

/** Recomputes a run's result from its seed and inputs alone. */
export function runReplay(log: ReplayLog): ReplayResult {
  if (log.version !== 1) throw new Error('Unsupported replay version');
  let state = createInitialState(generateRunPlan(log.seed));
  for (const input of expandInputs(log.inputs)) {
    if (state.phase === 'over') break;
    state = step(state, input);
  }
  return {
    ticks: state.tick, score: state.score, totalHits: state.totalHits,
    shotsFired: state.shotsFired, outcome: state.outcome,
  };
}
