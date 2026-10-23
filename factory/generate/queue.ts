/**
 * Candidate queue — writes G1 output to factory/queue/pending/<jobId>/.
 * G2 picks up from there for compile + sandbox.
 */

import { mkdirSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { GenerationResult } from './brief-schema.js';

const __dir   = dirname(fileURLToPath(import.meta.url));
const PENDING = join(__dir, '..', 'queue', 'pending');

export function enqueue(result: GenerationResult): string {
  const jobDir = join(PENDING, result.jobId);
  mkdirSync(jobDir, { recursive: true });

  writeFileSync(join(jobDir, 'index.ts'),       result.code,                          'utf8');
  writeFileSync(join(jobDir, 'provenance.json'), JSON.stringify(result.provenance, null, 2), 'utf8');
  writeFileSync(join(jobDir, 'brief.json'),      JSON.stringify(result.brief,     null, 2), 'utf8');
  writeFileSync(join(jobDir, 'meta.json'),       JSON.stringify({
    jobId:       result.jobId,
    costCents:   result.costCents,
    generatedAt: result.generatedAt,
    status:      'pending',
  }, null, 2), 'utf8');

  return jobDir;
}
