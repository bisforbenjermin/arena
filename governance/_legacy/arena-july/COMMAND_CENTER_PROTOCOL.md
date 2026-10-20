# COMMAND CENTER PROTOCOL — The Arcade Realm
v1.1 — 2026-07-17 (seat updated 2026-07-19: truth store moved to Google Drive)

## The one idea
The command center is not a chat. It is this protocol plus one file — `STATE_LEDGER.md` — living in Google Drive. Any Claude Code session that opens the ledger becomes the command center for that session. Chats are disposable; the ledger is not.

## The seat (hybrid)
- **Truth:** `STATE_LEDGER.md` in Google Drive (file ID: `1QxEpnGWzI9mUtmC2XlYqawcmECZVf0y9`). Claude Code reads and writes it directly via the Drive MCP — no manual upload required.
- **Mirror:** `CLAUDE.md` in the Claude Code repo carries a `## COMMAND STATE MIRROR (v#, date)` block — pasted from the ledger's STATUS + GATES + NEXT sections, never hand-edited.
- **Repo copy:** `STATE_LEDGER.md` in the repo is a working copy only. Drive is truth; the version stamp arbitrates.
- **Drift check:** if the mirror's version stamp is behind the Drive ledger's, refresh before building. Flow is one-way: ledger → mirror. Nothing writes the mirror except a paste.

## Session-open ritual
Say: **"Open the ledger."** Claude reads `STATE_LEDGER.md` from Google Drive and states version, phase, and next actions in three lines. Work begins from there.

## Session-close ritual (the heartbeat)
At the end of any session that produced something ledger-worthy, say: **"Close the ledger."** Claude regenerates the FULL file — version +1, dated, one delta-log line added — and writes it back to Google Drive, replacing the old copy. Then refreshes the CLAUDE.md mirror and commits. If nothing ledger-worthy happened: "no delta," no close.

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
- **Two sessions closed in parallel** → higher delta-log version wins; fold the loser's lines into a fresh close. Avoid by keeping one working session at a time.
- **Ledger bloats** → it must stay under ~2 pages. History lives in the last five delta-log lines only; detail belongs in the task docs, not here.
