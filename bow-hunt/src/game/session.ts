// Mode, seeds and the few things worth remembering on this device. Storage can be missing or throw (private mode), so every access is guarded.
import { dayKey } from '../contest/day';
import type { Mode } from '../engine/types';

export function todayKey(): string {
  return dayKey(new Date());
}

/** Phase 1: the daily seed comes from the date. Phase 2 swaps in a server-issued seed. */
export function dailySeed(day = todayKey()): string {
  return `daily-${day}`;
}

export function practiceSeed(): string {
  const a = new Uint32Array(2);
  crypto.getRandomValues(a);
  return `practice-${a[0].toString(16)}${a[1].toString(16)}`;
}

function read(key: string): string | null {
  try { return window.localStorage.getItem(key); } catch { return null; }
}
function write(key: string, v: string): void {
  try { window.localStorage.setItem(key, v); } catch { /* storage off: nothing to keep */ }
}

const bestKey = (mode: Mode) => (mode === 'daily' ? `bowhunt.best.daily.${todayKey()}` : 'bowhunt.best.practice');

export function getBest(mode: Mode): number {
  return Number(read(bestKey(mode)) ?? 0) || 0;
}

/** Saves the score if it beats the best. Returns true when it's a new best. */
export function recordBest(mode: Mode, score: number): boolean {
  if (score <= getBest(mode)) return false;
  write(bestKey(mode), String(score));
  return true;
}

export function getMuted(): boolean {
  return read('bowhunt.muted') === '1';
}
export function setMuted(m: boolean): void {
  write('bowhunt.muted', m ? '1' : '0');
}

export function formatScore(n: number): string {
  return Math.round(n).toLocaleString('en-US');
}

export function formatDay(day = todayKey()): string {
  const [y, m, d] = day.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' });
}
