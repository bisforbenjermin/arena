import Phaser from 'phaser';
import type { Species } from '../../engine/species';
import { birdFrames } from './birds';
import { drawBackdrop, drawCloud, drawForeground } from './scenery';
import { drawArrow, drawBow, drawGlow, drawStar, drawPuff, drawQuiverArrow, drawSheet, drawSparkle, paintFeather, paintLeaf, paintPip, SHEET_CELL } from './props';

export const SPECIES_LIST: Species[] = ['duck', 'goose', 'turkey', 'golden', 'star'];
export const BIRDS: Species[] = ['duck', 'goose', 'turkey', 'golden'];

export const FEATHER_COLORS: Record<Species, string[]> = {
  duck: ['#8C7C6C', '#2F56A6', '#1E6A47', '#F4EEE2'],
  goose: ['#7C6F60', '#CDBFA8', '#1C1816', '#F4EEE2'],
  turkey: ['#6B4A2E', '#C8893A', '#EAD7AE', '#4F3626'],
  golden: ['#F2C14E', '#FFE08A', '#FFF6D1', '#E0A52A'],
  star: ['#FFF6D1', '#F2C14E', '#FFE08A', '#FFFFFF'],
};
export const LEAF_COLORS = ['#B4532A', '#D9822B', '#E2B33C', '#9E3B27'];
export const PIP_FRAMES = { pending: 0, hit: 1, gold: 2, missed: 3 } as const;

/** Registers a strip from drawSheet with numbered frames 0..n-1. */
function addSheet(tx: Phaser.Textures.TextureManager, key: string, canvas: HTMLCanvasElement, n: number): void {
  if (tx.exists(key)) return;
  const t = tx.addCanvas(key, canvas)!;
  for (let i = 0; i < n; i++) t.add(i, 0, i * SHEET_CELL.w, 0, SHEET_CELL.w, SHEET_CELL.h);
}
const FLAP_RATE: Record<Species, number> = { duck: 14, goose: 7, turkey: 10, golden: 16, star: 0 };

/** Draws every texture once and registers the flap animations. */
export function registerArt(scene: Phaser.Scene): void {
  const tx = scene.textures;
  const add = (key: string, c: HTMLCanvasElement) => { if (!tx.exists(key)) tx.addCanvas(key, c); };
  add('backdrop', drawBackdrop());
  add('foreground', drawForeground());
  add('cloud-0', drawCloud(340, 11));
  add('cloud-1', drawCloud(240, 23));
  add('cloud-2', drawCloud(420, 37));
  add('arrow', drawArrow());
  for (let t = 0; t < 3; t++) add(`bow-${t}`, drawBow(t));
  add('star', drawStar());
  add('sparkle', drawSparkle());
  add('puff', drawPuff());
  add('glow', drawGlow());
  addSheet(tx, 'pips', drawSheet(['rgba(247,236,216,0.38)', '#B3263A', '#F2C14E', 'rgba(43,29,36,0.7)'], paintPip), 4);
  add('quiver-arrow', drawQuiverArrow());
  addSheet(tx, 'leaves', drawSheet(LEAF_COLORS, paintLeaf), LEAF_COLORS.length);
  for (const s of SPECIES_LIST) addSheet(tx, `feathers-${s}`, drawSheet(FEATHER_COLORS[s], paintFeather), 4);
  for (const s of SPECIES_LIST) {
    if (s === 'star') continue;
    birdFrames(s).forEach((c, i) => add(`${s}-${i}`, c));
    if (!scene.anims.exists(`${s}-flap`)) {
      scene.anims.create({
        key: `${s}-flap`,
        frames: [0, 1, 2, 1].map((i) => ({ key: `${s}-${i}` })),
        frameRate: FLAP_RATE[s],
        repeat: -1,
      });
    }
  }
}
