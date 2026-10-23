import type { ReplayLog, ReplayResult } from '../engine/types';
import type { EntryRow, Pool, Prize } from '../contest/types';
import type { Db } from './db';

export async function createPlayer(db: Db, p: { id: string; displayName: string; tokenHash: string; now: number }) {
  await db.query(
    'INSERT INTO players (id, display_name, token_hash, rules_accepted_at, created_at) VALUES ($1, $2, $3, $4, $4)',
    [p.id, p.displayName, p.tokenHash, p.now],
  );
}

export async function playerByTokenHash(db: Db, hash: string): Promise<{ id: string; displayName: string } | null> {
  const r = await db.query<{ id: string; display_name: string }>('SELECT id, display_name FROM players WHERE token_hash = $1', [hash]);
  const row = r.rows[0];
  return row ? { id: row.id, displayName: row.display_name } : null;
}

export async function createPool(db: Db, p: { id: string; day: string; title: string; sponsorName: string; now: number; prizes: Prize[] }) {
  await db.query('INSERT INTO pools (id, day, title, sponsor_name, created_at) VALUES ($1, $2, $3, $4, $5)',
    [p.id, p.day, p.title, p.sponsorName, p.now]);
  for (const z of p.prizes) {
    await db.query(
      'INSERT INTO prizes (id, pool_id, rank, description, value_cents, funded_by) VALUES ($1, $2, $3, $4, $5, $6)',
      [z.id, p.id, z.rank, z.description, z.valueCents, z.fundedBy],
    );
  }
}

export async function poolsForDay(db: Db, day: string): Promise<Pool[]> {
  const pools = await db.query<{ id: string; day: string; title: string; sponsor_name: string; entrants: number }>(
    `SELECT p.id, p.day, p.title, p.sponsor_name,
            (SELECT COUNT(*)::int FROM picks k WHERE k.pool_id = p.id) AS entrants
       FROM pools p WHERE p.day = $1 ORDER BY p.created_at, p.id`,
    [day],
  );
  const out: Pool[] = [];
  for (const p of pools.rows) {
    const prizes = await db.query<{ id: string; rank: number; description: string; value_cents: number; funded_by: string }>(
      'SELECT id, rank, description, value_cents, funded_by FROM prizes WHERE pool_id = $1 ORDER BY rank',
      [p.id],
    );
    out.push({
      id: p.id, day: p.day, title: p.title, sponsorName: p.sponsor_name, entrants: Number(p.entrants),
      prizes: prizes.rows.map((z) => ({ id: z.id, rank: z.rank, description: z.description, valueCents: z.value_cents, fundedBy: z.funded_by })),
    });
  }
  return out;
}

export async function poolById(db: Db, id: string): Promise<{ id: string; day: string; title: string; sponsorName: string } | null> {
  const r = await db.query<{ id: string; day: string; title: string; sponsor_name: string }>(
    'SELECT id, day, title, sponsor_name FROM pools WHERE id = $1', [id]);
  const p = r.rows[0];
  return p ? { id: p.id, day: p.day, title: p.title, sponsorName: p.sponsor_name } : null;
}

/** First pick of the day wins; later picks are ignored. Returns the stored pool. */
export async function setPick(db: Db, p: { playerId: string; day: string; poolId: string; now: number }): Promise<string> {
  await db.query(
    'INSERT INTO picks (player_id, day, pool_id, created_at) VALUES ($1, $2, $3, $4) ON CONFLICT (player_id, day) DO NOTHING',
    [p.playerId, p.day, p.poolId, p.now],
  );
  return (await getPick(db, p.playerId, p.day))!;
}

export async function getPick(db: Db, playerId: string, day: string): Promise<string | null> {
  const r = await db.query<{ pool_id: string }>('SELECT pool_id FROM picks WHERE player_id = $1 AND day = $2', [playerId, day]);
  return r.rows[0]?.pool_id ?? null;
}

export async function insertEntry(db: Db, e: { id: string; playerId: string; poolId: string; day: string; result: ReplayResult; replay: ReplayLog; now: number }) {
  await db.query(
    `INSERT INTO entries (id, player_id, pool_id, day, score, total_hits, shots_fired, ticks, outcome, replay, status, created_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10::jsonb, 'ok', $11)`,
    [e.id, e.playerId, e.poolId, e.day, e.result.score, e.result.totalHits, e.result.shotsFired, e.result.ticks,
      e.result.outcome, JSON.stringify(e.replay), e.now],
  );
}

export async function entryRows(db: Db, poolId: string): Promise<EntryRow[]> {
  const r = await db.query<{ id: string; player_id: string; display_name: string; score: number; shots_fired: number; created_at: number; status: 'ok' | 'rejected' }>(
    `SELECT e.id, e.player_id, p.display_name, e.score, e.shots_fired, e.created_at, e.status
       FROM entries e JOIN players p ON p.id = e.player_id
      WHERE e.pool_id = $1`,
    [poolId],
  );
  return r.rows.map((x) => ({
    entryId: x.id, playerId: x.player_id, displayName: x.display_name, score: x.score,
    shotsFired: x.shots_fired, createdAt: Number(x.created_at), status: x.status,
  }));
}

export type PlayerAward = {
  prizeId: string; day: string; poolTitle: string; rank: number; description: string;
  valueCents: number; status: string; claimed: boolean;
};

export async function awardsForPlayer(db: Db, playerId: string): Promise<PlayerAward[]> {
  const r = await db.query<{ prize_id: string; day: string; title: string; rank: number; description: string; value_cents: number; status: string; claim_email: string | null }>(
    `SELECT a.prize_id, po.day, po.title, z.rank, z.description, z.value_cents, a.status, a.claim_email
       FROM awards a
       JOIN prizes z ON z.id = a.prize_id
       JOIN pools po ON po.id = z.pool_id
      WHERE a.player_id = $1
      ORDER BY po.day DESC, z.rank`,
    [playerId],
  );
  return r.rows.map((x) => ({
    prizeId: x.prize_id, day: x.day, poolTitle: x.title, rank: x.rank, description: x.description,
    valueCents: x.value_cents, status: x.status, claimed: x.claim_email !== null,
  }));
}

/** Records a claim email only on an approved award owned by the player. */
export async function setClaimEmail(db: Db, p: { prizeId: string; playerId: string; email: string }): Promise<boolean> {
  const r = await db.query(
    `UPDATE awards SET claim_email = $3 WHERE prize_id = $1 AND player_id = $2 AND status = 'approved' RETURNING prize_id`,
    [p.prizeId, p.playerId, p.email],
  );
  return r.rows.length > 0;
}
