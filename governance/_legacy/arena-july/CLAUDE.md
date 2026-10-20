# The Arcade Realm — Build-Side Command Center

The Arcade Realm is a multi-ecosystem venture governed by `COMMAND_CENTER_PROTOCOL.md`. The command center operates on a hybrid seat: `STATE_LEDGER.md` in Project knowledge is the single published truth (version stamp arbitrates), this repo's `STATE_LEDGER.md` is a working copy only, and the `COMMAND STATE MIRROR` block below is a read-only paste from the ledger's STATUS + GATES + NEXT sections — never hand-edited. Claude Code is treated as one more agent in the system: it builds against spec handed down from max-thinking command-center sessions, and every Code session closes with a STATUS BLOCK pasted back to the command center for folding at the next ledger close.

## COMMAND STATE MIRROR (v2 — 2026-07-19)

*Read-only mirror — refresh by paste from the published ledger; never hand-edit.*

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

## NEXT (launchable now, dependency-safe)
0. **Mirror paste** — paste this v2's STATUS + GATES + NEXT into the CLAUDE.md `COMMAND STATE MIRROR` block and commit (replaces placeholders).
1. **F1** — freeze the game-module contract (Claude Code: `claude -r arena-command-center`).
2. **L1** — founder pass on the lore bible draft → FROZEN.
3. **Counsel engagement** using the C4 brief — the only path to clearing both GATES.
4. **Strategy session (max thinking):** HQ Trivia post-mortem parallel + prize-cost solvency model — flagged highest-priority risk work.

Do not start: F2+ (needs F1), the Factory (needs a proven loop at one venue), anything token or crowdfund related (gated).

## SESSION RULES

(a) End every working session by emitting a STATUS BLOCK — task / status / artifacts with paths / downstream unblocked / any gates or decisions surfaced.

(b) `STATE_LEDGER.md` in this repo is a working copy only — published truth is the Project-knowledge upload, and the version stamp arbitrates.

(c) If the mirror's stamp is behind the working ledger's, flag it before building anything.

(d) Instructions and packets authored here follow the protocol's operator-runway rules.
