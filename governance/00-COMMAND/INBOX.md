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
