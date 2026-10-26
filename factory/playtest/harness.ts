/**
 * G3 — bot-playtest harness.
 *
 * For a game slug or bundle path, run `random`, `greedy`, and the game's own
 * expert (or a generic per controlScheme), each over N seeded playthroughs.
 * Compute the FORMAT-1-oriented skill gradient (expert_mean − random_mean)
 * and keep/reject against the provisional bars in canon.md (BUILD step 5).
 */

import type { GameModule } from '../../contracts/game-module.js';
import type { BotStats, SkillEvidence } from './stats-schema.js';
import {
  randomController,
  greedyController,
  loadControllerFor,
  runBot,
  type BotKind,
  type BotResult,
} from './bots.js';

const DEFAULT_SEED_COUNT = 200;
const REACTION_LIMIT_TICKS = 12;

function stats(xs: number[]): BotStats {
  const n = xs.length;
  const mean = xs.reduce((s, x) => s + x, 0) / n;
  const variance = xs.reduce((s, x) => s + (x - mean) ** 2, 0) / n;
  const sd = Math.sqrt(variance);
  return {
    description: '',
    mean,
    sd,
    min: Math.min(...xs),
    max: Math.max(...xs),
  };
}

export async function playtest(
  gameSlug: string,
  modInput: GameModule | { default: GameModule },
  opts: { seedFrom?: number; seedCount?: number } = {},
): Promise<SkillEvidence> {
  const mod: GameModule = ((modInput as { default?: GameModule }).default ?? modInput) as GameModule;
  const seedFrom = opts.seedFrom ?? 1;
  const seedCount = opts.seedCount ?? DEFAULT_SEED_COUNT;
  const seedTo = seedFrom + seedCount - 1;
  const seeds = Array.from({ length: seedCount }, (_, i) => seedFrom + i);

  const scheme = mod.meta.controlScheme;
  const { controller: expert, source: expertSource } = await loadControllerFor(gameSlug, scheme);
  const controllers: Record<BotKind, Awaited<ReturnType<typeof loadControllerFor>>['controller']> = {
    random: randomController(scheme),
    greedy: greedyController(scheme),
    expert,
  };

  const results: Record<BotKind, BotResult[]> = { random: [], greedy: [], expert: [] };
  for (const seed of seeds) {
    for (const kind of ['random', 'greedy', 'expert'] as const) {
      results[kind].push(await runBot(mod, seed, controllers[kind]));
    }
  }

  const scores = (kind: BotKind): number[] => results[kind].map(r => r.score);
  const completionRate = (kind: BotKind): number =>
    results[kind].filter(r => r.completed).length / seedCount;

  const random = { ...stats(scores('random')), description: 'Random valid inputs, seeded.' };
  const greedy = { ...stats(scores('greedy')), description: 'Simple heuristic per controlScheme.' };
  const expertStats = {
    ...stats(scores('expert')),
    description: expertSource === 'game'
      ? `Game-supplied controller.ts (expert).`
      : `Generic expert for controlScheme '${scheme}'.`,
  };

  const expertCoV = expertStats.mean > 0 ? expertStats.sd / expertStats.mean : Infinity;
  const skillGradient = expertStats.mean - random.mean;

  const randomAtMostHalfOfExpert = random.mean <= expertStats.mean / 2;
  const greedyBetween = greedy.mean >= random.mean && greedy.mean <= expertStats.mean;
  const expertVariationAtMost15Percent = expertCoV <= 0.15;

  let verdict: 'KEEP' | 'REJECT' = 'KEEP';
  let rejectReason: string | undefined;
  if (skillGradient <= 0) {
    verdict = 'REJECT';
    rejectReason = `no skill gradient (expert_mean=${expertStats.mean.toFixed(1)} ≤ random_mean=${random.mean.toFixed(1)})`;
  } else if (!randomAtMostHalfOfExpert) {
    verdict = 'REJECT';
    rejectReason = `random/expert too close (random=${random.mean.toFixed(1)}, expert=${expertStats.mean.toFixed(1)})`;
  }

  const maxTickMs = Math.max(
    ...(['random', 'greedy', 'expert'] as const).flatMap(k => results[k].map(r => r.maxTickMs)),
  );
  const overBudgetTickCount = (['random', 'greedy', 'expert'] as const)
    .flatMap(k => results[k].map(r => r.overBudgetTicks))
    .reduce((a, b) => a + b, 0);

  return {
    gameId: gameSlug,
    gameVersion: mod.meta.gameVersion,
    generatedAt: new Date().toISOString().slice(0, 10),
    kind: 'measured',
    rerun: `Run factory/playtest/harness.ts against games/${gameSlug}/.`,
    seeds: { from: seedFrom, to: seedTo, count: seedCount },
    reactionLimitTicks: REACTION_LIMIT_TICKS,
    bots: { random, greedy, expert: expertStats },
    seedConsistency: { expertCoefficientOfVariation: expertCoV },
    bars: {
      source: 'Provisional bars from canon BUILD step 5, until G3 sets real ones.',
      randomAtMostHalfOfExpert,
      greedyBetween,
      expertVariationAtMost15Percent,
    },
    completionRate: {
      random: completionRate('random'),
      greedy: completionRate('greedy'),
      expert: completionRate('expert'),
    },
    frameStability: {
      maxTickMs,
      overBudgetTickCount,
      budgetMs: 1000 / 60,
    },
    skillGradient,
    verdict,
    rejectReason,
  };
}
