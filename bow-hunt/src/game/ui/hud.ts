import Phaser from 'phaser';
import { BOWS, ROUNDS, ROUND_QUOTA, STARS_FOR_BONUS, TARGETS_PER_ROUND } from '../../engine/constants';
import { comboQuarters } from '../../engine/scoring';
import type { Mode } from '../../engine/types';
import { C, DEPTH, N } from '../config';
import { PIP_FRAMES } from '../art/textures';
import { formatDay, formatScore } from '../session';
import { fit, tag, text } from './widgets';

type Pip = { img: Phaser.GameObjects.Image; state: 'pending' | 'hit' | 'gold' | 'missed' };

export class Hud {
  private scoreText: Phaser.GameObjects.Text;
  private roundText: Phaser.GameObjects.Text;
  private shownScore = 0;
  private scoreTween?: Phaser.Tweens.Tween;
  private pips: Pip[] = [];
  private quotaMark: Phaser.GameObjects.Container;
  private quiver: Phaser.GameObjects.Image[] = [];
  private quiverText: Phaser.GameObjects.Text;
  private combo: Phaser.GameObjects.Container;
  private comboText: Phaser.GameObjects.Text;
  private banner?: Phaser.GameObjects.Container;
  private stars: Phaser.GameObjects.Image[] = [];
  private bowText: Phaser.GameObjects.Text;
  private fireText: Phaser.GameObjects.Text;

  constructor(private scene: Phaser.Scene, mode: Mode) {
    const d = DEPTH.hud;
    const scoreTag = scene.add.container(40, 46).setDepth(d);
    scoreTag.add(tag(scene, 360, 158, { twine: true }));
    scoreTag.add(text(scene, 28, 40, 'Score', { size: 36, font: 'hand' }));
    this.scoreText = text(scene, 28, 72, '0', { size: 64 });
    scoreTag.add(this.scoreText);
    scoreTag.setRotation(-0.025);

    const roundTag = scene.add.container(680, 46).setDepth(d);
    roundTag.add(tag(scene, 360, 158, { twine: true }));
    this.roundText = text(scene, 180, 50, 'Round 1 of 5', { size: 40, align: 'center' }).setOrigin(0.5, 0);
    roundTag.add(this.roundText);
    roundTag.add(fit(text(scene, 180, 100, mode === 'daily' ? `Daily hunt, ${formatDay()}` : 'Practice', { size: 40, font: 'hand', align: 'center' }).setOrigin(0.5, 0), 320));
    roundTag.setRotation(0.02);

    // tally of the round's ten birds
    const y = 262, x0 = 92, dx = 70;
    for (let i = 0; i < TARGETS_PER_ROUND; i++) {
      const img = scene.add.image(x0 + i * dx, y, 'pips', PIP_FRAMES.pending).setDepth(d).setScale(1.25);
      this.pips.push({ img, state: 'pending' });
    }
    this.quotaMark = scene.add.container(0, y).setDepth(d);
    const flag = scene.add.graphics();
    flag.fillStyle(N.cranberry, 1);
    flag.fillRect(-2, -34, 4, 64);
    flag.fillTriangle(2, -34, 26, -26, 2, -18);
    this.quotaMark.add(flag);
    this.quotaMark.add(text(scene, 0, 36, '', { size: 40, font: 'hand', color: C.paper, stroke: 6, align: 'center' }).setOrigin(0.5, 0));

    // quiver, bottom left
    const most = Math.max(...BOWS.map((b) => b.arrows));
    for (let i = 0; i < most; i++) {
      this.quiver.push(scene.add.image(56 + i * 14, 1830, 'quiver-arrow').setDepth(d).setRotation(-0.12 + i * 0.012));
    }
    this.quiverText = text(scene, 56 + most * 14 + 16, 1790, '15', { size: 58, color: C.paper, stroke: 8 }).setDepth(d);

    this.bowText = text(scene, 50, 1716, '', { size: 40, font: 'hand', color: C.paper, stroke: 6 }).setDepth(d);
    this.fireText = text(scene, 50, 1662, '', { size: 40, font: 'hand', color: C.gold, stroke: 6 }).setDepth(d);

    // three stars for the star bonus, under the sound and pause buttons
    for (let i = 0; i < STARS_FOR_BONUS; i++) {
      this.stars.push(scene.add.image(860 + i * 66, 350, 'star').setScale(0.5).setAlpha(0.3).setDepth(d));
    }

    // combo, bottom right
    this.combo = scene.add.container(900, 1812).setDepth(d).setVisible(false);
    const comboTag = tag(scene, 260, 120, { hole: false, fill: N.gold });
    comboTag.setPosition(-130, -60);
    this.comboText = text(scene, 0, -2, '', { size: 46, align: 'center' }).setOrigin(0.5);
    this.combo.add([comboTag, this.comboText]);
    this.combo.setRotation(0.04);
  }

  setRound(round: number): void {
    this.roundText.setText(`Round ${round + 1} of ${ROUNDS}`);
    const q = ROUND_QUOTA[round];
    for (const p of this.pips) { p.state = 'pending'; p.img.setFrame(PIP_FRAMES.pending).setScale(1.25); }
    this.quotaMark.setX(92 + (q - 1) * 70 + 35);
    (this.quotaMark.list[1] as Phaser.GameObjects.Text).setText(`${q} to pass`);
  }

  setScore(score: number): void {
    this.scoreTween?.stop();
    const from = this.shownScore;
    this.scoreTween = this.scene.tweens.addCounter({
      from, to: score, duration: 380, ease: 'Cubic.easeOut',
      onUpdate: (tw) => { this.shownScore = tw.getValue() ?? score; fit(this.scoreText.setText(formatScore(this.shownScore)), 300); },
    });
    
  }

  markHit(golden: boolean): void {
    const p = this.pips.find((x) => x.state === 'pending');
    if (!p) return;
    p.state = golden ? 'gold' : 'hit';
    p.img.setFrame(golden ? PIP_FRAMES.gold : PIP_FRAMES.hit);
    this.scene.tweens.add({ targets: p.img, scale: 1.8, duration: 110, yoyo: true, ease: 'Quad.easeOut' });
  }

  markMissed(): void {
    const p = this.pips.find((x) => x.state === 'pending');
    if (!p) return;
    p.state = 'missed';
    p.img.setFrame(PIP_FRAMES.missed);
  }

  /** Any birds that never flew this round (quiver ran dry) count as missed. */
  missRemaining(): void {
    for (const p of this.pips) if (p.state === 'pending') { p.state = 'missed'; p.img.setFrame(PIP_FRAMES.missed); }
  }

  setStars(n: number): void {
    this.stars.forEach((img, i) => {
      if (i < n && img.alpha < 1) {
        img.setAlpha(1);
        this.scene.tweens.add({ targets: img, scale: 0.85, angle: 144, duration: 260, yoyo: true, ease: 'Back.easeOut' });
      }
    });
  }

  setFire(shots: number): void {
    this.fireText.setText(shots > 0 ? `Fire arrows: ${shots}` : '');
  }

  setBow(name: string): void {
    this.bowText.setText(name);
  }

  /** `total` is this bow's quiver size; slots past it are hidden. */
  setArrows(left: number, total = 15): void {
    this.quiver.forEach((img, i) => img.setVisible(i < total).setAlpha(i < left ? 1 : 0.18));
    this.quiverText.setText(String(left)).setColor(left <= 3 ? C.gold : C.paper);
  }

  setStreak(streak: number): void {
    if (streak < 2) { this.combo.setVisible(false); return; }
    const q = comboQuarters(streak);
    const mult = (q / 4).toFixed(2).replace(/0$/, '').replace(/\.0$/, '');
    fit(this.comboText.setText(`Combo ×${mult}`), 230);
    this.combo.setVisible(true).setScale(0.7);
    this.scene.tweens.add({ targets: this.combo, scale: 1, duration: 220, ease: 'Back.easeOut' });
  }

  /** The round card that drops in during the intro. */
  showBanner(round: number): void {
    this.banner?.destroy();
    const c = this.scene.add.container(540, 760).setDepth(DEPTH.popups);
    c.add(text(this.scene, 0, 0, `Round ${round + 1}`, { size: 150, color: C.paper, stroke: 14, align: 'center' }).setOrigin(0.5));
    c.add(text(this.scene, 0, 130, `Hit ${ROUND_QUOTA[round]} of ${TARGETS_PER_ROUND} to move on`, { size: 54, font: 'hand', color: C.paper, stroke: 7, align: 'center' }).setOrigin(0.5));
    c.setAlpha(0).setScale(0.8).setRotation(-0.04);
    this.scene.tweens.add({ targets: c, alpha: 1, scale: 1, duration: 260, ease: 'Back.easeOut' });
    this.scene.tweens.add({ targets: c, alpha: 0, y: 700, delay: 1150, duration: 300, onComplete: () => c.destroy() });
    this.banner = c;
  }

  notice(s: string): void {
    const t = fit(text(this.scene, 540, 1420, s, { size: 60, font: 'hand', color: C.paper, stroke: 8, align: 'center' }).setOrigin(0.5).setDepth(DEPTH.popups).setAlpha(0), 980);
    this.scene.tweens.add({ targets: t, alpha: 1, duration: 200, yoyo: true, hold: 1200, onComplete: () => t.destroy() });
  }
}
