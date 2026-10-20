# CC ESTABLISHMENT PACKET — The Arcade Realm
Built under Protocol v1.4 (operator runway). Ground zero, verified from evidence: a Mac where typing `claude` in Terminal starts Claude Code — you have already proven this.

---

## RUNWAY (you, outside Claude Code)

**1. Open a fresh Terminal.** Cmd+Space → type `Terminal` → Return.
✓ Check: a window with a prompt ending in `%` or `$`.

**2. Stand in the venture folder.**
- If no folder exists yet: type `mkdir -p ~/arena && cd ~/arena` and press Return.
- If a folder already exists: type `cd ` (with one trailing space), drag the folder from Finder onto the Terminal window, press Return.
✓ Check: type `pwd` → Return → you see a path ending in your folder's name (e.g. `/Users/you/arena`).

**3. Make it a repo.** Type `git init` → Return. Safe in all states.
✓ Check: a line saying `Initialized empty Git repository…` or `Reinitialized existing…` — both are success.

**4. Put the two files in.** In your browser, download `COMMAND_CENTER_PROTOCOL.md` (v1.4) and `STATE_LEDGER.md` (v1) from the founding chat — they land in Downloads. Back in Terminal, type:
`cp ~/Downloads/COMMAND_CENTER_PROTOCOL.md ~/Downloads/STATE_LEDGER.md .`
→ Return. (The trailing `.` means "into this folder." Finder alternative: drag both files into the folder.)
✓ Check: type `ls` → Return → both filenames appear.

**5. Launch the named session.** Type `claude -n "arena-command-center"` → Return.
✓ Check: Claude Code opens. This name is now a real resume handle.

**6. Paste the PAYLOAD below** as your first message to Claude Code, then let it work.
✓ Check: it finishes by printing a STATUS BLOCK.

**7. Carry the STATUS BLOCK home.** Copy it, return to the claude.ai Project, open a new chat, paste it, and say **"close the arcade ledger."** You'll get ledger v2 to re-upload — the close isn't complete until that upload lands.

If any ✓ check fails: stop. Do not troubleshoot here or in the founding chat — open a disposable chat, fix, return to the step.

---

## PAYLOAD (paste into Claude Code)

```
ROLE: You are the build-side command center for this venture, operating under
COMMAND_CENTER_PROTOCOL.md (v1.4) in this repo. Read it and STATE_LEDGER.md now.

TASK — one-time establishment:
1. Create CLAUDE.md at repo root containing:
   - A one-paragraph venture orientation drawn from the ledger's header and PHASE.
   - "## COMMAND STATE MIRROR (v1 — 2026-07-17)" holding verbatim copies of the
     ledger's STATUS, GATES, and NEXT sections, marked: "Read-only mirror —
     refresh by paste from the published ledger; never hand-edit."
   - "## SESSION RULES" stating: (a) end every working session by emitting a
     STATUS BLOCK — task / status / artifacts with paths / downstream unblocked /
     any gates or decisions surfaced; (b) STATE_LEDGER.md in this repo is a
     working copy only — published truth is the Project-knowledge upload, and
     the version stamp arbitrates; (c) if the mirror's stamp is behind the
     working ledger's, flag it before building anything; (d) instructions and
     packets authored here follow the protocol's operator-runway rules.
2. Keep STATE_LEDGER.md at repo root as the working copy.
3. Commit everything: "establish command center (protocol v1.4, ledger v1)".
4. Emit your first STATUS BLOCK confirming establishment.

DONE-CRITERIA: CLAUDE.md exists with mirror + rules, files committed,
STATUS BLOCK emitted.
```
