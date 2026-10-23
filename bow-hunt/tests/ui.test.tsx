// @vitest-environment jsdom
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { ticksToRun } from '../src/ui/loop';
import { dragAim, toWorld } from '../src/ui/input';
import { Hud } from '../src/ui/Hud';
import { App } from '../src/ui/App';
import { createInitialState } from '../src/engine/sim';
import { generateRunPlan } from '../src/engine/plan';

afterEach(cleanup);

describe('ui helpers', () => {
  it('ticksToRun', () => {
    expect(ticksToRun(0, 40).steps).toBe(2);
    expect(ticksToRun(0, 1000)).toEqual({ steps: 5, accMs: 0 });
    expect(ticksToRun(10, 5)).toEqual({ steps: 0, accMs: 15 });
  });

  it('toWorld', () => {
    const rect = { left: 0, top: 0, width: 480, height: 270 };
    expect(toWorld(240, 135, rect)).toEqual({ x: 480, y: 270 });
    expect(toWorld(-50, 900, rect)).toEqual({ x: 0, y: 540 });
  });

  it('dragAim', () => {
    const a = { x: 500, y: 300 };
    expect(dragAim(a, { x: 500, y: 400 })).toEqual({ x: 480, y: 100 });
    expect(dragAim(a, { x: 400, y: 400 })).toEqual({ x: 763, y: 217 });
    expect(dragAim(a, { x: 502, y: 302 })).toEqual({ x: 480, y: 100 });
    expect(dragAim(a, { x: 500, y: 200 })).toEqual({ x: 480, y: 540 });
  });
});

describe('ui components', () => {
  it('Hud shows the initial state', () => {
    render(<Hud s={createInitialState(generateRunPlan('gobble-2026'))} />);
    expect(screen.getByTestId('hud-round').textContent).toBe('Round 1/5');
    expect(screen.getByTestId('hud-score').textContent).toBe('Score 0');
    expect(screen.getByTestId('hud-arrows').textContent).toBe('Arrows 0');
    expect(screen.getByTestId('hud-hits').textContent).toBe('Hits 0/6');
  });

  it('App renders the title and a canvas', () => {
    const { container } = render(<App />);
    expect(screen.getByText('Bow Hunt: Thanksgiving')).toBeTruthy();
    expect(container.querySelector('canvas')).toBeTruthy();
  });
});
