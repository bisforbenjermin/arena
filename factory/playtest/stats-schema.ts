/**
 * G3 — per-candidate stats record.
 *
 * Shape anchors on .claude/skills/arena-forge/assets/skill-evidence.example.json
 * (the forge BUILD canon record). Extras required by G3 spec — completionRate
 * and frameStability — are added here and mirrored into the forge example asset.
 * See governance/00-COMMAND/FRICTION_LOG.md for the record of that extension.
 *
 * FORMAT-1 point 2 (higher raw score is better) orients every mean/sd/min/max
 * and the keep/reject gates below: a game is rejected when random ≈ expert.
 */

export interface BotStats {
  description: string;
  mean: number;
  sd: number;
  min: number;
  max: number;
}

export interface SkillEvidence {
  gameId: string;
  gameVersion: string;
  generatedAt: string;
  kind: 'measured' | 'forecast';
  note?: string;
  rerun?: string;
  seeds: { from: number; to: number; count: number };
  reactionLimitTicks: number;
  bots: {
    random: BotStats;
    greedy: BotStats;
    expert: BotStats;
  };
  seedConsistency: { expertCoefficientOfVariation: number };
  bars: {
    source: string;
    randomAtMostHalfOfExpert: boolean;
    greedyBetween: boolean;
    expertVariationAtMost15Percent: boolean;
  };
  /** G3 extensions beyond the forge asset */
  completionRate: {
    random: number;
    greedy: number;
    expert: number;
  };
  frameStability: {
    maxTickMs: number;
    overBudgetTickCount: number;
    budgetMs: number;
  };
  skillGradient: number;
  verdict: 'KEEP' | 'REJECT';
  rejectReason?: string;
}
