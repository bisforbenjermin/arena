import { createHmac } from 'node:crypto';

/** Shared daily seed. Unguessable without the secret, identical for every player. */
export function dailySeed(day: string, secret: string): string {
  return `bh-${day}-${createHmac('sha256', secret).update(day).digest('hex').slice(0, 16)}`;
}
