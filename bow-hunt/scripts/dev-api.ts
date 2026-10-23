import { createServer } from 'node:http';
import { makeFetch } from '../api/_handler';
import { createLocalDb } from '../src/server/db-local';
import type { Ctx } from '../src/server/http';

const PORT = 8787;
const db = await createLocalDb('.pglite');
const ctx: Ctx = { db, env: { SEED_SECRET: 'dev-secret', ADMIN_TOKEN: 'dev-admin' }, now: () => Date.now() };
const fetchHandler = makeFetch(async () => ctx);

createServer(async (req, res) => {
  const chunks: Buffer[] = [];
  for await (const c of req) chunks.push(c as Buffer);
  const headers = new Headers();
  for (const [k, v] of Object.entries(req.headers)) if (typeof v === 'string') headers.set(k, v);
  const request = new Request(`http://localhost:${PORT}${req.url}`, {
    method: req.method,
    headers,
    body: req.method === 'GET' || req.method === 'HEAD' ? undefined : Buffer.concat(chunks),
  });
  const response = await fetchHandler(request);
  res.writeHead(response.status, Object.fromEntries(response.headers));
  res.end(Buffer.from(await response.arrayBuffer()));
}).listen(PORT, () => console.log(`dev api on http://localhost:${PORT} (admin token: dev-admin)`));
