// View constants. The engine works in world units; the view draws at S pixels per unit.
export const S = 2;
export const VIEW_W = 1080, VIEW_H = 1920;

export const FONT_SLAB = '"Alfa Slab One", "Rockwell", Georgia, serif';
export const FONT_HAND = '"Patrick Hand", "Comic Sans MS", "Segoe Print", sans-serif';

/** Dusk-harvest palette. Hex strings for canvas drawing, numbers for Phaser tints. */
export const C = {
  plum: '#3B2A4A', mulberry: '#8E4A5C', apricot: '#F2A65A', haze: '#FAD9A1',
  heather: '#6B4E71', umber: '#8A5A44', wheat: '#C08A3E', olive: '#5E6B2E', moss: '#45501F',
  cranberry: '#B3263A', gold: '#F2C14E', ink: '#2B1D24', kraft: '#D9B98C', kraftDark: '#B8956A', paper: '#F7ECD8',
} as const;

export const N = Object.fromEntries(Object.entries(C).map(([k, v]) => [k, parseInt(v.slice(1), 16)])) as Record<keyof typeof C, number>;

// Draw order
export const DEPTH = { sky: 0, clouds: 1, hills: 2, birds: 10, arrows: 12, fx: 14, grass: 20, bow: 22, hud: 40, popups: 45, overlay: 60 } as const;
