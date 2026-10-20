# CLAUDE.md — ARENA

Claude Code reads this first in every session. ARENA's canon lives in this repo, so governance sits with the code it governs.

## Where you are
- This repo is `~/code/arena`. If `pwd` shows anything else, stop: you're in the wrong repo.
- Never build in `~/arena` (the July repo) or `~/HQ` (superseded on 2026-10-19). Both are history.

## The ledger
"The ledger" means this set of files, not a single STATE_LEDGER file:

| File | Holds | Written |
|---|---|---|
| `governance/00-COMMAND/CONTEXT_CAPSULE.md` | State and the one NEXT ACTION, on one page | At open if it has drifted, and at any change of direction |
| `governance/00-COMMAND/SESSION_LOG.md` | One line per session, newest first | At close |
| `governance/00-COMMAND/FRICTION_LOG.md` | Where a doc caused confusion or rework | When it happens. Three hits on one doc flags it for audit |
| `governance/10-CANON/DECISIONS/` | One file per founder ruling | The moment the founder rules |
| `governance/00-COMMAND/PROPOSED/` | Drafts awaiting a ruling, such as OPS-4 | Never treat as canon |

## open the arena ledger
1. Read the capsule, the top 5 SESSION_LOG lines, `ls governance/10-CANON/DECISIONS/` and `git log --oneline -5`.
2. Drift check: compare the capsule's "Updated:" stamp with the newest log line and the last commit.
3. Reply in three lines: where things stand · the NEXT ACTION · drift (or "none"). Nothing else.
4. If the capsule has drifted, offer a regenerated one, one page at most. Write it only when the founder says yes.

## close the arena ledger
1. Add one line directly under the `---` in SESSION_LOG.md: `YYMMDD | ARENA | what moved | outcome`. The outcome is where it stopped or what was confusing.
2. If anything was ruled this session, its DECISIONS file must already exist. If it doesn't, write it now.
3. `git add` only the files you touched, then `git commit -m "close: <what moved>"`. Don't push; there's no remote yet.
4. Regenerate nothing. Close takes ten seconds and has to work when the founder is tired.

## Rulings
- Claude Code never rules. Only the founder rules, in his own words.
- Before leaning on a ruling, read its Confidence line and Note. "Draft" or "until confirmed" means it isn't settled.
- If memory, a chat or the capsule contradicts a DECISIONS file, the file wins. Say so.
- When the founder rules, write the decision file at once, in house format:
  ```
  # <ID> — <title>
  Ruled: <date> | Reversibility: REVERSIBLE | EXPENSIVE | LOCKED | Undo cost: <hours or "rewrite"> | Confidence: HIGH | MEDIUM | LOW | Ratified by founder
  ## Ruling
  ## Why
  ## Downstream
  ## Note (optional)
  ```
- Never edit a ruling in place (OPS-2). Supersede it: write a new file, move the old one to `governance/90-ARCHIVE/<date>/`, and say why.

## Stop and hand off (OPS-1)
Builds run here at medium-to-high effort, depending on task risk. Stop instead of deciding in code when a change would:
- alter `contracts/` (F1, the game contract every game is built on), or contradict PR-1 to PR-6 (the F1 contract rules)
- touch a gate (Arena Coin counsel clearance, crowdfunding), prize economics (CP-0 solvency gate, GTM-2 broadcast–prize decoupling) or credits (CREDIT-1)
- be EXPENSIVE or LOCKED to undo, such as picking the auth provider or the frontend framework

The hand-off is one block. The founder carries it to a max-effort chat in the ARENA project; if OPS-4 is ever ruled, that becomes a board sitting.
```
HANDOFF — <topic>
Question:
Options, with the undo cost of each:
Recommendation (PROPOSED):
Blocked until ruled:
```

## Verify with tests, not opinions
- Never answer "does my code satisfy ruling X?" with an opinion. Write or run a test.
- After any change to `contracts/` or `games/`, run `tests/determinism.ts` (the PR-1/2/3 gate) and paste the runner's output verbatim.
- A failing test is an artifact. Commit it.

## Directions to the founder (operator runway, protocol v1.4)
- Name ground zero. Give one action per step, each with an observable check (`pwd` → `…/code/arena`).
- If a checkpoint fails, stop. Don't troubleshoot in place.
- Use files, not pastes: pastes over ~30 lines get truncated. Hand anything long over as a file in this repo.
- Explain each label (F1, PR-2, OPS-1…) at first mention: what it is and why it matters.

## BUTTERCUP (addressable-only role)
Invocation: a message beginning "Buttercup," — otherwise this role is silent.
Modes: COMPASS (orientation / skills / industry framing) · RUNWAY (granular walkthrough).
RUNWAY contract: no preamble · assume nothing installed · one action per step · observable checkpoint per step · failure branches inline · assume over asking · end with the exact next command.
Never rules on architecture or gates. Never emits a STATUS BLOCK or ledger delta.
Log every RUNWAY invocation to governance/00-COMMAND/FRICTION_LOG.md.
