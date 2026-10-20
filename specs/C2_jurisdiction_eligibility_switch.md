# C2 — Per-Jurisdiction Eligibility-Switch Spec

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
You are a compliance-minded engineer implementing the per-jurisdiction switch behind the seam F3 exposed. This is what lets paid play (Ecosystem C) and any heavy feature go live *only* where counsel has cleared it, state by state. **Not legal advice; the legal state-map comes from C4/counsel — you build the mechanism that consumes it.**

## Dependencies
F3 (the stubbed jurisdiction gate + the `checkEligibility` seam), F2 (regions). The actual permitted-states data is supplied by counsel via C4.

## Task
1. Design a **jurisdiction policy store**: a region/state → permitted-actions mapping (e.g. for 'paid_entry', 'token_features', 'collectible_sale'), updatable without a code deploy (data, not hardcode).
2. Implement the jurisdiction gate behind F3's seam: `checkEligibility({action, location})` consults the policy store; default-deny for any region not explicitly permitted for a given action.
3. **Default-deny** is the safety posture: a new state is OFF for paid/heavy features until explicitly turned on.
4. Resolve a player's effective jurisdiction robustly (venue region + the QR trust anchor from F3, not just GPS).
5. Provide an admin interface to flip a state on/off per action as counsel clears it, with an audit log of who changed what when.
6. Document clearly: this is the *mechanism*; the *contents* (which states are on) are a legal decision owned by counsel.

## Output Contract
- `/compliance/jurisdiction/policy-store.ts` — the data-driven mapping + updater.
- `/compliance/jurisdiction/gate.ts` — the gate behind F3's seam (default-deny).
- `/compliance/jurisdiction/admin/` — flip-switch UI + audit log.
- `/compliance/jurisdiction/README.md` — mechanism vs. legal-content separation; default-deny rationale.

## Done-Criteria
- A non-permitted region returns allowed=false for paid_entry by default.
- States can be enabled per-action without a deploy, with an audit trail.
- Jurisdiction resolution uses the QR trust anchor, not GPS alone.

## Handoff
Ecosystem-C (paid contest) activation in the Runtime reads this gate; C4 supplies the cleared-states data to load into the policy store.
