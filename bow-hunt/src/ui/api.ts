import type { Pool } from '../contest/types';
import type { ReplayLog } from '../engine/types';

export class ApiError extends Error {
  constructor(public code: string, public status: number) {
    super(code);
  }
}

export type StoredPlayer = { playerId: string; token: string };
export type Today = { day: string; seed: string; closesAt: number; pools: Pool[] };
export type MyAward = {
  prizeId: string; day: string; poolTitle: string; rank: number; description: string;
  valueCents: number; status: string; claimed: boolean;
};
export type Me = { playerId: string; displayName: string; day: string; pickPoolId: string | null; awards: MyAward[] };
export type LeaderRow = { rank: number; displayName: string; score: number; shotsFired: number };

const KEY = 'bh.player';

export function loadPlayer(): StoredPlayer | null {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as StoredPlayer) : null;
  } catch {
    return null;
  }
}

export function savePlayer(p: StoredPlayer | null) {
  try {
    if (p) localStorage.setItem(KEY, JSON.stringify(p));
    else localStorage.removeItem(KEY);
  } catch {
    /* storage unavailable */
  }
}

async function request<T>(method: 'GET' | 'POST', route: string, opts: { token?: string; body?: unknown } = {}): Promise<T> {
  const headers: Record<string, string> = {};
  if (opts.token) headers.authorization = `Bearer ${opts.token}`;
  if (opts.body !== undefined) headers['content-type'] = 'application/json';
  const res = await fetch(`/api/${route}`, {
    method,
    headers,
    body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined,
  });
  let data: any = null;
  try {
    data = await res.json();
  } catch {
    /* empty or non-JSON body */
  }
  if (!res.ok) throw new ApiError(data?.error ?? 'http_error', res.status);
  return data as T;
}

export const getToday = () => request<Today>('GET', 'today');
export const createPlayer = (displayName: string) =>
  request<StoredPlayer>('POST', 'players', { body: { displayName, acceptRules: true } });
export const getMe = (token: string) => request<Me>('GET', 'me', { token });
export const pick = (token: string, poolId: string) => request<{ poolId: string }>('POST', 'picks', { token, body: { poolId } });
export const submitEntry = (token: string, replay: ReplayLog) =>
  request<{ entryId: string; score: number; rank: number | null }>('POST', 'entries', { token, body: { replay } });
export const getLeaderboard = (poolId: string) =>
  request<{ poolId: string; entries: LeaderRow[] }>('GET', `leaderboard?pool=${encodeURIComponent(poolId)}`);
export const claim = (token: string, prizeId: string, email: string) =>
  request<{ ok: true }>('POST', 'claims', { token, body: { prizeId, email } });

export const dollars = (cents: number) =>
  cents % 100 === 0 ? `$${cents / 100}` : `$${(cents / 100).toFixed(2)}`;

export const ordinal = (n: number) => {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return `${n}${s[(v - 20) % 10] || s[v] || s[0]}`;
};
