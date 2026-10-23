import { fail, type Ctx, type Handler, type Req, type Res } from './http';
import { playerRoutes } from './player-routes';
import { adminRoutes } from './admin-routes';

const routes: Record<string, Handler> = { ...playerRoutes, ...adminRoutes };

export async function handle(ctx: Ctx, req: Req): Promise<Res> {
  const h = routes[`${req.method.toUpperCase()} ${req.route}`];
  if (!h) return fail(404, 'not_found');
  try {
    return await h(ctx, req);
  } catch (err) {
    console.error('route error', req.method, req.route, err);
    return fail(500, 'server_error');
  }
}
