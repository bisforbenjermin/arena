# R2 — Score Validation + Percentile Normalizer

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
You are a backend engineer implementing anti-cheat and fair cross-game scoring. This is what makes "mix a reflex game and a memory maze in one tournament" fair, and what kills most cheating cheaply.

## Dependencies
F1 (determinism + normalizer contract), F2 (scores table). Consumes input logs produced by games + clients.

## Task
1. **Replay validator**: given `(gameId, seed, inputLog, claimedRawScore)`, re-run the game headlessly with that seed + input log and confirm the resulting score matches the claim. Mismatch ⇒ mark `validated=false`, discard from ranking. This is cheap *because* games are deterministic (F1).
2. **Percentile normalizer**: implement the F1 contract — `normalize(gameId, rawScore) -> 0–100` against that game's historical raw-score distribution. Maintain per-game distributions incrementally (don't recompute from scratch each time).
3. **Cold-start rule**: implement exactly what F1 specified for games with little/no history (e.g. provisional percentile + flag until N scores exist).
4. Tournament points come from **percentile**, never raw score — so a tapper and a maze are comparable.
5. Expose validation + normalization as functions R1/R3 call; never trust a client-supplied percentile.

## Output Contract
- `/runtime/scoring/validator.ts` — replay validation.
- `/runtime/scoring/normalizer.ts` — percentile implementation of the F1 contract + cold-start.
- `/runtime/scoring/README.md` — how validation defeats cheating; how distributions are maintained.

## Done-Criteria
- A tampered score (good seed, inconsistent log) is caught and discarded.
- Two different games produce comparable percentiles for equivalently-skilled play.
- Distributions update incrementally without full recompute.

## Handoff
R3 ranks players by validated percentile points; G3's skill-gradient stats can reuse the distribution machinery; C3 references the validator as part of the skill-evidence record.
