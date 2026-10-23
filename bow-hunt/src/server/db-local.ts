import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { PGlite } from '@electric-sql/pglite';
import type { Db } from './db';

/** In-memory (or on-disk with dataDir) Postgres for tests and local dev. Never used in production. */
export async function createLocalDb(dataDir?: string): Promise<Db> {
  const pg = new PGlite(dataDir);
  await pg.exec(readFileSync(join(process.cwd(), 'db/schema.sql'), 'utf8'));
  return {
    async query<T = any>(text: string, params?: unknown[]) {
      const r = await pg.query<T>(text, params as any[]);
      return { rows: r.rows };
    },
    async exec(sql: string) {
      await pg.exec(sql);
    },
  };
}
