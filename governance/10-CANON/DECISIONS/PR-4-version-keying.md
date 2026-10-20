# PR-4 — Version Keying
Ruled: 2026-09-06. Confidence: HIGH. Ratified by founder accepting 2026-08-07 defaults.

**Ruling:** the contract carries semver. Each game declares contractVersion AND gameVersion. Percentile distributions are keyed (gameId, gameVersion). Any balance change bumps gameVersion and starts a fresh distribution.

**Reversibility:** LOCKED. Undo cost: rewrite; corrupts data silently if deferred.

**Why:** without it a difficulty tweak silently re-baselines every historical percentile, and percentile drives rank, and rank is the eligibility surface.

**Downstream:** F2 schema, R2 normalizer, R3 rank tokens.
