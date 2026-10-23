// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { ContestApp } from '../src/ui/ContestApp';

type Route = (init?: RequestInit) => { status?: number; body: unknown };
let routes: Record<string, Route> = {};
const calls: { url: string; init?: RequestInit }[] = [];

function mockFetch() {
  vi.stubGlobal('fetch', vi.fn(async (url: string, init?: RequestInit) => {
    calls.push({ url, init });
    const key = `${init?.method ?? 'GET'} ${url.split('?')[0]}`;
    const r = routes[key];
    if (!r) return new Response(JSON.stringify({ error: 'not_found' }), { status: 404 });
    const { status = 200, body } = r(init);
    return new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } });
  }));
}

const pool = (id: string, title: string) => ({
  id, day: '2026-11-01', title, sponsorName: `${title} Co`, entrants: 3,
  prizes: [{ id: `${id}-1`, rank: 1, description: '$25 gift card', valueCents: 2500, fundedBy: 'sponsor' }],
});
const today = (pools: unknown[]) => () => ({ body: { day: '2026-11-01', seed: 'bh-2026-11-01-x', closesAt: 0, pools } });
const me = (over: Record<string, unknown> = {}) => () => ({
  body: { playerId: 'p1', displayName: 'Ben', day: '2026-11-01', pickPoolId: null, awards: [], ...over },
});

beforeEach(() => {
  routes = {};
  calls.length = 0;
  localStorage.clear();
  mockFetch();
});
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe('ContestApp', () => {
  it('shows pools and posts a pick', async () => {
    localStorage.setItem('bh.player', JSON.stringify({ playerId: 'p1', token: 't1' }));
    routes['GET /api/today'] = today([pool('A', 'Acme Feast'), pool('B', 'Beta Pies')]);
    routes['GET /api/me'] = me();
    routes['POST /api/picks'] = () => ({ body: { poolId: 'A' } });
    render(<ContestApp />);
    await screen.findByText('Acme Feast');
    expect(screen.getByText('Beta Pies')).toBeTruthy();
    expect(screen.getAllByText('1st — $25 gift card ($25)')).toHaveLength(2);
    expect(screen.getAllByText('3 hunters')).toHaveLength(2);
    const buttons = screen.getAllByText('Compete for this pool');
    expect(buttons).toHaveLength(2);
    fireEvent.click(buttons[0]);
    await waitFor(() => expect(calls.some((c) => c.url === '/api/picks')).toBe(true));
    const pickCall = calls.find((c) => c.url === '/api/picks')!;
    expect(JSON.parse(String(pickCall.init!.body))).toEqual({ poolId: 'A' });
    expect((pickCall.init!.headers as Record<string, string>).authorization).toBe('Bearer t1');
  });

  it('enables Join only with a valid name and the box checked', async () => {
    routes['GET /api/today'] = today([pool('A', 'Acme Feast')]);
    render(<ContestApp />);
    const join = (await screen.findByText('Join')) as HTMLButtonElement;
    expect(join.disabled).toBe(true);
    fireEvent.change(screen.getByLabelText('Hunter name'), { target: { value: 'Hunter One' } });
    expect(join.disabled).toBe(true);
    fireEvent.click(screen.getByLabelText('eligibility'));
    expect(join.disabled).toBe(false);
  });

  it('falls back to free play when there are no pools', async () => {
    localStorage.setItem('bh.player', JSON.stringify({ playerId: 'p1', token: 't1' }));
    routes['GET /api/today'] = today([]);
    routes['GET /api/me'] = me();
    render(<ContestApp />);
    expect(await screen.findByText('No prize pools today — free play.')).toBeTruthy();
  });

  it('shows an approved, unclaimed prize', async () => {
    localStorage.setItem('bh.player', JSON.stringify({ playerId: 'p1', token: 't1' }));
    routes['GET /api/today'] = today([pool('A', 'Acme Feast')]);
    routes['GET /api/me'] = me({
      pickPoolId: 'A',
      awards: [{ prizeId: 'z1', day: '2026-10-31', poolTitle: 'Acme Feast', rank: 1, description: '$25 gift card', valueCents: 2500, status: 'approved', claimed: false }],
    });
    render(<ContestApp />);
    expect(await screen.findByText('You won $25 gift card!')).toBeTruthy();
    expect(screen.getByText('Competing in Acme Feast — sponsored by Acme Feast Co')).toBeTruthy();
  });

  it('clears a stale player on 401 and offers Retry on network failure', async () => {
    localStorage.setItem('bh.player', JSON.stringify({ playerId: 'p1', token: 'stale' }));
    routes['GET /api/today'] = today([pool('A', 'Acme Feast')]);
    routes['GET /api/me'] = () => ({ status: 401, body: { error: 'unauthorized' } });
    render(<ContestApp />);
    await screen.findByText('Join');
    expect(localStorage.getItem('bh.player')).toBeNull();
    cleanup();
    routes = {};
    render(<ContestApp />);
    expect(await screen.findByText("Couldn't reach the server.")).toBeTruthy();
    expect(screen.getByText('Retry')).toBeTruthy();
  });
});
