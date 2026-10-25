import { describe, expect, it } from 'vitest';
import { BOW_X, BOW_Y, WORLD_H, WORLD_W } from '../src/engine/constants';
import { aimDirection } from '../src/engine/arrows';
import { aimForAngle, aimFromDrag, MAX_ANGLE, STRAIGHT_UP } from '../src/game/input';
import { RunController, STEP_MS } from '../src/game/run';
import { makeLeadBot } from '../src/testing/bots';

describe('drag aiming', () => {
  it('pulling straight down aims straight up', () => {
    const a = aimFromDrag(270, 700, 270, 800, STRAIGHT_UP);
    expect(a.aimX).toBe(BOW_X);
    expect(a.aimY).toBeLessThan(BOW_Y);
  });

  it('pulling down-left aims up-right', () => {
    const a = aimFromDrag(300, 700, 250, 780, STRAIGHT_UP);
    expect(a.aimX).toBeGreaterThan(BOW_X);
    expect(a.angle).toBeGreaterThan(0);
  });

  it('a tiny drag keeps the previous aim', () => {
    const prev = aimForAngle(0.4);
    expect(aimFromDrag(300, 700, 303, 704, prev)).toBe(prev);
  });

  it('stays inside the world and inside the engine slope limit at every angle', () => {
    for (let a = -1.6; a <= 1.6; a += 0.01) {
      const aim = aimForAngle(a);
      expect(aim.aimX).toBeGreaterThanOrEqual(0);
      expect(aim.aimX).toBeLessThanOrEqual(WORLD_W);
      expect(aim.aimY).toBeGreaterThanOrEqual(0);
      expect(aim.aimY).toBeLessThanOrEqual(WORLD_H);
      expect(Math.abs(aim.angle)).toBeLessThanOrEqual(MAX_ANGLE + 1e-9);
      // the engine's clamp is a no-op on our aim, so the bow on screen matches the shot
      const d = aimDirection(aim.aimX, aim.aimY);
      const engineAngle = Math.atan2(d.dx, -d.dy);
      expect(Math.abs(engineAngle - aim.angle)).toBeLessThan(0.01);
    }
  });
});

describe('run controller', () => {
  it('steps once per 1/60 s, records inputs, and its replay rescoring matches', () => {
    const bot = makeLeadBot();
    const run = new RunController('practice', 'controller-test');
    let frames = 0;
    while (run.state.phase !== 'over' && frames < 40000) {
      if (run.state.phase === 'roundEnd') run.nextRound();
      run.advance(STEP_MS * (frames % 3 === 0 ? 2 : 1), bot(run.state));
      frames++;
    }
    expect(run.state.phase).toBe('over');
    expect(run.inputs.length).toBe(run.state.tick);
    expect(run.verify()).toBe(true);
  });

  it('caps catch-up after a stall', () => {
    const run = new RunController('daily', 'stall');
    run.advance(5000, { aimX: 270, aimY: 0, drawing: false });
    expect(run.state.tick).toBe(4);
  });

  it('does not step while waiting between rounds', () => {
    const run = new RunController('daily', 'wait');
    run.state = { ...run.state, phase: 'roundEnd' };
    run.advance(1000, { aimX: 270, aimY: 0, drawing: false });
    expect(run.inputs).toHaveLength(0);
  });
});
