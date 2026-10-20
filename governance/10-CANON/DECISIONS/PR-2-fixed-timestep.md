# PR-2 — Fixed Timestep
Ruled: 2026-09-06. Confidence: HIGH. Ratified by founder accepting 2026-08-07 defaults.

**Ruling:** the contract owns the loop. tick(dt) is in the lifecycle. dt is constant at 1/60s sim step, decoupled from render. Wall-clock time is forbidden inside game logic. GameEvent timestamps are expressed in sim ticks, never milliseconds.

**Reversibility:** LOCKED. Undo cost: rewrite, touches every game.

**Why:** F1 claims determinism but gives games no shared clock. Per-game loops make determinism false in practice and fail silently on slow devices — exactly where disputed scores come from.

**Downstream:** every GameModule, replay verification, G3 bot harness.
