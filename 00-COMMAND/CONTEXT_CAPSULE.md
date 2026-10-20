# CONTEXT CAPSULE
Updated: 261020-1 (prev: 261018-1)
Keep this under one page. Rewrite at every significant direction change.

---

## NEXT ACTION
F3 build ready to start — RECON confirmed SAFE TO BUILD F3. Two stack decisions needed before first line of code:
1. **Auth provider** — Supabase Auth strongly implied by F2 but not ruled; confirm or override.
2. **Frontend framework** — nothing in repo yet; need a pick before scaffolding.

Once decided: F3 = PWA shell + Supabase Auth + Rail 1 key eligibility gate + CP-0 prize block. Last foundation block before R-layer (R1–R4) unlocks and first live venue test.

In parallel (non-blocking): G1 can start now (only needs F1). L1 is yours to write — no agents can touch L2–L5 until it's done.

---

## ACTIVE FRONT
**Venture:** ARENA (The Arcade Realm)
**Phase:** Build — F1 + F2 + F4 complete. F3 is next.

**Foundation status:**
- F1 ✅ GameModule contract + scoring normalizer
- F2 ✅ Database schema (9 migrations)
- F3 ⬜ PWA shell + auth + eligibility gating — NEXT
- F4 ✅ Two reference games (precision-tap, pressure-hold)

**Frozen rulings (10-CANON/DECISIONS/):**
- PR-1 PRNG (sfc32) — RULED 2026-09-06
- PR-2 Fixed timestep (tick at 1/60s) — RULED 2026-09-06
- PR-3 Sim/view split — RULED 2026-09-06
- PR-4 Version keying (contractVersion + gameVersion) — RULED 2026-09-06
- PR-5 Cold start (200 scores / 30 players before ranking) — RULED 2026-09-06
- PR-6 Tilt reserved — RULED 2026-09-06
- GTM-1 Liberation Run — RULED 2026-07-30
- GTM-2 Broadcast/prize decoupling — RULED 2026-07-30
- CP-0 Solvency gate — RULED 2026-07-30
- OPS-1 Escalation rule — RULED 2026-07-19 (stub — Why/Downstream truncated)

**Open items:**
- OPS-2, OPS-3 — content never received, files not written
- OPS-1 — stub, truncated; needs Why + Downstream

**Three things open on purpose:** naming decision, C4-ADDENDUM-1 missing, protocol version ambiguity. None block F3.

---

## PARKED
- ASS (All Service Solutions) — GTM DRAFT review pending; Gavin v5.2 sync confirmed sent
- FABLE / digital museum — return after ASS repo work
- NEXUS, CREA — no active session

---

## LAST SESSION
261020 — RECON re-run; determinism gate (tests/determinism.ts) confirmed passing (committed 261019). Read all F3 board decisions: Rail 1 key gate and CP-0 prize block are settled; auth provider and frontend framework are unruled. F3 build blocked on those two calls.

261019 — Determinism gate written and committed: tests/determinism.ts; PR-1/PR-2/PR-3 PASS, PR-4 PARTIAL (no exported version constant), PR-5 PASS, F2 claim/verified PASS. SAFE TO BUILD F3.

261018 — F4 built: precision-tap (tap/flat) + pressure-hold (hold/ramp); both provenance.json written; capsule updated. F3 is now the critical-path blocker.
