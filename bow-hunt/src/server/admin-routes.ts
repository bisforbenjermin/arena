import { timingSafeEqual } from 'node:crypto';
import { GRACE_MS } from '../contest/constants';
import { dayEnd } from '../contest/day';
import type { Prize } from '../contest/types';
import { newId } from './auth';
import { fail, type Ctx, type Handler, type Req } from './http';
import { awardsForDay, entryById } from './admin-store';
import { approveEntry, finalizeDay, rejectEntry } from './finalize';
import { createPool } from './store';

const DAY_RE = /^\d{4}-\d{2}-\d{2}$/;
const obj = (b: unknown): Record<string, unknown> => (typeof b === 'object' && b !== null ? b as Record<string, unknown> : {});
const str = (v: unknown, min: number, max: number): v is string => typeof v === 'string' && v.trim().length >= min && v.trim().length <= max;

function isAdmin(ctx: Ctx, req: Req): boolean {
  const given = Buffer.from(req.headers.get('x-admin-token') ?? '');
  const want = Buffer.from(ctx.env.ADMIN_TOKEN);
  return given.length === want.length && want.length > 0 && timingSafeEqual(given, want);
}

const guard = (h: Handler): Handler => async (ctx, req) => (isAdmin(ctx, req) ? h(ctx, req) : fail(401, 'unauthorized'));

export const adminRoutes: Record<string, Handler> = {
  'POST admin/pools': guard(async (ctx, req) => {
    const b = obj(req.body);
    if (typeof b.day !== 'string' || !DAY_RE.test(b.day)) return fail(400, 'bad_request');
    if (!str(b.title, 1, 60) || !str(b.sponsorName, 1, 60)) return fail(400, 'bad_request');
    if (!Array.isArray(b.prizes) || b.prizes.length < 1 || b.prizes.length > 10) return fail(400, 'bad_request');
    const ranks = new Set<number>();
    const prizes: Prize[] = [];
    for (const raw of b.prizes) {
      const z = obj(raw);
      if (!Number.isInteger(z.rank) || (z.rank as number) < 1 || ranks.has(z.rank as number)) return fail(400, 'bad_request');
      if (!Number.isInteger(z.valueCents) || (z.valueCents as number) < 0) return fail(400, 'bad_request');
      if (!str(z.description, 1, 120) || !str(z.fundedBy, 1, 60)) return fail(400, 'bad_request');
      ranks.add(z.rank as number);
      prizes.push({ id: newId('prize'), rank: z.rank as number, description: z.description.trim(), valueCents: z.valueCents as number, fundedBy: z.fundedBy.trim() });
    }
    const poolId = newId('pool');
    await createPool(ctx.db, { id: poolId, day: b.day, title: b.title.trim(), sponsorName: b.sponsorName.trim(), now: ctx.now(), prizes });
    return { status: 200, body: { poolId } };
  }),

  'POST admin/finalize': guard(async (ctx, req) => {
    const day = obj(req.body).day;
    if (typeof day !== 'string' || !DAY_RE.test(day)) return fail(400, 'bad_request');
    if (ctx.now() < dayEnd(day) + GRACE_MS) return fail(409, 'too_early');
    return { status: 200, body: { awarded: await finalizeDay(ctx.db, day, ctx.now()) } };
  }),

  'GET admin/awards': guard(async (ctx, req) => {
    const day = req.query.get('day') ?? '';
    if (!DAY_RE.test(day)) return fail(400, 'bad_request');
    return { status: 200, body: { awards: await awardsForDay(ctx.db, day) } };
  }),

  'GET admin/entry': guard(async (ctx, req) => {
    const e = await entryById(ctx.db, req.query.get('id') ?? '');
    return e ? { status: 200, body: e } : fail(404, 'not_found');
  }),

  'POST admin/review': guard(async (ctx, req) => {
    const b = obj(req.body);
    if (typeof b.entryId !== 'string' || (b.decision !== 'approve' && b.decision !== 'reject')) return fail(400, 'bad_request');
    const e = await entryById(ctx.db, b.entryId);
    if (!e) return fail(404, 'not_found');
    if (b.decision === 'approve') return { status: 200, body: { approved: await approveEntry(ctx.db, b.entryId) } };
    await rejectEntry(ctx.db, b.entryId, ctx.now());
    return { status: 200, body: { ok: true } };
  }),
};
