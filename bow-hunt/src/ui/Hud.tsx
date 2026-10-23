import { ROUND_QUOTA } from '../engine/constants';
import { currentRound } from '../engine/sim';
import type { GameState } from '../engine/types';

export function Hud({ s }: { s: GameState }) {
  const r = currentRound(s);
  return (
    <div className="hud">
      <span data-testid="hud-round">{`Round ${r + 1}/5`}</span>
      <span data-testid="hud-score">{`Score ${s.score}`}</span>
      <span data-testid="hud-arrows">{`Arrows ${s.arrowsLeft}`}</span>
      <span data-testid="hud-hits">{`Hits ${s.roundHits}/${ROUND_QUOTA[r]}`}</span>
    </div>
  );
}
