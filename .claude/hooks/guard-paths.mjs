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
// `guard-paths.mjs --design` is the guard for /design sessions instead (a main session, not an
// agent). In the repo it allows only governance/00-COMMAND/PROPOSED/, governance/10-CANON/DECISIONS/
// (for /rule) and governance/90-ARCHIVE/. Files outside the repo, such as scratch scripts, pass.
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

if (process.argv[2] === '--design') {
  const root = String(process.env.CLAUDE_PROJECT_DIR || process.cwd()).replace(/\\/g, '/').replace(/\/+$/, '').toLowerCase();
  const lower = p.toLowerCase();
  const absolute = p.startsWith('/') || /^[a-z]:\//i.test(p);
  const inRepo = !absolute || lower === root || lower.startsWith(`${root}/`);
  const writable = /(^|\/)governance\/(00-COMMAND\/PROPOSED|10-CANON\/DECISIONS|90-ARCHIVE)\//.test(p);
  if (inRepo && !writable) {
    process.stderr.write(`Blocked: a design session writes only governance/00-COMMAND/PROPOSED/, governance/10-CANON/DECISIONS/ (through /rule) and governance/90-ARCHIVE/. ${filePath} is outside that. Code, specs and contracts/ change in a build session after a ruling: start a fresh session and run /build-next.\n`);
    process.exit(2);
  }
  process.exit(0);
}

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
