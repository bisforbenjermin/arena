import Phaser from 'phaser';

/** Round Results: hits vs quota, bonuses, then Next Round or Game Over. */
export class ResultsScene extends Phaser.Scene {
  constructor() { super('Results'); }

  create() {
    const { width, height } = this.scale;
    this.add.text(width / 2, height / 2, 'Round Results (scaffold)', { fontSize: '28px', color: '#e8e2d4' }).setOrigin(0.5);
    this.input.once('pointerup', () => this.scene.start('GameOver'));
  }
}
