import Phaser from 'phaser';
import { DEPTH, VIEW_W } from '../config';
import { FOREGROUND_TOP, SUN } from '../art/scenery';

/** Sky, hills, drifting clouds, a breathing sun glow, falling leaves, and the grass that birds fall behind. */
export function buildBackdrop(scene: Phaser.Scene): void {
  scene.add.image(0, 0, 'backdrop').setOrigin(0).setDepth(DEPTH.sky);

  const glow = scene.add.image(SUN.x, SUN.y, 'glow').setScale(3.2).setDepth(DEPTH.sky).setAlpha(0.35).setBlendMode(Phaser.BlendModes.ADD);
  scene.tweens.add({ targets: glow, alpha: 0.55, scale: 3.4, duration: 3200, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });

  // kept below the HUD band (y < 380) so they never sit behind the score or the tally
  const clouds = [
    { key: 'cloud-0', y: 470, speed: 7, alpha: 0.45, x: 160 },
    { key: 'cloud-1', y: 700, speed: 11, alpha: 0.55, x: 760 },
    { key: 'cloud-2', y: 930, speed: 15, alpha: 0.7, x: 380 },
    { key: 'cloud-1', y: 1130, speed: 19, alpha: 0.8, x: 980 },
  ];
  for (const c of clouds) {
    const img = scene.add.image(c.x, c.y, c.key).setAlpha(c.alpha).setDepth(DEPTH.clouds);
    const lap = (VIEW_W + img.width * 2) / c.speed * 1000;
    const drift = () => {
      const left = -img.width;
      scene.tweens.add({
        targets: img, x: VIEW_W + img.width, duration: ((VIEW_W + img.width - img.x) / (VIEW_W + img.width * 2)) * lap,
        onComplete: () => { img.x = left; drift(); },
      });
    };
    drift();
  }

  scene.add.particles(0, 0, 'leaves', {
    frame: [0, 1, 2, 3],
    x: { min: 0, max: VIEW_W }, y: -20,
    lifespan: 14000, speedY: { min: 40, max: 80 }, speedX: { min: -30, max: 30 },
    rotate: { start: 0, end: 540 }, scale: { min: 0.7, max: 1.1 }, alpha: { start: 0.85, end: 0.6 },
    frequency: 1400, quantity: 1,
  }).setDepth(DEPTH.clouds);

  scene.add.image(0, FOREGROUND_TOP, 'foreground').setOrigin(0).setDepth(DEPTH.grass);
}
