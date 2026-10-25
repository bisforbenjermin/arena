export type Species = 'goose' | 'turkey' | 'duck' | 'golden' | 'star' | 'hummer' | 'quiver' | 'fire';
export type PathKind = 'glide' | 'wave' | 'hop' | 'zigzag' | 'dive';

export type SpeciesStats = {
  radius: number;      // hitbox, units
  points: number;
  speedPct: number;    // of the round's base speed
  yMin: number; yMax: number;
  paths: readonly PathKind[];
  amp: readonly [number, number];      // path amplitude range, units
  period: readonly [number, number];   // path period range, ticks
};

export const SPECIES: Readonly<Record<Species, SpeciesStats>> = {
  goose:  { radius: 50, points: 75,   speedPct: 80,  yMin: 200, yMax: 430, paths: ['glide', 'wave'],          amp: [20, 50],   period: [150, 220] },
  turkey: { radius: 45, points: 100,  speedPct: 90,  yMin: 340, yMax: 600, paths: ['hop', 'wave'],            amp: [40, 80],   period: [60, 100] },
  duck:   { radius: 36, points: 150,  speedPct: 125, yMin: 200, yMax: 560, paths: ['wave', 'zigzag', 'dive'], amp: [50, 100],  period: [70, 130] },
  golden: { radius: 38, points: 1000, speedPct: 150, yMin: 210, yMax: 420, paths: ['zigzag', 'dive'],         amp: [60, 120],  period: [50, 90] },
  hummer: { radius: 26, points: 2000, speedPct: 320, yMin: 195, yMax: 235, paths: ['zigzag'],                 amp: [20, 45],   period: [24, 40] },
  quiver: { radius: 34, points: 50,   speedPct: 70,  yMin: 260, yMax: 460, paths: ['wave'],                   amp: [15, 30],   period: [120, 160] },
  fire:   { radius: 34, points: 50,   speedPct: 80,  yMin: 260, yMax: 460, paths: ['wave'],                   amp: [15, 30],   period: [120, 160] },
  star:   { radius: 36, points: 250,  speedPct: 165, yMin: 200, yMax: 330, paths: ['glide'],                  amp: [10, 25],   period: [200, 260] },
};

export const SPECIES_ORDER: readonly Species[] = ['goose', 'turkey', 'duck'];

/** Bonus targets: worth points, but they don't count toward the round's ten birds or its quota. */
export function isBonus(s: Species): boolean {
  return s === 'star' || s === 'hummer' || s === 'quiver' || s === 'fire';
}

export function isPowerUp(s: Species): boolean {
  return s === 'quiver' || s === 'fire';
}
