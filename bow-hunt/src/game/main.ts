import Phaser from 'phaser';
import '@fontsource/alfa-slab-one/latin-400.css';
import '@fontsource/patrick-hand/latin-400.css';
import { registerArt } from './art/textures';
import { VIEW_H, VIEW_W } from './config';
import { GameOverScene } from './scenes/GameOver';
import { PlayScene } from './scenes/Play';
import { ResultsScene } from './scenes/Results';
import { TitleScene } from './scenes/Title';

/** Draws every texture once, then hands off to the title. */
class BootScene extends Phaser.Scene {
  constructor() { super('Boot'); }
  create() {
    registerArt(this);
    this.scene.start('Title');
  }
}

/** Waits for the two web fonts (or gives up after 2.5 s and uses the fallbacks). */
async function fontsReady(): Promise<void> {
  if (!('fonts' in document)) return;
  const load = Promise.all([
    document.fonts.load('64px "Alfa Slab One"'),
    document.fonts.load('40px "Patrick Hand"'),
  ]).then(() => undefined, () => undefined);
  await Promise.race([load, new Promise<void>((r) => setTimeout(r, 2500))]);
}

void fontsReady().then(() => {
  // ?canvas forces the 2D renderer: for old phones with flaky WebGL, and for headless test browsers with no GPU.
  const forceCanvas = new URLSearchParams(location.search).has('canvas');
  const game = new Phaser.Game({
    type: forceCanvas ? Phaser.CANVAS : Phaser.AUTO,
    parent: 'game',
    backgroundColor: '#231931',
    scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH, width: VIEW_W, height: VIEW_H },
    fps: { target: 60 },
    input: { activePointers: 2 },
    render: { antialias: true, powerPreference: 'high-performance' },
    scene: [BootScene, TitleScene, PlayScene, ResultsScene, GameOverScene],
  });
  (window as unknown as { __bowhunt: Phaser.Game }).__bowhunt = game;
  document.getElementById('loading')?.remove();
});
