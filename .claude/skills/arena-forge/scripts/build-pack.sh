#!/usr/bin/env bash
# build-pack.sh: compile arena-forge chat packs from the live ARENA repo.
#
# Usage:  scripts/build-pack.sh [repo-root] [out-dir]
#   repo-root  defaults to the git root that contains this skill
#   out-dir    defaults to <skill>/dist
#
# Writes:
#   <out>/canon-snapshot.md          the repo files the forge needs, copied verbatim
#   <out>/arena-forge-<profile>.md   one paste-ready prompt per profile: deep, strong, fast
#
# The repo stays the truth. Rebuild after any ruling changes, and never edit <out> by hand.
# Works with bash 3.2 (macOS) and later.

set -euo pipefail

SKILL_DIR="$(cd "$(dirname "$0")/.." && pwd)"
REPO="${1:-}"
if [ -z "$REPO" ]; then
  REPO="$(git -C "$SKILL_DIR" rev-parse --show-toplevel 2>/dev/null || true)"
fi
OUT="${2:-$SKILL_DIR/dist}"

if [ -z "$REPO" ] || [ ! -f "$REPO/contracts/game-module.ts" ]; then
  echo "build-pack: can't find the ARENA repo (no contracts/game-module.ts)." >&2
  echo "Run it from inside the repo, or pass the repo path: scripts/build-pack.sh ~/code/arena" >&2
  exit 1
fi
REPO="$(cd "$REPO" && pwd)"

mkdir -p "$OUT"
COMMIT="$(git -C "$REPO" rev-parse --short HEAD 2>/dev/null || echo "unknown")"
STATE=""
# Uncommitted changes, ignoring this script's own output folder.
CHANGES="$( { git -C "$REPO" status --porcelain 2>/dev/null || true; } | grep -v 'arena-forge/dist/' || true)"
if [ -n "$CHANGES" ]; then
  STATE=", with uncommitted changes"
fi
TODAY="$(date +%Y-%m-%d)"
VERSION="$(sed -n 's/^  version: "\(.*\)"$/\1/p' "$SKILL_DIR/SKILL.md" | head -n 1)"
SNAP="$OUT/canon-snapshot.md"
MISSING=0

# Append one repo file to the snapshot, in a four-backtick fence so its own code blocks survive.
add_file() {
  rel="$1"
  if [ -f "$REPO/$rel" ]; then
    {
      printf '\n---\n\n### FILE: %s\n\n````\n' "$rel"
      cat "$REPO/$rel"
      printf '\n````\n'
    } >> "$SNAP"
  else
    printf '\n---\n\n### MISSING AT BUILD TIME: %s\n' "$rel" >> "$SNAP"
    echo "build-pack: warning: $rel not found" >&2
    MISSING=$((MISSING + 1))
  fi
}

# Print a skill file without its YAML frontmatter.
body() {
  awk 'NR == 1 && $0 == "---" { fm = 1; next } fm && $0 == "---" { fm = 0; next } !fm { print }' "$1"
}

# Append one skill file to a pack.
add_skill_part() {
  part="$1"
  pack="$2"
  {
    printf '\n---\n\n## SKILL FILE: %s\n\n' "$part"
    case "$part" in
      *.json) printf '```json\n'; cat "$SKILL_DIR/$part"; printf '```\n' ;;
      *) body "$SKILL_DIR/$part" ;;
    esac
  } >> "$pack"
}

# ---- 1. Canon snapshot ------------------------------------------------------

{
  printf '# ARENA canon snapshot\n\n'
  printf 'Built %s from commit %s%s, by arena-forge v%s (scripts/build-pack.sh).\n\n' "$TODAY" "$COMMIT" "$STATE" "$VERSION"
  printf 'This is a copy for models that cannot read the repo. The repo is the truth: if the founder pastes a newer file, the newer file wins. Rebuild after any ruling changes, and never edit this file by hand.\n'
} > "$SNAP"

add_file "CLAUDE.md"

for f in "$REPO"/governance/10-CANON/DECISIONS/*.md; do
  [ -e "$f" ] || continue
  add_file "${f#"$REPO"/}"
done

# Canon update documents that rulings adopt, such as CANON-2's.
for f in "$REPO"/governance/50-STRATEGY/*CANON*.md; do
  [ -e "$f" ] || continue
  add_file "${f#"$REPO"/}"
done

add_file "contracts/game-module.ts"
add_file "contracts/scoring.ts"
add_file "tests/determinism.ts"

# House format: one game in full. precision-tap if it exists, else the first game found.
HOUSE=""
if [ -f "$REPO/games/precision-tap/index.ts" ]; then
  HOUSE="games/precision-tap/index.ts"
else
  for f in "$REPO"/games/*/index.ts; do
    [ -e "$f" ] || continue
    HOUSE="${f#"$REPO"/}"
    break
  done
fi
if [ -n "$HOUSE" ]; then
  add_file "$HOUSE"
fi

# The pool: every game's provenance.
for f in "$REPO"/games/*/provenance.json; do
  [ -e "$f" ] || continue
  add_file "${f#"$REPO"/}"
done

# Pitch history: card headings, mechanic DNA and kill lists only, to keep the pack small.
HAVE_PITCHES=0
for f in "$REPO"/docs/forge/pitches/*.md; do
  [ -e "$f" ] || continue
  if [ "$HAVE_PITCHES" -eq 0 ]; then
    printf '\n---\n\n### PITCH HISTORY (card headings, mechanic DNA and kill lists only)\n' >> "$SNAP"
    HAVE_PITCHES=1
  fi
  printf '\n#### %s\n\n' "${f#"$REPO"/}" >> "$SNAP"
  awk '
    /^## Kill list/ { inkill = 1; print; next }
    /^## /          { inkill = 0 }
    inkill          { print; next }
    /^### /         { print; next }
    /Mechanic DNA:/ { print }
  ' "$f" >> "$SNAP"
done

# ---- 2. One chat pack per profile -------------------------------------------

for p in deep strong fast; do
  PACK="$OUT/arena-forge-$p.md"
  {
    printf '# ARENA FORGE chat pack: profile %s\n\n' "$p"
    printf 'Built %s from commit %s%s (arena-forge v%s).\n\n' "$TODAY" "$COMMIT" "$STATE" "$VERSION"
    printf 'How to use: paste this whole file as the system prompt, or upload it and say "Follow this file. Profile %s, tag <your model>." Then give a mode, for example: PITCH micro.\n\n' "$p"
    printf 'You are in chat mode with profile=%s: you cannot run commands in the ARENA repo. The skill files follow in read order, then the canon snapshot, which stands in for the repo.\n' "$p"
  } > "$PACK"
  for part in \
    SKILL.md \
    references/canon.md \
    "references/profile-$p.md" \
    references/chat-mode.md \
    references/glossary.md \
    references/example-golden-card.md \
    references/example-weak-card.md \
    references/rubric.md \
    assets/provenance.example.json \
    assets/skill-evidence.example.json
  do
    add_skill_part "$part" "$PACK"
  done
  printf '\n---\n\n' >> "$PACK"
  cat "$SNAP" >> "$PACK"
done

# ---- 3. Report ---------------------------------------------------------------

echo "build-pack: commit $COMMIT$STATE, $MISSING missing file(s), output in $OUT"
for f in "$SNAP" "$OUT"/arena-forge-*.md; do
  bytes=$(wc -c < "$f" | tr -d ' ')
  echo "  $(basename "$f"): $bytes bytes, about $((bytes / 4)) tokens"
done
