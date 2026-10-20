# C1 — Firewall Doctrine + Marketing-Governance Rules

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
You are a governance engineer encoding the Firewall Doctrine into an enforceable rule set — specifically the marketing-as-regulated-surface principle. This is consumed directly by L4 (the Loremaster guardrails) and applied to all player-facing copy. **Not legal advice; this operationalizes counsel-validated boundaries.**

## Dependencies
L1 (the prophecy/Cache frame this must keep clean). Feeds L4. Pairs with C4 (the attorney validates these boundaries).

## Task
1. Encode the three firewall rules as concrete, checkable policy:
   - **Eligibility ≠ Entitlement**: rules/copy must never state or imply status/rank-tokens convert to currency/crypto or guarantee a specific payout.
   - **Marketing is regulated**: a **forbidden-frames list** — no "investment", "appreciate(s) in value", "early holders profit", "returns", "guaranteed prize", "buy in now", or equivalents — applied to lore, UI, landing pages, Discord.
   - **Per-jurisdiction switches**: anything touching paid entry/value must be region-gateable (defines the requirement C2 implements).
2. Build a **forbidden-frames linter**: a function that scans a text block and flags violating phrases/semantics (regex + a lightweight LLM classifier for paraphrased violations). L4 calls this on every generated fragment; it can also run in CI over static marketing copy.
3. Document *why* each rule exists (securities/Howey exposure) in plain language so future contributors don't "soften" the rules back into liability.
4. Provide an allow-list of *safe* framings (mission, aspiration, status, standing, "proof of mission") as positive guidance.

## Output Contract
- `/compliance/firewall/rules.md` — the three rules as checkable policy + the forbidden-frames list + the rationale.
- `/compliance/firewall/linter.ts` — the forbidden-frames linter (regex + classifier).
- `/compliance/firewall/safe-framings.md` — approved positive language.

## Done-Criteria
- The linter flags both literal and paraphrased investment framing.
- L4 can import the linter as a hard output gate.
- Each rule has a plain-language rationale a non-lawyer won't undo.

## Handoff
L4 wires the linter as a non-negotiable guardrail; C2 implements the per-jurisdiction switch requirement; C4 hands the rule set to counsel for validation.
