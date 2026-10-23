/**
 * Daily budget tracker. Reads and writes factory/queue/budget.json.
 * Aborts generation if the daily cap would be exceeded.
 *
 * Prices are estimates; actual billing comes from the Anthropic dashboard.
 * Sonnet 4.6 input: $3/MTok · output: $15/MTok (as of 2026-10).
 */

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dir  = dirname(fileURLToPath(import.meta.url));
const LEDGER = join(__dir, '..', 'queue', 'budget.json');

export interface BudgetLedger {
  date: string;         // YYYY-MM-DD
  spentCents: number;
  jobCount: number;
}

export const DAILY_CAP_CENTS = 500; // $5 / day default — override via env

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

function load(): BudgetLedger {
  if (!existsSync(LEDGER)) return { date: today(), spentCents: 0, jobCount: 0 };
  const raw = JSON.parse(readFileSync(LEDGER, 'utf8')) as BudgetLedger;
  if (raw.date !== today()) return { date: today(), spentCents: 0, jobCount: 0 };
  return raw;
}

function save(ledger: BudgetLedger): void {
  writeFileSync(LEDGER, JSON.stringify(ledger, null, 2));
}

export function assertBudget(jobCapCents: number): void {
  const cap  = Number(process.env['ARENA_DAILY_BUDGET_CENTS'] ?? DAILY_CAP_CENTS);
  const ledger = load();
  if (ledger.spentCents + jobCapCents > cap) {
    throw new Error(
      `Daily budget exhausted: ${ledger.spentCents}¢ spent, ${cap}¢ cap, job wants ${jobCapCents}¢`,
    );
  }
}

export function recordSpend(cents: number): void {
  const ledger = load();
  ledger.spentCents += cents;
  ledger.jobCount   += 1;
  save(ledger);
}

/** Rough cost estimate from token counts. */
export function estimateCents(inputTokens: number, outputTokens: number): number {
  const inputCents  = (inputTokens  / 1_000_000) * 300;  // $3/MTok → 300¢/MTok
  const outputCents = (outputTokens / 1_000_000) * 1500; // $15/MTok → 1500¢/MTok
  return Math.ceil(inputCents + outputCents);
}
