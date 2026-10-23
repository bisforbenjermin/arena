import { describe, expect, it } from 'vitest';
import { createLocalDb } from '../src/server/db-local';
import { createPlayer, createPool, insertEntry, setPick } from '../src/server/store';
import { awardsForDay } from '../src/server/admin-store';
import { approveEntry, finalizeDay, rejectEntry } from '../src/server/finalize';
import type { Db } from '../src/server/db';

const DAY = '2026-11-01';
const replay = { version: 1 as const, seed: 'x', inputs: [] };

async function setup(): Promise<Db> {
  const db = await createLocalDb();
  for (const p of ['p1', 'p2', 'p3', 'p4']) await createPlayer(db, { id: p, displayName: p.toUpperCase(), tokenHash: `h-${p}`, now: 1 });
  await createPool(db, {
    id: 'A', day: DAY, title: 'A pool', sponsorName: 'Acme', now: 1,
    prizes: [
      { id: 'A1', rank: 1, description: '$50 card', valueCents: 5000, fundedBy: 'Acme' },
      { id: 'A2', rank: 2, description: '$20 card', valueCents: 2000, fundedBy: 'house' },
    ],
  });
  await createPool(db, {
    id: 'B', day: DAY, title: 'B pool', sponsorName: 'Beta', now: 2,
    prizes: [{ id: 'B1', rank: 1, description: 'Pie', valueCents: 1500, fundedBy: 'Beta' }],
  });
  const entries: [string, string, string, number][] = [['eA1', 'p1', 'A', 3000], ['eA2', 'p2', 'A', 2000], ['eA3', 'p3', 'A', 1000], ['eB4', 'p4', 'B', 500]];
  let t = 10;
  for (const [id, player, pool, score] of entries) {
    await setPick(db, { playerId: player, day: DAY, poolId: pool, now: t });
    await insertEntry(db, {
      id, playerId: player, poolId: pool, day: DAY, replay, now: t++,
      result: { ticks: 100, score, totalHits: 1, shotsFired: 5, outcome: 'failed' },
    });
  }
  return db;
}

const byPrize = async (db: Db) => Object.fromEntries((await awardsForDay(db, DAY)).map((a) => [a.prizeId, a]));

describe('finalize', () => {
  it('awards, approves and re-awards after rejection', async () => {
    const db = await setup();
    expect(await finalizeDay(db, DAY, 100)).toBe(3);
    expect(await finalizeDay(db, DAY, 101)).toBe(0);

    let a = await byPrize(db);
    expect(a.A1.playerId).toBe('p1');
    expect(a.A2.playerId).toBe('p2');
    expect(a.B1.playerId).toBe('p4');
    for (const k of ['A1', 'A2', 'B1']) expect(a[k].status).toBe('pending_review');

    expect(await approveEntry(db, 'eA1')).toBe(1);
    a = await byPrize(db);
    expect(a.A1.status).toBe('approved');

    await rejectEntry(db, 'eA2', 200);
    a = await byPrize(db);
    expect(a.A2.playerId).toBe('p3');
    expect(a.A2.status).toBe('pending_review');
    expect(a.A1.playerId).toBe('p1');
    expect(a.A1.status).toBe('approved');

    await rejectEntry(db, 'eA1', 300);
    a = await byPrize(db);
    expect(a.A1.playerId).toBe('p3');
    expect(a.A2).toBeUndefined();
    expect(a.B1.playerId).toBe('p4');
  });
});
