import { useCallback, useEffect, useState, type ReactNode } from 'react';
import { ELIGIBILITY_TEXT, EMAIL_RE, NAME_RE } from '../contest/constants';
import { compressInputs } from '../engine/replay';
import type { Input } from '../engine/types';
import {
  ApiError, claim, createPlayer, getMe, getToday, loadPlayer, pick, savePlayer, submitEntry,
  type Me, type MyAward, type StoredPlayer, type Today,
} from './api';
import { Game } from './Game';
import { Leaderboard } from './Leaderboard';
import { PoolPicker } from './PoolPicker';

type Load = { status: 'loading' } | { status: 'error' } | { status: 'ready'; today: Today; me: Me | null };

function JoinForm({ onJoined }: { onJoined: (p: StoredPlayer) => void }) {
  const [name, setName] = useState('');
  const [agree, setAgree] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const valid = NAME_RE.test(name.trim()) && agree;
  const join = async () => {
    try {
      const p = await createPlayer(name.trim());
      savePlayer(p);
      onJoined(p);
    } catch {
      setError("Couldn't join. Try another name.");
    }
  };
  return (
    <section className="panel stack">
      <h2>Join today's hunt</h2>
      <label>
        Hunter name
        <input aria-label="Hunter name" value={name} maxLength={20} onChange={(e) => setName(e.target.value)} />
      </label>
      <label>
        <input type="checkbox" aria-label="eligibility" checked={agree} onChange={(e) => setAgree(e.target.checked)} />
        <span>
          {ELIGIBILITY_TEXT.replace('Official Rules.', '')}
          <a href="/rules.html" target="_blank" rel="noreferrer">Official Rules</a>.
        </span>
      </label>
      <div><button disabled={!valid} onClick={join}>Join</button></div>
      {error && <p className="muted">{error}</p>}
    </section>
  );
}

function PrizeRow({ a, token, onClaimed }: { a: MyAward; token: string; onClaimed: () => void }) {
  const [email, setEmail] = useState('');
  const [err, setErr] = useState<string | null>(null);
  if (a.status !== 'approved') return <li>{`${a.description} — Under review`}</li>;
  if (a.claimed) return <li>{`${a.description} — Claimed — we'll be in touch.`}</li>;
  return (
    <li className="stack">
      <strong>{`You won ${a.description}!`}</strong>
      <div className="row" style={{ justifyContent: 'flex-start' }}>
        <input aria-label="Claim email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
        <button
          disabled={!EMAIL_RE.test(email.trim())}
          onClick={async () => {
            try { await claim(token, a.prizeId, email.trim()); onClaimed(); } catch { setErr("Couldn't submit your claim."); }
          }}
        >Claim</button>
      </div>
      {err && <span className="muted">{err}</span>}
    </li>
  );
}

function MyPrizes({ me, token, onChange }: { me: Me; token: string; onChange: () => void }) {
  if (me.awards.length === 0) return null;
  return (
    <section className="panel">
      <h2>Your prizes</h2>
      <ul className="stack">
        {me.awards.map((a) => <PrizeRow key={a.prizeId} a={a} token={token} onClaimed={onChange} />)}
      </ul>
    </section>
  );
}

export function ContestApp() {
  const [player, setPlayer] = useState<StoredPlayer | null>(loadPlayer);
  const [load, setLoad] = useState<Load>({ status: 'loading' });
  const [runKey, setRunKey] = useState(0);
  const [result, setResult] = useState<string | null>(null);
  const [finished, setFinished] = useState(false);
  const [busy, setBusy] = useState(false);

  const refresh = useCallback(async (p: StoredPlayer | null) => {
    try {
      const today = await getToday();
      let me: Me | null = null;
      if (p) {
        try {
          me = await getMe(p.token);
        } catch (e) {
          if (e instanceof ApiError && e.status === 401) {
            savePlayer(null);
            setPlayer(null);
          } else throw e;
        }
      }
      setLoad({ status: 'ready', today, me });
    } catch {
      setLoad({ status: 'error' });
    }
  }, []);

  useEffect(() => { void refresh(player); }, [player, refresh]);

  const footer = (
    <footer>
      No purchase necessary. Void where prohibited. <a href="/rules.html" target="_blank" rel="noreferrer">Official Rules</a>
    </footer>
  );

  if (load.status === 'loading') return <main className="contest"><p>Loading…</p></main>;
  if (load.status === 'error') {
    return (
      <main className="contest">
        <p>Couldn't reach the server.</p>
        <button onClick={() => { setLoad({ status: 'loading' }); void refresh(player); }}>Retry</button>
      </main>
    );
  }

  const { today, me } = load;
  let body: ReactNode;

  if (today.pools.length === 0) {
    body = (
      <>
        <p>No prize pools today — free play.</p>
        <Game key={runKey} seed={today.seed} />
      </>
    );
  } else if (!player || !me) {
    body = <JoinForm onJoined={(p) => setPlayer(p)} />;
  } else if (!me.pickPoolId) {
    body = (
      <PoolPicker
        pools={today.pools}
        busy={busy}
        onPick={async (poolId) => {
          setBusy(true);
          try {
            await pick(player.token, poolId);
          } catch {
            /* a 409 means a pick already exists; reloading shows it */
          }
          setBusy(false);
          await refresh(player);
        }}
      />
    );
  } else {
    const pool = today.pools.find((p) => p.id === me.pickPoolId);
    const onFinish = async (log: Input[]) => {
      setFinished(true);
      try {
        const r = await submitEntry(player.token, { version: 1, seed: today.seed, inputs: compressInputs(log) });
        setResult(`Score ${r.score} · Rank #${r.rank}`);
      } catch (e) {
        if (e instanceof ApiError && e.code === 'wrong_seed') setResult("A new day started — reload for today's turkeys.");
        else setResult("Couldn't submit that run.");
      }
    };
    body = (
      <>
        <p>{pool ? `Competing in ${pool.title} — sponsored by ${pool.sponsorName}` : 'Competing today'}</p>
        <Game key={runKey} seed={today.seed} onFinish={onFinish} />
        {finished && (
          <section className="panel stack">
            {result ? <strong>{result}</strong> : <span className="muted">Submitting…</span>}
            {pool && <Leaderboard poolId={pool.id} refreshKey={runKey * 2 + (result ? 1 : 0)} />}
            <div><button onClick={() => { setFinished(false); setResult(null); setRunKey((k) => k + 1); }}>Play again</button></div>
          </section>
        )}
      </>
    );
  }

  return (
    <main className="contest stack">
      <h1>Bow Hunt: Thanksgiving</h1>
      {me && player && <MyPrizes me={me} token={player.token} onChange={() => void refresh(player)} />}
      {body}
      {footer}
    </main>
  );
}
