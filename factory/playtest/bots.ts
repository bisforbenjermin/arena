/**
 * G3 — three skill-profile bots.
 *
 * Each bot drives a GameSim headlessly. The game may ship its own
 * `games/<slug>/controller.ts` with a named `expert` export; if absent,
 * the generic expert for the game's controlScheme is used (G3 spec,
 * "if absent, use a generic heuristic per controlScheme").
 *
 * Every bot draws from a seeded PRNG so a seed reproduces its run exactly.
 */

import type { ControlScheme, GameModule, GameSim } from '../../contracts/game-module.js';
import { makePrngFactory } from '../components/prng.js';

export type BotKind = 'random' | 'greedy' | 'expert';

export interface BotResult {
  score: number;
  completed: boolean;
  maxTickMs: number;
  overBudgetTicks: number;
}

export interface Controller {
  (sim: GameSim, prng: () => number, tick: number): void;
}

type SimInputs = {
  tap?: () => void;
  holdStart?: () => void;
  holdEnd?: () => void;
};

function wireInputs(sim: GameSim): SimInputs {
  const s = sim as unknown as Record<string, (() => void) | undefined>;
  return {
    tap: s['registerTap']?.bind(sim),
    holdStart: s['registerHoldStart']?.bind(sim),
    holdEnd: s['registerHoldEnd']?.bind(sim),
  };
}

export function randomController(scheme: ControlScheme): Controller {
  return (sim, prng) => {
    const inputs = wireInputs(sim);
    const r = prng();
    if (scheme === 'tap' && inputs.tap && r < 0.05) inputs.tap();
    else if (scheme === 'hold' && inputs.holdStart && inputs.holdEnd) {
      if (r < 0.02) inputs.holdStart();
      else if (r > 0.98) inputs.holdEnd();
    }
  };
}

export function greedyController(scheme: ControlScheme): Controller {
  return (sim, _prng, tick) => {
    const inputs = wireInputs(sim);
    if (scheme === 'tap' && inputs.tap && tick % 30 === 0) inputs.tap();
    else if (scheme === 'hold' && inputs.holdStart && inputs.holdEnd) {
      if (tick % 120 === 0) inputs.holdStart();
      else if (tick % 120 === 60) inputs.holdEnd();
    }
  };
}

export function genericExpertController(scheme: ControlScheme): Controller {
  return (sim, _prng, tick) => {
    const inputs = wireInputs(sim);
    if (scheme === 'tap' && inputs.tap && tick % 12 === 0) inputs.tap();
    else if (scheme === 'hold' && inputs.holdStart && inputs.holdEnd) {
      if (tick % 90 === 0) inputs.holdStart();
      else if (tick % 90 === 75) inputs.holdEnd();
    }
  };
}

export async function loadControllerFor(
  gameSlug: string,
  scheme: ControlScheme,
): Promise<{ controller: Controller; source: 'game' | 'generic' }> {
  try {
    const mod = (await import(`../../games/${gameSlug}/controller.ts`)) as {
      expert?: Controller;
    };
    if (typeof mod.expert === 'function') return { controller: mod.expert, source: 'game' };
  } catch {
    /* fall through */
  }
  return { controller: genericExpertController(scheme), source: 'generic' };
}

export async function runBot(
  mod: GameModule,
  seed: number,
  controller: Controller,
): Promise<BotResult> {
  const sim = mod.createSim();
  const prngFactory = makePrngFactory(seed);
  sim.init({ seed, speedMultiplier: 1 }, prngFactory);
  const totalTicks = mod.meta.durationSeconds * 60;
  const prng = prngFactory('bot');

  const budgetMs = 1000 / 60;
  let maxTickMs = 0;
  let overBudgetTicks = 0;
  let completed = false;

  try {
    for (let tick = 1; tick <= totalTicks; tick++) {
      const t0 = Number(process.hrtime.bigint()) / 1e6;
      sim.tick(1 / 60);
      controller(sim, prng, tick);
      const dt = Number(process.hrtime.bigint()) / 1e6 - t0;
      if (dt > maxTickMs) maxTickMs = dt;
      if (dt > budgetMs) overBudgetTicks++;
    }
    completed = true;
  } catch {
    completed = false;
  }

  const raw = sim.getScore();
  const score = typeof raw === 'number' && !Number.isNaN(raw) ? raw : 0;
  sim.destroy();
  return { score, completed, maxTickMs, overBudgetTicks };
}
