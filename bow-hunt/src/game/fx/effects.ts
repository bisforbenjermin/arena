// Feathers, score popups, shake, flashes. All display only.
import Phaser from 'phaser';
import type { Species } from '../../engine/species';
import { C, DEPTH } from '../config';
import { text } from '../ui/widgets';

import { SPECIES_LIST } from '../art/textures';

export class Effects {
  private feathers = new Map<Species, Phaser.GameObjects.Particles.ParticleEmitter>();
  private sparkles: Phaser.GameObjects.Particles.ParticleEmitter;
  private puffs: Phaser.GameObjects.Particles.ParticleEmitter;

  constructor(private scene: Phaser.Scene) {
    for (const s of SPECIES_LIST) {
      this.feathers.set(s, scene.add.particles(0, 0, `feathers-${s}`, {
        frame: [0, 1, 2, 3], emitting: false, lifespan: { min: 900, max: 1500 }, speed: { min: 160, max: 520 },
        angle: { min: 0, max: 360 }, gravityY: 520, rotate: { start: 0, end: 600 },
        scale: { min: 1.3, max: 2.3 }, alpha: { start: 1, end: 0 }, maxVelocityY: 380,
      }).setDepth(DEPTH.fx));
    }
    this.sparkles = scene.add.particles(0, 0, 'sparkle', {
      emitting: false, lifespan: 900, speed: { min: 120, max: 420 }, angle: { min: 0, max: 360 },
      scale: { start: 1.3, end: 0 }, rotate: { start: 0, end: 180 }, blendMode: 'ADD',
    }).setDepth(DEPTH.fx);
    this.puffs = scene.add.particles(0, 0, 'puff', {
      emitting: false, lifespan: 700, speed: { min: 40, max: 140 }, angle: { min: 200, max: 340 },
      scale: { start: 0.6, end: 1.6 }, alpha: { start: 0.8, end: 0 },
    }).setDepth(DEPTH.fx);
  }

  burst(x: number, y: number, species: Species): void {
    const n = species === 'golden' ? 30 : species === 'goose' ? 20 : 16;
    this.feathers.get(species)?.explode(n, x, y);
    if (species === 'golden') this.sparkles.explode(22, x, y);
  }

  sparkleTrail(x: number, y: number): void {
    this.sparkles.explode(1, x, y);
  }

  /** Spark trailing a fire arrow. */
  ember(x: number, y: number): void {
    this.sparkles.explode(1, x, y);
  }

  puff(x: number, y: number): void {
    this.puffs.explode(6, x, y);
  }

  shake(strength: 'small' | 'big'): void {
    const cam = this.scene.cameras.main;
    if (strength === 'big') cam.shake(260, 0.012);
    else cam.shake(110, 0.004);
  }

  /** Big rising number at the hit. */
  points(x: number, y: number, value: number, golden: boolean): void {
    const t = text(this.scene, x, y, `+${value.toLocaleString('en-US')}`, {
      size: golden ? 92 : value >= 300 ? 70 : 56, color: golden ? C.gold : C.paper, stroke: 10,
    }).setOrigin(0.5).setDepth(DEPTH.popups).setScale(0.4);
    this.scene.tweens.add({ targets: t, scale: 1, duration: 160, ease: 'Back.easeOut' });
    this.scene.tweens.add({ targets: t, y: y - 150, alpha: 0, delay: 420, duration: 700, ease: 'Cubic.easeIn', onComplete: () => t.destroy() });
  }

  /** Handwritten note under the points: "Long shot", "Double!". */
  note(x: number, y: number, s: string, color: string = C.gold, delay = 0): void {
    const t = text(this.scene, x, y, s, { size: 46, font: 'hand', color, stroke: 7 }).setOrigin(0.5).setDepth(DEPTH.popups).setAlpha(0);
    this.scene.tweens.add({ targets: t, alpha: 1, y: y - 20, delay, duration: 160 });
    this.scene.tweens.add({ targets: t, y: y - 140, alpha: 0, delay: delay + 650, duration: 650, onComplete: () => t.destroy() });
  }

  /** White flash on a sprite, the frame it's hit. */
  flash(s: Phaser.GameObjects.Sprite): void {
    s.setTintFill(0xffffff);
    this.scene.time.delayedCall(70, () => s.clearTint());
  }
}
