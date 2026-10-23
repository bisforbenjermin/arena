import { runReplay } from '../engine/replay';
import { EMAIL_RE, GRACE_MS, LEADERBOARD_SIZE, NAME_RE } from '../contest/constants';
import { dayEnd, dayKey, shiftDay } from '../contest/day';
import { rankEntries } from '../contest/rank';
import { validateReplay } from '../contest/validate';
import { hashToken, newId, newToken } from './auth';
import { fail, type Ctx, type Handler, type Req } from './http';
import { dailySeed } from './seed';
import {
  awardsForPlayer, createPlayer, entryRows, getPick, insertEntry, playerByTokenHash, poolById, poolsForDay, setClaimEmail, setPick,
} from './store';

const obj = (b: unknown): Record<string, unknown> => (typeof b === 'object' && b !== null ? b as Record<string, unknown> : {});

async function authPlayer(ctx: Ctx, req: Req) {
  const h = req.headers.get('authorization') ?? '';
  const m = /^Bearer (\S+)$/.exec(h);
  if (!m) return null;
  return playerByTokenHash(ctx.db, hashToken(m[1]));
}

const today = (ctx: Ctx) => dayKey(new Date(ctx.now()));

export const playerRoutes: Record<string, Handler> = {
  'GET today': async (ctx) => {
    const day = today(ctx);
    return {
      status: 200,
      body: { day, seed: dailySeed(day, ctx.env.SEED_SECRET), closesAt: dayEnd(day), pools: await poolsForDay(ctx.db, day) },
    };
  },

  'POST players': async (ctx, req) => {
    const b = obj(req.body);
    const name = typeof b.displayName === 'string' ? b.displayName.trim() : '';
    if (!NAME_RE.test(name) || b.acceptRules !== true) return fail(400, 'bad_request');
    const token = newToken();
    const playerId = newId('plr');
    await createPlayer(ctx.db, { id: playerId, displayName: name, tokenHash: hashToken(token), now: ctx.now() });
    return { status: 200, body: { playerId, token } };
  },

  'GET me': async (ctx, req) => {
    const p = await authPlayer(ctx, req);
    if (!p) return fail(401, 'unauthorized');
    const day = today(ctx);
    return {
      status: 200,
      body: {
        playerId: p.id, displayName: p.displayName, day,
        pickPoolId: await getPick(ctx.db, p.id, day),
        awards: await awardsForPlayer(ctx.db, p.id),
      },
    };
  },

  'POST picks': async (ctx, req) => {
    const p = await authPlayer(ctx, req);
    if (!p) return fail(401, 'unauthorized');
    const poolId = obj(req.body).poolId;
    const day = today(ctx);
    const pool = typeof poolId === 'string' ? await poolById(ctx.db, poolId) : null;
    if (!pool || pool.day !== day) return fail(404, 'not_found');
    const stored = await setPick(ctx.db, { playerId: p.id, day, poolId: pool.id, now: ctx.now() });
    if (stored !== pool.id) return fail(409, 'pick_locked');
    return { status: 200, body: { poolId: stored } };
  },

  'POST entries': async (ctx, req) => {
    const p = await authPlayer(ctx, req);
    if (!p) return fail(401, 'unauthorized');
    const replay = validateReplay(obj(req.body).replay);
    if (!replay) return fail(422, 'invalid_replay');

    const now = ctx.now();
    const t = today(ctx);
    const y = shiftDay(t, -1);
    let day: string;
    if (replay.seed === dailySeed(t, ctx.env.SEED_SECRET)) day = t;
    else if (replay.seed === dailySeed(y, ctx.env.SEED_SECRET) && now < dayEnd(y) + GRACE_MS) day = y;
    else return fail(422, 'wrong_seed');

    const poolId = await getPick(ctx.db, p.id, day);
    if (!poolId) return fail(403, 'no_pick');

    const result = runReplay(replay);
    if (result.outcome === 'none') return fail(422, 'incomplete_run');

    const entryId = newId('ent');
    await insertEntry(ctx.db, { id: entryId, playerId: p.id, poolId, day, result, replay, now });
    const ranked = rankEntries(await entryRows(ctx.db, poolId));
    const rank = ranked.find((r) => r.playerId === p.id)?.rank ?? null;
    return { status: 200, body: { entryId, score: result.score, rank } };
  },

  'GET leaderboard': async (ctx, req) => {
    const poolId = req.query.get('pool') ?? '';
    const pool = await poolById(ctx.db, poolId);
    if (!pool) return fail(404, 'not_found');
    const ranked = rankEntries(await entryRows(ctx.db, poolId)).slice(0, LEADERBOARD_SIZE);
    return {
      status: 200,
      body: { poolId, entries: ranked.map((r) => ({ rank: r.rank, displayName: r.displayName, score: r.score, shotsFired: r.shotsFired })) },
    };
  },

  'POST claims': async (ctx, req) => {
    const p = await authPlayer(ctx, req);
    if (!p) return fail(401, 'unauthorized');
    const b = obj(req.body);
    const email = typeof b.email === 'string' ? b.email.trim() : '';
    if (!EMAIL_RE.test(email) || email.length > 254) return fail(400, 'bad_request');
    if (typeof b.prizeId !== 'string') return fail(400, 'bad_request');
    const ok = await setClaimEmail(ctx.db, { prizeId: b.prizeId, playerId: p.id, email });
    if (!ok) return fail(403, 'not_claimable');
    return { status: 200, body: { ok: true } };
  },
};
