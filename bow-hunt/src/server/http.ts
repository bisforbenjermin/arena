import type { Db } from './db';

export type Ctx = { db: Db; env: { SEED_SECRET: string; ADMIN_TOKEN: string }; now: () => number };
export type Req = { method: string; route: string; query: URLSearchParams; headers: Headers; body: unknown };
export type Res = { status: number; body: unknown };
export type Handler = (ctx: Ctx, req: Req) => Promise<Res>;
export const fail = (status: number, error: string): Res => ({ status, body: { error } });
