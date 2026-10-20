# INBOX

Unfolded deltas, newest at the bottom. Fold each one per DELTA_PROTOCOL.md, then remove it from here.

---

## DELTA — Repo split & handbook — 2026-10-20

### RULED
- Arena gets its own repo, no other ventures in it.
- ASS and Arena split into standalone repos; venture-os extracted as a third.
- Canon lives in the same repo as the code it governs. (Proposed, adopted by execution.)

### DONE
- git subtree split: ~/code/arena (3 commits), ~/code/all-service-solution (9), ~/code/venture-os (1)
- F4 reference games committed — they had been untracked since August
- 10-CANON and 00-COMMAND copied into ~/code/arena, committed
- SUPERSEDED.md written at ~/HQ/10-CANON and ~/HQ/00-COMMAND
- ARCHIVED.md written at ~/HQ/ventures; old monorepo retired
- Shell alias: arena -> cd ~/code/arena && claude

### DISCOVERED
- _os/ is a venture-agnostic engine layer built 2026-07-04 — predates the _ENGINE concept
- Two Arena repos had diverged 8 weeks; ~/arena (July) lacks PR-1..PR-6, HQ copy implements all six
- scoringEnvelope and scoringDirection exist in the July contract, absent from the current one
- OPS-2 and OPS-3 never landed in DECISIONS/ — 11 of 13 present

### OPEN
- Determinism test never run — PR-3 unverified, so F3 is not confirmed safe to build
- scoringEnvelope / scoringDirection regression — contract change, needs a ruling
- No git remotes on any of the three repos
- Naming still unresolved; C4-ADDENDUM-1 still missing

### NEXT
- Run the determinism test. Verdict gates everything downstream.

---

## DELTA — Repo ↔ Project marriage — 2026-10-20

### RULED
- Repo is the single source of truth; the claude.ai Project mirrors GitHub (bisforbenjermin/arena, main). EXPENSIVE. (adopted by execution)
- Repo is private. REVERSIBLE. (adopted by execution)
- Close = commit + push, then "Sync now" in the Project. Replaces "close requires re-upload". REVERSIBLE. (adopted by execution)
- Remaining housekeeping moves (build dirs → 30-BUILD/) cancelled. REVERSIBLE. (adopted by execution)

### DONE
- Repo pushed to GitHub; CLAUDE.md gained the Sync section (pull at start, push at end)
- ~50 Project-only docs imported in 601eb5f (specs, BUTTERCUP, DELTA_PROTOCOL, AUDIT_PROMPTS, C4-ADDENDUM-1, strategy, lore draft, employability, archive)
- Project knowledge wiped except investor/ARENA_FIRST_LOOK.html (kept out of repo per LG-7)
- Command-center chats can now clone and push the repo directly

### DISCOVERED
- Project PDFs are now real PDFs (VAULT_AUDIT C-1 described image ZIPs); originals in docs/reference/origin/
- Two ARENA_BOARD_INSTRUCTIONS versions exist; Project copy archived beside the PROPOSED one
- Project "Instructions" field is empty; ARENA_BOARD_INSTRUCTIONS was written to fill it once OPS-4 is ruled

### OPEN
- This INBOX (2 deltas) not yet folded
- F3 continues on STACK-1; auth provider ruling status to confirm at fold

### NEXT
- Fold the INBOX, then resume F3.
