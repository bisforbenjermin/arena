import { readFileSync } from 'node:fs';
import { isDeepStrictEqual } from 'node:util';
import { runReplay } from '../src/engine/replay';
import type { ReplayLog } from '../src/engine/types';

const [replayPath, expectedPath] = process.argv.slice(2).filter((a) => a !== '--');
if (!replayPath) {
  console.error('usage: verify-replay <replay.json> [expected.json]');
  process.exit(2);
}
const log = JSON.parse(readFileSync(replayPath, 'utf8')) as ReplayLog;
const result = runReplay(log);
console.log(JSON.stringify(result));
if (expectedPath) {
  const expected = JSON.parse(readFileSync(expectedPath, 'utf8'));
  if (isDeepStrictEqual(result, expected)) {
    console.log('OK');
    process.exit(0);
  }
  console.log('MISMATCH');
  console.log('expected', JSON.stringify(expected));
  console.log('actual  ', JSON.stringify(result));
  process.exit(1);
}
