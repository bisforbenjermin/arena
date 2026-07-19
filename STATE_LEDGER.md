# COMMAND CENTER PROTOCOL — The Arcade Realm
v1.1 — 2026-07-17

## The one idea
The command center is not a chat. It is this protocol plus one file — `STATE_LEDGER.md` — living in Project knowledge. Any chat in this Project that opens the ledger becomes the command center for that session. Chats are disposable; the ledger is not.

## The seat (hybrid)
- **Truth:** `STATE_LEDGER.md` in Project knowledge.
- **Mirror:** `CLAUDE.md` in the Claude Code repo carries a `## COMMAND STATE MIRROR (v#, date)` block — pasted from the ledger's STATUS + GATES + NEXT sections, never hand-edited.
- **Repo copy:** if a full ledger file also lives in the repo, it is a working copy only. Published truth is always the latest Project-knowledge upload; the version stamp arbitrates.
- **Drift check:** if the mirror's version stamp is behind the ledger's, refresh before building. Flow is one-way: ledger → mirror. Nothing writes the mirror except a paste.

## Session-open ritual
Say: **"Open the ledger."** Claude reads `STATE_LEDGER.md` from Project knowledge and states version, phase, and next actions in three lines. Work begins from there. If the version isn't what you expect, you're looking at a stale upload — replace it first.

## Session-close ritual (the heartbeat)
At the end of any session that produced something ledger-worthy, say: **"Close the ledger."** Claude regenerates the FULL file — version +1, dated, one delta-log line added. You re-upload it to Project knowledge, replacing the old copy. That re-upload is the single manual heartbeat of the entire system. If nothing ledger-worthy happened: "no delta," no close, no upload.

**A close is not complete until the re-upload lands.** Claude Code writing files in the repo never touches Project knowledge — the upload is always yours.

## What counts as ledger-worthy
A STATUS BLOCK arrived · a task changed state · a gate opened or cleared · a decision was ruled or became pending · launch order changed · a risk got promoted. Pure Q&A, drafting, and exploration: no delta.

## Model tiering
- **Default — Fable, low thinking:** opens, closes, status folding, packet generation, doc edits, "what's next."
- **Escalate — Fable, max thinking:** any work that would change GATES or DECISIONS. Ecosystem architecture, legal structure, solvency and HQ-Trivia analysis, the naming ruling, anything touching the five-ecosystem design.
- The rule, printed in the ledger header so every session sees it: **cost follows consequence.**
- Claude Code runs builds on its own model. Heavyweight design questions get pulled OUT of Code, ruled in a max session here, and pushed back as spec.

## How the two loops plug in
- **LAUNCH_KIT agent chats:** unchanged. They still end with STATUS BLOCKs; you paste those into any command-center session; they fold at the next close.
- **Claude Code (`claude -r arena-command-center`):** treated as one more agent. End every Code session by having it emit a STATUS BLOCK in the LAUNCH_KIT format; paste it here; fold at close; refresh the CLAUDE.md mirror whenever STATUS, GATES, or NEXT changed. One status grammar everywhere.

## Failure modes and their answers
- **Chat dies mid-thread** → open a new one, "Open the ledger," continue. Nothing is lost but conversation flavor.
- **Forgot to re-upload** → the next open shows a stale version stamp; close again from the freshest session.
- **Two sessions closed in parallel** → higher delta-log version wins; fold the loser's lines into a fresh close. Avoid by keeping one working session at a time.
- **Ledger bloats** → it must stay under ~2 pages. History lives in the last five delta-log lines only; detail belongs in the task docs, not here.
