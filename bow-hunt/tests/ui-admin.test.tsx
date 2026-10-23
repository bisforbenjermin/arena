// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { AdminApp } from '../src/ui/AdminApp';

const calls: { url: string; init?: RequestInit }[] = [];
const award = (n: number) => ({
  prizeId: `z${n}`, poolId: 'A', poolTitle: 'Acme Feast', rank: n, description: `Prize ${n}`, valueCents: 1000 * n,
  entryId: `e${n}`, playerId: `p${n}`, displayName: `Hunter ${n}`, score: 5000 - n, status: 'pending_review', claimEmail: null,
});

beforeEach(() => {
  calls.length = 0;
  vi.stubGlobal('fetch', vi.fn(async (url: string, init?: RequestInit) => {
    calls.push({ url, init });
    let body: unknown = { ok: true };
    if (url.startsWith('/api/admin/awards')) body = { awards: [award(1), award(2)] };
    if (url === '/api/admin/pools') body = { poolId: 'pool_1' };
    if (url === '/api/admin/review') body = { approved: 1 };
    return new Response(JSON.stringify(body), { status: 200 });
  }));
});
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe('AdminApp', () => {
  it('lists awards and approves one', async () => {
    render(<AdminApp />);
    fireEvent.change(screen.getByLabelText('Admin token'), { target: { value: 'adm' } });
    fireEvent.click(screen.getByText('Load awards'));
    await waitFor(() => expect(screen.getAllByTestId('award-row')).toHaveLength(2));
    fireEvent.click(screen.getAllByText('Approve')[0]);
    await waitFor(() => expect(calls.some((c) => c.url === '/api/admin/review')).toBe(true));
    const review = calls.find((c) => c.url === '/api/admin/review')!;
    expect(JSON.parse(String(review.init!.body))).toEqual({ entryId: 'e1', decision: 'approve' });
    expect((review.init!.headers as Record<string, string>)['x-admin-token']).toBe('adm');
  });

  it('converts prize dollars to cents', async () => {
    render(<AdminApp />);
    fireEvent.change(screen.getByLabelText('Admin token'), { target: { value: 'adm' } });
    fireEvent.change(screen.getByLabelText('Pool title'), { target: { value: 'Acme Feast' } });
    fireEvent.change(screen.getByLabelText('Sponsor'), { target: { value: 'Acme' } });
    fireEvent.change(screen.getByLabelText('Prize 1 description'), { target: { value: '$25 gift card' } });
    fireEvent.change(screen.getByLabelText('Prize 1 value'), { target: { value: '25' } });
    fireEvent.change(screen.getByLabelText('Prize 1 funded by'), { target: { value: 'Acme' } });
    fireEvent.click(screen.getByRole('button', { name: 'Create pool' }));
    await waitFor(() => expect(calls.some((c) => c.url === '/api/admin/pools')).toBe(true));
    const body = JSON.parse(String(calls.find((c) => c.url === '/api/admin/pools')!.init!.body));
    expect(body.prizes[0].valueCents).toBe(2500);
    expect(body.prizes[0].rank).toBe(1);
    expect(await screen.findByText('Created pool_1')).toBeTruthy();
  });
});
