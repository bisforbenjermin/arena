# 00_FAST_START — Execution Plan v1
**Against LEDGER v1 (2026-07-17) · issued 2026-08-07**

Companion to `00_INDEX.md` and `LAUNCH_KIT.md`. This doc does not restate task specs — it supplies the Claude Code wrapper, the pre-rulings LAUNCH_KIT packets assume a human already made, and the parallel founder track.

---

## VERIFIED GROUND ZERO

| Fact | State | Verified |
|---|---|---|
| Claude Code repo | Exists, essentially empty | Founder, 2026-08-07 |
| `CLAUDE.md` mirror | Does not exist | Inferred from above |
| STATE_LEDGER | v1 accurate, no unfolded work | Founder, 2026-08-07 |
| Counsel | Not contacted | Founder, 2026-08-07 |
| Both gates | OPEN, zero progress | Ledger v1 |

**Consequence of row 4:** counsel is the longest-latency item in the project and its clock reads zero. Nothing in Ecosystems B–E can move until it starts.

**Consequence that matters more:** Ecosystem A carries no legal surface (`00_INDEX`, Legal Gates). The F→R spine to a live free-status loop at one venue is *not gated*. Build and gates run in parallel, not in sequence.

---

## THE TWO TRACKS

**Track A — Code.** Prompts 0 → 1 → 2 below. Runs today, ungated.
**Track B — Founder.** Counsel outreach, L1 freeze, entity + ToS, CP-0 solvency model. Runs in the counsel wait window.

Track A cannot unblock Track B. Track B cannot unblock Track A. Do not let either wait on the other.

---

## PRE-RULINGS — read before launching Prompt 1

F1 says *"freeze it carefully"* and *"changes after freeze require re-notifying all downstream agents."* The spec leaves six choices to the implementing engineer. All six are founder rulings. **PR-2, PR-3, and PR-4 are structurally expensive to reverse once games exist.**

Each carries a recommended default. Claude Code proceeds on the default unless you override in the prompt.

### PR-1 — PRNG algorithm *(reversible-ish; invalidates replays only)*
**Default: `sfc32`, seeded from a uint32.** Small, documented, well-tested. Games never import their own PRNG — the runtime injects a factory derived from `RoundConfig.seed`. Add a build-time check that rejects any game bundle containing `Math.random`, `Date.now`, or `performance.now`.
*Why it matters:* changing the PRNG later invalidates every stored replay and every historical score distribution.

### PR-2 — Fixed timestep *(hard to reverse — touches every game)*
**Default: the contract owns the loop.** Add `tick(dt)` to the lifecycle, `dt` constant at 1/60s sim step, decoupled from requestAnimationFrame render. Wall-clock time is forbidden inside game logic. `GameEvent` timestamps are expressed in **sim ticks, not milliseconds**.
*Why it matters:* F1 as written claims determinism but gives games no shared clock. If each game rolls its own loop, determinism is asserted in the README and false in practice — and it will fail silently on slow devices, which is exactly where a disputed score comes from.

### PR-3 — Sim/view split *(hard to reverse — architectural)*
**Default: every module ships as two halves.** `sim` is pure, headless, DOM-free, runs in Node. `view` is Pixi/Phaser render and reads sim state. `rawScore` from a client is always a **claim**; the server replays the event log through `sim` and the replayed score is authoritative.
*Why it matters:* the preamble says server-authoritative. That is only achievable if game logic runs without a browser. Retrofitting a headless sim onto a pool of finished games is a rewrite, not a refactor. This also gives G3's bot harness a target to run against.

### PR-4 — Version keying *(hard to reverse — corrupts data silently)*
**Default:** contract gets semver; each game declares `contractVersion` **and** `gameVersion`. Percentile distributions are keyed `(gameId, gameVersion)`. Any balance change bumps `gameVersion` and starts a fresh distribution.
*Why it matters:* without this, a difficulty tweak silently re-baselines every historical percentile — and percentile drives rank, and rank is the eligibility surface.

### PR-5 — Normalizer cold-start *(founder call — affects rotation speed)*
**Default:** a new game is **playable but non-ranking** until it has N real scores. Suggested N = 200 scores across ≥30 distinct players. Bot-derived priors from G3 may drive on-screen feedback only, never rank.
*Why it matters:* rank is what makes a player eligible for things. Building it on synthetic data is the wrong foundation to have to defend later. The tradeoff is slower rotation of new games — raise or lower N accordingly.

### PR-6 — `controlScheme: tilt` *(cheap to change)*
**Default: reserved but unimplemented at launch.** Keep it in the enum so the type doesn't churn; gate it out of the pool. Device-orientation permission is a friction wall on iOS, tilt is hostile for someone standing in a crowded venue, and it is an accessibility problem.

---

## PROMPT 0 — Repo bootstrap + mirror

*Session: `claude -r arena-command-center`. Expected duration: short.*

```
You are bootstrapping the repository for a project called The Arcade Realm
(build layer is referred to as "Arena"). The repo exists but is essentially
empty. This session does NOT build any feature. It establishes ground truth
and scaffolding only.

TASK
1. Print the current repo tree and git status so we both see actual state.
   Do not assume — report what is there.
2. Initialize a TypeScript monorepo-friendly structure with these top-level
   directories, each containing a README.md stating its purpose and its
   owning task-doc code:
     /contracts    (F1)
     /app          (F3 PWA shell)
     /games        (F4 + factory output)
     /runtime      (R1-R4)
     /factory      (G1-G7)
     /lore         (L1-L5)
     /compliance   (C1-C4)
3. Tooling baseline: TypeScript strict mode, ESLint, Prettier, Vitest.
   Node LTS. No framework choice beyond this yet — F3 owns that decision.
4. Create /CLAUDE.md at repo root containing EXACTLY this block and nothing
   else above it:

## COMMAND STATE MIRROR (v1, 2026-07-17)
PHASE: Pre-build. Spec layer complete. Critical path: freeze F1, finish L1.
STATUS: F1 NOT STARTED (first domino) | F2/F3/F4 blocked by F1 |
        R1-R4 blocked by F-spine | G1-G7 deferred until loop proven at one
        venue | L1 DRAFT (needs founder pass) | L2-L5 blocked by L1 |
        C1-C3 not started | C4 ASSEMBLED, awaiting counsel
GATES:  Arena Coin counsel clearance — OPEN. No earn/redeem mechanic ships.
        Crowdfunding consideration question — OPEN. No public campaign page.
NEXT:   F1 freeze · L1 founder pass · counsel engagement · solvency model
MIRROR RULE: This block is pasted from STATE_LEDGER.md in Claude Project
knowledge. It is READ-ONLY. Never hand-edit it. Flow is one-way:
ledger -> mirror. If you believe it is stale, say so and stop.

5. Below that block, add repo conventions: the seven directories, the
   Zero-IP rule (original or MIT/Apache/CC0 only; every generated artifact
   ships provenance.json), and the instruction that every session ends with
   a STATUS BLOCK.
6. Add a .gitignore, commit.

CONSTRAINTS
- Do not implement any game, schema, or runtime logic.
- Do not create files under /contracts beyond its README — F1 owns those.

END YOUR SESSION WITH:

TASK: BOOTSTRAP
STATUS: [DONE | BLOCKED | PARTIAL]
OUTPUTS PRODUCED:
  - <list each file/directory actually created>
DEPENDENCY ARTIFACTS I STILL NEED (if any):
DECISIONS I MADE THAT COMMAND CENTER SHOULD KNOW:
  - <tooling versions, anything you chose>
OPEN QUESTIONS:
```

**Checkpoint (observable):** `CLAUDE.md` exists at repo root with the mirror block verbatim; seven directories exist with READMEs; `npm run lint` and `npm run test` both execute without error.
**Stop condition:** if the mirror block was altered or the tree doesn't match, do not proceed to Prompt 1. Re-run Prompt 0.

---

## PROMPT 1 — F1 freeze

*Launch only after Prompt 0's checkpoint passes.*

```
Open LAUNCH_KIT.md and execute the F1 launch packet (F1 — GameModule
Contract + Scoring Normalizer) in full. Read /CLAUDE.md first for repo
conventions and command state.

The following six rulings are FROZEN by the founder and override anything
ambiguous in the F1 spec. Implement them exactly. If any of them conflicts
with the F1 spec text, follow the ruling and flag the conflict in your
STATUS BLOCK.

PR-1  PRNG: sfc32, seeded from a uint32 derived from RoundConfig.seed.
      Games never import a PRNG — the runtime injects a factory. Add a
      build-time check rejecting any game bundle containing Math.random,
      Date.now, or performance.now.

PR-2  FIXED TIMESTEP: the contract owns the loop. Add tick(dt) to the
      lifecycle. dt is constant at 1/60s sim step, decoupled from render.
      Wall-clock time is forbidden inside game logic. GameEvent timestamps
      are expressed in SIM TICKS, not milliseconds.

PR-3  SIM/VIEW SPLIT: every GameModule ships as two halves. `sim` is pure,
      headless, DOM-free, and must run under Node. `view` renders and reads
      sim state. A client-reported rawScore is always a CLAIM; the server
      replays the event log through `sim` and the replayed score is
      authoritative. The contract must make a DOM-dependent sim impossible
      to write accidentally — enforce it in the types.

PR-4  VERSION KEYING: contract carries semver. Each game declares
      contractVersion AND gameVersion. Percentile distributions are keyed
      (gameId, gameVersion). Document that any balance change bumps
      gameVersion and starts a fresh distribution.

PR-5  COLD START: a new game is playable but NON-RANKING until it has 200
      real scores across at least 30 distinct players. Bot-derived priors
      may drive on-screen feedback only, never rank. Make the non-ranking
      state explicit in the normalizer's return type — not a magic value.

PR-6  controlScheme: keep `tilt` in the enum but mark it reserved and
      unimplemented. Document why (iOS permission friction, standing-venue
      ergonomics, accessibility).

ADDITIONALLY
- The README "Why" page must state plainly that determinism exists to
  enable replay-based anti-cheat, fairness via shared instance, and
  reproducible bot testing.
- Ship a minimal conforming stub game demonstrating the sim/view split.
- Ship a test proving 100 mount->destroy cycles leave flat memory and zero
  live listeners or timers.
- Ship a test proving identical seed + identical input log reproduces an
  identical score, run through the headless sim in Node.
- Tag the frozen contract v1.0.0 and state in the README that changes after
  freeze require re-notifying every downstream agent.

END WITH THE STANDARD LAUNCH_KIT STATUS BLOCK (TASK: F1).
```

**Checkpoint (observable):** `/contracts/game-module.ts`, `/contracts/scoring.ts`, `/contracts/README.md` exist; determinism test passes headless in Node; teardown test passes; contract tagged v1.0.0.
**Stop condition:** if the determinism test cannot run headless, PR-3 was not implemented — that is a re-do, not a follow-up ticket. Everything downstream inherits the defect.

---

## PROMPT 2 — F2, on deck

*Do not launch until F1 is tagged v1.0.0 and the STATUS BLOCK is folded into the ledger.*

```
Open LAUNCH_KIT.md and execute the F2 launch packet (Database Schema).
Read /contracts/game-module.ts and /contracts/scoring.ts first — they are
FROZEN at v1.0.0 and the schema must conform to them, not the reverse.

Carry these forward from the F1 freeze:
- Score distributions are keyed (gameId, gameVersion). Design the schema so
  a gameVersion bump starts a fresh distribution without orphaning history.
- A submitted score is a CLAIM until server replay verifies it. The schema
  must represent claim state and verified state distinctly. An unverified
  claim must never be readable by the leaderboard path.
- Ranking eligibility per game is a function of that game's score count and
  distinct-player count (200 / 30). Make that queryable, not computed
  ad hoc.
- Per-jurisdiction switches (C2) will need to gate rows later. Leave the
  seam; do not implement the policy.

END WITH THE STANDARD LAUNCH_KIT STATUS BLOCK (TASK: F2).
```

After F2: F3 and F4 unblock, and R2 becomes launchable in parallel. Per `00_INDEX`, the G-chain stays deliberately deferred until the loop is proven at one venue — do not open it early because it looks parallelizable.

---

## TRACK B — FOUNDER, running in parallel

Ordered by latency, not by importance. Start the slowest thing first.

**B1 — Start the counsel clock. Today.**
This is the only path to clearing either gate, and it currently reads zero. The practice area you're looking for is **promotions/sweepstakes law with skill-gaming exposure** — not general corporate, not general IP. Search terms that surface the right bar: "sweepstakes and promotions counsel," "skill contest state law," "prize promotion compliance." You want one attorney for the first pass, not three.

Scope the first engagement narrow. `C4` is ASSEMBLED but its Ecosystem-C section depends on the C3 skill-gradient report, which doesn't exist yet (C3 needs G3, which is deferred). So do not wait for a complete brief. Take the questions that are already answerable — entity structure, Ecosystem A ToS, the Arena Coin classification question, and the crowdfunding consideration question — and leave Ecosystem C for a second pass once C3 has evidence.

*I'm not a lawyer and this isn't legal advice — it's sequencing.*

**B2 — L1 founder pass → FROZEN.**
Cheapest unblock in the project. One human pass on the existing "Drain vs. the Realm" draft releases L2, L3, L4, and L5. Nothing but your attention is in the way.

**B3 — Entity + ToS.**
`00_INDEX` is explicit that Ecosystem A has no gate to launch but does require an entity formed and ToS in place. Neither is on the ledger's NEXT list. Both are prerequisites to any venue actually hosting a night.

**B4 — CP-0 solvency model.**
Ledger v1 flags this as the highest-priority risk work, alongside the HQ Trivia post-mortem parallel. It's escalation-tier work under the protocol — pull it into a dedicated max-thinking session in the command center, not into a Code session and not into this plan.

---

## LEDGER IMPACT

This session is ledger-worthy if any of the following land: Prompt 0 completes (BOOTSTRAP status arrives), F1 freezes, the six pre-rulings are accepted (they become DECISIONS), or counsel outreach begins (moves a GATE from zero).

Accepting PR-1 through PR-6 alone is a DECISIONS change — close the ledger on that before Prompt 1 runs, so the rulings are recorded before the artifact that depends on them exists.
