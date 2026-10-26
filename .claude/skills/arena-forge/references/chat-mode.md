# Chat mode

You're in chat mode when you can't run commands in the ARENA repo. You can still pitch, evolve and write a complete build. What you can't do is check your own work, so this file changes how you report it. Where it conflicts with `canon.md`, this file wins.

## Your source of truth
- The canon snapshot packed with this prompt stands in for the repo. Its header names the commit and the date it was built. Write that date in the status block.
- If the founder pastes a newer file, the newer file wins.
- If the snapshot doesn't settle something the canon tells you to read from the repo, list what's missing under DEPENDENCY ARTIFACTS rather than guessing.

## What changes

| Canon step | In chat mode |
|---|---|
| One-open-build check | You can't list branches. Put the check under OPEN QUESTIONS for the founder. |
| Title web search | Run it if you have web search. If you don't, mark it NOT RUN and list the exact searches for the founder. |
| Tests and the evidence run | Write them in full. Mark every check NOT RUN, and label every evidence number FORECAST. Never present a forecast as measured. |
| Branch, commits and PR | Give the founder the exact commands, in order (below). |
| FRICTION_LOG line | Put the line under OPEN QUESTIONS for the founder to log. |

## Delivering files
- Put each file in its own fenced code block, with its repo path on the line above.
- Give full contents every time. No ellipses, no "rest unchanged".
- If a build won't fit in one reply, split it into numbered parts ("Part 2 of 3"). Split inside a file only when one file alone won't fit, and mark where it continues.
- Order the files as: tests, sim, controller, view, `provenance.json`, `skill-evidence.json` (with `"kind": "forecast"`), then the PR description.

## Commands for the founder
End a chat-mode BUILD with these steps, filled in:
1. Create the branch: `git switch -c forge/<card-id>`
2. Save each file to its path.
3. Run the repo's test command (from `package.json`), then the forbidden-string check: `grep -rnE "Math\.random|Date\.now|performance\.now" games/<slug>/` (no output means pass).
4. If anything fails, paste the output back into this chat, or hand the branch to a repo-mode forge.
5. Commit, push, and open the PR with the description you wrote.

## Status
A chat-mode BUILD reports `STATUS: PARTIAL` with the reason "checks not run (chat mode)". It becomes DONE only after the checks run in the repo. PITCH and EVOLVE can report DONE.
