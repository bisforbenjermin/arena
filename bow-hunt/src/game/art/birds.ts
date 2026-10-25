// Cut-paper birds, facing right, centered on the hitbox. Three wing frames each: up, mid, down.
import type { Species } from '../../engine/species';
import { circle, ellipse, sticker, type Ctx } from './canvas';

export const WING_FRAMES = [-0.15, -1.35, -2.55] as const;   // radians from straight up, toward the tail
export type Bird = Exclude<Species, 'star' | 'quiver' | 'fire'>;
export const BIRD_CANVAS: Record<Bird, [number, number]> = {
  duck: [160, 120], goose: [230, 160], turkey: [210, 170], golden: [210, 170], hummer: [120, 90],
};

type WingStyle = { len: number; wid: number; fill: string; edge: string; accent?: string; bars?: string };

/** A wing hinged at (sx, sy). angle 0 points straight up; negative swings it toward the tail. */
function wing(ctx: Ctx, sx: number, sy: number, angle: number, w: WingStyle, far = false): void {
  ctx.save();
  ctx.translate(sx, sy);
  ctx.rotate(angle);
  const squash = Math.abs(Math.sin(angle)) > 0.9 ? 0.55 : 1;   // edge-on in the middle of the stroke
  ctx.scale(1, 1);
  const L = w.len, W = w.wid * squash;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.quadraticCurveTo(W * 0.9, -L * 0.45, W * 0.35, -L);
  ctx.quadraticCurveTo(-W * 0.2, -L * 0.75, -W * 0.75, -L * 0.15);
  ctx.closePath();
  ctx.fillStyle = far ? w.edge : w.fill;
  ctx.fill();
  if (!far) {
    // primaries
    ctx.strokeStyle = w.edge;
    ctx.lineWidth = 2.2;
    for (let i = 0; i < 4; i++) {
      const t = 0.55 + i * 0.11;
      ctx.beginPath();
      ctx.moveTo(-W * 0.1 + i * 2, -L * (t - 0.18));
      ctx.lineTo(W * 0.25 + i * 1.5, -L * t);
      ctx.stroke();
    }
    if (w.accent) {
      ctx.beginPath();
      ctx.moveTo(-W * 0.55, -L * 0.2);
      ctx.quadraticCurveTo(0, -L * 0.42, W * 0.55, -L * 0.36);
      ctx.lineTo(W * 0.5, -L * 0.28);
      ctx.quadraticCurveTo(0, -L * 0.32, -W * 0.5, -L * 0.1);
      ctx.closePath();
      ctx.fillStyle = w.accent;
      ctx.fill();
    }
    if (w.bars) {
      ctx.strokeStyle = w.bars;
      ctx.lineWidth = 3;
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.moveTo(-W * 0.45 + i * 3, -L * (0.3 + i * 0.16));
        ctx.lineTo(W * 0.45 + i * 2, -L * (0.38 + i * 0.16));
        ctx.stroke();
      }
    }
  }
  ctx.restore();
}

function duck(ctx: Ctx, a: number): void {
  const w: WingStyle = { len: 52, wid: 22, fill: '#8C7C6C', edge: '#5F5247', accent: '#2F56A6' };
  wing(ctx, -4, -6, a + 0.35, w, true);
  ctx.beginPath(); ctx.moveTo(-34, 2); ctx.lineTo(-60, -8); ctx.lineTo(-56, 8); ctx.closePath(); ctx.fillStyle = '#2F2622'; ctx.fill();
  ctx.beginPath(); ctx.moveTo(-50, -4); ctx.lineTo(-62, -9); ctx.lineTo(-58, 0); ctx.closePath(); ctx.fillStyle = '#EDE6DA'; ctx.fill();
  const g = ctx.createLinearGradient(0, -16, 0, 24);
  g.addColorStop(0, '#A79786'); g.addColorStop(1, '#756657');
  ellipse(ctx, 0, 4, 40, 19, g);
  ellipse(ctx, 24, 8, 17, 15, '#7B3A27');
  ellipse(ctx, 31, -4, 7, 9, '#F4EEE2');
  circle(ctx, 39, -13, 14, '#1E6A47');
  ellipse(ctx, 36, -18, 6, 4, '#2F8F62', -0.4);
  ctx.beginPath(); ctx.moveTo(49, -15); ctx.quadraticCurveTo(62, -14, 66, -8); ctx.quadraticCurveTo(58, -5, 49, -7); ctx.closePath(); ctx.fillStyle = '#E3B23C'; ctx.fill();
  circle(ctx, 43, -16, 2.6, '#14100E');
  wing(ctx, -2, -2, a, w);
}

function goose(ctx: Ctx, a: number): void {
  const w: WingStyle = { len: 78, wid: 34, fill: '#7C6F60', edge: '#4E453C' };
  wing(ctx, -8, -8, a + 0.35, w, true);
  ctx.beginPath(); ctx.moveTo(-46, 0); ctx.lineTo(-76, -10); ctx.lineTo(-72, 10); ctx.closePath(); ctx.fillStyle = '#1F1A17'; ctx.fill();
  ellipse(ctx, -58, 6, 10, 5, '#EDE6DA');
  const g = ctx.createLinearGradient(0, -20, 0, 30);
  g.addColorStop(0, '#9A8C7B'); g.addColorStop(1, '#6B5F52');
  ellipse(ctx, -2, 6, 54, 26, g);
  ellipse(ctx, 24, 10, 25, 19, '#CDBFA8');
  ctx.strokeStyle = '#1C1816'; ctx.lineWidth = 15; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(36, -2); ctx.quadraticCurveTo(54, -8, 64, -20); ctx.stroke();
  ellipse(ctx, 68, -23, 14, 10, '#1C1816', -0.2);
  ellipse(ctx, 66, -18, 7, 5, '#F4EEE2', -0.2);
  ctx.beginPath(); ctx.moveTo(79, -26); ctx.lineTo(92, -22); ctx.lineTo(79, -18); ctx.closePath(); ctx.fillStyle = '#1C1816'; ctx.fill();
  circle(ctx, 72, -26, 2.2, '#6B5F52');
  wing(ctx, -6, -4, a, w);
}

type TurkeyPalette = { body: string; sheen: string; tail: string; band: string; tip: string; head: string; wattle: string; wing: string; wingEdge: string; bars: string };
const WILD: TurkeyPalette = { body: '#4F3626', sheen: '#7E6236', tail: '#6B4A2E', band: '#C8893A', tip: '#EAD7AE', head: '#9DB8CF', wattle: '#C0392B', wing: '#6A4A30', wingEdge: '#3B2A1E', bars: '#E9DCC2' };
const GOLDEN: TurkeyPalette = { body: '#E0A52A', sheen: '#FFE08A', tail: '#E8B23A', band: '#FFD966', tip: '#FFF6D1', head: '#FFF3C4', wattle: '#E36B2C', wing: '#D99A1E', wingEdge: '#A8700F', bars: '#FFF0B3' };

function turkey(ctx: Ctx, a: number, p: TurkeyPalette): void {
  const w: WingStyle = { len: 64, wid: 30, fill: p.wing, edge: p.wingEdge, bars: p.bars };
  // fanned tail behind
  for (let i = -4; i <= 4; i++) {
    ctx.save();
    ctx.translate(-22, 2);
    ctx.rotate(Math.PI + i * 0.2);
    ctx.beginPath(); ctx.ellipse(28, 0, 30, 10, 0, 0, Math.PI * 2); ctx.fillStyle = p.tail; ctx.fill();
    ctx.beginPath(); ctx.ellipse(46, 0, 9, 9, 0, 0, Math.PI * 2); ctx.fillStyle = p.band; ctx.fill();
    ctx.beginPath(); ctx.ellipse(55, 0, 6, 8, 0, 0, Math.PI * 2); ctx.fillStyle = p.tip; ctx.fill();
    ctx.restore();
  }
  wing(ctx, -6, -10, a + 0.35, w, true);
  // dangling legs
  ctx.strokeStyle = '#B5703A'; ctx.lineWidth = 4; ctx.lineCap = 'round';
  for (const lx of [-4, 8]) { ctx.beginPath(); ctx.moveTo(lx, 26); ctx.lineTo(lx - 10, 44); ctx.lineTo(lx - 16, 46); ctx.stroke(); }
  ellipse(ctx, 2, 4, 40, 30, p.body);
  ctx.strokeStyle = p.sheen; ctx.lineWidth = 3;
  for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.arc(2, 4 + i * 6, 30 - i * 4, -0.9, 0.5); ctx.stroke(); }
  // beard
  ctx.strokeStyle = '#2A1C14'; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(34, 6); ctx.lineTo(30, 22); ctx.stroke();
  // neck and head
  ctx.strokeStyle = p.head; ctx.lineWidth = 10; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(32, -8); ctx.quadraticCurveTo(44, -14, 50, -26); ctx.stroke();
  circle(ctx, 52, -28, 10, p.head);
  ctx.beginPath(); ctx.moveTo(56, -22); ctx.quadraticCurveTo(64, -12, 56, -6); ctx.quadraticCurveTo(50, -12, 52, -20); ctx.closePath(); ctx.fillStyle = p.wattle; ctx.fill();
  ctx.beginPath(); ctx.moveTo(58, -36); ctx.quadraticCurveTo(68, -34, 66, -24); ctx.lineTo(63, -26); ctx.closePath(); ctx.fillStyle = p.wattle; ctx.fill();
  ctx.beginPath(); ctx.moveTo(60, -30); ctx.lineTo(70, -28); ctx.lineTo(60, -25); ctx.closePath(); ctx.fillStyle = '#D8B27A'; ctx.fill();
  circle(ctx, 55, -31, 2.2, '#14100E');
  wing(ctx, -4, -6, a, w);
}

/** Ruby-throated hummingbird: emerald back, red throat, needle bill, wings a blur. */
function hummer(ctx: Ctx, a: number): void {
  const blur = (angle: number, alpha: number) => {
    ctx.save();
    ctx.translate(-2, -6);
    ctx.rotate(angle);
    ctx.beginPath(); ctx.ellipse(0, -20, 8, 24, 0, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(220,240,235,${alpha})`; ctx.fill();
    ctx.restore();
  };
  const sweep = a === WING_FRAMES[0] ? -0.6 : a === WING_FRAMES[1] ? -1.5 : -2.3;
  blur(sweep - 0.35, 0.35); blur(sweep, 0.6);
  ctx.beginPath(); ctx.moveTo(-14, 2); ctx.lineTo(-34, -2); ctx.lineTo(-32, 8); ctx.closePath(); ctx.fillStyle = '#20402F'; ctx.fill();
  const g = ctx.createLinearGradient(0, -12, 0, 12);
  g.addColorStop(0, '#3FBF7F'); g.addColorStop(1, '#1D6E4A');
  ellipse(ctx, -2, 2, 18, 10, g, -0.15);
  ellipse(ctx, 2, 7, 10, 5, '#F2EEE6', -0.1);
  circle(ctx, 14, -4, 9, '#2E9E6B');
  ellipse(ctx, 15, 3, 6, 5, '#D7263D');
  ctx.strokeStyle = '#14100E'; ctx.lineWidth = 2.4; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(22, -4); ctx.lineTo(44, -2); ctx.stroke();
  circle(ctx, 17, -6, 2, '#14100E');
  blur(sweep + 0.25, 0.7);
}

function drawSpecies(ctx: Ctx, species: Species, a: number): void {
  if (species === 'hummer') hummer(ctx, a);
  else if (species === 'duck') duck(ctx, a);
  else if (species === 'goose') goose(ctx, a);
  else turkey(ctx, a, species === 'golden' ? GOLDEN : WILD);
}

/** One sticker canvas per wing frame. */
export function birdFrames(species: Bird): HTMLCanvasElement[] {
  const [w, h] = BIRD_CANVAS[species];
  const paper = species === 'golden' ? '#FFF8E1' : '#F7ECD8';
  return WING_FRAMES.map((a) => sticker(w, h, (ctx) => drawSpecies(ctx, species, a), 6, paper));
}

/** Small flat silhouette for the HUD tally. */
export function birdIcon(ctx: Ctx, color: string): void {
  ctx.fillStyle = color;
  ctx.beginPath(); ctx.ellipse(0, 3, 13, 7, 0, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(12, -3, 5, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.moveTo(16, -4); ctx.lineTo(22, -2); ctx.lineTo(16, 0); ctx.fill();
  ctx.beginPath(); ctx.moveTo(-2, 0); ctx.quadraticCurveTo(-6, -14, -14, -16); ctx.quadraticCurveTo(-10, -6, -10, 2); ctx.fill();
  ctx.beginPath(); ctx.moveTo(-11, 2); ctx.lineTo(-19, -2); ctx.lineTo(-18, 6); ctx.fill();
}
