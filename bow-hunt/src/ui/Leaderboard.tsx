import { useEffect, useState } from 'react';
import { getLeaderboard, type LeaderRow } from './api';

export function Leaderboard({ poolId, refreshKey }: { poolId: string; refreshKey?: number }) {
  const [rows, setRows] = useState<LeaderRow[] | null>(null);
  useEffect(() => {
    let live = true;
    getLeaderboard(poolId).then((r) => live && setRows(r.entries)).catch(() => live && setRows([]));
    return () => { live = false; };
  }, [poolId, refreshKey]);

  if (!rows) return <p className="muted">Loading leaderboard…</p>;
  if (rows.length === 0) return <p className="muted">No scores yet today.</p>;
  return (
    <table>
      <thead><tr><th>#</th><th>Hunter</th><th>Score</th></tr></thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r.rank}><td>{r.rank}</td><td>{r.displayName}</td><td>{r.score}</td></tr>
        ))}
      </tbody>
    </table>
  );
}
