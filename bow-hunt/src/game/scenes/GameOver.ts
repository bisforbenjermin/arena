import Phaser from 'phaser';

/** Game Over: final score, replay check result, play again. */
export class GameOverScene extends Phaser.Scene {
  constructor() { super('GameOver'); }

  create() {
    const { width, height } = this.scale;
    this.add.text(width / 2, height / 2, 'Game Over (scaffold)', { fontSize: '28px', color: '#e8e2d4' }).setOrigin(0.5);
    this.input.once('pointerup', () => this.scene.start('Title'));
  }
}
