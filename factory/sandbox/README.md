# G2 — Sandbox + Compile Gate

Second stage of the Game Factory. Every G1 candidate passes five gates before reaching G3.

## Gates (run in order — fail fast)

| # | Gate | Method | Rejects |
|---|---|---|---|
| 1 | `forbidden-apis` | Source scan | `Math.random()`, `Date.now()`, `performance.now()` (PR-1) |
| 2 | `compile` | esbuild bundle | TypeScript errors, missing imports |
| 2 | `bundle-size` | `stat()` | Bundles > 5 MB |
| 3 | `determinism` | Node sim replay | Two runs with same seed diverge (PR-1/PR-2) |
| 4 | `lifecycle` | jsdom mount/destroy | Any throw during `mount → tick → render → destroy` |
| 5 | `memory-leak` | 100 jsdom cycles | Heap grows > 2 MB over 100 mount→destroy rounds |

## Run

```bash
# After generating candidates with G1:
npx tsx sandbox/runner.ts

# With GC exposed for more accurate memory gate:
node --expose-gc $(which tsx) sandbox/runner.ts
```

## Queue flow

```
factory/queue/
├── pending/   ← G1 writes here
│   └── <jobId>/  index.ts  provenance.json  brief.json  meta.json
├── passed/    ← G2 moves survivors here (G3 reads)
├── rejected/  ← G2 moves failures here (reviewed for prompt tuning)
└── rejection-log.jsonl   ← one line per failure, feeds G1 prompt improvements
```

## Isolation guarantees

- **No network:** jsdom is configured without resource fetching. Bundled code has no network access.
- **No file access:** games import only from `contracts/game-module` (resolved at bundle time). No `fs` or `path` imports are possible in browser-targeted bundles.
- **No DOM escape:** jsdom provides an isolated `document`; the container element is not attached to any persistent tree.

## Rejection reason taxonomy (for G1 tuning)

| Reason pattern | Root cause | G1 fix |
|---|---|---|
| `source contains "Math.random()"` | Agent ignored PR-1 | Reinforce in system prompt; add to negative examples |
| `scores diverged` | Wall-clock or global state in sim | Add "no global mutable state" rule to system prompt |
| `threw during lifecycle` | Null-check missing on canvas ctx | Add null-guard pattern to component library |
| `heap grew N KB` | Event listener not removed in destroy | Add destroy() checklist to system prompt |
| `TypeScript errors` | Import path wrong or type mismatch | Inject correct import statement into system prompt |
