import { assignPrizes, rankEntries } from '../contest/rank';
import type { Db } from './db';
import { entryRows, poolsForDay } from './store';
import {
  approveAwardsForEntry, deleteAwardsForRejection, entryById, insertAwards, prizesForPool, setEntryStatus,
} from './admin-store';

export async function finalizePool(db: Db, poolId: string, now: number): Promise<number> {
  const ranked = rankEntries(await entryRows(db, poolId));
  return insertAwards(db, assignPrizes(ranked, await prizesForPool(db, poolId)), now);
}

/** Idempotent: prizes that already have an award are skipped. The route enforces timing. */
export async function finalizeDay(db: Db, day: string, now: number): Promise<number> {
  let n = 0;
  for (const p of await poolsForDay(db, day)) n += await finalizePool(db, p.id, now);
  return n;
}

export async function approveEntry(db: Db, entryId: string): Promise<number> {
  return approveAwardsForEntry(db, entryId);
}

/** Disqualifies the player's entry and re-awards pending prizes in that pool. Approved awards of others never move. */
export async function rejectEntry(db: Db, entryId: string, now: number) {
  const e = await entryById(db, entryId);
  if (!e) return;
  await setEntryStatus(db, entryId, 'rejected');
  await deleteAwardsForRejection(db, e.poolId, entryId);
  await finalizePool(db, e.poolId, now);
}
