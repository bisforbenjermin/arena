# arena-forge

Version 4 · 2026-10-25

One skill folder that designs, builds and tunes ARENA games, on any model that can read files. It follows the open Agent Skills format (agentskills.io), so Claude Code and Hermes load it as-is. For plain chats, a script compiles it into one paste-ready prompt per profile.

## What's inside, and why each file is there

| File | Why it's there |
|---|---|
| `SKILL.md` | The entry point: run settings, read order and the non-negotiables. |
| `references/canon.md` | The rules, formats and procedures. Without it, a model invents its own. |
| `references/profile-deep.md`, `-strong.md`, `-fast.md` | How each class of model should work. A fast model told to work like a deep one does worse. |
| `references/chat-mode.md` | What changes when the model can't run commands, so it never claims a test it didn't run. |
| `references/glossary.md` | Every label in one place. Another vendor's model knows none of them. |
| `references/example-golden-card.md` | The standard a pitch must meet. Examples move output quality more than instructions do. |
| `references/example-weak-card.md` | A plausible card that fails, line by line, so models learn the mistakes too. |
| `references/rubric.md` | The self-check, the judging scale, and the bake-off method for comparing models. |
| `references/model-map.md` | Which model runs which profile, filled in by bake-offs. |
| `assets/*.example.json` | The exact shapes of `provenance.json` and `skill-evidence.json`. |
| `scripts/build-pack.sh` | Builds the chat packs, with a fresh canon snapshot, from the live repo. |

## Claude Code
1. Unzip the package at the repo root. It adds `.claude/skills/arena-forge/` and replaces the three forge agents.
2. Move the old shared skill, `.claude/skills/forge-canon/`, and `.claude/agents/game-forge.md` if it's still there, to `governance/90-ARCHIVE/2026-10-25/`. Claude Code loads everything under `.claude/skills/` and `.claude/agents/`, so leftovers stay live.
3. Add `.claude/skills/arena-forge/dist/` to `.gitignore`.
4. Try it: "use forge-sonnet to PITCH micro".

## Hermes, with the repo
1. Put the repo on the machine Hermes runs on, and start Hermes from the repo root so it loads `CLAUDE.md`.
2. Link the skill in:

       mkdir -p ~/.hermes/skills/arena
       ln -s ~/code/arena/.claude/skills/arena-forge ~/.hermes/skills/arena/arena-forge

   Start a new session or run `/reset`. If `/skills` doesn't list arena-forge, copy the folder instead of linking it, and re-copy after each pull.
3. Pick the model for the session: `hermes chat --model <alias>`.
4. Run it: `/arena-forge PITCH micro profile=strong tag=gpt`

Don't add a `.hermes.md` or `AGENTS.md` to the repo. Hermes loads only one project instruction file, the first it finds of `.hermes.md`, `AGENTS.md`, `CLAUDE.md` and `.cursorrules`, so either new file would hide `CLAUDE.md` from it. Claude Code would also load an `AGENTS.md` on top of `CLAUDE.md`.

## Any chat: ChatGPT, DeepSeek, Grok, or Hermes without the repo
1. In the repo, run `.claude/skills/arena-forge/scripts/build-pack.sh`. It writes `dist/arena-forge-deep.md`, `-strong.md` and `-fast.md`, each ending in a fresh canon snapshot.
2. Paste the pack for your profile as the system prompt, or upload it and say: "Follow this file. Profile strong, tag gpt."
3. Give it a mode: `PITCH micro`.
4. A chat BUILD comes back as files plus commands. Run the checks in the repo before trusting it.

Rebuild the packs after any ruling changes. Each pack names the commit it was built from.

## Getting top-tier output from any model
1. **Give it the whole pack.** Most bad output comes from a model missing the canon, the examples or the glossary.
2. **Match the profile to the model.** See `references/model-map.md`, and fill it with bake-offs.
3. **Judge with someone else.** You, or a model that didn't write the work, using rubric part 2. Never the author.
4. **Trust only checks that ran in the repo.**
5. **Let playtests win.** Real players outrank every score.

## Keeping it true
- The skill points at the repo. The only copy of the canon is the generated snapshot in `dist/`.
- `SKILL.md` carries the version in its metadata. Bump it when any file here changes.
- Forges log stale rules to `governance/00-COMMAND/FRICTION_LOG.md`. Three entries against one file means it needs updating.
