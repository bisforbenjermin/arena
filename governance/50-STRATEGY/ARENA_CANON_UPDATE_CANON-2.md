# Arena Canon Update

Oct 20, 2026 · @benjamin

## What this is

This is canon update 2 (CANON-2), dated October 20, 2026. It folds the Arena Board Review and this session's corrections into the rules that every brief, deck, spec and agent prompt follows from here on.

- **Where it sits.** It amends the build preamble (the shared rules at the top of every build doc), the lore bible draft (the human-written core of the story), and the July 30 Liberation Run decision record. Anything here that contradicts those documents wins. Anything not mentioned here stays as it was.
- **How to use it.** Paste the ledger delta at the end of section 8 at your next ledger close. Use the prompts in section 9 to hand each next piece of work to a fresh Claude session.
- **Labels.** Every rule carries an ID such as BR-1, so prompts and future rulings can point to it. Where a rule replaces an old one, it says what it replaces.

## 1. Brand and identity

The brand is the lore world, and Arena is the place inside it where you compete. The positioning leads with one feeling, then the machine, then the quest.

| ID | Rule | Replaces or why |
| --- | --- | --- |
| BR-1 | Name structure is "\[World name\]: Arena." ARENA is the working wordmark until the world name is chosen and cleared. | Replaces "ARENA" alone. "Arena" is crowded in gaming (MTG Arena, Arena of Valor, Arena Breakout). |
| BR-2 | No brand money is spent before a trademark attorney's clearance search on the world name. | Board, consumer growth CMO |
| BR-3 | Look: neon-noir arcade. Crimson neon (#E0103A, bright #FF3355) and cyan (#2DE2E6) on near-black blue (#07080F). Pixel wordmark, Chakra Petch headings, Atkinson Hyperlegible body text. | Replaces hot pink and the brass direction. Steampunk lives in details, not the base palette. |
| BR-4 | Readability first. Headings are large and plain, never small-print labels, and body text is 18px or larger. | Your correction |
| BR-5 | Core line: "Play is the engine. Loot is the point." | Retires "a reward engine disguised as an esports platform." "Disguised" contradicts transparency and hands regulators their argument. |
| BR-6 | Mission stays: "Reward gamers for their time." Every feature must answer "does this reward players?" | Unchanged |
| BR-7 | "We know ads aren't fun. They're how we buy you more loot" is brand voice for marketing and onboarding only, never on or beside an ad unit. | Google AdMob bans wording that nudges people to watch. |
| BR-8 | The enemy is wasted time (the Drain), never corporations. No "anti-corporate" positioning. | Board: you can't attack the companies you ask to sponsor you. |
| BR-9 | Arena is competitive gaming. Esports is only the broadcast layer on big finals. | Board, esports league CEO |
| BR-10 | Never claim "everyone gets paid except the player" or "≈ $0." Lead with sourced facts: 444 billion hours and $103 billion spent on mobile games in 2025, and nobody has built an economy that pays players back. | Overstated, and contradicted by Mistplay |

## 2. Product

Players pick their prizes first, then win them with skill against peers, in rounds everyone plays identically.

| ID | Rule | Replaces or why |
| --- | --- | --- |
| PD-1 | Step one is "Pick your prizes": a grand prize plus backups. | Was "Pick your prize" |
| PD-2 | Every player in a bracket plays the identical round sequence from the same seed. This is ruling PR-1 (the seeded random generator), now marked non-negotiable for legal reasons. | Board, counsel: different rounds per player lets a regulator argue chance decides |
| PD-3 | Skill brackets: average players compete against peers for prizes they can realistically win. | Board, esports CEO: the top 1% would otherwise win everything |
| PD-4 | A stable core rotation for ranked play, with wildcard rounds on top. | Random-only rounds leave nothing to master |
| PD-5 | Before any prize over $1,000: device checks, replay review and identity checks. Big finals run live, in person or on camera, on Arena's own devices. | Board, esports CEO and counsel |
| PD-6 | Named games (Donkey Kong, Mario, Subway Surfers) appear only as "think Donkey Kong" shorthand for a feel. Built games stay zero-IP, with no recognizable clones. Licensed rounds are a later option, never a launch need. | Your call to keep the names, reconciled with the build specs' zero-IP rule |
| PD-7 | Arena Coin is teased only ("losing still pays"). No earning or redeeming ships until counsel clears the credit gate. | Ledger gate stays open |
| PD-8 | The game factory gets a human taste check before anything is promoted, uses a curated mechanic library with agent-made variations, and lets live play data evolve or retire games. Final-round games are hand-checked. | Board, AI CTO: playable isn't the same as fun |

## 3. Money

Sponsors and directly sold tournaments carry the revenue, ads are the floor, and an ad never pays out a prize.

| ID | Rule | Replaces or why |
| --- | --- | --- |
| MN-1 | Watching an ad earns a Key: a free entry or retry, usable only inside Arena and never transferable. Prizes are won by skill, never handed out for an ad view. | Replaces "watch ads, buy loot." Google AdMob bans cash, gift cards and transferable items as ad rewards ([source](https://support.google.com/admob/answer/7313578?hl=en)). |
| MN-2 | Read each ad network's reward policy before integrating it. | Board, ad-tech CRO |
| MN-3 | Model ad revenue at web rates (about $7–15 per thousand views in the US) until a native app ships. Cap ads per player per day. | The old calculator assumed native-app rates |
| MN-4 | Revenue order: (1) sponsored tournaments sold directly to brands, (2) sponsor prizes, in-kind first, (3) the ad floor, (4) venue and partner fees, (5) "a branded tournament in a box" for brands and operators, (6) licensing the factory's certified skill games. | Board pivots from the publisher CEO, ad-tech CRO and AI CTO |
| MN-5 | Sponsors get measurable outcomes: redemption codes, store check-ins, time spent with the brand. Each gets a one-page brand-safety sheet explaining the skill-based, free-entry structure. | Board, sponsorship CMO |
| MN-6 | Prize economics are unchanged and reaffirmed. Prizes are sourced 40–70% under retail or donated in-kind. A displayed prize costs nothing until it's won. Big prizes are insured or sponsored. No prize event runs without a solvency model (CP-0). | Paper vault doctrine and the CP-0 ruling |
| MN-7 | Retention comes before prize scale. Set day-1, day-7 and day-30 return targets and hit them in one market before spending on growth. | Board, publisher CEO: Skillz shrank despite a sound legal model |

## 4. The First Cache (launch quest)

Arena launches with a quest called The First Cache. One player wins a home or its cash value, decided by skill and funded before anything is announced. It's named after the First Cache in your lore bible, not "Game of Games," a phrase already tied to NBC's Ellen's Game of Games (2017–2021).

**How it runs (FC-1):**

1. Free online qualifiers, open anywhere.
2. City stages unlock as each city's players hit a milestone. Venues, campuses, sponsor stores and landmarks host them.
3. A live, broadcast final on Arena's own devices. The winner opens the Cache.

**How the home is funded (FC-2):**

1. A home-builder or prefab-home sponsor funds it, under contract before announcement.
2. If no sponsor signs by a set date, Arena runs a smaller guaranteed prize it can fund, such as a down payment, plus the full home as an insured bonus for a perfect run. That condition is stated plainly.
3. Ads never fund it. At web rates, a $300,000 home would take about 25 million ad views.

**Guardrails (FC-3):**

- Skill decides the winner, with no random draws.
- Free entry and published official rules.
- A cash alternative to the home, and tax forms collected at claim (prizes of $2,000 or more need a 1099-MISC from 2026).
- Quest stages only at public, partner or staffed locations, for players 18 and over.
- Plan the day after the final, so players who came for the home have a reason to stay.

**Effect on the Liberation Run (FC-4).** This replaces the Liberation Run's one-venue start (the "Fortress"). It keeps the Liberation Run's milestone-unlocked city ladder and its locked HQ doctrine: viewers are free, and prize cost never grows with audience size. The First Cache passes that test because its prize is fixed in advance. A superseding decision record is still needed (section 8).

## 5. Legal and compliance

The structure stays compliant by design: skill decides, entry is free, and prizes are covered before they're shown. The board added seven rules. None of this is legal advice, and counsel signs off before any paid or random element ships.

| ID | Rule | Why |
| --- | --- | --- |
| LG-1 | Caches are split by skill-earned standing, never by random draw. If a draw is ever used, it runs as a registered sweepstakes. | A random draw is a sweepstakes. New York and Florida require registration and a bond above $5,000 in prizes ([source](https://blog.sweeppea.com/sweepstakes-regulations-new-york-florida/)). |
| LG-2 | Big prizes come with a cash alternative or a tax gross-up, and tax forms are collected at claim. | 1099-MISC threshold of $2,000 from 2026 ([source](https://www.verrill-law.com/blog/the-new-2000-threshold-for-sending-irs-form-1099-misc-to-prize-winners/)) |
| LG-3 | Sponsor data is opt-in and aggregated by default, and raw personal data is never sold. Honor California's "do not sell or share" opt-out. | California privacy law treats cross-site ad use of personal data as sharing |
| LG-4 | Stay web-first. Go native only with counsel's opinion and in-app official rules stating that Apple isn't a sponsor. | Apple guideline 5.3. A free prize app was rejected as real-money gaming in May 2026 ([source](https://developer.apple.com/forums/thread/825845)). |
| LG-5 | Real-world quest stages: public, partner or staffed locations only, 18 and over, with waivers. | Trespass and injury liability |
| LG-6 | Marketing never frames Arena as a way to make money or as an investment, and never promises an individual outcome. "Someone will win this home" commits to the event, not a person. | Reaffirms the marketing firewall (build doc C1) |
| LG-7 | Investor materials stay in private links, never posted publicly, and carry the line "not an offer to sell securities; plans and projections are not promises." | General practice when talking to investors |

## 6. The quiet asset and lore

**The quiet asset (QA-1 to QA-3).** Every prize pick is a player saying, out loud, what they want next. That makes it the most valuable data Arena will hold, and it stays behind brand and traction in every pitch.

- **QA-1.** It's data players hand over on purpose: opt-in demand signals, not tracking.
- **QA-2.** It's sold to sponsors as aggregated insight, such as "your product was picked as the prize 12,000 times this month." Sponsor pitches lead with that number.
- **QA-3.** It's never raw personal data, and it follows LG-3.

**Lore changes (LR-1 to LR-5).** These amend the lore bible draft.

- **LR-1.** The world name chosen under BR-1 replaces "the Realm." Until then, "the Realm" stays as the placeholder.
- **LR-2.** The First Cache is the launch quest (section 4). The community milestone opens the Cache, and the quest's final decides who claims it, by skill.
- **LR-3.** Every Cache follows LG-1: shares go by skill-earned standing, never by luck. This tightens fixed truths 5 and 6 (sealed Caches; nobody is owed one).
- **LR-4.** The Drain stays a condition (wasted time), never a company or a face. Fixed truth 1, reinforced by BR-8.
- **LR-5.** Keys, the free entries, are also the in-world way into a Cache. Earned standing decides who claims what's inside.

## 7. Investor materials

There are two versions: a scrolling page for casual investors ("Arena First Look"), and a pitch deck for VCs. Neither asks for money, and both share the look and rules above.

- **IV-1. Audience.** The friend version ("ARENA," October 19) is retired. Both new versions are written for investors.
- **IV-2. No ask.** You're not raising yet. Both versions open with an early look and close by asking for the reader's view, with no round size or terms.
- **IV-3. Where it stands.** This is left out until after your build sprint. A slot is saved in both versions.
- **IV-4. The board stays private.** Its findings appear as a frank "Risks and how we handle them" chapter, never as a board.
- **IV-5. Founder framing.** Balanced and confident. Lead with AI strategy work for companies (FASO) and hands-on AI infrastructure: model routing and inference-cost optimization. That expertise is exactly what an agent-run game factory needs. Show that one founder designed the whole system: the game factory, tournament engine, lore layer and compliance design. Political science appears as one line, tied to how the compliance was designed. Other ventures and personal circumstances stay out.

**The casual page, 14 chapters (chapters 1 and 2 are drafted):**

1. The short version
2. What Arena is
3. How it plays
4. The game that builds itself
5. The First Cache
6. The prizes
7. Who wins (with graphics for each side)
8. How the money works
9. The quiet asset
10. Built to stay legal
11. Why now
12. Risks and how we handle them
13. The founder
14. Where it goes

**The VC deck, 15 slides:** title, the gap, the product, the game that builds itself, the First Cache launch, who wins, business model, unit economics (labeled illustrative), market size, competition, why now, moat, risks and how we handle them, founder, and where it goes.

**The prize lineup across both:** the Grand Quest, life prizes (rent, tuition, a down payment), "your name in the machine" (winners get a game built in their honor), community Caches split by standing, money-can't-buy experiences, and the pick-your-prize catalog.

## 8. Open decisions

Five calls are still yours, and the first two block later work.

- [ ] **World name.** Candidates: Freehold, Arclight, Quarterlight, Elsewhere. This blocks BR-1 and LR-1.
- [ ] **Supersede the Liberation Run.** Run a full-weight decision session (the escalation rule) to adopt FC-4. This blocks the launch sequence in every brief.
- [ ] **Trademark clearance** on the chosen world name (BR-2).
- [ ] **Home sponsor.** Pick target sponsors and a sign-by date (FC-2).
- [ ] **Where it stands.** Write it after the sprint (IV-3).

**Ledger delta, to paste at the next close:**

```markdown
## DELTA — CANON-2 (2026-10-20)
DECISIONS (ruled):
- 2026-10-20 — CANON-2 adopted: board review + session corrections folded into canon (doc: Arena Canon Update). Supersedes conflicting lines in 00_PREAMBLE, L1_bible_DRAFT, GTM1.
- Name structure "[World]: Arena"; ARENA = working wordmark (BR-1).
- Look: neon-noir arcade, crimson + cyan (BR-3).
- Ads earn Keys only; prizes only by skill (MN-1).
- Launch quest = The First Cache, home-or-cash-value, sponsor-first (FC-1..FC-3).
DECISIONS (pending):
- World name (BR-1/LR-1). Supersede GTM-1 Fortress start with FC-4 (max-weight session).
GATES: unchanged (credit gate OPEN; crowdfunding gate OPEN).
NEXT:
1. World name pick + clearance search.
2. GTM-3 decision record (supersede Liberation Run Phase 1).
3. Finish Arena First Look ch. 3–14; then VC deck.
4. CP-0 solvency model now includes First Cache funding scenarios.
```

## 9. Prompts for Claude

Each prompt is a self-contained packet in your house format (role, dependencies, task, output contract, done criteria, handoff, status block). Paste it into a fresh chat in the ARENA project. Prompts 1 and 2 build the investor materials, 3 to 5 clear the open decisions, and 6 to 8 are support work.

**1. Finish the casual investor page**

```text
ROLE: Writer-designer for ARENA investor materials.
DEPENDENCIES: Arena Canon Update (https://claude.ai/code/artifact/620bb8f0-0626-41b8-b620-daae08dfd6c1) is binding. Arena First Look page (https://claude.ai/artifact/T5dK4QmuuhUJMvA7r5rxB3), chapters 1–2 drafted. Arena Board Review (https://claude.ai/code/artifact/d198b5eb-9a38-4ad1-a290-9d47fb45a7ae) for evidence.
TASK: Read the canon and the page. Write the next chapter in the 14-chapter outline (IV-5 list), matching chapters 1–2 in voice, look (BR-3) and readability (BR-4). One chapter per turn; wait for my approval before the next. Chapter 7 needs a graphic per side of the marketplace. Chapter 13 follows IV-5 exactly.
OUTPUT CONTRACT: The same artifact republished with the new chapter; the chapter menu updated; sources added for every number.
DONE CRITERIA: No claim contradicts canon; every number sourced or labeled an assumption; readable at phone width.
HANDOFF: Tell me in one line what's new and which chapter is next.
STATUS BLOCK: TASK / STATUS / OUTPUTS / OPEN QUESTIONS.
```

**2. Build the VC deck**

```text
ROLE: Pitch-deck builder for ARENA.
DEPENDENCIES: Arena Canon Update (binding), the finished Arena First Look page, Arena Board Review.
TASK: Build the 15-slide VC deck in section 7 of the canon, look BR-3. Research and cite market size and competitors (Mistplay, Skillz, Papaya Gaming, AviaGames, Niantic sponsored locations). Unit economics are labeled illustrative and built on canon numbers (MN-3, MN-6, FC-2). No ask slide (IV-2). Leave a "Where it stands" slot (IV-3).
OUTPUT CONTRACT: One deck artifact plus a list of every source used.
DONE CRITERIA: Each slide makes one point at a glance; no invented traction; risks slide mirrors the board's three kill risks.
HANDOFF: The deck link and the three slides you're least sure of.
STATUS BLOCK: TASK / STATUS / OUTPUTS / OPEN QUESTIONS.
```

**3. Pick and check the world name**

```text
ROLE: Brand-naming analyst for ARENA.
DEPENDENCIES: Arena Canon Update BR-1, BR-2, LR-1. Candidates: Freehold, Arclight, Quarterlight, Elsewhere, plus any I add.
TASK: For each candidate, search for conflicts in games, apps, entertainment and promotions; check obvious domain and handle use; score fit with the lore (reclaimed time, the Drain, Caches) and the neon-noir look. Propose up to three new candidates if all fail.
OUTPUT CONTRACT: A ranked table with name, conflicts found (linked), fit, and recommendation. State clearly that this is not a trademark clearance.
DONE CRITERIA: Every conflict claim links its source.
HANDOFF: Your top pick and the exact question to bring to a trademark attorney.
STATUS BLOCK: TASK / STATUS / OUTPUTS / OPEN QUESTIONS.
```

**4. Write the decision record that supersedes the Liberation Run start**

```text
ROLE: Command-center decision writer (max-weight session under the escalation rule).
DEPENDENCIES: GTM-1 Liberation Run decision record (July 30), GTM-2 broadcast-prize decoupling (locked), Arena Canon Update section 4 (FC-1 to FC-4), Arena Board Review floor debates 1 and 2.
TASK: Write GTM-3: The First Cache replaces the Fortress start. Score it against GTM-1's criteria, show it passes GTM-2, carry over the checkpoints (CP-0 to CP-3 and the tripwire), and add a sponsor sign-by checkpoint.
OUTPUT CONTRACT: GTM3_first_cache.md in the house decision-record format, plus a ledger delta block.
DONE CRITERIA: Every superseded line in GTM-1 is named; nothing frozen is edited in place.
HANDOFF: The delta block, ready to paste at close.
STATUS BLOCK: TASK / STATUS / OUTPUTS / OPEN QUESTIONS.
```

**5. Build the solvency model (CP-0)**

```text
ROLE: Prize-economics modeler for ARENA.
DEPENDENCIES: Paper vault doctrine, CP-0 ruling, Arena Canon Update MN-1, MN-3, MN-6, FC-2.
TASK: Build the solvency model as a spreadsheet: nightly and weekly prize floors and ceilings, cost per witnessed win, ad floor at web rates, sponsor in-kind share, and three First Cache funding scenarios (sponsor home; down payment plus insured home; no sponsor). Every input is editable and labeled with its source or "assumption."
OUTPUT CONTRACT: A spreadsheet artifact plus one paragraph on the break points.
DONE CRITERIA: Formulas, not pasted numbers; the scenario that trips the tripwire is flagged.
HANDOFF: The three numbers that most decide whether the First Cache is affordable.
STATUS BLOCK: TASK / STATUS / OUTPUTS / OPEN QUESTIONS.
```

**6. Update the lore bible**

```text
ROLE: Lore editor (the founder owns canon; you draft).
DEPENDENCIES: L1_bible_DRAFT.md, Arena Canon Update section 6 (LR-1 to LR-5), BR-8, LG-1, LG-6.
TASK: Draft the next bible revision: apply LR-1 to LR-5, write the First Cache as the first prophecy, and keep all eight fixed truths intact or mark any change as a proposal.
OUTPUT CONTRACT: The revised bible, with every change marked.
DONE CRITERIA: No investment framing anywhere (LG-6); Caches never split by luck (LG-1).
HANDOFF: The two changes I most need to approve.
STATUS BLOCK: TASK / STATUS / OUTPUTS / OPEN QUESTIONS.
```

**7. Draft the home-sponsor pitch**

```text
ROLE: Sponsorship writer for ARENA.
DEPENDENCIES: Arena Canon Update FC-1 to FC-3, MN-5, QA-2, LG-6.
TASK: Write a one-page pitch to a home builder or prefab-home brand to fund the First Cache home, plus the one-page brand-safety sheet (MN-5). Lead with what they get: national coverage, a winner's story, measurable reach.
OUTPUT CONTRACT: Two one-page docs.
DONE CRITERIA: No promise of audience numbers Arena doesn't have; skill-based, free-entry structure explained in plain words.
HANDOFF: Five target companies to approach first, with why.
STATUS BLOCK: TASK / STATUS / OUTPUTS / OPEN QUESTIONS.
```

**8. Re-run the board before a meeting**

```text
ROLE: Simulated board of seven archetypes (esports league CEO, mobile ad-tech CRO, mobile publisher CEO, brand sponsorship CMO, consumer growth CMO, skill-gaming general counsel, AI games CTO). Not real people.
DEPENDENCIES: Arena Canon Update, the material I'm about to present, the meeting's audience.
TASK: Critique the material as that audience would. Each seat gives a blunt critique, then a remedy, or a pivot if there's no fix. End with the five questions I'm most likely to get, and short answers grounded in canon.
OUTPUT CONTRACT: One doc, one section per seat.
DONE CRITERIA: Facts are linked; nothing contradicts canon without flagging it as a proposed change.
HANDOFF: The single weakest point to fix before the meeting.
STATUS BLOCK: TASK / STATUS / OUTPUTS / OPEN QUESTIONS.
```
