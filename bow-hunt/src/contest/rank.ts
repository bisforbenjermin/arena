import type { AwardPlan, EntryRow, Ranked } from './types';

/**
 * Best entry per player. A player with any rejected entry is out for the day.
 * Ties: fewer arrows fired, then earlier entry, then entry id.
 */
export function rankEntries(rows: EntryRow[]): Ranked[] {
  const dq = new Set(rows.filter((r) => r.status === 'rejected').map((r) => r.playerId));
  const sorted = rows
    .filter((r) => !dq.has(r.playerId))
    .slice()
    .sort((a, b) =>
      b.score - a.score ||
      a.shotsFired - b.shotsFired ||
      a.createdAt - b.createdAt ||
      (a.entryId < b.entryId ? -1 : a.entryId > b.entryId ? 1 : 0));
  const seen = new Set<string>();
  const out: Ranked[] = [];
  for (const r of sorted) {
    if (seen.has(r.playerId)) continue;
    seen.add(r.playerId);
    out.push({ ...r, rank: out.length + 1 });
  }
  return out;
}

export function assignPrizes(ranked: Ranked[], prizes: { id: string; rank: number }[]): AwardPlan[] {
  const out: AwardPlan[] = [];
  for (const p of prizes.slice().sort((a, b) => a.rank - b.rank)) {
    const r = ranked[p.rank - 1];
    if (r) out.push({ prizeId: p.id, entryId: r.entryId, playerId: r.playerId });
  }
  return out;
}
