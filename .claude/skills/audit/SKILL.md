---
name: audit
description: "Runs one audit tier from AUDIT_PROMPTS.md (A0–A5, S2, S3) through the auditor agent whose model matches the tier, saves the report to _audit/ and commits it. Use when the founder types /audit with a tier, e.g. /audit A0."
argument-hint: "[tier: A0 | A1 | A2 | A3 | A4 | A5 | S2 | S3]"
arguments: [tier]
disable-model-invocation: true
---

Run audit tier $tier. You dispatch and commit; the agent audits. Cost follows consequence (OPS-1), so the model is chosen by the tier, not by you.

| Tier | Agent | Model · effort | Consumes |
|---|---|---|---|
| A0 mechanical sweep · A5 weekly health check · S2 ruling headers · S3 spec debt | **auditor-mechanical** | Sonnet · medium | — |
| A1 coherence pass | **auditor-coherence** | Opus · high | newest `_audit/A0_*` |
| A2 adversarial review · A3 opportunity scan · A4 irreversibility review | **auditor-review** | Fable · max | A2 needs the newest `_audit/A1_*` |

A3 is written for Fable at high; it runs at max here because an agent carries one effort setting. That's the only deviation from `AUDIT_PROMPTS.md`.

1. `pwd` must end in `code/arena`, or, in a cloud session, `git remote get-url origin` must name `bisforbenjermin/arena`. If not, stop. `git pull --rebase`.
2. `$tier` must be one of the eight above; otherwise stop and show the table. If it's `A2` and no `_audit/A1_*` exists, or `A1` and no `_audit/A0_*` exists, stop: `Run /audit <earlier tier> first.` Never hand an unreduced problem to max effort.
3. `mkdir -p _audit`. The output path is `_audit/<tier>_<slug>_<YYYY-MM-DD>.md`, where `<slug>` is the lowercased tier title from `AUDIT_PROMPTS.md` with spaces as underscores (`A0_mechanical_sweep_2026-10-23.md`). If that path exists, append `-2`, `-3`.
4. Use the agent from the table. Pass exactly one line and nothing else: `Run $tier → <output path>.` Add no context, no hint of what you expect it to find.
5. When it returns: the file must exist at the output path and nothing else in the tree may have changed (`git status --porcelain` shows only that file). If anything else changed, stop and show the status — the guard is a backstop, not a sandbox.
6. On `main`: `git add <output path>`, `git commit -m "audit: $tier <YYYY-MM-DD>"`, push. If rejected, `git pull --rebase --autostash` and push once more. On any other branch, don't commit; say so.
7. Reply with the agent's `REPORT:` and `FINDINGS:` lines verbatim, then the report's last three lines, then one line naming the next tier in the run order (A0 → A1 → A2) or "none".

Under OPS-5 rule 4, nothing is marked FROZEN until A4 has run against the freeze candidate and A1 is current (run since the newest ruling landed). The dated filenames in `_audit/` are that evidence.
