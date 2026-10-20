# CONTEXT CAPSULE
Updated: 261020-3 (prev: 261020-2)
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

**Repo structure (as of 261020):**
- Operable (CI): `contracts/` · `db/` · `games/` · `tests/` — at root
- Governance: `governance/00-COMMAND/` · `governance/10-CANON/` · `governance/90-ARCHIVE/`
- Legacy: `governance/_legacy/HQ/` · `governance/_legacy/arena-july/`

**Frozen rulings (governance/10-CANON/DECISIONS/) — 19 files:**
- PR-1 PRNG (sfc32) · PR-2 Fixed timestep · PR-3 Sim/view split · PR-4 Version keying · PR-5 Cold start · PR-6 Tilt reserved — RULED 2026-09-06
- GTM-1 Liberation Run · GTM-2 Broadcast/prize decoupling · CP-0 Solvency gate · CREDIT-1 Two-rail credits — RULED 2026-07-30; CREDIT-1 ratified 2026-10-20
- OPS-1 Escalation rule — RULED 2026-07-19; OPS-2 Supersession · OPS-3 Chat labels — RULED 2026-08-10
- AUD-1 Investor audience · BRAND-1 Name structure · BRAND-2 Neon-noir look · BRAND-3 Core line · CANON-2 Board fold · GTM-4 Venues = one channel — RULED 2026-10-20

**Open items:**
- World name (Freehold / Arclight / Quarterlight / Elsewhere) — blocks BRAND-1, trademark search
- GTM-3 The First Cache — PROPOSED; needs max-weight session to supersede GTM-1
- OPS-4 Operating board + cold critique — PROPOSED, parked in `governance/00-COMMAND/PROPOSED/`

**Three things open on purpose:** world name, C4-ADDENDUM-1 missing, protocol version ambiguity. None block F3.

---

## PARKED
- ASS (All Service Solutions) — GTM DRAFT review pending; Gavin v5.2 sync confirmed sent
- FABLE / digital museum — return after ASS repo work
- NEXUS, CREA — no active session

---

## LAST SESSION
261020 — Investor brief rulings landed: AUD-1, BRAND-1..3, CANON-2, GTM-4 committed to canon; GTM-3 parked as PROPOSED. Repo consolidated: governance/ split from operable root; legacy Arena docs from HQ + arena-july brought in. Capsule regenerated.

261020 — Canon: OPS-1 completed, OPS-2 + OPS-3 landed; CREDIT-1 ratified; CLAUDE.md ledger protocol added; OPS-4 parked as PROPOSED.

261020 — RECON re-run confirmed SAFE TO BUILD F3; auth + frontend stack unruled; F3 build blocked on those two calls.
