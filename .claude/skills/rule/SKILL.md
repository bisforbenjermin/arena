---
name: rule
description: "Records the founder's own ruling on one ARENA proposal or HANDOFF as a DECISIONS file in house format, then archives the drafts. Founder only: he types /rule with an ID and his ruling."
argument-hint: "[ID] [your ruling, in your words] | Confidence: HIGH|MEDIUM|LOW"
disable-model-invocation: true
---

The founder is ruling. His input: $ARGUMENTS

The first word is the ID. Everything after it is his ruling, in his words. You record it. You don't rule, and you don't soften, extend or improve his words.

## 0. Check the input

Ask everything that's missing in one round (AskUserQuestion), then go on:
- Nothing after the ID: ask for his ruling. Never take it from the proposal's recommendation.
- Words that pick no option and state no rule ("ok", "looks good"): ask which option he is adopting, with any changes.
- No confidence given: ask HIGH, MEDIUM or LOW.

## 1. Find what he is ruling on

Stop if there's none.
- A proposal: `governance/00-COMMAND/PROPOSED/<ID>-*.md`, not a `.critique` file.
- A handoff: an ID of the form `<spec>-H<n>` means the `### H<n>` section of `specs/<spec>.md`.

## 2. Write the decision file

Write `governance/10-CANON/DECISIONS/<ID>-<slug>.md` (the proposal's slug, or a short one from the handoff's topic) in the house format from CLAUDE.md:

```
# <ID> — <title>
Ruled: <YYYY-MM-DD> | Reversibility: <the proposal's, unless he changed it> | Undo cost: <the proposal's, unless he changed it> | Confidence: <his> | Ratified by founder
## Ruling
## Why
## Downstream
## Note
```

- **Ruling**: his words first, verbatim, as a quote. If he adopted an option, follow them with `### Adopted text`: that option's ruling text from the proposal, with every `contracts/` file in full, changed only where he said so. Then `### Build steps` and `### Done criteria` from the proposal, if it has them, on the same terms. List each change he made under `### Founder's changes`. If a change can't be applied without a choice he hasn't made, ask before writing.
- **Why**: his reasons, if he gave any, in his words. Then the proposal's Why, under the line `From the proposal:`.
- **Downstream**: from the proposal.
- **Note**: `Proposal: governance/90-ARCHIVE/<YYYY-MM-DD>/proposed/<file>. Critique: <file> (<last VERDICT>), or none. Recorded by Claude Code from the founder's words.`

A rejection is a ruling too. Write the file with his words as the Ruling and no Adopted text, so the question can't come back unannounced.

## 3. Supersede, never edit (OPS-2)

If his ruling changes an existing file in `governance/10-CANON/DECISIONS/`, don't edit that file. `git mv` it to `governance/90-ARCHIVE/<YYYY-MM-DD>/`, and add `Supersedes: <old file>, because <his reason>` to the new file's Note.

## 4. Archive the drafts

`git mv` the proposal (if there is one), its `.critique` files, and every draft its Note lists under "Supersedes drafts", to `governance/90-ARCHIVE/<YYYY-MM-DD>/proposed/`. A handoff itself stays in its spec, and `/build-next` writes the ruling into it.

## 5. Commit

On `main`: `git add` only the files you wrote or moved. Commit `rule: <ID> — <title>`, then push. If the push is rejected, run `git pull --rebase --autostash` and push once more. If that fails, stop and show the output.

On any other branch, don't commit; say so. A ruling belongs on main, where every session and the claude.ai Project can see it.

## 6. Reply

Two lines: the decision file's path, then what comes next. That's `/build-next <spec>` for a handoff, `/build-next <ID>` for a ruling with Build steps, or "nothing to build".
