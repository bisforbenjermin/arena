# Arena Board Review

Oct 20, 2026 · @benjamin

## How to read this

Seven expert archetypes reviewed Arena before the brief gets rewritten. The board is simulated: Claude plays each seat, and none of them are real people. Treat it as a stress test, not an endorsement.

The board reviewed the original Master Context Document, the October 19 brief, the build specs (game factory, tournament runtime, lore layer, compliance), the rulings ledger, and the Liberation Run decision record from July 30.

Each seat gives a blunt critique, followed by a remedy set off as an aside. Where no fix exists, the seat offers a pivot that turns the problem into an advantage. Linked facts come from the sources at the end. Everything else is the seat's judgment.

## The board

Seven seats cover the four ways Arena can fail: players, money, law and the machine.

| Seat | Background | What they attack |
| --- | --- | --- |
| Esports league CEO | Ran a mobile esports league and tournament operator | Fair play, prize pools, whether players come back |
| Mobile ad-tech CRO | Revenue chief at an ad network | Ad rules, ad rates, fraud, whether ads can fund loot |
| Mobile publisher CEO | Ran a top-grossing casual games publisher | Retention, cost to win players, distribution |
| Brand sponsorship CMO | Marketing chief at a national consumer brand that buys gaming deals | Whether sponsors pay, and what proof they need |
| Consumer growth CMO | Built brand and growth at a breakout consumer app | Positioning, name, story, virality, go-to-market |
| Skill-gaming general counsel | Top lawyer at a skill-gaming and sweepstakes operator | Gambling law, sweepstakes rules, app stores, tax, privacy |
| AI games CTO | Tech chief at a studio shipping AI-generated games | Whether agents can make good games nonstop, cost, quality |

## Seat 1 · Esports league CEO

"You're calling this esports. It isn't, and that's fine, but stop calling it that."

**It's a game show, not esports.** Esports runs on crowds watching elite players master one game. Arena's rounds are 30-to-60-second micro-games in a random mix. Nobody streams a reaction test.

**Cheating will arrive with the first big prize.** Mobile play invites emulators, macros, bots, multi-accounting and collusion. Server-side scoring stops tampered scores. It can't prove a human tapped the screen.

**Skill tournaments concentrate winners.** If skill decides, the best 1% win almost everything. The other 99% figure that out within a week and leave.

**Random rounds kill mastery.** Players come back to get better at something. If nothing repeats, there's nothing to practice and no identity to build.

> **Remedy.** Split play into skill brackets so average players compete against peers for prizes they can win. Keep a stable core rotation for ranked play, with wildcard rounds on top. Before any prize over $1,000, add device checks, replay review and identity checks, and run big finals live on camera. Call the product competitive gaming. Esports is the broadcast layer on top of finals, not the product.

## Seat 2 · Mobile ad-tech CRO

"Your best line breaks the rules of the network you'd run it on."

**Ads can't pay out loot.** Google AdMob's policy says cash, crypto and gift cards may never be rewards for watching an ad. Items a person can hand to someone else aren't allowed either. A reward must be usable only inside your app and non-transferable. ([source](https://support.google.com/admob/answer/7313578?hl=en))

**Your slogan is a banned nudge.** The same policy bars wording that pushes people to watch, and gives "watch this ad to support our business" as an example. "They're how we buy you more loot," placed on an ad button, is that sentence.

**Your rates assume an app you don't have.** Arena is a web app. Web rewarded video runs about $7–15 per thousand views in the US. The $16–20 figures belong to native apps.

**Prizes attract fraud farms.** Bots watching ads get flagged as invalid traffic. Networks claw back revenue and can close the account.

> **Remedy.** An ad view grants a Key: a free entry or retry, used only inside Arena and never transferable. Prizes are won by skill in tournaments, never handed out for watching. Keep "We know ads aren't fun" as brand voice in onboarding and marketing, never on the ad unit. Model the calculator at web rates until a native app ships, cap ads per player per day, and read each network's reward policy before integrating.
>
> **Pivot.** Treat ads as the floor and sell whole tournaments to brands directly. A branded tournament is priced by you, under rules you set, with no network policy in between.

## Seat 3 · Mobile publisher CEO

"Prizes buy you a first visit. They don't buy a habit."

**Reward-seekers churn.** Prize apps attract people who want the prize, not the game. They leave the week the rewards feel out of reach. Skillz is the warning: Q4 2024 revenue fell 34.5% to $20.4 million, and paying users fell about 20% to 110,000. ([source](https://www.nasdaq.com/articles/skillz-earnings-miss-user-base-shrinks)) Skillz had the legal model solved and still shrank.

**The web app is a growth handicap.** No store featuring, a clumsy install on iPhone, and web push only after someone adds the app to their home screen.

**The App Store is no free pass either.** Apple's guideline 5.3 requires the developer to sponsor any contest and to show official rules saying Apple isn't involved. In May 2026, a free score-prediction app with promotional prizes and no entry fee was rejected as real-money gaming under 5.3.4. ([source](https://developer.apple.com/forums/thread/825845))

**Micro-games are judged in seconds.** Unless the craft is high, a stream of 30-second games feels like a knockoff party game.

> **Remedy.** Earn retention before scaling prizes. Set day-1, day-7 and day-30 return targets and hit them in one market first. Grow through the quest and creators, not paid ads. Stay web-first where you set the rules, and go native only with counsel's opinion and in-app official rules ready.
>
> **Pivot.** Your factory produces certified skill games. Sell "a branded tournament in a box" to brands and operators. That B2B revenue doesn't depend on winning the consumer acquisition war.

## Seat 4 · Brand sponsorship CMO

"I buy outcomes, not hope. But one thing in here I'd pay for tomorrow."

**No audience, no cash.** Until Arena has tens of thousands of engaged players, I'm not writing checks. I'll give product in-kind, and maybe not even that.

**I need receipts.** Who played, how long they spent with my brand, whether they redeemed, whether they came to my store. Pokémon GO sold store visits for under 50 cents each because it could count them. ([source](https://techcrunch.com/2017/05/31/pokemon-go-sponsorship-price))

**Brand safety comes first.** One headline calling Arena a gambling app and my logo comes down that afternoon.

**Prize picks are the gem.** If 40,000 people chose my cooler as the thing they want most, that's a stronger demand signal than anything my agency sells me.

> **Remedy.** Start with in-kind and local sponsors. Sell sponsored tournaments with measurable outcomes: redemption codes, store check-ins, time spent with the brand. Hand every sponsor a one-page brand-safety sheet that explains the skill-based, free-entry structure.
>
> **Pivot.** Lead every pitch with demand. "Your product was picked as the prize 12,000 times this month" sells the sponsorship before the deck opens.

## Seat 5 · Consumer growth CMO

"You have six stories. Great consumer brands sell one feeling."

**The pitch sprawls.** The brief sells rewards, esports, AR, lore, AI games and local commerce at once. A friend can't repeat that. Pick the one line a player says out loud, and make everything else proof of it.

**The name is crowded.** MTG Arena, Arena of Valor and Arena Breakout already live in gaming. You won't own the search results or an easy trademark. "Arena" also reads as hardcore, which scares casual players.

**Your best marketing asset is buried.** It isn't ad-funded prizes. It's the quest: a hidden prize, clues inside the games, players racing city to city. That's what press covers and what spreads on TikTok. Real treasure hunts have pulled national attention for decades.

**The enemy is wrong.** "Anti-corporate" while asking corporations to sponsor you is a tightrope. Your lore already has the better villain: wasted time, not companies.

> **Remedy.** Lead with one feeling (candidates: "Play for real loot" or "Every game could be the one"), then the machine, then the quest. Make the quest the launch story and the wasted-time villain the brand's enemy. Run a trademark search before spending a dollar on brand.
>
> **Pivot.** If Arena can't be owned, own the world instead. The lore's world becomes the trademarked brand, and Arena is the place inside it where you compete.

## Seat 6 · Skill-gaming general counsel

"The core structure holds up. Four details could each turn it into a sweepstakes or worse."

**Random rounds must be the same rounds.** "Nobody knows what comes next" is fine only if every player in a bracket gets the identical sequence. If rounds differ by player, a regulator can argue chance decides who wins. Your seeded random generator (ruling PR-1, which makes the same round play identically for everyone) already solves this. Keep it non-negotiable.

**Caches can become sweepstakes.** The lore says players with standing "share" what a Cache holds. If winners within that group are drawn at random, it's a sweepstakes. That means official rules, a free entry route, and in New York and Florida, registration plus a bond when prizes total more than $5,000. ([source](https://blog.sweeppea.com/sweepstakes-regulations-new-york-florida/))

**Big prizes carry tax paperwork.** From 2026, prizes worth $2,000 or more need a 1099-MISC, so you collect tax IDs from winners. ([source](https://www.verrill-law.com/blog/the-new-2000-threshold-for-sending-irs-form-1099-misc-to-prize-winners/)) A car winner owes income tax on the car, and some will turn it down.

**The quiet asset is regulated.** Using personal data for ads across other sites counts as "sharing" under California privacy law, and players can opt out.

**Real-world quests create liability.** Trespass, injury and private property. Real treasure hunts have ended in deaths.

> **Remedy.** Split Caches by skill-earned standing, not random draws. If a draw is ever used, run it as a registered sweepstakes. Offer a cash alternative or tax gross-up on big prizes, and collect tax forms at claim. Keep sponsor insights opt-in and aggregated by default. Place quest stages only at public, partner or staffed locations, 18 and over, with waivers. Arena Coin earning and redeeming stays behind its counsel gate.

## Seat 7 · AI games CTO

"The factory is your most defensible asset. It's also where you'll most easily fool yourself."

**Playable isn't fun.** Agents can generate playable micro-games today. Most output will be the same five mechanics in new paint. Your bot playtests prove skill decides the winner. They don't prove anyone enjoys it.

**Generation is cheap; testing isn't.** Each candidate gets compiled, sandboxed and played hundreds of times by bots before promotion. Track compute cost per promoted game from day one.

**"Uniquely hosts the whole thing" is true for now, not forever.** Others are building AI game generation and hosted tournaments. The defensible part is the closed loop: games generated, played for real stakes by real people, measured, evolved and written into the lore. Real-stakes play data is what a copycat won't have.

**The named games contradict your own rules.** Your build specs ban recognizable "inspired-by" clones. "Donkey Kong-style" is fine as shorthand for a feel. A factory output that actually looks like Donkey Kong is a legal letter waiting to happen.

> **Remedy.** Keep a human taste check on what gets promoted, and build from a curated library of mechanics with agent-made variations. Let live telemetry evolve winners and retire duds fast. In the brief, keep the named games as "think Donkey Kong," not as a promise of the game itself.
>
> **Pivot.** Skill-game operators need proof their games are skill-based. A factory that generates, tests and certifies skill games is a product other operators would license.

## Floor debate: how Arena should grow

The board recommends keeping the Liberation Run's engine and doctrine but swapping its venue-only shape for a quest. Play is online anywhere, and the quest opens city by city.

**What's on the table.** The Liberation Run, ruled July 30, starts at one venue ("the Fortress"). New venues are "liberated" when the community hits milestones, and every win is broadcast. Its doctrine: viewers are free, players are geofenced, prizes are set per room. Your newer vision is a perpetual quest that sends players across the country, with bars as one channel among many. Those two pull in different directions.

| Option | How it works | Board for | Board against |
| --- | --- | --- | --- |
| Liberation Run as ruled | One venue, then a milestone-gated venue ladder, broadcast throughout | Counsel (one geofenced state, easiest compliance), sponsorship CMO (countable store visits), esports CEO (in-person finals stop cheaters) | Publisher CEO and ad-tech CRO: venue nights can't produce the player volume the factory and ad floor need |
| App-first national launch | Online play everywhere, big prizes from day one | Ad-tech CRO (scale), AI CTO (real-play data fast) | Counsel, publisher CEO, growth CMO: expensive acquisition, fraud at scale, no story, and it brushes against the HQ pattern |
| Quest-first hybrid (recommended) | Play online anywhere. Quest stages unlock city by city on community milestones. Each city's prize event has a fixed budget. Broadcasts are free to everyone | Growth CMO (the launch story), publisher CEO (volume), esports CEO (finals stay live and verified), counsel (one city at a time) | Sponsorship CMO wants venue proof first. Answer: venues, campuses and sponsor stores become quest stages |

**Why the hybrid still passes your locked HQ test.** The test (ruling GTM-2) rejects any plan where prize cost grows with audience size. In the hybrid, each city's prize event is budgeted in advance and insured if large. Audience growth only adds viewers, players and ad revenue, never prize cost.

**For the brief.** Keep growth to a line or two and let the quest carry the story. Bars become one kind of quest stage, alongside campuses, sponsor stores and landmarks.

**Your call.** The Liberation Run is a frozen ruling marked expensive to reverse. Adopting the hybrid means a full decision session to supersede it, not a quiet edit.

## Verdicts and the three risks that could kill Arena

No seat passed outright. Three would back Arena now, and four would back it once one specific condition is met.

| Seat | Verdict | What it would take |
| --- | --- | --- |
| Consumer growth CMO | Back | One-line positioning, with the quest leading the launch |
| AI games CTO | Back | Prove fun with live telemetry, not just bot playtests |
| Brand sponsorship CMO | Back, in-kind first | A dashboard of measurable outcomes before any cash deal |
| Esports league CEO | Conditional | Skill brackets and anti-cheat before any prize over $1,000 |
| Publisher CEO | Conditional | Day-30 retention proven in one market before paying for growth |
| Skill-gaming general counsel | Conditional | Counsel's written opinion, official rules, and skill-based Cache shares before any random or paid element |
| Mobile ad-tech CRO | Backs sponsors, not the ad thesis | Ads grant Keys, never loot; direct-sold tournaments carry the money |

**The three risks that could kill it:**

1. **Someone pulls the plug.** An ad network bans the account over reward rules, Apple rejects the app as real-money gaming, or a regulator calls it gambling. Each would cut off distribution or revenue overnight.
2. **Reward-seekers churn faster than they can be replaced.** Players come for prizes and leave when they don't win, and acquisition costs more than they're worth. That's the Skillz pattern.
3. **Cheaters win the big prize.** Once a prize is worth stealing, bots and fraud rings show up. One public scandal ends sponsor trust.

## What changes in the brief

The rewrite keeps the vision and fixes the ten places where the board found it exposed.

1. **The opening.** It leads with facts nobody can argue with and makes the gap the opportunity, instead of the claim that everyone gets paid except the player.
2. **"Disguised" goes.** The candidate replacement is "Play is the engine. Loot is the point." Your pick is pending.
3. **Ads fund the business, not the prize.** An ad view earns a Key (an in-app entry or retry), and prizes are won by skill. "We know ads aren't fun" stays as brand voice, never on the ad itself.
4. **Competitive gaming, with esports as the show.** Big finals are broadcast, verified and live on camera.
5. **Fair play is visible.** Skill brackets, so average players face their peers, and anti-cheat named as a feature.
6. **The quest leads.** The short version carries all three hooks: the flip, the machine and the quest. Lore gets one chapter (the myth in three lines, then the quest). Bars become one kind of quest stage.
7. **The game factory gets its own section.** Uniqueness is framed as the closed loop: generate, host, play for real stakes, measure, evolve, mythologize.
8. **Prizes include all five ideas.** That's the Grand Quest, life prizes, your name in the machine, community Caches split by skill-earned standing, and money-can't-buy experiences. Big prizes note the cash alternative for taxes.
9. **The quiet asset gets expanded.** Prize picks are opt-in demand signals, sold to sponsors as aggregated insight. It stays behind brand and traction.
10. **Honest math.** The calculator defaults to web ad rates, named games read as "think Donkey Kong," and the look moves to retro arcade meets steampunk noir.

**Open for you:** whether to run a full session to supersede the Liberation Run, and whether to run a trademark search on "Arena" before the brand spend.

## Floor debate 2: paying for the First Cache home

The board recommends a guaranteed winner: one player wins "a home or its cash value," decided by skill and paid for by a sponsor. An insured home for a perfect run can sit on top as a bonus, never as the headline.

**A guaranteed winner beats a moonshot.**

- Growth CMO: "Someone will win this home" gets press. "A perfect run wins a home" gets ignored once people learn nobody has done it.
- Sponsorship CMO: A home builder wants the photo of a family getting the keys. A prize that never pays out is a PR loss for them.
- Counsel: Moonshots invite fights over what counted as perfect, plus claims that the game was rigged.

**Ads can't pay for it.** Ad-tech CRO: At about $12 per thousand web ad views, a $300,000 home takes 25 million views. Say that plainly.

**As an acquisition cost, it has to earn its keep.** Publisher CEO: Puzzle and arcade games pay about $2–3 per install ([source](https://mapendo.co/blog/mobile-games-cpi-2025), 2024 global averages). A $300,000 home beats that only if it brings more than 100,000 players who stay. Plan the day after the final, because people who came for the home leave once someone else wins it.

**With no raise planned, a sponsor is the practical path.** Funding the home yourself would mean your own money.

**A literal home is messy.** Counsel: Title transfer, property tax, location and the winner's own tax bill. "A home or its cash value" keeps the headline and gives the winner a way to pay the tax.

**The final is the biggest cheating target Arena will ever have.** Esports CEO: Run it live, in person, on Arena's own devices. AI CTO: Use hand-checked games for the final, not fresh agent output.

**Recommended structure:**

1. One player wins a home or its cash value, decided by skill.
2. A home-builder or prefab-home sponsor funds it, under contract before anything is announced.
3. If no sponsor signs by a set date, Arena runs a smaller guaranteed prize it can fund, such as a down payment, with the full home as an insured perfect-run bonus, stated plainly.
4. Free entry, published official rules, a cash alternative, tax forms at claim, and a live, verified final.

## Sources

- [Google AdMob, Policies for ad units that offer rewards](https://support.google.com/admob/answer/7313578?hl=en)
- [MarTech, AdMob policy update on indirect monetary rewards (Oct 2023)](https://martech.org/admob-policy-update-indirect-monetary-items-can-be-offered-as-rewards/)
- [Nasdaq, Skillz Q4 2024 results](https://www.nasdaq.com/articles/skillz-earnings-miss-user-base-shrinks)
- [Apple Developer Forums, prize app rejected under 5.3.4 (May 2026)](https://developer.apple.com/forums/thread/825845)
- [Gummicube, Apple guideline 5.3 summary](https://www.gummicube.com/blog/how-casino-apps-stay-compliant)
- [TechCrunch, Pokémon GO sponsor pricing](https://techcrunch.com/2017/05/31/pokemon-go-sponsorship-price)
- [Sweeppea, New York and Florida sweepstakes registration](https://blog.sweeppea.com/sweepstakes-regulations-new-york-florida/)
- [Verrill, new $2,000 Form 1099-MISC threshold for prizes](https://www.verrill-law.com/blog/the-new-2000-threshold-for-sending-irs-form-1099-misc-to-prize-winners/)
- [Mapendo, mobile game cost per install by genre (2024)](https://mapendo.co/blog/mobile-games-cpi-2025)
