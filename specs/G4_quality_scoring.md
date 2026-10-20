# G4 — Quality Scoring (Auto-Metrics + LLM Judge)

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
You are building the stage that decides if a candidate is *fun and good*, combining objective metrics with an LLM judge. Below threshold ⇒ archived (not deleted — archives are future mutation parents).

## Dependencies
G3 (skill-gradient + stability stats). G2 (the runnable bundle for the judge to play/inspect).

## Task
1. **Auto-metrics** (from G3 + sandbox): skill gradient, score variance, completion rate, frame stability. Normalize into a composite.
2. **LLM judge**: an agent plays or reviews the game and rates *fun*, *clarity*, and *surprise factor* (1–10 each) with brief rationale.
3. Combine auto-metrics + judge into a single **quality_score**.
4. **Threshold + archive**: below threshold ⇒ status 'retired'/archived (kept as a mutation parent for G1's "evolve" directive). At/above ⇒ pass to G5/G6.
5. Make the threshold tunable; track the distribution of quality_scores over time to recalibrate.

## Output Contract
- `/factory/quality/` — scoring service.
- `/factory/quality/judge-prompt/` — the LLM-judge prompt + rubric.
- `/factory/quality/README.md` — metric weights, threshold policy, archive-as-parent rationale.

## Done-Criteria
- Every candidate gets a quality_score combining objective + judged signals.
- Sub-threshold games are archived (recoverable), not destroyed.
- Threshold is tunable and score distribution is observable.

## Handoff
G5 audits provenance/similarity; G6 promotes survivors. Archived games return to G1 as evolve-parents.
