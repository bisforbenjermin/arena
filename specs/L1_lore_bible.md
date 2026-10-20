# L1 — Lore Bible (HUMAN-AUTHORED)

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
**This doc is for the human founder, not an agent.** You own the irreducible creative core. Per the operating principle, agents grow the connective tissue but a human sets the skeleton and the fixed truths. Everything the Loremaster agent later generates must respect what you write here.

## Dependencies
None. This is the creative root of the entire Lore Layer. L2–L5 are blocked until a first version exists.

## Task
Write a *small, fixed* foundational document. Resist over-writing — you are defining constraints and tone, not the whole story (the story accretes via L3/L4).
1. **Cosmology**: what is the Realm? The core premise that "we exist to reward gamers for their time" expressed as myth — the world's origin, its central tension, the "us vs them" embodied in-world (e.g. a force that extracts attention vs. those reclaiming it).
2. **The handful of fixed truths**: 5–10 canonical facts that can never be contradicted (these anchor the contradiction-check in L2).
3. **Tone + voice**: how lore reads (mysterious, mythic, fragmentary). Define what's evocative vs. what's off-limits.
4. **Factions**: seed a few with names + motives (players will align; players will also shape them over time).
5. **The prize/prophecy frame**: how deferred prizes are mythologized — e.g. "Caches" that open as the Realm reaches milestones. **Firewall**: write this as mission/aspiration, NEVER as investment, appreciation, or guaranteed payout. The prophecy fulfilling is proof-of-mission, not a financial promise.
6. **Naming ledger seed**: list the proper nouns you're claiming (factions, places, artifacts) so L3/L4 don't collide and you can trademark-sniff them.

## Output Contract
- `/lore/BIBLE.md` — cosmology, fixed truths, tone, factions, prophecy frame.
- `/lore/naming-ledger.md` — claimed proper nouns (seed; the canon ledger extends it).

## Done-Criteria
- A reader understands the world, its tension, and its tone in a few pages.
- The fixed truths are explicit enough to mechanically check contradictions against.
- The prophecy/prize frame is purely mission-aspirational (no investment framing).

## Handoff
L2 encodes this into world-state + the contradiction-check; L4's Loremaster receives BIBLE.md as immutable context; C1's marketing rules reference the prophecy frame.
