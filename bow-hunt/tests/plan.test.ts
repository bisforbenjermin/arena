import { describe, expect, it } from 'vitest';
import { generateRunPlan } from '../src/engine/plan';

describe('generateRunPlan', () => {
  const p = generateRunPlan('gobble-2026');

  it('has 25 waves x 2 turkeys x 12 segments', () => {
    expect(p.waves.length).toBe(25);
    for (const w of p.waves) {
      expect(w.turkeys.length).toBe(2);
      for (const t of w.turkeys) expect(t.segments.length).toBe(12);
    }
  });

  it('matches the reference vectors', () => {
    expect(p.waves[0].turkeys[0].spawnX).toBe(566000);
    expect(p.waves[0].turkeys[0].segments[0]).toEqual({ heading: 2, ticks: 53 });
    expect(p.waves[0].turkeys[0].segments[1]).toEqual({ heading: 3, ticks: 69 });
    expect(p.waves[24].round).toBe(4);
    expect(p.waves[24].turkeys[1].spawnX).toBe(166000);
    expect(p.waves[24].turkeys[1].segments[11]).toEqual({ heading: 1, ticks: 86 });
  });

  it('differs by seed', () => {
    expect(generateRunPlan('gobble-2027').waves[0].turkeys[0].spawnX).toBe(667000);
  });

  it('is deterministic', () => {
    expect(generateRunPlan('gobble-2026')).toEqual(p);
  });
});
