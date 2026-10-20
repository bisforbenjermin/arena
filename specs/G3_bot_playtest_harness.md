# G3 — Bot-Playtest Harness (Skill-Profile Bots)

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
You are building the cleverest stage: synthetic players that play each candidate hundreds of times to verify it is actually playable AND has a skill gradient. This is what lets the Factory run 24/7 with no humans — and it doubles as the legal evidence that games are skill-based (see C3).

## Dependencies
G2 (sandboxed survivors). F1 (deterministic seeds make reproducible bot runs possible). Reuses R2's distribution machinery if convenient.

## Task
1. For each candidate, run three **skill-profile bots** over many seeded playthroughs:
   - **Random bot** — random valid inputs.
   - **Greedy-heuristic bot** — simple sensible strategy.
   - **Near-optimal bot** — strong play. (Ask the generation agent to also emit a simple controller for its own game; if absent, use a generic heuristic per controlScheme.)
2. Compute the **skill gradient**: optimal-score minus random-score spread, plus score variance and completion rate, across the runs.
3. **Reject luck-not-skill games**: if random ≈ optimal (no meaningful gradient), reject. This keeps the pool skill-based — quality AND legal (predominance-of-skill).
4. Produce a per-candidate stats record: skill gradient, variance, completion rate, frame stability.
5. Because seeds are deterministic (F1), all of this is reproducible — store seeds used so any result can be re-verified.

## Output Contract
- `/factory/playtest/` — the harness + the three bot profiles.
- `/factory/playtest/stats-schema.ts` — the per-candidate stats record (this becomes the C3 compliance artifact).
- `/factory/playtest/README.md` — bot profiles, the skill-gradient definition, and why reproducibility matters.

## Done-Criteria
- Each survivor gets a reproducible stats record.
- A pure-luck game (random ≈ optimal) is rejected.
- Stored seeds allow re-verification of any playtest result.

## Handoff
G4 folds these stats into the quality score. C3 packages the skill-gradient records as the skill-vs-chance evidence base.
