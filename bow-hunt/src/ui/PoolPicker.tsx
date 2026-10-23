import type { Pool } from '../contest/types';
import { dollars, ordinal } from './api';

export function PoolPicker({ pools, onPick, busy }: { pools: Pool[]; onPick: (poolId: string) => void; busy?: boolean }) {
  return (
    <section className="stack">
      <p className="muted">You can pick one pool per day.</p>
      <div className="cards">
        {pools.map((p) => (
          <article className="card" key={p.id}>
            <h2>{p.title}</h2>
            <span className="muted">{`Sponsored by ${p.sponsorName}`}</span>
            <ul>
              {p.prizes.map((z) => (
                <li key={z.id}>{`${ordinal(z.rank)} — ${z.description} (${dollars(z.valueCents)})`}</li>
              ))}
            </ul>
            <span className="muted">{`${p.entrants} hunters`}</span>
            <button disabled={busy} onClick={() => onPick(p.id)}>Compete for this pool</button>
          </article>
        ))}
      </div>
    </section>
  );
}
