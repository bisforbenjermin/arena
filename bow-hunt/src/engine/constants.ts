// All engine numbers are integers. Positions and velocities are in milli-units (MILLI per world unit).
export const MILLI = 1000, TICK_HZ = 60;

// Portrait world in units. The view draws it at 2 px per unit (1080×1920).
export const WORLD_W = 540, WORLD_H = 960;
export const BOW_X = 270, BOW_Y = 860;
export const SKY_TOP = 70, SKY_BOTTOM = 640;   // targets fly inside this band
export const GROUND_Y = 790;                    // falling targets drop into the grass here

// Run shape
export const ROUNDS = 5, TARGETS_PER_ROUND = 10, ARROWS_PER_ROUND = 15, MAX_ON_SCREEN = 3;
export const ROUND_QUOTA = [5, 6, 6, 7, 8];
export const INTRO_TICKS = 90, FIRST_SPAWN_TICKS = 20;

// Difficulty by round
export const ROUND_SPEED = [2200, 2600, 3000, 3400, 3900];          // milli-units per tick, before species %
export const SPAWN_GAP: readonly (readonly [number, number])[] = [[70, 130], [60, 115], [50, 100], [40, 85], [30, 70]];
export const JINKS = [0, 1, 2, 3, 4];                                // sudden height changes per target
export const JINK_RANGE = [0, 60, 90, 120, 150];                    // units
export const JINK_RATE = [0, 2500, 3000, 3500, 4000];               // milli-units per tick while jinking
export const SPECIES_WEIGHTS: readonly (readonly [number, number, number])[] =  // goose, turkey, duck
  [[40, 35, 25], [35, 35, 30], [30, 30, 40], [25, 30, 45], [20, 25, 55]];
export const GOLDEN_ONE_IN = 6;                                      // chance per round of one golden turkey

// Target motion
export const FLEE_SPEED = 9, FALL_GRAVITY = 320;                    // units/tick; milli-units/tick²

// Bow and arrows
export const DRAW_MIN_TICKS = 5, DRAW_MAX_TICKS = 40;
export const ARROW_MIN_SPEED = 14, ARROW_MAX_SPEED = 32;            // units/tick
export const ARROW_GRAVITY = 400;                                   // milli-units/tick²
export const AIM_MAX_SLOPE = 5;                                     // |dx| ≤ 5×|dy|, about 79° from straight up
export const ARROW_MARGIN = 40;                                     // units past the edge before an arrow is gone

// Scoring
export const LONG_RANGE = 600;                                      // units from the bow
export const MULTI_HIT_BONUS = 200;                                 // per extra target on one arrow
export const COMBO_STEP_QUARTERS = 1, COMBO_MAX_STEPS = 8;          // +25% per streak step, up to ×3
export const PERFECT_ROUND_BONUS = 1000, ARROW_LEFT_BONUS = 25;

export const MAX_RUN_TICKS = 25000;
export const DEFAULT_SEED = 'gobble-2026';
