---
name: open
description: "Opens the arena ledger: reads the capsule, the log, the rulings and git, checks for drift, replies in three lines. Use when the founder types /open at the start of a session."
disable-model-invocation: true
model: sonnet
effort: low
---

Open the arena ledger. The ritual is the `## open the arena ledger` section of `CLAUDE.md`; follow it exactly. This command only adds the mechanics.

1. `pwd` must end in `code/arena`. If not, stop.
2. `git switch main` (or stay if already there), then `git pull --rebase`. If the pull fails, show the output and stop.
3. Read `governance/00-COMMAND/CONTEXT_CAPSULE.md`, the top 5 lines under the `---` of `governance/00-COMMAND/SESSION_LOG.md`, `ls governance/10-CANON/DECISIONS/`, `ls governance/00-COMMAND/PROPOSED/`, and `git log --oneline -5`.
4. Drift check. Drift is any of: the capsule's `Updated:` stamp is older than the newest log line; a ruling file exists that the capsule's rulings list doesn't name; the capsule's NEXT ACTION names work the log says is done; a PROPOSED file exists that the capsule's open items don't mention.
5. Reply in exactly three lines: where things stand · the NEXT ACTION · drift (or "none"). Nothing else. No summary of the project, no list of accomplishments.
6. If there is drift, add one line offering a regenerated capsule (one page at most). Write it only when the founder says yes: keep every section, change only what drifted, bump the stamp to `<YYMMDD>-<n>` with the previous stamp in parentheses, then commit on main `ops: regenerate capsule <stamp>` and push.

Never regenerate at close. Never rule. If the founder's first words after the three lines are a task, start it.
