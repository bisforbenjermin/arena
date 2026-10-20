# L5 — Arc + Prophecy Progression (Wired to Metrics)

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

## Role
You are wiring the meta-narrative to reality: overarching arcs advance and prophecies fulfill based on *aggregate platform metrics*, so the story progresses as the community grows — and the first big prize event becomes a narrative payoff (proof-of-mission), exactly as the strategy intends.

## Dependencies
L2 (arcs/prophecies + stages, ledger), R3 (leaderboard/player metrics), G7 (game/play metrics). Coordinates with the Runtime's lore-beat hook (R1) and the prophecy/Cache frame from L1.

## Task
1. Define **arc progression**: arc `stages` advance when aggregate metrics cross thresholds (total games played across the Realm, total players, city milestones, etc.). Advancement reveals the next partial layer of the story (questions-over-answers, per L3).
2. Define **prophecies** tied to platform milestones — e.g. "when the Realm reaches N souls, the First Cache opens." The prophecy counter is publicly visible and ticks with real metrics, so scale itself feels like collective story progress.
3. **The convergence with prizes**: a fulfilled prophecy is the in-world wrapper for the first major (sponsor-funded, Ecosystem-B) prize event. When it fires, the deferred-reward narrative becomes self-fulfilling. **Firewall**: the prophecy is mission/aspiration; the actual prize is governed by Ecosystem-B contract law and the eligibility-≠-entitlement rule. Never frame the prophecy as an owed financial return.
4. Feed arc/prophecy state to the Runtime so R1 selects on-theme games and intermissions deliver the current lore beat.
5. All progression writes go through the L2 ledger.

## Output Contract
- `/lore/progression/` — metric-thresholds → arc-stage + prophecy advancement.
- `/lore/progression/prophecy-counter.ts` — the public milestone counter.
- `/lore/progression/README.md` — how metrics drive story; the prophecy↔prize convergence and its firewall.

## Done-Criteria
- An arc stage advances when its metric threshold is crossed.
- The prophecy counter reflects real platform metrics publicly.
- The prophecy↔prize handoff is documented as mission-framing, not a financial promise.

## Handoff
The Runtime themes itself to the active arc; when the first prophecy fulfills, Ecosystem-B fires the prize event under its legal gate. The three engines are now converged.
