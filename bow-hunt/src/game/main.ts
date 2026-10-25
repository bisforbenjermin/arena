import Phaser from 'phaser';
import { TitleScene } from './scenes/Title';
import { PlayScene } from './scenes/Play';
import { ResultsScene } from './scenes/Results';
import { GameOverScene } from './scenes/GameOver';

/** Portrait 9:16 canvas. FIT scaling letterboxes on any phone or desktop window. */
export const VIEW_W = 540;
export const VIEW_H = 960;

new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'game',
  backgroundColor: '#1b1f2a',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: VIEW_W,
    height: VIEW_H,
  },
  fps: { target: 60 },
  input: { activePointers: 1 },
  scene: [TitleScene, PlayScene, ResultsScene, GameOverScene],
});
