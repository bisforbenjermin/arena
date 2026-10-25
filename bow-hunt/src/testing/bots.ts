// Test bots. They only produce inputs, so they may use floating point; the sim never sees anything but the ints they emit.
import { MILLI as M, BOW_X, BOW_Y, WORLD_W, WORLD_H, ARROW_GRAVITY, BOWS } from '../engine/constants';
import { launchSpeed } from '../engine/arrows';
import { stepTarget, isHittable } from '../engine/targets';
import { generateRunPlan } from '../engine/plan';
import { createInitialState, nextRound, step, upgradeAfter } from '../engine/sim';
import type { GameState, Input, Target } from '../engine/types';

export type Bot = (s: GameState) => Input;

const IDLE: Input = { aimX: BOW_X, aimY: 400, drawing: false };
const clampAim = (x: number, y: number): Input => ({
  aimX: Math.max(0, Math.min(WORLD_W, Math.round(x))),
  aimY: Math.max(0, Math.min(WORLD_H, Math.round(y))),
  drawing: false,
});

function firstTarget(s: GameState): Target | undefined {
  return s.targets.find((t) => t.status === 'flying' && t.species !== 'star' && t.species !== 'hummer') ?? s.targets.find((t) => t.status === 'flying');
}

/** Aims where the target will be when a full-power arrow can get there. */
export function leadAim(s: GameState, target: Target): Input {
  const tp = s.plan.rounds[s.round].targets[target.slot];
  const v = launchSpeed(BOWS[s.bow].drawMax, s.bow) / M;
  const g = ARROW_GRAVITY / M;
  let t = target;
  for (let n = 1; n <= 120; n++) {
    t = stepTarget(t, tp, s.round);
    if (!isHittable(t)) break;
    const dx = t.x / M - BOW_X;
    const dy = t.y / M - BOW_Y - g * n * (n + 1) / 2;
    if (Math.hypot(dx, dy) / n <= v) {
      const len = Math.hypot(dx, dy);
      return clampAim(BOW_X + dx / len * 400, BOW_Y + dy / len * 400);
    }
  }
  return clampAim(target.x / M, target.y / M);
}

/** Draws to full power, then releases one tick. `aim` decides where the release points. */
function drawCycle(aim: (s: GameState) => Input | null): Bot {
  let held = 0;
  return (s) => {
    if (s.phase !== 'playing') { held = 0; return IDLE; }
    if (held < BOWS[s.bow].drawMax) {
      if (!firstTarget(s) && held === 0) return IDLE;
      held += 1;
      return { ...IDLE, drawing: true };
    }
    held = 0;
    return aim(s) ?? IDLE;
  };
}

/** Leads its target: the skilled player. */
export function makeLeadBot(): Bot {
  return drawCycle((s) => { const t = firstTarget(s); return t ? leadAim(s, t) : null; });
}

/** Aims straight at where the target is now: the unskilled player. */
export function makeNaiveBot(): Bot {
  return drawCycle((s) => { const t = firstTarget(s); return t ? clampAim(t.x / M, t.y / M) : null; });
}

/** Fires at random angles. `next` returns floats in [0, 1). */
export function makeRandomBot(next: () => number): Bot {
  return drawCycle(() => clampAim(next() * WORLD_W, next() * 500));
}

/** Plays a whole run with a bot, tapping Next Round instantly. Returns the end state and the inputs it used. */
export function playRun(seed: string, bot: Bot, choose: (round: number) => number = () => 0): { state: GameState; inputs: Input[]; picks: number[] } {
  let s = createInitialState(generateRunPlan(seed));
  const inputs: Input[] = [];
  const picks: number[] = [];
  while (s.phase !== 'over' && inputs.length < 30000) {
    if (s.phase === 'roundEnd') {
      if (upgradeAfter(s.round)) { const p = choose(s.round); picks.push(p); s = nextRound(s, p); } else s = nextRound(s);
      continue;
    }
    const i = bot(s);
    inputs.push(i);
    s = step(s, i);
  }
  return { state: s, inputs, picks };
}
