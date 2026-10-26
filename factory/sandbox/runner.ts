/**
 * G2 — Sandbox Runner
 *
 * Reads every job from factory/queue/pending/, runs all five gates,
 * and moves each job to queue/passed/ or queue/rejected/.
 *
 * Usage:
 *   npx tsx sandbox/runner.ts
 *   node --expose-gc $(which tsx) sandbox/runner.ts   # enables heap GC for memory gate
 */

import { readdirSync, readFileSync, mkdirSync, writeFileSync, renameSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  checkForbiddenApis,
  bundleCandidate,
  checkBundleSize,
  checkDeterminism,
  checkScoreNumeric,
  checkLifecycle,
  checkMemoryLeak,
  type CheckResult,
} from './checks.js';

const __dir   = dirname(fileURLToPath(import.meta.url));
const PENDING  = join(__dir, '..', 'queue', 'pending');
const PASSED   = join(__dir, '..', 'queue', 'passed');
const REJECTED = join(__dir, '..', 'queue', 'rejected');

mkdirSync(PASSED,   { recursive: true });
mkdirSync(REJECTED, { recursive: true });

interface JobMeta {
  jobId:       string;
  costCents:   number;
  generatedAt: string;
  status:      string;
}

async function processJob(jobId: string): Promise<void> {
  const jobDir   = join(PENDING, jobId);
  const indexTs  = join(jobDir, 'index.ts');
  const bundleJs = join(jobDir, '_bundle.mjs');
  const metaPath = join(jobDir, 'meta.json');

  const source = readFileSync(indexTs, 'utf8');
  const results: CheckResult[] = [];

  console.log(`\n[G2] ${jobId}`);

  // Gate 1 — source scan (fast, no bundle needed)
  const apiCheck = checkForbiddenApis(source);
  results.push(apiCheck);
  console.log(`  forbidden-apis: ${apiCheck.pass ? 'PASS' : `FAIL — ${apiCheck.reason}`}`);

  if (!apiCheck.pass) {
    await finalise(jobId, jobDir, results, false, metaPath);
    return;
  }

  // Gate 2 — bundle + size
  const bundleResult = await bundleCandidate(indexTs, bundleJs);
  if (!bundleResult.pass) {
    results.push({ pass: false, gate: 'compile', reason: bundleResult.error });
    console.log(`  compile: FAIL — ${bundleResult.error}`);
    await finalise(jobId, jobDir, results, false, metaPath);
    return;
  }
  console.log('  compile: PASS');

  const sizeCheck = checkBundleSize(bundleJs);
  results.push(sizeCheck);
  console.log(`  bundle-size: ${sizeCheck.pass ? 'PASS' : `FAIL — ${sizeCheck.reason}`}`);

  if (!sizeCheck.pass) {
    await finalise(jobId, jobDir, results, false, metaPath);
    return;
  }

  // Gate 3 — determinism (Node sim, no DOM)
  const detCheck = await checkDeterminism(bundleJs);
  results.push(detCheck);
  console.log(`  determinism: ${detCheck.pass ? 'PASS' : `FAIL — ${detCheck.reason}`}`);

  // Gate 3b — score numeric (FORMAT-1 point 1/2: terminal numeric, non-NaN)
  const scoreCheck = await checkScoreNumeric(bundleJs);
  results.push(scoreCheck);
  console.log(`  score-numeric: ${scoreCheck.pass ? 'PASS' : `FAIL — ${scoreCheck.reason}`}`);

  // Gate 4 — lifecycle (jsdom view mount + destroy)
  const lcCheck = await checkLifecycle(bundleJs);
  results.push(lcCheck);
  console.log(`  lifecycle: ${lcCheck.pass ? 'PASS' : `FAIL — ${lcCheck.reason}`}`);

  // Gate 5 — memory leak (100 cycles)
  const memCheck = await checkMemoryLeak(bundleJs);
  results.push(memCheck);
  console.log(`  memory-leak: ${memCheck.pass ? 'PASS' : `FAIL — ${memCheck.reason}`}`);

  const allPass = results.every(r => r.pass);
  await finalise(jobId, jobDir, results, allPass, metaPath);
}

async function finalise(
  jobId:     string,
  jobDir:    string,
  results:   CheckResult[],
  pass:      boolean,
  metaPath:  string,
): Promise<void> {
  const meta = JSON.parse(readFileSync(metaPath, 'utf8')) as JobMeta;
  const failures = results.filter(r => !r.pass);

  meta.status = pass ? 'passed' : 'rejected';
  (meta as unknown as Record<string, unknown>)['g2'] = {
    checkedAt: new Date().toISOString(),
    pass,
    results,
    ...(failures.length > 0 && { rejectionReasons: failures.map(f => `${f.gate}: ${f.reason}`) }),
  };

  writeFileSync(metaPath, JSON.stringify(meta, null, 2));

  const dest = pass ? join(PASSED, jobId) : join(REJECTED, jobId);
  renameSync(jobDir, dest);

  console.log(`  → ${pass ? 'PASSED' : 'REJECTED'} (moved to queue/${pass ? 'passed' : 'rejected'}/${jobId})`);

  // Append to rejection log for G1 prompt tuning
  if (!pass) {
    const logPath = join(__dir, '..', 'queue', 'rejection-log.jsonl');
    const line    = JSON.stringify({
      jobId,
      checkedAt: new Date().toISOString(),
      reasons:   failures.map(f => ({ gate: f.gate, reason: f.reason })),
    });
    writeFileSync(logPath, line + '\n', { flag: 'a' });
  }
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────

const jobs = existsSync(PENDING)
  ? readdirSync(PENDING, { withFileTypes: true })
      .filter(d => d.isDirectory())
      .map(d => d.name)
  : [];

if (jobs.length === 0) {
  console.log('[G2] no pending jobs. Run `npm run generate` first.');
  process.exit(0);
}

console.log(`[G2] processing ${jobs.length} job(s)…`);
for (const jobId of jobs) {
  await processJob(jobId);
}
console.log('\n[G2] done.');
