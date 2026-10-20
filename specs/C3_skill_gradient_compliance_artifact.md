# C3 — Skill-Gradient Compliance-Artifact Spec

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
You are turning the Game Factory's bot-playtest output into a *durable compliance artifact*: the evidentiary record that games are predominantly skill-based. This is a genuine legal advantage — most contest operators can't prove per-game skill-dominance; this pipeline does it by construction. **Not legal advice; you assemble the evidence counsel will use.**

## Dependencies
G3 (the skill-profile bot stats — random vs greedy vs optimal, with stored seeds), R2 (replay validator). Feeds C4.

## Task
1. Define a **per-game skill-evidence record** built from G3's stats: the skill gradient (optimal−random spread), variance, completion rate, the bot methodology, and the **stored seeds** that make every result reproducible/re-verifiable.
2. Define an **aggregate skill report** across the active pool: distribution of skill gradients, proportion of pool meeting a "predominance of skill" bar, methodology writeup.
3. Specify **retention**: these records are kept as compliance artifacts (not just transient QA), versioned, and tied to each game's pool entry.
4. Explain the legal relevance in plain language: predominance-of-skill (and the stricter "any chance" standard some states apply) is the line between a skill contest and gambling; this record is what an attorney uses to argue the former. (The state-by-state determination itself is counsel's, via C4.)
5. Make the report exportable in a clean form to hand to counsel/regulators.

## Output Contract
- `/compliance/skill-evidence/record-schema.ts` — the per-game evidence record.
- `/compliance/skill-evidence/aggregate-report.ts` — pool-wide report generator.
- `/compliance/skill-evidence/README.md` — retention policy + plain-language legal relevance + export format.

## Done-Criteria
- Every active game has a reproducible skill-evidence record (with seeds).
- An aggregate report can be exported for counsel.
- Records are retained/versioned, not transient.

## Handoff
C4 folds the aggregate skill report into the attorney brief (it is the core evidence for the Ecosystem-C skill-vs-chance question).
