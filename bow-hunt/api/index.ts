import { createPgDb, type Db } from '../src/server/db';
import type { Ctx } from '../src/server/http';
import { makeFetch } from './_handler';

let db: Db | null = null;

async function getCtx(): Promise<Ctx> {
  const { DATABASE_URL, SEED_SECRET, ADMIN_TOKEN } = process.env;
  if (!DATABASE_URL || !SEED_SECRET || !ADMIN_TOKEN) throw new Error('misconfigured');
  db ??= createPgDb(DATABASE_URL);
  return { db, env: { SEED_SECRET, ADMIN_TOKEN }, now: () => Date.now() };
}

export default { fetch: makeFetch(getCtx) };
