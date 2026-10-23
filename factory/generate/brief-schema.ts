/**
 * Generation brief — the input to one G1 job.
 * Every field the agent needs to produce a single GameModule candidate.
 */

export type ControlScheme = 'tap' | 'hold' | 'swipe' | 'drag' | 'rhythm';
// 'tilt' is reserved (PR-6) and excluded from generation.

export type MutationDirective =
  | { type: 'novel' }
  | { type: 'evolve'; parentGameId: string; parentGameVersion: string };

export interface GenerationBrief {
  /** Unique job identifier. Use crypto.randomUUID(). */
  jobId: string;
  controlScheme: ControlScheme;
  /** Inclusive range 25–60 seconds. */
  durationSeconds: number;
  /** From the active lore arc when available; else a generic default. */
  themeTags: string[];
  mutationDirective: MutationDirective;
  /** Per-job spend cap in USD cents. Aborts if exceeded. Default 15¢. */
  budgetCents: number;
}

export interface GenerationResult {
  jobId: string;
  brief: GenerationBrief;
  /** Raw TypeScript source — one file, default-exports a GameModule. */
  code: string;
  provenance: ProvenanceRecord;
  /** Actual spend for this job in USD cents. */
  costCents: number;
  generatedAt: string; // ISO-8601
}

export interface ProvenanceRecord {
  gameId: string;
  gameVersion: string;
  contractVersion: string;
  generatedBy: 'agent';
  parentLineage: string | null;
  authoredAt: string; // YYYY-MM-DD
  license: 'proprietary';
  ipClearance: string;
  notes: string;
}
