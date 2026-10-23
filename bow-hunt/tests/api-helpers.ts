import { generateRunPlan } from '../src/engine/plan';
import { createInitialState, step } from '../src/engine/sim';
import { botInput } from '../src/engine/bot';
import { compressInputs } from '../src/engine/replay';
import type { Input, ReplayLog } from '../src/engine/types';
import type { Ctx, Req, Res } from '../src/server/http';
import { handle } from '../src/server/router';

export function playInputs(seed: string, choose: (s: ReturnType<typeof createInitialState>, t: number) => Input): Input[] {
  let s = createInitialState(generateRunPlan(seed));
  const inputs: Input[] = [];
  for (let t = 0; t < 20000 && s.phase !== 'over'; t++) {
    const i = choose(s, t);
    inputs.push(i);
    s = step(s, i);
  }
  return inputs;
}

export const botReplay = (seed: string): ReplayLog =>
  ({ version: 1, seed, inputs: compressInputs(playInputs(seed, botInput)) });

export const idleReplay = (seed: string): ReplayLog =>
  ({ version: 1, seed, inputs: compressInputs(playInputs(seed, () => ({ aimX: 480, aimY: 100, drawing: false }))) });

export function call(ctx: Ctx, method: string, route: string, opts: { body?: unknown; token?: string; admin?: string; query?: Record<string, string> } = {}): Promise<Res> {
  const headers = new Headers();
  if (opts.token) headers.set('authorization', `Bearer ${opts.token}`);
  if (opts.admin) headers.set('x-admin-token', opts.admin);
  const req: Req = { method, route, query: new URLSearchParams(opts.query ?? {}), headers, body: opts.body ?? null };
  return handle(ctx, req);
}

export const body = (r: Res) => r.body as any;
