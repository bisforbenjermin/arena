---
name: sonnet-run
description: "Runs ARENA's mechanical build loop on Sonnet: reads the ledger, routes every queued item (Sonnet, Opus or Fable), builds only the mechanical ones as pull requests, and stops each other item with a routed HANDOFF block. Use when the founder types /sonnet-run, optionally with one ID or queue line."
argument-hint: "[optional: one ID or SONNET QUEUE line]"
disable-model-invocation: true
model: sonnet
effort: high
---

Run the Sonnet loop. Target: $ARGUMENTS (empty means the whole queue).

The routing test, the stop block and the limits live in `governance/00-COMMAND/SONNET_LOOP.md`. Read it now, sections 1, 2 and 4. If this file and that one disagree, that one wins; say so in the report.

You never rule. You count options; you never pick between them.

## 0. Preflight

1. **Right repo.** `git remote get-url origin` must name `bisforbenjermin/arena`. Locally, `pwd` also ends in `code/arena`. In a cloud session the path differs, and the remote is the check. Stop if it fails.
2. `git fetch origin main` then `git switch main` then `git pull --rebase`. If the session can't switch to main (some cloud sessions start on their own branch), run `git status --porcelain` and continue only if it prints nothing.
3. `git status --porcelain` prints nothing. If not, stop and show it.

## 1. Boot

Read `governance/00-COMMAND/CONTEXT_CAPSULE.md`, the top 5 lines of `SESSION_LOG.md`, `ls governance/10-CANON/DECISIONS/`, `ls governance/00-COMMAND/PROPOSED/` and `git log --oneline -5`.

Reply in three lines: where things stand · the NEXT ACTION · drift (or "none"). If the capsule has drifted, say what's wrong in one line and offer a corrected capsule. Write it only if the founder says yes.

## 2. Route

List the queue: the capsule's NEXT ACTION first, then its SONNET QUEUE, in order. If $ARGUMENTS names one item, the queue is that item.

For each item, read its source (the ruling, spec or file it names) and apply SONNET_LOOP.md section 1. Show one table:

| # | Item | Route | Why (the test it passed or failed) | Depends on |

Before building anything, write a stop block (section 2) for every item that routes up. One blocked item doesn't stop items that don't depend on it.

**FOUNDER:** if any route is a judgment call, ask once (AskUserQuestion, one question per doubtful item) whether to build it or escalate it. With no answer, escalate.

## 3. Build each SONNET item

At most three items per run. For each one:

1. `git switch -c sonnet/<slug> origin/main`.
2. **Tests first.** Write the test that encodes the source's Done criteria, or the behaviour the task names. Run it, and commit it failing if it fails (a failing test is an artifact).
3. **Change.** Small commits. Follow CLAUDE.md's rules for zero-IP, determinism, secrets and model costs.
4. **Check.** Run `npm test`. If the change is under `factory/` or `app/`, also run `npx tsc --noEmit -p <that folder>`. After any change to `games/`, paste the determinism gate's output verbatim. Two failed attempts at the same problem: stop the item with an `OPUS-RULE` stop block.
5. **Protected paths.** Run
   `git diff --name-only origin/main...HEAD | grep -E '^(contracts/|governance/(10-CANON|40-LEGAL|50-STRATEGY)/|governance/00-COMMAND/PROPOSED/|lore/|specs/([A-Z][0-9]+_|00_)[^/]*\.md$)'`
   It must print nothing. If it prints anything, undo those files (`git restore --source=origin/main -- <path>`), and stop the item with a `SONNET-NEVER` stop block naming what it needed.
6. **Escalation mid-build.** If any step trips the routing test, stop the item there: commit only the tests and the parts that are already mechanical, and write the stop block.
7. **Verify.** Use the **verifier** subagent. Pass only the item, the branch and the source path. Never pass your own account of the work. On FAIL, one fix round, then verify again. A second FAIL: stop the item with an `OPUS-RULE` stop block.
8. **Pull request.** `git push -u origin sonnet/<slug>`. Write the body to a temporary file outside the repo: the source, the test output, the VERIFY BLOCK. Then `gh pr create --base main --head sonnet/<slug> --title "sonnet: <item>" --body-file <file>`. Without `gh`, give the compare link: `https://github.com/bisforbenjermin/arena/compare/main...sonnet/<slug>?expand=1`. Never merge.

## 4. Report

1. The table from step 2, with a Result column: DONE (PR link) · HANDOFF (route) · BLOCKED (on what) · SKIPPED (why).
2. Every stop block in full, in the order the founder should carry them: anything that unblocks the NEXT ACTION first.
3. The one next thing for the founder, as a single command or action.
4. A SESSION_LOG line: `YYMMDD | ARENA | /sonnet-run: <what moved> | <PRs, or where it stopped>`. Commit it to the last branch you pushed, or, if you pushed none, show it for the founder to add at close.
