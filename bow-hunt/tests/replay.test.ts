import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { compressInputs, expandInputs, runReplay } from '../src/engine/replay';
import type { Input, ReplayLog } from '../src/engine/types';

describe('replay', () => {
  it('compresses and expands losslessly', () => {
    const inputs: Input[] = [
      ...Array.from({ length: 3 }, () => ({ aimX: 480, aimY: 100, drawing: false })),
      ...Array.from({ length: 2 }, () => ({ aimX: 480, aimY: 100, drawing: true })),
    ];
    const runs = compressInputs(inputs);
    expect(runs).toEqual([[3, 480, 100, 0], [2, 480, 100, 1]]);
    expect(expandInputs(runs)).toEqual(inputs);
  });

  it('replays the bot fixture to the exact result', () => {
    const log = JSON.parse(readFileSync('fixtures/replay-bot.json', 'utf8')) as ReplayLog;
    expect(runReplay(log)).toEqual({ ticks: 4134, score: 13000, totalHits: 19, shotsFired: 43, outcome: 'failed' });
  });

  it('rejects unknown versions', () => {
    expect(() => runReplay({ version: 2, seed: 'x', inputs: [] } as unknown as ReplayLog)).toThrow('Unsupported replay version');
  });
});
