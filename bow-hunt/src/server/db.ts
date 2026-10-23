import pg from 'pg';

export type Db = {
  query<T = any>(text: string, params?: unknown[]): Promise<{ rows: T[] }>;
  exec(sql: string): Promise<void>;
};

export function createPgDb(url: string): Db {
  const pool = new pg.Pool({ connectionString: url, max: 5 });
  return {
    async query<T = any>(text: string, params?: unknown[]) {
      const r = await pool.query(text, params as any[]);
      return { rows: r.rows as T[] };
    },
    async exec(sql: string) {
      await pool.query(sql);
    },
  };
}
