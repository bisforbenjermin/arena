---
name: critique
description: "Runs the cold critic on one ARENA proposal or HANDOFF and saves its verdict beside it. Use when the founder types /critique with an ID such as PR-7 or G1-H3."
argument-hint: "[ID, e.g. PR-7 or G1-H3]"
arguments: [id]
disable-model-invocation: true
---

Run a cold critique of $id. You relay. You don't critique, and you add no context: the critic must judge the text cold.

1. Find the target. If there's none, stop and say so.
   - A proposal: `governance/00-COMMAND/PROPOSED/$id-*.md`, not a `.critique` file.
   - A handoff: `$id` has the form `<spec>-H<n>`, and the target is the `### H<n>` section of `specs/<spec>.md`.
2. Use the **cold-critic** subagent. Pass exactly one line and nothing else:
   - for a proposal: `Critique governance/00-COMMAND/PROPOSED/<file>.`
   - for a handoff: `Critique handoff H<n> in specs/<spec>.md.`
3. Save its reply verbatim to `governance/00-COMMAND/PROPOSED/<stem>.critique.md`. `<stem>` is the proposal's file name without `.md`, or `$id` for a handoff. If that file exists, use `.critique-2.md`, then `.critique-3.md`.
4. On `main`: `git add` that file only, commit `critique: $id`, and push. If the push is rejected, run `git pull --rebase --autostash` and push once more. On any other branch, don't commit; say the file is saved but uncommitted.
5. Show the MUST-FIX and VERDICT lines verbatim, then this line:
   `To rule: /rule $id <your ruling, in your words> | Confidence: HIGH | MEDIUM | LOW`
