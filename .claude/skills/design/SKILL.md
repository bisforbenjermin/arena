---
name: design
description: "Designs one hard ARENA call as a proposal for the founder to rule on. Fable at max effort writes it, the cold critic attacks it, and it is revised at most once. Never rules. Use when the founder types /design with an ID such as CONTRACT-2 or G1-H2."
argument-hint: "[ID, e.g. CONTRACT-2 or G1-H2]"
arguments: [id]
disable-model-invocation: true
model: fable
effort: max
hooks:
  PreToolUse:
    - matcher: "Edit|Write|MultiEdit|NotebookEdit"
      hooks:
        - type: command
          command: 'node "$CLAUDE_PROJECT_DIR/.claude/hooks/guard-paths.mjs" --design'
---

Design the hard call $id and hand it to the founder. You design. He rules. You never rule.

One hard call per session. If this conversation already holds work on anything else, stop and say: "Start a fresh session (or type /clear), then run /design $id."

From now on a guard limits this session's file writes, inside the repo, to `governance/00-COMMAND/PROPOSED/`, the rulings and the archive. Code, specs and `contracts/` change only in a build session, after a ruling.

## 0. Preflight

1. `pwd` must end in `code/arena`. If not, stop.
2. Run `git switch main`, then `git pull --rebase`, then `git status --porcelain`. The last must print nothing. If it prints anything, stop and show it.
3. Note `git rev-parse --short HEAD`. The proposal cites it.

## 1. Find the brief

Take the first of these that exists. If none does, stop and say what's missing.

- `$id` has the form `<spec>-H<n>` (for example `G1-H2`): the `### H<n>` section under `## Handoffs` in `specs/<spec>.md`.
- A `### $id` brief under `## Design briefs` in `governance/00-COMMAND/BUILD_RUNBOOK.md`.
- A draft at `governance/00-COMMAND/PROPOSED/$id-*.md`. Redesign it from the problem up, not from its answer.

If an earlier `/design $id` already left a proposal with a `.critique.md` beside it, stop and ask one question: revise that proposal, or start over?

## 2. Read before you decide

- The brief, and every file it names.
- Every ruling in `governance/10-CANON/DECISIONS/` the call touches. Read each Confidence line and Note: "draft" or "until confirmed" means unsettled.
- `contracts/`, and the code the call touches, read as a consumer.
- The July specs downstream of the call (`specs/`), so the design serves what comes next.
- Drafts in `governance/00-COMMAND/PROPOSED/` on the same question. They are proposed, never canon.

## 3. Design

- Settle by reading or running whatever can be settled that way: grep the code, or run a scratch script in a temp folder outside the repo. Cite file and line. Commit no scratch code.
- Lay out at least three genuinely different options, including the cheapest one that could work. Give each an undo cost in hours, or "rewrite".
- Recommend one, and say what evidence would change your mind.
- If the call touches a gate (Arena Coin counsel clearance, crowdfunding), prize economics (CP-0, GTM-2) or credits (CREDIT-1), don't design around it. Name it as a separate question for the founder.

## 4. Write the proposal

Write one file, `governance/00-COMMAND/PROPOSED/$id-<slug>.md`, in the format of `PROPOSED/PR-7-replayable-input.md`:

1. `# $id — <title>`
2. `Status: PROPOSED — not a ruling until the founder ratifies | Reversibility: REVERSIBLE | EXPENSIVE | LOCKED | Undo cost: <hours or "rewrite"> | Confidence: HIGH | MEDIUM | LOW`
3. `## The problem (checked against main at <sha>)`, with file:line evidence.
4. `## Ruling (proposed)`: numbered and exact. Give every file under `contracts/` in full, in code blocks. The build session copies ruled contract text verbatim and decides nothing, so a gap here becomes a guess there.
5. `## Options, with the undo cost of each`: the recommended one first, marked Recommended.
6. `## Why`
7. `## Build steps`: ordered, tests first, for a builder who decides nothing. Mark each step `main session` (anything under `contracts/`) or `builder`.
8. `## Done criteria`: numbered, each checkable by a command or a test.
9. `## Downstream`: the files, specs and rulings this changes.
10. `## What would change this`: the evidence that would flip the recommendation.
11. `## Note`: `Drafted by Claude Fable at max effort on <YYYY-MM-DD> from main at <sha>. Not a ruling. Supersedes drafts: <files, or none>.`

## 5. Cold critique

1. Use the **cold-critic** subagent. Pass exactly this and nothing else: `Critique governance/00-COMMAND/PROPOSED/<file>.` No summary, no reasoning, no hints. It must judge the file cold.
2. Save its reply verbatim to `governance/00-COMMAND/PROPOSED/$id-<slug>.critique.md`.
3. If the VERDICT is `NOT READY`, revise the proposal once. Fix each MUST-FIX item, or answer it in a `## Critique response` section that says why not. Then run the critic once more, the same way, and save that reply as `$id-<slug>.critique-2.md`. Never revise a second time without the founder.

## 6. Commit and hand off

1. `git add` the proposal and its critique files only. Commit: `propose: $id — <title>`. Push. If the push is rejected, run `git pull --rebase` and push once more. If that fails, stop and show the output.
2. End with the HANDOFF block from CLAUDE.md, pointing at the proposal, then these two lines and nothing after them:

```
Critique: <last VERDICT> · open MUST-FIX: <items, or none> · <critique file>
To rule: /rule $id <your ruling, in your words> | Confidence: HIGH | MEDIUM | LOW
```
