# CONTEXT CAPSULE
Updated: 261020-4 (prev: 261020-3)
Keep this under one page. Rewrite at every significant direction change.

---

## NEXT ACTION
Foundation complete. Two parallel paths available:
1. **G1** — Game loader (needs F1 only; can start now). Paste `specs/G1.md` to begin.
2. **R1** — Tournament runtime (needs F3 shell; C2 jurisdiction spec needed first to make the eligibility gate real).

L1 is yours to write — no agents can touch L2–L5 until it's done.

---

## ACTIVE FRONT
**Venture:** ARENA (The Arcade Realm)
**Phase:** Build — Foundation complete. R-layer + G-layer next.

**Foundation status:**
- F1 ✅ GameModule contract + scoring normalizer
- F2 ✅ Database schema (9 migrations)
- F3 ✅ PWA shell + Supabase Auth + eligibility gate (Next.js, STACK-1)
- F4 ✅ Two reference games (precision-tap, pressure-hold)

**Repo structure:**
- Operable (CI): `contracts/` · `db/` · `games/` · `tests/` · `app/` — at root
- Specs: `specs/F3.md` (paste more as needed)
- Governance: `governance/00-COMMAND/` · `governance/10-CANON/` · `governance/90-ARCHIVE/`

**Frozen rulings (governance/10-CANON/DECISIONS/) — 20 files:**
- PR-1..6 (game contract rules) — RULED 2026-09-06
- GTM-1 · GTM-2 · CP-0 · CREDIT-1 — RULED 2026-07-30; CREDIT-1 ratified 2026-10-20
- OPS-1 · OPS-2 · OPS-3 — RULED 2026-07-19 / 2026-08-10
- AUD-1 · BRAND-1..3 · CANON-2 · GTM-4 · STACK-1 — RULED 2026-10-20

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
261020 — F3 built: Next.js PWA shell, Supabase Auth, eligibility gate (geofence + QR + jurisdiction stub for C2); STACK-1 ruled. Repo consolidated: governance/ split, specs/ added, legacy removed. 20 rulings in canon.

261020 — Investor brief rulings landed: AUD-1, BRAND-1..3, CANON-2, GTM-4; GTM-3 parked as PROPOSED. CLAUDE.md protocol added at repo root.
