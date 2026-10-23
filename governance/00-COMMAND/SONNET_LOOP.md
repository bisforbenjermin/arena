# SONNET LOOP — build mechanically, escalate the rest
Updated: 2026-10-22 | For: the founder, `/sonnet-run`, and the ARENA Project chat

Sonnet does the mechanical work and stops at the first call that needs judgment. Opus and Fable see only those calls, each as one HANDOFF block.

This file holds no project state. State lives in the ledger (CONTEXT_CAPSULE.md, SESSION_LOG.md, DECISIONS/), so the prompts below stay correct without edits. When the work changes, update the capsule, not this file.

---

## 1. Routing: the one test

Run this test on every task before starting it, and again whenever a step surprises you. If you're unsure between two tiers, take the higher one. Sonnet counts options; it never picks between them.

### SONNET: mechanical (build it)
All three must hold:
1. **The source is settled.** An APPROVED `specs/<ID>.md`, a ratified ruling with `### Build steps` and `### Done criteria`, or a task with no design content (tests, CI, type checks, docs that describe existing code, `provenance.json`, ledger open and close).
2. **It touches nothing on OPS-1's stop list** (CLAUDE.md): not `contracts/`, not PR-1 to PR-6 or any later contract rule, not a gate, prize economics or credits.
3. **A revert undoes it** in under an hour, and nothing else will be built on top of a choice it makes.

Examples: a ruling's build steps; tests encoding an existing ruling's Done criteria; CI and type-check fixes; retrofitting games or factory code to a contract version that's already ruled; READMEs; drift reports.

### OPUS: rule now (route `OPUS-RULE` or `OPUS-BUILD`)
Any of:
- Reconciling a July spec into `specs/<ID>.md`. Its conflicts need judgment, so the reconciler runs on Opus. → `OPUS-BUILD`: `/build-next <ID>`.
- A choice between options where a revert is cheap: a model name, a budget, a threshold, a weight. → `OPUS-RULE`: `/critique <ID>` if unsure, then `/rule`.
- The same failure after two attempts, a VERIFY FAIL after one fix round, or a test that contradicts a ruling. → `OPUS-RULE`.

### FABLE: design (route `FABLE-DESIGN`)
Either of:
- **All three** of the runbook's tests: EXPENSIVE or LOCKED to undo; two or more defensible options; it shapes more than one spec.
- **Canon or strategy, whatever its size**: `contracts/` (F1, the game contract), gates (Arena Coin counsel clearance, crowdfunding), prize economics (CP-0, GTM-2), credits (CREDIT-1), GTM, BRAND and the world name, lore canon (L1), anything in `governance/40-LEGAL/` or `governance/50-STRATEGY/`, the board (OPS-4), and security boundaries (what contains machine-written code).

Carry it to a fresh Claude Code session (`/model fable`, `/effort max`, `/design <ID>`), or to a max-effort chat in the ARENA Project. If Fable isn't available, use Opus at max; the runbook says how.

### Never written by Sonnet
`contracts/`, `governance/10-CANON/`, `governance/40-LEGAL/`, `governance/50-STRATEGY/`, `governance/00-COMMAND/PROPOSED/`, `lore/`, and the July specs (`specs/<letter><n>_*.md`, `specs/00_*.md`). If a task needs one of them, that is the escalation.

---

## 2. The stop block

CLAUDE.md's HANDOFF block plus four lines, so the founder knows where to carry it and how to come back.

```
HANDOFF — <ID>: <topic>
Route: SONNET-NEVER | OPUS-RULE | OPUS-BUILD | FABLE-DESIGN
Why this route: <the test it failed, in one line>
Question:
Options, with the undo cost of each:
Recommendation (PROPOSED): <for FABLE-DESIGN write "None: left to design", so the designer starts unanchored>
Blocked until ruled: <what waits, and what can go on without it>
Carry to: <exact command, or "ARENA Project chat, max effort">
Resume with: /sonnet-run   (chat: paste prompt 3B)
```

Use the next free ID: `<spec>-H<n>` for a hand-off inside a spec, otherwise a short name such as `G2-CONTAIN`.

---

## 3. Prompts

### 3A. Claude Code on the web (Sonnet, repo connected) — the main path

Open a session on `bisforbenjermin/arena`, set the model to Sonnet, and type:

```
/sonnet-run
```

To aim it at one item: `/sonnet-run <ID or capsule queue line>`. The skill (`.claude/skills/sonnet-run/SKILL.md`) runs the loop in section 4.

If skills don't load in your session, paste this instead:

```
Read CLAUDE.md, then governance/00-COMMAND/SONNET_LOOP.md, then follow .claude/skills/sonnet-run/SKILL.md as if I had typed /sonnet-run. Build only what section 1 of SONNET_LOOP.md calls mechanical. Stop each item at its first escalation with the stop block from section 2, then go on to the next independent item. Never merge. End with the run report.
```

### 3B. ARENA Project chat (Sonnet, no shell)

The Project mirrors GitHub `main`, so merge open pull requests first or the chat won't see them.

Prompt 1, to start (paste once per chat):

```
You are the mechanical builder for ARENA. Read, in this order, from the Project files: CLAUDE.md; governance/00-COMMAND/SONNET_LOOP.md; governance/00-COMMAND/CONTEXT_CAPSULE.md; the top 5 lines of governance/00-COMMAND/SESSION_LOG.md; the file list of governance/10-CANON/DECISIONS/.

Then reply in four lines, nothing else:
1. Where things stand.
2. The NEXT ACTION and its route (SONNET, OPUS-RULE, OPUS-BUILD or FABLE-DESIGN), using SONNET_LOOP.md section 1.
3. The capsule's SONNET QUEUE items you can do in this chat, by number.
4. Drift between the capsule, the log and the decision files, or "none".

Rules for this chat. You have no shell, so you can't run tests or commit:
- Deliver every changed file whole, as a downloadable file, never as a paste in the reply. Name its repo path.
- Mark every deliverable UNVERIFIED and give the exact command that verifies it (usually `npm test`).
- A DECISIONS file beats the capsule, memory or this chat. Say so when they disagree.
- You never rule. At the first call section 1 doesn't make mechanical, stop that item with the section 2 stop block.
```

Prompt 2, to work (repeat as needed):

```
Do queue item <n>. Follow SONNET_LOOP.md section 4 as far as a chat can: read the source, list the files you'll change, write tests first, then the change. Stop at the first escalation with a stop block. End with the files, the verify command, and a one-line SESSION_LOG entry.
```

Prompt 3, to resume after Opus or Fable has ruled:

```
The founder has ruled on <ID>. The ruling is governance/10-CANON/DECISIONS/<file> (merged to main). Re-read it, then the capsule. Say in one line what the ruling unblocks, re-run the routing test on each unblocked item, and continue with the first mechanical one.
```

Carrying the work back: download the files, then in a Claude Code session type `apply the files I upload to a branch sonnet/<slug>, run npm test, and open a pull request`. Or commit them yourself and push a branch. CI is the referee either way.

---

## 4. The loop (what /sonnet-run does)

1. **Boot.** Sync, read the ledger, check drift. Reply in three lines.
2. **Queue.** The capsule's NEXT ACTION, then its SONNET QUEUE, in order. Route each one (section 1).
3. **Escalations first, as blocks.** Write a stop block for each item that routes up, and keep going: one blocked item doesn't stop independent ones.
4. **Build each mechanical item** on its own branch `sonnet/<slug>`: tests first, then the change, then `npm test` and any type check that covers the files. Before pushing, check the diff for protected paths (section 1). Then the **verifier** subagent judges the branch against the source, never against Sonnet's own account.
5. **Push and open a pull request.** Never merge. At most three pull requests per run, so review stays possible.
6. **Report**: a table of items with DONE (PR link), HANDOFF (route), BLOCKED (on what) or SKIPPED (why). Then the stop blocks in full, then a SESSION_LOG line, committed to the last branch.

**Limits.** Two attempts per failure, then escalate. One verify-fix round, then escalate. No new dependency without an MIT, Apache-2.0 or CC0 licence. No secrets in files. Code that calls a model needs a budget cap and logs tokens and cost per call.

**Independence trade-off.** On this path Sonnet builds and the verifier is Sonnet too, so they share a model. Tests written from the source and CI are the independent check. For anything in the Opus or Fable lanes, use `/build-next`, which keeps the builder and verifier on different models.
