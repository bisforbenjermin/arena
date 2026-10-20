# INCORPORATE — land the recovered rulings, CREDIT-1's ratification and the Claude Code ledger protocol

Written 2026-10-20 for `~/code/arena`.
- Run every step in order.
- If anything says STOP, or any ✓ check fails: stop and report.
- Don't refactor, rename or "improve" anything.
- Don't push.

## STEP 0 — Ground zero
1. `pwd` → must end in `/code/arena`. Otherwise STOP: wrong folder.
2. `git status --porcelain` → the only allowed lines are `?? RECON.md` and `?? _incoming/`. Anything else: STOP and list it.
3. `ls _incoming` → exactly these 9 files:
   - `ARENA_BOARD.md`
   - `CLAUDE.md`
   - `CONTEXT_CAPSULE.md`
   - `CREDIT-1-two-rail.md`
   - `INCORPORATE.md`
   - `OPS-1-escalation-rule.md`
   - `OPS-2-supersession.md`
   - `OPS-3-chat-labeling.md`
   - `OPS-4-operating-board.md`

   Any missing: STOP.
4. `ls CLAUDE.md` → must fail with "No such file". If a CLAUDE.md exists: STOP. Never overwrite one.
5. `ls 10-CANON/DECISIONS/OPS-2-supersession.md 10-CANON/DECISIONS/OPS-3-chat-labeling.md` → both must fail. If either exists: STOP.
6. `grep -c TRUNCATED 10-CANON/DECISIONS/OPS-1-escalation-rule.md` → must print `2`. Anything else: STOP.
7. `git hash-object 00-COMMAND/CONTEXT_CAPSULE.md` → must print `b99eb9f2be9b5f8770c5a39cababfee073130310`. Anything else: STOP, because the capsule changed after this file was written.
8. `grep -c "Treat as strong draft until confirmed" 10-CANON/DECISIONS/CREDIT-1-two-rail.md` → must print `1`. Anything else: STOP.

## STEP 1 — Recovered rulings (OPS-1, OPS-2, OPS-3) and CREDIT-1's ratification
OPS-1, OPS-2 and OPS-3 were ruled in July and August and recovered from chat. The OPS-1 on disk is a truncated paste. The founder ratified CREDIT-1 on 2026-10-20. Per OPS-2, the old files get archived, not edited.
1. `mkdir -p 90-ARCHIVE/2026-10-20`
2. `git mv 10-CANON/DECISIONS/OPS-1-escalation-rule.md 90-ARCHIVE/2026-10-20/OPS-1-escalation-rule.TRUNCATED.md`
3. `git mv 10-CANON/DECISIONS/CREDIT-1-two-rail.md 90-ARCHIVE/2026-10-20/CREDIT-1-two-rail.DRAFT.md`
4. `mv _incoming/OPS-1-escalation-rule.md _incoming/OPS-2-supersession.md _incoming/OPS-3-chat-labeling.md _incoming/CREDIT-1-two-rail.md 10-CANON/DECISIONS/`

✓ `ls 10-CANON/DECISIONS | wc -l` → 13
✓ `grep -l TRUNCATED 10-CANON/DECISIONS/*` → no output
✓ `grep -c "Ratified by founder 2026-10-20" 10-CANON/DECISIONS/CREDIT-1-two-rail.md` → 1

## STEP 2 — OPS-4, parked as PROPOSED
On 2026-10-20 the founder chose to keep OPS-4 (the operating board plus cold critique) proposed. It is not canon. Never put it in `10-CANON/`.
1. `mkdir -p 00-COMMAND/PROPOSED`
2. `mv _incoming/ARENA_BOARD.md _incoming/OPS-4-operating-board.md 00-COMMAND/PROPOSED/`

✓ `sed -n 2p 00-COMMAND/PROPOSED/OPS-4-operating-board.md` → starts with `Status: PROPOSED`

## STEP 3 — Claude Code ledger protocol
1. `mv _incoming/CLAUDE.md CLAUDE.md`

✓ `head -1 CLAUDE.md` → `# CLAUDE.md — ARENA`

## STEP 4 — Capsule and log
1. `mv _incoming/CONTEXT_CAPSULE.md 00-COMMAND/CONTEXT_CAPSULE.md`

   ✓ `sed -n 2p 00-COMMAND/CONTEXT_CAPSULE.md` → `Updated: 261020-2 (prev: 261020-1)`
2. In `00-COMMAND/SESSION_LOG.md`, add this line directly under the `---` line. Change nothing else:
   ```
   261020 | ARENA | canon: OPS-1 completed, OPS-2 + OPS-3 landed, CREDIT-1 ratified; CLAUDE.md ledger protocol added; OPS-4 parked as PROPOSED | F3 still blocked on auth + frontend picks
   ```
   ✓ `sed -n 5p 00-COMMAND/SESSION_LOG.md` → prints exactly that line

## STEP 5 — Commit
1. `mv _incoming/INCORPORATE.md 90-ARCHIVE/2026-10-20/INCORPORATE.md && rmdir _incoming`
2. `git add CLAUDE.md 00-COMMAND 10-CANON 90-ARCHIVE`
3. `git commit -m "canon: land OPS-1..3, ratify CREDIT-1, add CLAUDE.md ledger protocol, park OPS-4 as proposed"`

Don't add RECON.md. Don't push.

## STEP 6 — Report
Output exactly this block and nothing after it:
```
DECISIONS: <count> — <filenames>
CREDIT-1: ratified | STOPPED: <why>
PROPOSED: <files in 00-COMMAND/PROPOSED/>
CLAUDE.md: created | STOPPED: <why>
CAPSULE: <its Updated: line> · <wc -l> lines
COMMIT: <short hash> <message>
LEFT UNTRACKED: <git status --porcelain, or "none">
```
