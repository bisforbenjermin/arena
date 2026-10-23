import { useMemo, useState } from 'react';
import { dayKey } from '../contest/day';
import { expandInputs } from '../engine/replay';
import { ApiError, dollars } from './api';
import {
  adminAwards, adminCreatePool, adminEntry, adminFinalize, adminReview, loadAdminToken, saveAdminToken,
  type AdminAward, type AdminEntry,
} from './adminApi';
import { Game } from './Game';

type PrizeDraft = { rank: string; description: string; dollars: string; fundedBy: string };
const blankPrize = (rank: number): PrizeDraft => ({ rank: String(rank), description: '', dollars: '', fundedBy: '' });
const errCode = (e: unknown) => (e instanceof ApiError ? e.code : 'network_error');

function Replay({ entry }: { entry: AdminEntry }) {
  const [speed, setSpeed] = useState(1);
  const inputs = useMemo(() => expandInputs(entry.replay.inputs), [entry]);
  return (
    <section className="panel stack">
      <div className="row" style={{ justifyContent: 'space-between' }}>
        <strong>{`Server score ${entry.score}`}</strong>
        <button className="secondary" onClick={() => setSpeed((s) => (s === 1 ? 4 : 1))}>{speed === 1 ? '1×' : '4×'}</button>
      </div>
      <Game key={entry.entryId} seed={entry.replay.seed} replay={inputs} speed={speed} />
    </section>
  );
}

export function AdminApp() {
  const [token, setToken] = useState(loadAdminToken);
  const [day, setDay] = useState(() => dayKey(new Date()));
  const [title, setTitle] = useState('');
  const [sponsor, setSponsor] = useState('');
  const [prizes, setPrizes] = useState<PrizeDraft[]>([blankPrize(1)]);
  const [poolMsg, setPoolMsg] = useState<string | null>(null);
  const [finalMsg, setFinalMsg] = useState<string | null>(null);
  const [awards, setAwards] = useState<AdminAward[] | null>(null);
  const [awardsMsg, setAwardsMsg] = useState<string | null>(null);
  const [watching, setWatching] = useState<AdminEntry | null>(null);

  const loadAwards = async () => {
    try {
      setAwards((await adminAwards(token, day)).awards);
      setAwardsMsg(null);
    } catch (e) {
      setAwardsMsg(errCode(e));
    }
  };

  const createPool = async () => {
    try {
      const r = await adminCreatePool(token, {
        day, title: title.trim(), sponsorName: sponsor.trim(),
        prizes: prizes.map((p) => ({
          rank: Number(p.rank), description: p.description.trim(),
          valueCents: Math.round(Number(p.dollars) * 100), fundedBy: p.fundedBy.trim(),
        })),
      });
      setPoolMsg(`Created ${r.poolId}`);
      setTitle(''); setSponsor(''); setPrizes([blankPrize(1)]);
    } catch (e) {
      setPoolMsg(errCode(e));
    }
  };

  const setPrize = (i: number, patch: Partial<PrizeDraft>) =>
    setPrizes((ps) => ps.map((p, j) => (j === i ? { ...p, ...patch } : p)));

  const review = async (entryId: string, decision: 'approve' | 'reject') => {
    if (decision === 'reject' && !window.confirm('Reject this entry? The player is disqualified for the day.')) return;
    try {
      await adminReview(token, entryId, decision);
      await loadAwards();
    } catch (e) {
      setAwardsMsg(errCode(e));
    }
  };

  return (
    <main className="admin stack">
      <h1>Bow Hunt admin</h1>
      <section className="panel row" style={{ justifyContent: 'flex-start' }}>
        <label>Admin token <input aria-label="Admin token" type="password" value={token} onChange={(e) => { setToken(e.target.value); saveAdminToken(e.target.value); }} /></label>
        <label>Day <input aria-label="Day" value={day} onChange={(e) => setDay(e.target.value)} /></label>
      </section>

      <section className="panel stack">
        <h2>Create pool</h2>
        <div className="row" style={{ justifyContent: 'flex-start' }}>
          <input aria-label="Pool title" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
          <input aria-label="Sponsor" placeholder="Sponsor" value={sponsor} onChange={(e) => setSponsor(e.target.value)} />
        </div>
        {prizes.map((p, i) => (
          <div className="row" style={{ justifyContent: 'flex-start' }} key={i}>
            <input aria-label={`Prize ${i + 1} rank`} style={{ width: 64 }} value={p.rank} onChange={(e) => setPrize(i, { rank: e.target.value })} />
            <input aria-label={`Prize ${i + 1} description`} placeholder="Description" value={p.description} onChange={(e) => setPrize(i, { description: e.target.value })} />
            <input aria-label={`Prize ${i + 1} value`} placeholder="Value $" style={{ width: 96 }} value={p.dollars} onChange={(e) => setPrize(i, { dollars: e.target.value })} />
            <input aria-label={`Prize ${i + 1} funded by`} placeholder="Funded by" value={p.fundedBy} onChange={(e) => setPrize(i, { fundedBy: e.target.value })} />
          </div>
        ))}
        <div className="row" style={{ justifyContent: 'flex-start' }}>
          <button className="secondary" onClick={() => setPrizes((ps) => [...ps, blankPrize(ps.length + 1)])}>Add prize</button>
          <button onClick={createPool}>Create pool</button>
        </div>
        {poolMsg && <span className="muted">{poolMsg}</span>}
      </section>

      <section className="panel row" style={{ justifyContent: 'flex-start' }}>
        <button onClick={async () => {
          try { setFinalMsg(`Awarded ${(await adminFinalize(token, day)).awarded}`); } catch (e) { setFinalMsg(errCode(e)); }
        }}>Finalize day</button>
        {finalMsg && <span className="muted">{finalMsg}</span>}
        <button className="secondary" onClick={loadAwards}>Load awards</button>
      </section>

      {awardsMsg && <p className="muted">{awardsMsg}</p>}
      {awards && (
        <section className="panel">
          <table>
            <thead>
              <tr><th>Pool</th><th>Rank</th><th>Prize</th><th>Player</th><th>Score</th><th>Status</th><th>Email</th><th /></tr>
            </thead>
            <tbody>
              {awards.map((a) => (
                <tr key={a.prizeId} data-testid="award-row">
                  <td>{a.poolTitle}</td><td>{a.rank}</td><td>{`${a.description} (${dollars(a.valueCents)})`}</td>
                  <td>{a.displayName}</td><td>{a.score}</td><td>{a.status}</td><td>{a.claimEmail ?? ''}</td>
                  <td className="row">
                    <button className="secondary" onClick={async () => {
                      try { setWatching(await adminEntry(token, a.entryId)); } catch (e) { setAwardsMsg(errCode(e)); }
                    }}>Watch</button>
                    <button onClick={() => review(a.entryId, 'approve')}>Approve</button>
                    <button className="secondary" onClick={() => review(a.entryId, 'reject')}>Reject</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}
      {watching && <Replay entry={watching} />}
    </main>
  );
}
