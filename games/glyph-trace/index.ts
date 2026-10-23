/**
 * GLYPH TRACE — 60-second trace-the-shape reflex game
 * Control scheme: drag | Difficulty: ramp | Duration: 60 s
 *
 * The seed fixes a sequence of connect-the-dots glyphs (3–7 nodes). Put a finger
 * on the first node and trace through the rest in order. Each glyph scores
 * accuracy (0–100, from how far the path strays from the lines) plus a speed bonus
 * of up to 50 for finishing within 1.5 s of touching down. Lifting the finger
 * mid-glyph restarts that glyph. A glyph not finished within 4 s is missed and
 * scores 0; play continues, so every round is exactly 60 s (compatible with
 * PROPOSED FORMAT-1). Glyphs get longer as the round goes on.
 *
 * PR-1  every glyph is drawn from the injected prngFactory in init()
 * PR-2  tick-based timing only
 * PR-3  GlyphTraceSim is DOM-free; geometry uses integers and an integer square root
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

export const W = 400;
export const H = 600;
export const TOTAL_TICKS = 3600;
/** One glyph per 15-tick gap is the fastest possible pace, so 240 always outlasts the round. */
export const GLYPH_COUNT = 240;
export const NODE_R = 36;
export const WINDOW_TICKS = 240;
export const GAP_TICKS = 15;
export const FAST_TICKS = 90;
const SPEED_BONUS = 50;
const FIELD = { minX: 40, maxX: W - 40, minY: 90, maxY: H - 40 } as const;

/** 16 compass directions as integer unit vectors × 1000. */
const DIRS: readonly (readonly [number, number])[] = [
  [1000, 0], [924, 383], [707, 707], [383, 924], [0, 1000], [-383, 924], [-707, 707], [-924, 383],
  [-1000, 0], [-924, -383], [-707, -707], [-383, -924], [0, -1000], [383, -924], [707, -707], [924, -383],
];

/**
 * PR-8 (PROPOSED): higher is better. 150 per glyph × 240 glyphs is the theoretical ceiling;
 * a strong human finishes roughly 30–40 glyphs.
 */
export const SCORE_RANGE = { min: 0, max: 36000 } as const;

export type Pt = { readonly x: number; readonly y: number };

export function isqrt(n: number): number {
  if (n < 2) return n;
  let x = n, y = Math.floor((x + 1) / 2);
  while (y < x) { x = y; y = Math.floor((x + Math.floor(n / x)) / 2); }
  return x;
}

/** Integer distance from p to the segment a–b (floored). */
export function segDist(p: Pt, a: Pt, b: Pt): number {
  const abx = b.x - a.x, aby = b.y - a.y;
  const apx = p.x - a.x, apy = p.y - a.y;
  const ab2 = abx * abx + aby * aby;
  const dot = apx * abx + apy * aby;
  if (ab2 === 0 || dot <= 0) return isqrt(apx * apx + apy * apy);
  if (dot >= ab2) {
    const bpx = p.x - b.x, bpy = p.y - b.y;
    return isqrt(bpx * bpx + bpy * bpy);
  }
  const cross = apx * aby - apy * abx;
  return isqrt(Math.floor((cross * cross) / ab2));
}

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

export type GlyphResult = { readonly glyph: number; readonly points: number; readonly accuracy: number; readonly bonus: number } | { readonly glyph: number; readonly miss: true };

export interface GlyphTraceState {
  readonly tick: number;
  readonly glyphIndex: number;
  readonly glyphStart: number;
  readonly phase: 'show' | 'gap';
  readonly gapLeft: number;
  readonly tracing: boolean;
  readonly nextNode: number;
  readonly devSum: number;
  readonly devCount: number;
  readonly traceStart: number;
  readonly last: Pt | null;
  readonly score: number;
  readonly completed: number;
  readonly misses: number;
  readonly lastResult: GlyphResult | null;
  readonly done: boolean;
}

// ─── SIM ──────────────────────────────────────────────────────────────────────

export class GlyphTraceSim implements GameSim {
  private glyphs_: Pt[][] = [];
  private events_: GameEvent[] = [];
  private s_: GlyphTraceState = GlyphTraceSim.blank();

  private static blank(): GlyphTraceState {
    return {
      tick: 0, glyphIndex: 0, glyphStart: 0, phase: 'show', gapLeft: 0, tracing: false, nextNode: 0,
      devSum: 0, devCount: 0, traceStart: 0, last: null, score: 0, completed: 0, misses: 0, lastResult: null, done: false,
    };
  }

  init(_config: RoundConfig, prngFactory: PrngFactory): void {
    const rand = prngFactory();
    for (let i = 0; i < 12; i++) rand(); // sfc32 warm-up: early draws barely depend on small seeds
    this.glyphs_ = [];
    for (let g = 0; g < GLYPH_COUNT; g++) {
      const maxExtra = Math.min(4, 1 + Math.floor(g / 6)); // 3–4 nodes early, up to 7 later
      const n = 3 + Math.floor(rand() * (maxExtra + 1));
      const nodes: Pt[] = [{
        x: FIELD.minX + 20 + Math.floor(rand() * (FIELD.maxX - FIELD.minX - 39)),
        y: FIELD.minY + 30 + Math.floor(rand() * (FIELD.maxY - FIELD.minY - 59)),
      }];
      for (let k = 1; k < n; k++) {
        const prev = nodes[k - 1];
        let d = Math.floor(rand() * 16);
        const len = 90 + Math.floor(rand() * 71);
        let best: Pt | null = null;
        let bestScore = -1;
        // Try up to 4 headings; keep the in-bounds one farthest from earlier nodes.
        for (let attempt = 0; attempt < 4; attempt++) {
          const x = prev.x + Math.trunc((DIRS[d][0] * len) / 1000);
          const y = prev.y + Math.trunc((DIRS[d][1] * len) / 1000);
          const inside = x >= FIELD.minX && x <= FIELD.maxX && y >= FIELD.minY && y <= FIELD.maxY;
          const cand = { x: clamp(x, FIELD.minX, FIELD.maxX), y: clamp(y, FIELD.minY, FIELD.maxY) };
          let nearest = 1e9;
          for (let j = 0; j < k - 1; j++) {
            const dx = nodes[j].x - cand.x, dy = nodes[j].y - cand.y;
            nearest = Math.min(nearest, dx * dx + dy * dy);
          }
          const score = (inside ? 1e10 : 0) + Math.min(nearest, 1e9);
          if (score > bestScore) { bestScore = score; best = cand; }
          d = (d + 5) % 16;
        }
        nodes.push(best!);
      }
      this.glyphs_.push(nodes);
    }
    this.events_ = [];
    this.s_ = GlyphTraceSim.blank();
  }

  currentGlyph(): readonly Pt[] { return this.glyphs_[this.s_.glyphIndex] ?? []; }

  private finishGlyph(s: GlyphTraceState, result: GlyphResult, points: number): GlyphTraceState {
    return {
      ...s, phase: 'gap', gapLeft: GAP_TICKS, tracing: false, nextNode: 0, last: null,
      score: s.score + points, lastResult: result,
      completed: s.completed + ('miss' in result ? 0 : 1), misses: s.misses + ('miss' in result ? 1 : 0),
    };
  }

  /** PR-7 (PROPOSED) input path: 'trace_start' | 'trace_move' {x,y} | 'trace_end'. */
  input(event: GameEvent): void {
    const s = this.s_;
    if (s.done || s.phase !== 'show') return;
    const nodes = this.currentGlyph();
    if (event.type === 'trace_end') {
      if (!s.tracing) return;
      this.s_ = { ...s, tracing: false, nextNode: 0, last: null };
      this.events_.push({ tick: s.tick, type: 'trace_end' });
      return;
    }
    const x = event.payload?.x, y = event.payload?.y;
    if (!Number.isInteger(x) || !Number.isInteger(y)) return;
    const p: Pt = { x: clamp(x as number, 0, W), y: clamp(y as number, 0, H) };

    if (event.type === 'trace_start') {
      if (s.tracing) return;
      if (segDist(p, nodes[0], nodes[0]) > NODE_R) return;
      this.s_ = { ...s, tracing: true, nextNode: 1, devSum: 0, devCount: 0, traceStart: s.tick, last: p };
      this.events_.push({ tick: s.tick, type: 'trace_start', payload: { x: p.x, y: p.y } });
      return;
    }
    if (event.type !== 'trace_move' || !s.tracing || !s.last) return;

    let next = s.nextNode;
    const dev = segDist(p, nodes[next - 1], nodes[next]);
    let st: GlyphTraceState = { ...s, devSum: s.devSum + dev, devCount: s.devCount + 1, last: p };
    this.events_.push({ tick: s.tick, type: 'trace_move', payload: { x: p.x, y: p.y } });
    // A fast swipe can pass through several nodes between samples.
    let from = s.last;
    while (next < nodes.length && segDist(nodes[next], from, p) <= NODE_R) {
      from = nodes[next];
      next += 1;
    }
    st = { ...st, nextNode: next };
    if (next >= nodes.length) {
      const avgDev = Math.floor(st.devSum / Math.max(1, st.devCount));
      const accuracy = clamp(100 - Math.floor((avgDev * 100) / NODE_R), 0, 100);
      const elapsed = s.tick - s.traceStart;
      const bonus = elapsed < FAST_TICKS ? Math.floor(((FAST_TICKS - elapsed) * SPEED_BONUS) / FAST_TICKS) : 0;
      st = this.finishGlyph(st, { glyph: s.glyphIndex, points: accuracy + bonus, accuracy, bonus }, accuracy + bonus);
    }
    this.s_ = st;
  }

  touch(x: number, y: number): void { this.input({ tick: this.s_.tick, type: 'trace_start', payload: { x, y } }); }
  drag(x: number, y: number): void { this.input({ tick: this.s_.tick, type: 'trace_move', payload: { x, y } }); }
  lift(): void { this.input({ tick: this.s_.tick, type: 'trace_end' }); }

  tick(_dt: number): void {
    let s = this.s_;
    if (s.done) return;
    const tick = s.tick + 1;
    s = { ...s, tick };
    if (s.phase === 'show' && tick - s.glyphStart >= WINDOW_TICKS) {
      s = this.finishGlyph(s, { glyph: s.glyphIndex, miss: true }, 0);
    } else if (s.phase === 'gap') {
      const gapLeft = s.gapLeft - 1;
      s = gapLeft <= 0
        ? { ...s, phase: 'show', gapLeft: 0, glyphIndex: s.glyphIndex + 1, glyphStart: tick }
        : { ...s, gapLeft };
    }
    this.s_ = { ...s, done: tick >= TOTAL_TICKS || s.glyphIndex >= this.glyphs_.length };
  }

  getState(): GlyphTraceState { return this.s_; }
  getCurrentTick(): number { return this.s_.tick; }
  isDone(): boolean { return this.s_.done; }
  getScore(): number { return this.s_.score; }
  getEventLog(): readonly GameEvent[] { return this.events_; }

  destroy(): void {
    this.glyphs_ = [];
    this.events_ = [];
    this.s_ = GlyphTraceSim.blank();
  }
}

// ─── VIEW ─────────────────────────────────────────────────────────────────────

export class GlyphTraceView implements GameView {
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private sim_: GlyphTraceSim | null = null;
  private scoreCb_: ((rawScore: number, events: readonly GameEvent[]) => void) | null = null;
  private fired_ = false;
  private trail_: Pt[] = [];
  private trailGlyph_ = -1;
  private pending_: Pt | null = null;

  mount(container: HTMLElement, sim: Readonly<GameSim>): void {
    this.sim_ = sim as GlyphTraceSim;
    const canvas = document.createElement('canvas');
    canvas.width = W;
    canvas.height = H;
    canvas.style.cssText = 'display:block;width:100%;max-width:420px;margin:0 auto;height:auto;aspect-ratio:2/3;touch-action:none;border-radius:12px;';
    container.appendChild(canvas);
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');

    const pt = (e: PointerEvent): Pt => {
      const r = canvas.getBoundingClientRect();
      return { x: Math.round(((e.clientX - r.left) * W) / r.width), y: Math.round(((e.clientY - r.top) * H) / r.height) };
    };
    canvas.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      canvas.setPointerCapture?.(e.pointerId);
      const p = pt(e);
      this.trail_ = [p];
      this.sim_?.touch(p.x, p.y);
    });
    // Moves are coalesced to one input per frame; render() flushes the latest point.
    canvas.addEventListener('pointermove', (e) => {
      if (!this.sim_?.getState().tracing) return;
      this.pending_ = pt(e);
    });
    const up = () => {
      this.flush();
      this.sim_?.lift();
      this.trail_ = [];
    };
    canvas.addEventListener('pointerup', up);
    canvas.addEventListener('pointercancel', up);
  }

  private flush(): void {
    const p = this.pending_;
    this.pending_ = null;
    if (!p || !this.sim_) return;
    this.trail_.push(p);
    this.sim_.drag(p.x, p.y);
  }

  render(): void {
    const sim = this.sim_;
    const ctx = this.ctx;
    if (!sim) return;
    this.flush();
    const s = sim.getState();
    if (s.done && !this.fired_ && this.scoreCb_) {
      this.fired_ = true;
      this.scoreCb_(sim.getScore(), sim.getEventLog());
    }
    if (!ctx) return;
    if (this.trailGlyph_ !== s.glyphIndex || s.phase === 'gap') {
      if (this.trailGlyph_ !== s.glyphIndex) this.trail_ = [];
      this.trailGlyph_ = s.glyphIndex;
    }

    ctx.fillStyle = '#0b1020';
    ctx.fillRect(0, 0, W, H);

    // HUD
    ctx.fillStyle = '#e9ecf5';
    ctx.font = 'bold 20px system-ui, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(`${s.score}`, 16, 34);
    ctx.textAlign = 'right';
    ctx.fillText(`${Math.max(0, Math.ceil((TOTAL_TICKS - s.tick) / 60))}s`, W - 16, 34);
    ctx.textAlign = 'center';
    const r = s.lastResult;
    if (r && (s.phase === 'gap' || s.tick - s.glyphStart < 40)) {
      ctx.fillStyle = 'miss' in r ? '#ff8787' : '#8ce99a';
      ctx.fillText('miss' in r ? 'Missed' : `+${r.points}  (${r.accuracy}% · +${r.bonus} speed)`, W / 2, 66);
    }

    if (s.phase === 'show') {
      const nodes = sim.currentGlyph();
      // Window timer ring
      const left = 1 - (s.tick - s.glyphStart) / WINDOW_TICKS;
      ctx.fillStyle = '#20283f';
      ctx.fillRect(16, 76, W - 32, 4);
      ctx.fillStyle = left < 0.3 ? '#ff8787' : '#74c0fc';
      ctx.fillRect(16, 76, (W - 32) * Math.max(0, left), 4);
      // Lines
      ctx.lineWidth = 10;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.strokeStyle = '#26314f';
      ctx.beginPath();
      nodes.forEach((n, i) => (i === 0 ? ctx.moveTo(n.x, n.y) : ctx.lineTo(n.x, n.y)));
      ctx.stroke();
      // Nodes
      nodes.forEach((n, i) => {
        const hit = s.tracing && i < s.nextNode;
        ctx.fillStyle = hit ? '#74c0fc' : i === 0 ? '#ffd43b' : '#3b4a74';
        ctx.beginPath();
        ctx.arc(n.x, n.y, i === 0 ? 16 : 12, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#0b1020';
        ctx.font = 'bold 12px system-ui, sans-serif';
        ctx.fillText(String(i + 1), n.x, n.y + 4);
      });
      // Finger trail
      if (this.trail_.length > 1) {
        ctx.strokeStyle = 'rgba(116, 192, 252, 0.8)';
        ctx.lineWidth = 4;
        ctx.beginPath();
        this.trail_.forEach((p, i) => (i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)));
        ctx.stroke();
      }
      if (s.glyphIndex === 0 && !s.tracing) {
        ctx.fillStyle = '#adb5bd';
        ctx.font = '14px system-ui, sans-serif';
        ctx.fillText('Start on the yellow dot and trace in order', W / 2, H - 16);
      }
    }
    ctx.textAlign = 'start';
  }

  onScore(cb: (rawScore: number, events: readonly GameEvent[]) => void): void {
    this.scoreCb_ = cb;
  }

  destroy(): void {
    this.canvas?.remove();
    this.canvas = null;
    this.ctx = null;
    this.sim_ = null;
    this.scoreCb_ = null;
    this.fired_ = false;
    this.trail_ = [];
    this.pending_ = null;
  }
}

// ─── MODULE ───────────────────────────────────────────────────────────────────

const META: GameMeta = {
  id: 'glyph-trace',
  slug: 'glyph-trace',
  title: 'Glyph Trace',
  controlScheme: 'drag',
  durationSeconds: 60,
  difficultyCurve: 'ramp',
  themeTags: ['reflex', 'accuracy', 'tracing'],
  generatedBy: 'human',
  contractVersion: '1.0.0',
  gameVersion: '1.0.0',
};

const GlyphTraceModule: GameModule = {
  meta: META,
  createSim: (): GameSim => new GlyphTraceSim(),
  createView: (): GameView => new GlyphTraceView(),
};

export default GlyphTraceModule;
