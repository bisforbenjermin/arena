import { describe, expect, it } from 'vitest';
import { createLocalDb } from '../src/server/db-local';
import { createPool } from '../src/server/store';
import { compressInputs, expandInputs } from '../src/engine/replay';
import type { Ctx } from '../src/server/http';
import { body, botReplay, call, idleReplay } from './api-helpers';

const SEED = 'bh-2026-11-01-61a7c1d2c3d74b11';

describe('player API', () => {
  it('runs the full player flow', async () => {
    const db = await createLocalDb();
    let now = Date.parse('2026-11-01T18:00:00Z');
    const ctx: Ctx = { db, env: { SEED_SECRET: 'test-secret', ADMIN_TOKEN: 'adm' }, now: () => now };
    await createPool(db, { id: 'A', day: '2026-11-01', title: 'Acme Feast', sponsorName: 'Acme', now: 1, prizes: [{ id: 'zA1', rank: 1, description: '$25 gift card', valueCents: 2500, fundedBy: 'Acme' }] });
    await createPool(db, { id: 'B', day: '2026-11-01', title: 'Beta Pies', sponsorName: 'Beta', now: 2, prizes: [] });

    const t = await call(ctx, 'GET', 'today');
    expect(t.status).toBe(200);
    expect(body(t).seed).toBe(SEED);
    expect(body(t).pools).toHaveLength(2);
    expect(body(t).closesAt).toBe(Date.parse('2026-11-02T08:00:00Z'));

    expect((await call(ctx, 'POST', 'players', { body: { displayName: 'Hunter' } })).status).toBe(400);
    expect((await call(ctx, 'POST', 'players', { body: { displayName: 'x', acceptRules: true } })).status).toBe(400);
    expect((await call(ctx, 'GET', 'me', { token: 'bad' })).status).toBe(401);

    const a = body(await call(ctx, 'POST', 'players', { body: { displayName: 'Hunter A', acceptRules: true } }));
    const me = await call(ctx, 'GET', 'me', { token: a.token });
    expect(me.status).toBe(200);
    expect(body(me)).toMatchObject({ displayName: 'Hunter A', day: '2026-11-01', pickPoolId: null, awards: [] });

    const bot = botReplay(SEED);
    const noPick = await call(ctx, 'POST', 'entries', { token: a.token, body: { replay: bot } });
    expect(noPick.status).toBe(403);
    expect(body(noPick).error).toBe('no_pick');

    expect((await call(ctx, 'POST', 'picks', { token: a.token, body: { poolId: 'A' } })).status).toBe(200);
    const relock = await call(ctx, 'POST', 'picks', { token: a.token, body: { poolId: 'B' } });
    expect(relock.status).toBe(409);
    expect(body(relock).error).toBe('pick_locked');
    expect((await call(ctx, 'POST', 'picks', { token: a.token, body: { poolId: 'nope' } })).status).toBe(404);

    const e = await call(ctx, 'POST', 'entries', { token: a.token, body: { replay: bot } });
    expect(e.status).toBe(200);
    expect(body(e)).toMatchObject({ score: 2000, rank: 1 });
    const stored = await db.query<{ shots_fired: number }>('SELECT shots_fired FROM entries WHERE id = $1', [body(e).entryId]);
    expect(stored.rows[0].shots_fired).toBe(15);

    const wrong = await call(ctx, 'POST', 'entries', { token: a.token, body: { replay: botReplay('gobble-2026') } });
    expect(body(wrong).error).toBe('wrong_seed');
    const partial = { version: 1, seed: SEED, inputs: compressInputs(expandInputs(bot.inputs).slice(0, 100)) };
    const inc = await call(ctx, 'POST', 'entries', { token: a.token, body: { replay: partial } });
    expect(inc.status).toBe(422);
    expect(body(inc).error).toBe('incomplete_run');
    const huge = await call(ctx, 'POST', 'entries', { token: a.token, body: { replay: { version: 1, seed: SEED, inputs: [[20001, 480, 100, 0]] } } });
    expect(body(huge).error).toBe('invalid_replay');

    const b = body(await call(ctx, 'POST', 'players', { body: { displayName: 'Hunter B', acceptRules: true } }));
    await call(ctx, 'POST', 'picks', { token: b.token, body: { poolId: 'A' } });
    const idle = await call(ctx, 'POST', 'entries', { token: b.token, body: { replay: idleReplay(SEED) } });
    expect(body(idle)).toMatchObject({ score: 0, rank: 2 });

    const lb = await call(ctx, 'GET', 'leaderboard', { query: { pool: 'A' } });
    expect(body(lb).entries.map((x: { score: number }) => x.score)).toEqual([2000, 0]);
    expect(body(lb).entries[0]).toMatchObject({ rank: 1, displayName: 'Hunter A' });

    now = Date.parse('2026-11-02T08:10:00Z');
    expect((await call(ctx, 'POST', 'entries', { token: a.token, body: { replay: bot } })).status).toBe(200);
    now = Date.parse('2026-11-02T08:20:00Z');
    expect(body(await call(ctx, 'POST', 'entries', { token: a.token, body: { replay: bot } })).error).toBe('wrong_seed');

    const claim = await call(ctx, 'POST', 'claims', { token: a.token, body: { prizeId: 'zA1', email: 'a@example.com' } });
    expect(claim.status).toBe(403);
    expect((await call(ctx, 'POST', 'claims', { token: a.token, body: { prizeId: 'zA1', email: 'nope' } })).status).toBe(400);
    expect((await call(ctx, 'GET', 'nope')).status).toBe(404);
  }, 30000);
});
