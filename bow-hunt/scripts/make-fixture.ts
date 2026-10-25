import { mkdirSync, writeFileSync } from 'node:fs';
import { DEFAULT_SEED } from '../src/engine/constants';
import { makeReplay, runReplay } from '../src/engine/replay';
import { makeLeadBot, playRun } from '../src/testing/bots';

const { inputs } = playRun(DEFAULT_SEED, makeLeadBot());
const log = makeReplay('daily', DEFAULT_SEED, inputs);
mkdirSync('fixtures', { recursive: true });
writeFileSync('fixtures/replay-bot.json', JSON.stringify(log));
writeFileSync('fixtures/replay-bot.expected.json', JSON.stringify(runReplay(log), null, 2) + '\n');
console.log(`wrote fixtures (${inputs.length} ticks, ${log.inputs.length} runs)`);
