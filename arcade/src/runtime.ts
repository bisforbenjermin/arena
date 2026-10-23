import type { GameEvent, GameModule, GameSim } from '../../contracts/game-module';
import { makePrngFactory } from '../../factory/components/prng';

const STEP_MS = 1000 / 60;
const MAX_STEPS = 5;

type Replayable = GameSim & { input(e: GameEvent): void; isDone(): boolean; getCurrentTick(): number };

/**
 * A minimal F1 runtime: owns the loop (PR-2), injects the PRNG (PR-1), ticks the sim at a
 * fixed 1/60 s and renders the view once per frame. Returns a stop function.
 */
export function runModule(
  mod: GameModule,
  container: HTMLElement,
  seed: number,
  onScore: (score: number, events: readonly GameEvent[]) => void,
): () => void {
  const sim = mod.createSim() as Replayable;
  sim.init({ seed, speedMultiplier: 1 }, makePrngFactory(seed));
  const view = mod.createView();
  view.mount(container, sim);
  let finished = false;
  view.onScore((score, events) => {
    finished = true;
    onScore(score, events.slice());
  });

  let raf = 0;
  let last: number | null = null;
  let acc = 0;
  const frame = (now: number) => {
    const dt = last === null ? 0 : Math.min(now - last, 250);
    last = now;
    acc += dt;
    let steps = Math.min(Math.floor(acc / STEP_MS), MAX_STEPS);
    acc = steps === MAX_STEPS ? 0 : acc - steps * STEP_MS;
    while (steps-- > 0 && !sim.isDone()) sim.tick(1 / 60);
    view.render();
    if (!finished) raf = requestAnimationFrame(frame);
  };
  raf = requestAnimationFrame(frame);

  return () => {
    cancelAnimationFrame(raf);
    view.destroy();
    sim.destroy();
  };
}

/** The server's check: a fresh sim fed the event log at its stamped ticks. */
export function replayScore(mod: GameModule, seed: number, events: readonly GameEvent[]): number {
  const sim = mod.createSim() as Replayable;
  sim.init({ seed, speedMultiplier: 1 }, makePrngFactory(seed));
  const log = JSON.parse(JSON.stringify(events)) as GameEvent[];
  let i = 0;
  while (!sim.isDone()) {
    while (i < log.length && log[i].tick === sim.getCurrentTick()) sim.input(log[i++]);
    sim.tick(1 / 60);
  }
  const score = sim.getScore();
  sim.destroy();
  return score;
}
