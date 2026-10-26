# Rubric

Part 1 is the mechanical checklist every forge runs on its own output before returning it. Parts 2 and 3 are for judging, done by the founder or by a different model, never by the forge that wrote the output.

## Part 1: mechanical checklist

### PITCH and EVOLVE
- [ ] Three cards for PITCH, two or three for EVOLVE. Every template field is filled with specifics, not adjectives.
- [ ] IDs and the file name follow the canon's format.
- [ ] Every hook is 15 words or fewer.
- [ ] A PITCH slate uses at least two control schemes, none of them reserved.
- [ ] Every round length is inside the contract's range.
- [ ] No card lets randomness, rewards or upgrades decide a winner.
- [ ] No casino styling, real brands or characters. Every IP check names the closest games and records the title search, or marks it NOT RUN.
- [ ] Lore fragments are labeled PROPOSED, and the Drain is never a face.
- [ ] Every pre-mortem names a failure and the design's answer to it.
- [ ] The file has a ranking, a recommendation of three sentences or fewer, and a `## Kill list`.
- [ ] EVOLVE: every metric was computed from named data or is marked missing, and every TUNE states its PR-4 and PR-5 consequences.
- [ ] The status block is present and complete.

### BUILD
- [ ] Every check in canon BUILD step 5 shows pass with the runner output pasted, or NOT RUN in chat mode.
- [ ] The evidence bars are met, with the raw numbers reported.
- [ ] `provenance.json` and `skill-evidence.json` match the shapes in `assets/`.
- [ ] The PR is open, not merged, and carries the playtest script.
- [ ] Nothing changed outside `games/<slug>/` and `tests/`, apart from at most one FRICTION_LOG line.

## Part 2: judgment
Score each card from 1 to 10 on five lines. The anchors keep scores comparable across judges and models.

| Line | 3 means | 7 means | 10 means |
|---|---|---|---|
| Fun | You'd play it once | You'd play three runs | You'd ask to go again |
| Clarity | It needs a sentence of explanation | It's clear at a glance | It's clear from a silent screenshot |
| Surprise | It reskins a pool game | It puts a new twist on a known verb | It's a verb the pool has never had |
| Arena fit | Doubtful evidence, hard to skin | Plausible evidence, skinnable | Near-certain evidence; it clips itself |
| Craft | Vague fields | Buildable with a few questions | Buildable with none |

The total is out of 50. Where to set the build bar is the founder's call; a sensible start is to build at 35 or more, and to give a 35-plus card with one weak line a single EVOLVE pass first.

## Part 3: bake-off
Use this to decide which model runs which profile, in Hermes, Claude Code or any mix.
1. Write one brief, for example `PITCH micro, any theme`.
2. Give it to each model in a fresh session, on the same profile, each with its own tag. Fresh sessions keep one model's cards out of another's context.
3. Rename the pitch files P1, P2 and so on, so the judge can't see which model wrote which. Keep the key private.
4. Judge every card with Part 2. The judge is the founder, or a model that wrote none of the cards.
5. Log each run in `model-map.md`: score, Part 1 failures, cost and time.
6. Pick each profile's model on quality per dollar, not on raw score.
7. Once games are live, playtest results outrank every rubric score.
