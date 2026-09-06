/**
 * THE ARCADE REALM — Scoring Normalizer Contract
 *
 * This file defines the normalizer signature and cold-start rule.
 * Runtime implementation lives in R2. This contract is what F1, G6, and R3 build against.
 */

// ─── COLD-START CONSTANTS (PR-5) ──────────────────────────────────────────────

/**
 * PR-5: REVERSIBLE — undo cost is one constant change, under an hour.
 * A new game is NON-RANKING until both thresholds are met by real (non-bot) scores.
 */
export const COLD_START_MIN_SCORES = 200;
export const COLD_START_MIN_PLAYERS = 30;

// ─── NORMALIZER RETURN TYPE (PR-5) ────────────────────────────────────────────

/**
 * PR-5: the non-ranking state is EXPLICIT in the return type — not a magic value.
 * Callers must handle both branches. There is no -1, null, or undefined sentinel.
 *
 * 'ranked'      — game has cleared both cold-start thresholds. percentile is 0–100.
 * 'non-ranking' — game is playable but scores do not affect rank or eligibility.
 *
 * Bot-derived priors (G3) may feed on-screen feedback only. They never contribute
 * to cold-start threshold counts and never produce a 'ranked' result.
 */
export type NormalizerResult =
  | { readonly status: 'ranked'; readonly percentile: number }
  | { readonly status: 'non-ranking'; readonly reason: 'cold-start' };

// ─── NORMALIZER SIGNATURE ─────────────────────────────────────────────────────

/**
 * PR-4: distributions are keyed to (gameId, gameVersion).
 * A gameVersion bump starts a FRESH distribution — historical scores from prior
 * versions are not carried forward and do not contribute to the new baseline.
 * This is what makes balance changes safe: a difficulty tweak cannot silently
 * re-baseline historical percentiles, because it must bump gameVersion first.
 *
 * PR-5: if the (gameId, gameVersion) bucket contains fewer than
 * COLD_START_MIN_SCORES real scores across fewer than COLD_START_MIN_PLAYERS
 * distinct players, return { status: 'non-ranking', reason: 'cold-start' }.
 *
 * R2 implements this signature. R3 and G6 consume the return type.
 *
 * @param gameId      Stable game identifier (matches GameMeta.id).
 * @param gameVersion Semver from GameMeta.gameVersion. Distribution key.
 * @param rawScore    Client-reported score — treated as input, not ground truth.
 *                    R2 must use the server-replayed score, per PR-3.
 */
export type ScoreNormalizer = (
  gameId: string,
  gameVersion: string,
  rawScore: number,
) => NormalizerResult;
