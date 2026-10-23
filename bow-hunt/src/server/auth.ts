import { createHash, randomBytes, randomUUID } from 'node:crypto';

export const newToken = (): string => randomBytes(32).toString('hex');
export const hashToken = (t: string): string => createHash('sha256').update(t).digest('hex');
export const newId = (prefix: string): string => `${prefix}_${randomUUID()}`;
