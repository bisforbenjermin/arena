/**
 * PRECISION TAP — F4 Reference Game 1
 * Control scheme: tap | Difficulty: flat | Duration: 30 s
 *
 * Targets spawn at PRNG-seeded positions and intervals. Tap while the
 * shrinking ring is visible. Score = (hits / TARGET_COUNT) × 100.
 *
 * PR-1  PRNG injected via prngFactory — no Math.random() anywhere
 * PR-2  tick-based timing — no Date.now() / performance.now()
 * PR-3  GameSim is DOM-free and runs under Node; GameView reads sim state only
 * PR-4  contractVersion + gameVersion declared on meta
 * PR-6  controlScheme 'tap' — not reserved
 */

import type {
  GameModule,
  GameSim,
  GameView,
  GameMeta,
  GameEvent,
  RoundConfig,
  PrngFactory,
} from '../../contracts/game-module';

// ─── CONSTANTS ────────────────────────────────────────────────────────────────

const DURATION_SECONDS = 30;
const TOTAL_TICKS      = DURATION_SECONDS * 60; // 1 800
const TARGET_COUNT     = 15;
const BASE_WINDOW      = 45; // ticks — 0.75 s at speedMultiplier 1×

// ─── SIM ──────────────────────────────────────────────────────────────────────

interface TargetSpec {
  readonly spawnTick:   number;
  readonly windowTicks: number;
  readonly x: number; // normalised 0–1
  readonly y: number; // normalised 0–1
}

/**
 * PrecisionTapSim — pure, headless, DOM-free.
 * Extended public surface (registerTap, getActiveTarget, getTargetProgress,
 * getCurrentTick, isDone) is consumed by PrecisionTapView via concrete cast
 * inside the same GameModule bundle.
 */
export class PrecisionTapSim implements GameSim {
  private tick_        = 0;
  private targets_: TargetSpec[] = [];
  private targetIdx_   = 0;
  private hits_        = 0;
  private events_: GameEvent[] = [];
  private done_        = false;

  init(config: RoundConfig, prngFactory: PrngFactory): void {
    this.tick_      = 0;
    this.targets_   = [];
    this.targetIdx_ = 0;
    this.hits_      = 0;
    this.events_    = [];
    this.done_      = false;

    const windowTicks = Math.max(15, Math.round(BASE_WINDOW / config.speedMultiplier));
    const rand        = prngFactory();
    const spacing     = Math.floor(TOTAL_TICKS / TARGET_COUNT);

    for (let i = 0; i < TARGET_COUNT; i++) {
      const base   = i * spacing + 30; // first target not before tick 30
      const jitter = Math.floor(rand() * spacing * 0.35);
      this.targets_.push({
        spawnTick:   base + jitter,
        windowTicks,
        x: 0.1 + rand() * 0.8,
        y: 0.1 + rand() * 0.8,
      });
    }
  }

  tick(_dt: number): void {
    if (this.done_) return;
    this.tick_++;

    // Expire targets the player missed without recording an event — misses
    // are implicit: no tap event within [spawnTick, spawnTick + windowTicks).
    while (this.targetIdx_ < this.targets_.length) {
      const t = this.targets_[this.targetIdx_];
      if (this.tick_ > t.spawnTick + t.windowTicks) {
        this.targetIdx_++;
      } else {
        break;
      }
    }

    if (this.tick_ >= TOTAL_TICKS) this.done_ = true;
  }

  /** View calls this on every player tap. */
  registerTap(): void {
    if (this.done_) return;
    const t   = this.targets_[this.targetIdx_];
    const age = t ? this.tick_ - t.spawnTick : -1;
    const hit = t !== undefined && age >= 0 && age < t.windowTicks;

    this.events_.push({
      tick:    this.tick_,
      type:    'tap',
      payload: { targetIndex: this.targetIdx_, hit },
    });

    if (hit) {
      this.hits_++;
      this.targetIdx_++;
    }
  }

  /** Currently visible target; null when between targets or window closed. */
  getActiveTarget(): TargetSpec | null {
    const t = this.targets_[this.targetIdx_];
    if (!t) return null;
    const age = this.tick_ - t.spawnTick;
    if (age < 0 || age >= t.windowTicks) return null;
    return t;
  }

  /** 0 → just spawned · 1 → window about to close. Drives shrink animation. */
  getTargetProgress(): number {
    const t = this.targets_[this.targetIdx_];
    if (!t) return 0;
    const age = this.tick_ - t.spawnTick;
    if (age < 0 || age >= t.windowTicks) return 0;
    return age / t.windowTicks;
  }

  getCurrentTick(): number            { return this.tick_;  }
  isDone():         boolean            { return this.done_;  }
  getScore():       number             { return TARGET_COUNT > 0 ? (this.hits_ / TARGET_COUNT) * 100 : 0; }
  getEventLog():    readonly GameEvent[]{ return this.events_; }
  destroy(): void { this.targets_ = []; this.events_ = []; }
}

// ─── VIEW ──────────────────────────────────────────────────────────────────────

const W = 400;
const H = 600;
const R = 38; // target hit-circle radius px

export class PrecisionTapView implements GameView {
  private canvas:   HTMLCanvasElement | null = null;
  private ctx:      CanvasRenderingContext2D | null = null;
  private sim_:     PrecisionTapSim | null = null;
  private scoreCb_: ((rawScore: number, events: readonly GameEvent[]) => void) | null = null;
  private fired_  = false;

  mount(container: HTMLElement, sim: Readonly<GameSim>): void {
    // Safe: PrecisionTapView is always paired with PrecisionTapSim by this module.
    this.sim_ = sim as PrecisionTapSim;

    const canvas       = document.createElement('canvas');
    canvas.width       = W;
    canvas.height      = H;
    canvas.style.cssText = 'display:block;width:100%;height:100%;touch-action:none;cursor:pointer;';
    container.appendChild(canvas);
    this.canvas = canvas;
    this.ctx    = canvas.getContext('2d')!;

    const onInput = (): void => { this.sim_?.registerTap(); };
    canvas.addEventListener('click',      onInput);
    canvas.addEventListener('touchstart', onInput, { passive: true });
  }

  render(): void {
    const sim = this.sim_;
    const ctx = this.ctx;
    if (!sim || !ctx) return;

    if (sim.isDone() && !this.fired_ && this.scoreCb_) {
      this.fired_ = true;
      this.scoreCb_(sim.getScore(), sim.getEventLog());
      return;
    }

    // Background
    ctx.fillStyle = '#0a0a14';
    ctx.fillRect(0, 0, W, H);

    const target = sim.getActiveTarget();
    if (target) {
      const px  = target.x * W;
      const py  = target.y * H;
      const p   = sim.getTargetProgress();

      // Outer shrinking ring — contracts as window closes
      const outerR = R * (1 + (1 - p) * 0.65);
      ctx.beginPath();
      ctx.arc(px, py, outerR, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(0,255,204,${0.25 + p * 0.35})`;
      ctx.lineWidth   = 2;
      ctx.stroke();

      // Inner hit dot
      ctx.beginPath();
      ctx.arc(px, py, R * 0.32, 0, Math.PI * 2);
      ctx.fillStyle = '#00ffcc';
      ctx.fill();
    }

    // Score — top centre
    ctx.fillStyle  = '#ffffff';
    ctx.font       = 'bold 26px monospace';
    ctx.textAlign  = 'center';
    ctx.fillText(`${Math.round(sim.getScore())}%`, W / 2, 38);

    // Tick progress bar — bottom
    const progress = sim.getCurrentTick() / TOTAL_TICKS;
    ctx.fillStyle  = '#1a1a2e';
    ctx.fillRect(0, H - 6, W, 6);
    ctx.fillStyle  = '#00ffcc';
    ctx.fillRect(0, H - 6, W * progress, 6);
  }

  onScore(cb: (rawScore: number, events: readonly GameEvent[]) => void): void {
    this.scoreCb_ = cb;
  }

  destroy(): void {
    this.canvas?.remove();
    this.canvas  = null;
    this.ctx     = null;
    this.sim_    = null;
    this.scoreCb_= null;
    this.fired_  = false;
  }
}

// ─── MODULE ───────────────────────────────────────────────────────────────────

const META: GameMeta = {
  id:              'precision-tap',
  slug:            'precision-tap',
  title:           'Precision Tap',
  controlScheme:   'tap',
  durationSeconds: DURATION_SECONDS,
  difficultyCurve: 'flat',
  themeTags:       ['reflex', 'precision', 'timing'],
  generatedBy:     'human',
  contractVersion: '1.0.0',
  gameVersion:     '1.0.0',
};

const PrecisionTapModule: GameModule = {
  meta:       META,
  createSim:  (): GameSim  => new PrecisionTapSim(),
  createView: (): GameView => new PrecisionTapView(),
};

export default PrecisionTapModule;
