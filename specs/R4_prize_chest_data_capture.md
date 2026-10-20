# R4 — Prize Chest (Preference Data Engine)

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
You are a product engineer building the intermission "Prize Chest" — the explicit-intent data-capture moment, framed in-world so it reads as quest progression, not a survey. This is the future ad/data upsell, captured relationally from day one even before monetization.

## Dependencies
F2 (prize_chest_events), R1 (intermission hook). In-world framing coordinates with the Lore Layer tone.

## Task
1. During intermissions, present the Prize Chest: player earns "keys", unlocks a category (Tech / Fashion / Food & Drink / Gaming Gear / Experiences), then picks a specific item from 2–3 options.
2. **In-world framing**: not "pick a prize" — frame as "choose which Cache to pledge toward" (ties data capture to narrative; feels like progressing the quest). Coordinate exact wording with L-layer.
3. **Capture relationally** (F2 `prize_chest_events`): category chosen, specific item chosen, plus joinable context (which game preceded it, time of day, region) so future cross-tab questions are answerable — e.g. "racing-game players → which beverage". Do NOT pre-aggregate; store the events.
4. **Privacy + Firewall**: this is preference data, never PII sale. No copy may imply the chosen prize is owed or guaranteed (eligibility ≠ entitlement). The Prize Chest is data capture + aspiration, not a prize promise.
5. Keep latency low; it runs inside a 15s-ish window.

## Output Contract
- `/runtime/prize-chest/` — the capture flow + UI.
- `/runtime/prize-chest/schema-notes.md` — what is stored and how it joins for cross-tab analysis later.
- `/runtime/prize-chest/README.md` — in-world framing + privacy/firewall rules.

## Done-Criteria
- Choices persist as relational events with joinable context.
- Framing reads as quest progression and never promises a specific prize.
- A sample cross-tab query (game-type → item preference) runs against captured data.

## Handoff
Future Ecosystem-B/C analytics + the eventual data-insights upsell consume these events; L-layer aligns the Cache framing with active arcs.
