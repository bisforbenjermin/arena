#!/usr/bin/env node
// guard-paths.mjs — PreToolUse guard for ARENA's build crew (.claude/agents/).
//
// Always blocks an agent's file writes to:
//   contracts/        F1, the game contract. Changes only after a founder ruling (CLAUDE.md, OPS-1).
//   governance/       Canon, the ledger and proposals. The main session writes these, never an agent.
//   specs/<ID>_*.md   The July source specs and specs/00_*.md. Superseded, never edited (OPS-2).
//
// Optional arguments narrow an agent further, e.g. `guard-paths.mjs tests/ evals/`
// lets that agent write only under tests/ or evals/.
//
// Exit 2 blocks the tool call and shows the message to the agent. Exit 0 lets it through.
// This is a backstop, not a sandbox: Bash can still write files. The agent prompts carry the rule too.

import { readFileSync } from 'node:fs';

let filePath = '';
try {
  const input = JSON.parse(readFileSync(0, 'utf8'));
  filePath = String(input?.tool_input?.file_path ?? input?.tool_input?.notebook_path ?? '');
} catch {
  process.exit(0); // Not the event shape this guard expects: let it through.
}
if (!filePath) process.exit(0);

const p = filePath.replace(/\\/g, '/');

const PROTECTED = [
  { re: /(^|\/)contracts\//, why: 'the F1 contract changes only after a founder ruling (OPS-1)' },
  { re: /(^|\/)governance\//, why: 'canon, the ledger and proposals are written by the main session, not by agents' },
  { re: /(^|\/)specs\/([A-Z]\d+_[^/]*|00_[^/]*)\.md$/, why: 'July source specs are superseded, never edited (OPS-2); write specs/<ID>.md instead' },
];

for (const { re, why } of PROTECTED) {
  if (re.test(p)) {
    process.stderr.write(`Blocked: ${filePath} is protected: ${why}. If this change is needed, stop and return a HANDOFF block.\n`);
    process.exit(2);
  }
}

const allowed = process.argv.slice(2);
if (allowed.length > 0) {
  const inside = allowed.some((dir) => new RegExp(`(^|/)${dir.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`).test(p));
  if (!inside) {
    process.stderr.write(`Blocked: this agent may only write under ${allowed.join(', ')}. ${filePath} is outside that.\n`);
    process.exit(2);
  }
}

process.exit(0);
