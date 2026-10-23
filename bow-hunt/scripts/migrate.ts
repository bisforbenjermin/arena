import { readFileSync } from 'node:fs';
import { createPgDb } from '../src/server/db';

const url = process.env.DATABASE_URL;
if (!url) {
  console.log('DATABASE_URL not set');
  process.exit(1);
}
await createPgDb(url).exec(readFileSync('db/schema.sql', 'utf8'));
console.log('migrated');
process.exit(0);
