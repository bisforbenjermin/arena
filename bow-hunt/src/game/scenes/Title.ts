import Phaser from 'phaser';

/** Title: pick Daily (fixed seed, no preview) or Practice (random seed, trajectory preview). */
export class TitleScene extends Phaser.Scene {
  constructor() { super('Title'); }

  create() {
    const { width, height } = this.scale;
    this.add.text(width / 2, height * 0.3, 'BOW HUNT', { fontSize: '64px', color: '#f4c95d', fontStyle: 'bold' }).setOrigin(0.5);
    this.add.text(width / 2, height * 0.38, 'Thanksgiving', { fontSize: '28px', color: '#e8e2d4' }).setOrigin(0.5);
    this.add.text(width / 2, height * 0.7, 'scaffold — tap to continue', { fontSize: '20px', color: '#9aa3b5' }).setOrigin(0.5);
    this.input.once('pointerup', () => this.scene.start('Play'));
  }
}
