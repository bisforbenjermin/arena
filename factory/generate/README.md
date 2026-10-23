# G1 — Generation Service

Stage 1 of the Game Factory. Invents raw GameModule candidates from a GenerationBrief.

## How it works

1. Receive a `GenerationBrief` (control scheme, duration, theme tags, mutation directive).
2. Inject the full GameModule contract + both F4 reference games into the model context.
3. Call `claude-sonnet-4-6` for a structured JSON response: `{ code, provenance }`.
4. Write the candidate to `factory/queue/pending/<jobId>/` for G2.

## Setup

```
cd factory
npm install
export ANTHROPIC_API_KEY=sk-...
```

## Run (smoke test — generates 2 games)

```
npx tsx generate/service.ts
```

You should see two directories appear in `factory/queue/pending/`.

## Programmatic use

```typescript
import { generateBatch } from './generate/service.js';
import { randomUUID } from 'node:crypto';

const results = await generateBatch([
  {
    jobId:             randomUUID(),
    controlScheme:     'tap',
    durationSeconds:   30,
    themeTags:         ['reclaimed-time', 'precision'],
    mutationDirective: { type: 'novel' },
    budgetCents:       15,
  },
], /* concurrency */ 3);
```

## Budget controls

| Variable | Default | Effect |
|---|---|---|
| `ARENA_DAILY_BUDGET_CENTS` | `500` (=$5) | Hard daily cap across all jobs |
| `brief.budgetCents` | `15` (=15¢) | Per-job spend before abort |

Actual spend is logged to `factory/queue/budget.json` and resets at midnight.

## Brief fields

| Field | Type | Notes |
|---|---|---|
| `controlScheme` | `tap\|hold\|swipe\|drag\|rhythm` | Never `tilt` (PR-6 reserved) |
| `durationSeconds` | 25–60 | Inclusive |
| `themeTags` | `string[]` | From active lore arc; else generic defaults |
| `mutationDirective` | `{type:'novel'} \| {type:'evolve', parentGameId, parentGameVersion}` | Novel = fresh mechanic; evolve = parent loop + one twist |

## Output (per job — written to `factory/queue/pending/<jobId>/`)

| File | Contents |
|---|---|
| `index.ts` | GameModule source — one file, default export |
| `provenance.json` | IP clearance + lineage record |
| `brief.json` | The brief that produced this candidate |
| `meta.json` | Cost, timestamp, pipeline status |

## Cost model (estimates — verify against Anthropic dashboard)

Input context is ~6 KB (contract + 2 exemplars). At Sonnet 4.6 pricing:
- Typical job: ~4 000 input tokens + ~1 000 output tokens ≈ **3–5¢**
- 100 games/day ≈ **$3–5**

## Downstream

G2 compiles + sandboxes each candidate from `factory/queue/pending/`.
G5 audits provenance. G7 feeds high-performers back as `evolve` parents.
