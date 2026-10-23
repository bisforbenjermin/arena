import { describe, expect, it } from 'vitest';
import { createLocalDb } from '../src/server/db-local';
import { insertEntry, setPick } from '../src/server/store';
import { makeFetch } from '../api/_handler';
import type { Ctx } from '../src/server/http';
import { body, call } from './api-helpers';

const DAY = '2026-11-01';

describe('admin API', () => {
  it('creates pools, finalizes, reviews and allows claims', async () => {
    const db = await createLocalDb();
    let now = Date.parse('2026-11-01T18:00:00Z');
    const ctx: Ctx = { db, env: { SEED_SECRET: 'test-secret', ADMIN_TOKEN: 'adm' }, now: () => now };

    expect((await call(ctx, 'POST', 'admin/pools', { admin: 'wrong', body: {} })).status).toBe(401);
    expect((await call(ctx, 'GET', 'admin/awards', { query: { day: DAY } })).status).toBe(401);

    const dup = await call(ctx, 'POST', 'admin/pools', {
      admin: 'adm',
      body: { day: DAY, title: 'Acme Feast', sponsorName: 'Acme', prizes: [
        { rank: 1, description: '$25 gift card', valueCents: 2500, fundedBy: 'Acme' },
        { rank: 1, description: 'Pie', valueCents: 1000, fundedBy: 'house' },
      ] },
    });
    expect(dup.status).toBe(400);

    const created = await call(ctx, 'POST', 'admin/pools', {
      admin: 'adm',
      body: { day: DAY, title: 'Acme Feast', sponsorName: 'Acme', prizes: [{ rank: 1, description: '$25 gift card', valueCents: 2500, fundedBy: 'Acme' }] },
    });
    expect(created.status).toBe(200);
    const poolId = body(created).poolId as string;
    expect(poolId).toMatch(/^pool_/);

    const player = body(await call(ctx, 'POST', 'players', { body: { displayName: 'Winner', acceptRules: true } }));
    await setPick(db, { playerId: player.playerId, day: DAY, poolId, now });
    await insertEntry(db, {
      id: 'e1', playerId: player.playerId, poolId, day: DAY, now,
      replay: { version: 1, seed: 'x', inputs: [] },
      result: { ticks: 100, score: 4000, totalHits: 4, shotsFired: 8, outcome: 'failed' },
    });

    now = Date.parse('2026-11-02T08:10:00Z');
    const early = await call(ctx, 'POST', 'admin/finalize', { admin: 'adm', body: { day: DAY } });
    expect(early.status).toBe(409);
    expect(body(early).error).toBe('too_early');
    now = Date.parse('2026-11-02T08:20:00Z');
    expect(body(await call(ctx, 'POST', 'admin/finalize', { admin: 'adm', body: { day: DAY } }))).toEqual({ awarded: 1 });

    const awards = body(await call(ctx, 'GET', 'admin/awards', { admin: 'adm', query: { day: DAY } })).awards;
    const prizeId = awards[0].prizeId as string;
    expect(awards[0].status).toBe('pending_review');

    expect((await call(ctx, 'POST', 'claims', { token: player.token, body: { prizeId, email: 'w@example.com' } })).status).toBe(403);
    expect((await call(ctx, 'GET', 'admin/entry', { admin: 'adm', query: { id: 'nope' } })).status).toBe(404);
    expect(body(await call(ctx, 'GET', 'admin/entry', { admin: 'adm', query: { id: 'e1' } })).replay).toEqual({ version: 1, seed: 'x', inputs: [] });
    expect((await call(ctx, 'POST', 'admin/review', { admin: 'adm', body: { entryId: 'nope', decision: 'approve' } })).status).toBe(404);
    expect(body(await call(ctx, 'POST', 'admin/review', { admin: 'adm', body: { entryId: 'e1', decision: 'approve' } }))).toEqual({ approved: 1 });
    expect((await call(ctx, 'POST', 'claims', { token: player.token, body: { prizeId, email: 'w@example.com' } })).status).toBe(200);

    const after = body(await call(ctx, 'GET', 'admin/awards', { admin: 'adm', query: { day: DAY } })).awards;
    expect(after[0]).toMatchObject({ claimEmail: 'w@example.com', status: 'approved', displayName: 'Winner', score: 4000 });

    const me = body(await call(ctx, 'GET', 'me', { token: player.token }));
    expect(me.awards[0]).toMatchObject({ description: '$25 gift card', status: 'approved', claimed: true });
  }, 30000);

  it('makeFetch routes by path or query and rejects bad JSON', async () => {
    const db = await createLocalDb();
    const ctx: Ctx = { db, env: { SEED_SECRET: 'test-secret', ADMIN_TOKEN: 'adm' }, now: () => Date.parse('2026-11-01T18:00:00Z') };
    const f = makeFetch(async () => ctx);
    const a = await f(new Request('http://x/api/today'));
    expect(a.status).toBe(200);
    const aj = await a.json();
    expect(aj.seed).toBe('bh-2026-11-01-61a7c1d2c3d74b11');
    const b = await f(new Request('http://x/api?route=today'));
    expect((await b.json()).seed).toBe(aj.seed);
    const c = await f(new Request('http://x/api/players', { method: 'POST', body: '{' }));
    expect(c.status).toBe(400);
    const d = await f(new Request('http://x/api/today', { headers: { 'content-length': '2000000' } }));
    expect(d.status).toBe(413);
    const broken = makeFetch(async () => { throw new Error('nope'); });
    const e = await broken(new Request('http://x/api/today'));
    expect(e.status).toBe(500);
    expect((await e.json()).error).toBe('misconfigured');
  }, 30000);
});
