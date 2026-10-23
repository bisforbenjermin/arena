---
name: close
description: "Closes the arena ledger: one SESSION_LOG line, a check that every ruling made this session has its file, commit, push, 'closed'. Use when the founder types /close at the end of a session."
argument-hint: "[what moved | outcome]  (optional — derived from this session if omitted)"
disable-model-invocation: true
model: sonnet
effort: low
---

Close the arena ledger. The ritual is the `## close the arena ledger` section of `CLAUDE.md`; follow it exactly. It has to work when the founder is tired, so it takes ten seconds and asks at most one question.

Input: $ARGUMENTS — `what moved | outcome`, if given.

1. `pwd` must end in `code/arena`, or, in a cloud session, `git remote get-url origin` must name `bisforbenjermin/arena`. If not, stop.
2. If `$ARGUMENTS` is empty, derive one line from this session's work: what moved (files, PRs, rulings) and the outcome (where it stopped, or what was confusing). If this session did nothing ledger-worthy, say "no delta — nothing to close" and stop. Don't write a line for pure Q&A.
3. Add one line directly under the `---` in `governance/00-COMMAND/SESSION_LOG.md`: `<YYMMDD> | ARENA | <what moved> | <outcome>`. Newest first; change nothing else in the file.
4. If anything was ruled this session, its file in `governance/10-CANON/DECISIONS/` must already exist. If it doesn't, stop and say `Run /rule <ID> <your ruling> | Confidence: … first, then /close again.` Never write a ruling from the close.
5. If this session wrote proposals, specs or audit files that aren't committed yet, `git add` them along with `SESSION_LOG.md`. Add only files this session touched; never `git add -A`.
6. `git commit -m "close: <what moved>"`, then `git push`. If the push is rejected, `git pull --rebase --autostash` and push once more. If that fails, show the output and stop.
7. Say `closed` and nothing else.

Regenerate nothing at close. If the capsule has drifted, that is tomorrow's `/open`.
