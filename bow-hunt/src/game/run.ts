// Fixed-timestep driver for one run. No Phaser here, so it can be tested in Node.
import { TICK_HZ } from '../engine/constants';
import { generateRunPlan } from '../engine/plan';
import { createInitialState, nextRound, step, upgradeAfter } from '../engine/sim';
import { makeReplay, runReplay } from '../engine/replay';
import type { GameEvent, GameState, Input, Mode, ReplayLog } from '../engine/types';

export const STEP_MS = 1000 / TICK_HZ;
export const MAX_STEPS = 4;   // after a long stall, drop time rather than fast-forward the hunt

export class RunController {
  state: GameState;
  prev: GameState;
  readonly inputs: Input[] = [];
  readonly picks: number[] = [];
  private acc = 0;

  constructor(readonly mode: Mode, readonly seed: string) {
    this.state = createInitialState(generateRunPlan(seed));
    this.prev = this.state;
  }

  get waiting(): boolean {
    return this.state.phase === 'roundEnd' || this.state.phase === 'over';
  }

  /** Runs as many fixed ticks as `frameMs` covers, recording each input. Returns every event those ticks raised. */
  advance(frameMs: number, input: Input): GameEvent[] {
    const events: GameEvent[] = [];
    if (this.waiting) { this.acc = 0; return events; }
    this.acc += Math.min(frameMs, 250);
    let steps = 0;
    while (this.acc >= STEP_MS && steps < MAX_STEPS && !this.waiting) {
      this.prev = this.state;
      this.state = step(this.state, input);
      this.inputs.push(input);
      events.push(...this.state.events);
      this.acc -= STEP_MS;
      steps++;
    }
    if (steps === MAX_STEPS) this.acc = Math.min(this.acc, STEP_MS);
    return events;
  }

  /** How far between the last two ticks the display is, 0..1, for smooth motion on fast screens. */
  get alpha(): number {
    return this.waiting ? 1 : Math.min(1, this.acc / STEP_MS);
  }

  /** `pick` chooses bow A (0) or B (1) when the round just cleared offers an upgrade; it is recorded for the replay. */
  nextRound(pick = 0): void {
    if (this.state.phase === 'roundEnd' && upgradeAfter(this.state.round)) this.picks.push(pick);
    this.state = nextRound(this.state, pick);
    this.prev = this.state;
    this.acc = 0;
  }

  replay(): ReplayLog {
    return makeReplay(this.mode, this.seed, this.inputs, this.picks);
  }

  /** Re-runs the whole hunt from the seed and recorded inputs, the same check the server will do. */
  verify(): boolean {
    return runReplay(this.replay()).score === this.state.score;
  }
}
