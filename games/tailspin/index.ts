/**
 * TAILSPIN — one-thumb cave flyer
 * Control scheme: hold | Difficulty: ramp | Duration: 60 s
 *
 * A raccoon flies forward on his own through a seeded cave. Hold anywhere and his
 * striped tail spins up like a rotor, lifting him; let go and it winds down, so
 * gravity takes over. Clear pillar gates for 100; thread the inner third of a gap
 * for +50 and build a precision streak (x2 at 5, x3 at 10).
 *
 * A crash costs the streak and 1.5 s of hover recovery instead of ending the round,
 * so every round is exactly 60 s (compatible with PROPOSED FORMAT-1).
 *
 * PR-1  randomness only from the injected prngFactory, all drawn in init()
 * PR-2  tick-based timing; no wall-clock reads anywhere in this file
 * PR-3  TailspinSim is DOM-free and integer-only; TailspinView reads sim state
 * PR-4  contractVersion + gameVersion declared on meta
 * PR-6  controlScheme 'hold'
 * PR-7  (PROPOSED) input arrives through sim.input(event); replay uses the same path
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

export const W = 640;
export const H = 400;
const M = 1000; // milli-pixels per pixel

export const TOTAL_TICKS = 3600;
const RACCOON_X = 140;
export const RADIUS = 14;
const GRAVITY = 450; // milli-px / tick^2
const SPIN_UP = 60;
const SPIN_DOWN = 40;
export const SPIN_MAX = 1000;
const SPIN_HOVER = 500;
const VY_MIN = -7000;
const VY_MAX = 8000;
const RECOVER_TICKS = 90;
const START_GRACE = 60;
const CP_SPACING = 200;
const COURSE_PX = 17400;
const GATE_START = 600;
const GATE_SPACING = 320;
export const PILLAR_HALF = 12;
const GATE_POINTS = 100;
const PRECISION_POINTS = 50;

/**
 * PR-8 (PROPOSED): higher is better. The course puts 50 gates within reach in 60 s;
 * all 50 precise scores 4×150 + 5×300 + 41×450 = 20 550.
 */
export const SCORE_RANGE = { min: 0, max: 20550 } as const;

/** Scroll speed in milli-px per tick: 3, 4, 5, 6 px per tick over each 15 s quarter. */
export function speedAt(tick: number): number {
  return (3 + Math.min(3, Math.floor(tick / 900))) * M;
}

export interface Gate {
  readonly x: number;   // px
  readonly gap: number; // gap center, px
  readonly half: number; // gap half-height, px
}

export interface TailspinState {
  readonly tick: number;
  readonly y: number;       // milli-px
  readonly vy: number;
  readonly spin: number;    // 0–1000
  readonly holding: boolean;
  readonly scrollX: number; // milli-px, world x at the left edge of the screen
  readonly recover: number; // ticks of hover recovery left
  readonly score: number;
  readonly streak: number;
  readonly gatesPassed: number;
  readonly precisionPasses: number;
  readonly bonks: number;
  readonly nextGate: number;
  readonly done: boolean;
}

// ─── SIM ──────────────────────────────────────────────────────────────────────

export class TailspinSim implements GameSim {
  private centers_: number[] = [];
  private halves_: number[] = [];
  private gates_: Gate[] = [];
  private events_: GameEvent[] = [];
  private s_: TailspinState = TailspinSim.blank();

  private static blank(): TailspinState {
    return {
      tick: 0, y: 0, vy: 0, spin: SPIN_HOVER, holding: false, scrollX: 0, recover: START_GRACE,
      score: 0, streak: 0, gatesPassed: 0, precisionPasses: 0, bonks: 0, nextGate: 0, done: false,
    };
  }

  init(_config: RoundConfig, prngFactory: PrngFactory): void {
    const rand = prngFactory();
    for (let i = 0; i < 12; i++) rand(); // sfc32 warm-up: early draws barely depend on small seeds
    const n = COURSE_PX / CP_SPACING + 1;
    this.centers_ = [];
    this.halves_ = [];
    let c = Math.floor(H / 2);
    for (let i = 0; i < n; i++) {
      const half = 150 - Math.floor((i * 55) / n);
      if (i > 2) c += Math.floor(rand() * 121) - 60;
      c = Math.min(H - half - 16, Math.max(half + 16, c));
      this.centers_.push(c);
      this.halves_.push(half);
    }
    this.gates_ = [];
    const gateCount = Math.floor((COURSE_PX - GATE_START - CP_SPACING) / GATE_SPACING);
    for (let j = 0; j < gateCount; j++) {
      const x = GATE_START + j * GATE_SPACING;
      const half = Math.max(48, 78 - j);
      const cor = this.corridorAt(x * M);
      const cc = Math.trunc(cor.center / M);
      const hh = Math.trunc(cor.half / M);
      const room = Math.max(0, hh - half - 8);
      const gap = cc + Math.floor(rand() * (2 * room + 1)) - room;
      this.gates_.push({ x, gap, half });
    }
    this.events_ = [];
    const start = this.corridorAt(RACCOON_X * M);
    this.s_ = { ...TailspinSim.blank(), y: start.center };
  }

  /** Corridor center and half-height at a world x, all in milli-px. */
  corridorAt(xm: number): { center: number; half: number } {
    const span = CP_SPACING * M;
    const last = this.centers_.length - 1;
    const i = Math.min(last - 1, Math.max(0, Math.floor(xm / span)));
    const frac = Math.min(span, Math.max(0, xm - i * span));
    const c0 = this.centers_[i], c1 = this.centers_[i + 1];
    const h0 = this.halves_[i], h1 = this.halves_[i + 1];
    return {
      center: c0 * M + Math.trunc(((c1 - c0) * frac) / CP_SPACING),
      half: h0 * M + Math.trunc(((h1 - h0) * frac) / CP_SPACING),
    };
  }

  /** PR-7 (PROPOSED) input path. Live play, replay and bots all call this between ticks. */
  input(event: GameEvent): void {
    const s = this.s_;
    if (s.done) return;
    let holding: boolean;
    if (event.type === 'hold_start') holding = true;
    else if (event.type === 'hold_end') holding = false;
    else return;
    if (holding === s.holding) return;
    this.s_ = { ...s, holding };
    this.events_.push({ tick: s.tick, type: event.type });
  }

  press(): void { this.input({ tick: this.s_.tick, type: 'hold_start' }); }
  release(): void { this.input({ tick: this.s_.tick, type: 'hold_end' }); }

  tick(_dt: number): void {
    const s = this.s_;
    if (s.done) return;
    const tick = s.tick + 1;
    const scrollX = s.scrollX + speedAt(s.tick);
    const x = scrollX + RACCOON_X * M;
    const spin = s.holding ? Math.min(SPIN_MAX, s.spin + SPIN_UP) : Math.max(0, s.spin - SPIN_DOWN);
    let { y, vy, recover, score, streak, gatesPassed, precisionPasses, bonks, nextGate } = s;

    if (recover > 0) {
      recover -= 1;
      y = this.corridorAt(x).center;
      vy = 0;
      while (nextGate < this.gates_.length && this.gates_[nextGate].x * M <= x) nextGate += 1;
    } else {
      vy = Math.min(VY_MAX, Math.max(VY_MIN, vy + GRAVITY - Math.trunc((spin * 9) / 10)));
      y += vy;
      const cor = this.corridorAt(x);
      const r = RADIUS * M;
      let bonk = y - r < cor.center - cor.half || y + r > cor.center + cor.half;
      for (const k of [nextGate - 1, nextGate]) {
        const g = this.gates_[k];
        if (!g) continue;
        if (Math.abs(x - g.x * M) < (PILLAR_HALF + RADIUS) * M) {
          if (y - r < (g.gap - g.half) * M || y + r > (g.gap + g.half) * M) bonk = true;
        }
      }
      if (bonk) {
        bonks += 1;
        streak = 0;
        recover = RECOVER_TICKS;
      } else if (nextGate < this.gates_.length && this.gates_[nextGate].x * M <= x) {
        const g = this.gates_[nextGate];
        nextGate += 1;
        gatesPassed += 1;
        const precise = Math.abs(y - g.gap * M) <= Math.floor((g.half * M) / 3);
        if (precise) {
          streak += 1;
          precisionPasses += 1;
        } else {
          streak = 0;
        }
        const mult = streak >= 10 ? 3 : streak >= 5 ? 2 : 1;
        score += (GATE_POINTS + (precise ? PRECISION_POINTS : 0)) * mult;
      }
    }

    this.s_ = {
      ...s, tick, scrollX, spin, y, vy, recover, score, streak, gatesPassed, precisionPasses, bonks, nextGate,
      done: tick >= TOTAL_TICKS,
    };
  }

  getState(): TailspinState { return this.s_; }
  getGates(): readonly Gate[] { return this.gates_; }
  getCurrentTick(): number { return this.s_.tick; }
  isDone(): boolean { return this.s_.done; }
  getScore(): number { return this.s_.score; }
  getEventLog(): readonly GameEvent[] { return this.events_; }

  destroy(): void {
    this.centers_ = [];
    this.halves_ = [];
    this.gates_ = [];
    this.events_ = [];
  }
}

// ─── VIEW ─────────────────────────────────────────────────────────────────────

export class TailspinView implements GameView {
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private sim_: TailspinSim | null = null;
  private scoreCb_: ((rawScore: number, events: readonly GameEvent[]) => void) | null = null;
  private fired_ = false;
  private tailAngle_ = 0;
  private cleanup_: (() => void)[] = [];

  mount(container: HTMLElement, sim: Readonly<GameSim>): void {
    this.sim_ = sim as TailspinSim;
    const canvas = document.createElement('canvas');
    canvas.width = W;
    canvas.height = H;
    canvas.style.cssText = 'display:block;width:100%;height:auto;aspect-ratio:16/10;touch-action:none;cursor:pointer;border-radius:12px;';
    container.appendChild(canvas);
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');

    const down = (e: Event): void => { e.preventDefault(); this.sim_?.press(); };
    const up = (e: Event): void => { e.preventDefault(); this.sim_?.release(); };
    const key = (e: KeyboardEvent): void => {
      if (e.code !== 'Space') return;
      e.preventDefault();
      if (e.type === 'keydown') this.sim_?.press(); else this.sim_?.release();
    };
    canvas.addEventListener('pointerdown', down);
    canvas.addEventListener('pointerup', up);
    canvas.addEventListener('pointercancel', up);
    canvas.addEventListener('pointerleave', up);
    window.addEventListener('keydown', key);
    window.addEventListener('keyup', key);
    this.cleanup_ = [
      () => window.removeEventListener('keydown', key),
      () => window.removeEventListener('keyup', key),
    ];
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

    const left = s.scrollX / M;
    // Cave background
    const bg = ctx.createLinearGradient(0, 0, 0, H);
    bg.addColorStop(0, '#1b1530');
    bg.addColorStop(1, '#0d0a18');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    // Rock: ceiling and floor
    ctx.fillStyle = '#3a2f4f';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    for (let sx = 0; sx <= W; sx += 8) {
      const c = sim.corridorAt((left + sx) * M);
      ctx.lineTo(sx, (c.center - c.half) / M);
    }
    ctx.lineTo(W, 0);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(0, H);
    for (let sx = 0; sx <= W; sx += 8) {
      const c = sim.corridorAt((left + sx) * M);
      ctx.lineTo(sx, (c.center + c.half) / M);
    }
    ctx.lineTo(W, H);
    ctx.fill();

    // Pillars
    for (const g of sim.getGates()) {
      const sx = g.x - left;
      if (sx < -40 || sx > W + 40) continue;
      const c = sim.corridorAt(g.x * M);
      const top = (c.center - c.half) / M;
      const bot = (c.center + c.half) / M;
      ctx.fillStyle = '#6b5a8a';
      ctx.fillRect(sx - PILLAR_HALF, top, PILLAR_HALF * 2, g.gap - g.half - top);
      ctx.fillRect(sx - PILLAR_HALF, g.gap + g.half, PILLAR_HALF * 2, bot - (g.gap + g.half));
      // Precision zone: gold brackets at the inner third of the gap
      const third = g.half / 3;
      ctx.fillStyle = '#ffd666';
      ctx.fillRect(sx - PILLAR_HALF - 5, g.gap - third - 1, PILLAR_HALF * 2 + 10, 3);
      ctx.fillRect(sx - PILLAR_HALF - 5, g.gap + third - 2, PILLAR_HALF * 2 + 10, 3);
    }

    // Raccoon
    const rx = RACCOON_X;
    const ry = s.y / M;
    const blink = s.recover > 0 && Math.floor(s.tick / 6) % 2 === 0;
    this.tailAngle_ += (s.spin / SPIN_MAX) * 0.55;
    ctx.save();
    ctx.translate(rx, ry);
    ctx.globalAlpha = blink ? 0.45 : 1;
    // Tail rotor above the body
    ctx.save();
    ctx.translate(-4, -16);
    ctx.rotate(this.tailAngle_);
    for (let i = 0; i < 2; i++) {
      ctx.rotate(Math.PI * i);
      for (let k = 0; k < 4; k++) {
        ctx.fillStyle = k % 2 === 0 ? '#8d8d99' : '#2b2b33';
        ctx.fillRect(4 + k * 6, -3, 6, 6);
      }
    }
    ctx.restore();
    // Body
    ctx.fillStyle = '#8d8d99';
    ctx.beginPath();
    ctx.ellipse(0, 0, RADIUS + 3, RADIUS - 2, 0, 0, Math.PI * 2);
    ctx.fill();
    // Head with mask
    ctx.beginPath();
    ctx.arc(RADIUS, -2, 9, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#2b2b33';
    ctx.fillRect(RADIUS - 6, -5, 14, 5);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(RADIUS + 3, -4, 3, 3);
    ctx.fillStyle = '#2b2b33';
    ctx.beginPath();
    ctx.arc(RADIUS + 9, 0, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // HUD
    ctx.fillStyle = '#f5f0ff';
    ctx.font = 'bold 20px system-ui, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(`${s.score}`, 14, 28);
    ctx.textAlign = 'right';
    ctx.fillText(`${Math.max(0, Math.ceil((TOTAL_TICKS - s.tick) / 60))}s`, W - 14, 28);
    const mult = s.streak >= 10 ? 3 : s.streak >= 5 ? 2 : 1;
    if (s.streak > 0) {
      ctx.textAlign = 'center';
      ctx.fillStyle = '#ffd666';
      ctx.fillText(`streak ${s.streak}${mult > 1 ? ` · x${mult}` : ''}`, W / 2, 28);
    }
    if (s.tick < START_GRACE) {
      ctx.textAlign = 'center';
      ctx.fillStyle = '#f5f0ff';
      ctx.fillText('Hold to spin up', W / 2, H / 2 - 40);
    }
    ctx.textAlign = 'start';
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
  }
}

// ─── MODULE ───────────────────────────────────────────────────────────────────

const META: GameMeta = {
  id: 'tailspin',
  slug: 'tailspin',
  title: 'Tailspin',
  controlScheme: 'hold',
  durationSeconds: 60,
  difficultyCurve: 'ramp',
  themeTags: ['flight', 'raccoon', 'cave', 'precision'],
  generatedBy: 'human',
  contractVersion: '1.0.0',
  gameVersion: '1.0.0',
};

const TailspinModule: GameModule = {
  meta: META,
  createSim: (): GameSim => new TailspinSim(),
  createView: (): GameView => new TailspinView(),
};

export default TailspinModule;
