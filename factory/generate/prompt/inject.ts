/**
 * Builds the full prompt context for one generation job.
 * Injects: system prompt + contract source + both F4 exemplars + the brief.
 */

import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { GenerationBrief } from '../brief-schema.js';

const __dir   = dirname(fileURLToPath(import.meta.url));
const root    = join(__dir, '..', '..', '..');

function read(rel: string): string {
  return readFileSync(join(root, rel), 'utf8');
}

export function buildSystemPrompt(): string {
  return readFileSync(join(__dir, 'system.md'), 'utf8');
}

export function buildUserMessage(brief: GenerationBrief): string {
  const contract      = read('contracts/game-module.ts');
  const precisionTap  = read('games/precision-tap/index.ts');
  const pressureHold  = read('games/pressure-hold/index.ts');

  const mutationNote = brief.mutationDirective.type === 'novel'
    ? 'Generate a completely new mechanic — do not derive from either reference game.'
    : `Evolve game "${brief.mutationDirective.parentGameId}" v${brief.mutationDirective.parentGameVersion}. Keep its core loop; add one meaningful twist that raises the skill ceiling.`;

  return `## CONTRACT (game-module.ts — read every line)
\`\`\`typescript
${contract}
\`\`\`

## REFERENCE GAME 1 — precision-tap (tap · flat difficulty · 30s)
\`\`\`typescript
${precisionTap}
\`\`\`

## REFERENCE GAME 2 — pressure-hold (hold · ramp difficulty · 30s)
\`\`\`typescript
${pressureHold}
\`\`\`

## GENERATION BRIEF
- controlScheme: ${brief.controlScheme}
- durationSeconds: ${brief.durationSeconds}
- themeTags: ${JSON.stringify(brief.themeTags)}
- mutation: ${mutationNote}
- jobId: ${brief.jobId}
- today: ${new Date().toISOString().slice(0, 10)}

Generate the game now. Output only the JSON object with "code" and "provenance" fields.`;
}
