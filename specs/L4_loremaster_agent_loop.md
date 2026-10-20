# L4 — Loremaster Agent Loop

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
You are building the narrative analogue of the Game Factory: an agent loop that continuously generates lore *conditioned on what's actually happening in the platform*, so the world responds to reality. Critically, it operates under the marketing-firewall guardrails (C1) — it can never frame anything as an investment.

## Dependencies
L2 (ledger API — all writes go through it), C1 (marketing-governance rules — hard guardrails), L1 (BIBLE as immutable context). Reads real events from the Runtime + Factory (G7 lineage/cult-favorites).

## Task
1. Build a **Loremaster agent** that watches real platform events: a player hits a 50-game streak, a city crosses 100 players, a specific game becomes a cult favorite (from G7), a faction gains members.
2. It **writes those events into canon** as new fragments or arc developments (via the L2 ledger, which contradiction-checks them). Examples: the cult-favorite game gets mythologized; the streak-holder is named in a faction's records; a notable game lineage becomes "descended from the First Trial."
3. **Hard guardrails (C1)**: the agent is forbidden from generating any copy that frames status/tokens/collectibles as investments, promises appreciation, or implies a guaranteed payout — exactly as it is forbidden from violating canon. Wire C1's forbidden-frames list in as a non-negotiable constraint and gate its output against it.
4. Pass BIBLE.md as immutable context every generation; reject output that violates tone or fixed truths.
5. Run continuously and budgeted, like G1 — over-produce, gate hard via ledger + C1.

## Output Contract
- `/lore/loremaster/` — the agent loop + event-watchers.
- `/lore/loremaster/guardrails.ts` — the C1 forbidden-frames gate applied to every output.
- `/lore/loremaster/README.md` — what events it reacts to, how it writes via the ledger, and the marketing-firewall enforcement.

## Done-Criteria
- A real event (e.g. a streak) produces a ledger-valid canon fragment.
- Output that frames anything as an investment is blocked by the C1 gate.
- Game lineage/cult-favorites from G7 become in-world mythology.

## Handoff
L5 consumes ongoing canon to advance arcs/prophecies; the world now visibly responds to community activity.
