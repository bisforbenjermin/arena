# Glossary

Every label the forge uses, one line each. The repo's files are the authority; this is a reading aid.

## The world and the economy
- **ARENA**: the working name of the platform. The full name will be "[World name]: Arena" once the world is named (BR-1).
- **The Realm**: the placeholder name of the lore world until the founder chooses one (LR-1).
- **The Drain**: the lore's antagonist, wasted time. A condition, never a character, a face or a company (LR-4, BR-8).
- **Caches**: sealed rewards in the lore that open at community milestones. Shares go by skill-earned standing, never luck (LR-3).
- **Keys**: free entries or retries, usable only inside Arena and never transferable. Watching an ad earns one (MN-1).
- **Vault Points**: the lore-named loyalty credit. Never merged with Keys, never cash (CREDIT-1).
- **Firewall doctrine**: eligibility is never entitlement; marketing never frames anything as an investment; anything touching paid entry can be switched off per state.

## The contract
- **F1**: the GameModule contract in `contracts/`, which every game implements.
- **F4**: the two hand-built reference games, precision-tap and pressure-hold.
- **GameModule**: a game's default export: its meta block plus a sim half and a view half.
- **Sim and view**: the sim holds every rule and the score, and runs headless under Node. The view only draws and reads the sim (PR-3).
- **Tick**: one 1/60-second step of the sim. Input events are timestamped in ticks (PR-2).
- **Seed**: the number behind all of a round's randomness. Every player in a round shares it (PR-1).
- **speedMultiplier**: the round's speed dial, from casual qualifier to final.
- **themeOverride**: the slot a sponsor skin arrives through at runtime.
- **contractVersion and gameVersion**: version stamps. A balance change bumps gameVersion and starts a fresh score distribution (PR-4).
- **PR-1 to PR-6**: the frozen pre-rulings behind the contract.
  - PR-1: seeded randomness only, from the injected sfc32 generator.
  - PR-2: a fixed 1/60-second timestep; the contract owns the loop.
  - PR-3: the sim/view split. The server replays the event log, and its score is the real one.
  - PR-4: version keying.
  - PR-5: cold start. A new game doesn't rank until it has 200 real scores from at least 30 players.
  - PR-6: the tilt control scheme is reserved and unimplemented.

## The game factory (specs G1 to G7)
- **G1**: generation, the agent that invents games. The forge is a founder-supervised version of it.
- **G2**: the sandbox and compile gate.
- **G3**: bot playtests that measure the skill gradient and reject luck games.
- **G4**: quality scoring, automatic metrics plus a model judge rating fun, clarity and surprise.
- **G5**: provenance, license and similarity gates.
- **G6**: the human taste gate before a game enters the live pool.
- **G7**: telemetry that evolves winners and retires duds.
- **C3**: the skill-evidence compliance record built from G3's runs.

## Rulings and canon rules
- **DECISIONS**: `governance/10-CANON/DECISIONS/`, one file per founder ruling. It outranks everything else.
- **CANON-2**: the October 20 canon update. Its rules carry IDs:
  - BR-1: the name structure "[World name]: Arena".
  - BR-3: the neon-noir look, the same as BRAND-2.
  - BR-4: readability first; body text 18px or larger.
  - BR-6: the mission, "Reward gamers for their time." Every feature must reward players.
  - BR-8: the enemy is wasted time, never corporations.
  - BR-9: Arena is competitive gaming; esports is only the broadcast layer on big finals.
  - MN-1: ads earn Keys; prizes go only by skill.
  - MN-4: the revenue order, ending with licensing the factory's certified skill games.
  - MN-7: retention before prize scale, with day-1, day-7 and day-30 return targets.
  - LG-4: no native app without counsel's opinion. A free prize app has been rejected as real-money gaming.
  - LG-6: marketing never frames Arena as a way to make money or as an investment.
  - LR-1, LR-3, LR-4: lore rules on the world name, Cache shares and the Drain.
  - QA-3: prize-pick data is only ever shared in aggregate, never as raw personal data.
- **BRAND-2**: the look ruling: crimson and cyan neon on near-black blue, the brand type families, large plain headings.
- **CREDIT-1**: the two-rail credit design, Keys and Vault Points.
- **CP-0**: the solvency gate. No prize event without a validated solvency model.
- **GTM-1**: the Liberation Run go-to-market ruling. GTM-4 makes venues one channel among many.
- **GTM-2**: broadcast-prize decoupling. Any plan where prize cost grows with audience size is rejected (the HQ Trivia lesson).
- **OPS-1**: the escalation rule (cost follows consequence) and the stop-and-hand-off list in `CLAUDE.md`.
- **OPS-2**: documents are superseded, never edited in place.

## House process
- **HANDOFF**: the block a forge emits instead of deciding something only the founder can rule on.
- **PROPOSED**: `governance/00-COMMAND/PROPOSED/`, drafts awaiting a ruling. Never canon.
- **FRICTION_LOG**: where agents log a doc that caused confusion. Three entries flag the doc for audit.
- **Ledger close**: the founder's end-of-session ritual, a one-line log entry and a commit.
- **Zero-IP rule**: only original work, or MIT, Apache-2.0 or CC0 material. Every game ships a provenance.json.
- **provenance.json**: a game's record of origin, licenses and IP checks.
- **skill-evidence.json**: a game's reproducible bot results, the proof that skill decides it.
- **Profile**: deep, strong or fast, the working style matched to a model's strengths.
- **Tag**: the short model name in file names and IDs, such as fable, gpt or grok.
