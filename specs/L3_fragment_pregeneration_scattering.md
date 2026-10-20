# L3 — Fragment Pre-Generation + Scattering

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
You are building the system that creates the *feeling* the founder asked for: "long-winded overarching quests all over the place, story unfolding slowly." The trick is front-loading *fragments* without front-loading *explanation*.

## Dependencies
L2 (world-state + ledger API + attachment model), L1 (tone + fixed truths).

## Task
1. Use an agent to **pre-generate hundreds of fragments** at launch — atomic lore pieces (a line of myth, a glyph description, a "discovered" log entry), all respecting BIBLE tone and passing the ledger.
2. **Scatter** them: attach fragments to specific games, regions, leaderboard positions, times of day, win-streaks — so players *encounter* them organically and theorize. No single fragment explains the whole.
3. **Seed 3–5 overarching arcs simultaneously**, each only partially revealed — no quest-giver says "do X"; players notice patterns (a recurring glyph after certain games, a faction name that recurs, a prophecy counter ticking with total games played).
4. **Mystery-box discipline**: reveal *questions* faster than *answers*. The slow unfolding is the retention mechanic; the community does the interpretive work (this is the grassroots-lore moat).
5. Ensure scattering is data-driven (rules linking fragment → trigger) so new fragments can be slotted later by L4.

## Output Contract
- `/lore/seed/generate-fragments.ts` — the mass-generation agent + ledger submission.
- `/lore/seed/scatter-rules.ts` — fragment→trigger attachment rules.
- `/lore/seed/README.md` — the mystery-box / questions-over-answers discipline; how arcs are seeded partially-revealed.

## Done-Criteria
- Hundreds of fragments exist, all ledger-valid, scattered across multiple trigger types.
- 3–5 arcs are live and only partially revealed.
- Encountering fragments raises questions without dumping answers.

## Handoff
L4's Loremaster adds reality-responsive fragments on top of this seeded substrate; L5 advances the seeded arcs.
