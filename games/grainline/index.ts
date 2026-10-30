/**
 * GRAINLINE — forge build P-20261029-deepseek-A
 * Control scheme: swipe | Difficulty: flat | Duration: 30 s
 *
 * A glyph appears with three parallel grain lines. Swipe along the grain,
 * either way, before its ring closes. Within 20° is CLEAN (30 + speed bonus),
 * within 40° is CUT (10). Anything else, or letting the ring close, is a MISS
 * and resets the combo. Any swipe resolves the glyph, so guessing is costly.
 * Combo: ×2 at 5 straight cuts, ×3 at 10 (cap).
 *
 * PR-1  PRNG injected via prngFactory; the whole glyph schedule is drawn in init()
 * PR-2  tick-based timing; dt is ignored and no wall clock is read
 * PR-3  GrainlineSim is DOM-free and runs under Node; GrainlineView reads sim state
 *       and forwards swipes through registerSwipe, as the reference games do
 * PR-4  contractVersion + gameVersion declared on meta
 * PR-6  controlScheme 'swipe', not reserved
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

// ─── CONSTANTS (all tuning lives here) ───────────────────────────────────────

export const DURATION_SECONDS = 30;
export const TOTAL_TICKS      = DURATION_SECONDS * 60; // 1 800
const FIRST_SPAWN_TICK   = 30;
const END_BUFFER_TICKS   = 90;  // no new glyph in the last 1.5 s
const WINDOW_MIN         = 60;  // ticks a glyph stays, before speedMultiplier
const WINDOW_SPREAD      = 31;
const GAP_MIN            = 30;  // ticks between glyphs, before speedMultiplier
const GAP_SPREAD         = 31;
const WINDOW_FLOOR       = 20;
const GAP_FLOOR          = 12;
const CLEAN_TOLERANCE    = 20;  // degrees
const CUT_TOLERANCE      = 40;  // degrees
const CLEAN_POINTS       = 30;
const CUT_POINTS         = 10;
const SPEED_BONUS_MAX    = 10;  // on CLEAN, scaled by how much ring is left
const COMBO_STEP         = 5;
const MAX_MULT           = 3;
const MIN_SPEED          = 0.5;
const MAX_SPEED          = 3;

/** Each grain accepts both directions along its line (screen coords, y down). */
export const GRAIN_ANGLES: readonly (readonly number[])[] = [
  [0, 180],   // 0 horizontal
  [90, 270],  // 1 vertical
  [45, 225],  // 2 diagonal, down-right
  [135, 315], // 3 diagonal, down-left
];

export function angleDiff(a: number, b: number): number {
  const d = Math.abs(a - b) % 360;
  return d > 180 ? 360 - d : d;
}

/** Integer degrees in [0, 360), or null for non-finite input. */
export function normalizeAngle(deg: number): number | null {
  if (!Number.isFinite(deg)) return null;
  const r = Math.round(deg) % 360;
  return r < 0 ? r + 360 : r;
}

// ─── SIM ──────────────────────────────────────────────────────────────────────

interface GlyphSpec { readonly grain: number; readonly windowTicks: number; readonly spawnTick: number; }
export type CutQuality = 'clean' | 'cut' | 'miss' | 'expired';
export interface SwipeInput { readonly tick: number; readonly angle: number; }

/**
 * GrainlineSim — pure, headless, DOM-free.
 * Extended public surface (registerSwipe, getActiveGrain, getRingProgress,
 * getLastResult, getCombo, getCurrentTick, isDone, getInputLog) is consumed by
 * GrainlineView and the bots via concrete cast.
 */
export class GrainlineSim implements GameSim {
  private tick_       = 0;
  private schedule_: GlyphSpec[] = [];
  private queueIdx_   = 0;
  private grain_: number | null = null;
  private spawnTick_  = 0;
  private window_     = 0;
  private score_      = 0;
  private combo_      = 0;
  private maxCombo_   = 0;
  private cleans_     = 0;
  private cuts_       = 0;
  private misses_     = 0;
  private events_: GameEvent[] = [];
  private inputs_: SwipeInput[] = [];
  private done_       = false;
  private lastSwipeTick_ = -1;
  private last_: { tick: number; quality: CutQuality; points: number; grain: number } | null = null;

  init(config: RoundConfig, prngFactory: PrngFactory): void {
    this.tick_ = 0; this.schedule_ = []; this.queueIdx_ = 0; this.grain_ = null;
    this.spawnTick_ = 0; this.window_ = 0; this.score_ = 0; this.combo_ = 0;
    this.maxCombo_ = 0; this.cleans_ = 0; this.cuts_ = 0; this.misses_ = 0;
    this.events_ = []; this.inputs_ = []; this.done_ = false;
    this.lastSwipeTick_ = -1; this.last_ = null;

    const raw = Number.isFinite(config.speedMultiplier) ? config.speedMultiplier : 1;
    const speed = Math.min(MAX_SPEED, Math.max(MIN_SPEED, raw));

    // PR-1: one PRNG, used only here. The round is fixed before the first tick.
    const rand = prngFactory();
    let t = FIRST_SPAWN_TICK;
    while (t < TOTAL_TICKS - END_BUFFER_TICKS) {
      const grain = Math.floor(rand() * 4);
      const windowTicks = Math.max(WINDOW_FLOOR, Math.round((WINDOW_MIN + Math.floor(rand() * WINDOW_SPREAD)) / speed));
      const gap = Math.max(GAP_FLOOR, Math.round((GAP_MIN + Math.floor(rand() * GAP_SPREAD)) / speed));
      this.schedule_.push({ grain, windowTicks, spawnTick: t });
      t += windowTicks + gap;
    }
  }

  tick(_dt: number): void {
    if (this.done_) return;
    this.tick_++;

    if (this.grain_ !== null && this.tick_ - this.spawnTick_ > this.window_) {
      this.misses_++; this.combo_ = 0;
      this.last_ = { tick: this.tick_, quality: 'expired', points: 0, grain: this.grain_ };
      this.events_.push({ tick: this.tick_, type: 'glyph_expired', payload: { grain: this.grain_ } });
      this.grain_ = null;
    }

    if (this.grain_ === null && this.queueIdx_ < this.schedule_.length) {
      const spec = this.schedule_[this.queueIdx_];
      if (spec.spawnTick <= this.tick_) {
        this.grain_ = spec.grain; this.spawnTick_ = this.tick_;
        this.window_ = spec.windowTicks; this.queueIdx_++;
        this.events_.push({ tick: this.tick_, type: 'glyph_spawn', payload: { grain: spec.grain, window: spec.windowTicks } });
      }
    }

    if (this.tick_ >= TOTAL_TICKS) this.done_ = true;
  }

  /**
   * Apply a swipe at the current tick. Any swipe resolves the active glyph.
   * At most one swipe per tick is accepted. Returns true if accepted.
   */
  registerSwipe(angleDeg: number): boolean {
    if (this.done_ || this.grain_ === null) return false;
    if (this.tick_ === this.lastSwipeTick_) return false;
    const angle = normalizeAngle(angleDeg);
    if (angle === null) return false;
    this.lastSwipeTick_ = this.tick_;
    this.inputs_.push({ tick: this.tick_, angle });

    let diff = 360;
    for (const e of GRAIN_ANGLES[this.grain_]) diff = Math.min(diff, angleDiff(angle, e));

    let base = 0;
    let quality: CutQuality = 'miss';
    if (diff <= CLEAN_TOLERANCE) {
      const left = Math.max(0, this.window_ - (this.tick_ - this.spawnTick_));
      base = CLEAN_POINTS + Math.floor((SPEED_BONUS_MAX * left) / this.window_); // integer math
      quality = 'clean';
    } else if (diff <= CUT_TOLERANCE) {
      base = CUT_POINTS; quality = 'cut';
    }

    const mult = Math.min(MAX_MULT, 1 + Math.floor(this.combo_ / COMBO_STEP));
    const points = base * mult;

    if (quality === 'miss') { this.combo_ = 0; this.misses_++; }
    else {
      this.score_ += points; this.combo_++;
      if (quality === 'clean') this.cleans_++; else this.cuts_++;
      this.maxCombo_ = Math.max(this.maxCombo_, this.combo_);
    }

    this.last_ = { tick: this.tick_, quality, points, grain: this.grain_ };
    this.events_.push({ tick: this.tick_, type: 'swipe', payload: { angle, grain: this.grain_, diff, quality, points, combo: this.combo_ } });
    this.grain_ = null;
    return true;
  }

  getActiveGrain(): number | null { return this.grain_; }
  /** 0 when a glyph appears, 1 when its ring has closed. */
  getRingProgress(): number {
    if (this.grain_ === null || this.window_ <= 0) return 1;
    return Math.min(1, (this.tick_ - this.spawnTick_) / this.window_);
  }
  getLastResult(): { tick: number; quality: CutQuality; points: number; grain: number } | null { return this.last_; }
  getInputLog(): readonly SwipeInput[] { return this.inputs_; }
  getCombo(): number      { return this.combo_; }
  getMultiplier(): number { return Math.min(MAX_MULT, 1 + Math.floor(this.combo_ / COMBO_STEP)); }
  getMaxCombo(): number   { return this.maxCombo_; }
  getCleans(): number     { return this.cleans_; }
  getCuts(): number       { return this.cuts_; }
  getMisses(): number     { return this.misses_; }
  getGlyphCount(): number { return this.schedule_.length; }
  getCurrentTick(): number { return this.tick_; }
  isDone(): boolean       { return this.done_; }
  getScore(): number      { return this.score_; }
  getEventLog(): readonly GameEvent[] { return this.events_; }

  destroy(): void {
    this.schedule_ = []; this.events_ = []; this.inputs_ = [];
    this.grain_ = null; this.last_ = null; this.done_ = true;
  }
}

/**
 * Rebuild a round from seed + swipe log (server-side check). A swipe stamped
 * with tick T is applied before the sim advances past T, matching live play.
 * The contract has no input-replay entry point yet (PR-7 is PROPOSED); this is
 * game-local until it does.
 */
export function replayGrainline(config: RoundConfig, prngFactory: PrngFactory, inputs: readonly SwipeInput[]): GrainlineSim {
  const sim = new GrainlineSim();
  sim.init(config, prngFactory);
  let i = 0;
  while (!sim.isDone()) {
    while (i < inputs.length && inputs[i].tick <= sim.getCurrentTick()) {
      if (inputs[i].tick === sim.getCurrentTick()) sim.registerSwipe(inputs[i].angle);
      i++;
    }
    sim.tick(1 / 60);
  }
  return sim;
}

// ─── VIEW ─────────────────────────────────────────────────────────────────────

const W = 400;
const H = 640;
const CX = W / 2;
const CY = H / 2 + 20;
const GLYPH_R = 96;
const RING_R = GLYPH_R + 22;
const MIN_SWIPE_PX = 28;
const FLASH_TICKS = 18;
const SHAKE_TICKS = 10;
// BRAND-2 / CANON-2 BR-3: crimson + cyan on near-black blue.
const C = { bg: '#07080F', crimson: '#E0103A', crimsonBright: '#FF3355', cyan: '#2DE2E6', text: '#F2F4FF', dim: '#1B1E2E' };
const HEAD_FONT = '"Chakra Petch", "Arial Narrow", system-ui, sans-serif';
const BODY_FONT = '"Atkinson Hyperlegible", system-ui, sans-serif';
const LABEL: Record<CutQuality, string> = { clean: 'CLEAN', cut: 'CUT', miss: 'MISS', expired: 'TOO SLOW' };

interface Particle { x: number; y: number; vx: number; vy: number; life: number; color: string; }

export class GrainlineView implements GameView {
  private canvas_: HTMLCanvasElement | null = null;
  private ctx_: CanvasRenderingContext2D | null = null;
  private sim_: GrainlineSim | null = null;
  private scoreCb_: ((raw: number, events: readonly GameEvent[]) => void) | null = null;
  private fired_ = false;
  private start_: { id: number; x: number; y: number } | null = null;
  private trail_: { x: number; y: number }[] = [];
  private particles_: Particle[] = [];
  private seenResultTick_ = -1;
  private shake_ = 0;
  private audio_: AudioContext | null = null;
  private fx_ = 0x2545f491; // view-only LCG for particle scatter; never touches the sim
  private unbind_: (() => void) | null = null;

  mount(container: HTMLElement, sim: Readonly<GameSim>): void {
    this.sim_ = sim as GrainlineSim;
    const canvas = document.createElement('canvas');
    const dpr = Math.min(3, globalThis.devicePixelRatio || 1);
    canvas.width = W * dpr; canvas.height = H * dpr;
    canvas.style.cssText = 'display:block;width:100%;height:100%;object-fit:contain;touch-action:none;user-select:none;-webkit-user-select:none;';
    canvas.setAttribute('role', 'img');
    canvas.setAttribute('aria-label', 'Grainline: swipe along the lines on each glyph before its ring closes');
    container.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Grainline: 2D canvas unavailable');
    ctx.scale(dpr, dpr);
    this.canvas_ = canvas; this.ctx_ = ctx;

    const local = (e: PointerEvent): { x: number; y: number } => {
      const r = canvas.getBoundingClientRect();
      return { x: ((e.clientX - r.left) / r.width) * W, y: ((e.clientY - r.top) / r.height) * H };
    };
    const onDown = (e: PointerEvent): void => {
      if (this.start_) return; // one finger at a time
      this.unlockAudio();
      try { canvas.setPointerCapture(e.pointerId); } catch { /* not capturable */ }
      const p = local(e);
      this.start_ = { id: e.pointerId, ...p };
      this.trail_ = [p];
    };
    const onMove = (e: PointerEvent): void => {
      if (this.start_?.id !== e.pointerId) return;
      this.trail_.push(local(e));
      if (this.trail_.length > 24) this.trail_.shift();
    };
    const onUp = (e: PointerEvent): void => {
      const s = this.start_;
      if (!s || s.id !== e.pointerId) return;
      this.start_ = null;
      try { canvas.releasePointerCapture(e.pointerId); } catch { /* already released */ }
      const p = local(e);
      const dx = p.x - s.x, dy = p.y - s.y;
      if (dx * dx + dy * dy < MIN_SWIPE_PX * MIN_SWIPE_PX) { this.trail_ = []; return; }
      this.sim_?.registerSwipe(Math.atan2(dy, dx) * (180 / Math.PI));
    };
    const onCancel = (e: PointerEvent): void => {
      if (this.start_?.id === e.pointerId) { this.start_ = null; this.trail_ = []; }
    };

    canvas.addEventListener('pointerdown', onDown);
    canvas.addEventListener('pointermove', onMove);
    canvas.addEventListener('pointerup', onUp);
    canvas.addEventListener('pointercancel', onCancel);
    this.unbind_ = () => {
      canvas.removeEventListener('pointerdown', onDown);
      canvas.removeEventListener('pointermove', onMove);
      canvas.removeEventListener('pointerup', onUp);
      canvas.removeEventListener('pointercancel', onCancel);
    };
  }

  render(): void {
    const sim = this.sim_, ctx = this.ctx_;
    if (!sim || !ctx) return;
    if (sim.isDone()) { this.drawFinal(ctx, sim); this.fire(); return; }

    this.react(sim);

    let ox = 0, oy = 0;
    if (this.shake_ > 0) { ox = (this.rnd() - 0.5) * this.shake_; oy = (this.rnd() - 0.5) * this.shake_; this.shake_--; }
    ctx.save();
    ctx.translate(ox, oy);
    ctx.fillStyle = C.bg; ctx.fillRect(-20, -20, W + 40, H + 40);

    // The Drain as fog creeping in from the edges over the round (CANON-2 LR-4).
    const p = Math.min(1, sim.getCurrentTick() / TOTAL_TICKS);
    const fog = ctx.createRadialGradient(CX, CY, 140, CX, CY, 420);
    fog.addColorStop(0, 'rgba(7,8,15,0)');
    fog.addColorStop(1, `rgba(40,44,70,${0.15 + 0.35 * p})`);
    ctx.fillStyle = fog; ctx.fillRect(0, 0, W, H);

    const grain = sim.getActiveGrain();
    if (grain !== null) this.drawGlyph(ctx, grain, sim.getRingProgress());

    this.drawParticles(ctx);
    this.drawTrail(ctx);
    this.drawResultLabel(ctx, sim);
    ctx.restore();
    this.drawHud(ctx, sim, p);
  }

  private react(sim: GrainlineSim): void {
    const last = sim.getLastResult();
    if (!last || last.tick === this.seenResultTick_) return;
    this.seenResultTick_ = last.tick;
    this.trail_ = [];
    if (last.quality === 'clean' || last.quality === 'cut') {
      const color = last.quality === 'clean' ? C.cyan : C.text;
      const n = last.quality === 'clean' ? 26 : 12;
      for (let i = 0; i < n; i++) {
        const a = this.rnd() * Math.PI * 2, s = 2 + this.rnd() * 5;
        this.particles_.push({ x: CX, y: CY, vx: Math.cos(a) * s, vy: Math.sin(a) * s, life: 28, color });
      }
      this.tone(last.quality === 'clean' ? 660 + 60 * Math.min(10, sim.getCombo()) : 440, 0.08, 'triangle');
      this.buzz(last.quality === 'clean' ? 12 : 8);
    } else {
      this.shake_ = SHAKE_TICKS;
      this.tone(140, 0.16, 'sawtooth');
      this.buzz(40);
    }
  }

  private drawGlyph(ctx: CanvasRenderingContext2D, grain: number, progress: number): void {
    // Ring: shrinks clockwise; turns crimson and thicker in its last 40% (shape and color).
    const late = progress >= 0.6;
    ctx.beginPath();
    ctx.arc(CX, CY, RING_R, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * (1 - progress));
    ctx.strokeStyle = late ? C.crimsonBright : C.cyan;
    ctx.lineWidth = late ? 9 : 6; ctx.lineCap = 'round'; ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(CX, CY - GLYPH_R); ctx.lineTo(CX + GLYPH_R, CY);
    ctx.lineTo(CX, CY + GLYPH_R); ctx.lineTo(CX - GLYPH_R, CY);
    ctx.closePath();
    ctx.fillStyle = 'rgba(45,226,230,0.06)'; ctx.fill();
    ctx.strokeStyle = C.cyan; ctx.lineWidth = 3; ctx.stroke();

    const ang = grain === 0 ? 0 : grain === 1 ? Math.PI / 2 : grain === 2 ? Math.PI / 4 : (3 * Math.PI) / 4;
    const dx = Math.cos(ang), dy = Math.sin(ang), len = GLYPH_R * 0.62;
    ctx.save();
    ctx.shadowColor = C.cyan; ctx.shadowBlur = 12;
    ctx.strokeStyle = C.cyan; ctx.lineWidth = 4;
    for (let i = -1; i <= 1; i++) {
      const ox = -dy * i * 20, oy = dx * i * 20;
      ctx.beginPath();
      ctx.moveTo(CX + ox - dx * len, CY + oy - dy * len);
      ctx.lineTo(CX + ox + dx * len, CY + oy + dy * len);
      ctx.stroke();
    }
    ctx.restore();
  }

  private drawTrail(ctx: CanvasRenderingContext2D): void {
    const t = this.trail_;
    if (t.length < 2) return;
    ctx.save();
    ctx.lineCap = 'round';
    for (let i = 1; i < t.length; i++) {
      ctx.strokeStyle = `rgba(242,244,255,${(i / t.length) * 0.8})`;
      ctx.lineWidth = 2 + (i / t.length) * 6;
      ctx.beginPath(); ctx.moveTo(t[i - 1].x, t[i - 1].y); ctx.lineTo(t[i].x, t[i].y); ctx.stroke();
    }
    ctx.restore();
  }

  private drawParticles(ctx: CanvasRenderingContext2D): void {
    const keep: Particle[] = [];
    for (const q of this.particles_) {
      q.x += q.vx; q.y += q.vy; q.vx *= 0.94; q.vy *= 0.94; q.life--;
      if (q.life <= 0) continue;
      ctx.globalAlpha = q.life / 28;
      ctx.fillStyle = q.color; ctx.fillRect(q.x - 2, q.y - 2, 4, 4);
      keep.push(q);
    }
    ctx.globalAlpha = 1;
    this.particles_ = keep;
  }

  private drawResultLabel(ctx: CanvasRenderingContext2D, sim: GrainlineSim): void {
    const last = sim.getLastResult();
    if (!last) return;
    const age = sim.getCurrentTick() - last.tick;
    if (age >= FLASH_TICKS) return;
    const k = 1 - age / FLASH_TICKS;
    ctx.globalAlpha = k;
    ctx.textAlign = 'center';
    ctx.font = `700 34px ${HEAD_FONT}`;
    ctx.fillStyle = last.quality === 'clean' ? C.cyan : last.quality === 'cut' ? C.text : C.crimsonBright;
    ctx.fillText(LABEL[last.quality], CX, CY - RING_R - 26 - (1 - k) * 18);
    if (last.points > 0) {
      ctx.font = `700 22px ${HEAD_FONT}`;
      ctx.fillText(`+${last.points}`, CX, CY + RING_R + 44);
    }
    ctx.globalAlpha = 1;
  }

  private drawHud(ctx: CanvasRenderingContext2D, sim: GrainlineSim, p: number): void {
    ctx.textAlign = 'center';
    ctx.fillStyle = C.text; ctx.font = `700 40px ${HEAD_FONT}`;
    ctx.fillText(String(sim.getScore()), CX, 56);
    const mult = sim.getMultiplier();
    if (sim.getCombo() > 0) {
      ctx.font = `700 22px ${BODY_FONT}`;
      ctx.fillStyle = mult >= 3 ? C.crimsonBright : C.cyan;
      ctx.fillText(`×${mult}  ·  ${sim.getCombo()} in a row`, CX, 90);
    }
    ctx.fillStyle = C.dim; ctx.fillRect(0, H - 8, W, 8);
    ctx.fillStyle = p > 0.85 ? C.crimsonBright : C.cyan; ctx.fillRect(0, H - 8, W * p, 8);
  }

  private drawFinal(ctx: CanvasRenderingContext2D, sim: GrainlineSim): void {
    ctx.fillStyle = C.bg; ctx.fillRect(0, 0, W, H);
    ctx.textAlign = 'center';
    ctx.fillStyle = C.cyan; ctx.font = `700 26px ${HEAD_FONT}`;
    ctx.fillText('FINAL', CX, CY - 70);
    ctx.fillStyle = C.text; ctx.font = `700 72px ${HEAD_FONT}`;
    ctx.fillText(String(sim.getScore()), CX, CY);
    ctx.font = `400 20px ${BODY_FONT}`;
    ctx.fillText(`${sim.getCleans()} clean · ${sim.getCuts()} cut · best run ${sim.getMaxCombo()}`, CX, CY + 44);
  }

  private fire(): void {
    if (this.fired_ || !this.scoreCb_ || !this.sim_) return;
    this.fired_ = true;
    this.scoreCb_(this.sim_.getScore(), this.sim_.getEventLog());
  }

  private rnd(): number {
    this.fx_ = (Math.imul(this.fx_, 1664525) + 1013904223) >>> 0;
    return this.fx_ / 4294967296;
  }

  private unlockAudio(): void {
    if (this.audio_) return;
    try {
      const Ctor = globalThis.AudioContext ?? (globalThis as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (Ctor) this.audio_ = new Ctor();
    } catch { this.audio_ = null; }
  }

  private tone(freq: number, seconds: number, type: OscillatorType): void {
    const a = this.audio_;
    if (!a) return;
    try {
      const o = a.createOscillator(), g = a.createGain();
      o.type = type; o.frequency.value = freq;
      g.gain.setValueAtTime(0.12, a.currentTime);
      g.gain.exponentialRampToValueAtTime(0.0001, a.currentTime + seconds);
      o.connect(g).connect(a.destination);
      o.start(); o.stop(a.currentTime + seconds);
    } catch { /* audio is optional */ }
  }

  private buzz(ms: number): void {
    try { globalThis.navigator?.vibrate?.(ms); } catch { /* vibration is optional */ }
  }

  onScore(cb: (raw: number, events: readonly GameEvent[]) => void): void {
    this.scoreCb_ = cb;
    if (this.sim_?.isDone()) this.fire(); // registered after the round ended
  }

  destroy(): void {
    this.unbind_?.(); this.unbind_ = null;
    this.canvas_?.remove();
    try { void this.audio_?.close(); } catch { /* already closed */ }
    this.audio_ = null;
    this.canvas_ = null; this.ctx_ = null; this.sim_ = null; this.scoreCb_ = null;
    this.fired_ = false; this.start_ = null; this.trail_ = []; this.particles_ = [];
  }
}

// ─── MODULE ───────────────────────────────────────────────────────────────────

const META: GameMeta = {
  id: 'grainline',
  slug: 'grainline',
  title: 'Grainline',
  controlScheme: 'swipe',
  durationSeconds: DURATION_SECONDS,
  difficultyCurve: 'flat',
  themeTags: ['precision', 'direction', 'combo'],
  generatedBy: 'agent',
  contractVersion: '1.0.0',
  gameVersion: '1.0.0',
};

const GrainlineModule: GameModule = {
  meta: META,
  createSim: (): GameSim => new GrainlineSim(),
  createView: (): GameView => new GrainlineView(),
};

export default GrainlineModule;
