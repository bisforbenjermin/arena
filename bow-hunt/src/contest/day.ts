import { CONTEST_TZ } from './constants';

const fmt = new Intl.DateTimeFormat('en-CA', { timeZone: CONTEST_TZ, year: 'numeric', month: '2-digit', day: '2-digit' });

/** Contest day (YYYY-MM-DD) in Pacific time for an instant. */
export function dayKey(d: Date): string {
  return fmt.format(d);
}

export function shiftDay(day: string, n: number): string {
  const [y, m, d] = day.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d + n)).toISOString().slice(0, 10);
}

/** Epoch ms of the first instant of the following Pacific day (handles DST). */
export function dayEnd(day: string): number {
  const next = shiftDay(day, 1);
  const [ny, nm, nd] = next.split('-').map(Number);
  for (const h of [7, 8]) {
    const t = Date.UTC(ny, nm - 1, nd, h);
    if (dayKey(new Date(t)) === next && dayKey(new Date(t - 1)) === day) return t;
  }
  throw new Error(`Cannot find end of day ${day}`);
}
