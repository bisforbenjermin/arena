# DELTA PROTOCOL

Paste this into any chat that produced work my repo needs to know about.

---

## Your task

Emit a **DELTA BLOCK** for my repo. Nothing else — no preamble, no recap of our
conversation, no closing offer.

A delta is not a summary. It is only what changed that a file on disk must now reflect.
If this chat produced no durable change, say "no delta" and stop.

## Format

Use this exactly. Omit any section that is empty.

```
## DELTA — <short chat name> — <YYYY-MM-DD>

### RULED
- <decisions I actually made>

### DONE
- <state changes: work completed, files written, things that now exist>

### DISCOVERED
- <findings that change the picture — drift, missing artifacts, wrong assumptions>

### OPEN
- <left undone, and what blocks it>

### NEXT
- <the single next action from this chat's perspective>
```

Keep the whole block under 40 lines. One line per item. No sub-bullets.

## The provenance rule — this is the important part

Distinguish what **I decided** from what **you proposed**.

- I said it, chose it, or executed it → **RULED**
- You recommended it and I did not explicitly confirm → append **`(proposed, not ruled)`**
- You recommended it and I executed it → RULED, append **`(adopted by execution)`**

Never upgrade a default into a decision. Six architectural pre-rulings once sat in my repo
for eight weeks reading as frozen when they had only ever been suggested with recommended
defaults, and everything downstream was built on them. That is the failure this rule exists
to prevent.

If you are reconstructing rather than recalling, say so on the line.

## Writing the RULED lines

Each one should be ADR-ready: a rule, not a discussion. Where you can, name the
reversibility.

- **REVERSIBLE** — undo under an hour
- **EXPENSIVE** — undo means rework
- **LOCKED** — undo means a rewrite

Example:

```
- Canon lives in the same repo as the code it governs. EXPENSIVE. (adopted by execution)
```

## What does not belong

- Conversation history, tone, or how we got there
- Anything already written to a file during the chat
- Your own advice that I did not act on
- Praise, framing, or next-step offers

---

After you emit the block, stop. I will paste it into `00-COMMAND/INBOX.md` and fold it with
a separate pass.
