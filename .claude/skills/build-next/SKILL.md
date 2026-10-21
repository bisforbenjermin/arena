---
name: build-next
description: "Runs one ARENA spec through the build crew: reconcile it, get the founder's approval, build it, verify it, open a pull request. Use when the founder types /build-next with a spec ID such as G1."
argument-hint: "[spec ID, e.g. G1]"
arguments: [spec]
disable-model-invocation: true
---

Run spec $spec through the build crew. One spec per run. Stop at every step marked **FOUNDER** and wait for him.

## 0. Preflight (this session, no subagents)

1. `pwd` must end in `code/arena`. If not, stop.
2. Run `git switch main`, then `git pull --rebase`, then `git status --porcelain`. The last must print nothing. If it prints anything, stop and show it.
3. Read `governance/00-COMMAND/CONTEXT_CAPSULE.md`. If $spec isn't the NEXT ACTION, say so in one line and ask whether to continue.
4. Confirm the July source exists: `ls specs/ | grep "^$spec[_.]"`. If nothing matches, stop.
5. Create the branch: `git switch -c build/$spec` (or `git switch build/$spec` if it already exists).

## 1. Reconcile

Skip to step 2 if `specs/$spec.md` exists and its header says `Status: APPROVED`.

Otherwise use the **spec-reconciler** subagent on $spec. Show the founder its Conflicts table and every HANDOFF block, verbatim.

**FOUNDER:**
- DEFAULT items: he accepts or changes each one.
- RULING items: he rules in his own words. Write each ruling at once to `governance/10-CANON/DECISIONS/<ID>-<slug>.md` in the house format from CLAUDE.md. If he wants a critique first, use the **cold-critic** subagent on the HANDOFF block before he rules.

When every item is settled:
1. Edit the header of `specs/$spec.md` to `Status: APPROVED`, and apply his changes.
2. Move the July source to the archive: `git mv specs/<July file> governance/90-ARCHIVE/<YYYY-MM-DD>/specs/<July file>`, then point the `Source:` line at the new path. (OPS-2: superseded, never deleted.)
3. Commit: `spec: reconcile $spec`.

If he doesn't settle everything this session, commit `specs/$spec.md` as AWAITING FOUNDER, stop, and give him the one-line close for SESSION_LOG.

## 2. Build

Use the **builder** subagent on `specs/$spec.md`, on branch `build/$spec`.
- `BLOCKED` or any HANDOFF: show it verbatim and stop. It needs a ruling before the build can finish.
- `PARTIAL`: show the DEFERRED list, then continue to step 3.

## 3. Verify

Use the **verifier** subagent on $spec. Pass only the spec ID and the branch name. Don't summarize the build for it: it judges the code against the spec, not against the builder's account.

## 4. Pull request

Show the VERIFY BLOCK.
- `FAIL`: offer one round. Send the failing criteria back to the **builder**, then run the **verifier** again. Never loop more than once without the founder.

**FOUNDER** says go. Then:
1. `git push -u origin build/$spec`
2. Write the PR body to a temporary file outside the repo: the builder's STATUS BLOCK, then the VERIFY BLOCK.
3. `gh pr create --base main --head build/$spec --title "build: $spec" --body-file <that file>`
   If `gh` isn't installed, print the compare link instead: `https://github.com/bisforbenjermin/arena/compare/main...build/$spec?expand=1`
4. Don't merge. The founder merges.

## 5. Close

Offer this line for "close the arena ledger": `YYMMDD | ARENA | /build-next $spec | <PR link, or where it stopped>`
