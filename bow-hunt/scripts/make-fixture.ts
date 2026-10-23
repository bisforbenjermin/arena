import { mkdirSync, writeFileSync } from 'node:fs';
import { DEFAULT_SEED } from '../src/engine/constants';
import { generateRunPlan } from '../src/engine/plan';
import { createInitialState, step } from '../src/engine/sim';
import { botInput } from '../src/engine/bot';
import { compressInputs, runReplay } from '../src/engine/replay';
import type { Input, ReplayLog } from '../src/engine/types';

let s = createInitialState(generateRunPlan(DEFAULT_SEED));
const inputs: Input[] = [];
for (let t = 0; t < 20000 && s.phase !== 'over'; t++) {
  const i = botInput(s, t);
  inputs.push(i);
  s = step(s, i);
}
const log: ReplayLog = { version: 1, seed: DEFAULT_SEED, inputs: compressInputs(inputs) };
mkdirSync('fixtures', { recursive: true });
writeFileSync('fixtures/replay-bot.json', JSON.stringify(log));
writeFileSync('fixtures/replay-bot.expected.json', JSON.stringify(runReplay(log), null, 2) + '\n');
console.log(`wrote fixtures (${inputs.length} ticks, ${log.inputs.length} runs)`);
