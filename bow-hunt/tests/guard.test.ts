import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const dir = 'src/engine';
const files = readdirSync(dir).filter((f) => f.endsWith('.ts'));

describe('determinism guard', () => {
  it('engine uses no nondeterministic or float-trig APIs', () => {
    for (const f of files) {
      const src = readFileSync(join(dir, f), 'utf8');
      expect(src, f).not.toMatch(/Math\.(random|sin|cos|tan|atan2|sqrt|pow|hypot|exp|log)\b|\bDate\b|\bperformance\b|[\w)\]]\s*\*\*/);
    }
  });

  it('only plan.ts imports the rng', () => {
    const importers = files.filter((f) => readFileSync(join(dir, f), 'utf8').includes("/rng'"));
    expect(importers).toEqual(['plan.ts']);
  });
});
