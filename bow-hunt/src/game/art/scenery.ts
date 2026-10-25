// The dusk diorama: layered cut-paper hills in front of a low sun. Drawn once at boot.
import { C, VIEW_W, VIEW_H } from '../config';
import { circle, ellipse, makeCanvas, scenicRng, type Ctx } from './canvas';

export const HORIZON_Y = 1300;
export const FOREGROUND_TOP = 1540;
export const SUN = { x: 760, y: 1262, r: 178 };

const LAYER_SHADOW = 'rgba(36,22,40,0.5)';

function layer(ctx: Ctx, fill: string | CanvasGradient, path: () => void): void {
  ctx.save();
  ctx.shadowColor = LAYER_SHADOW;
  ctx.shadowBlur = 26;
  ctx.shadowOffsetY = -8;
  ctx.beginPath();
  path();
  ctx.fillStyle = fill;
  ctx.fill();
  ctx.restore();
}

/** A ridge line made of soft bumps between yMin and yMax, closed down to the bottom of the canvas. */
function ridge(ctx: Ctx, rnd: () => number, yMin: number, yMax: number, bumps: number, bottom: number): [number, number][] {
  const pts: [number, number][] = [];
  for (let i = 0; i <= bumps; i++) pts.push([(i / bumps) * (VIEW_W + 120) - 60, yMin + rnd() * (yMax - yMin)]);
  ctx.moveTo(-60, bottom);
  ctx.lineTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length; i++) {
    const [px, py] = pts[i - 1], [x, y] = pts[i];
    ctx.quadraticCurveTo(px + (x - px) / 2, Math.min(py, y) - 18, x, y);
  }
  ctx.lineTo(VIEW_W + 60, bottom);
  ctx.closePath();
  return pts;
}

function heightAt(pts: [number, number][], x: number): number {
  for (let i = 1; i < pts.length; i++) {
    if (x <= pts[i][0]) {
      const t = (x - pts[i - 1][0]) / (pts[i][0] - pts[i - 1][0]);
      return pts[i - 1][1] + (pts[i][1] - pts[i - 1][1]) * t - 10;
    }
  }
  return pts[pts.length - 1][1];
}

function pine(ctx: Ctx, x: number, y: number, h: number, fill: string): void {
  ctx.beginPath();
  ctx.moveTo(x, y - h);
  ctx.lineTo(x + h * 0.32, y - h * 0.35);
  ctx.lineTo(x + h * 0.18, y - h * 0.35);
  ctx.lineTo(x + h * 0.38, y + 4);
  ctx.lineTo(x - h * 0.38, y + 4);
  ctx.lineTo(x - h * 0.18, y - h * 0.35);
  ctx.lineTo(x - h * 0.32, y - h * 0.35);
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
}

function autumnTree(ctx: Ctx, x: number, y: number, r: number, crown: string): void {
  ctx.fillStyle = '#4A2E22';
  ctx.fillRect(x - r * 0.12, y - r * 0.9, r * 0.24, r * 0.95);
  ctx.save();
  ctx.shadowColor = 'rgba(36,22,40,0.35)'; ctx.shadowBlur = 10; ctx.shadowOffsetY = 4;
  circle(ctx, x, y - r * 1.25, r, crown);
  ctx.restore();
  circle(ctx, x - r * 0.3, y - r * 1.5, r * 0.45, 'rgba(255,230,170,0.18)');
}

function haybale(ctx: Ctx, x: number, y: number, s: number): void {
  ctx.save();
  ctx.shadowColor = LAYER_SHADOW; ctx.shadowBlur = 14; ctx.shadowOffsetY = 6;
  ctx.fillStyle = '#D9A94E';
  ctx.beginPath(); ctx.roundRect(x - s, y - s * 0.8, s * 2, s * 1.1, s * 0.25); ctx.fill();
  ctx.restore();
  ellipse(ctx, x + s * 0.95, y - s * 0.25, s * 0.25, s * 0.55, '#C08A3E');
  ctx.strokeStyle = '#B07A33'; ctx.lineWidth = 3;
  for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.moveTo(x - s * 0.9, y - s * 0.6 + i * s * 0.25); ctx.lineTo(x + s * 0.8, y - s * 0.6 + i * s * 0.25); ctx.stroke(); }
}

function pumpkin(ctx: Ctx, x: number, y: number, r: number): void {
  ctx.save();
  ctx.shadowColor = LAYER_SHADOW; ctx.shadowBlur = 10; ctx.shadowOffsetY = 5;
  for (const [dx, rr, col] of [[-r * 0.45, r * 0.7, '#C9601E'], [r * 0.45, r * 0.7, '#C9601E'], [0, r * 0.8, '#E07A25']] as const) {
    ellipse(ctx, x + dx, y - r * 0.6, rr, r * 0.62, col);
  }
  ctx.restore();
  ctx.fillStyle = '#4C5B22';
  ctx.fillRect(x - 3, y - r * 1.35, 7, r * 0.4);
}

function grain(ctx: Ctx, w: number, h: number, strength: number, rnd: () => number): void {
  const img = ctx.getImageData(0, 0, w, h);
  const d = img.data;
  for (let i = 0; i < d.length; i += 4) {
    if (d[i + 3] === 0) continue;
    const n = (rnd() - 0.5) * strength;
    d[i] += n; d[i + 1] += n; d[i + 2] += n;
  }
  ctx.putImageData(img, 0, 0);
}

export function drawBackdrop(): HTMLCanvasElement {
  const { c, ctx } = makeCanvas(VIEW_W, VIEW_H);
  const rnd = scenicRng(1126);

  const sky = ctx.createLinearGradient(0, 0, 0, HORIZON_Y + 80);
  sky.addColorStop(0, '#231931');
  sky.addColorStop(0.3, C.plum);
  sky.addColorStop(0.6, C.mulberry);
  sky.addColorStop(0.8, '#D97C5C');
  sky.addColorStop(0.92, C.apricot);
  sky.addColorStop(1, C.haze);
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, VIEW_W, VIEW_H);

  for (let i = 0; i < 70; i++) {
    ctx.globalAlpha = 0.15 + rnd() * 0.55;
    circle(ctx, rnd() * VIEW_W, rnd() * 520, 1 + rnd() * 2.2, C.paper);
  }
  ctx.globalAlpha = 1;

  const glow = ctx.createRadialGradient(SUN.x, SUN.y, SUN.r * 0.6, SUN.x, SUN.y, SUN.r * 3.2);
  glow.addColorStop(0, 'rgba(255,226,170,0.75)');
  glow.addColorStop(1, 'rgba(255,226,170,0)');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, VIEW_W, VIEW_H);
  const disc = ctx.createLinearGradient(0, SUN.y - SUN.r, 0, SUN.y + SUN.r);
  disc.addColorStop(0, '#FFF1C9');
  disc.addColorStop(1, '#F6B060');
  circle(ctx, SUN.x, SUN.y, SUN.r, disc);
  ctx.globalAlpha = 0.18;
  for (let i = 1; i <= 3; i++) {
    ctx.strokeStyle = C.paper; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(SUN.x, SUN.y, SUN.r + i * 26, 0, Math.PI * 2); ctx.stroke();
  }
  ctx.globalAlpha = 1;

  // far hills with pines
  let pts: [number, number][] = [];
  layer(ctx, C.heather, () => { pts = ridge(ctx, rnd, 1170, 1250, 7, VIEW_H); });
  for (let x = 20; x < VIEW_W; x += 26 + rnd() * 40) pine(ctx, x, heightAt(pts, x) + 12, 34 + rnd() * 30, '#584063');

  // middle hills with autumn crowns
  const mid = ctx.createLinearGradient(0, 1300, 0, 1480);
  mid.addColorStop(0, '#93604A'); mid.addColorStop(1, '#6E4434');
  layer(ctx, mid, () => { pts = ridge(ctx, rnd, 1320, 1390, 5, VIEW_H); });
  const crowns = ['#B4532A', '#D9822B', '#E2B33C', '#9E3B27', '#C96A2A'];
  for (let x = 10; x < VIEW_W; x += 34 + rnd() * 70) {
    if (rnd() < 0.25) continue;
    autumnTree(ctx, x, heightAt(pts, x) + 16, 16 + rnd() * 16, crowns[Math.floor(rnd() * crowns.length)]);
  }

  // stubble field
  const field = ctx.createLinearGradient(0, 1430, 0, 1600);
  field.addColorStop(0, '#CB9548'); field.addColorStop(1, '#A9763A');
  layer(ctx, field, () => { pts = ridge(ctx, rnd, 1440, 1470, 3, VIEW_H); });
  ctx.strokeStyle = 'rgba(122,82,36,0.45)'; ctx.lineWidth = 3;
  for (let i = 0; i < 9; i++) {
    const y = 1480 + i * 12 + i * i * 1.5;
    ctx.beginPath(); ctx.moveTo(-20, y + 10); ctx.quadraticCurveTo(VIEW_W / 2, y - 14, VIEW_W + 20, y + 10); ctx.stroke();
  }
  // rail fence on the left, hay and pumpkins
  ctx.strokeStyle = '#6B4630'; ctx.lineWidth = 7; ctx.lineCap = 'round';
  for (let x = 30; x < 360; x += 72) { ctx.beginPath(); ctx.moveTo(x, 1468 + x * 0.04); ctx.lineTo(x, 1520 + x * 0.04); ctx.stroke(); }
  ctx.lineWidth = 6;
  for (const dy of [0, 22]) { ctx.beginPath(); ctx.moveTo(18, 1480 + dy); ctx.lineTo(370, 1494 + dy); ctx.stroke(); }
  haybale(ctx, 860, 1500, 46);
  haybale(ctx, 960, 1520, 38);
  pumpkin(ctx, 420, 1528, 22);

  grain(ctx, VIEW_W, VIEW_H, 14, rnd);
  return c;
}

/** Grass in front of everything that falls, with the bow's knoll. Top edge is ragged so birds sink into it. */
export function drawForeground(): HTMLCanvasElement {
  const h = VIEW_H - FOREGROUND_TOP;
  const { c, ctx } = makeCanvas(VIEW_W, h);
  const rnd = scenicRng(2026);
  const g = ctx.createLinearGradient(0, 30, 0, h);
  g.addColorStop(0, '#6F7C35'); g.addColorStop(1, C.moss);
  ctx.save();
  ctx.shadowColor = LAYER_SHADOW; ctx.shadowBlur = 24; ctx.shadowOffsetY = -8;
  ctx.beginPath();
  ctx.moveTo(0, h);
  ctx.lineTo(0, 70);
  for (let x = 0; x <= VIEW_W; x += 14) {
    const knoll = 70 - 46 * Math.exp(-(((x - VIEW_W / 2) / 260) ** 2));
    const tip = knoll - 18 - rnd() * 26;
    ctx.lineTo(x + 5, tip);
    ctx.lineTo(x + 12, knoll + 4);
  }
  ctx.lineTo(VIEW_W, h);
  ctx.closePath();
  ctx.fillStyle = g;
  ctx.fill();
  ctx.restore();
  // blades and fallen leaves
  for (let i = 0; i < 160; i++) {
    const x = rnd() * VIEW_W, y = 80 + rnd() * (h - 90);
    ctx.strokeStyle = rnd() < 0.5 ? 'rgba(140,152,72,0.6)' : 'rgba(52,62,22,0.6)';
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + (rnd() - 0.5) * 10, y - 12 - rnd() * 14); ctx.stroke();
  }
  const leaves = ['#B4532A', '#D9822B', '#E2B33C', '#9E3B27'];
  for (let i = 0; i < 26; i++) {
    ellipse(ctx, rnd() * VIEW_W, 110 + rnd() * (h - 130), 8, 4, leaves[i % leaves.length], rnd() * Math.PI);
  }
  grain(ctx, VIEW_W, h, 12, rnd);
  return c;
}

export function drawCloud(w: number, seed: number): HTMLCanvasElement {
  const h = Math.round(w * 0.42);
  const { c, ctx } = makeCanvas(w + 24, h + 24);
  const rnd = scenicRng(seed);
  ctx.translate(12, 12);
  const base = h - 6;
  // a flat-bottomed paper cut: overlapping puffs sitting on one baseline
  const puffs: [number, number][] = [];
  let x = w * 0.12;
  while (x < w * 0.9) {
    const r = (0.13 + rnd() * 0.12) * w * (1 - Math.abs(x / w - 0.5) * 0.9);
    puffs.push([x, Math.max(r, w * 0.07)]);
    x += r * (0.9 + rnd() * 0.4);
  }
  const shape = () => {
    ctx.beginPath();
    ctx.roundRect(0, base - w * 0.09, w, w * 0.09, w * 0.045);
    for (const [px, r] of puffs) { ctx.moveTo(px + r, base - r * 0.7); ctx.arc(px, base - r * 0.7, r, 0, Math.PI * 2); }
  };
  ctx.save();
  ctx.beginPath();
  ctx.rect(-12, -12, w + 24, base + 12);
  ctx.clip();
  shape();
  ctx.fillStyle = '#F2C0A6';
  ctx.fill();
  ctx.restore();
  ctx.fillStyle = 'rgba(142,74,92,0.35)';
  ctx.fillRect(w * 0.02, base - 9, w * 0.96, 9);
  return c;
}
