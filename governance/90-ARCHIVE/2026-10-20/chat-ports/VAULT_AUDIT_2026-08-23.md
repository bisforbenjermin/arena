# VAULT AUDIT — 2026-08-23
**Scope:** full sweep, 34 files, 2.32 MB · **Disposition rule:** ARCHIVE, never delete
**Verdict:** The spec layer is in good shape. The *container* is not. Nine conflicts below, ranked by what they cost you.

---

## The headline

**85% of this project's byte weight is machine-opaque, and 5 weeks of ruled strategy never landed in a file.**

Those are the two real problems. Everything else is tidying.

---

## Conflicts, ranked

### C-1 — The two vision "PDFs" are not PDFs · **CRITICAL · RESOLVED THIS SESSION**
`Master_Context_Document__Project_Arena.pdf` and `LocationBased__Remote_Tournament_Platform_1.pdf` are **ZIP archives of JPEG page images** wearing a `.pdf` extension. 19 and 14 pages. No text layer, no fonts, no OCR.

Consequence: the two documents that contain the venture's founding reasoning were invisible to `grep`, invisible to Obsidian search, invisible to Claude Code, and unreadable by every agent in the LAUNCH_KIT pipeline. 1.98 MB of the project's 2.32 MB — and 0 bytes of searchable text.

**Recovered.** Both OCR'd to markdown this session. MCD came out clean (29 sections). LBR is faithful but over-headed — the heading detector promoted some list items; needs a 10-minute pass.

### C-2 — Five weeks of rulings exist only in chat · **CRITICAL · UNRESOLVED**
`STATE_LEDGER.md` is **v1, dated 2026-07-17**. Today is 2026-08-23.

None of the following appear in *any file* in this vault:
PR-1 through PR-6 (the F1 founder pre-rulings) · fixed-timestep ownership · sim/view split · version-keyed percentile distributions · sfc32 deterministic seeding · the two-rail credit architecture (Keys / Vault Points) · the seven anti-speculation laws · the generosity multiplier · Liberation Run GTM · the procurement wedge · the paper vault · §13 Stat Block · the crowdfunding inversion model · protocol v1.4's RUNWAY/PAYLOAD doctrine · the C4-ADDENDUM-1.

The protocol says *"chats are disposable, the ledger is truth."* In practice the chats have been carrying the truth. **The close ritual has not been firing.** This is the single most expensive gap in the audit — it's unbuilt architecture, not misfiled documents.

> The protocol's own failure mode list says *"Forgot to re-upload → the next open shows a stale version stamp."* It has been stale for five weeks. The protocol works; the heartbeat stopped.

### C-3 — `LAUNCH_KIT.md` is a 173 KB verbatim duplicate · **HIGH**
2,413 lines containing all 24 task docs inlined, plus the shared preamble **48 times inside that one file**. Every task doc exists twice in the vault.

In an Obsidian workflow this is actively harmful: every search returns doubles, and any edit to a task doc silently desyncs from the kit with no signal. Direct violation of your own *one truth per fact* principle.

### C-4 — Preamble duplicated ~75 times · **HIGH**
27 files carry the full SHARED CONTEXT PREAMBLE; LAUNCH_KIT carries 48 more copies.

This was *correct* for the old model — an agent got exactly one doc and needed full context. It is wrong for a vault. Fix without losing the property: keep one `PREAMBLE.md`, transclude with `![[PREAMBLE]]`, and **flatten on export** when packaging a packet for an agent. Vault stays DRY; agent packets stay self-contained.

### C-5 — SPEC and ARTIFACT share one flat namespace · **HIGH · structural**
`L1_lore_bible.md` is an *instruction for writing* the bible. `L1_bible_DRAFT.md` is *the bible*. Same prefix, same folder, no class marker.

This is the fix that matters most for scaling. The vault currently mixes **things that produce** with **things produced**. Right now that's one collision. Once the Game Factory runs, it's hundreds. Separate them at the folder level before you generate anything.

### C-6 — Doc count drift: 24 vs 28 · **MEDIUM**
`00_INDEX.md` says "28 standalone agent tasks" and titles a section "The 28 docs." Actual count: **24** (F×4, R×4, G×7, L×5, C×4). Ledger and cheatsheet both say 24 correctly. INDEX is wrong.

### C-7 — `C4-ADDENDUM-1` asserted but absent · **MEDIUM**
Ledger STATUS reads `C4 attorney brief — ASSEMBLED · Brief + ADDENDUM-1 exist`. There is no ADDENDUM-1 file in the vault. Either it was never uploaded or it's lost. **The ledger is asserting a fact it can't back** — which is the one thing a source of truth must never do.

### C-8 — `MD_deepseek` has no file extension · **MEDIUM**
Obsidian will not index it. It's a Layer-1 vision doc that substantially overlaps the recovered LBR document. Currently invisible to search, invisible to agents, and superseded on architecture.

### C-9 — Naming unresolved, in the filenames · **LOW but blocking**
Arena vs The Arcade Realm is still `Pending` in DECISIONS. The vault uses both — file names, doc titles, and the Code session name (`arena-command-center`) disagree. Cheap to rule, expensive to rename later. Rule it before the migration, not after.

---

## Disposition — 34 files

| # | File(s) | Disposition | Target | Why |
|---|---|---|---|---|
| 1 | `STATE_LEDGER.md` | **KEEP + URGENT UPDATE** | `00-COMMAND/` | 5 weeks stale; v1 → v2 close required |
| 2 | `COMMAND_CENTER_PROTOCOL.md` | **KEEP + VERSION FIX** | `00-COMMAND/` | File says v1.1; doctrine is at v1.4. Reconcile |
| 3 | `00_PREAMBLE.md` | **PROMOTE** | `10-CANON/PREAMBLE.md` | Becomes the single transclusion source |
| 4 | `00_INDEX.md` | **MERGE → ARCHIVE** | `20-SPEC/_INDEX.md` | Fix 28→24; fold nav into cheatsheet; archive original |
| 5 | `ARCADE_REALM_MASTER_CHEATSHEET.md` | **KEEP + REWRITE** | `20-SPEC/_INDEX.md` | Best orientation doc you have. Becomes the map |
| 6 | 24 task docs (F1-4, R1-4, G1-7, L1-5, C1-4) | **KEEP + DE-PREAMBLE** | `20-SPEC/{F,R,G,L,C}/` | Strip embedded preamble → `![[PREAMBLE]]` |
| 7 | `L1_bible_DRAFT.md` | **PROMOTE + RECLASS** | `10-CANON/LORE_BIBLE.md` | It's canon material, not a spec. Needs founder pass → FROZEN |
| 8 | `LAUNCH_KIT.md` | **ARCHIVE + REGENERATE** | `90-ARCHIVE/` → `_ENGINE/` | Kill the 173 KB static copy. Rebuild as a template that assembles packets on demand |
| 9 | `MD_deepseek` | **RENAME + ARCHIVE** | `90-ARCHIVE/vision/MD_deepseek.md` | Add `.md` so it's at least searchable; superseded |
| 10 | `Master_Context_Document__Project_Arena.pdf` | **RECOVERED → ARCHIVE ORIGINAL** | `50-VISION/` + `90-ARCHIVE/originals/` | OCR'd this session. Keep the ZIP as the fidelity check |
| 11 | `LocationBased__Remote_Tournament_Platform_1.pdf` | **RECOVERED → ARCHIVE ORIGINAL** | `50-VISION/` + `90-ARCHIVE/originals/` | Same. Rename to `.zip` so the extension stops lying |

**Nothing is deleted.** `90-ARCHIVE/` is write-once, dated, and never searched by default (`.obsidian` exclude).

---

## Target structure

```
ARENA-VAULT/
├── 00-COMMAND/              ← governance. Stays under 2 pages, forever.
│   ├── STATE_LEDGER.md          the one truth
│   ├── COMMAND_CENTER_PROTOCOL.md
│   └── BUTTERCUP.md             addressable-only assistant role
│
├── 10-CANON/                ← irreducible core. Facts live here once.
│   ├── PREAMBLE.md              single source; transcluded everywhere
│   ├── LORE_BIBLE.md            L1 draft, promoted
│   ├── STAT_BLOCK.md            §13 assumption register — EVERY number + falsifier
│   └── DECISIONS/               one file per ruling: PR-1.md … PR-6.md, naming.md
│
├── 20-SPEC/                 ← instructions that PRODUCE things
│   ├── _INDEX.md                merged cheatsheet + index (the map)
│   └── F/  R/  G/  L/  C/
│
├── 30-BUILD/                ← things PRODUCED. Agent output lands here.
│   ├── contracts/  schema/  games/  status-blocks/
│
├── 40-LEGAL/                ← C4 brief, ADDENDUM-1, counsel correspondence
│
├── 50-VISION/               ← Layer-1 archaeology, now machine-readable
│   ├── MASTER_CONTEXT_DOCUMENT.md
│   └── LOCATION_BASED_TOURNAMENT_PLATFORM.md
│
├── 90-ARCHIVE/              ← write-once, dated, excluded from search
│
└── _ENGINE/                 ← ★ venture-AGNOSTIC. The FDE layer.
    ├── templates/               packet.md · status-block.md · ledger-delta.md
    ├── protocols/               RUNWAY/PAYLOAD · escalation · close ritual
    └── assemble.md              builds a self-contained packet from spec + preamble
```

### Why `_ENGINE/` is the important folder

Everything in `_ENGINE/` should contain **zero Arena facts**. Packet format, STATUS BLOCK grammar, RUNWAY/PAYLOAD separation, the close ritual, the escalation rule, the scope-lock, the adversarial self-review — none of that is about gaming, venues, or prizes. It's a general method for running HITL agent pipelines.

That separation is the FDE posture you asked for, made literal: **a reusable engine, plus one venture's configuration of it.** It's also the thing that becomes portable if you ever want to point this method at a different problem — or show it to someone as evidence you can build one.

---

## Migration sequence

1. **Rule the naming decision.** Everything downstream inherits it. 10 minutes, unblocks folder and file names.
2. **Close the ledger to v2.** Land the five weeks. PR-1…PR-6 into `10-CANON/DECISIONS/`, GTM and prize economics into the ledger or a pointer. *Do this before moving a single file* — migrating a stale ledger just relocates the problem.
3. **Extract `_ENGINE/`.** Pull the generic method out of LAUNCH_KIT. This is the highest-leverage hour in the whole migration.
4. **De-preamble the 24 specs.** Scriptable — one pass, mechanical.
5. **Archive LAUNCH_KIT.** Only after step 3 proves packets can be assembled on demand.
6. **Move vision docs in, archive originals.**
7. **Rebuild `_INDEX.md`** from the cheatsheet, with the corrected count.

Steps 1–2 are yours. Steps 3–7 are agent work with a founder gate at the end of each.
