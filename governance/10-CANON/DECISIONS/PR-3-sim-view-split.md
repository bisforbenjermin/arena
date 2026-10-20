# PR-3 — Sim/View Split
Ruled: 2026-09-06. Confidence: HIGH. Ratified by founder accepting 2026-08-07 defaults.

**Ruling:** every GameModule ships as two halves. sim is pure, headless, DOM-free, runs under Node. view renders and reads sim state. A client-reported rawScore is always a CLAIM; the server replays the event log through sim and the replayed score is authoritative. The contract must make a DOM-dependent sim impossible to write accidentally — enforce in the types.

**Reversibility:** LOCKED. Undo cost: rewrite of every game in the pool.

**Why:** server-authoritative scoring is only achievable if game logic runs without a browser. Retrofitting a headless sim onto finished games is a rewrite, not a refactor.

**Downstream:** F1, F2 schema claim/verified split, F4, G3, R2.
