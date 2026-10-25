export type Species = 'goose' | 'turkey' | 'duck' | 'golden';
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
  goose:  { radius: 34, points: 75,   speedPct: 80,  yMin: 110, yMax: 430, paths: ['glide', 'wave'],          amp: [20, 50],   period: [150, 220] },
  turkey: { radius: 30, points: 100,  speedPct: 90,  yMin: 340, yMax: 600, paths: ['hop', 'wave'],            amp: [40, 80],   period: [60, 100] },
  duck:   { radius: 22, points: 150,  speedPct: 130, yMin: 110, yMax: 560, paths: ['wave', 'zigzag', 'dive'], amp: [50, 110],  period: [70, 130] },
  golden: { radius: 26, points: 1000, speedPct: 160, yMin: 120, yMax: 420, paths: ['zigzag', 'dive'],         amp: [70, 140],  period: [50, 90] },
};

export const SPECIES_ORDER: readonly Species[] = ['goose', 'turkey', 'duck'];
