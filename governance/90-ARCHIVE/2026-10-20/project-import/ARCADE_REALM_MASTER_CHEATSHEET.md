# Master Cheatsheet — The Arcade Realm / Arena Project

**Purpose of this doc:** a fast "where am I / what is this file for" reference. Use it to reorient when the volume of output feels bigger than what's actually been implemented. It does not replace the files — it tells you which one to open.

---

## 1. The Big Picture — how the files relate

The project has moved through three layers, and **all three still exist in the folder at once** — that's a big source of the overwhelm. They're not redundant; they're different altitudes:

```
LAYER 1 — VISION & STRATEGY (conceptual, pre-build)
   Master_Context_Document__Project_Arena.pdf
   LocationBased__Remote_Tournament_Platform_1.pdf
   MD_deepseek
        │  distilled into official architecture
        ▼
LAYER 2 — BUILD SPECIFICATION ("The Arcade Realm")
   00_PREAMBLE.md, 00_INDEX.md  →  F, R, G, L, C doc sets (24 task docs)
        │  packaged for execution
        ▼
LAYER 3 — EXECUTION KIT
   LAUNCH_KIT.md  (copy-paste packets to run each task doc in its own agent chat)
```

**Naming note:** the vision-layer PDFs and your memory call the product **Arena**; the build-spec layer renamed it **The Arcade Realm**. Same project, name evolved — not two projects.

**If you only remember one thing:** `00_INDEX.md` is the map of the build layer. `LAUNCH_KIT.md` is how you actually run it. Everything else (F/R/G/L/C) is a single puzzle piece those two files tell you how to place.

---

## 2. Quick Nav — "I'm overwhelmed, where do I look?"

| You need... | Open this |
|---|---|
| A reminder of the *why* / original pitch | `Master_Context_Document__Project_Arena.pdf` |
| The legal framing that started the whole compliance track | `LocationBased__Remote_Tournament_Platform_1.pdf` |
| To recall the current official build order & dependency graph | `00_INDEX.md` |
| The one-paragraph rules every doc obeys (engines, ecosystems, firewall) | `00_PREAMBLE.md` |
| To hand a task to an agent right now | `LAUNCH_KIT.md` |
| The actual world lore content (not the instructions to write it) | `L1_bible_DRAFT.md` |
| To check if something is legally exposed before building it | `C1`–`C4` |

---

## 3. Layer 1 — Vision & Strategy Docs

*Conceptual foundation. Not build specs — these are "explain the whole idea to a fresh LLM" documents. Useful for re-grounding in the mission, not for engineering detail.*

| File | Purpose | Role in project |
|---|---|---|
| **Master_Context_Document__Project_Arena.pdf** | The founding pitch: "reward gamers for their time," Arena as a reward-engine-disguised-as-esports, the flywheel (players↔sponsors↔advertisers), prize escalation, brand personality. Explicitly written to be handed to another LLM for critique/expansion, not summarized. | Root vision doc — the *why*. Predates the legal pivot. |
| **LocationBased__Remote_Tournament_Platform_1.pdf** | Consolidates design + **legal** + architecture + AI-generation thinking from an earlier conversation. Introduces the critical legal insight that drove everything downstream: *winner-determination method*, not game design, is the regulatory pressure point (lottery = prize + chance + consideration). | Bridge doc — where "fun idea" started becoming "structurally compliant system." Ancestor of the C-series compliance docs. |
| **MD_deepseek** | A consolidated business + technical spec (multi-sided value prop table, tournament flow, Prize Chest data-capture concept, tech container notes) written for handoff to another LLM/dev team. | Parallel synthesis pass — an alternate/earlier full spec, same lineage as the two PDFs above. Largely superseded by Layer 2, but the Prize Chest and data-capture logic here map directly to `R4`. |

---

## 4. Layer 2 — Build Spine (connective docs)

| File | Purpose | Role in project |
|---|---|---|
| **00_INDEX.md** | The master map: lists all 28 agent docs, the 5 value-ecosystems (A–E), the Firewall Doctrine, tech baseline, and the **critical-path build order**. Written for you (the human orchestrator) to assign work and track dependencies. | **Start here whenever you've lost the thread.** This is the single source of truth for sequencing. |
| **00_PREAMBLE.md** | The shared context block that's embedded verbatim at the top of every F/R/G/L/C doc — extracted standalone for quick reference. | Reference only; you never need to read it separately if you're already in a task doc. |

---

## 5. Layer 2 — F: Foundations *(build first, in order — blocks nearly everything)*

| File | Purpose | Depends on | Feeds into |
|---|---|---|---|
| **F1** GameModule contract + scoring normalizer | Freezes the one interface every game (hand-built or agent-generated) must satisfy. The root artifact. | None | Almost everything |
| **F2** Database schema | Relational Postgres schema (player/guild/region/quest-progress/game-lineage joins). | None (coordinate slugs with F1) | Runtime + Lore layers |
| **F3** PWA shell + auth + eligibility-gating | Installable app skeleton + a generic per-jurisdiction feature-switch layer (venue check-in now, legal gating later). | F2 | R-layer; the switch itself is wired by C2 |
| **F4** Reference games (x2) | Two hand-built, polished games conforming exactly to F1 — what Runtime tests against before the Factory exists, and the gold-standard the Generation agent imitates. | F1 (frozen) | R-layer testing, G1 exemplars |

---

## 6. Layer 2 — R: Tournament Runtime *(needs F1, F2, F3)*

| File | Purpose | Depends on | Feeds into |
|---|---|---|---|
| **R1** Orchestrator state machine | Server-authoritative sequencing of a tournament session — client renders, server decides. | F1, F2, F3, F4; later reads `game_pool` | Whole runtime |
| **R2** Score validation + normalizer | Anti-cheat + fair cross-game scoring (what makes mixing a reflex game and a memory maze fair). | F1, F2 | R3, G3, C3 |
| **R3** Leaderboard + rank-tokens | The status engine — live leaderboards (core incentive) + non-convertible rank-tokens. | F2, R2 | Player-facing status system |
| **R4** Prize Chest data-capture | Intermission data-capture moment framed as quest progression, not a survey — the future ad/data upsell. | F2, R1 | Sponsor data product; tone-coordinates with Lore |

---

## 7. Layer 2 — G: Game Factory *(needs F1; this chain is sequential)*

| File | Purpose | Depends on | Feeds into |
|---|---|---|---|
| **G1** Generation-agent brief | The agent that *invents* candidate games. High-volume, low-precision by design. | F1, F4 | G2 |
| **G2** Sandbox + compile gate | Compiles and rejects broken/leaky/oversized candidates before expensive testing. | G1, F1 | G3 |
| **G3** Bot-playtest harness | Synthetic players stress-test each candidate for playability + skill gradient — also legal evidence of skill-dominance. | G2, F1 | G4, C3 |
| **G4** Quality scoring | Objective metrics + LLM judge decide if a candidate is fun/good. | G3, G2 | G6 |
| **G5** Provenance/similarity gates | Verifies licensing is clean and nothing resembles a commercial game or duplicates the pool — the zero-IP backbone. | G1 | G6 |
| **G6** Human spot-gate + promotion | The one human-in-the-loop stage — a light sample-review, not full review, promoting candidates into the live pool. | G4, G5, F2 | Live game pool |
| **G7** Telemetry + evolve/retire | The genetic loop: tracks live performance, mythologizes winners, evolves variants, retires duds. | G6 + live play, G1 | L4, L5 (lineage data) |

---

## 8. Layer 2 — L: Lore Layer *(L1 is human-authored and blocks the rest)*

| File | Purpose | Depends on | Feeds into |
|---|---|---|---|
| **L1_lore_bible.md** | The *task doc* instructing you (the founder) to write the lore bible — not an agent task. You own this creative core. | None — root of Lore Layer | L2–L5 blocked until this exists |
| **L1_bible_DRAFT.md** | The actual **first-draft content**: the myth ("the Drain" vs. "the Realm"), the 8 fixed/canon truths, tone & voice rules. This is the deliverable L1 asked for. | L1_lore_bible task | Everything lore-related |
| **L2** World-state + canon ledger | Turns the lore script into queryable world-state, plus a ledger that keeps infinite generated lore coherent. | F2, L1 | L3, L4, L5 |
| **L3** Fragment pre-generation + scattering | Creates the "story unfolding slowly" feeling by front-loading fragments without front-loading explanation. | L2, L1 | Player-facing discovery content |
| **L4** Loremaster agent loop | Continuous lore generation conditioned on real platform events — operates under C1's marketing-firewall guardrails. | L2, C1, L1 | Live narrative layer |
| **L5** Arc + prophecy progression | Wires overarching story arcs/prophecies to aggregate platform metrics, so the story advances as the community grows. | L2, R3, G7 | The "first big prize event as narrative payoff" moment |

---

## 9. Layer 2 — C: Compliance & Governance *(research/governance — not legal advice)*

| File | Purpose | Depends on | Feeds into |
|---|---|---|---|
| **C1** Firewall doctrine + marketing governance | Encodes the "eligibility ≠ entitlement" / no-investment-framing rules into an enforceable rule set for all copy. | L1 | L4 directly; pairs with C4 |
| **C2** Jurisdiction eligibility switch | Builds the mechanism behind F3's stub so paid play can be enabled/disabled per state as counsel clears it. | F3, F2 | Ecosystem C activation |
| **C3** Skill-gradient compliance artifact | Converts G3's bot-playtest data into a durable evidentiary record proving games are predominantly skill-based. | G3, R2 | C4 |
| **C4** Attorney brief assembler | Assembles the structured question-set + evidence package a licensed attorney reviews — makes legal review fast and cheap. | C1, C3 | C2 (counsel returns cleared-states data back into it) |

---

## 10. Layer 3 — Execution

| File | Purpose | Role in project |
|---|---|---|
| **LAUNCH_KIT.md** | Operating model + all 24 agent task docs repackaged as self-contained **copy-paste launch packets**, plus the "command center" coordination loop (launch → agent returns STATUS BLOCK → you paste it back here → next task unblocked). | This is *how* Layer 2 actually gets executed by agents. Same content as the F/R/G/L/C docs, reformatted for portability into fresh chats. |

---

## 11. The Five Value-Ecosystems (referenced constantly across docs)

| Ecosystem | What it is | Legal weight | Activation timing |
|---|---|---|---|
| **A — Status** | Free rank/leaderboard | None | Launch now |
| **B — Sponsor Prizes** | Sponsor-funded rewards | Contract law | Near-term |
| **C — Skill Contest** | Paid entry | Sweepstakes + skill-gaming law | Mid-term, state-by-state |
| **D — Digital Collectibles** | Cosmetic/collectible items | IP + consumer protection | Cautious |
| **E — Token/Crypto** | On-chain value | Securities + money transmission | Last, or maybe never |

---

## 12. Critical-Path Build Order (from `00_INDEX.md`, for fast recall)

1. **F1 → F2 → F3 → F4** (foundations, in order)
2. In parallel after F1: **G-chain** (G1→G2→G3→G4→G5→G6) and **R-layer** (R1–R4)
3. **L1 (you, ASAP)** → L2 → L3/L4/L5
4. **C1** before L4 · **C2** before any paid feature · **C3** after G3 · **C4** anytime
5. **G7** and **Ecosystem C activation** only after live play + legal gates clear

---

### One-line gut check
If you're overwhelmed, the honest current status is: the *design* (Layers 1–2) is far ahead of the *build*. Almost nothing here requires re-deciding — it requires **picking the next unblocked item off §12 and launching it via `LAUNCH_KIT.md`.** This doc's job is to make that pick take 30 seconds instead of a re-read of everything.
