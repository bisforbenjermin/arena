import type { ReplayLog } from '../engine/types';
import type { AwardPlan } from '../contest/types';
import type { Db } from './db';

export type EntryDetail = {
  entryId: string; playerId: string; poolId: string; day: string; score: number; shotsFired: number;
  ticks: number; outcome: string; status: string; replay: ReplayLog;
};

export async function entryById(db: Db, id: string): Promise<EntryDetail | null> {
  const r = await db.query<{ id: string; player_id: string; pool_id: string; day: string; score: number; shots_fired: number; ticks: number; outcome: string; status: string; replay: unknown }>(
    'SELECT id, player_id, pool_id, day, score, shots_fired, ticks, outcome, status, replay FROM entries WHERE id = $1', [id]);
  const e = r.rows[0];
  if (!e) return null;
  const replay = (typeof e.replay === 'string' ? JSON.parse(e.replay) : e.replay) as ReplayLog;
  return {
    entryId: e.id, playerId: e.player_id, poolId: e.pool_id, day: e.day, score: e.score,
    shotsFired: e.shots_fired, ticks: e.ticks, outcome: e.outcome, status: e.status, replay,
  };
}

export async function setEntryStatus(db: Db, id: string, status: 'ok' | 'rejected') {
  await db.query('UPDATE entries SET status = $2 WHERE id = $1', [id, status]);
}

export async function prizesForPool(db: Db, poolId: string): Promise<{ id: string; rank: number }[]> {
  const r = await db.query<{ id: string; rank: number }>('SELECT id, rank FROM prizes WHERE pool_id = $1 ORDER BY rank', [poolId]);
  return r.rows;
}

export async function insertAwards(db: Db, plans: AwardPlan[], now: number): Promise<number> {
  let n = 0;
  for (const p of plans) {
    const r = await db.query(
      `INSERT INTO awards (prize_id, entry_id, player_id, status, created_at) VALUES ($1, $2, $3, 'pending_review', $4)
       ON CONFLICT (prize_id) DO NOTHING RETURNING prize_id`,
      [p.prizeId, p.entryId, p.playerId, now],
    );
    n += r.rows.length;
  }
  return n;
}

/** Drops the rejected entry's awards plus every still-pending award in its pool, so ranks can shift up. */
export async function deleteAwardsForRejection(db: Db, poolId: string, entryId: string) {
  await db.query('DELETE FROM awards WHERE entry_id = $1', [entryId]);
  await db.query(
    `DELETE FROM awards WHERE status = 'pending_review' AND prize_id IN (SELECT id FROM prizes WHERE pool_id = $1)`,
    [poolId],
  );
}

export async function approveAwardsForEntry(db: Db, entryId: string): Promise<number> {
  const r = await db.query(
    `UPDATE awards SET status = 'approved' WHERE entry_id = $1 AND status = 'pending_review' RETURNING prize_id`, [entryId]);
  return r.rows.length;
}

export type DayAward = {
  prizeId: string; poolId: string; poolTitle: string; rank: number; description: string; valueCents: number;
  entryId: string; playerId: string; displayName: string; score: number; status: string; claimEmail: string | null;
};

export async function awardsForDay(db: Db, day: string): Promise<DayAward[]> {
  const r = await db.query<{ prize_id: string; pool_id: string; title: string; rank: number; description: string; value_cents: number; entry_id: string; player_id: string; display_name: string; score: number; status: string; claim_email: string | null }>(
    `SELECT a.prize_id, po.id AS pool_id, po.title, z.rank, z.description, z.value_cents,
            a.entry_id, a.player_id, pl.display_name, e.score, a.status, a.claim_email
       FROM awards a
       JOIN prizes z ON z.id = a.prize_id
       JOIN pools po ON po.id = z.pool_id
       JOIN entries e ON e.id = a.entry_id
       JOIN players pl ON pl.id = a.player_id
      WHERE po.day = $1
      ORDER BY po.title, z.rank`,
    [day],
  );
  return r.rows.map((x) => ({
    prizeId: x.prize_id, poolId: x.pool_id, poolTitle: x.title, rank: x.rank, description: x.description,
    valueCents: x.value_cents, entryId: x.entry_id, playerId: x.player_id, displayName: x.display_name,
    score: x.score, status: x.status, claimEmail: x.claim_email,
  }));
}
