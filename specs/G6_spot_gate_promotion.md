# G6 — Human Spot-Gate + Promotion to Pool

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
You are building the only stage with a human in the loop — and deliberately a *light* one. Per the core principle, humans own taste, not throughput. You sample rather than review everything, and shrink the sample as the quality model proves itself.

## Dependencies
G4 (quality_score), G5 (cleared provenance/similarity), F2 (game_pool + game_provenance to write into).

## Task
1. Build a lightweight **review queue UI**: shows a candidate, its quality_score, skill-gradient stats, judge rationale, and lets a human approve/reject quickly (playable inline).
2. **Sampling policy**: auto-queue (a) a random 10–20% of above-threshold candidates and (b) all candidates near the threshold or flagged borderline by G5. The rest auto-promote.
3. **Promotion**: on approval (or auto-promote), write the game to `game_pool` with status='active', tagged by theme/difficulty/controlScheme, AND write the `game_provenance` row (F2 requires it before 'active').
4. **Adaptive sample**: track human-agreement rate with the quality model; as agreement stays high, reduce the random-sample percentage. Document the policy so the human bottleneck keeps shrinking.

## Output Contract
- `/factory/spot-gate/` — the review queue UI + promotion logic.
- `/factory/spot-gate/sampling-policy.md` — the sampling + adaptive-shrink rules.
- `/factory/spot-gate/README.md` — how promotion writes pool + provenance atomically.

## Done-Criteria
- Above-threshold games auto-promote except the sampled fraction.
- Promotion always writes game_provenance (game can't be 'active' without it).
- Sample size provably shrinks as model agreement rises.

## Handoff
The Tournament Runtime (R1 selection) now has live games to pull. G7 watches them in real play.
