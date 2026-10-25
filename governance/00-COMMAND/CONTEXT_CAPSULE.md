# CONTEXT CAPSULE
Updated: 261024-1 (prev: 261023-1)
Keep this under one page. Rewrite at every significant direction change.

---

## NEXT ACTION
Two things gate G3 — pick one:
- **Rule FORMAT-1 v2** (`governance/00-COMMAND/PROPOSED/FORMAT-1-v2.md`, commit 0e4bbf4) — thin v2 after cold-critic killed v1 with 6 KILLs. `/rule FORMAT-1 <words>`.
- **Resolve bow-hunt stakes HANDOFF** (3a7a135) — unblocks GAME-01 build.

G3 remains next in factory sequence but is downstream of both. L1 (lore) still yours — blocks L2–L5.

---

## ACTIVE FRONT
**Venture:** ARENA (The Arcade Realm)
**Phase:** Build — Game Factory in progress. G1 + G2 done; G3 gated on FORMAT-1 + stakes.

**Foundation status:**
- F1 ✅ GameModule contract + scoring normalizer
- F2 ✅ Database schema (9 migrations)
- F3 ✅ PWA shell + Supabase Auth + eligibility gate (Next.js, STACK-1)
- F4 ✅ Two reference games (precision-tap, pressure-hold); precision-tap view polished 261023 (446b174, PR-3 safe)

**Game Factory status:**
- G1 ✅ Generation service — commit f88d036
- G2 ✅ Sandbox runner + 5 gates; jsdom (Playwright incompatible on mac12) — commit 3dcac88
- G3 ⏭ next, gated

**In flight (261023):**
- FORMAT-1 — high-score rounds standardized. v1 proposed 4f7de06, cold-critic killed w/ 6 KILLs + 3 FIXes (77024fd), thin v2 rewrite 0e4bbf4. **Awaits founder ruling.**
- GAME-01 bow hunt — spec saved 4bd0fb9; HANDOFF for stakes written 3a7a135. **Build blocked.**

**Repo structure:**
- Operable (CI): `contracts/` · `db/` · `games/` · `tests/` · `app/`
- Specs: `specs/` — 26 files (`specs/00_INDEX.md`)
- Legal: `governance/40-LEGAL/` — C4_ADDENDUM_1_vault_arv_coin.md
- Governance: `governance/00-COMMAND/` · `governance/10-CANON/` · `governance/90-ARCHIVE/`

**Build crew (261022–261023, see CLAUDE.md):**
- `/design <ID>` · `/critique <ID>` · `/rule <ID> <words>` · `/build-next <ID>`
- Agents: spec-reconciler · builder · verifier · cold-critic
- `npm test` runs every test; CI runs on push + PR
- `.claude/hooks/guard-paths.mjs` blocks writes to `contracts/`, `governance/`, July specs outside the right session

**Frozen rulings (governance/10-CANON/DECISIONS/) — 20 files:**
- PR-1..6 — RULED 2026-09-06
- GTM-1 · GTM-2 · CP-0 · CREDIT-1 — RULED 2026-07-30; CREDIT-1 ratified 2026-10-20
- OPS-1 · OPS-2 · OPS-3 — RULED 2026-07-19 / 2026-08-10
- AUD-1 · BRAND-1..3 · CANON-2 · GTM-4 · STACK-1 — RULED 2026-10-20

**Open items:**
- FORMAT-1 v2 awaiting ruling (see above)
- Bow-hunt stakes HANDOFF awaiting ruling (see above)
- World name (Freehold / Arclight / Quarterlight / Elsewhere) — blocks BRAND-1, trademark search
- GTM-3 The First Cache — PROPOSED; needs max-weight session to supersede GTM-1
- OPS-4 Operating board + cold critique — PROPOSED, parked in `governance/00-COMMAND/PROPOSED/`

**Housekeeping (261024):**
- `~/Claude/ARENA/ops/` marked SUPERSEDED (README.md added); its stale v2 capsule renamed to `CONTEXT_CAPSULE.ARCHIVED-2026-08-29.md`. Lives outside this repo.

---

## PARKED
- ASS (All Service Solutions) — GTM DRAFT review pending; Gavin v5.2 sync confirmed sent
- FABLE / digital museum — return after ASS repo work
- NEXUS, CREA — no active session

---

## LAST SESSION
261024 — Orientation; capsule drift confirmed (stamp 261023-1 behind day-of work); regenerated to 261024-1. ops/ supersession noted. No rulings. No code touched.

261023 — Full day: capsule regen 79249f8; precision-tap view polish 446b174 (PR-3 safe); GAME-01 bow hunt spec 4bd0fb9; bow-hunt stakes HANDOFF 3a7a135; FORMAT-1 v1 proposed 4f7de06 → cold-critic 6 KILLs 77024fd → thin v2 0e4bbf4; close 67dd777.

261022 — G2 built (3dcac88). G1 built (f88d036).
