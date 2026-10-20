# RECON — run before building anything

Follow every step in order. Do not skip ahead. Do not fix, refactor, move, merge, or
delete anything. This pass reports and writes one test. Nothing else.

If a step says STOP, stop and report. Do not continue to the next step.

---

## STEP 0 — Where am I, and is there more than one copy?

Report first:

- `pwd`
- `git rev-parse --show-toplevel` — or "not a git repo"
- `git log --oneline -5` — or "no commits"
- top-level `ls`

Then search for stray or duplicate copies. From `$HOME`, to depth 6, pruning
`node_modules`, `Library`, `.Trash`, `.cache`, `.venv`, find:

- directories named `governance/10-CANON`, `governance/00-COMMAND`, `governance/20-SPEC`, `governance/30-BUILD`, `contracts`
- files named `CLAUDE.md`, `STATE_LEDGER.md`, `game-module.ts`, `CONTEXT_CAPSULE.md`
- every `.git` directory

For each distinct repo root found, report one row:

```
path | last commit date | commit count | has game-module.ts? | has 
governance/10-CANON/DECISIONS/?
```

Also report any `.git` found *inside* another repo — a nested repo is recorded by the 
outer
one as a pointer to a commit hash, not as files, so its contents are invisible to 
anyone who
clones. Name them; do not touch them.

Then state:

```
CANONICAL REPO: <path>
```

The canonical repo is the one with the most recent commits **and** the F1 contract
(`game-module.ts`). If two candidates both contain code, say **AMBIGUOUS**, list both 
with
their differences, and STOP.

If the current working directory is not the canonical repo, say so plainly and STOP. 
I will
relaunch from the right place.

---

## STEP 1 — Does the governance layer exist?

Report EXISTS or MISSING for each. Nothing else yet.

- `governance/10-CANON/DECISIONS/` — list every file inside
- `governance/00-COMMAND/CONTEXT_CAPSULE.md`
- `governance/00-COMMAND/SESSION_LOG.md`
- `CLAUDE.md`

Also report the layout: **flat** (`F1.md`, `F2.md` at root) or **numbered**
(`governance/00-COMMAND/`, `governance/10-CANON/`, `governance/20-SPEC/`).

If `governance/10-CANON/DECISIONS/` is MISSING or empty, say so and STOP. Without the rulings on 
disk
there is nothing to verify against, and I am not interested in you checking code 
against
rulings pasted into a prompt.

---

## STEP 2 — Write one determinism test

Create a **new** test file. Do not modify any existing file.

For each reference game in F4 (`precision-tap`, `pressure-hold`), the test must:

1. import **only** the `sim` half of the GameModule
2. run it under Node with **no DOM, no jsdom, no browser shim of any kind**
3. execute a fixed input log against a fixed seed
4. run that same seed and input log a second time
5. assert both runs produce a byte-identical score **and** an identical event log

Then grep the `sim` half of both F4 games and the F1 contract for:

```
Math.random   Date.now   performance.now   requestAnimationFrame   window   document
```

Run the test. Report the actual runner output verbatim — not your summary of it.

**This single test covers three rulings:**

- **PR-3** passes only if the sim imports and runs with no DOM at all
- **PR-1** passes only if the grep is clean and both runs match
- **PR-2** passes only if the timestep is fixed — a drifting one breaks 
reproducibility

---

## STEP 3 — Three cheap reads

No judgment, no recommendations. Just what the files say.

- **PR-4** — does the F1 contract carry semver, and do the F4 games declare both
  `contractVersion` and `gameVersion`?
- **PR-5** — does the normalizer return an explicit non-ranking state (not a magic 
value),
  and does `200` / `30` appear anywhere?
- **F2** — do the migrations distinguish an unverified *claim* from a verified score, 
and is
  the leaderboard path prevented from reading claims?

---

## STEP 4 — Output

Output exactly this block and nothing after it.

```
CANONICAL REPO: <path>
OTHER COPIES: <paths, or NONE>
NESTED REPOS: <paths, or NONE>
GOVERNANCE: present | partial | absent
MISSING: <paths>
LAYOUT: flat | numbered

TEST RESULT:
<paste the actual runner output>

PR-3: PASS | FAIL — <the error, if it failed>
PR-1: PASS | FAIL — <grep hits, if any>
PR-2: PASS | FAIL
PR-4: PASS | FAIL | PARTIAL
PR-5: PASS | FAIL | PARTIAL
F2 CLAIM/VERIFIED: PASS | FAIL | PARTIAL

VERDICT: SAFE TO BUILD F3 | CONTRACT MUST BE FIXED FIRST
```

---

## Then commit

Commit the test whether it passed or failed. A failing test is the artifact — it 
becomes the
regression gate for every game the Game Factory generates later.

```
test: determinism gate for F4 reference games (PR-1/2/3)
```

Append one line to `governance/00-COMMAND/SESSION_LOG.md` if that file exists:

```
<today> | RECON | stopped at: <verdict> | confused by: -
```

Do not push. Do not fix anything. Do not refactor. Report and stop.
