import Phaser from 'phaser';
import type { GameState, Mode } from '../../engine/types';
import { C, N, VIEW_H, VIEW_W } from '../config';
import { formatScore, getBest, practiceSeed, recordBest } from '../session';
import { button, tag, text } from '../ui/widgets';

export type GameOverData = { mode: Mode; seed: string; state: GameState; verified: boolean };

export class GameOverScene extends Phaser.Scene {
  constructor() { super('GameOver'); }

  create(data: GameOverData) {
    const st = data.state;
    const before = getBest(data.mode);
    const isBest = data.verified && recordBest(data.mode, st.score);
    const cleared = st.outcome === 'cleared';
    const last = st.summaries[st.summaries.length - 1];

    this.add.rectangle(0, 0, VIEW_W, VIEW_H, N.plum, 0.62).setOrigin(0).setInteractive();
    const w = 860, h = 1430;
    const card = this.add.container(540, -1400);
    card.add(tag(this, w, h, { twine: true }).setPosition(-w / 2, 0));
    card.add(text(this, 0, 70, cleared ? 'Hunt complete' : 'The flock got away', { size: cleared ? 84 : 70, align: 'center' }).setOrigin(0.5, 0));
    const sub = cleared
      ? 'All five rounds cleared.'
      : `Round ${last.round + 1}: ${last.hits} of 10, needed ${last.quota}.`;
    card.add(text(this, 0, 172, sub, { size: 46, font: 'hand', align: 'center' }).setOrigin(0.5, 0));

    const score = text(this, 0, 250, '0', { size: 150, color: C.cranberry, align: 'center' }).setOrigin(0.5, 0);
    card.add(score);
    this.tweens.addCounter({ from: 0, to: st.score, delay: 450, duration: 900, ease: 'Cubic.easeOut', onUpdate: (tw) => score.setText(formatScore(tw.getValue() ?? st.score)) });

    if (isBest) {
      const stamp = this.add.container(0, 470).setRotation(-0.06).setAlpha(0).setScale(2);
      const g = this.add.graphics();
      g.lineStyle(7, N.cranberry, 1); g.strokeRoundedRect(-150, -46, 300, 92, 14);
      stamp.add([g, text(this, 0, 0, 'New best', { size: 48, color: C.cranberry, align: 'center' }).setOrigin(0.5)]);
      card.add(stamp);
      this.tweens.add({ targets: stamp, alpha: 0.9, scale: 1, delay: 1400, duration: 180, ease: 'Quad.easeIn', onComplete: () => this.cameras.main.shake(120, 0.004) });
    } else if (before > 0) {
      card.add(text(this, 0, 430, `Best ${formatScore(before)}`, { size: 44, font: 'hand', align: 'center' }).setOrigin(0.5, 0));
    }

    const acc = st.stats.shots ? Math.round((st.stats.hits / st.stats.shots) * 100) : 0;
    const rows: [string, string][] = [
      ['Rounds cleared', `${st.summaries.filter((r) => r.passed).length} of 5`],
      ['Birds', `${st.stats.hits}  (${acc}% of ${st.stats.shots} arrows)`],
      ['Best combo', `${st.stats.bestStreak} in a row`],
      ['Long shots', String(st.stats.longShots)],
      ['Two or more on one arrow', String(st.stats.multiHits)],
      ['Golden turkeys', String(st.stats.goldenHits)],
      ['Shooting stars', `${st.stats.stars} of 3`],
    ];
    rows.forEach(([k, v], i) => {
      const y = 556 + i * 62;
      card.add(text(this, -w / 2 + 70, y, k, { size: 44, font: 'hand' }));
      card.add(text(this, w / 2 - 70, y, v, { size: 40, align: 'right' }).setOrigin(1, 0));
    });
    const check = data.verified ? 'Checked: a replay of your shots scores the same.' : 'Check failed: the replay disagrees, so this run won\'t count.';
    card.add(text(this, 0, 556 + rows.length * 62 + 18, check, { size: 34, font: 'hand', color: data.verified ? '#3E5A1E' : C.cranberry, align: 'center', wrap: w - 100 }).setOrigin(0.5, 0));

    const again = () => {
      this.scene.stop();
      this.scene.get('Play').scene.restart({ mode: data.mode, seed: data.mode === 'daily' ? data.seed : practiceSeed() });
    };
    const menu = () => { this.scene.stop('Play'); this.scene.start('Title'); };
    card.add(button(this, 0, h - 240, 560, 140, 'Hunt again', 'primary', again));
    this.input.keyboard?.once('keydown-ENTER', again);
    card.add(button(this, 0, h - 90, 560, 116, 'Menu', 'kraft', menu));

    card.setRotation(0.07);
    this.tweens.add({ targets: card, y: 170, duration: 600, ease: 'Back.easeOut' });
    this.tweens.add({ targets: card, rotation: 0, duration: 1400, ease: 'Elastic.easeOut', easeParams: [1.1, 0.4] });
  }
}
