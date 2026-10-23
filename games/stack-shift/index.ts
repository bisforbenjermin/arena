/**
 * STACK SHIFT — 60-second placement puzzle
 * Control scheme: drag | Difficulty: flat | Duration: 60 s
 *
 * Pieces come from a seeded queue (current piece plus 3 ahead). Drag the current
 * piece onto the 8×12 grid; tap it to rotate. Filling a whole row or column clears
 * it for 10 points per cleared cell, and clearing 2+ lines with one placement
 * doubles that placement. No gravity and no per-piece timer: the clock is the only
 * pressure. A piece that fits nowhere is discarded automatically, so every round
 * runs exactly 60 s (compatible with PROPOSED FORMAT-1).
 *
 * The original concept ran 90 s; F1 caps durationSeconds at 60, so this is 60.
 *
 * PR-1  the whole piece queue is drawn from the injected prngFactory in init()
 * PR-2  tick-based timing only
 * PR-3  StackShiftSim is DOM-free and integer-only
 * PR-4  contractVersion + gameVersion declared on meta
 * PR-6  controlScheme 'drag'
 * PR-7  (PROPOSED) input arrives through sim.input(event)
 */

import type {
  GameEvent,
  GameMeta,
  GameModule,
  GameSim,
  GameView,
  PrngFactory,
  RoundConfig,
} from '../../contracts/game-module';

// ─── CONSTANTS ────────────────────────────────────────────────────────────────

export const COLS = 8;
export const ROWS = 12;
export const TOTAL_TICKS = 3600;
/** The queue repeats after this many pieces, so it can never run out before time. */
export const QUEUE_LEN = 240;
export const PREVIEW = 3;
const CELL_POINTS = 10;

/**
 * PR-8 (PROPOSED): higher is better. Theoretical ceiling at one placement per tick, every cell
 * cleared in a double (3600 × 5 × 20). People place about one piece a second.
 */
export const SCORE_RANGE = { min: 0, max: 360000 } as const;

type Cell = readonly [number, number];

const BASE_SHAPES: readonly (readonly Cell[])[] = [
  [[0, 0]],                                   // mono
  [[0, 0], [1, 0]],                           // domino
  [[0, 0], [1, 0], [2, 0]],                   // I3
  [[0, 0], [0, 1], [1, 1]],                   // V3
  [[0, 0], [1, 0], [2, 0], [3, 0]],           // I4
  [[0, 0], [1, 0], [0, 1], [1, 1]],           // O
  [[0, 0], [1, 0], [2, 0], [1, 1]],           // T
  [[1, 0], [2, 0], [0, 1], [1, 1]],           // S
  [[0, 0], [1, 0], [1, 1], [2, 1]],           // Z
  [[0, 0], [0, 1], [0, 2], [1, 2]],           // L
  [[1, 0], [1, 1], [1, 2], [0, 2]],           // J
  [[0, 0], [1, 0], [2, 0], [0, 1], [0, 2]],   // V5
];

function normalize(cells: Cell[]): Cell[] {
  const minX = Math.min(...cells.map((c) => c[0]));
  const minY = Math.min(...cells.map((c) => c[1]));
  return cells
    .map(([x, y]) => [x - minX, y - minY] as Cell)
    .sort((a, b) => a[1] - b[1] || a[0] - b[0]);
}

/** ROTATIONS[shape][rot] — clockwise quarter turns, normalized to the top-left. */
export const ROTATIONS: readonly (readonly (readonly Cell[])[])[] = BASE_SHAPES.map((shape) => {
  const out: Cell[][] = [];
  let cur = normalize([...shape]);
  for (let r = 0; r < 4; r++) {
    out.push(cur);
    cur = normalize(cur.map(([x, y]) => [-y, x] as Cell));
  }
  return out;
});

export const SHAPE_COUNT = BASE_SHAPES.length;

export interface StackShiftState {
  readonly tick: number;
  readonly grid: readonly number[]; // COLS*ROWS, 0 empty, else shape id + 1
  readonly queueIndex: number;
  readonly rot: number;
  readonly score: number;
  readonly linesCleared: number;
  readonly placed: number;
  readonly discarded: number;
  readonly lastClear: number; // tick of the most recent clear, -1 if none
  readonly lastPlaceTick: number; // at most one placement per tick
  readonly done: boolean;
}

// ─── SIM ──────────────────────────────────────────────────────────────────────

export class StackShiftSim implements GameSim {
  private queue_: number[] = [];
  private events_: GameEvent[] = [];
  private s_: StackShiftState = StackShiftSim.blank();

  private static blank(): StackShiftState {
    return {
      tick: 0, grid: new Array(COLS * ROWS).fill(0), queueIndex: 0, rot: 0, score: 0,
      linesCleared: 0, placed: 0, discarded: 0, lastClear: -1, lastPlaceTick: -1, done: false,
    };
  }

  init(_config: RoundConfig, prngFactory: PrngFactory): void {
    const rand = prngFactory();
    for (let i = 0; i < 12; i++) rand(); // sfc32 warm-up: early draws barely depend on small seeds
    this.queue_ = [];
    for (let i = 0; i < QUEUE_LEN; i++) this.queue_.push(Math.floor(rand() * SHAPE_COUNT));
    this.events_ = [];
    this.s_ = StackShiftSim.blank();
  }

  currentShape(): number { return this.queue_[this.s_.queueIndex % QUEUE_LEN] ?? 0; }

  upcoming(): number[] {
    const out: number[] = [];
    for (let i = 1; i <= PREVIEW; i++) out.push(this.queue_[(this.s_.queueIndex + i) % QUEUE_LEN] ?? 0);
    return out;
  }

  /** True if the current piece in rotation `rot` fits with its top-left at (col,row). */
  fits(col: number, row: number, rot: number = this.s_.rot, shape: number = this.currentShape()): boolean {
    const g = this.s_.grid;
    for (const [dx, dy] of ROTATIONS[shape][rot]) {
      const x = col + dx, y = row + dy;
      if (x < 0 || y < 0 || x >= COLS || y >= ROWS) return false;
      if (g[y * COLS + x] !== 0) return false;
    }
    return true;
  }

  private anyFit(shape: number): boolean {
    for (let rot = 0; rot < 4; rot++) {
      for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) if (this.fits(col, row, rot, shape)) return true;
      }
    }
    return false;
  }

  /** PR-7 (PROPOSED) input path: 'rotate' or 'place' {col,row}. Invalid inputs are ignored and not logged. */
  input(event: GameEvent): void {
    const s = this.s_;
    if (s.done) return;
    if (event.type === 'rotate') {
      this.s_ = { ...s, rot: (s.rot + 1) % 4 };
      this.events_.push({ tick: s.tick, type: 'rotate' });
      return;
    }
    if (event.type !== 'place' || s.lastPlaceTick === s.tick) return;
    const col = event.payload?.col;
    const row = event.payload?.row;
    if (!Number.isInteger(col) || !Number.isInteger(row)) return;
    if (!this.fits(col as number, row as number)) return;

    const shape = this.currentShape();
    const grid = s.grid.slice();
    for (const [dx, dy] of ROTATIONS[shape][s.rot]) grid[((row as number) + dy) * COLS + (col as number) + dx] = shape + 1;

    const fullRows: number[] = [];
    const fullCols: number[] = [];
    for (let y = 0; y < ROWS; y++) {
      let full = true;
      for (let x = 0; x < COLS; x++) if (grid[y * COLS + x] === 0) { full = false; break; }
      if (full) fullRows.push(y);
    }
    for (let x = 0; x < COLS; x++) {
      let full = true;
      for (let y = 0; y < ROWS; y++) if (grid[y * COLS + x] === 0) { full = false; break; }
      if (full) fullCols.push(x);
    }
    const cleared = new Set<number>();
    for (const y of fullRows) for (let x = 0; x < COLS; x++) cleared.add(y * COLS + x);
    for (const x of fullCols) for (let y = 0; y < ROWS; y++) cleared.add(y * COLS + x);
    for (const i of cleared) grid[i] = 0;
    const lines = fullRows.length + fullCols.length;
    const points = cleared.size * CELL_POINTS * (lines >= 2 ? 2 : 1);

    this.s_ = {
      ...s, grid, queueIndex: s.queueIndex + 1, rot: 0, score: s.score + points,
      linesCleared: s.linesCleared + lines, placed: s.placed + 1, lastClear: lines > 0 ? s.tick : s.lastClear,
      lastPlaceTick: s.tick,
    };
    this.events_.push({ tick: s.tick, type: 'place', payload: { col: col as number, row: row as number } });
  }

  rotate(): void { this.input({ tick: this.s_.tick, type: 'rotate' }); }
  place(col: number, row: number): void { this.input({ tick: this.s_.tick, type: 'place', payload: { col, row } }); }

  tick(_dt: number): void {
    const s = this.s_;
    if (s.done) return;
    const tick = s.tick + 1;
    let { queueIndex, rot, discarded } = s;
    if (!this.anyFit(this.queue_[queueIndex % QUEUE_LEN])) {
      queueIndex += 1;
      rot = 0;
      discarded += 1;
    }
    this.s_ = { ...s, tick, queueIndex, rot, discarded, done: tick >= TOTAL_TICKS };
  }

  getState(): StackShiftState { return this.s_; }
  getCurrentTick(): number { return this.s_.tick; }
  isDone(): boolean { return this.s_.done; }
  getScore(): number { return this.s_.score; }
  getEventLog(): readonly GameEvent[] { return this.events_; }

  destroy(): void {
    this.queue_ = [];
    this.events_ = [];
    this.s_ = StackShiftSim.blank();
  }
}

// ─── VIEW ─────────────────────────────────────────────────────────────────────

export const VIEW_W = 400;
export const VIEW_H = 700;
const CELL = 44;
const GRID_X = (VIEW_W - COLS * CELL) / 2;
const GRID_Y = 52;
const TRAY_Y = GRID_Y + ROWS * CELL + 18;
const HAND_CELL = 22;
const COLORS = ['#ff6b6b', '#ffa94d', '#ffd43b', '#a9e34b', '#51cf66', '#38d9a9', '#3bc9db', '#4dabf7', '#748ffc', '#9775fa', '#da77f2', '#f783ac'];

type Drag = { startX: number; startY: number; x: number; y: number; moved: boolean; grabDX: number; grabDY: number };

export class StackShiftView implements GameView {
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private sim_: StackShiftSim | null = null;
  private scoreCb_: ((rawScore: number, events: readonly GameEvent[]) => void) | null = null;
  private fired_ = false;
  private drag_: Drag | null = null;
  private cleanup_: (() => void)[] = [];

  mount(container: HTMLElement, sim: Readonly<GameSim>): void {
    this.sim_ = sim as StackShiftSim;
    const canvas = document.createElement('canvas');
    canvas.width = VIEW_W;
    canvas.height = VIEW_H;
    canvas.style.cssText = 'display:block;width:100%;max-width:420px;margin:0 auto;height:auto;aspect-ratio:4/7;touch-action:none;border-radius:12px;';
    container.appendChild(canvas);
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');

    const pt = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      return { x: ((e.clientX - r.left) * VIEW_W) / r.width, y: ((e.clientY - r.top) * VIEW_H) / r.height };
    };
    const handBox = () => {
      const sim = this.sim_;
      if (!sim) return null;
      const cells = ROTATIONS[sim.currentShape()][sim.getState().rot];
      const w = Math.max(...cells.map((c) => c[0])) + 1;
      const h = Math.max(...cells.map((c) => c[1])) + 1;
      return { x: 24, y: TRAY_Y + 14, w: w * HAND_CELL, h: h * HAND_CELL };
    };
    const down = (e: PointerEvent) => {
      const p = pt(e);
      const b = handBox();
      if (!b) return;
      if (p.x >= b.x - 12 && p.x <= b.x + b.w + 12 && p.y >= b.y - 12 && p.y <= b.y + b.h + 12) {
        e.preventDefault();
        canvas.setPointerCapture?.(e.pointerId);
        const gx = Math.max(0, Math.floor((p.x - b.x) / HAND_CELL));
        const gy = Math.max(0, Math.floor((p.y - b.y) / HAND_CELL));
        this.drag_ = { startX: p.x, startY: p.y, x: p.x, y: p.y, moved: false, grabDX: gx, grabDY: gy };
      }
    };
    const move = (e: PointerEvent) => {
      if (!this.drag_) return;
      const p = pt(e);
      this.drag_.x = p.x;
      this.drag_.y = p.y;
      if (Math.abs(p.x - this.drag_.startX) + Math.abs(p.y - this.drag_.startY) > 8) this.drag_.moved = true;
    };
    const up = () => {
      const d = this.drag_;
      this.drag_ = null;
      const sim = this.sim_;
      if (!d || !sim) return;
      if (!d.moved) { sim.rotate(); return; }
      const snap = this.snap(d);
      if (snap) sim.place(snap.col, snap.row);
    };
    const key = (e: KeyboardEvent) => { if (e.key === 'r' || e.key === 'R') this.sim_?.rotate(); };
    canvas.addEventListener('pointerdown', down);
    canvas.addEventListener('pointermove', move);
    canvas.addEventListener('pointerup', up);
    canvas.addEventListener('pointercancel', () => { this.drag_ = null; });
    window.addEventListener('keydown', key);
    this.cleanup_ = [() => window.removeEventListener('keydown', key)];
  }

  /** Grid cell under the dragged piece's top-left, lifted above the finger so it stays visible. */
  private snap(d: Drag): { col: number; row: number } | null {
    const lift = 70;
    const col = Math.round((d.x - GRID_X) / CELL - d.grabDX - 0.5);
    const row = Math.round((d.y - lift - GRID_Y) / CELL - d.grabDY - 0.5);
    if (!this.sim_?.fits(col, row)) return null;
    return { col, row };
  }

  render(): void {
    const sim = this.sim_;
    const ctx = this.ctx;
    if (!sim) return;
    const s = sim.getState();
    if (s.done && !this.fired_ && this.scoreCb_) {
      this.fired_ = true;
      this.scoreCb_(sim.getScore(), sim.getEventLog());
    }
    if (!ctx) return;

    ctx.fillStyle = '#12141c';
    ctx.fillRect(0, 0, VIEW_W, VIEW_H);

    // HUD
    ctx.fillStyle = '#f1f3f5';
    ctx.font = 'bold 20px system-ui, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(`${s.score}`, GRID_X, 34);
    ctx.textAlign = 'right';
    ctx.fillText(`${Math.max(0, Math.ceil((TOTAL_TICKS - s.tick) / 60))}s`, VIEW_W - GRID_X, 34);
    ctx.textAlign = 'start';

    // Grid
    const flash = s.lastClear >= 0 && s.tick - s.lastClear < 12;
    for (let y = 0; y < ROWS; y++) {
      for (let x = 0; x < COLS; x++) {
        const v = s.grid[y * COLS + x];
        ctx.fillStyle = v ? COLORS[(v - 1) % COLORS.length] : flash ? '#2a3045' : '#1d212d';
        ctx.fillRect(GRID_X + x * CELL + 2, GRID_Y + y * CELL + 2, CELL - 4, CELL - 4);
      }
    }

    const shape = sim.currentShape();
    const cells = ROTATIONS[shape][s.rot];

    // Ghost where the dragged piece would land
    if (this.drag_?.moved) {
      const snap = this.snap(this.drag_);
      if (snap) {
        ctx.fillStyle = 'rgba(255,255,255,0.25)';
        for (const [dx, dy] of cells) ctx.fillRect(GRID_X + (snap.col + dx) * CELL + 2, GRID_Y + (snap.row + dy) * CELL + 2, CELL - 4, CELL - 4);
      }
    }

    // Tray: current piece (or it follows the finger) and the next three
    ctx.fillStyle = '#1a1d27';
    ctx.fillRect(12, TRAY_Y, VIEW_W - 24, VIEW_H - TRAY_Y - 12);
    const color = COLORS[shape % COLORS.length];
    if (this.drag_?.moved) {
      const d = this.drag_;
      ctx.globalAlpha = 0.85;
      ctx.fillStyle = color;
      for (const [dx, dy] of cells) {
        ctx.fillRect(d.x - (d.grabDX + 0.5) * CELL + dx * CELL + 2, d.y - 70 - (d.grabDY + 0.5) * CELL + dy * CELL + 2, CELL - 4, CELL - 4);
      }
      ctx.globalAlpha = 1;
    } else {
      ctx.fillStyle = color;
      for (const [dx, dy] of cells) ctx.fillRect(24 + dx * HAND_CELL + 1, TRAY_Y + 14 + dy * HAND_CELL + 1, HAND_CELL - 2, HAND_CELL - 2);
    }
    ctx.fillStyle = '#868e96';
    ctx.font = '12px system-ui, sans-serif';
    ctx.fillText('tap to rotate · drag to place', 200, VIEW_H - 22);
    const next = sim.upcoming();
    const small = 12;
    next.forEach((sh, i) => {
      const ox = 200 + i * 64;
      ctx.fillStyle = COLORS[sh % COLORS.length];
      ctx.globalAlpha = 0.7;
      for (const [dx, dy] of ROTATIONS[sh][0]) ctx.fillRect(ox + dx * small, TRAY_Y + 20 + dy * small, small - 2, small - 2);
      ctx.globalAlpha = 1;
    });
  }

  onScore(cb: (rawScore: number, events: readonly GameEvent[]) => void): void {
    this.scoreCb_ = cb;
  }

  destroy(): void {
    for (const f of this.cleanup_) f();
    this.cleanup_ = [];
    this.canvas?.remove();
    this.canvas = null;
    this.ctx = null;
    this.sim_ = null;
    this.scoreCb_ = null;
    this.fired_ = false;
    this.drag_ = null;
  }
}

// ─── MODULE ───────────────────────────────────────────────────────────────────

const META: GameMeta = {
  id: 'stack-shift',
  slug: 'stack-shift',
  title: 'Stack Shift',
  controlScheme: 'drag',
  durationSeconds: 60,
  difficultyCurve: 'flat',
  themeTags: ['puzzle', 'placement', 'grid'],
  generatedBy: 'human',
  contractVersion: '1.0.0',
  gameVersion: '1.0.0',
};

const StackShiftModule: GameModule = {
  meta: META,
  createSim: (): GameSim => new StackShiftSim(),
  createView: (): GameView => new StackShiftView(),
};

export default StackShiftModule;
