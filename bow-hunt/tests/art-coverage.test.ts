import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { SPECIES } from '../src/engine/species';

// The view keys feather emitters and colors by species. A target type missing there crashed the game
// mid-round (Oct 25: shooting a power-up froze input). The art module needs a browser, so check its source.
describe('every engine target has its effects', () => {
  const src = readFileSync('src/game/art/textures.ts', 'utf8');
  const list = src.match(/SPECIES_LIST: Species\[\] = \[([^\]]*)\]/)![1];
  const colors = src.slice(src.indexOf('FEATHER_COLORS'), src.indexOf('};', src.indexOf('FEATHER_COLORS')));
  for (const s of Object.keys(SPECIES)) {
    it(s, () => {
      expect(list).toContain(`'${s}'`);
      expect(colors).toMatch(new RegExp(`\\b${s}:`));
    });
  }
});
