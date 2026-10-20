# VENTURE PORT KIT — Command Center Protocol
For standing up the protocol (v1.4) in any new venture. One protocol, N ledgers, zero shared state.
Ground zero: logged into claude.ai in a desktop browser, with `COMMAND_CENTER_PROTOCOL.md` (v1.4) saved on your machine.

---

## RUNWAY (you, in claude.ai)

**1. Create the venture's Project.** Left sidebar → Projects → New Project → name it after the venture.
✓ Check: you're looking at the new Project's page.

**2. Seat the protocol.** On the Project page, find the knowledge section → add/upload `COMMAND_CENTER_PROTOCOL.md`. This goes in Project knowledge, not into a chat.
✓ Check: the file is listed under the Project's knowledge.

**3. Open the founding chat.** Start a new chat inside the Project. Paste the PAYLOAD below as your first message.
✓ Check: the chat confirms it has read the protocol and starts asking the seeding questions.

**4. Answer the seeding questions.** Short answers are fine — the chat converts them into ledger vocabulary.
✓ Check: it outputs a complete `STATE_LEDGER — <Venture>` at v1.

**5. Publish the ledger.** Download the ledger file it produces → upload it to the Project's knowledge alongside the protocol. The close is not complete until this upload lands.
✓ Check: open a brand-new chat in the Project and say "open the <venture> ledger" — it should read back version, phase, and next actions.

**6. Retire the founding chat.** Rename it as the founding archive. Never work in it again. All future sessions are fresh chats that open the ledger.

**7. Only if the venture has a codebase:** stand up the build side using the establishment pattern — venture folder, `git init`, both files copied in, `claude -n "<venture>-command-center"`, and an establishment payload adapted from the Arcade Realm CC ESTABLISHMENT PACKET (swap venture name and ledger contents). Skip entirely for ventures with no repo.

If any ✓ check fails: stop. Troubleshoot in a disposable chat, never in the founding chat.

---

## PAYLOAD (paste as the first message of the founding chat)

```
You are the founding command-center session for a new venture: <VENTURE NAME>.

First, read COMMAND_CENTER_PROTOCOL.md in this Project's knowledge — all of it.
It governs everything you and every future session here will do. The short
version: the command center is not a chat, it is the protocol plus one file
(STATE_LEDGER.md) seated in this Project's knowledge. Chats are disposable;
the ledger is truth; nothing changes the plan except through a close; a close
is not complete until I re-upload the regenerated ledger; work that touches
GATES or DECISIONS runs at max thinking, work that only moves STATUS runs low.

Your one task is to seed this venture's first ledger. Interview me with the
minimum questions needed to fill these sections — batch them, don't drip them:

1. PHASE — where the venture stands in one or two sentences.
2. STATUS — the workstreams/chains and their tasks, each with a state
   (NOT STARTED / IN PROGRESS / DRAFT / BLOCKED / DONE) and a one-line note.
   This venture's chains may look nothing like any other venture's — build
   the table from my answers, don't assume a structure.
3. GATES — hard stop conditions (legal, financial, dependency) with the rule
   each enforces.
4. DECISIONS — pending rulings and any already ruled, with dates.
5. NEXT — what is launchable now, dependency-safe, plus an explicit
   "do not start" line. Apply the honesty rule: nothing goes in NEXT without
   a reachable runway.
6. WATCH — named risks/opportunities, each with a one-line trigger condition.

Then output the complete file: "STATE_LEDGER — <VENTURE NAME>", LEDGER v1,
dated today, with the protocol's escalation rule printed in the header and a
DELTA LOG opening line. Keep it under two pages — rows and pointers, never
document content. Finish by reminding me of the two remaining runway steps:
upload the ledger to this Project's knowledge, then retire this chat.
```
