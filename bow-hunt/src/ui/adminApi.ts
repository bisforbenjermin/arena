import type { ReplayLog } from '../engine/types';
import { ApiError } from './api';

const KEY = 'bh.admin';

export function loadAdminToken(): string {
  try { return sessionStorage.getItem(KEY) ?? ''; } catch { return ''; }
}
export function saveAdminToken(t: string) {
  try { sessionStorage.setItem(KEY, t); } catch { /* storage unavailable */ }
}

export type AdminAward = {
  prizeId: string; poolId: string; poolTitle: string; rank: number; description: string; valueCents: number;
  entryId: string; playerId: string; displayName: string; score: number; status: string; claimEmail: string | null;
};
export type AdminEntry = {
  entryId: string; playerId: string; poolId: string; day: string; score: number; shotsFired: number;
  ticks: number; outcome: string; status: string; replay: ReplayLog;
};
export type NewPrize = { rank: number; description: string; valueCents: number; fundedBy: string };

async function req<T>(token: string, method: 'GET' | 'POST', route: string, body?: unknown): Promise<T> {
  const headers: Record<string, string> = { 'x-admin-token': token };
  if (body !== undefined) headers['content-type'] = 'application/json';
  const res = await fetch(`/api/${route}`, { method, headers, body: body !== undefined ? JSON.stringify(body) : undefined });
  let data: any = null;
  try { data = await res.json(); } catch { /* non-JSON */ }
  if (!res.ok) throw new ApiError(data?.error ?? 'http_error', res.status);
  return data as T;
}

export const adminCreatePool = (token: string, p: { day: string; title: string; sponsorName: string; prizes: NewPrize[] }) =>
  req<{ poolId: string }>(token, 'POST', 'admin/pools', p);
export const adminFinalize = (token: string, day: string) => req<{ awarded: number }>(token, 'POST', 'admin/finalize', { day });
export const adminAwards = (token: string, day: string) =>
  req<{ awards: AdminAward[] }>(token, 'GET', `admin/awards?day=${encodeURIComponent(day)}`);
export const adminEntry = (token: string, id: string) => req<AdminEntry>(token, 'GET', `admin/entry?id=${encodeURIComponent(id)}`);
export const adminReview = (token: string, entryId: string, decision: 'approve' | 'reject') =>
  req<{ approved?: number; ok?: boolean }>(token, 'POST', 'admin/review', { entryId, decision });
