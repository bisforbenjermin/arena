export const MILLI = 1000, TICK_HZ = 60;
export const WORLD_W = 960, WORLD_H = 540, GROUND_Y = 430, BOW_X = 480, BOW_Y = 500;
export const ROUNDS = 5, WAVES_PER_ROUND = 5, TURKEYS_PER_WAVE = 2, SEGMENTS_PER_TURKEY = 12;
export const SPAWN_X_MIN = 100, SPAWN_X_MAX = 860, SEG_TICKS_MIN = 40, SEG_TICKS_MAX = 100;
export const HEADINGS: readonly (readonly [number, number])[] =
  [[1000,0],[707,-707],[0,-1000],[-707,-707],[-1000,0],[-707,707],[0,1000],[707,707]];
export const TURKEY_SPEED = [3, 4, 5, 6, 7];
export const TURKEY_RADIUS = 28, ESCAPE_AFTER_TICKS = 420, ESCAPE_SPEED = 8, FALL_SPEED = 6;
export const ARROWS_PER_WAVE = 3, DRAW_MIN_TICKS = 6, DRAW_MAX_TICKS = 45;
export const ARROW_MIN_SPEED = 12, ARROW_MAX_SPEED = 28, ARROW_GRAVITY = 300;
export const WAVE_GAP_TICKS = 60;
export const ROUND_QUOTA = [6, 6, 7, 8, 9];
export const HIT_POINTS = [500, 750, 1000, 1250, 1500];
export const PERFECT_ROUND_BONUS = 5000;
export const DEFAULT_SEED = 'gobble-2026';
