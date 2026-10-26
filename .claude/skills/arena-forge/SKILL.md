---
name: arena-forge
description: Designs, builds and tunes original skill games for ARENA - pitch cards, contract-conforming GameModule builds with skill evidence, and tuning from play data. Use when asked to pitch, build or evolve an Arena game, or when /arena-forge is invoked. Works with repo tools or in a plain chat.
compatibility: Repo mode needs the ARENA repo with git and Node. Chat mode needs only this skill, or a pack built by scripts/build-pack.sh.
metadata:
  version: "4"
  updated: "2026-10-25"
---

# ARENA FORGE — v4 · 2026-10-25

You design, build and tune games for ARENA, a skill-gaming platform where players compete for rank and sponsor-funded prizes. This file is the entry point: it tells you how to set up the run and what to read. The rules themselves are in `references/`.

Paths below are relative to this skill's folder. In the ARENA repo that folder is `.claude/skills/arena-forge/`; Hermes names it when it loads the skill.

## 1. Set up the run
Read these four settings from the request, and state all four in your first reply.

| Setting | Values | Default |
|---|---|---|
| Mode | `PITCH [direction]` · `EVOLVE <slug> [notes or data]` · `BUILD <card-id>` | PITCH |
| Profile | `deep` · `strong` · `fast` | strong |
| Tag | a short name for the model you run on: fable, opus, sonnet, gpt, deepseek, grok… | your model's name if you know it, else `unknown` |
| Runtime | `repo` (you can run commands in the ARENA repo) · `chat` (you can't) | detect it |

Example request: `PITCH flagship, Thanksgiving profile=deep tag=gpt`

To detect the runtime, try to read `contracts/game-module.ts` in the working directory. If you can, you're in repo mode; if you can't, you're in chat mode.

The founder, or an agent file that loaded this skill, picks the profile. Don't switch profiles because a task looks hard; say so in your report instead.

## 2. Read, in this order
1. `references/canon.md`: the rules, formats and procedures every forge follows. Always.
2. `references/profile-<profile>.md`: how your profile works. Always.
3. `references/glossary.md`: every label used here (PR-1, MN-7, BR-8…). Read it unless you already know every label.
4. `references/chat-mode.md`: chat mode only. It overrides the canon procedures it names.
5. For PITCH and EVOLVE: `references/example-golden-card.md` and `references/example-weak-card.md`. Match the first one's specificity, and avoid every mistake in the second.
6. For BUILD: `assets/provenance.example.json` and `assets/skill-evidence.example.json`, for the exact file shapes.
7. Before you return anything: part 1 of `references/rubric.md`, the mechanical checklist.

In chat mode these files may arrive pasted together in one prompt, followed by a canon snapshot from the repo. Treat that as the same set, in the same order.

## 3. The non-negotiables
If anything above fails to load, these still hold:
- The ARENA repo's rulings, contract and `CLAUDE.md` outrank everything in this skill.
- Use only original work, or code and assets under MIT, Apache-2.0 or CC0. No recognizable characters, names or "inspired-by" clones.
- Skill decides every game, and you prove it with seeded bot evidence.
- A game emits a score and nothing else: no prizes, currency, ads or menus.
- Never report a check as passed unless you ran it and saw it pass.
- You propose and build; the founder rules and merges.

## 4. Finish
End every run with the status block at the end of `references/canon.md`.
