# The Arcade Realm — Build-Side Command Center

The Arcade Realm is a multi-ecosystem venture governed by `COMMAND_CENTER_PROTOCOL.md`. The command center operates on a hybrid seat: `STATE_LEDGER.md` in Project knowledge is the single published truth (version stamp arbitrates), this repo's `STATE_LEDGER.md` is a working copy only, and the `COMMAND STATE MIRROR` block below is a read-only paste from the ledger's STATUS + GATES + NEXT sections — never hand-edited. Claude Code is treated as one more agent in the system: it builds against spec handed down from max-thinking command-center sessions, and every Code session closes with a STATUS BLOCK pasted back to the command center for folding at the next ledger close.

## COMMAND STATE MIRROR (v1 — 2026-07-17)

*Read-only mirror — refresh by paste from the published ledger; never hand-edit.*

**STATUS**
Ledger v1 — initial establishment. No STATUS section present in the v1 ledger; sections will appear after first ledger close with ledger-worthy delta.

**GATES**
No GATES section present in ledger v1.

**NEXT**
No NEXT section present in ledger v1.

## SESSION RULES

(a) End every working session by emitting a STATUS BLOCK — task / status / artifacts with paths / downstream unblocked / any gates or decisions surfaced.

(b) `STATE_LEDGER.md` in this repo is a working copy only — published truth is the Project-knowledge upload, and the version stamp arbitrates.

(c) If the mirror's stamp is behind the working ledger's, flag it before building anything.

(d) Instructions and packets authored here follow the protocol's operator-runway rules.
