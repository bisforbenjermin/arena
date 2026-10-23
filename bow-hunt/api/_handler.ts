import { MAX_BODY_BYTES } from '../src/contest/constants';
import type { Ctx } from '../src/server/http';
import { handle } from '../src/server/router';

const json = (body: unknown, status: number) => Response.json(body, { status });

/** Adapts a Web Request to the framework-free router. Shared by Vercel and the local dev server. */
export function makeFetch(getCtx: () => Promise<Ctx>): (request: Request) => Promise<Response> {
  return async (request: Request) => {
    const url = new URL(request.url);
    const route = url.searchParams.get('route') ?? url.pathname.replace(/^\/api\/?/, '');
    const query = new URLSearchParams(url.searchParams);
    query.delete('route');

    const len = Number(request.headers.get('content-length') ?? '0');
    if (len > MAX_BODY_BYTES) return json({ error: 'too_large' }, 413);

    let body: unknown = null;
    if (request.method === 'POST') {
      const text = await request.text();
      if (text.length > MAX_BODY_BYTES) return json({ error: 'too_large' }, 413);
      try {
        body = text ? JSON.parse(text) : null;
      } catch {
        return json({ error: 'bad_request' }, 400);
      }
    }

    let ctx: Ctx;
    try {
      ctx = await getCtx();
    } catch {
      return json({ error: 'misconfigured' }, 500);
    }
    const res = await handle(ctx, { method: request.method, route, query, headers: request.headers, body });
    return json(res.body, res.status);
  };
}
