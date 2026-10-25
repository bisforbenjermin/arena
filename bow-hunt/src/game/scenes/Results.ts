import Phaser from 'phaser';
import { ARROW_LEFT_BONUS, BOWS, ROUNDS, TARGETS_PER_ROUND, TICK_HZ } from '../../engine/constants';
import type { RoundSummary } from '../../engine/types';
import { sfx } from '../audio/sfx';
import { C, N, VIEW_H, VIEW_W } from '../config';
import { formatScore } from '../session';
import { button, fit, tag, text } from '../ui/widgets';

/** choices: the two BOWS indices offered after this round, if any. onNext gets 0 (left bow) or 1 (right bow). */
export type ResultsData = { summary: RoundSummary; score: number; choices?: number[]; onNext: (pick: number) => void };

/** Round card: drops in on its twine, tallies the round, then Next round. */
export class ResultsScene extends Phaser.Scene {
  constructor() { super('Results'); }

  create(data: ResultsData) {
    const s = data.summary;
    this.add.rectangle(0, 0, VIEW_W, VIEW_H, N.plum, 0.55).setOrigin(0).setInteractive();
    const card = this.add.container(540, -700);
    const w = 860, h = data.choices ? 1240 : 900;
    card.add(tag(this, w, h, { twine: true }).setPosition(-w / 2, 0));
    card.add(fit(text(this, 0, 64, `Round ${s.round + 1} cleared`, { size: 80, align: 'center' }).setOrigin(0.5, 0), w - 120));
    card.add(text(this, 0, 172, `${ROUNDS - s.round - 1} to go`, { size: 44, font: 'hand', align: 'center' }).setOrigin(0.5, 0));

    const rows: [string, string][] = [
      ['Birds', `${s.hits} of ${TARGETS_PER_ROUND} (needed ${s.quota})`],
      ['Hit points', formatScore(s.hitPoints)],
      ['Arrows left', `${s.arrowsLeft} × ${ARROW_LEFT_BONUS} = ${formatScore(s.arrowBonus)}`],
    ];
    if (s.perfectBonus) rows.push(['Perfect round', `+${formatScore(s.perfectBonus)}`]);
    rows.forEach(([k, v], i) => {
      const y = 270 + i * 74;
      const l = text(this, -w / 2 + 70, y, k, { size: 48, font: 'hand' }).setAlpha(0);
      const r = fit(text(this, w / 2 - 70, y, v, { size: 44, align: 'right' }).setOrigin(1, 0).setAlpha(0), w / 2 + 20);
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
      onUpdate: (tw) => fit(total.setText(formatScore(tw.getValue() ?? data.score)), w / 2 + 60),
    });

    let done = false;
    const next = (pick: number) => {
      if (done) return;
      done = true;
      this.tweens.add({ targets: card, y: -1400, duration: 260, ease: 'Back.easeIn', onComplete: () => { this.scene.stop(); data.onNext(pick); } });
    };
    if (data.choices) {
      card.add(text(this, 0, lineY + 130, 'Pick your next bow', { size: 54, align: 'center' }).setOrigin(0.5, 0));
      data.choices.forEach((bowIndex, i) => card.add(this.bowTile(i === 0 ? -205 : 205, lineY + 420, bowIndex, () => next(i))));
      this.input.keyboard?.once('keydown-LEFT', () => next(0));
      this.input.keyboard?.once('keydown-ONE', () => next(0));
      this.input.keyboard?.once('keydown-RIGHT', () => next(1));
      this.input.keyboard?.once('keydown-TWO', () => next(1));
    } else {
      card.add(button(this, 0, h - 120, 520, 140, 'Next round', 'primary', () => next(0)));
      this.input.keyboard?.once('keydown-SPACE', () => next(0));
      this.input.keyboard?.once('keydown-ENTER', () => next(0));
    }

    card.setRotation(-0.08);
    this.tweens.add({ targets: card, y: 360, duration: 520, ease: 'Back.easeOut' });
    this.tweens.add({ targets: card, rotation: 0, duration: 1300, ease: 'Elastic.easeOut', easeParams: [1.1, 0.4] });
  }

  /** A tappable card for one bow: picture, name, what it's good at, and its numbers. */
  private bowTile(x: number, y: number, bowIndex: number, onPick: () => void): Phaser.GameObjects.Container {
    const b = BOWS[bowIndex];
    const tw = 370, th = 400;
    const c = this.add.container(x, y);
    const g = this.add.graphics();
    g.fillStyle(N.ink, 0.35); g.fillRoundedRect(-tw / 2 + 5, -th / 2 + 9, tw, th, 22);
    g.fillStyle(N.paper, 1); g.fillRoundedRect(-tw / 2, -th / 2, tw, th, 22);
    g.lineStyle(4, N.kraftDark, 1); g.strokeRoundedRect(-tw / 2, -th / 2, tw, th, 22);
    c.add(g);
    c.add(this.add.image(0, -100, `bow-${bowIndex}`).setRotation(-Math.PI / 2).setScale(0.55));
    c.add(fit(text(this, 0, -30, b.name, { size: 44, align: 'center' }).setOrigin(0.5, 0), tw - 30));
    c.add(text(this, 0, 26, b.blurb, { size: 36, font: 'hand', align: 'center', wrap: tw - 40 }).setOrigin(0.5, 0));
    c.add(fit(text(this, 0, 136, `${(b.drawMax / TICK_HZ).toFixed(1)} s draw, ${b.arrows} arrows`, { size: 36, font: 'hand', color: C.cranberry, align: 'center' }).setOrigin(0.5, 0), tw - 30));
    c.setSize(tw, th);
    c.setInteractive({ hitArea: new Phaser.Geom.Rectangle(0, 0, tw, th), hitAreaCallback: Phaser.Geom.Rectangle.Contains, useHandCursor: true });
    c.on('pointerdown', () => { sfx.unlock(); c.setScale(0.96); });
    c.on('pointerout', () => c.setScale(1));
    c.on('pointerup', () => { c.setScale(1); sfx.click(); onPick(); });
    return c;
  }
}
