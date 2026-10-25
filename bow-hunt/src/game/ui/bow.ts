import Phaser from 'phaser';
import { BOWS, BOW_X, BOW_Y, DRAW_MIN_TICKS, MILLI } from '../../engine/constants';
import { previewPath } from '../../engine/preview';
import { BOW_TIP } from '../art/props';
import { DEPTH, N, S } from '../config';
import type { Aim } from '../input';

const MAX_PULL = 72;
const ARROW_LEN = 98;
const REST_TIP = BOW_TIP.x + ARROW_LEN;

/** The bow on its knoll: turns with the aim, string pulls back with draw time, power ring fills around it. */
export class BowView {
  private root: Phaser.GameObjects.Container;
  private string: Phaser.GameObjects.Graphics;
  private nocked: Phaser.GameObjects.Image;
  private ring: Phaser.GameObjects.Graphics;
  private guide: Phaser.GameObjects.Graphics;
  private angle = 0;
  private tier = 0;
  private bowImg: Phaser.GameObjects.Image;

  constructor(private scene: Phaser.Scene, private showGuide: boolean) {
    const x = BOW_X * S, y = BOW_Y * S;
    this.ring = scene.add.graphics().setPosition(x, y).setDepth(DEPTH.bow);
    this.guide = scene.add.graphics().setDepth(DEPTH.fx);
    this.root = scene.add.container(x, y).setDepth(DEPTH.bow);
    this.string = scene.add.graphics();
    this.nocked = scene.add.image(REST_TIP, 0, 'arrow').setOrigin((104 - 2) / 104, 0.5);
    this.bowImg = scene.add.image(0, 0, 'bow-0');
    this.root.add([this.string, this.bowImg, this.nocked]);
    this.update({ aimX: BOW_X, aimY: 0, angle: 0 }, 0, true, false);
  }

  /** Swaps in the chosen bow (index into BOWS). */
  setBow(i: number): void {
    this.tier = i;
    this.bowImg.setTexture(`bow-${i}`);
  }

  /** `draw` is the engine's draw ticks; `armed` is false when the quiver is empty. */
  update(aim: Aim, draw: number, armed: boolean, drawing: boolean): void {
    // ease toward the aim so the bow doesn't jitter under a thumb
    this.angle += (aim.angle - this.angle) * 0.6;
    this.root.setRotation(this.angle - Math.PI / 2);
    const drawMax = BOWS[this.tier].drawMax;
    const p = Math.min(draw, drawMax) / drawMax;
    const pull = MAX_PULL * Math.sin(p * Math.PI / 2);
    const nockX = BOW_TIP.x - (armed ? pull : 0);
    this.string.clear();
    this.string.lineStyle(4, 0xf3e7cf, 1);
    this.string.beginPath();
    this.string.moveTo(BOW_TIP.x, -BOW_TIP.y);
    this.string.lineTo(nockX, 0);
    this.string.lineTo(BOW_TIP.x, BOW_TIP.y);
    this.string.strokePath();
    this.nocked.setVisible(armed).setX(REST_TIP - pull);

    this.ring.clear();
    if (drawing && armed && draw > 0) {
      const ready = draw >= DRAW_MIN_TICKS;
      const full = draw >= drawMax;
      const col = full ? N.gold : ready ? N.cranberry : N.paper;
      const start = this.angle - Math.PI / 2 + Math.PI * 0.62;
      this.ring.lineStyle(14, N.ink, 0.45);
      this.ring.beginPath(); this.ring.arc(0, 0, 150, start, start + Math.PI * 0.76); this.ring.strokePath();
      this.ring.lineStyle(10, col, full ? 1 : 0.9);
      this.ring.beginPath(); this.ring.arc(0, 0, 150, start, start + Math.PI * 0.76 * p); this.ring.strokePath();
    }

    this.guide.clear();
    if (this.showGuide && drawing && armed) {
      // dotted arc on a dark halo so it reads against both the bright horizon and the night sky
      const pts = previewPath(draw, aim.aimX, aim.aimY, 70, 2, this.tier).slice(1);
      pts.forEach((pt, i) => {
        const fade = 1 - i / pts.length;
        const x = pt.x / MILLI * S, y = pt.y / MILLI * S, r = 5 + 5 * fade;
        this.guide.fillStyle(N.ink, 0.35 * fade);
        this.guide.fillCircle(x, y, r + 3);
        this.guide.fillStyle(N.paper, 0.35 + 0.6 * fade);
        this.guide.fillCircle(x, y, r);
      });
    }
  }

  /** Upgrade flourish: the bow pops and glints. */
  celebrate(): void {
    this.root.setScale(0.6);
    this.scene.tweens.add({ targets: this.root, scale: 1, duration: 520, ease: 'Back.easeOut' });
  }

  kick(): void {
    this.scene.tweens.add({ targets: this.root, scale: 1.08, duration: 60, yoyo: true });
  }
}
