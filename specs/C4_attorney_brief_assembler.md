# C4 — Attorney-Brief Assembler

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
You are assembling the structured brief a licensed securities/fintech/gaming attorney receives, so their engagement *validates a coherent structure* rather than inventing one at high cost. **This is explicitly not legal advice — it is the question set + evidence package for counsel.** Its purpose is to make legal review cheap, fast, and focused.

## Dependencies
C1 (firewall rules to validate), C3 (skill-evidence aggregate report), plus the ecosystem/corporate structure from the project's build+legal architecture. Outputs feed C2 (counsel returns the cleared-states data).

## Task
Compile a single brief containing:
1. **The structure**: the five walled ecosystems (A–E), the launch-left-to-right sequencing, and the proposed corporate shape (Delaware C-corp holdco + opco; conditional ring-fenced subsidiaries for C/E).
2. **The ordered question set** for counsel:
   - Entity + whether to ring-fence C/E.
   - Ecosystem A: confirm non-convertible status carries no prize/securities surface; validate eligibility-≠-entitlement ToS language (attach C1 rules).
   - Ecosystem B: MSA template; per-state prize-value registration/bonding thresholds for no-fee skill contests.
   - Ecosystem C: the **state map** (which states permit paid skill contests; which apply the stricter "any chance" test; which prohibit); registration; whether holding entry fees triggers money transmission. **Attach the C3 aggregate skill report as evidence.**
   - Narrative reservoir: does a transparent, public revenue-share-to-prize-pool commitment stay clear of being an investment promise, and how must it be worded?
   - Ecosystem D: when does a lore-tied collectible's design+marketing become a security vs. digital merch? What marketing is forbidden? (cross-ref C1).
   - Ecosystem E: full Howey analysis; registration vs. exemption; money-transmission/MSB/AML obligations; realistic cost + timeline; at what scale it makes sense.
   - AI-generated IP: ownership/authorship of agent-generated games + lore; sufficiency of the provenance manifest as chain-of-title.
   - Insurance: GL (venues as additional insured) + E&O; what underwriters need.
3. **A return-data spec**: define the format in which counsel returns the cleared-states list so it loads directly into C2's policy store.

## Output Contract
- `/compliance/attorney-brief/BRIEF.md` — the structure + ordered question set + attached evidence references.
- `/compliance/attorney-brief/cleared-states-format.md` — the schema for counsel's answer that C2 ingests.
- `/compliance/attorney-brief/README.md` — how to keep the brief updated as the build evolves; the not-legal-advice framing.

## Done-Criteria
- The brief is self-contained enough that an attorney can quote-and-validate without a long discovery call.
- The C3 skill report is attached to the Ecosystem-C question.
- Counsel's cleared-states answer maps 1:1 into C2's policy store.

## Handoff
Counsel's answers gate Ecosystem activation (per the legal gates in the INDEX); the cleared-states output flows into C2; firewall confirmations feed back to C1/L4.
