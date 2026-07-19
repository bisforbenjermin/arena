/**
 * F1 — Scoring Normalizer Contract
 * The Arcade Realm
 *
 * Defines the interface for converting a game's internal rawScore into a
 * percentile rank comparable across all games. The runtime implementation
 * lives in R2. This file is the contract R2 must satisfy.
 *
 * Raw scores are game-internal units (points, milliseconds, combo count, etc.)
 * and are NOT comparable across games. A rawScore of 4200 in game A and 4200
 * in game B convey nothing about relative skill. The percentile normalizer
 * solves this: it maps every rawScore to a [0, 100] rank against the
 * historical distribution for that specific game, making all games
 * commensurable on the leaderboard.
 */

import type { GameMeta } from './game-module';

// ---------------------------------------------------------------------------
// RESULT TYPE
// ---------------------------------------------------------------------------

/**
 * The result of a normalization call.
 */
export interface NormalizedScore {
  /**
   * Percentile rank in [0, 100] against the historical distribution for
   * this game. One decimal place of precision (e.g. 73.4).
   *
   *   100 = all-time best recorded score
   *    50 = median of historical scores
   *     0 = lowest recorded score
   *
   * Do not expose rawScore in leaderboard UI. Show this value instead.
   */
  readonly percentile: number;

  /**
   * The GameMeta.id this percentile was computed against.
   * Always verify this matches the gameId you passed in before using
   * the percentile — never trust an unattributed score.
   */
  readonly gameId: string;

  /** The rawScore that was normalized. Included for full-triple logging. */
  readonly rawScore: number;

  /**
   * True if the cold-start rule was applied (fewer than MIN_SAMPLE_SIZE
   * historical rounds exist for this game). A provisional percentile is a
   * linear interpolation against the declared scoring envelope, not a real
   * rank. UI must show a "provisional" or "estimated" badge alongside it.
   */
  readonly provisional: boolean;

  /**
   * Number of historical round records used. 0 means no data existed at
   * normalization time; the cold-start rule was applied in full.
   */
  readonly sampleSize: number;
}

// ---------------------------------------------------------------------------
// CONSTANTS
// ---------------------------------------------------------------------------

/**
 * Minimum number of historical rounds required before switching from the
 * cold-start linear rule to a real distribution-based percentile.
 *
 * R2 MUST use this exported constant, not a local magic number, so the
 * threshold is visible and adjustable from one place.
 */
export const MIN_SAMPLE_SIZE = 30;

// ---------------------------------------------------------------------------
// ERROR TYPE
// ---------------------------------------------------------------------------

export type NormalizerErrorCode = 'UNKNOWN_GAME' | 'INVALID_SCORE';

/**
 * Thrown by the normalizer on unrecoverable input errors.
 * Never silently return a bogus percentile — always throw.
 */
export class NormalizerError extends Error {
  readonly code: NormalizerErrorCode;

  constructor(message: string, code: NormalizerErrorCode) {
    super(message);
    this.name = 'NormalizerError';
    this.code = code;
  }
}

// ---------------------------------------------------------------------------
// NORMALIZER FUNCTION CONTRACT
// ---------------------------------------------------------------------------

/**
 * Convert a rawScore to a percentile rank for a specific game.
 *
 * BEHAVIORAL CONTRACT (R2 must satisfy all of the following):
 *
 * --- 1. MONOTONICITY ---
 *   If GameMeta.scoringDirection === 'desc' (higher is better, the default):
 *     rawScoreA > rawScoreB  =>  normalize(gameId, rawScoreA).percentile >= normalize(gameId, rawScoreB).percentile
 *   If GameMeta.scoringDirection === 'asc' (lower is better, e.g. time-trial):
 *     rawScoreA < rawScoreB  =>  normalize(gameId, rawScoreA).percentile >= normalize(gameId, rawScoreB).percentile
 *   R2 reads scoringDirection from the registered GameMeta and inverts the
 *   distribution automatically. Callers do not need to handle this.
 *
 * --- 2. COLD-START RULE ---
 *   When sampleSize < MIN_SAMPLE_SIZE:
 *     - provisional = true
 *     - sampleSize = actual count (may be 0)
 *     - percentile is a linear interpolation against GameMeta.scoringEnvelope:
 *
 *         // For scoringDirection === 'desc':
 *         percentile = clamp(
 *           (rawScore - scoringEnvelope.min) / (scoringEnvelope.max - scoringEnvelope.min) * 100,
 *           0, 100
 *         )
 *         // Inverted for 'asc':
 *         percentile = clamp(
 *           (scoringEnvelope.max - rawScore) / (scoringEnvelope.max - scoringEnvelope.min) * 100,
 *           0, 100
 *         )
 *
 *     - This is a placeholder, not a real rank. UI MUST display a badge.
 *     - Once sampleSize reaches MIN_SAMPLE_SIZE, R2 switches to real
 *       distribution automatically and retroactively re-ranks all stored
 *       provisional entries for this game in a background job.
 *
 * --- 3. DISTRIBUTION MODEL ---
 *   R2 may use any robust non-parametric method (empirical CDF, kernel
 *   density estimation, etc.). The choice is R2's implementation detail.
 *   This contract only mandates monotonicity and the cold-start rule.
 *
 * --- 4. CACHING ---
 *   R2 may cache per-game distributions. Cache freshness and invalidation
 *   on new score ingestion are R2's responsibility. From the caller's
 *   perspective this function is synchronous (R2 pre-warms the cache).
 *
 * --- 5. ERRORS ---
 *   - Unknown gameId: throw NormalizerError with code 'UNKNOWN_GAME'.
 *   - Non-finite rawScore: throw NormalizerError with code 'INVALID_SCORE'.
 *   Never return a NormalizedScore with a semantically invalid gameId or a
 *   NaN/Infinity percentile.
 *
 * @param gameId   - GameMeta.id of the game that produced rawScore.
 * @param rawScore - The rawScore from RoundResult. Must be a finite number.
 * @returns        NormalizedScore
 * @throws         NormalizerError on unknown game or non-finite score.
 */
export type NormalizerFn = (gameId: string, rawScore: number) => NormalizedScore;

// ---------------------------------------------------------------------------
// REGISTRATION CONTRACT
// ---------------------------------------------------------------------------

/**
 * R2 must expose a registry so the runtime can register new games at startup
 * and the Factory can register generated games before testing them.
 *
 * R2's implementation of this interface is its public surface to the rest of
 * the system. All other runtime components talk to the normalizer exclusively
 * through these two methods.
 */
export interface NormalizerRegistry {
  /**
   * Register a game's metadata so its scores can be normalized.
   * Must be called before the first normalize() call for this gameId.
   * Calling register() for an already-registered gameId replaces the
   * metadata (use for hot-reloading updated meta during development only;
   * production pools are immutable).
   */
  register(meta: GameMeta): void;

  /**
   * The normalizer function. See NormalizerFn above for the full contract.
   */
  normalize: NormalizerFn;
}
