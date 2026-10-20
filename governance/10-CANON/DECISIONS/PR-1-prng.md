# PR-1 — PRNG
Ruled: 2026-09-06. Confidence: HIGH. Ratified by founder accepting 2026-08-07 defaults.

**Ruling:** PRNG is sfc32, seeded from a uint32 derived from RoundConfig.seed. Games never import a PRNG; the runtime injects a factory. Build-time check rejects any game bundle containing Math.random, Date.now, or performance.now.

**Reversibility:** EXPENSIVE. Undo cost: invalidates every stored replay and score distribution.

**Why:** changing the PRNG later voids all historical data.

**Downstream:** F1 contract, R2 normalizer, G2 compile gate, every game bundle.
