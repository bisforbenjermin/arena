# Model map

Which model runs which profile. Bake-offs (`rubric.md`, part 3) fill this file. Nothing here is settled until a bake-off backs it.

## Profiles

| Profile | Its job | What the model needs |
|---|---|---|
| deep | First-of-kind mechanics, flagships, hard balance problems | The strongest reasoning available; a large context helps |
| strong | Judgment-heavy pitches, flagship builds, EVOLVE decisions | Reliable long, multi-step work and tool use |
| fast | Micro builds from clear cards, variants, tunes, remixes | Speed, low cost and precise instruction following |

A repo-mode BUILD needs dependable tool use: shell, file edits and git. A model without it runs PITCH and EVOLVE only, or BUILD in chat mode.

## Current assignments

| Runtime | deep | strong | fast |
|---|---|---|---|
| Claude Code | Fable, as forge-fable at max effort (default, untested) | Opus, as forge-opus at high effort (default, untested) | Sonnet, as forge-sonnet at medium effort (default, untested) |
| Hermes, ChatGPT | after bake-off | after bake-off | after bake-off |
| Hermes, DeepSeek | after bake-off | after bake-off | after bake-off |
| Hermes, Grok | after bake-off | after bake-off | after bake-off |

For the first bake-off, try each vendor's top reasoning model on deep, its main coding model on strong, and its fast, low-cost model on fast.

## Hermes notes
- Start a fresh session on a chosen model with `hermes chat --model <alias>`. Define aliases under `model_aliases:` in `~/.hermes/config.yaml`.
- `/model <name> --provider <provider>` switches mid-session, but resets the prompt cache, so the next message re-reads the whole conversation at full price. Use fresh sessions for bake-offs.
- `/model <name> --once` switches for a single turn, which is handy for a quick second opinion on one card.
- Subagents started by `delegate_task` run on `delegation.model` and `delegation.provider`, start with a fresh conversation, and may not get skills. Tell them to load arena-forge, or hand them a chat pack.

## Bake-off log

| Date | Brief | Profile | Runtime and model | Part 2 score | Part 1 failures | Cost | Time | Notes |
|---|---|---|---|---|---|---|---|---|
