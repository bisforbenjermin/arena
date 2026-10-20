# PR-5 — Cold Start
Ruled: 2026-09-06. Confidence: HIGH. Ratified by founder accepting 2026-08-07 defaults.

**Ruling:** a new game is playable but NON-RANKING until it has 200 real scores across at least 30 distinct players. Bot-derived priors may drive on-screen feedback only, never rank. The non-ranking state is explicit in the normalizer's return type, not a magic value.

**Reversibility:** REVERSIBLE. Undo cost: one constant, under an hour.

**Why:** rank is what makes a player eligible for things. Building it on synthetic data is the wrong foundation to defend later. Tradeoff is slower rotation of new games.

**Downstream:** R2, R3, G6 promotion gate.
