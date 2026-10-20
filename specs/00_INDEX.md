# The Arcade Realm — Agent Build Index

This folder is a build specification broken into **28 standalone agent tasks**. Each doc is self-contained: it embeds the shared context preamble and can be executed by an agent with no other document open. This INDEX exists for the human orchestrator to assign work and respect dependencies.

---
## SHARED CONTEXT PREAMBLE (identical in every agent doc — read once, applies always)

**Project:** *The Arcade Realm* — a hyperlocal surprise-tournament platform. Players check in at physical venues and compete in short, unpredictable skill games. Status (leaderboard rank) is the primary incentive; prizes are deferred. The moat is community + an unfolding meta-narrative ("lore"), not prize size.

**The three engines** (independent, mutually feeding):
1. **Game Factory** — agents continuously generate, test, and promote micro-games into a live pool.
2. **Tournament Runtime** — pulls games from the pool, sequences rounds + intermissions, captures data, ranks players. Server-authoritative.
3. **Lore Layer** — structured world-state where every game/season/leaderboard is a story fragment; quests unfold slowly.

**The core operating principle (applies to every engine):** *Generate freely at the edges, gate hard in the middle, reserve human judgment for taste and canon.* Over-produce candidates; filter aggressively; a human owns only the irreducible core (what "good" feels like; what is canon).

**The five value-ecosystems** (walled from each other; one brand, separate value-mechanics):
- **A — Status** (free; no legal surface) → launch now
- **B — Sponsor Prizes** (contract law) → near-term
- **C — Skill Contest** (paid entry; sweepstakes + skill-gaming law) → mid-term
- **D — Digital Collectibles** (IP + consumer protection) → cautious
- **E — Token/Crypto** (securities + money transmission) → last / maybe-never

**The Firewall Doctrine (non-negotiable, every agent obeys):**
1. *Eligibility ≠ Entitlement.* Status/rank-tokens make a player *eligible* for things; they never *entitle* to a payout and NEVER convert to currency/crypto.
2. *Marketing is a regulated surface.* No copy anywhere (lore, UI, Discord) may frame anything as an investment, promise appreciation, or say "early holders profit." This triggers securities law.
3. *Per-jurisdiction switches.* Anything touching paid entry or value ships able to be disabled per-state.

**Tech baseline:** PWA client; PixiJS/Phaser games (MIT); Supabase (Postgres + Realtime + Auth + Edge Functions); dynamic `import()` + Service Worker pre-cache for games; Cloudflare Pages + R2 for hosting/bundles; a separate Node service for agent runtimes calling the Anthropic API.

**Zero-IP rule:** original or permissively-licensed (MIT/Apache/CC0) only. No recognizable characters, names, or "inspired-by" clones. Every generated artifact ships a `provenance.json` or it does not enter any pool.

**This is not legal advice.** Compliance docs describe what to build and what to ask a licensed attorney — never a legal green light.
---

## How to use this folder

- Each doc has the same structure: **Preamble → Role → Dependencies → Task → Output Contract → Done-Criteria → Handoff.**
- An agent is given exactly one doc. It reads the embedded preamble, does the task, produces the named outputs, stops.
- Dependencies below are *artifact* dependencies (doc B needs the file doc A produced), not "read doc A." If a dependency artifact doesn't exist yet, the task is blocked.

## The 28 docs

### 00 — Foundations (the shared spine; build first, in order)
- **F1** GameModule contract + scoring normalizer  *(blocks almost everything)*
- **F2** Database schema  *(blocks runtime + lore)*
- **F3** PWA shell + auth + eligibility-gating layer
- **F4** Two reference games  *(needs F1)*

### 01 — Tournament Runtime  *(needs F1, F2, F3)*
- **R1** Orchestrator state machine
- **R2** Score validation + percentile normalizer  *(needs F1)*
- **R3** Real-time leaderboard + rank-tokens  *(needs F2)*
- **R4** Prize Chest data-capture  *(needs F2)*

### 02 — Game Factory  *(needs F1; G-chain is sequential)*
- **G1** Generation-agent brief
- **G2** Sandbox + compile gate  *(needs G1 output)*
- **G3** Bot-playtest harness / skill-profile bots  *(needs G2)*
- **G4** Quality scoring (auto + LLM judge)  *(needs G3)*
- **G5** Provenance/license + similarity gates  *(needs G1)*
- **G6** Human spot-gate + promotion to pool  *(needs G4, G5)*
- **G7** Telemetry + evolve/retire loop  *(needs G6 + live play)*

### 03 — Lore Layer  *(L1 is human-authored and blocks the rest)*
- **L1** Lore bible  *(HUMAN writes this — see doc)*
- **L2** World-state schema + canon ledger  *(needs F2, L1)*
- **L3** Fragment pre-generation + scattering  *(needs L2)*
- **L4** Loremaster agent loop  *(needs L2, C1)*
- **L5** Arc + prophecy progression wired to metrics  *(needs L2)*

### 04 — Compliance & Governance  *(research/governance agents)*
- **C1** Firewall doctrine + marketing-governance rules  *(feeds L4)*
- **C2** Per-jurisdiction eligibility-switch spec  *(feeds R-layer + Ecosystem C)*
- **C3** Skill-gradient compliance-artifact spec  *(needs G3)*
- **C4** Attorney-brief assembler

### Connective
- **00_INDEX** (this file)
- **00_PREAMBLE** (the standalone preamble, for reference)

## Critical-path build order (the short version)
1. **F1 → F2 → F3 → F4** (foundations)
2. In parallel after F1: start the **G-chain** (G1→G2→G3→G4→G5→G6) and **R-layer** (R1–R4)
3. **L1 (human)** as early as possible → L2 → L3/L4/L5
4. **C1** before L4; **C2** before any paid feature; **C3** after G3; **C4** anytime
5. **G7** and **Ecosystem C activation** only after live play + legal gates

## The legal gates (build may run ahead; *activation* waits)
- **Ecosystem A** (status): no gate to launch. Get ToS + entity formed.
- **Ecosystem B** (sponsor prizes): MSA + per-state prize-value thresholds cleared.
- **Ecosystem C** (paid skill contest): full state-by-state clearance + money-transmission analysis. Nothing paid goes live in a state until cleared *for that state*.
- **Ecosystems D/E**: post-scale, dedicated securities/fintech counsel, likely ring-fenced subsidiaries.
