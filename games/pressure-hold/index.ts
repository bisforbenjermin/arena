/**
 * PRESSURE HOLD — F4 Reference Game 2
 * Control scheme: hold | Difficulty: ramp | Duration: 30 s
 *
 * A gauge oscillates between 0 and 1 (PRNG-seeded frequencies + phases).
 * A target zone is centred at 0.5 and shrinks over the round (ramp).
 * Hold while the needle is inside the zone.
 * Score = cumulative ticks held in zone.
 *
 * Server replay: re-init sim with same seed → re-derive gauge path →
 * walk event log (hold_start / hold_end pairs) → sum in-zone ticks. ✓
 *
 * PR-1  PRNG seeds freq + phase — no Math.random() (Math.sin is deterministic)
 * PR-2  tick-based timing — gauge position is f(this.tick_), no wall-clock
 * PR-3  GameSim is DOM-free; Math.sin has no browser dependency
 * PR-4  contractVersion + gameVersion declared on meta
 * PR-6  controlScheme 'hold' — not reserved
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
const ZONE_CENTER      = 0.5;
const ZONE_WIDE        = 0.38; // half-width at tick 0   (easy)
const ZONE_NARROW      = 0.10; // half-width at tick max (hard)

// ─── SIM ──────────────────────────────────────────────────────────────────────

/**
 * PressureHoldSim — pure, headless, DOM-free.
 * Math.sin is a pure numeric function — no DOM, no global state, safe under Node.
 */
export class PressureHoldSim implements GameSim {
  private tick_    = 0;
  private freq1_   = 0;
  private freq2_   = 0;
  private phase1_  = 0;
  private phase2_  = 0;
  private holding_ = false;
  private score_   = 0;
  private events_: GameEvent[] = [];
  private done_    = false;

  init(config: RoundConfig, prngFactory: PrngFactory): void {
    this.tick_    = 0;
    this.score_   = 0;
    this.events_  = [];
    this.done_    = false;
    this.holding_ = false;

    const rand     = prngFactory();
    // Frequencies in Hz — scaled by speedMultiplier for difficulty
    this.freq1_  = (0.35 + rand() * 0.55) * config.speedMultiplier;
    this.freq2_  = (0.12 + rand() * 0.28) * config.speedMultiplier;
    this.phase1_ = rand() * Math.PI * 2;
    this.phase2_ = rand() * Math.PI * 2;
  }

  tick(_dt: number): void {
    if (this.done_) return;
    this.tick_++;

    if (this.holding_ && this.gaugeInZone_()) this.score_++;

    if (this.tick_ >= TOTAL_TICKS) {
      // Auto-close any open hold so the event log is always balanced
      if (this.holding_) {
        this.holding_ = false;
        this.events_.push({ tick: this.tick_, type: 'hold_end' });
      }
      this.done_ = true;
    }
  }

  /** View calls this on pointer/touch down. */
  registerHoldStart(): void {
    if (this.done_ || this.holding_) return;
    this.holding_ = true;
    this.events_.push({ tick: this.tick_, type: 'hold_start' });
  }

  /** View calls this on pointer/touch up or leave. */
  registerHoldEnd(): void {
    if (this.done_ || !this.holding_) return;
    this.holding_ = false;
    this.events_.push({ tick: this.tick_, type: 'hold_end' });
  }

  /**
   * Gauge value 0–1 at the current tick.
   * Deterministic: identical seed + tick → identical value. Safe for Node replay.
   */
  getGaugeValue(): number {
    const t = this.tick_ / 60; // seconds
    const a = Math.sin(this.freq1_ * t * Math.PI * 2 + this.phase1_);
    const b = Math.sin(this.freq2_ * t * Math.PI * 2 + this.phase2_);
    return Math.max(0, Math.min(1, (a * 0.62 + b * 0.38) * 0.5 + 0.5));
  }

  /** Zone half-width — shrinks linearly from ZONE_WIDE to ZONE_NARROW. */
  getZoneHalfWidth(): number {
    const p = this.tick_ / TOTAL_TICKS;
    return ZONE_WIDE + (ZONE_NARROW - ZONE_WIDE) * p;
  }

  isHolding():      boolean             { return this.holding_;  }
  getCurrentTick(): number              { return this.tick_;     }
  isDone():         boolean             { return this.done_;     }
  getScore():       number              { return this.score_;    }
  getEventLog():    readonly GameEvent[]{ return this.events_;   }
  destroy(): void { this.events_ = []; }

  private gaugeInZone_(): boolean {
    const g  = this.getGaugeValue();
    const hw = this.getZoneHalfWidth();
    return g >= ZONE_CENTER - hw && g <= ZONE_CENTER + hw;
  }
}

// ─── VIEW ──────────────────────────────────────────────────────────────────────

const W          = 320;
const H          = 580;
const TRACK_X    = W / 2 - 18;
const TRACK_W    = 36;
const TRACK_TOP  = 70;
const TRACK_H    = 360;

export class PressureHoldView implements GameView {
  private canvas:   HTMLCanvasElement | null = null;
  private ctx:      CanvasRenderingContext2D | null = null;
  private sim_:     PressureHoldSim | null = null;
  private scoreCb_: ((rawScore: number, events: readonly GameEvent[]) => void) | null = null;
  private fired_   = false;

  mount(container: HTMLElement, sim: Readonly<GameSim>): void {
    // Safe: always paired with PressureHoldSim by this module.
    this.sim_ = sim as PressureHoldSim;

    const canvas       = document.createElement('canvas');
    canvas.width       = W;
    canvas.height      = H;
    canvas.style.cssText = 'display:block;width:100%;height:100%;touch-action:none;user-select:none;';
    container.appendChild(canvas);
    this.canvas = canvas;
    this.ctx    = canvas.getContext('2d')!;

    const onDown = (e: Event): void => { e.preventDefault(); this.sim_?.registerHoldStart(); };
    const onUp   = (e: Event): void => { e.preventDefault(); this.sim_?.registerHoldEnd();   };

    canvas.addEventListener('mousedown',  onDown);
    canvas.addEventListener('mouseup',    onUp);
    canvas.addEventListener('mouseleave', onUp);
    canvas.addEventListener('touchstart', onDown, { passive: false });
    canvas.addEventListener('touchend',   onUp,   { passive: false });
    canvas.addEventListener('touchcancel',onUp,   { passive: false });
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

    const gauge   = sim.getGaugeValue();
    const hw      = sim.getZoneHalfWidth();
    const holding = sim.isHolding();
    const inZone  = gauge >= ZONE_CENTER - hw && gauge <= ZONE_CENTER + hw;

    // Background
    ctx.fillStyle = '#0a0a14';
    ctx.fillRect(0, 0, W, H);

    // Track
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(TRACK_X, TRACK_TOP, TRACK_W, TRACK_H);

    // Zone band
    const zoneLo  = ZONE_CENTER - hw;
    const zoneHi  = ZONE_CENTER + hw;
    const zoneTop = TRACK_TOP + (1 - zoneHi) * TRACK_H;
    const zoneH   = (zoneHi - zoneLo) * TRACK_H;
    ctx.fillStyle   = 'rgba(0,255,204,0.18)';
    ctx.fillRect(TRACK_X, zoneTop, TRACK_W, zoneH);
    ctx.strokeStyle = '#00ffcc';
    ctx.lineWidth   = 1.5;
    ctx.strokeRect(TRACK_X, zoneTop, TRACK_W, zoneH);

    // Needle
    const needleY   = TRACK_TOP + (1 - gauge) * TRACK_H;
    ctx.fillStyle   = holding && inZone ? '#00ffcc' : '#445566';
    ctx.fillRect(TRACK_X - 8, needleY - 5, TRACK_W + 16, 10);

    // Hold button
    const btnY = H - 110;
    ctx.fillStyle   = holding ? 'rgba(0,255,204,0.15)' : '#1a1a2e';
    ctx.strokeStyle = holding ? '#00ffcc' : '#334455';
    ctx.lineWidth   = 2;
    ctx.beginPath();
    ctx.rect(W / 2 - 72, btnY, 144, 62);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle  = holding ? '#00ffcc' : '#556677';
    ctx.font       = 'bold 18px monospace';
    ctx.textAlign  = 'center';
    ctx.fillText('HOLD', W / 2, btnY + 38);

    // Score + tick progress
    ctx.fillStyle  = '#ffffff';
    ctx.font       = 'bold 20px monospace';
    ctx.fillText(`${sim.getScore()} ticks`, W / 2, 46);

    const p = sim.getCurrentTick() / TOTAL_TICKS;
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, H - 6, W, 6);
    ctx.fillStyle = '#00ffcc';
    ctx.fillRect(0, H - 6, W * p, 6);
  }

  onScore(cb: (rawScore: number, events: readonly GameEvent[]) => void): void {
    this.scoreCb_ = cb;
  }

  destroy(): void {
    this.canvas?.remove();
    this.canvas   = null;
    this.ctx      = null;
    this.sim_     = null;
    this.scoreCb_ = null;
    this.fired_   = false;
  }
}

// ─── MODULE ───────────────────────────────────────────────────────────────────

const META: GameMeta = {
  id:              'pressure-hold',
  slug:            'pressure-hold',
  title:           'Pressure Hold',
  controlScheme:   'hold',
  durationSeconds: DURATION_SECONDS,
  difficultyCurve: 'ramp',
  themeTags:       ['control', 'timing', 'endurance'],
  generatedBy:     'human',
  contractVersion: '1.0.0',
  gameVersion:     '1.0.0',
};

const PressureHoldModule: GameModule = {
  meta:       META,
  createSim:  (): GameSim  => new PressureHoldSim(),
  createView: (): GameView => new PressureHoldView(),
};

export default PressureHoldModule;
