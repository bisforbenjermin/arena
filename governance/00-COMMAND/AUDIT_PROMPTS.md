# AUDIT PROMPTS — tiered, executable from Claude Code

**Principle:** cost follows consequence. Each tier's output narrows the next tier's input. Never hand an unreduced problem to max effort — you pay for it to rediscover what grep already knew.

**Dials:** `/model` = knowing more. `/effort` = trying harder (files read, tools run, steps before check-in). `ultrathink` in a prompt = deeper reasoning for one turn only.

**Run order:** A0 → A1 → A2. A3 and A4 are independent. A5 is recurring.
All outputs land in `_audit/`. Never overwrite — suffix with the date.

---

## A0 — Mechanical sweep
`/model sonnet` · `/effort medium`

Pure enumeration. No judgment, no opinions. If a check needs an opinion, it belongs in A1.

```
Mechanical audit of this repo. Enumerate only — no recommendations, no interpretation.

Check and report:
1. Every markdown file: path, line count, last-modified date.
2. Cross-references: every file, heading, or artifact named inside a doc that does not exist on disk.
3. Duplicate content: any block over 200 words appearing in more than one file. Report the block's first 10 words, and every path it appears in.
4. Count claims: any doc asserting a quantity about the repo ("the 28 docs", "24 packets"). Report claimed number vs actual.
5. Date drift: any doc with a version stamp or date older than 21 days.
6. Files with no extension, or whose extension does not match their actual content — check magic bytes, do not trust the filename.
7. Orphans: files referenced by nothing, and files referencing nothing.

Write to _audit/A0_mechanical_<today>.md as a flat table per check.
Do not fix anything. Do not comment on quality.
End with: total findings count, and the three checks that returned the most rows.
```

---

## A1 — Coherence pass
`/model opus` · `/effort high`

Contradictions between documents. Consumes A0 so it doesn't re-derive mechanical facts.

```
Read _audit/A0_mechanical_<today>.md first, then audit this repo for internal contradiction.

I am looking for places where two documents cannot both be true.

Highest-priority class — RULINGS VS SPECS. The specification set was written before several
architectural rulings were made. Every spec is therefore suspect. Check each spec against every
frozen ruling in 10-CANON/DECISIONS/ and report contradictions.

A known example, to calibrate: the F1 spec lists `tilt` in the controlScheme enum, while PR-6
rules that the tilt control scheme is reserved and not implemented. Find every instance of this
shape.

Also check:
- Specs that assume a dependency the dependency's own spec doesn't provide
- Terms defined differently in different documents
- Sequencing claims that conflict (X gated on Y in one doc, reverse in another)
- Anything the ledger asserts as existing that A0 could not find on disk

For each: cite both sources with file and line. State which one is more recent. Rank by cost of
being wrong, not by how obvious it is.

Write to _audit/A1_coherence_<today>.md.
Do not resolve anything — I rule, you find. Flag anything whose resolution would invalidate
downstream work.
```

---

## A2 — Adversarial review
`/model fable` · `/effort max`

Only run this after A1. Its whole value is that it operates on a pre-reduced surface.

```
ultrathink

Read _audit/A1_coherence_<today>.md and the contents of 10-CANON/. Do not re-report anything
already in A0 or A1.

Argue against this architecture as if you were hired to find the reason it fails.

Specifically:
1. The load-bearing assumption nobody has examined. Not the risks that are already logged —
   the one that is so foundational it was never written down as an assumption at all.
2. Where the design works at 100 users and breaks at 10,000. Name the mechanism, not the
   category.
3. Which frozen ruling will be the most expensive to reverse, and what would force the reversal.
4. What a competent adversary — a cheater, a regulator, a competitor — does first.
5. The failure mode that looks like success for six months before it surfaces.

For each: state the failure, the mechanism, the earliest observable signal, and the cheapest
thing that would falsify it today.

Be specific enough to be wrong. A criticism I cannot test is not useful to me.
Write to _audit/A2_redteam_<today>.md. Rank by expected cost, and say plainly which of these you
think is most likely to actually happen.
```

---

## A3 — Opportunity scan
`/model fable` · `/effort high`

Different cognitive mode from A2. A2 attacks what exists; A3 looks for what's absent.

```
ultrathink

Read 10-CANON/ and 50-VISION/. This is not a critique pass — do not report weaknesses.

Find what is missing that should be obvious in hindsight:
1. An asset already being produced that has unrecognised second use.
2. A capability that is one small step from something already built.
3. A constraint being treated as fixed that is actually a choice.
4. An adjacent market or user the current design already serves without intending to.
5. The cheapest experiment that would tell me the most about whether the core thesis holds.

Rule: every suggestion must be reachable from what exists today. No "raise capital and hire a
team." If it requires something I don't have, don't list it.

Write to _audit/A3_opportunity_<today>.md. Rank by ratio of insight gained to effort spent.
End with the single one you would do first, and why.
```

---

## A4 — Irreversibility review
`/model fable` · `/effort max`

Run only against decisions that cannot be cheaply undone. Everything else gets low effort and ten minutes.

```
ultrathink

Read 10-CANON/DECISIONS/. For each ruling, classify:

REVERSIBLE — undoable in under an hour. State the undo cost.
EXPENSIVE — undoable but requires rework. Estimate the rework in files touched.
LOCKED — everything downstream assumes it; reversal is a rewrite.

For LOCKED rulings only: was this decided with enough information? What would I have needed to
know to decide better? Is it still the right call given everything decided since?

Then the inverse: name any decision I am currently treating as LOCKED that is actually
REVERSIBLE. I have a pattern of over-weighting reversible decisions and stalling on them.

Write to _audit/A4_irreversibility_<today>.md.
Be blunt about which rulings you think are wrong. I would rather hear it now.
```

---

## A5 — Weekly health check
`/model sonnet` · `/effort low`

Two minutes. Run it Fridays or at any session open where you feel disoriented.

```
Quick state check — low effort, no deep analysis.

1. Read 00-COMMAND/SESSION_LOG.md. Summarise the last 5 entries in one line each.
2. Read 00-COMMAND/CONTEXT_CAPSULE.md. Is its NEXT ACTION still correct given the log?
3. Read 00-COMMAND/FRICTION_LOG.md. Any upstream doc with 3+ entries against it?
4. Is the capsule still under one page?

Report in under 200 words. If the capsule's NEXT ACTION is stale, propose a corrected one and
nothing else. Do not audit anything. Do not suggest improvements.
```

---

## Escalation rule

Do not start at A2. If you catch yourself opening a session at max effort on an unreduced
question, that is the tell that you are looking for insight instead of progress.

**Raise the model** when Claude had the context, tried, and was still wrong.
**Raise the effort** when Claude skipped files, didn't verify, or stopped partway.
**Fix the prompt** first — with an unclear question, neither dial helps.

## Cadence

A0 + A1 monthly, or after any large batch of file changes.
A2 once per phase, never more.
A3 when stuck or bored — it's the one that's actually fun.
A4 before any freeze.
A5 weekly.
