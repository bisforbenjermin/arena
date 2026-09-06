/**
 * THE ARCADE REALM — GameModule Contract v1.0.0
 *
 * PR-2: the contract owns the loop.
 * PR-3: every GameModule ships as two halves — sim and view.
 * PR-4: every game declares contractVersion + gameVersion.
 *
 * A second engineer must be able to build a conforming game from this file alone.
 */

// ─── CONTROL SCHEME ──────────────────────────────────────────────────────────

/**
 * PR-6: `tilt` is in the enum but RESERVED and UNIMPLEMENTED at launch.
 * It must never appear in a live game_pool entry. G6 enforces this at promotion.
 */
export type ControlScheme = 'tap' | 'hold' | 'swipe' | 'tilt' | 'drag' | 'rhythm';

/** PR-6: gate check — import and use in G6 pool-eligibility logic. */
export const RESERVED_CONTROL_SCHEMES: ReadonlySet<ControlScheme> = new Set(['tilt'] as const);

// ─── META ─────────────────────────────────────────────────────────────────────

export type DifficultyCurve = 'flat' | 'ramp' | 'spike';
export type GeneratedBy = 'human' | 'agent' | 'reskin';

export interface GameMeta {
  readonly id: string;
  readonly slug: string;
  readonly title: string;
  readonly controlScheme: ControlScheme;
  /** Inclusive range: 25–60. */
  readonly durationSeconds: number;
  readonly difficultyCurve: DifficultyCurve;
  readonly themeTags: readonly string[];
  readonly generatedBy: GeneratedBy;
  /** Slug of source game if reskin or derived. */
  readonly parentLineage?: string;
  /**
   * PR-4: semver of this contract build. Pin to the version this game was authored against.
   * Mismatch between contractVersion and the runtime's expected version is a load error.
   */
  readonly contractVersion: string;
  /**
   * PR-4: semver of this game's balance. Bump on any change that affects score distribution.
   * The normalizer keys percentile distributions to (id, gameVersion) — a bump starts a
   * fresh distribution. Old scores are not migrated.
   */
  readonly gameVersion: string;
}

// ─── ROUND CONFIG ─────────────────────────────────────────────────────────────

/**
 * PR-1: seed is the sole entropy source for the entire sim.
 * The runtime derives a uint32 from this value and passes it to the PrngFactory.
 * Games MUST NOT call Math.random(), Date.now(), or performance.now() — anywhere,
 * ever. The G2 compile gate rejects any bundle containing those strings.
 */
export interface RoundConfig {
  /** uint32. Deterministic. Identical seed + identical input log = identical score. */
  readonly seed: number;
  readonly speedMultiplier: number;
  readonly themeOverride?: string;
}

// ─── GAME EVENT ───────────────────────────────────────────────────────────────

/**
 * The atomic unit of the replayable input log.
 *
 * PR-2: timestamps are expressed in sim ticks, NEVER milliseconds.
 * One tick = 1/60 second of sim time. Do not store Date.now() or performance.now() here.
 */
export interface GameEvent {
  /** Sim tick at which this event occurred. 0-indexed from round start. */
  readonly tick: number;
  /** e.g. "tap", "hold_start", "hold_end", "swipe" */
  readonly type: string;
  readonly payload?: Readonly<Record<string, unknown>>;
}

// ─── PRNG FACTORY ─────────────────────────────────────────────────────────────

/**
 * PR-1: the runtime injects this factory. Games call prng() to get the seeded function.
 * Games NEVER import sfc32 or any PRNG directly.
 *
 * Usage inside GameSim.init():
 *   const rand = prngFactory();   // seeded from RoundConfig.seed
 *   const n = rand();             // float in [0, 1)
 */
export type PrngFactory = () => () => number;

// ─── SIM HALF ─────────────────────────────────────────────────────────────────
//
// PR-3: sim is pure, headless, and DOM-free. It must run under Node with zero
// browser globals. The TypeScript signature enforces this: no HTMLElement, no
// Canvas, no window, no document. A sim that references DOM APIs will not compile
// in a Node environment.
//
// The server replays GameEvent logs through sim to produce the authoritative score.
// Client-reported rawScore is always a CLAIM. Sim replay is the verdict.

export interface GameSim {
  /**
   * Initialize sim state for a new round. Called once before the first tick().
   * Must be idempotent — calling init() again resets to a clean state.
   *
   * @param config      Round configuration. Read seed from here.
   * @param prngFactory PR-1: call prngFactory() once to get the seeded random fn.
   *                    Store the returned fn; do not call prngFactory() again.
   */
  init(config: RoundConfig, prngFactory: PrngFactory): void;

  /**
   * PR-2: advance sim state by one fixed step.
   * The runtime calls this at a constant 1/60s cadence, decoupled from render.
   * dt is always 1/60. Do not use dt for wall-clock timing — it is a sim constant,
   * not a measurement of elapsed real time.
   *
   * Wall-clock time is FORBIDDEN inside this method and anywhere in sim.
   */
  tick(dt: number): void;

  /** Current raw score. Called by the runtime after the round ends. */
  getScore(): number;

  /**
   * Full ordered input log for server-side replay.
   * PR-3: the server replays this log through a fresh sim instance to verify the score.
   * Returned array must be ordered by tick ascending.
   */
  getEventLog(): readonly GameEvent[];

  /**
   * Full teardown. After destroy():
   * - No intervals or timeouts may be running.
   * - No external references to this instance may be held.
   * - All internal state is released.
   *
   * Contract: survives 100 consecutive init→destroy cycles with flat memory.
   */
  destroy(): void;
}

// ─── VIEW HALF ────────────────────────────────────────────────────────────────
//
// PR-3: view renders and reads sim state. DOM APIs are allowed here and only here.
// view MUST NOT contain score computation or game logic.
// view reads from sim; it never mutates sim state.

export interface GameView {
  /**
   * Mount the renderer into the provided container.
   * All DOM nodes created by the view must be children of container.
   *
   * @param container The runtime-provided DOM element. Do not reach outside it.
   * @param sim       Read-only sim reference. Read state; never call mutating methods.
   */
  mount(container: HTMLElement, sim: Readonly<GameSim>): void;

  /**
   * Render one frame. Called by the runtime's render loop (rAF cadence).
   * Read from sim, write to DOM/canvas. Do not advance sim state here.
   */
  render(): void;

  /**
   * Register the score callback. The runtime provides this cb; view calls it when
   * the round ends to deliver rawScore + the event log for server verification.
   */
  onScore(cb: (rawScore: number, events: readonly GameEvent[]) => void): void;

  /**
   * Full teardown. Remove all DOM nodes and event listeners added by this view.
   * After destroy(), the container must be in the same state as before mount().
   */
  destroy(): void;
}

// ─── GAMEMODULE ───────────────────────────────────────────────────────────────
//
// This is the top-level export every game bundle must provide as its default export.
// PR-3: two factory methods, not one monolithic class.

export interface GameModule {
  readonly meta: GameMeta;

  /**
   * Returns a fresh GameSim instance with no shared state from any previous round.
   * The runtime calls this once per round, before calling sim.init().
   */
  createSim(): GameSim;

  /**
   * Returns a fresh GameView instance.
   * The runtime calls this once per round, after createSim(), before view.mount().
   */
  createView(): GameView;
}
