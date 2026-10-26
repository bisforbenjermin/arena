# Pitch — 2026-10-25 · forge-opus · micro slate

Mode: PITCH micro. Profile: strong. Tag: opus. Runtime: repo.

Pool DNA scanned: `precision-tap` (tap, reflex), `pressure-hold` (hold, endurance), GAME-01 bow-hunt (specced, build-blocked on a HANDOFF — treating as in-flight; its control is drag/aim-release). Open `forge/*` branches: none. Open PRs noted (build/G2, build/G3, build/arcade-games, crew/routine-commands, ops/sonnet-loop) but none from a prior forge pitch, so one-open-build check passes for forge.

ControlScheme reserved: `tilt`. Three cards below use **swipe**, **drag**, **rhythm** — the schemes the current pool lacks.

Format reference: FORMAT-1 (ruled 2026-10-25) — higher raw score is better; all scoring and evidence forecasts below are stated in raw-score units ascending.

---

### P-20261025-opus-A — Fuse Line (micro)

- Hook (15 words max): Swipe to redirect a traveling spark through broken circuit segments before its charge expires.
- Mechanic DNA: swipe / the spark advances one tick at a time along the current segment and only a flick that lands within 6 ticks of a junction retargets it / segments decay behind the spark, so re-entering a visited node costs lives.
- Spec: swipe · 40 s · ramp
- A round, beat by beat:
  - 0–3 s: a grid of nine nodes connected by thin brass filaments appears portrait, spark enters top-left, charge meter sits at 100.
  - 3–18 s: the spark advances at 8 ticks per node. At each junction the player swipes a direction; a late swipe sends the spark down the default (straight) branch and burns 10 charge. Each new node collected is 1 point; completing a closed loop of 4+ unvisited nodes scores (loop length)².
  - 18–32 s: seeded "static knots" appear on 2–3 edges — crossing one halves current segment's loop bonus but can be chained for a knot-combo multiplier.
  - 32–40 s: the field compresses: two edges collapse per 5 s, forcing the player to commit to a final loop. Round ends when charge hits 0 or 40 s elapses.
- Mastery ladder:
  - Run 1: swipes reactively at each node, scores on raw nodes, misses most loop bonuses, dies on charge around 25 s.
  - Run 10: plans two nodes ahead, closes 4-loops, learns the knot-combo discount.
  - Run 100: pre-reads the whole decaying graph, routes a single 8-loop through two knots in the final 8 s for a huge finish.
- Return: tomorrow a new seed reshapes the graph and knot placement. Next week, chasing a first 6-loop. Next month, knot-combo count becomes the stat regulars compare.
- Randomness: seed sets node positions on a jittered 3×3 lattice, filament topology (within a connectivity budget guaranteeing at least one 6-loop exists), and knot placement. Every player in a round shares the seed; the budget means every seed asks for the same maximum attainable score within ±8%, so the seed shapes the challenge but can't decide a winner.
- Evidence forecast: random 3–8% of expert mean (random swipes rarely close loops); greedy (always swipe toward nearest unvisited node) 25–35%; expert well above both. Seed-consistency risk: a seed whose 6-loop sits adjacent to the entry node is easier — answered by the connectivity budget enforcing minimum graph diameter.
- Clip moment: the final 4 s, as the spark threads a knot, then another, closes an 8-loop as two filaments collapse behind it, and the combo counter triple-pops.
- Look and sound: BRAND-2 palette on near-black, cyan spark, amber filaments, crimson knots. A rising harmonic chord per node in a loop; a flat clack on a missed swipe. Muted, the charge meter and the loop-closure flash carry the state.
- Sponsor skin: themeOverride swaps spark glyph, filament color pair, and node emblem. No brand assets ship.
- IP check: closest commercial genre is wire-puzzle games (Flow Free, Infinity Loop); those are untimed static puzzles with no spark/decay. No pool game uses swipe. Title search 2026-10-25: "Fuse" exists as several unrelated apps; "Fuse Line" has no direct game hit found — flagged low risk for the founder.
- Lore fragment (PROPOSED): "Every closed line is a circuit the Drain can't open."
- Pre-mortem: likeliest flop is swipes feeling imprecise on small junctions. Answer: swipe is read as a cardinal-direction vote with a generous 60° cone, and the junction accepts input in a 6-tick window centered on arrival, so timing — not aim precision — is the skill.
- HANDOFF needed: no
- Build size: M. The decaying-graph sim and swipe-cone input are the work; everything else is readable rendering.

---

### P-20261025-opus-B — Tether Weave (micro)

- Hook (15 words max): Drag a weight on a tether through gates, letting momentum carry it where fingers can't reach.
- Mechanic DNA: drag / the finger holds one end of an elastic tether and the weight follows via spring physics / the weight passes through scoring gates, but only when its velocity exceeds a threshold, so slow dragging misses while whipping scores.
- Spec: drag · 45 s · ramp
- A round, beat by beat:
  - 0–3 s: a brass-ringed weight sits center-screen, tethered to the player's finger. A first gate pulses amber on the right.
  - 3–20 s: the player drags; the weight follows with spring lag. Passing through a gate while velocity ≥ threshold scores 1 point and chains the next gate. Each chained gate within 15 ticks of the last doubles that gate's score (cap 8×).
  - 20–35 s: gates spawn in pairs at seeded positions. Some gates reverse-polarity: scoring requires velocity perpendicular to the gate axis, forcing a whip not a drag.
  - 35–45 s: three "swallow" zones appear and sweep inward; the weight entering one ends the round early. Final 5 s are a corridor sprint where chains stay alive only if the player keeps the weight whipping.
- Mastery ladder:
  - Run 1: drags the weight directly, hits gates slow, breaks chain repeatedly, score low.
  - Run 10: learns to whip — pull then release to let the spring carry the weight through two gates on one motion.
  - Run 100: pre-positions the weight before each gate pair, uses the swallow zones as walls to redirect, and holds a 20+ chain through the finale.
- Return: tomorrow a new seed re-places gates and swallow zones. Next week, chasing a first 10-chain. Next month, longest chain is the stat.
- Randomness: seed sets gate positions (within a budgeted arc so travel distance is equal across seeds), reverse-polarity flags, swallow-zone paths. Shared seed per round. Travel-distance budget keeps max score ±10% across seeds; seed shapes which chains are possible, not whether a good score is reachable.
- Evidence forecast: random 2–5% of expert mean (random drags rarely cross gates fast); greedy (drag straight toward next gate) 15–25% — fails on reverse-polarity gates; expert well above. Seed-consistency risk: a seed clustering gates near center is easier — answered by the arc budget.
- Clip moment: the final corridor, as the weight snaps through five gates on one whip, chain counter past 15, swallow zones closing from both sides.
- Look and sound: BRAND-2 palette. Brass weight on near-black, cyan tether that stretches thin at high tension, amber gates pulsing on-beat, crimson swallow zones. A pitched zing on each gate scales with velocity; a dull thunk on under-threshold passes. Muted, tether thickness and the chain counter carry the state.
- Sponsor skin: themeOverride swaps weight glyph, gate frame, and accent color. No brand assets ship.
- IP check: closest commercial genre is physics-rope games (Cut the Rope, Pin Pull) — those cut or route rope through static puzzles, not whip a tether through timed gates. No pool game uses drag. Title search 2026-10-25: "Tether" exists as a VR app and an unrelated iOS title; "Tether Weave" has no direct hit found — flagged low risk.
- Lore fragment (PROPOSED): "The weight remembers every path you taught it."
- Pre-mortem: likeliest flop is the spring physics feeling floaty, so misses feel like the game's fault. Answer: tether tension gives a visible thickness cue, and the velocity threshold is shown as a glow around the weight that lights only above threshold — the player sees whether their next pass will score before it arrives.
- HANDOFF needed: no
- Build size: M. Spring-tether sim with deterministic fixed-timestep integration is the main work; input is quantized finger-position deltas per tick.

---

### P-20261025-opus-C — Hammer Mill (micro)

- Hook (15 words max): Tap on the beat as cogs rotate past the anvil, matching their rhythm or forging a miss.
- Mechanic DNA: rhythm / three concentric cog rings rotate at different seeded tempos and the anvil fires on tap / a tap scores only when a cog tooth is inside the anvil window; chained on-tempo hits ratchet a multiplier that decays with silence.
- Spec: rhythm · 50 s · ramp
- A round, beat by beat:
  - 0–3 s: three cogs appear (outer slow, middle medium, inner fast). A metronome click sets the base tempo; the anvil window glows at the top of the frame.
  - 3–20 s: the player taps. A tap when any cog's tooth is inside the window scores 1; a tap matching the slowest cog's tempo starts a streak. On-tempo chained taps raise a multiplier (×1 → ×8). Off-tempo or no-tooth taps reset it to ×1.
  - 20–38 s: a second anvil window opens, offset by 90°; taps alternate windows automatically. Seeded tempo shifts (gear changes) occur every 6–10 beats; the player must re-lock.
  - 38–50 s: all three cogs lock to a shared tempo for the finale; every tap scores a tooth from every ring that's in-window, so a perfectly timed finale tap can score 3 teeth plus multiplier.
- Mastery ladder:
  - Run 1: taps roughly in rhythm, hits the slow cog, misses tempo shifts, score low.
  - Run 10: locks to the base tempo and rides the ×4 streak through one gear change.
  - Run 100: predicts gear changes from the pre-shift cue (a faint tick), holds ×8 through two shifts, lands triple-tooth finale taps.
- Return: tomorrow a new seed re-tempos the cogs. Next week, surviving a gear change without breaking streak. Next month, max multiplier held is the stat.
- Randomness: seed sets the three tempos (within a musically coherent ratio budget so they always align on a shared period), tooth phases, gear-change timing, and finale lock point. Shared seed per round. Ratio budget keeps attainable max score ±7% across seeds; seed shapes which rhythms, not whether good scores exist.
- Evidence forecast: random 1–4% of expert mean (random tap rate rarely matches any tempo); greedy (tap whenever any tooth is in window, ignoring tempo) 20–30% — scores teeth but never holds multiplier; expert well above. Seed-consistency risk: a seed with simple 2:1 ratios is easier — answered by requiring at least one 3:2 or 5:3 ratio among the three cogs.
- Clip moment: the finale lock, as all three cogs snap into phase, the player lands four triple-tooth ×8 taps, and the multiplier aura flares.
- Look and sound: BRAND-2 palette. Brass cogs on near-black with amber tooth-highlights, cyan anvil window, crimson miss-flash. Each tooth hit plays a layered chime (slow cog = low, fast = high); multiplier adds a hall reverb. Muted, cog highlights and the multiplier numeral carry everything; the pre-shift cue is a visible dim of the affected ring, not just the tick sound.
- Sponsor skin: themeOverride swaps cog texture, tooth glyph, and anvil frame. No brand assets ship.
- IP check: closest commercial genre is rhythm tap games (Patatap, Beat Stomper); those have fixed-tempo single-track rhythms, not multi-ring polyrhythms with gear changes. No pool game uses rhythm. Title search 2026-10-25: "Hammer Mill" is an industrial term and name of a music collective; no game hit found — flagged very low risk.
- Lore fragment (PROPOSED): "The mill still beats. Something still forges hours into days."
- Pre-mortem: likeliest flop is players never finding the base tempo, so the whole game feels like noise. Answer: the first 3 s are a solo on the slow cog with a visible pulse; the player can't fail during the lock-in, and the metronome click is loud enough to carry even muted via a visible pulse ring at the frame edge.
- HANDOFF needed: no
- Build size: M. Fixed-timestep rotational sim is simple; the hard work is the tempo-ratio generator and ensuring deterministic audio event scheduling in the sim (audio plays in view only).

---

## Ranking

1. **P-20261025-opus-A — Fuse Line.** Highest ceiling for watchable clips and the clearest skill gradient (knot-combo depth); swipe is the pool's biggest gap.
2. **P-20261025-opus-C — Hammer Mill.** Rhythm fills a different pool gap and plays well muted, but polyrhythm risks confusing newcomers.
3. **P-20261025-opus-B — Tether Weave.** Strong clip game and tight pre-mortem, but drag spring physics are the fussiest to tune for deterministic sim; it overlaps conceptually with GAME-01 bow-hunt's drag-release.

## Recommendation

Cut **P-20261025-opus-B (Tether Weave)**. Its drag/release control sits closest to GAME-01 bow-hunt once that unblocks, and the pool is better served by diversifying into swipe (Fuse Line) and rhythm (Hammer Mill). If GAME-01 ends up spiked or re-scoped, Tether Weave is a strong candidate to resurrect, because its mastery ladder and clip moment are already specific.

## Kill list

- "Tilt-pour alchemy": uses the RESERVED `tilt` scheme — dead on sight (contracts/game-module.ts ControlScheme).
- "Lucky-shot cannon": outcome determined by seed-rolled wind — luck decides, violates skill-decides rule.
- "Build-and-defend tower": needs explaining and persistent progression; crosses the micro/flagship line and risks fairness HANDOFF.
- "Slot-mech freight sorter": reel-styled sorting board — forbidden casino aesthetic (rule 5).
- "Memorize-the-sequence pads": pure memory with no skill ladder past run 10; flat day-30 return curve.
- "Tap-the-mole whack variant": too close to precision-tap DNA; pool already has tap reflex covered.
- "Hold-and-release bow draw": collapses to GAME-01 bow-hunt's input; redundant.
- "Dodge-the-falling-blocks runner": "like Tetris" written in the hook — IP smell and a crowded genre with no clear differentiator.
- "Tempo-matched elevator stop": one-note rhythm variant; mastery ladder tops out at run 10.
- "Draw-the-shape tracer": needs OCR-style tolerance tuning and the skill gradient is near-flat between greedy and expert.
- "Cursor-stay-in-lane endurance": mechanically close to pressure-hold with worse clip potential.
- "Juggle three balls": fun but fairness evidence requires per-ball separation that will fail the 15% expert spread bar.
