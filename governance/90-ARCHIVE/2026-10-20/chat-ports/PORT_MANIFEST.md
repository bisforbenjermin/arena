# PORT MANIFEST — chat files → Project + repo
**2026-10-20 · 21 files recovered verbatim from ARENA chats**

Every file below was written in a chat and never landed in Project knowledge. Contents are the last version written in the source chat (edits replayed), not reconstructions.

## Live — use these

| File | Source chat | Proposed repo path | Status |
|---|---|---|---|
| decisions/OPS-1-escalation-rule.md | BOARD (Oct 20) | 10-CANON/DECISIONS/ | Ruled 2026-07-19; ADR file was missing |
| decisions/OPS-2-supersession.md | BOARD (Oct 20) | 10-CANON/DECISIONS/ | Ruled 2026-08-10; ADR file was missing |
| decisions/OPS-3-chat-labeling.md | BOARD (Oct 20) | 10-CANON/DECISIONS/ | Ruled 2026-08-10; ADR file was missing |
| decisions/OPS-4-operating-board.md | BOARD (Oct 20) | 00-COMMAND/PROPOSED/ | **PROPOSED** — replaces BOARD1; not canon until you rule |
| decisions/GTM1_liberation_run.md | GTM chat (Jul 30) | 10-CANON/DECISIONS/ (skip if GTM-1 exists) | Ruled; FC-4 in CANON-2 proposes superseding its Phase 1 |
| strategy/ARENA_CANON_UPDATE_CANON-2.md | Master context redesign (Oct 20) | 10-CANON/ | Contains its own ledger delta (§8) + 8 agent prompts (§9) |
| strategy/ARENA_BOARD_REVIEW_2026-10-20.md | Master context redesign | 50-STRATEGY/ (or 90-ARCHIVE once CANON-2 folds) | Evidence behind CANON-2 |
| legal/C4_ADDENDUM_1_vault_arv_coin.md | Prize Distribution (Jul 12) | 40-LEGAL/ | The "missing" addendum the ledger asserted — found |
| engine/DELTA_PROTOCOL.md | Streamlining (Oct 20) | _ENGINE/ (or venture-os) | Venture-agnostic |
| command/BUTTERCUP.md | Streamlining (Aug 23) | 00-COMMAND/ | v2. "Standing read" section dates from Aug 23 (pre-F1 build) |
| command/INBOX_DELTA_repo-split.md | Streamlining (Oct 20) | 00-COMMAND/INBOX.md | Unfolded delta — fold it |
| employability/EMPLOYABILITY_REVIEW.md | Streamlining (Oct 20) | docs/ or outside repo | Prompts P1–P7 at the end |
| employability/OPERATORS_FIELD_MANUAL.html | Streamlining (Oct 20) | docs/ | Also live as the "Operator's Field Manual" artifact |
| investor/ARENA_FIRST_LOOK.html | Master context redesign | outside repo (private) | Ch. 1–2 of 14 drafted. LG-7: never post publicly |

## Archive — superseded, kept for history

| File | Superseded by |
|---|---|
| archive/BOARD1_board_seating.md | OPS-4 |
| archive/00_FAST_START.md | F1/F2/F4 built; PR-1–6 now in DECISIONS. Origin record of the pre-rulings |
| archive/CC_ESTABLISHMENT_PACKET.md | Repo established |
| archive/D_DISPATCH_PACK.md | D1–D7 largely executed |
| archive/VENTURE_PORT_KIT.md | Still references the retired ledger ritual |
| archive/ARENA_BUSINESS_PLAN.md | §01 positioning line retired by CANON-2 BR-5; naming re-ruled |
| archive/VAULT_AUDIT_2026-08-23.md | Executed by the repo split |

## Not ported (already live elsewhere)
- "ARENA" friend brief (Oct 19) and "Arena Look Directions" — published artifacts; IV-1 retired the friend brief.
- Loop-card cheatsheets (Jul 17) — couldn't locate the source chat from inside this Project.

---

## Claude Code fold prompt (run from ~/code/arena at /effort medium)

```
Unzip ~/Downloads/arena_port.zip into a scratch folder outside the repo. Read PORT_MANIFEST.md.

For each file in the "Live" table:
- If an equivalent file already exists at the proposed path, diff it. Keep the repo copy
  unless the port is newer; report every case either way. Never overwrite silently.
- Otherwise place it at the proposed path. OPS-4 goes in 00-COMMAND/PROPOSED/ only —
  it is not a ruling.
For each file in the "Archive" table: place it in 90-ARCHIVE/chat-ports-2026-10-20/.

Then append INBOX_DELTA_repo-split.md to 00-COMMAND/INBOX.md and run the INBOX fold:
"(proposed, not ruled)" items go to PENDING, never to an ADR.

Report: files placed, files skipped as duplicates, conflicts found.
Commit as "canon: port chat-only files into repo".
```
