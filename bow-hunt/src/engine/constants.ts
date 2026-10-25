// All engine numbers are integers. Positions and velocities are in milli-units (MILLI per world unit).
export const MILLI = 1000, TICK_HZ = 60;

// Portrait world in units. The view draws it at 2 px per unit (1080×1920).
export const WORLD_W = 540, WORLD_H = 960;
export const BOW_X = 270, BOW_Y = 860;
export const SKY_TOP = 185, SKY_BOTTOM = 640;  // targets fly inside this band, below the HUD
export const GROUND_Y = 790;                    // falling targets drop into the grass here

// Run shape
export const ROUNDS = 5, TARGETS_PER_ROUND = 10, ARROWS_PER_ROUND = 15, MAX_ON_SCREEN = 4;   // bonus targets (stars, hummingbirds) don't count toward MAX_ON_SCREEN
export const ROUND_QUOTA = [5, 6, 6, 7, 8];
export const INTRO_TICKS = 90, FIRST_SPAWN_TICKS = 20;

// Difficulty by round
export const ROUND_SPEED = [1750, 2050, 2350, 2700, 3100];          // milli-units per tick, before species %
export const SPAWN_GAP: readonly (readonly [number, number])[] = [[70, 130], [60, 115], [50, 100], [40, 85], [30, 70]];
export const JINKS = [0, 1, 2, 3, 4];                                // sudden height changes per target
export const JINK_RANGE = [0, 60, 90, 120, 150];                    // units
export const JINK_RATE = [0, 2500, 3000, 3500, 4000];               // milli-units per tick while jinking
export const SPECIES_WEIGHTS: readonly (readonly [number, number, number])[] =  // goose, turkey, duck
  [[40, 35, 25], [35, 35, 30], [30, 30, 40], [25, 30, 45], [20, 25, 55]];
export const GOLDEN_ONE_IN = 6;                                      // chance per round of one golden turkey
export const HUMMER_ONE_IN = 2;                                      // chance per round of a hummingbird zipping across the top
export const FORMATION_ONE_IN = 2;                                   // chance per round (from round 2) of birds flying in a slanted line
export const FORMATION_SIZE = [0, 3, 3, 4, 4];                       // birds in the line by round; 0 = no formations
export const FORMATION_GAP = 12;                                     // ticks between birds in the line
export const FORMATION_STEP: readonly [number, number] = [55, 75];   // units of height between birds in the line

// Target motion
export const FLEE_SPEED = 9, FALL_GRAVITY = 320;                    // units/tick; milli-units/tick²

// Bow and arrows. DRAW_MAX_TICKS and ARROW_MAX_SPEED are the starting bow; BOW_TIERS upgrades them.
export const DRAW_MIN_TICKS = 5, DRAW_MAX_TICKS = 40;
export const ARROW_MIN_SPEED = 14, ARROW_MAX_SPEED = 32;            // units/tick
export type Bow = { name: string; drawMax: number; maxSpeed: number; arrows: number; multiPct: number; blurb: string };
/** Every bow in the game. The player starts with 0 and picks A or B at each upgrade. */
export const BOWS: readonly Bow[] = [
  { name: 'Hunting bow',  drawMax: 40, maxSpeed: 32, arrows: 15, multiPct: 100, blurb: 'Your starting bow.' },
  { name: 'Recurve bow',  drawMax: 26, maxSpeed: 39, arrows: 17, multiPct: 100, blurb: 'Quick draw.' },
  { name: 'Longbow',      drawMax: 44, maxSpeed: 39, arrows: 14, multiPct: 200, blurb: 'Slow draw. Double multi-kill bonus.' },
  { name: 'Compound bow', drawMax: 20, maxSpeed: 42, arrows: 17, multiPct: 100, blurb: 'Fastest draw.' },
  { name: 'Crossbow',     drawMax: 40, maxSpeed: 46, arrows: 11, multiPct: 100, blurb: 'Flattest shots, fewer bolts.' },
];
/** After clearing these rounds (0-based) the player chooses one of two bows. */
export const UPGRADES: Readonly<Record<number, readonly [number, number]>> = { 0: [1, 2], 2: [3, 4] };
export const ARROW_GRAVITY = 400;                                   // milli-units/tick²
export const AIM_MAX_SLOPE = 5;                                     // |dx| ≤ 5×|dy|, about 79° from straight up
export const ARROW_MARGIN = 40;                                     // units past the edge before an arrow is gone

// Scoring
export const LONG_RANGE = 600;                                      // units from the bow
export const MULTI_BONUS = [0, 200, 600, 1500];                    // for the 2nd, 3rd and 4th+ bird on one arrow (double, triple, quad)
export const COMBO_STEP_QUARTERS = 1, COMBO_MAX_STEPS = 8;          // +25% per streak step, up to ×3
export const PERFECT_ROUND_BONUS = 1000, ARROW_LEFT_BONUS = 25;
export const STARS_FOR_BONUS = 3, STAR_BONUS = 3000;                // one shooting star crosses each round

// Power-ups: one floats across each round. Shoot it to collect.
export const QUIVER_ARROWS = 3;                                     // arrow bundle: +3 arrows this round
export const FIRE_SHOTS = 5, FIRE_RADIUS_PCT = 160;                 // fire arrows: next 5 arrows hit in a 60% wider circle

export const MAX_RUN_TICKS = 25000;
export const DEFAULT_SEED = 'gobble-2026';
