# G7 — Live Telemetry + Evolve/Retire Loop

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
You are building the genetic loop that makes the pool *improve on its own*. Once real humans play promoted games, you capture how they perform, mythologize the winners (lore hook), evolve them into variants, and retire the duds. This is what keeps "surprise" alive long-term.

## Dependencies
G6 (live games in the pool), real player sessions via the Runtime, G1 (to feed evolve-parents back in). Game lineage data feeds L4/L5.

## Task
1. **Live telemetry**: per active game, capture rage-quits, replay rate, score distribution, and "fun" signals (do players seek it out?).
2. **Evolve**: best performers become **mutation parents** — emit "evolve <gameId>" briefs to G1 ("produce N variants of this loved game"). Track `parentLineage` so the family tree is explicit.
3. **Retire**: underperformers get status='retired' (recoverable as parents).
4. **Lore hook**: surface cult-favorite games and notable lineages to the Lore Layer (L4 Loremaster) so popular games get mythologized and the game family-tree becomes in-world history.
5. Close the loop: this runs continuously, so the pool freshens and quality compounds without manual curation.

## Output Contract
- `/factory/telemetry/` — live metric capture.
- `/factory/evolve/` — parent-selection + evolve-brief emission to G1.
- `/factory/telemetry/README.md` — metrics defined, evolve/retire policy, the lineage→lore hook.

## Done-Criteria
- Active games accrue real-play telemetry.
- A loved game spawns evolve-variants via G1; lineage is tracked.
- Cult favorites + lineages are exposed to the Lore Layer.

## Handoff
G1 generates variants from evolve-parents (loop closes). L4/L5 turn lineage + cult favorites into canon.
