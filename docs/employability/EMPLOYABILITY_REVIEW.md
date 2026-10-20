# EMPLOYABILITY REVIEW — 2026-10-20

---

## Verdict

**You have senior-level instincts, junior-level artifacts, and no vocabulary for either.**

The reasoning in your repo is better than most working engineers produce. But a hiring
manager can't see reasoning — they see a GitHub profile, a commit history, a test suite, a
deployed URL. You have the first two privately and none of the rest.

The fastest path is not learning new skills. It is **naming what you already do** and
**making it visible**. Most of this review is that translation.

---

## PART 1 — What you've built, in industry vocabulary

You have independently reinvented a large amount of named professional practice. Not knowing
the names is costing you — it's the difference between "I made a folder of decisions" and "I
maintain ADRs."

| What you call it | What the industry calls it | Why it matters in a hire |
|---|---|---|
| `10-CANON/DECISIONS/` | **Architecture Decision Records (ADRs)** | A known pattern (Nygard, 2011): Status, Context, Decision, Consequences. Yours maps exactly — and adds a reversibility classification most teams lack. Say "ADR" in an interview and you're speaking the language. |
| Reversibility: REVERSIBLE / EXPENSIVE / LOCKED | **One-way vs two-way doors** | Amazon's framing for decision cost. Senior engineers are hired for knowing which is which. |
| OPS-1 escalation rule | **Cost-aware model routing** | Routing work by consequence to the cheapest sufficient model. This is a live, in-demand AI-infrastructure skill. |
| Firewall Doctrine | **Policy-as-code / compliance by design** | Constraints compiled into the system rather than written in a doc. Regulated-industry AI teams hire specifically for this. |
| STATUS BLOCK | **Structured / schema-constrained agent output** | Forcing agents to emit parseable results instead of prose. Core agent-engineering practice. |
| G2 sandbox compile gate | **CI gate** | Automated pass/fail before anything enters the pool. |
| G3 bot playtest harness | **Property-based testing** | Asserting a property (a real skill gradient exists) rather than specific outputs. |
| G4 LLM judge | **LLM-as-judge evaluation** | The dominant method for scoring non-deterministic output. One of the hottest skills in AI hiring right now. |
| G5 provenance + `provenance.json` | **Supply-chain security / SBOM** | License and origin tracking for generated artifacts. |
| G6 human spot-gate | **Human-in-the-loop review queue** | Reviewing only borderline cases instead of everything. |
| `_os/templates/venture_skeleton` | **Project scaffolding** (cookiecutter pattern) | Reusable templates that bootstrap new work. |
| RUNWAY / PAYLOAD | **Separation of procedure from task** | Runbook vs ticket. Standard ops discipline. |
| PR-3 sim/view split | **Headless core / server-authoritative architecture** | Pure logic separable from rendering so the server can re-run it. Classic distributed-systems design. |
| PR-1 seeded PRNG | **Deterministic replay** | Same inputs, same output, always. The foundation of reproducible debugging and anti-cheat. |
| PR-4 version-keyed distributions | **Schema versioning / data lineage** | Preventing silent corruption of historical data when logic changes. |

**Use these words.** Not because jargon impresses, but because it makes your work *findable*
by the people hiring for it. "I maintain ADRs with reversibility classification" lands. "I
have a folder of rulings" does not.

---

## PART 2 — What you did last night, professionally framed

A three-way monorepo decomposition with history preservation. The sequence you ran:

1. **Backup, with size verification.** Snapshot before destruction, and *check the snapshot*.
2. **Precondition check** (`git status --porcelain`) — which caught that F4's reference games
   were untracked. 549 lines of work that existed in exactly one place with no history. Found
   *before* the migration, not after.
3. **History-preserving extraction** (`git subtree split`) rather than copy-and-reinit.
4. **Non-zero assertions** on each extracted branch before acting on them.
5. **Cross-contamination assertions** — proving no client pricing leaked into the repo you
   plan to make public.
6. **Supersession markers** at the old locations instead of deletion.
7. **A structural fix for the recurring error** (the shell alias), not a resolution to be
   more careful.

That is a competent staged migration. The résumé line is: *"Decomposed a multi-project
monorepo into standalone repositories with full history preservation, verified by automated
cross-contamination assertions."*

---

## PART 3 — The gaps, ranked by hiring impact

**1. Nothing is public.** No GitHub remote. Your work is invisible. This is the single
largest gap and the cheapest to close.

**2. No tests.** The determinism test is specified and still unwritten. A repo with zero
tests reads as "has not worked on a team."

**3. No CI.** Tests that only run when you remember don't count. A green badge on a README is
disproportionately persuasive.

**4. Nothing deployed.** No URL. "I've never deployed anything" is a harder objection than
any gap in reasoning.

**5. No README.** Three new repos with no explanation of what they are.

**6. No LICENSE.** Public code without one is legally ambiguous — and you have a Zero-IP rule,
so this is an inconsistency a careful reviewer would notice.

---

## PART 4 — The protocols to internalize

These are the practices a tech role assumes you already have.

### Version control
- **Atomic commits.** One logical change each. Not "fixed stuff."
- **Message format:** `type: summary` under 50 chars, then a blank line, then *why*. Types:
  `feat`, `fix`, `docs`, `test`, `chore`, `refactor`. (This is Conventional Commits — yours
  already follow it.)
- **Never commit secrets.** `.env` in `.gitignore`, always. A leaked key in history is
  permanent without a rewrite.
- **Branch per unit of work**, merged via pull request — even solo. The PR is where review
  happens and where your reasoning becomes visible to others.

### Testing
- **Unit** (one function), **integration** (components together), **end-to-end** (full flow).
- **Regression test:** written when a bug is found, so it can't return. Your determinism test
  is this for the entire game pool.
- **Red-green:** watch a test fail before making it pass. A test that has never failed may be
  testing nothing.
- **CI:** tests run automatically on every push. Not optional on a team.

### Reproducibility
- **Pin dependencies.** Commit the lockfile.
- **Deterministic builds.** Same input, same output.
- **Infrastructure as code.** Environments described in files, not assembled by hand.

### Documentation
- **README answers:** what is this, how do I run it, how do I test it.
- **ADRs** capture *why*. Code shows what; ADRs show the reasoning that is otherwise lost.
- **Docstrings** on anything non-obvious.

### Operations
- **Rollback plan before every risky change.** You did this.
- **Staged rollout.** Small increments, each verified.
- **Observability.** Logs, metrics, traces. You cannot fix what you cannot see.

---

## PART 5 — Leveraging AI properly (your actual differentiator)

Most engineers use AI as autocomplete. The roles you want are for people who can build
*systems* with it. The distinction, and what you already do:

**Verification over attestation.** Never let an agent grade its own work. Ask for a test that
runs, not an opinion. You caught this last night when you asked me to reconsider a
reconciliation prompt that did exactly that — the fix was one determinism test instead of six
self-assessment questions.

**Provenance discipline.** Track what *you* decided versus what the AI proposed. PR-1 through
PR-6 sat for eight weeks looking frozen while never having been ruled. This is the central
unsolved problem in agent-assisted engineering, and you've encountered it firsthand.

**Context engineering.** Agents fail from bad context more than weak reasoning. Files over
pastes. `CLAUDE.md` for standing instructions. A one-page capsule for resumption. Scope locks
and explicit stop conditions.

**Cost-aware routing.** Model = capability. Effort = thoroughness. Raise the model when it had
full context and was still wrong; raise effort when it skipped files or stopped early. Route
by consequence.

**Gate placement.** "Generate freely at the edges, gate hard in the middle, reserve human
judgment for taste and canon" is a genuinely good agent-system design philosophy. It is also
precisely what an FDE interview wants to hear.

**Eval literacy.** Converting a quality *gate* into a scored, repeatable *eval* with a number
that moves. You are one step away and have not taken it. This is the most in-demand AI skill
right now.

---

## PART 6 — The 30-day plan

**Week 1 — make it exist publicly.** Determinism test written and running. GitHub Actions CI.
Push all three repos. READMEs and licenses.

**Week 2 — make it run.** F3 deployed. A URL you can send someone.

**Week 3 — make it measurable.** One G4 gate converted into a scored eval. A number that
moves when quality changes.

**Week 4 — make it legible.** A write-up of the Game Factory architecture. Not marketing —
an engineering post explaining the gate design and why each gate exists.

At the end of that you have: public code with real history, green CI, a live URL, an eval
harness, and a technical write-up. That is a complete portfolio for every role listed below.

**Target roles:** Forward Deployed Engineer · Applied AI Engineer · AI Solutions Architect ·
Agent Infrastructure Engineer · AI Evaluation Engineer · Solutions Engineer (AI platform) ·
Developer Experience · Technical Program Manager (AI)

---

## PART 7 — Prompts

Run these in Claude Code from `~/code/arena` unless noted. One at a time. Each is short enough
to paste without truncation.

### P1 — The verdict (do this first)

```
Write a new test file. Modify nothing existing.

For each game in games/: import ONLY the sim half of the GameModule, run it under Node with
no DOM and no jsdom, execute a fixed input log against a fixed seed, run the same seed and
log a second time, and assert both runs produce a byte-identical score and identical event log.

Then grep contracts/ and games/ for: Math.random Date.now performance.now
requestAnimationFrame window document

Run the test. Report the actual runner output verbatim, then:
PR-3: PASS|FAIL  PR-1: PASS|FAIL  PR-2: PASS|FAIL
VERDICT: SAFE TO BUILD F3 | CONTRACT MUST BE FIXED FIRST

Commit whether it passes or fails. A failing test is the artifact.
```

### P2 — Repo hygiene, all three repos

```
For each of ~/code/arena, ~/code/all-service-solution, ~/code/venture-os:

Add .gitignore: node_modules/ dist/ .DS_Store *.log .env .env.* .claude/settings.local.json
Add LICENSE: MIT, holder "Benjermin", year 2026.
Add README.md with: one-paragraph description, Structure, Getting Started, Testing.

For arena, the README must state that 10-CANON/DECISIONS/ holds Architecture Decision Records
and explain the reversibility classification.

Scan all three for committed secrets — API keys, tokens, .env files, anything key-shaped.
Report findings BEFORE committing. Then commit each repo separately.
```

### P3 — CI

```
Add .github/workflows/ci.yml to ~/code/arena.

Trigger on push and pull_request to main. Ubuntu latest, Node 20, npm ci, run the test suite.
Fail the build on any test failure. Add the status badge to the top of README.md.

If there is no package.json yet, create a minimal one with a test script wired to the
determinism test.
```

### P4 — Push

```
I have created empty GitHub repos. Add remotes and push:
  ~/code/arena -> <paste URL>
  ~/code/all-service-solution -> <paste URL>
  ~/code/venture-os -> <paste URL>

Before pushing, confirm for each: no secrets in history, no cross-contamination between
ventures, LICENSE and README present. Report that check, then push with -u origin main.

Make all-service-solution private. Arena and venture-os public.
```

### P5 — Restore the missing ADRs

```
10-CANON/DECISIONS/ is missing OPS-2 and OPS-3. Create them using the same format as the
existing files in that directory.

OPS-2 — Documents are superseded, never edited in place. Ruled 2026-08-10. REVERSIBLE, undo
cost minutes. A frozen document is never edited; the row's pointer flips FROZEN to SUPERSEDED,
the replacement is promoted, the stale copy retained. Supersession happens only through a
ledger row. Why: spec drift is the dangerous update class — a ruling silently invalidates a
frozen doc and nothing signals it. If supersession only happens through a row, silent
staleness is structurally impossible. Downstream: everything in 20-SPEC/, the 90-ARCHIVE policy.

OPS-3 — Chat labeling convention. Ruled 2026-08-10. REVERSIBLE, undo cost minutes. Disposable
chats take functional prefixes: "CLOSE v3 — F1 frozen", "MAX — solvency ruling", "AGENT D2",
"TROUBLESHOOT". Why: chats are disposable; the label is the only thing that makes one findable
later. Downstream: session hygiene, nothing structural.

Commit as "docs: restore OPS-2 and OPS-3 ADRs".
```

### P6 — The eval (the one that matters most for hiring)

```
Read 20-SPEC/G/G4_quality_scoring.md if present; otherwise work from the G4 concept: quality
scoring for generated games via auto-metrics plus an LLM judge.

Build a minimal eval harness in evals/:
- a small fixture set of game modules, some good and some deliberately bad
- a scoring function producing a number from 0 to 1
- a runner that scores every fixture and prints a table plus an aggregate
- a regression threshold that fails if the aggregate drops below a committed baseline

Keep it small and real. The point is a number that moves when quality changes.
Commit as "feat: G4 eval harness with regression baseline".
```

### P7 — CLAUDE.md for the new repo

```
Write CLAUDE.md at the root of ~/code/arena.

Include: that 10-CANON/DECISIONS/ holds ADRs and is authoritative, that no spec may be written
while an existing spec has no running artifact behind it, that partial implementation with the
remainder marked DEFERRED is a valid outcome, that rulings are written to
10-CANON/DECISIONS/ at the moment they are made and never batched, that 20-SPEC holds
instructions and 30-BUILD holds output, and that nothing is deleted — superseded files move to
90-ARCHIVE with a dated marker.

Add the Buttercup addressable-only role: invoked by a message beginning "Buttercup,", two
modes (COMPASS for orientation, RUNWAY for granular walkthroughs), RUNWAY contract is no
preamble, assume nothing installed, one action per step, an observable checkpoint per step,
failure branches inline, assume over asking, end with the exact next command.
```

---

## The honest close

The gap is not capability. It is that none of your capability is currently *visible*, and you
lack the vocabulary that makes it legible to the people hiring.

P1 through P4 take an evening. At the end of it you have public code, green CI, and a real
test. That moves you from "has a hobby project" to "has shipped," which is the only threshold
that actually matters.

P6 is the one that changes which roles are open to you.
