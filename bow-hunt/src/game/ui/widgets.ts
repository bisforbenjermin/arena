// Kraft tags on twine, the HUD's and menus' visual language.
import Phaser from 'phaser';
import { C, FONT_HAND, FONT_SLAB, N } from '../config';
import { sfx } from '../audio/sfx';

export type TextOpts = { size: number; color?: string; font?: 'slab' | 'hand'; stroke?: number; align?: 'left' | 'center' | 'right'; wrap?: number };

export function text(scene: Phaser.Scene, x: number, y: number, s: string, o: TextOpts): Phaser.GameObjects.Text {
  const t = scene.add.text(x, y, s, {
    fontFamily: o.font === 'hand' ? FONT_HAND : FONT_SLAB,
    fontSize: `${o.size}px`,
    color: o.color ?? C.ink,
    align: o.align ?? 'left',
    wordWrap: o.wrap ? { width: o.wrap, useAdvancedWrap: true } : undefined,
    stroke: o.stroke ? C.ink : undefined,
    strokeThickness: o.stroke ?? 0,
    padding: { x: 4, y: 6 },
  });
  if (o.stroke) t.setShadow(0, Math.max(4, o.stroke * 0.7), C.ink, 0, true, true);
  return t;
}

/** A kraft tag: notched corners, a punched hole and twine running up off the top. Origin is its top-left. */
export function tag(scene: Phaser.Scene, w: number, h: number, opts: { twine?: boolean; fill?: number; hole?: boolean } = {}): Phaser.GameObjects.Graphics {
  const g = scene.add.graphics();
  const n = 22;
  const shape = (dx: number, dy: number) => {
    g.beginPath();
    g.moveTo(dx + n, dy); g.lineTo(dx + w - n, dy); g.lineTo(dx + w, dy + n);
    g.lineTo(dx + w, dy + h - n); g.lineTo(dx + w - n, dy + h); g.lineTo(dx + n, dy + h);
    g.lineTo(dx, dy + h - n); g.lineTo(dx, dy + n); g.closePath();
  };
  g.fillStyle(N.ink, 0.35); shape(5, 8); g.fillPath();
  g.fillStyle(opts.fill ?? N.kraft, 1); shape(0, 0); g.fillPath();
  g.lineStyle(3, N.kraftDark, 1); shape(0, 0); g.strokePath();
  if (opts.hole !== false) {
    g.fillStyle(N.ink, 0.6); g.fillCircle(w / 2, 22, 9);
    g.lineStyle(3, N.kraftDark, 1); g.strokeCircle(w / 2, 22, 13);
  }
  if (opts.twine) {
    g.lineStyle(4, 0xe8d6b0, 1);
    g.beginPath(); g.moveTo(w / 2, 22); g.lineTo(w / 2 - 6, -400); g.strokePath();
  }
  return g;
}

export type ButtonStyle = 'primary' | 'kraft';

/** A tappable label. Shrinks while pressed, fires on release inside it. */
export function button(scene: Phaser.Scene, x: number, y: number, w: number, h: number, label: string, style: ButtonStyle, onTap: () => void): Phaser.GameObjects.Container {
  const c = scene.add.container(x, y);
  const g = scene.add.graphics();
  const fill = style === 'primary' ? N.cranberry : N.kraft;
  const r = h / 2;
  g.fillStyle(N.ink, 0.4); g.fillRoundedRect(-w / 2 + 4, -h / 2 + 9, w, h, r);
  g.fillStyle(fill, 1); g.fillRoundedRect(-w / 2, -h / 2, w, h, r);
  g.lineStyle(4, style === 'primary' ? 0x7d1a28 : N.kraftDark, 1); g.strokeRoundedRect(-w / 2, -h / 2, w, h, r);
  g.lineStyle(2, style === 'primary' ? 0xd9576a : 0xe9d3ad, 0.8); g.strokeRoundedRect(-w / 2 + 8, -h / 2 + 8, w - 16, h - 16, r - 8);
  const t = text(scene, 0, 0, label, { size: Math.round(h * 0.42), color: style === 'primary' ? C.paper : C.ink }).setOrigin(0.5);
  c.add([g, t]);
  c.setSize(w, h);
  // Phaser measures a container's hit area from the top-left of its size box, not its center.
  c.setInteractive({ hitArea: new Phaser.Geom.Rectangle(0, 0, w, h), hitAreaCallback: Phaser.Geom.Rectangle.Contains, useHandCursor: true });
  c.on('pointerdown', () => { sfx.unlock(); c.setScale(0.96); });
  c.on('pointerout', () => c.setScale(1));
  c.on('pointerup', () => { c.setScale(1); sfx.click(); onTap(); });
  return c;
}

/** Small round icon button (pause, sound). `draw` paints the icon centered on (0, 0). */
export function iconButton(scene: Phaser.Scene, x: number, y: number, draw: (g: Phaser.GameObjects.Graphics) => void, onTap: () => void): { box: Phaser.GameObjects.Container; icon: Phaser.GameObjects.Graphics } {
  const c = scene.add.container(x, y);
  const g = scene.add.graphics();
  g.fillStyle(N.ink, 0.35); g.fillCircle(3, 7, 40);
  g.fillStyle(N.kraft, 1); g.fillCircle(0, 0, 40);
  g.lineStyle(3, N.kraftDark, 1); g.strokeCircle(0, 0, 40);
  const icon = scene.add.graphics();
  draw(icon);
  c.add([g, icon]);
  c.setSize(96, 96);
  c.setInteractive({ hitArea: new Phaser.Geom.Circle(48, 48, 48), hitAreaCallback: Phaser.Geom.Circle.Contains, useHandCursor: true });
  c.on('pointerdown', (_p: Phaser.Input.Pointer, _x: number, _y: number, e: Phaser.Types.Input.EventData) => { e.stopPropagation(); sfx.unlock(); c.setScale(0.92); });
  c.on('pointerout', () => c.setScale(1));
  c.on('pointerup', (_p: Phaser.Input.Pointer, _x: number, _y: number, e: Phaser.Types.Input.EventData) => { e.stopPropagation(); c.setScale(1); sfx.click(); onTap(); });
  return { box: c, icon };
}

export function drawSpeaker(g: Phaser.GameObjects.Graphics, muted: boolean): void {
  g.clear();
  g.fillStyle(N.ink, 1);
  g.fillRect(-18, -8, 10, 16);
  g.fillTriangle(-8, -8, 6, -20, 6, 20);
  g.fillRect(-8, -8, 14, 16);
  g.lineStyle(4, N.ink, 1);
  if (muted) {
    g.lineBetween(12, -10, 26, 10); g.lineBetween(26, -10, 12, 10);
  } else {
    g.beginPath(); g.arc(8, 0, 12, -0.8, 0.8); g.strokePath();
    g.beginPath(); g.arc(8, 0, 21, -0.8, 0.8); g.strokePath();
  }
}

export function drawPause(g: Phaser.GameObjects.Graphics): void {
  g.clear();
  g.fillStyle(N.ink, 1);
  g.fillRoundedRect(-14, -16, 10, 32, 3);
  g.fillRoundedRect(4, -16, 10, 32, 3);
}
