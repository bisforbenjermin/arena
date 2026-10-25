import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { dayEnd, dayKey, shiftDay } from '../src/contest/day';
import { assignPrizes, rankEntries } from '../src/contest/rank';
import { validateReplay } from '../src/contest/validate';
import type { EntryRow } from '../src/contest/types';

describe('contest day math', () => {
  it('dayKey uses Pacific time', () => {
    expect(dayKey(new Date('2026-11-26T07:59:59Z'))).toBe('2026-11-25');
    expect(dayKey(new Date('2026-11-26T08:00:00Z'))).toBe('2026-11-26');
    expect(dayKey(new Date('2026-11-01T18:00:00Z'))).toBe('2026-11-01');
  });

  it('dayEnd handles the DST change', () => {
    expect(dayEnd('2026-10-31')).toBe(Date.parse('2026-11-01T07:00:00Z'));
    expect(dayEnd('2026-11-25')).toBe(Date.parse('2026-11-26T08:00:00Z'));
    expect(dayEnd('2026-11-01')).toBe(Date.parse('2026-11-02T08:00:00Z'));
  });

  it('shiftDay crosses month and year boundaries', () => {
    expect(shiftDay('2026-11-01', -1)).toBe('2026-10-31');
    expect(shiftDay('2026-12-31', 1)).toBe('2027-01-01');
    expect(shiftDay('2026-03-01', -1)).toBe('2026-02-28');
  });
});

describe('ranking', () => {
  const mk = (entryId: string, playerId: string, score: number, shotsFired: number, createdAt: number, status: 'ok' | 'rejected'): EntryRow =>
    ({ entryId, playerId, displayName: playerId, score, shotsFired, createdAt, status });
  const rows = [
    mk('e1', 'p1', 13000, 43, 1000, 'ok'),
    mk('e2', 'p2', 13000, 40, 2000, 'ok'),
    mk('e3', 'p1', 15000, 50, 3000, 'ok'),
    mk('e4', 'p3', 20000, 30, 4000, 'rejected'),
    mk('e5', 'p3', 9000, 20, 5000, 'ok'),
    mk('e6', 'p4', 13000, 40, 1500, 'ok'),
  ];

  it('ranks best per player, drops disqualified, breaks ties', () => {
    const r = rankEntries(rows);
    expect(r.map((x) => `${x.entryId}/${x.playerId}#${x.rank}`)).toEqual(['e3/p1#1', 'e6/p4#2', 'e2/p2#3']);
  });

  it('assigns only ranks that exist', () => {
    const plans = assignPrizes(rankEntries(rows), [{ id: 'a', rank: 1 }, { id: 'b', rank: 2 }, { id: 'c', rank: 5 }]);
    expect(plans.map((p) => p.entryId)).toEqual(['e3', 'e6']);
  });
});

describe('validateReplay', () => {
  const ok = JSON.parse(readFileSync('fixtures/replay-bot.json', 'utf8'));
  it('accepts the fixture', () => {
    expect(validateReplay(ok)).not.toBeNull();
  });
  it('rejects bad shapes', () => {
    expect(validateReplay({ ...ok, inputs: [[0, 270, 100, 0]] })).toBeNull();
    expect(validateReplay({ ...ok, inputs: [[1, 541, 100, 0]] })).toBeNull();
    expect(validateReplay({ ...ok, inputs: [[1, 270, 961, 0]] })).toBeNull();
    expect(validateReplay({ ...ok, inputs: [[1, 270, 100, 2]] })).toBeNull();
    expect(validateReplay({ ...ok, version: 2 })).toBeNull();
    expect(validateReplay({ ...ok, picks: [2] })).toBeNull();
    expect(validateReplay({ ...ok, picks: undefined })).toBeNull();
    expect(validateReplay({ ...ok, mode: 'ranked' })).toBeNull();
    expect(validateReplay({ ...ok, inputs: [[25000, 270, 100, 0], [1, 270, 100, 1]] })).toBeNull();
    expect(validateReplay(null)).toBeNull();
    expect(validateReplay({ ...ok, seed: '' })).toBeNull();
  });
});
