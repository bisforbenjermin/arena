import { describe, expect, it } from 'vitest';
import { createLocalDb } from '../src/server/db-local';
import {
  createPlayer, createPool, entryRows, insertEntry, playerByTokenHash, poolsForDay, setClaimEmail, setPick,
} from '../src/server/store';

const DAY = '2026-11-01';
const replay = { version: 1 as const, seed: 'x', inputs: [] };
const result = { ticks: 10, score: 1500, totalHits: 2, shotsFired: 3, outcome: 'failed' as const };

describe('store', () => {
  it('creates and finds players by token hash', async () => {
    const db = await createLocalDb();
    await createPlayer(db, { id: 'p1', displayName: 'Ben', tokenHash: 'h1', now: 1 });
    expect(await playerByTokenHash(db, 'h1')).toEqual({ id: 'p1', displayName: 'Ben' });
    expect(await playerByTokenHash(db, 'nope')).toBeNull();
  });

  it('orders prizes by rank and locks the first pick', async () => {
    const db = await createLocalDb();
    await createPlayer(db, { id: 'p1', displayName: 'Ben', tokenHash: 'h1', now: 1 });
    await createPool(db, {
      id: 'A', day: DAY, title: 'Pool A', sponsorName: 'Acme', now: 1,
      prizes: [
        { id: 'z2', rank: 2, description: 'Second', valueCents: 1000, fundedBy: 'house' },
        { id: 'z1', rank: 1, description: 'First', valueCents: 2500, fundedBy: 'Acme' },
      ],
    });
    await createPool(db, { id: 'B', day: DAY, title: 'Pool B', sponsorName: 'Beta', now: 2, prizes: [] });

    let pools = await poolsForDay(db, DAY);
    expect(pools.map((p) => p.id)).toEqual(['A', 'B']);
    expect(pools[0].prizes.map((z) => z.rank)).toEqual([1, 2]);

    expect(await setPick(db, { playerId: 'p1', day: DAY, poolId: 'A', now: 3 })).toBe('A');
    expect(await setPick(db, { playerId: 'p1', day: DAY, poolId: 'B', now: 4 })).toBe('A');
    pools = await poolsForDay(db, DAY);
    expect(pools[0].entrants).toBe(1);
    expect(pools[1].entrants).toBe(0);
  });

  it('stores entries and joins display names', async () => {
    const db = await createLocalDb();
    await createPlayer(db, { id: 'p1', displayName: 'Ben', tokenHash: 'h1', now: 1 });
    await createPool(db, { id: 'A', day: DAY, title: 'Pool A', sponsorName: 'Acme', now: 1, prizes: [] });
    await insertEntry(db, { id: 'e1', playerId: 'p1', poolId: 'A', day: DAY, result, replay, now: 5 });
    const rows = await entryRows(db, 'A');
    expect(rows).toHaveLength(1);
    expect(rows[0]).toMatchObject({ entryId: 'e1', displayName: 'Ben', score: 1500, shotsFired: 3, createdAt: 5, status: 'ok' });
  });

  it('refuses claims on awards that do not exist', async () => {
    const db = await createLocalDb();
    expect(await setClaimEmail(db, { prizeId: 'nope', playerId: 'p1', email: 'a@b.co' })).toBe(false);
  });
});
