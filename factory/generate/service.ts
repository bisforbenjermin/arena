/**
 * G1 — Generation Service
 *
 * Receives one or more GenerationBriefs, calls the Anthropic API for each,
 * parses the structured response, and emits candidates to factory/queue/pending/.
 *
 * Usage:
 *   ANTHROPIC_API_KEY=sk-... npx tsx generate/service.ts
 *
 * Or call generateOne() / generateBatch() directly from other factory scripts.
 */

import Anthropic from '@anthropic-ai/sdk';
import { randomUUID } from 'node:crypto';
import type { GenerationBrief, GenerationResult, ProvenanceRecord } from './brief-schema.js';
import { assertBudget, recordSpend, estimateCents } from './budget.js';
import { buildSystemPrompt, buildUserMessage } from './prompt/inject.js';
import { enqueue } from './queue.js';

const MODEL = 'claude-sonnet-4-6';
const MAX_TOKENS = 4096;
const DEFAULT_BUDGET_CENTS = 15; // 15¢ per job
const DEFAULT_CONCURRENCY  = 3;

// ─── CORE ────────────────────────────────────────────────────────────────────

export async function generateOne(
  brief: GenerationBrief,
  client: Anthropic,
): Promise<GenerationResult> {
  assertBudget(brief.budgetCents);

  const system = buildSystemPrompt();
  const user   = buildUserMessage(brief);

  const response = await client.messages.create({
    model:      MODEL,
    max_tokens: MAX_TOKENS,
    system,
    messages:   [{ role: 'user', content: user }],
  });

  const inputTokens  = response.usage.input_tokens;
  const outputTokens = response.usage.output_tokens;
  const costCents    = estimateCents(inputTokens, outputTokens);

  recordSpend(costCents);

  // Parse the structured JSON response
  const raw = response.content
    .filter(b => b.type === 'text')
    .map(b => (b as { type: 'text'; text: string }).text)
    .join('');

  let parsed: { code: string; provenance: ProvenanceRecord };
  try {
    // Strip any accidental markdown fences the model adds
    const cleaned = raw.replace(/^```(?:json)?\s*/m, '').replace(/\s*```$/m, '').trim();
    parsed = JSON.parse(cleaned) as typeof parsed;
  } catch {
    throw new Error(`G1: model returned non-JSON for job ${brief.jobId}:\n${raw.slice(0, 400)}`);
  }

  if (!parsed.code || !parsed.provenance) {
    throw new Error(`G1: missing code or provenance in response for job ${brief.jobId}`);
  }

  const result: GenerationResult = {
    jobId:       brief.jobId,
    brief,
    code:        parsed.code,
    provenance:  parsed.provenance,
    costCents,
    generatedAt: new Date().toISOString(),
  };

  const jobDir = enqueue(result);
  console.log(`[G1] job ${brief.jobId} → ${jobDir} (${costCents}¢)`);

  return result;
}

// ─── BATCH ───────────────────────────────────────────────────────────────────

export async function generateBatch(
  briefs: GenerationBrief[],
  concurrency = DEFAULT_CONCURRENCY,
): Promise<GenerationResult[]> {
  const client  = new Anthropic({ apiKey: process.env['ANTHROPIC_API_KEY'] });
  const results: GenerationResult[]  = [];
  const errors:  { jobId: string; error: string }[] = [];

  // Simple semaphore — process at most `concurrency` jobs at once
  const queue   = [...briefs];
  const running = new Set<Promise<void>>();

  const dispatch = (): void => {
    while (running.size < concurrency && queue.length > 0) {
      const brief = queue.shift()!;
      const p = generateOne(brief, client)
        .then(r  => { results.push(r); })
        .catch(e => { errors.push({ jobId: brief.jobId, error: String(e) }); })
        .finally(() => { running.delete(p); dispatch(); });
      running.add(p);
    }
  };

  dispatch();
  while (running.size > 0) await Promise.race(running);

  if (errors.length > 0) {
    console.error(`[G1] ${errors.length} job(s) failed:`);
    for (const e of errors) console.error(`  ${e.jobId}: ${e.error}`);
  }

  console.log(`[G1] batch done: ${results.length} succeeded, ${errors.length} failed`);
  return results;
}

// ─── CLI ENTRYPOINT ───────────────────────────────────────────────────────────
// Run with: npx tsx generate/service.ts
// Generates one game per active control scheme as a smoke-test.

if (process.argv[1]?.endsWith('service.ts') || process.argv[1]?.endsWith('service.js')) {
  const smokeBriefs: GenerationBrief[] = [
    {
      jobId:             randomUUID(),
      controlScheme:     'tap',
      durationSeconds:   30,
      themeTags:         ['reclaimed-time', 'precision'],
      mutationDirective: { type: 'novel' },
      budgetCents:       DEFAULT_BUDGET_CENTS,
    },
    {
      jobId:             randomUUID(),
      controlScheme:     'swipe',
      durationSeconds:   45,
      themeTags:         ['realm', 'momentum'],
      mutationDirective: { type: 'novel' },
      budgetCents:       DEFAULT_BUDGET_CENTS,
    },
  ];

  await generateBatch(smokeBriefs, 2);
}
