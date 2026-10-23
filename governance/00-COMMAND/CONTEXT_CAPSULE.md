# CONTEXT CAPSULE
Updated: 261022-1 (prev: 261020-5)
Keep this under one page. Rewrite at every significant direction change.

---

## NEXT ACTION
With the build crew on main (PR #1; the `ops/sonnet-loop` PR carries it too), run `/design CONTRACT-2` (contract 2.0.0, the next F1) in a fresh Fable session. Brief: `BUILD_RUNBOOK.md` Phase 0. G3 waits for the ruling.
Why first: G1 and G2 were built on 261022, before the contract. Every game G1 makes now declares contract 1.0.0 and gets rewritten when 2.0.0 lands.

---

## SONNET QUEUE (mechanical; `/sonnet-run` builds these, routing in `SONNET_LOOP.md`)
1. CI: add `npx tsc --noEmit -p factory` (after `npm ci --prefix factory`). Factory only: `app/` has no lockfile, and how `contracts/` and `games/` are type-enforced is CONTRACT-2 item 6.
2. G2 gate tests: one fixture candidate each gate must reject, plus precision-tap, which must pass. Pin today's behaviour; change no gate.
3. G1 cost test: with the model call mocked, each call records tokens and cost, and a spent budget refuses the call (CLAUDE.md's model-cost rule).
Blocked until CONTRACT-2 is ruled: retarget G1's prompt (`factory/generate/prompt/system.md`) to 2.0.0.

## ESCALATIONS (carry in this order)
- **CONTRACT-2** · FABLE-DESIGN · the NEXT ACTION. Folds in the PR-7 and PR-8 drafts.
- **G2-CONTAIN** · FABLE-DESIGN · `factory/sandbox/checks.ts:75` imports each candidate straight into the Node process, so machine-written code runs with the same file, network and environment access as the factory, API key included. The runbook marked containment a likely `/design`; it was decided in code. Until ruled, treat G2 as a filter, not a sandbox.
- **G1-PD8** · FABLE-DESIGN (canon) · G1 invents freely. PD-8 (CANON-2) calls for a curated mechanic library with agent-made variations and a human taste check before promotion.
- **G1-MODEL** · OPUS-RULE · G1 hardcodes `claude-sonnet-4-6` and its default budget. The runbook said rule this now.

---

## ACTIVE FRONT
**Venture:** ARENA (The Arcade Realm) · **Phase:** Build. Foundation done; G-layer started out of order.

**Status:** F1–F4 ✅ · G1 built (261022, contract 1.0.0, no crew) · G2 built (261022, jsdom, no crew) · build crew, CI and the Sonnet loop (`/sonnet-run`, `SONNET_LOOP.md`) land with PR #1 and the `ops/sonnet-loop` PR.
**Layout:** operable code at root (`contracts/ db/ games/ tests/ app/ factory/`) · 26 specs in `specs/` (`00_INDEX.md`) · legal `governance/40-LEGAL/` · strategy `governance/50-STRATEGY/`.

**Rulings (`governance/10-CANON/DECISIONS/`), 20 files:** PR-1..6 · GTM-1 · GTM-2 · CP-0 · CREDIT-1 · OPS-1..3 · AUD-1 · BRAND-1..3 · CANON-2 · GTM-4 · STACK-1.

**Open canon and strategy (Fable or the ARENA Project chat, never Sonnet):**
- World name (Freehold / Arclight / Quarterlight / Elsewhere): blocks BRAND-1 and the trademark search.
- GTM-3 The First Cache: PROPOSED; supersedes GTM-1 if ruled.
- OPS-4 operating board: PROPOSED, parked.
- L1 lore bible: yours to write (`lore/L1_bible_DRAFT.md`); L2–L5 wait on it.
- R1 runtime: needs the C2 jurisdiction spec before its eligibility gate is real.

---

## PARKED
- ASS (All Service Solutions): GTM DRAFT review pending; Gavin v5.2 sync sent.
- FABLE digital museum: after ASS repo work. · NEXUS, CREA: no active session.
