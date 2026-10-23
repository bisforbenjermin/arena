/**
 * Guard tests — .claude/hooks/guard-paths.mjs
 *
 * The guard is the mechanical half of OPS-1 (stop and hand off) and OPS-2 (supersede, never edit).
 * It keeps the build crew out of contracts/, governance/ and the July specs, and keeps /design
 * sessions to proposals, rulings and the archive. These cases pin that behaviour, so a change
 * to the guard can't quietly open a path.
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const GUARD = fileURLToPath(new URL('../.claude/hooks/guard-paths.mjs', import.meta.url));
const ROOT = '/work/code/arena';
const ALLOW = 0;
const BLOCK = 2;

function run(filePath: string, args: string[] = [], root = ROOT): number | null {
  const result = spawnSync(process.execPath, [GUARD, ...args], {
    input: JSON.stringify({ tool_name: 'Write', tool_input: { file_path: filePath } }),
    env: { ...process.env, CLAUDE_PROJECT_DIR: root },
    encoding: 'utf8',
  });
  return result.status;
}

test('agents: the contract, governance and July specs are blocked', () => {
  for (const p of [
    'contracts/game-module.ts',
    `${ROOT}/contracts/scoring.ts`,
    `${ROOT}/governance/10-CANON/DECISIONS/PR-1-prng.md`,
    `${ROOT}/governance/00-COMMAND/PROPOSED/PR-7-replayable-input.md`,
    `${ROOT}/specs/G1_generation_agent_brief.md`,
    `${ROOT}/specs/00_INDEX.md`,
  ]) {
    assert.equal(run(p), BLOCK, p);
  }
});

test('agents: reconciled specs, tests and new code are allowed', () => {
  for (const p of [
    `${ROOT}/specs/G1.md`,
    `${ROOT}/tests/replay.ts`,
    `${ROOT}/factory/generate/index.ts`,
    `${ROOT}/games/precision-tap/index.ts`,
  ]) {
    assert.equal(run(p), ALLOW, p);
  }
});

test('agents: an allowlist narrows writes, and the protected list still wins', () => {
  assert.equal(run(`${ROOT}/specs/G1.md`, ['specs/']), ALLOW);
  assert.equal(run(`${ROOT}/games/x/index.ts`, ['specs/']), BLOCK);
  assert.equal(run(`${ROOT}/tests/a.ts`, ['tests/', 'evals/']), ALLOW);
  assert.equal(run(`${ROOT}/evals/judge.ts`, ['tests/', 'evals/']), ALLOW);
  assert.equal(run(`${ROOT}/factory/a.ts`, ['tests/', 'evals/']), BLOCK);
  assert.equal(run(`${ROOT}/specs/G1_generation_agent_brief.md`, ['specs/']), BLOCK);
});

test('design sessions: proposals, rulings, the archive and scratch files only', () => {
  const design = ['--design'];
  for (const p of [
    `${ROOT}/governance/00-COMMAND/PROPOSED/CONTRACT-2-contract-2-0-0.md`,
    `${ROOT}/governance/10-CANON/DECISIONS/CONTRACT-2-contract-2-0-0.md`,
    `${ROOT}/governance/90-ARCHIVE/2026-10-22/proposed/PR-7-replayable-input.md`,
    'governance/00-COMMAND/PROPOSED/G1-H2-candidate-record.md',
    '/tmp/scratch/check-sin.ts',
  ]) {
    assert.equal(run(p, design), ALLOW, p);
  }
  for (const p of [
    `${ROOT}/contracts/game-module.ts`,
    'contracts/game-module.ts',
    `${ROOT}/games/pressure-hold/index.ts`,
    `${ROOT}/specs/G1.md`,
    `${ROOT}/governance/00-COMMAND/CONTEXT_CAPSULE.md`,
    `${ROOT}/CLAUDE.md`,
  ]) {
    assert.equal(run(p, design), BLOCK, p);
  }
});

test('design sessions: Windows paths', () => {
  const design = ['--design'];
  const root = 'C:\\work\\arena';
  assert.equal(run('C:\\work\\arena\\contracts\\game-module.ts', design, root), BLOCK);
  assert.equal(run('c:\\work\\arena\\games\\x\\index.ts', design, root), BLOCK);
  assert.equal(run('C:\\work\\arena\\governance\\00-COMMAND\\PROPOSED\\x.md', design, root), ALLOW);
});

test('input the guard does not recognise passes through', () => {
  const result = spawnSync(process.execPath, [GUARD], { input: 'not json', encoding: 'utf8' });
  assert.equal(result.status, ALLOW);
});
