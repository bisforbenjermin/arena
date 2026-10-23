# CONTEXT CAPSULE
Updated: 261023-1 (prev: 261020-5)
Keep this under one page. Rewrite at every significant direction change.

---

## NEXT ACTION
**G3** — unblocked by G2. Decide the move:
- `/design G3` to run the design loop (Fable proposes, cold-critic attacks, founder rules), or
- paste a G3 brief if one already exists in `specs/`

L1 (lore) is still yours to write — no agents can touch L2–L5 until it's done.

---

## ACTIVE FRONT
**Venture:** ARENA (The Arcade Realm)
**Phase:** Build — Game Factory in progress. G1 + G2 done; G3 next.

**Foundation status:**
- F1 ✅ GameModule contract + scoring normalizer
- F2 ✅ Database schema (9 migrations)
- F3 ✅ PWA shell + Supabase Auth + eligibility gate (Next.js, STACK-1)
- F4 ✅ Two reference games (precision-tap, pressure-hold)

**Game Factory status:**
- G1 ✅ Generation service (service.ts, budget.ts, queue.ts, brief-schema.ts, prompt/system.md+inject.ts, components/prng+canvas) — commit f88d036
- G2 ✅ Sandbox runner + 5 gates (forbidden-apis, compile, bundle-size, determinism, memory-leak); jsdom (Playwright incompatible on mac12) — commit 3dcac88
- G3 ⏭ next

**Repo structure:**
- Operable (CI): `contracts/` · `db/` · `games/` · `tests/` · `app/` — at root
- Specs: `specs/` — 26 files covering F, G, R, L, C layers (see `specs/00_INDEX.md`)
- Legal: `governance/40-LEGAL/` — C4_ADDENDUM_1_vault_arv_coin.md
- Governance: `governance/00-COMMAND/` · `governance/10-CANON/` · `governance/90-ARCHIVE/`

**Build crew (added 261022–261023, see CLAUDE.md):**
- `/design <ID>` · `/critique <ID>` · `/rule <ID> <words>` · `/build-next <ID>`
- Agents: spec-reconciler · builder · verifier · cold-critic
- `npm test` runs every test; CI runs on push + PR
- `.claude/hooks/guard-paths.mjs` blocks writes to `contracts/`, `governance/`, July specs outside the right session

**Frozen rulings (governance/10-CANON/DECISIONS/) — 20 files:**
- PR-1..6 (game contract rules) — RULED 2026-09-06
- GTM-1 · GTM-2 · CP-0 · CREDIT-1 — RULED 2026-07-30; CREDIT-1 ratified 2026-10-20
- OPS-1 · OPS-2 · OPS-3 — RULED 2026-07-19 / 2026-08-10
- AUD-1 · BRAND-1..3 · CANON-2 · GTM-4 · STACK-1 — RULED 2026-10-20

**Open items:**
- World name (Freehold / Arclight / Quarterlight / Elsewhere) — blocks BRAND-1, trademark search
- GTM-3 The First Cache — PROPOSED; needs max-weight session to supersede GTM-1
- OPS-4 Operating board + cold critique — PROPOSED, parked in `governance/00-COMMAND/PROPOSED/`

---

## PARKED
- ASS (All Service Solutions) — GTM DRAFT review pending; Gavin v5.2 sync confirmed sent
- FABLE / digital museum — return after ASS repo work
- NEXUS, CREA — no active session

---

## LAST SESSION
261023 — Orientation only; capsule drift confirmed and regenerated to 261023-1. No rulings. No code touched.

261022 — G2 built: sandbox runner + 5 gates; jsdom instead of Playwright. Pushed 3dcac88.

261022 — G1 built: generation service + prompt + components. Pushed f88d036.

261020 — Capsule regenerated (261020-5): fixed three drift items. No rulings.
