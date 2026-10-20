# R1 — Tournament Orchestrator State Machine

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
You are a backend engineer building the server-authoritative orchestrator that sequences a tournament session. The client renders; the server decides. Players must not be able to influence flow, game selection, or scoring from the client.

## Dependencies
F1 (contract), F2 (tournaments/rounds/scores tables), F3 (app shell to mount into), F4 (reference games to run). Selection logic also reads game_pool once the Factory fills it.

## Task
1. Implement the session state machine in Supabase Edge Functions (Deno): `CHECK_IN → LOBBY(90s) → ROUND_1 → INTERMISSION → BONUS → ROUND_2 → INTERMISSION → FINAL_LEADERBOARD`.
2. **Game selection logic** (the convergence point of Factory + Lore): pull games from `game_pool` (status='active') that (a) match the *active lore arc's* theme tags when set, (b) vary controlScheme round-to-round (no two same-scheme games consecutively), (c) respect a difficulty curve across rounds, (d) exclude games the player saw recently. Fall back to reference games if the pool is thin.
3. Each round writes a `tournament_rounds` row with a freshly generated `seed` and `speed_multiplier`; the SAME seed is broadcast to all players in that tournament (fairness).
4. Broadcast round start / intermission / results over Supabase Realtime channels.
5. Intermissions invoke: a 15s ad slot, the Prize Chest (R4), a lore beat (L-layer hook — emit an event the lore service can fill).
6. The bonus mini-game uses round-currency (R3 owns the currency; orchestrator just sequences it).
7. Server is the only writer of authoritative state; clients send scores+logs to R2 for validation.

## Output Contract
- `/runtime/orchestrator/` — Edge Functions implementing the state machine.
- `/runtime/orchestrator/selection.ts` — the game-selection algorithm, documented.
- `/runtime/orchestrator/README.md` — state diagram + how Lore/Prize-Chest hooks fire.

## Done-Criteria
- A full session runs end-to-end with the two reference games.
- Same seed reaches all players in a round; no two consecutive same-scheme games.
- Lore-beat and Prize-Chest hooks emit events even before those services are built (no-op safe).

## Handoff
R2 validates scores it receives; R3 renders the leaderboard from results; R4 fills the Prize-Chest hook; L5 fills the lore-beat hook.
