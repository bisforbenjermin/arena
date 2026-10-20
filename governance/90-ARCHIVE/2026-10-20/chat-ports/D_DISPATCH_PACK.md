# D-CHAIN DISPATCH PACK — Opus Launch Prompts
Built under Protocol v1.4. Ground zero: establishment complete (CLAUDE.md exists in the repo, ledger v1+ seated in Project knowledge). If establishment isn't done, run CC_ESTABLISHMENT_PACKET first — nothing below launches before it.

## Routing
| Prompt | Task | Surface | Launch |
|---|---|---|---|
| D1 | F1 contract freeze | Claude Code (`claude -r arena-command-center`) | NOW |
| D2 | L1 freeze-prep checklist | Fresh chat in this Project | NOW |
| D3 | Counsel packet QA | Fresh chat in this Project | NOW |
| D4 | HQ Trivia + solvency evidence brief | Fresh chat in this Project, web search ON | NOW |
| D5 | F2 database schema | Claude Code | GATED — F1 must read FROZEN |
| D6 | F3 PWA shell + auth/gating | Claude Code | GATED — F1 must read FROZEN |
| D7 | F4 reference games | Claude Code | GATED — F1 must read FROZEN |

Rules of engagement: one prompt per session, D2–D4 may run in parallel while D1 builds, every session ends in a STATUS BLOCK, all blocks fold at one ledger close. If any agent's output feels wrong, don't argue with it in its chat — note it, close the chat, flag at close.

---

## D1 — FREEZE THE GAME-MODULE CONTRACT (Claude Code, now)
```
ROLE: Build executor under COMMAND_CENTER_PROTOCOL.md (v1.4). Before anything:
read CLAUDE.md, the protocol, and the STATE_LEDGER.md working copy. If the
mirror stamp trails the ledger stamp, stop and flag before building.

TASK: Execute F1_gamemodule_contract.md to completion. The contract is the
constitutional document of the entire build — every game, the runtime, and the
factory will implement against it.

METHOD:
1. Read F1 fully. Then read F2, F3, and F4 docs strictly as CONSUMERS of the
   contract — list every demand each will make of the interface.
2. Draft the contract per F1's done-criteria.
3. CONSUMER TEST: role-play implementing one reference game from F4 against
   your draft. Every point of friction is a contract defect — fix it in the
   contract, not the game. Repeat until frictionless.
4. Mark the artifact v1.0 FROZEN. After freeze, the contract only changes by
   ruling — a change request is DECISIONS-shaped and gets flagged, never made.

SCOPE LOCK: the contract only. No schema, no shell, no games.
QUALITY BAR: think hard on structural choices; list every assumption; run one
adversarial self-review pass against F1's done-criteria before emitting.
FINISH: commit ("freeze game-module contract v1.0"); emit STATUS BLOCK —
task / status / artifacts+paths / downstream unblocked / gates-decisions
surfaced / assumptions.
```

## D2 — L1 FREEZE-PREP CHECKLIST (chat agent, now)
```
ROLE: Adversarial editor under COMMAND_CENTER_PROTOCOL.md (v1.4) in this
Project's knowledge. Read it, then read L1_lore_bible.md (the task doc) and
L1_bible_DRAFT.md (the draft) in full.

TASK: The founder will make the human pass that takes the draft to FROZEN.
Your job is to make that pass take thirty minutes instead of three hours.
Produce ONE document — L1_FREEZE_CHECKLIST — containing:
1. Internal contradictions in the draft (canon vs. canon), each with location.
2. Every point where lore touches money, eligibility, prizes, or odds —
   flagged against the rule that RPG framing applies to containers and
   structure only, never to sentences describing money or eligibility.
3. Every naming-dependent passage (the Arena vs. Arcade Realm ruling is
   pending) — marked so the name decision cascades cleanly later.
4. Open questions ONLY the founder can rule — batched, yes/no where possible.
5. A freeze recommendation: what's safe to freeze now vs. what waits.

SCOPE LOCK: you propose, you never rule. No rewriting the draft.
QUALITY BAR: self-review the checklist for completeness against both docs
before emitting.
FINISH: output the checklist, then a STATUS BLOCK — task / status / artifact /
downstream unblocked (founder pass) / decisions surfaced / assumptions.
```

## D3 — COUNSEL PACKET QA (chat agent, now)
```
ROLE: Pre-counsel QA under COMMAND_CENTER_PROTOCOL.md (v1.4) in this Project's
knowledge. Read it, then C4_attorney_brief_assembler.md, the assembled brief
and ADDENDUM-1, and C1–C3 docs for context.

TASK: The brief goes to an attorney who has zero context. Stress-test it as a
cold read. Produce ONE document — COUNSEL_PACKET_QA — containing:
1. Gap list: every fact, definition, or mechanic the brief assumes but never
   states. The eligibility-vs-entitlement firewall and the two open gates
   (Arena Coin classification; crowdfunding consideration) must be answerable
   from the brief alone.
2. The ten questions counsel will most likely ask that the brief cannot yet
   answer — with pointers to where each answer should live.
3. Jargon audit: every lore/RPG term that leaked into legal-facing text.
4. A send/hold recommendation with the minimum fixes before sending.

SCOPE LOCK: you audit the brief's completeness — you NEVER alter, soften, or
extend a legal position. Anything position-shaped is DECISIONS territory:
flag it, don't touch it.
FINISH: output the QA doc, then a STATUS BLOCK.
```

## D4 — HQ TRIVIA + SOLVENCY EVIDENCE BRIEF (chat agent, web search on, now)
```
ROLE: Evidence gatherer under COMMAND_CENTER_PROTOCOL.md (v1.4) in this
Project's knowledge. Read it first. Understand your position: you produce the
evidence brief; the RULING happens elsewhere at max thinking. You make no
recommendations.

TASK: Produce ONE document — EVIDENCE_BRIEF_HQ_SOLVENCY — in two parts.
PART A — HQ Trivia post-mortem, facts only: audience and payout mechanics,
the cost structure that collapsed, the coupling between broadcast audience
and prize cost, timeline of decline, and any comparable prize-platform
failures. Every claim sourced.
PART B — Solvency model inputs: real-world cost lines a venue-anchored prize
platform carries (prize procurement at/below MSRP, fulfillment, venue ops,
insurance/bonding for prize promotions if found), with ranges and sources.
Structure it so a downstream session can build the solvency model directly
from your tables.

SCOPE LOCK: facts, sources, structures. Zero strategy, zero conclusions —
those are DECISIONS-shaped and reserved.
FINISH: output the brief, then a STATUS BLOCK naming the max-thinking session
as the downstream consumer.
```

## D5 — F2 DATABASE SCHEMA (Claude Code — GATED: F1 must read FROZEN)
```
INTERLOCK: Read the STATE_LEDGER.md working copy first. If the F1 row does not
read FROZEN, stop and emit a BLOCKED status block. Do not proceed.

ROLE: Build executor under COMMAND_CENTER_PROTOCOL.md (v1.4). Read CLAUDE.md,
the protocol, the ledger, and the frozen game-module contract.

TASK: Execute F2_database_schema.md to completion. The contract is law: the
schema serves it. Any point where the schema seems to need a contract change
is a defect to flag, never a fork to make.
QUALITY BAR: adversarial self-review against F2's done-criteria; walk one full
gameplay-to-leaderboard data path through the schema before emitting.
FINISH: commit; STATUS BLOCK with artifacts, downstream unblocked, assumptions.
```

## D6 — F3 PWA SHELL + AUTH/GATING (Claude Code — GATED: F1 must read FROZEN)
```
INTERLOCK: Read the STATE_LEDGER.md working copy first. If the F1 row does not
read FROZEN, stop and emit a BLOCKED status block. Do not proceed.

ROLE: Build executor under COMMAND_CENTER_PROTOCOL.md (v1.4). Read CLAUDE.md,
the protocol, the ledger, and the frozen contract.

TASK: Execute F3_pwa_shell_auth_gating.md to completion. Note the compliance
surface: eligibility gating is GATES-adjacent — implement exactly what the doc
specifies, and flag (never improvise) anything the doc leaves open about who
may play, win, or claim.
QUALITY BAR: adversarial self-review against F3's done-criteria before emitting.
FINISH: commit; STATUS BLOCK.
```

## D7 — F4 REFERENCE GAMES (Claude Code — GATED: F1 must read FROZEN)
```
INTERLOCK: Read the STATE_LEDGER.md working copy first. If the F1 row does not
read FROZEN, stop and emit a BLOCKED status block. Do not proceed.

ROLE: Build executor under COMMAND_CENTER_PROTOCOL.md (v1.4). Read CLAUDE.md,
the protocol, the ledger, and the frozen contract.

TASK: Execute F4_reference_games.md to completion. The existing React
prototype is raw material only — mine it for mechanics, but every game ships
contract-compliant from scratch. Reference games are the factory's future
gold standard: boring correctness beats cleverness everywhere.
QUALITY BAR: run each game against the contract as written; a game that needs
a contract exception is a defect in the game.
FINISH: commit; STATUS BLOCK.
```
