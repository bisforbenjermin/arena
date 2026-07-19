# STATE_LEDGER — The Arcade Realm
**LEDGER v2 — 2026-07-19**
Canonical name: **UNRESOLVED** ("The Arcade Realm" vision layer vs. "Arena" build layer) — see DECISIONS.

> **ESCALATION RULE:** work that changes GATES or DECISIONS → Fable, max thinking.
> Work that only moves STATUS or NEXT → Fable, low. Builds run in Claude Code.
> This file is truth. CLAUDE.md carries a read-only mirror — refresh it, never hand-edit it.

## PHASE
Pre-build. Spec layer complete (24 task docs + LAUNCH_KIT + cheatsheet). Command-center
repo node is live (commit edba193). Critical path start: freeze F1, finish L1.

## STATUS
| Chain | Task | Status | Note |
|---|---|---|---|
| — | Command-center repo node | COMPLETE | CLAUDE.md mirror + protocol/ledger working copies at repo root (edba193); mirror holds placeholders — needs first real paste from this v2 |
| F | F1 game-module contract | NOT STARTED | First domino — freeze before anything else |
| F | F2 database schema | NOT STARTED | Blocked by F1 |
| F | F3 PWA shell + auth/gating | NOT STARTED | Blocked by F1 |
| F | F4 reference games | NOT STARTED | Blocked by F1; React prototype exists as raw material, not contract-compliant |
| R | R1–R4 runtime | NOT STARTED | Blocked by F-spine |
| G | G1–G7 factory | NOT STARTED | Deliberately deferred until the loop is proven at one venue |
| L | L1 lore bible | DRAFT | "Drain vs. the Realm" first draft exists; human-authored — needs founder pass to FROZEN |
| L | L2–L5 | NOT STARTED | Blocked by L1 freeze |
| C | C1–C3 | NOT STARTED | — |
| C | C4 attorney brief | ASSEMBLED | Brief + ADDENDUM-1 exist; awaiting counsel engagement |

## GATES
| Gate | State | Rule |
|---|---|---|
| Arena Coin counsel clearance | OPEN | No earn/redeem mechanic ships until CLEARED |
| Crowdfunding consideration question | OPEN | No public campaign page until CLEARED |

## DECISIONS
**Pending:**
- Naming — "Arena" vs. "The Arcade Realm" across vision and build layers (Code session is `arena-command-center`).

**Ruled:**
- 2026-07-17 — Command center = protocol + this ledger, not a chat. Hybrid seat: Project ledger is truth; CLAUDE.md mirrors.
- 2026-07-17 — Model tiering: Fable low default; max on GATES/DECISIONS work (escalation rule above).
- 2026-07-19 — Protocol version is v1.1; the "v1.4" cited in the Code task was an erroneous citation, not a missing file. Repo working copies match truth.

## NEXT (launchable now, dependency-safe)
0. **Mirror paste** — paste this v2's STATUS + GATES + NEXT into the CLAUDE.md `COMMAND STATE MIRROR` block and commit (replaces placeholders).
1. **F1** — freeze the game-module contract (Claude Code: `claude -r arena-command-center`).
2. **L1** — founder pass on the lore bible draft → FROZEN.
3. **Counsel engagement** using the C4 brief — the only path to clearing both GATES.
4. **Strategy session (max thinking):** HQ Trivia post-mortem parallel + prize-cost solvency model — flagged highest-priority risk work.

Do not start: F2+ (needs F1), the Factory (needs a proven loop at one venue), anything token or crowdfund related (gated).

## DELTA LOG
- v2 (2026-07-19): Folded Command Center 2 STATUS BLOCK — repo node live (edba193); "v1.4 protocol" flag resolved as citation error; truncated Downloads ledger flag resolved (Project copy has full STATE sections); mirror-paste step added as NEXT 0.
- v1 (2026-07-17): Ledger established; protocol adopted; seeded from doc-kit state — correct any row that has drifted at first close.
