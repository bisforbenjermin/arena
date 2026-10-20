# OPS-4 — Operating board: simulated C-suite panel with cold critique
Status: PROPOSED — not a ruling until the founder ratifies | Reversibility: REVERSIBLE | Undo cost: minutes (remove the Project instructions block and this file) | Confidence: MEDIUM (no sitting has run yet)

## Ruling (proposed)

1. **The panel.** ARENA gets a board of seven simulated industry veterans:
   - an esports league CEO
   - a mobile publisher CEO
   - a mobile ad-tech CRO
   - a brand sponsorship CMO
   - a skill-gaming general counsel
   - an AI games CTO
   - a live-service studio CCO

   Each seat critiques the question, then gives a remedy as an aside, or a positive pivot when there's no remedy. The full spec is `ARENA_BOARD.md`, which sits in `00-COMMAND/PROPOSED/` until this is ruled.

2. **Proposal is not ruling.** The board proposes; only the founder rules. Every board output stays PROPOSED until a DECISIONS file records the founder's ratification.

3. **When it sits.** The board sits for:
   - calls that would be EXPENSIVE or LOCKED to undo
   - anything that changes a gate or reopens an existing ruling
   - anything leaving the project
   - the run-up to any freeze

   Routine and reversible work skips the board.

4. **No self-grading.** The board never critiques its own recommendation in the same reply. EXPENSIVE and LOCKED calls get a cold critique in a fresh `CRITIQUE — <topic>` chat. That chat uses the venture-os CRITIQUE_PROMPT (KILL / FIX / NOTE) through five lenses: Skeptic, Architect, Historian, Operator and Advocate. Anything that can be checked mechanically is checked that way first.

5. **Standing tests, in order:**
   1. CP-0, the solvency gate.
   2. GTM-2, broadcast–prize decoupling.
   3. The Robin Hood test.

6. **One continuity system.** Continuity lives only in the capsule, SESSION_LOG and DECISIONS. Two earlier systems are superseded:
   - The March continuity system: session summaries, the one-paste handoff and versioned master prompts.
   - The July STATE_LEDGER and its regenerate-at-close ritual. The original is archived at `~/HQ/90-ARCHIVE/arena-july-2026/`. Its copy in Project knowledge gets removed, per OPS-2 (documents are superseded, never edited in place).

## Why

- **The founder asked for both.** In March 2026 he asked for a strategy board. On 2026-10-19 he asked for a realistic critique by esports and mobile-advertising C-suite, with a remedy or pivot for each point. One panel does both jobs; two panels would be two frameworks.
- **Self-grading is the weakest check.** The founder caught this on 2026-10-19 in RECON, the repo check that ran the determinism test. A fresh chat hasn't seen the reasoning, so it has nothing to defend.
- **Proposals must not read like rulings.** PR-1 to PR-6, the F1 contract rules, sat unanswered for a month because a proposal read like a ruling.
- **Cost follows consequence (OPS-1).** Reversible calls get ten minutes and a default, not a board.
- **One truth per fact.** The July ledger drifted for three months. It still shows F1 as not started, while F1 (the game contract), F2 (the database schema) and F4 (two reference games) are built.
- **Close stays cheap.** This follows the founder's own rule: cheap capture at close, expensive synthesis at open. One log line at close survives a tired night; regenerating a ledger doesn't.

## Downstream

- The ARENA Project instructions.
- `ARENA_BOARD.md`.
- `CLAUDE.md`'s hand-off rule: Code's hand-offs would become board sittings.
- Every future DECISIONS file: the board drafts them, the founder rules.
- OPS-1 and OPS-2 still speak in ledger rows. Read "rows" as capsule items and DECISIONS files.
- This narrows OPS-1. OPS-1 puts every DECISIONS change at max effort. Here, max effort is kept for EXPENSIVE or LOCKED calls, gate changes and reopened rulings. New reversible rulings get ten minutes and a default, following the founder's capsule rule.
- Buttercup: no change.

## Carry-over from the March 2026 board

| March item | Now |
|---|---|
| 7-seat C-suite (CSO, CPO, CTO, CCO, CRO, CGO, GC) | Kept as industry archetypes. CTO and CGO merge into the AI games CTO. Sponsor work moves to the CMO seat |
| Bodie, the sidekick | Retired. Buttercup's RUNWAY mode already gives one action per step and ends on the exact next command. Tying work to the roadmap is the board's job: it names the NEXT ACTION a step serves. Buttercup is unchanged |
| Session summary, one-paste handoff, versioned master prompt | Retired. The capsule, SESSION_LOG and DECISIONS do this job, and two continuity systems mean duplicate truth |
| AI Workforce Playbook departments | Retired. The agent packets replaced them |
| Robin Hood test | Kept, as the third test after CP-0 and GTM-2 |
| Library not era-locked; retro is flavor | Kept as creative guidance. It matches the 2026-10-19 look: retro arcade × steampunk / Blade Runner |
| MVP scope, tech stack, first game, launch city | Dropped. F1–F4 (built) and GTM-1 answer them |
| IP strategy: own, license or hybrid | Covered for the game library by the zero-IP rule (original or MIT/Apache/CC0, with `provenance.json`). Licensed named games stay a possibility, not a need (brief, 2026-10-19) |
| 50/50 ad-revenue share with players | Conflicts with CREDIT-1 (credit never cash-convertible) and the firewall rule that eligibility ≠ entitlement. The brief already routes ad money into prizes ("ads are how we buy you more loot"). Recommend parking it. **Founder's call** |
| Public build-in-public site, crowdfunding, co-founder search | Parked. Crowdfunding sits behind its open gate |
| Funding path | Parked. It's off the critical path (F3) |
| Preference-data monetization | WATCH. Trigger: any spec that stores per-player prize picks for ad targeting goes to the GC seat. Frame it as opt-in |
| Grand prizes (cars, houses, income assets) | WATCH. Trigger: any plan to show or promote one runs CP-0 and GTM-2 first. Insured or sponsor-funded only |
| Real-world GPS quest and foot traffic | WATCH. Vision for the perpetual quest. Not before the R-chain (the tournament runtime) proves people replay for rank at a real venue |
| Minimum viable sponsor pitch | WATCH. Trigger: a CP-0 solvency model exists, then promote it to NEXT |

## Open items found while drafting (2026-10-20)

These belong in the capsule's open items. This file doesn't rule them.

- **Naming.** The founder has picked a "[world name]: Arena" structure: the lore world is the brand, and Arena is where you compete. The world name isn't chosen yet. There's no NAME-1 file (a naming ruling), and the capsule still lists naming as open. Once the name is picked, it's a ten-minute call at low effort.
- **GTM-1 vs. venues.** GTM-1, the Liberation Run go-to-market, opens with a single-venue Fortress. On 2026-10-19 the founder said venues are "one GTM strategy of many" and "not necessarily the initial launch". He's also weighing a launch built on a grand quest with a house-sized prize, which would have to clear CP-0 and GTM-2 first. Two ways forward:
  - Amend GTM-1. That's EXPENSIVE: a board sitting plus a cold critique.
  - Or confirm the remark was only about how the brief frames growth.
- **CREDIT-1**: resolved. The founder ratified the two-rail design on 2026-10-20, before F3 builds its key gate on it. The "seven anti-speculation laws" it cited were never written down.
- **Missing files:**
  - OPS-2 and OPS-3 never landed, and OPS-1 is truncated. Their full text is recovered alongside this file.
  - BUTTERCUP.md and GLOSSARY.md aren't in `00-COMMAND/` or `10-CANON/`.

## Note — provenance

Drafted by an assistant on 2026-10-20 from these sources:
- the March 25 board chat
- the Nexus critique design (March 25)
- the panel spec the founder gave in the 2026-10-19 brief chat
- the canon in `~/code/arena`
- the venture-os `CRITIQUE_PROMPT`

The founder picked "C-suite + critique layer" on 2026-10-19, and chose to keep this PROPOSED on 2026-10-20. Everything else here is assistant-drafted.

**To ratify:**
1. Say yes, or edit.
2. Change the first line to `Ruled: <date> | … | Ratified by founder`.
3. Move this file from `00-COMMAND/PROPOSED/` into `10-CANON/DECISIONS/`, and move `ARENA_BOARD.md` into `00-COMMAND/`.
