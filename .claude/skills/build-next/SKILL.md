---
name: build-next
description: "Runs one ARENA build through the crew: reconcile a spec (or take a ratified ruling), wait for the founder's rulings, build, verify, open a pull request. Use when the founder types /build-next with an ID such as G1 or CONTRACT-2."
argument-hint: "[spec or ruling ID, e.g. G1 or CONTRACT-2]"
arguments: [spec]
disable-model-invocation: true
model: opus
effort: high
---

Run $spec through the build crew. One build per run. Stop at every step marked **FOUNDER** and wait for him.

## 0. Preflight (this session, no subagents)

1. `pwd` must end in `code/arena`. If not, stop.
2. Run `git switch main`, then `git pull --rebase`, then `git status --porcelain`. The last must print nothing. If it prints anything, stop and show it.
3. Read `governance/00-COMMAND/CONTEXT_CAPSULE.md`. If $spec isn't the NEXT ACTION, say so in one line and ask whether to continue.
4. Find the source. Stop if there's none.
   - `$spec` has the form `<spec>-H<n>`: stop and say "That's a handoff inside <spec>. Run /build-next <spec>."
   - **Ruling build**: `governance/10-CANON/DECISIONS/$spec-*.md`, whose header ends `Ratified by founder` and whose Ruling has `### Build steps` and `### Done criteria`. If its Confidence is LOW, or its Note says "draft" or "until confirmed", say so and ask whether to continue. Go to step 2.
   - **Spec build**: `specs/$spec.md`, or the July source (`ls specs/ | grep "^$spec[_.]"`). Go to step 1.

## 1. Reconcile (spec builds, on main)

Skip to step 2 if `specs/$spec.md` says `Status: APPROVED`.

Keep main clean between the founder's answers: commit each change to `specs/$spec.md` as soon as you make it, and push.

1. If `specs/$spec.md` doesn't exist, use the **spec-reconciler** subagent on $spec. Then commit it: `spec: reconcile $spec, awaiting founder`. If it already says `Status: AWAITING FOUNDER`, this is a return visit: don't reconcile again.
2. Show the founder the Conflicts table and the Handoffs section, verbatim. Beside each handoff, mark it RULED if `governance/10-CANON/DECISIONS/$spec-H<n>-*.md` exists, or OPEN.

**FOUNDER:**
- Each DEFAULT: he accepts or changes it. Write his answers into the spec, set that row's Kind to `DEFAULT, settled`, then commit `spec: settle defaults for $spec`.
- Each OPEN handoff, his choice:
  - **Rule now**: he types `/rule $spec-H<n> <his ruling> | Confidence: …`, after `/critique $spec-H<n>` if he wants a cold read first. Then he runs `/build-next $spec` again.
  - **Design first**: stop with `Next: fresh session → /model fable → /effort max → /design $spec-H<n>. Then /rule $spec-H<n>, then /build-next $spec again.`

When every DEFAULT is settled and every handoff is RULED:
1. Replace each `[BLOCKED: H<n>]` with what its ruling says, marked `[RULED: <decision file>]`. Add any Done criteria the ruling brings to `## Done criteria`. If a ruling leaves open something the spec needs, ask him; don't fill it in.
2. Set the header to `Status: APPROVED`.
3. Archive the July source (OPS-2: superseded, never deleted): `git mv specs/<July file> governance/90-ARCHIVE/<YYYY-MM-DD>/specs/<July file>`, then point the `Source:` line at the new path.
4. Commit on main: `spec: approve $spec`. Push.

If he doesn't settle everything this session, stop and give him the one-line close for SESSION_LOG.

## 2. Branch

`git switch -c build/$spec` (or `git switch build/$spec` if it exists). Everything from here lands on this branch, never on main.

## 3. Contract change (ruling builds whose Adopted text changes `contracts/`)

The guard keeps every subagent out of `contracts/`, so this session makes the change, from ruled text only.
1. Write each `contracts/` file exactly as the ruling's Adopted text gives it. Don't fix, improve or complete it. If the text is incomplete or contradicts itself, stop with a HANDOFF block.
2. Commit: `feat(contracts)!: contract <version> per $spec`.

## 4. Build

Use the **builder** subagent: `Build $spec from <source path> on branch build/$spec.`
- `BLOCKED` or any HANDOFF: show it verbatim and stop. It's a new hard call: the founder rules it or designs it, then runs `/build-next $spec` again.
- `PARTIAL`: show the DEFERRED list, then continue.

## 5. Verify

Use the **verifier** subagent. Pass only the ID, the branch and the source path. After a step 3 contract change, add `contracts/ changes are authorized by <decision file>.` Don't summarize the build: it judges the code against the source, not against the builder's account.

## 6. Pull request

Show the VERIFY BLOCK.
- `FAIL`: offer one round. Send the failing criteria back to the **builder**, then run the **verifier** again. Never loop more than once without the founder.

**FOUNDER** says go. Then:
1. `git push -u origin build/$spec`
2. Write the PR body to a temporary file outside the repo: the builder's STATUS BLOCK, then the VERIFY BLOCK.
3. `gh pr create --base main --head build/$spec --title "build: $spec" --body-file <that file>`
   If `gh` isn't installed, print the compare link instead: `https://github.com/bisforbenjermin/arena/compare/main...build/$spec?expand=1`
4. Don't merge. The founder merges.

## 7. Close

Offer this line for "close the arena ledger": `YYMMDD | ARENA | /build-next $spec | <PR link, or where it stopped>`
