# BOARD1 — Seating the operating board + March carry-over

- **Type:** Decision record
- **Date:** 2026-10-19
- **Tier:** Max thinking (it touches DECISIONS and WATCH)

**Sources:**
- "initial Advisor / Venture / Side Kick Conversation 3/25/2026": the Arena master prompt and the Bodie prompt
- "Sonnet vs Opus rate limits" (3/25/2026): the critique board, originally designed for Nexus
- Command-center protocol v1.4 rules

## Why this record exists

In March, Arena ran on three things:
- An advisory board
- A sidekick (Bodie)
- A session-summary handoff

Since July, the ledger has run ARENA.

Reviving the board without reconciling the two would create two sources of truth. This record does two jobs:
- It seats the board inside the protocol.
- It triages every March decision and open question into ledger vocabulary, or drops it.

## Board options

Scored 1–5 on board judgment.

| Option | Strategy | Error-catching | Solo-operable | Total |
|---|---|---|---|---|
| C-suite only | 5 | 2 | 4 | 11 |
| Critique board only | 2 | 5 | 4 | 11 |
| **C-suite + critique pass on consequential calls** | 5 | 5 | 3 | **13 ← chosen** |

**Cost of the chosen option:** heavier output on max-thinking calls.

**Containment:** the critique pass fires only where the escalation rule already demands max thinking. Routine work never sees it.

## Triage of March items

| March item | Verdict | Lands as |
|---|---|---|
| 7-seat board (CSO, CPO, CTO, CCO, CRO, CGO, GC) | Keep, rebound to current rulings | R1 |
| Session summary / one-paste handoff / master-prompt versions | Retire: a second continuity system means duplicate truth | R2 |
| Bodie sidekick | Fold into Buttercup (two sidekicks split attention) | R3, needs founder confirm |
| Robin Hood test ("does this reward the player?") | Keep, ordered after the solvency and decoupling tests | R4 |
| Game library not era-locked; retro is flavor only | Keep | R5 |
| 50/50 ad-revenue share with players | Pending: legal surface | P1 |
| IP strategy (own / license / hybrid) | Pending | P2 |
| Public site with comments, crowdsourcing, co-founder search | Pending; any funding ask is already held by the crowdfunding gate | P3 |
| Funding path | Pending, unless the ledger already has a row | P4 |
| Preference-data monetization | Watch | W1 |
| Grand prizes (cars, houses, vending machines) | Watch | W2 |
| Real-world GPS layer / foot traffic | Watch (opportunity) | W3 |
| Minimum viable sponsor pitch | Watch until the solvency gate (CP-0) is validated | W4 |
| MVP scope and timeline | Drop: superseded by the build chains | — |
| Tech stack | Drop: superseded by F1 and PR-1 to PR-6 | — |
| First game | Drop: superseded by the F4 reference games | — |
| Launch city | Drop: superseded by the Liberation Run go-to-market | — |
| AI Workforce Playbook departments | Drop: superseded by agent packets | — |

## Gate map

- **P1 (revenue share):**
  - Goes to counsel. Any cash or cash-like payout to players is promotions and skill-gaming exposure.
  - It must also fit the two-rail credits (Keys and Vault Points) without becoming a cash third rail.
- **P3 (public site):** any funding ask stays under the existing crowdfunding gate.
- **W1 (preference data):** when triggered, add data privacy to the counsel scope.
- **W2 (grand prizes):** must pass CP-0 and the decoupling test before any display or promotion.

## LEDGER DELTA — paste at next close

Close at max thinking.

```
LEDGER DELTA — BOARD1 (2026-10-19)
Close rule: skip any line that duplicates an existing row.

DECISIONS / Ruled
+ 2026-10-19 — Operating board seated: 7 seats + critique pass (Skeptic, Architect,
  Historian, Operator, Advocate → Judge) on consequential calls only. → ARENA_BOARD.md
+ 2026-10-19 — March continuity system retired (session summaries, one-paste handoff,
  master-prompt versions). The ledger is the only continuity.
+ 2026-10-19 — Bodie folded into Buttercup: next smallest action + tie it to a NEXT row.
  [FOUNDER CONFIRM AT CLOSE]
+ 2026-10-19 — Standing-test order: CP-0 → broadcast-prize decoupling → Robin Hood.
+ 2026-03-25 (carried in) — Game library not era-locked; retro is brand/UI flavor only.

DECISIONS / Pending
+ Player revenue share (March target: 50/50 of ad revenue). Needs counsel; must fit
  Keys / Vault Points without a cash third rail.
+ IP strategy for the game library: own / license / hybrid. Live when the G-chain unblocks.
+ Public build-in-public site (dev log + comments). Funding asks stay under the crowdfunding gate.
+ Funding path: bootstrap / raise / self-fund.

WATCH
+ Preference-data targeting. Trigger: any spec that stores per-player prize picks for
  ad targeting → escalate; add privacy to counsel scope.
+ Grand prizes (cars, houses, income assets). Trigger: any plan to display or promote
  one → CP-0 + decoupling test first.
+ Real-world GPS / sponsor foot traffic (opportunity). Trigger: a live event shows
  sponsor foot-traffic lift → max session.
+ Sponsor pitch. Trigger: CP-0 validated → promote "minimum viable sponsor pitch" to NEXT.

DELTA LOG
+ (next version): BOARD1 — board seated; March items triaged: 5 ruled, 4 pending,
  4 watch, 5 dropped as superseded. Pointer: BOARD1_board_seating.md
```
