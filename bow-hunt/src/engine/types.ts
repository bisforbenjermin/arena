import type { PathKind, Species } from './species';

export type Jink = { at: number; dy: number };            // at: target age in ticks; dy: units
export type TargetPlan = {
  species: Species; dir: 1 | -1; entryY: number; path: PathKind;
  amp: number; period: number; phase: number; speedPct: number; gap: number; jinks: Jink[];
};
export type RoundPlan = { golden: boolean; targets: TargetPlan[] };
export type RunPlan = { seed: string; rounds: RoundPlan[] };

export type TargetStatus = 'flying' | 'fleeing' | 'falling' | 'gone';
export type Target = {
  id: number; slot: number; species: Species; dir: 1 | -1;
  x: number; y: number; baseY: number; goalY: number;      // milli-units
  vx: number; vy: number; age: number; jinkIndex: number;
  status: TargetStatus; hit: boolean;
};
export type Arrow = { id: number; x: number; y: number; vx: number; vy: number; hits: number; streakAt: number };

export type Input = { aimX: number; aimY: number; drawing: boolean };
export type Phase = 'intro' | 'playing' | 'roundEnd' | 'over';
export type Outcome = 'none' | 'cleared' | 'failed';

export type GameEvent =
  | { type: 'roundStart'; round: number }
  | { type: 'fire'; arrowId: number; power: number }
  | { type: 'spawn'; targetId: number; species: Species }
  | { type: 'hit'; targetId: number; arrowId: number; species: Species; x: number; y: number; points: number; long: boolean; multi: number; streak: number }
  | { type: 'miss'; arrowId: number }
  | { type: 'escape'; targetId: number }
  | { type: 'outOfArrows' }
  | { type: 'landed'; targetId: number; x: number }
  | { type: 'roundEnd'; summary: RoundSummary };

export type RoundSummary = {
  round: number; hits: number; quota: number; arrowsLeft: number;
  hitPoints: number; arrowBonus: number; perfectBonus: number; passed: boolean;
};

export type Stats = { shots: number; hits: number; longShots: number; multiHits: number; goldenHits: number; bestStreak: number };

export type GameState = {
  tick: number; phase: Phase; phaseTicks: number; round: number; outcome: Outcome;
  targets: Target[]; arrows: Arrow[]; nextId: number;
  spawned: number; spawnTimer: number; outOfArrows: boolean;
  arrowsLeft: number; drawTicks: number; wasDrawing: boolean;
  score: number; roundHits: number; roundPoints: number; streak: number;
  stats: Stats; summaries: RoundSummary[]; events: GameEvent[];
  plan: RunPlan;
};

export type Mode = 'daily' | 'practice';
export type InputRun = [count: number, aimX: number, aimY: number, drawing: 0 | 1];
export type ReplayLog = { version: 2; mode: Mode; seed: string; inputs: InputRun[] };
export type ReplayResult = { ticks: number; score: number; hits: number; shots: number; roundsCleared: number; outcome: Outcome };
