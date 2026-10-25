import Phaser from 'phaser';

/** Play: runs the deterministic engine at a fixed 60 Hz and draws its state. Never writes game state itself. */
export class PlayScene extends Phaser.Scene {
  constructor() { super('Play'); }

  create() {
    const { width, height } = this.scale;
    this.add.text(width / 2, height / 2, 'Play (scaffold)', { fontSize: '28px', color: '#e8e2d4' }).setOrigin(0.5);
    this.input.once('pointerup', () => this.scene.start('Results'));
  }
}
