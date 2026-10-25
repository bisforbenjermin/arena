import Phaser from 'phaser';
import type { Mode } from '../../engine/types';
import { sfx } from '../audio/sfx';
import { SPECIES_LIST } from '../art/textures';
import { C, DEPTH, VIEW_W } from '../config';
import { buildBackdrop } from '../ui/backdrop';
import { button, drawSpeaker, iconButton, text } from '../ui/widgets';
import { dailySeed, formatScore, getBest, getMuted, practiceSeed, setMuted } from '../session';

export class TitleScene extends Phaser.Scene {
  constructor() { super('Title'); }

  create() {
    buildBackdrop(this);
    this.flyBy();

    const title = this.add.container(540, 470).setDepth(DEPTH.hud).setRotation(-0.05);
    title.add(text(this, 0, 0, 'Bow Hunt', { size: 196, color: C.paper, stroke: 18, align: 'center' }).setOrigin(0.5));
    title.add(text(this, 10, 150, 'A Thanksgiving shoot', { size: 72, font: 'hand', color: C.haze, stroke: 8, align: 'center' }).setOrigin(0.5));
    title.setScale(0.6).setAlpha(0);
    this.tweens.add({ targets: title, scale: 1, alpha: 1, duration: 520, ease: 'Back.easeOut' });

    const start = (mode: Mode) => {
      sfx.unlock();
      const seed = mode === 'daily' ? dailySeed() : practiceSeed();
      this.cameras.main.fadeOut(220, 43, 29, 36);
      this.cameras.main.once('camerafadeoutcomplete', () => this.scene.start('Play', { mode, seed }));
    };

    const col = 540;
    button(this, col, 900, 660, 150, 'Daily hunt', 'primary', () => start('daily')).setDepth(DEPTH.hud);
    this.note(col, 1000, 'Same flock for everyone today. No aim guide.', getBest('daily'), "Today's best");
    button(this, col, 1180, 660, 150, 'Practice', 'kraft', () => start('practice')).setDepth(DEPTH.hud);
    this.note(col, 1280, 'New flock every time. Aim guide on.', getBest('practice'), 'Best');

    const how = this.add.container(540, 1640).setDepth(DEPTH.hud + 1);
    how.add(text(this, 0, 0, 'Drag back to draw, or aim with ← → and hold space.\nLet go to shoot. Lead your bird.\nHummingbirds pay 2,000. Three stars pay 3,000.', {
      size: 44, font: 'hand', color: C.paper, stroke: 6, align: 'center',
    }).setOrigin(0.5));

    sfx.muted = getMuted();
    const sound = iconButton(this, VIEW_W - 76, 76, (g) => drawSpeaker(g, sfx.muted), () => {
      sfx.muted = !sfx.muted;
      setMuted(sfx.muted);
      drawSpeaker(sound.icon, sfx.muted);
    });
    sound.box.setDepth(DEPTH.hud);

    this.input.once('pointerdown', () => sfx.unlock());
    this.input.keyboard?.once('keydown-ENTER', () => start('daily'));
    this.input.keyboard?.once('keydown-SPACE', () => start('practice'));
    this.cameras.main.fadeIn(260, 43, 29, 36);
  }

  private note(x: number, y: number, line: string, best: number, bestLabel: string): void {
    text(this, x, y, line, { size: 40, font: 'hand', color: C.paper, stroke: 6, align: 'center' }).setOrigin(0.5).setDepth(DEPTH.hud);
    if (best > 0) text(this, x, y + 50, `${bestLabel} ${formatScore(best)}`, { size: 36, font: 'hand', color: C.gold, stroke: 6, align: 'center' }).setOrigin(0.5).setDepth(DEPTH.hud);
  }

  /** Decorative flock crossing behind the title. Not the game: no seed, no scoring. */
  private flyBy(): void {
    const launch = () => {
      const species = Phaser.Utils.Array.GetRandom(SPECIES_LIST.filter((s) => s !== 'golden' && s !== 'star' && s !== 'hummer'));
      const dir = Math.random() < 0.5 ? 1 : -1;
      const y = Math.random() < 0.6 ? 150 + Math.random() * 170 : 1360 + Math.random() * 90;   // above the title or over the field, never across the text
      const bird = this.add.sprite(dir > 0 ? -120 : VIEW_W + 120, y, `${species}-0`).play(`${species}-flap`).setDepth(DEPTH.birds).setFlipX(dir < 0).setScale(0.8 + Math.random() * 0.3);
      this.tweens.add({ targets: bird, x: dir > 0 ? VIEW_W + 140 : -140, duration: 6000 + Math.random() * 4000, onComplete: () => bird.destroy() });
      this.tweens.add({ targets: bird, y: y - 30 - Math.random() * 40, duration: 900 + Math.random() * 600, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
    };
    launch();
    this.time.addEvent({ delay: 2200, loop: true, callback: launch });
  }
}
