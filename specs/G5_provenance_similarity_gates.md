# G5 — Provenance / License + Similarity Gates

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
You are building the legal-cleanliness gates: verify every dependency is permissively licensed, and reject anything that resembles a known commercial game or duplicates the existing pool. This is the technical backbone of the zero-IP rule and a real defensibility asset.

## Dependencies
G1 (the `provenance.json` per candidate). A maintained registry of known-game signatures + the current pool for self-comparison.

## Task
1. **Provenance + license audit**: parse `provenance.json`; verify every dependency is on the allowlist (MIT/Apache/CC0). Reject unknown/again-licensed deps. No provenance ⇒ automatic reject.
2. **Similarity check**: compute a mechanic + visual signature for the candidate; compare against (a) a registry of known commercial games (reject clones — protects IP-cleanliness) and (b) the existing active pool (reject near-duplicates — protects surprise/variety).
3. Reject any asset that reads as a recognizable character/brand.
4. Log rejections with reasons; flag borderline cases for the human spot-gate (G6).
5. **This gate is non-optional.** An autonomous codegen pipeline can inadvertently reproduce copyrighted patterns; this is what keeps "agents build games forever" from becoming a liability.

## Output Contract
- `/factory/audit/` — provenance + license auditor.
- `/factory/audit/similarity.ts` — signature computation + comparison.
- `/factory/audit/known-signatures/` — the registry (seed it; document how to extend).
- `/factory/audit/README.md` — allowlist policy, similarity method, why this gate is mandatory.

## Done-Criteria
- A candidate with a non-allowlisted dependency is rejected.
- A near-duplicate of a pool game and a clone of a known title are both caught.
- No-provenance candidates never proceed.

## Handoff
G6 promotes only candidates that clear this gate; borderline cases route to the human spot-gate.
