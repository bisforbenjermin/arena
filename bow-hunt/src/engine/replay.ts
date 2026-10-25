import { generateRunPlan } from './plan';
import { createInitialState, nextRound, step, upgradeAfter } from './sim';
import type { GameState, Input, InputRun, Mode, ReplayLog, ReplayResult } from './types';

export function compressInputs(inputs: Input[]): InputRun[] {
  const out: InputRun[] = [];
  for (const i of inputs) {
    const d: 0 | 1 = i.drawing ? 1 : 0;
    const last = out[out.length - 1];
    if (last && last[1] === i.aimX && last[2] === i.aimY && last[3] === d) last[0] += 1;
    else out.push([1, i.aimX, i.aimY, d]);
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

export function makeReplay(mode: Mode, seed: string, inputs: Input[], picks: number[] = []): ReplayLog {
  return { version: 3, mode, seed, inputs: compressInputs(inputs), picks };
}

/**
 * Replays a run from its seed and inputs alone. Inputs are the ticks the game actually stepped;
 * between rounds the live game waits on a tap, so the replay starts the next round wherever the last one ended.
 */
export function replayState(log: ReplayLog): GameState {
  if (log.version !== 3) throw new Error('Unsupported replay version');
  let state = createInitialState(generateRunPlan(log.seed));
  let pickIndex = 0;
  const advance = (s: GameState) => (upgradeAfter(s.round) ? nextRound(s, log.picks[pickIndex++] ?? 0) : nextRound(s));
  for (const [count, aimX, aimY, d] of log.inputs) {
    const input: Input = { aimX, aimY, drawing: d === 1 };
    for (let k = 0; k < count; k++) {
      if (state.phase === 'roundEnd') state = advance(state);
      if (state.phase === 'over') return state;
      state = step(state, input);
    }
  }
  return state;
}

export function runReplay(log: ReplayLog): ReplayResult {
  const s = replayState(log);
  return {
    ticks: s.tick, score: s.score, hits: s.stats.hits, shots: s.stats.shots,
    roundsCleared: s.summaries.filter((r) => r.passed).length, outcome: s.outcome,
  };
}
