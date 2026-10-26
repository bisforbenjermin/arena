# Example: a top-tier card

This is a teaching example, not a live pitch. It shows the standard every card must meet: concrete numbers, a round you can picture, and a design that already answers its own risks. Copy its standard, not its game.

### P-20261025-example-A — Ember Herd (micro)
- Hook (15 words max): Drag a lure to herd drifting embers home before the static swallows them.
- Mechanic DNA: drag / embers follow the lure only inside its pull radius, and the static edge eats any ember it touches / embers flock, so gathering a crowd before delivering beats ferrying them one by one.
- Spec: drag · 45 s · ramp
- A round, beat by beat:
  - 0–3 s: twelve embers drift in an open field. The beacon glows at bottom center, and a band of static creeps down from the top edge.
  - 3–20 s: the player drags the lure. Embers inside its radius trail it, and their neighbors follow them. Each ember that reaches the beacon scores. Embers delivered within 30 ticks of each other count as one group, and a group of n scores n².
  - 20–38 s: two more waves spawn at seeded points, and the static speeds up.
  - 38–45 s: the static closes to the bottom third, and the last sweep decides the round.
- Mastery ladder:
  - Run 1: ferries embers one or two at a time, and loses half the field to the static.
  - Run 10: gathers four to six before delivering, and opens each wave by circling.
  - Run 100: pins the flock against the static edge to compress it, then lands one 15-ember group in the final seconds.
- Return: tomorrow, a new seed reshapes every wave. Next week, the chase for a full-field group. Next month, best group size is the stat regulars compare.
- Randomness: the seed sets spawn points, wave timing within ±10%, and the static's contour. Spawn sets are drawn inside a fixed dispersion budget, so every seed asks for the same total herding distance. Every player in a round shares the seed, so it shapes the challenge but can't pick the winner.
- Evidence forecast: random 2–6% of the expert mean; greedy (fetch the nearest ember, deliver it at once) 20–30%; expert well above both. Seed-consistency risk: a wave that spawns near the beacon is easier, which the dispersion budget answers.
- Clip moment: the last three seconds, as a dense flock pours into the beacon while the static closes and the group counter jumps.
- Look and sound: BRAND-2 colors on the near-black field, with cyan embers, crimson static, and the beacon as a small brass-ringed lamp (steampunk as a detail). A chime per ember rises in pitch through a group. Muted, the group counter and the beacon's flare carry everything.
- Sponsor skin: themeOverride swaps the ember glyph, the beacon's emblem slot and the accent colors. No brand assets ship in the game.
- IP check: the closest commercial genre is herding games (sheepdog sims) and magnet-cursor toys. This has no animals or characters, and the flocking group score and the shrinking edge are its own. No pool game uses drag: precision-tap is a tap reflex game and pressure-hold a hold endurance game. Title search, 2026-10-25: no game or app named "Ember Herd" found. An RPG titled "Ember" exists on Steam, consoles and iOS; it shares one word in a different genre, so it's flagged for the founder as low risk.
- Lore fragment (PROPOSED): "Every ember you bring home is a second the Drain didn't get."
- Pre-mortem: the likeliest flop is mushy control: embers lag the lure and the player feels out of control. The answer: inside an inner radius, embers snap to the lure within 2 ticks, and flocking only moves the outer ring. Control feels tight, and the depth lives at the edges.
- HANDOFF needed: no
- Build size: M. The flocking sim and drag-input logging are the work. Pointer positions are quantized to an 8-pixel grid and logged only when they change, which keeps a 45-second round to roughly a thousand events.

## Why it works
- Every field is concrete enough to build from.
- The scoring (n² per group) rewards exactly the skill the mastery ladder describes.
- The seed risk is named and answered in the design.
- The pre-mortem changed the design, not just the wording.
- The title check reports what it found, including a partial overlap, instead of a verdict.
