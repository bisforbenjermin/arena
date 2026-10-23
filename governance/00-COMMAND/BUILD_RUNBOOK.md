# BUILD RUNBOOK — from build crew to game factory
Updated: 2026-10-22 | For: the founder, and `/design`, which reads the briefs at the end

Each step is one action and one check. If a check fails, stop; don't troubleshoot in place. Anything long goes in a file, never a paste.

## The loop

Every hard call goes round the same loop, and nothing is built until it has been ruled.

1. **Design**: `/design <ID>`. Fable at max effort, in a fresh session, writes a proposal to `governance/00-COMMAND/PROPOSED/`.
2. **Critique**: automatic inside `/design`. The cold-critic agent (Opus, max effort, its own context) attacks the proposal and returns KILL / FIX / NOTE. `/design` revises once at most. `/critique <ID>` runs the critic on its own.
3. **Rule**: `/rule <ID> <your words> | Confidence: HIGH, MEDIUM or LOW`. Only you can run it; Claude can't invoke it. It writes `governance/10-CANON/DECISIONS/<ID>-<slug>.md` in house format and archives the drafts.
4. **Build**: `/build-next <ID>`. Opus at high effort, in a fresh session. Inside it: spec-reconciler (Opus) → your rulings → builder (Opus) → verifier (Sonnet) → your go → a pull request. It never merges.

**Why these models**
- Fable designs. A wrong contract or pipeline shape costs a rewrite once games exist, so the strongest reasoning goes where mistakes cost most.
- The critic is Opus, a different model from the designer, so they don't share blind spots. Its fresh context never sees the designer's reasoning.
- Opus builds, because the work is long and must follow a ruling to the letter. Sonnet verifies: a different model from the builder, judging the code only against the written Done criteria.
- One fresh session per hard call. An earlier topic still in context bends the next design.

**What earns Fable.** Fable at max is the most expensive setting, so it gets only questions where all three hold: the call is EXPENSIVE or LOCKED to undo; two or more options are defensible; it shapes more than one spec. Rule everything else straight away, with `/critique` first if you're unsure. Most handoffs are rule-now. The reconciler proposes a route for each, and you pick. Expect CONTRACT-2 plus four or five calls across G1–G4.

**Switching models.** `/design` and `/build-next` set their own model and effort for the turn you run them in. Set the session to match first, so your follow-up questions stay on the same model: `/model fable` then `/effort max` for design, `/model opus` then `/effort high` for builds. From a terminal, `claude --model fable --effort max` (or `--model opus --effort high`) opens a fresh session already set.

## Routine commands (Sonnet tier, except where the audit tier says otherwise)

The loop above is for hard calls. These five are for everything that isn't: the ledger rituals and the mechanical checks that keep the canon legible. None of them rules; none of them touches `contracts/`.

| Command | Does | Model |
|---|---|---|
| `/open` | The open ritual from CLAUDE.md: capsule, log, rulings, git, drift check, three lines. Offers a regenerated capsule if there is drift; writes it only on your yes. | Sonnet, low |
| `/close [what moved \| outcome]` | The close ritual: one SESSION_LOG line, a check that every ruling made this session has its file, commit, push, "closed". Derives the line from the session if you give none. | Sonnet, low |
| `/index` | Regenerates `governance/10-CANON/DECISIONS/INDEX.md`: every ruling, proposal and superseded file as a pointer table. Run it after any ruling lands. | Sonnet, low |
| `/land` | Lands files you dropped into `_incoming/` where a `MANIFEST.md` says, stamps proposals PROPOSED, commits once. Refuses rulings (`/rule`) and contracts (`/build-next`). | Sonnet, low |
| `/audit <tier>` | Runs one tier of `AUDIT_PROMPTS.md` (A0–A5, S2 ruling headers, S3 spec debt) through the auditor agent whose model matches the tier, saves the report to `_audit/`, commits it. Refuses A1 without A0 and A2 without A1. | by tier: Sonnet / Opus / Fable |

**Ordering.** `/open` first; `/close` last. `/index` and `/audit S2` after every `/rule`. `/audit S3` before any `/build-next`. `/audit A4`, with a current `/audit A1`, before anything is called FROZEN (OPS-5, once ruled).

**Pending proposals these commands serve.** `OPS-5` (decision durability) sits in `PROPOSED/`; rule it with `/rule OPS-5 …` after `/critique OPS-5` if you want a cold read, then `/build-next OPS-5` applies its one CLAUDE.md line. `GTM-3` (First Cache) also sits there: `/critique GTM-3`, then rule it, or `/design GTM-3` to redesign it from the problem up.

## Ground zero (start of every session)

1. `pwd`. Check: it ends in `code/arena`.
2. `git switch main && git pull --rebase`. Check: "Already up to date." or a fast-forward.
3. `git status --porcelain`. Check: it prints nothing.

## Phase 0 — land the crew, rule contract 2.0.0

Contract 2.0.0 is the next version of F1, the game contract every game is built on. It carries PR-7 (one input path for live play, server replay and bots) and PR-8 (higher scores are better, and every game declares its score range), plus whatever else the design finds. Two games exist today, and every game made before 2.0.0 lands is a later rewrite, so it goes first.

**0.1** Merge PR #1 (this crew) on GitHub, then run `git pull --rebase`.
Check: `ls .claude/skills` shows `build-next  critique  design  rule`.

**0.2** Fresh session. Type `/model fable`, then `/effort max`, then `/design CONTRACT-2`.
Check: the reply ends with a HANDOFF block (the one-block question format from CLAUDE.md), a `Critique:` line and a `To rule:` line. `git log -1 --oneline` shows `propose: CONTRACT-2 …`.

**0.3** Read the proposal and its critique, in your editor or on GitHub.
Check: you can name the option you're adopting and any change you want. If you can't, carry the HANDOFF block to a max-effort chat in the ARENA project. The files are on GitHub, so that chat can read them.

**0.4** Type `/rule CONTRACT-2 <your ruling> | Confidence: <HIGH, MEDIUM or LOW>`.
Check: `ls governance/10-CANON/DECISIONS/ | grep CONTRACT-2` shows one file, and `ls governance/00-COMMAND/PROPOSED/` shows no CONTRACT-2, PR-7 or PR-8 files.

**0.5** Type `open the arena ledger`. When it offers a new capsule, check that its NEXT ACTION is Phase 1 of this runbook, then say yes.
Check: the capsule's NEXT ACTION names `/build-next CONTRACT-2`.

## Phase 1 — build contract 2.0.0

**1.1** Fresh session. Type `/model opus`, then `/effort high`, then `/build-next CONTRACT-2`. It writes `contracts/` from the ruling's own text, the builder moves both reference games to 2.0.0 and does the rest of the ruling's Build steps, and the verifier checks the result.
Check: a VERIFY BLOCK with `RESULT: PASS` and `protected paths AUTHORIZED`, then it waits for your go.

**1.2** Type `go`.
Check: a pull request link, or a compare link to open.

**1.3** Read the pull request. Merge when CI is green, then run `git pull --rebase`.
Check: `grep -c "2.0.0" contracts/game-module.ts` prints 1 or more.

## Phases 2–5 — the game factory, one stage at a time

Build G1, then G2, G3 and G4: each stage consumes the one before it. The same seven steps serve each one; replace `<G>` with the stage.

**a.** Fresh session, Opus at high effort: `/build-next <G>`.
Check: a Conflicts table and a Handoffs list (H1, H2 …), each handoff with a proposed route. It waits.

**b.** In that session, answer each DEFAULT (a reversible fix the reconciler proposes): accept it or change it.
Check: it writes your answers into `specs/<G>.md` and commits them.

**c.** For each handoff you'll rule now: `/rule <G>-H<n> <your ruling> | Confidence: …`. When they're all ruled, type `/build-next <G>` again.
Check: one `DECISIONS/<G>-H<n>-*.md` file per ruling.

**d.** For each handoff you'll design first: say so, and `/build-next` stops. Then, per handoff, a fresh session: `/model fable`, `/effort max`, `/design <G>-H<n>`, then `/rule <G>-H<n> …`.
Check: as in 0.2 and 0.4.

**e.** Fresh session, Opus at high effort: `/build-next <G>` again. It writes your rulings into the spec, approves it, builds and verifies.
Check: a VERIFY BLOCK with `RESULT: PASS`, waiting for your go.

**f.** Type `go`.
Check: a pull request link.

**g.** Read the pull request, merge when CI is green, then `close the arena ledger`.
Check: the new SESSION_LOG line names the pull request.

### What to expect at each checkpoint (read from the July specs; the reconciler finds the real list)

**G1 — generation agent** (an agent that writes candidate games)
- The candidate record that every later stage (G2 to G7) reads: what a generated bundle contains, and where jobs wait between stages. F2's database has `game_pool` and `game_provenance` tables but nothing for candidates. Likely `/design`.
- PD-8 against the July brief. Canon rule PD-8 (from CANON-2) calls for a curated mechanic library with agent-made variations, and a human taste check before anything is promoted. The July G1 spec has the agent invent freely. Who curates the library, and what may the agent make outside it? Likely `/design`.
- Which model generates, the daily budget and the cost log. Rule now: it's money and a setting.
- Themes from the active lore arc. A DEFAULT until the lore chain (L1–L5) exists.

**G2 — sandbox and compile gate** (runs each candidate locked down and rejects broken ones)
- What contains machine-written code: a browser page with the network cut, a container, or a separate machine. It's a security boundary. Likely `/design`.
- Replay in both Chromium and WebKit, if the CONTRACT-2 ruling leaves cross-engine maths to a test.
- The July lifecycle (`mount → start → destroy`) names a `start` the contract doesn't have. A DEFAULT.
- The size budget and how leaks are measured. Rule now.

**G3 — bot playtest** (synthetic players that show whether a game rewards skill)
- The skill-gap test: which statistic, how many seeded runs, what threshold. Its stats record becomes C3's evidence that games reward skill over chance (C3 is the compliance artifact for paid-entry contests), so changing it later strands stored evidence. Likely `/design`.
- Who writes the strong bot. The July spec lets the generating agent write the bot for its own game, so a game could mark its own homework. Part of the same design.
- Ask for one deliberately luck-only fixture game, so the Done criterion "a pure-luck game is rejected" has a real test.

**G4 — quality scoring** (objective metrics plus a model judge)
- Whether the judge may archive a game without your taste check (PD-8), and which model judges (not the one that generated it). Rule now, perhaps after `/critique`: weights and thresholds are cheap to re-run.
- Start the judge from prompt P6 in `docs/employability/EMPLOYABILITY_REVIEW.md`.

## When something goes wrong

- **A preflight check fails** (wrong folder, dirty tree): fix that one thing, then run the same command again.
- **A push is rejected twice**: two sessions wrote at once. Stop and run `git status`.
- **The critic still says NOT READY after the one revision**: your call. Rule with the risk named in your own words, reject it, or narrow the question and `/design` it again in a fresh session.
- **VERIFY FAIL after the one fix round**: rule on the gap or cut scope. Don't loop.
- **A build stops with a HANDOFF**: it's a new hard call. Rule it, or `/design` it, then run `/build-next` again.
- **A design session won't write code**: that's the guard working. It limits design sessions to proposals, rulings and the archive. Build in a fresh session.
- **Fable isn't in your model list**: design on Opus at max by changing `model: fable` to `model: opus` in `.claude/skills/design/SKILL.md`. Designer and critic then share a model, so the fresh context is their only independence.

## Design briefs (read by `/design`)

### CONTRACT-2 — contract 2.0.0

**Question.** What must contract 2.0.0 contain so that live play, server replay and bots run one code path, and the factory can generate games against it without a later rewrite?

**Start from** these drafts, which are not canon: `governance/00-COMMAND/PROPOSED/PR-7-replayable-input.md` and `governance/00-COMMAND/PROPOSED/PR-8-score-direction-and-range.md`. Adopt, change or replace them, and list them under "Supersedes drafts" in your Note.

**Settle each of these, with options and undo costs:**
1. **Input.** How player input reaches the sim, how it's stamped and ordered, and how bots and the server's replay feed it. Cover two events on one tick, input after the round ends, malformed payloads and input floods.
2. **Round end.** The contract gives the runtime no way to ask whether a round is over. Both games expose `isDone()` outside the contract, and each view fires `onScore` when it sees it (`games/precision-tap/index.ts:135` and `:176`, `games/pressure-hold/index.ts:119` and `:175`). Under PR-2 the contract owns the loop. Decide who ends a round and who reports the score.
3. **Score** (PR-8). Direction, range, and whether scores must be integers, so a client's claim and the server's replay compare exactly and percentiles stay clean.
4. **PRNG** (PR-1). PR-1 rules sfc32 seeded from a uint32, but not how one uint32 becomes sfc32's four 32-bit words of state. That expansion is as permanent as the PRNG itself: PR-1 says changing it voids every stored replay. Specify it exactly, with test vectors. `tests/determinism.ts` still uses a Mulberry32 stand-in.
5. **Cross-engine maths.** pressure-hold computes with `Math.sin` (`games/pressure-hold/index.ts:106`), whose precision JavaScript leaves to each engine, so a Node server and an iPhone may disagree in the last digit. Decide now (ban it, or ship deterministic helpers) or test first (replay in Chromium and WebKit in G2), with the undo cost of each.
6. **Enforcement.** PR-3 says the types must make a DOM-dependent sim impossible to write by accident, but nothing type-checks today. `npm test` runs tsx, which strips types without checking them, and the only tsconfig is `app/tsconfig.json`. Say how 2.0.0 is enforced: a type check in CI, a conformance test every game must pass, or both.
7. **Where code lives.** Only a main session may write `contracts/`, because the guard blocks agents. Give every `contracts/` file in full. Say what the builder writes elsewhere, such as the runtime's sfc32 factory.
8. **Migration** (PR-4: the contract carries semver, and each game declares contractVersion and gameVersion). Both reference games move to 2.0.0 in the same change, with the casts gone. Say whether either game's gameVersion must bump. F4's ANATOMY.md (a walkthrough of one game against the contract, which G1 uses as its exemplar) was never written; this build writes it against 2.0.0.

**Constraints.** PR-1 to PR-6 stand unless you name one to supersede and say why (OPS-2: superseded, never edited). Number new contract rules PR-7, PR-8 and onward, so the F1 series continues, and list CLAUDE.md's OPS-1 line ("PR-1 to PR-6") under Downstream.

**Out of scope.** The runtime (R1), the score validator (R2) and the factory stages (G1–G7). Design the contract they'll consume; don't design them.

### WORLD-NAME — the lore world's name

**Question.** Which of Freehold, Arclight, Quarterlight and Elsewhere becomes the world name in the ruled structure "[world name]: Arena" (BRAND-1), so that BRAND-1's blank is filled and the trademark search can start?

**Start from** `governance/10-CANON/DECISIONS/BRAND-1-name-structure.md`, `BRAND-2-look-neon-noir.md` and `BRAND-3-core-line.md`. If a conflict sweep exists in `_audit/` (a file whose name contains `world_name`), its findings come first and are not re-derived; if none exists, say so and score conflict risk from a web search of each name alone and as "<name> Arena".

**Settle, with options and undo costs:** conflict risk (games, studios, esports brands, live sites, marks the search surfaces); fit with the structure and the neon-noir look; ownability (distinct, spellable, searchable); lore headroom. L1, the lore bible, is the founder's and not yet frozen: don't invent lore; only check that a name doesn't foreclose it. Undo cost is REVERSIBLE today, EXPENSIVE once a mark is filed, LOCKED once marketed — say so in the Note.

**Out of scope.** The tagline (BRAND-3), the look (BRAND-2), and anything in L1.
