# OPS-2 — Documents are superseded, never edited in place
Ruled: 2026-08-10 | Reversibility: REVERSIBLE | Undo cost: minutes | Confidence: MEDIUM

## Ruling
Frozen documents are never edited in place. A document is superseded: the row's pointer flips from FROZEN to SUPERSEDED by v2, the replacement is promoted, the stale copy is removed. Supersession happens only through a ledger row.

## Why
Spec drift is the dangerous update class. A ruling or a build learning quietly invalidates a frozen doc and nothing signals it. If supersession can only happen through a row, silent staleness becomes structurally impossible.

## Downstream
Everything in `20-SPEC/`. The `90-ARCHIVE/` policy.
