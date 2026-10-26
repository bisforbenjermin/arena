# Example: a weak card, and why it fails

This card looks plausible at a glance, which is what makes it useful. Each field is followed by the rule it breaks.

### P-20261025-example-B — Coin Rush (micro)
- Hook: Fast, fun tapping action with awesome rewards!
  - It names no verb and no tension. A hook lets a player picture the game.
- Mechanic DNA: tap / tap coins before they fall / lucky coins
  - The verb and constraint repeat precision-tap, and the twist is luck (rule 2; PITCH step 3).
- Spec: tap · 90 s · flat
  - 90 seconds breaks the contract's round length. Read the range from `contracts/game-module.ts` (rule 1).
- A round, beat by beat: coins fall and you tap them, and it gets harder.
  - No beats and no numbers. Nobody could build from this.
- Mastery ladder: players get better over time.
  - That isn't a ladder. What does run 100 do that run 1 can't?
- Return: daily rewards bring players back.
  - Rewards belong to the runtime (rule 4), and coming back for rewards rewards time spent, not skill (the banned list).
- Randomness: random lucky coins worth ×5 keep it exciting.
  - A random multiplier lets luck pick the winner. This alone kills the card (rule 2).
- Evidence forecast: (blank)
  - Without it there's no reason to believe skill decides.
- Clip moment: when you get a lucky coin.
  - The highlight is luck, so the clip advertises the wrong thing.
- Look and sound: shiny gold coins, and a jackpot sound on big wins.
  - Coins and jackpots are casino styling (rule 5), and coins read as currency (rule 4 and the firewall doctrine).
- Sponsor skin: put the sponsor's logo on the coins in the art.
  - A brand baked into the art breaks rule 3. Skins arrive through themeOverride.
- IP check: original.
  - That's a verdict, not a check. Name the closest games and record the title search (rule 3).
- Lore fragment: defeat the Drain King boss in the final wave.
  - The Drain is a condition, never a face (LR-4), and the fragment isn't labeled PROPOSED.
- Pre-mortem: none.
  - Every card names its likeliest failure and the design's answer.
- HANDOFF needed: no
- Build size: S

## Verdict
Kill it. Most weak cards fail on one or two lines. This one fails the three that matter most: luck decides the winner, it repeats the pool, and it looks like gambling.
