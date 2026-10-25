import Phaser from 'phaser';
import { ARROW_LEFT_BONUS, ROUNDS, TARGETS_PER_ROUND } from '../../engine/constants';
import type { RoundSummary } from '../../engine/types';
import { sfx } from '../audio/sfx';
import { C, N, VIEW_H, VIEW_W } from '../config';
import { formatScore } from '../session';
import { button, tag, text } from '../ui/widgets';

export type ResultsData = { summary: RoundSummary; score: number; upgrade?: string; onNext: () => void };

/** Round card: drops in on its twine, tallies the round, then Next round. */
export class ResultsScene extends Phaser.Scene {
  constructor() { super('Results'); }

  create(data: ResultsData) {
    const s = data.summary;
    this.add.rectangle(0, 0, VIEW_W, VIEW_H, N.plum, 0.55).setOrigin(0).setInteractive();
    const card = this.add.container(540, -700);
    const w = 820, h = data.upgrade ? 1010 : 900;
    card.add(tag(this, w, h, { twine: true }).setPosition(-w / 2, 0));
    card.add(text(this, 0, 70, `Round ${s.round + 1} cleared`, { size: 80, align: 'center' }).setOrigin(0.5, 0));
    card.add(text(this, 0, 168, `${ROUNDS - s.round - 1} to go`, { size: 44, font: 'hand', align: 'center' }).setOrigin(0.5, 0));

    const rows: [string, string][] = [
      ['Birds', `${s.hits} of ${TARGETS_PER_ROUND}  (needed ${s.quota})`],
      ['Hit points', formatScore(s.hitPoints)],
      ['Arrows left', `${s.arrowsLeft} × ${ARROW_LEFT_BONUS} = ${formatScore(s.arrowBonus)}`],
    ];
    if (s.perfectBonus) rows.push(['Perfect round', `+${formatScore(s.perfectBonus)}`]);
    rows.forEach(([k, v], i) => {
      const y = 270 + i * 74;
      const l = text(this, -w / 2 + 70, y, k, { size: 48, font: 'hand' }).setAlpha(0);
      const r = text(this, w / 2 - 70, y, v, { size: 44, align: 'right' }).setOrigin(1, 0).setAlpha(0);
      card.add([l, r]);
      this.tweens.add({ targets: [l, r], alpha: 1, delay: 520 + i * 160, duration: 160, onStart: () => sfx.tick() });
    });
    const lineY = 270 + rows.length * 74 + 16;
    const rule = this.add.graphics();
    rule.lineStyle(3, N.kraftDark, 1);
    rule.lineBetween(-w / 2 + 60, lineY, w / 2 - 60, lineY);
    card.add(rule);
    card.add(text(this, -w / 2 + 70, lineY + 24, 'Total', { size: 52, font: 'hand' }));
    const total = text(this, w / 2 - 70, lineY + 14, '0', { size: 76, color: C.cranberry, align: 'right' }).setOrigin(1, 0);
    card.add(total);
    this.tweens.addCounter({
      from: Math.max(0, data.score - s.hitPoints - s.arrowBonus - s.perfectBonus), to: data.score,
      delay: 520 + rows.length * 160, duration: 600, ease: 'Cubic.easeOut',
      onUpdate: (tw) => total.setText(formatScore(tw.getValue() ?? data.score)),
    });

    let done = false;
    const next = () => {
      if (done) return;
      done = true;
      this.tweens.add({ targets: card, y: -1000, duration: 260, ease: 'Back.easeIn', onComplete: () => { this.scene.stop(); data.onNext(); } });
    };
    if (data.upgrade) {
      const up = text(this, 0, h - 250, `New bow: ${data.upgrade}. Faster draw, flatter shots.`, { size: 40, font: 'hand', color: C.cranberry, align: 'center', wrap: w - 100 }).setOrigin(0.5).setAlpha(0).setScale(1.3);
      card.add(up);
      this.tweens.add({ targets: up, alpha: 1, scale: 1, delay: 1400, duration: 260, ease: 'Back.easeOut', onStart: () => sfx.multi(3) });
    }
    card.add(button(this, 0, h - 120, 520, 140, 'Next round', 'primary', next));
    this.input.keyboard?.once('keydown-SPACE', next);
    this.input.keyboard?.once('keydown-ENTER', next);

    card.setRotation(-0.08);
    this.tweens.add({ targets: card, y: 360, duration: 520, ease: 'Back.easeOut' });
    this.tweens.add({ targets: card, rotation: 0, duration: 1300, ease: 'Elastic.easeOut', easeParams: [1.1, 0.4] });
  }
}
