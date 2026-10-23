---
name: land
description: "Lands files the founder dropped into _incoming/ at the destinations a MANIFEST.md names, with checks and one commit. Never lands rulings (that's /rule) or contracts (that's /build-next). Use when the founder types /land."
disable-model-invocation: true
model: sonnet
effort: low
---

Land what's in `_incoming/`. Mechanical: move, stamp, verify, commit. Decide nothing. If a check fails, stop and report the failing line and nothing else.

The founder's runway, before this runs: put the files and a `MANIFEST.md` into `~/code/arena/_incoming/`. The manifest is one table:

```
| file | destination | kind |
|---|---|---|
| OPS-5-decision-durability.md | governance/00-COMMAND/PROPOSED/ | proposal |
| S4_world_name_sweep_2026-10-23.md | _audit/ | audit |
```

`kind` is one of `proposal` (gets a PROPOSED stamp), `audit`, `doc` (anything else).

## 0. Checks

1. `pwd` ends in `code/arena`, or, in a cloud session, `git remote get-url origin` names `bisforbenjermin/arena`. `git switch main`, `git pull --rebase`, then `git status --porcelain` prints only lines beginning `?? _incoming/`. Anything else: stop and list it.
2. `_incoming/MANIFEST.md` exists and every `file` it names exists in `_incoming/`. Every file in `_incoming/` other than the manifest is named in it. Otherwise stop and list the difference.
3. Every destination is allowed. Allowed: `governance/00-COMMAND/` and its subfolders, `_audit/`, `docs/`, `specs/` (new `<ID>.md` names only — never a July `<ID>_*.md` or `00_*.md`, OPS-2). Refused, with the command that owns it: `governance/10-CANON/DECISIONS/` → `/rule`; `contracts/` → `/build-next`; `CLAUDE.md`, `.claude/`, `.github/` → a pull request. One refused row stops the whole landing.
4. No destination path already exists. If one does, stop: landing never overwrites (OPS-2 — supersede, never edit in place).

## 1. Land

For each row: `mkdir -p <destination>`, then `mv _incoming/<file> <destination><file>` (plain `mv` — the files are untracked, so `git mv` won't take them).

For `kind: proposal`: line 2 of the landed file must begin `Status: PROPOSED`. If it begins `Ruled:` instead, replace that leading `Ruled: <date>` with `Status: PROPOSED — not a ruling until the founder ratifies | Drafted: <date>` using your file-edit tool. If line 2 has neither, insert `Status: PROPOSED — not a ruling until the founder ratifies` as a new line 2. A proposal must not read like a ruling.

## 2. Finish

1. `rm _incoming/MANIFEST.md`, then `rmdir _incoming` (it must now be empty; if not, stop and list what's left).
2. `git add` the landed paths only. `git commit -m "land: <comma-separated file names>"`. Push. If rejected, `git pull --rebase --autostash` and push once more.
3. Reply, one line per landed file: `<destination><file> — <kind>`; then, for each proposal, `To rule: /rule <ID> <your ruling, in your words> | Confidence: HIGH | MEDIUM | LOW`; then `/index` if any proposal landed.

Nothing in this command touches the capsule. The next `/open` sees the new files as drift and offers a regenerated one.
