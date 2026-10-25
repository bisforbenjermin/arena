import { C } from '../config';
import { circle, makeCanvas } from './canvas';
import { birdIcon } from './birds';

/** Arrow pointing right. The tip is at (w-2, h/2), so the sprite origin can sit on the engine's arrow position. `fire` adds a burning head. */
export function drawArrow(fire = false): HTMLCanvasElement {
  const w = 104, h = 20;
  const { c, ctx } = makeCanvas(w, h);
  const y = h / 2;
  ctx.lineCap = 'round';
  ctx.strokeStyle = C.ink; ctx.lineWidth = 7;
  ctx.beginPath(); ctx.moveTo(10, y); ctx.lineTo(w - 18, y); ctx.stroke();
  ctx.strokeStyle = '#D1A25F'; ctx.lineWidth = 4;
  ctx.beginPath(); ctx.moveTo(10, y); ctx.lineTo(w - 18, y); ctx.stroke();
  for (const [dy, col] of [[-1, C.cranberry], [1, C.paper]] as const) {
    ctx.beginPath(); ctx.moveTo(4, y + dy * 8); ctx.lineTo(28, y + dy * 1.5); ctx.lineTo(14, y + dy * 1.5); ctx.closePath();
    ctx.fillStyle = col; ctx.fill(); ctx.strokeStyle = C.ink; ctx.lineWidth = 1.5; ctx.stroke();
  }
  ctx.beginPath(); ctx.moveTo(w - 2, y); ctx.lineTo(w - 22, y - 7); ctx.lineTo(w - 18, y); ctx.lineTo(w - 22, y + 7); ctx.closePath();
  ctx.fillStyle = fire ? '#FF7A1A' : '#C9CED6'; ctx.fill(); ctx.strokeStyle = C.ink; ctx.lineWidth = 2; ctx.stroke();
  if (fire) {
    ctx.globalCompositeOperation = 'destination-over';
    const g = ctx.createRadialGradient(w - 12, y, 1, w - 12, y, 12);
    g.addColorStop(0, 'rgba(255,214,90,1)'); g.addColorStop(1, 'rgba(255,90,20,0)');
    ctx.fillStyle = g; ctx.fillRect(w - 26, 0, 26, h);
  }
  return c;
}

/** Arrow bundle tied to a red balloon: shoot it for +3 arrows. */
export function drawQuiverPickup(): HTMLCanvasElement {
  const { c, ctx } = makeCanvas(110, 150);
  ctx.translate(55, 0);
  ctx.save(); ctx.shadowColor = 'rgba(43,29,36,0.45)'; ctx.shadowBlur = 8; ctx.shadowOffsetY = 4;
  ctx.beginPath(); ctx.ellipse(0, 34, 28, 32, 0, 0, Math.PI * 2); ctx.fillStyle = '#F7ECD8'; ctx.fill();
  ctx.restore();
  ctx.beginPath(); ctx.ellipse(0, 34, 23, 27, 0, 0, Math.PI * 2); ctx.fillStyle = C.cranberry; ctx.fill();
  ctx.beginPath(); ctx.ellipse(-8, 24, 6, 9, -0.4, 0, Math.PI * 2); ctx.fillStyle = 'rgba(255,255,255,0.45)'; ctx.fill();
  ctx.strokeStyle = '#E8D6B0'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(0, 61); ctx.quadraticCurveTo(6, 74, 0, 84); ctx.stroke();
  ctx.save(); ctx.translate(0, 112); ctx.rotate(0.12);
  ctx.fillStyle = C.ink; ctx.beginPath(); ctx.roundRect(-17, -24, 34, 54, 7); ctx.fill();
  ctx.fillStyle = '#8A5A44'; ctx.beginPath(); ctx.roundRect(-14, -21, 28, 48, 5); ctx.fill();
  for (const dx of [-8, 0, 8]) {
    ctx.strokeStyle = '#D1A25F'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(dx, -22); ctx.lineTo(dx, -36); ctx.stroke();
    ctx.fillStyle = dx === 0 ? C.paper : C.cranberry; ctx.beginPath(); ctx.moveTo(dx - 4, -34); ctx.lineTo(dx, -42); ctx.lineTo(dx + 4, -34); ctx.fill();
  }
  ctx.fillStyle = C.paper; ctx.font = 'bold 20px Georgia, serif'; ctx.textAlign = 'center'; ctx.fillText('+3', 0, 12);
  ctx.restore();
  return c;
}

/** Fire-arrow token: a burning arrowhead in a ring. Shoot it for 5 fire arrows. */
export function drawFirePickup(): HTMLCanvasElement {
  const { c, ctx } = makeCanvas(110, 110);
  ctx.translate(55, 55);
  ctx.save(); ctx.shadowColor = 'rgba(43,29,36,0.45)'; ctx.shadowBlur = 8; ctx.shadowOffsetY = 4;
  circle(ctx, 0, 0, 40, '#F7ECD8');
  ctx.restore();
  const g = ctx.createRadialGradient(0, 6, 4, 0, 0, 36);
  g.addColorStop(0, '#FFE08A'); g.addColorStop(0.55, '#FF8A1F'); g.addColorStop(1, '#C2301A');
  circle(ctx, 0, 0, 35, g);
  ctx.beginPath();
  ctx.moveTo(0, -26); ctx.quadraticCurveTo(16, -6, 10, 14); ctx.quadraticCurveTo(4, 24, 0, 26); ctx.quadraticCurveTo(-4, 24, -10, 14); ctx.quadraticCurveTo(-16, -6, 0, -26);
  ctx.fillStyle = '#FFF6D1'; ctx.fill();
  ctx.beginPath(); ctx.moveTo(0, -16); ctx.lineTo(9, 6); ctx.lineTo(0, 2); ctx.lineTo(-9, 6); ctx.closePath();
  ctx.fillStyle = C.ink; ctx.fill();
  return c;
}

/** Recurve bow, string side on the left. Limb tips at (BOW_TIP.x, ±BOW_TIP.y) from the grip, which sits at the canvas center. */
export const BOW_SIZE = { w: 120, h: 330 };
export const BOW_TIP = { x: -18, y: 148 };
type BowLook = { limbDark: string; limbLight: string; grip: string; shape: 'recurve' | 'long' | 'compound' | 'cross'; curl: number; trim?: string; sight?: string };
/** Indexed like BOWS in the engine: hunting bow, recurve, longbow, compound, crossbow. */
const BOW_LOOKS: BowLook[] = [
  { limbDark: '#9A5B2E', limbLight: '#D79B55', grip: C.cranberry, shape: 'recurve', curl: 4 },
  { limbDark: '#4E2A18', limbLight: '#9C5A2C', grip: '#2B1D24', shape: 'recurve', curl: 14, trim: C.gold, sight: C.gold },
  { limbDark: '#B07A34', limbLight: '#EBC98A', grip: '#3E5A1E', shape: 'long', curl: 0, trim: C.paper },
  { limbDark: '#5D6873', limbLight: '#D3DBE2', grip: '#1E2228', shape: 'compound', curl: 0, trim: C.cranberry, sight: '#7CFF8A' },
  { limbDark: '#26272B', limbLight: '#6B6F78', grip: '#5A3622', shape: 'cross', curl: 0, trim: C.cranberry, sight: C.gold },
];

/** One texture per bow. Same tip geometry for all, so one string drawing fits every bow. */
export function drawBow(index = 0): HTMLCanvasElement {
  const look = BOW_LOOKS[index];
  const { c, ctx } = makeCanvas(BOW_SIZE.w, BOW_SIZE.h);
  ctx.translate(BOW_SIZE.w / 2, BOW_SIZE.h / 2);
  if (look.shape === 'cross') {   // stock runs along the shot, under the bolt
    ctx.fillStyle = C.ink; ctx.beginPath(); ctx.roundRect(-48, -11, 104, 22, 6); ctx.fill();
    ctx.fillStyle = look.grip; ctx.beginPath(); ctx.roundRect(-45, -8, 98, 16, 5); ctx.fill();
    ctx.fillStyle = C.ink; ctx.fillRect(-30, 8, 10, 22);
  }
  const limb = (s: 1 | -1) => {
    ctx.beginPath();
    ctx.moveTo(10, 0);
    if (look.shape === 'compound') {
      ctx.lineTo(30, s * 40); ctx.lineTo(BOW_TIP.x + 14, s * (BOW_TIP.y - 6)); ctx.lineTo(BOW_TIP.x, s * BOW_TIP.y);
    } else if (look.shape === 'long') {
      ctx.quadraticCurveTo(30, s * 90, BOW_TIP.x, s * BOW_TIP.y);
    } else if (look.shape === 'cross') {
      ctx.quadraticCurveTo(26, s * 70, BOW_TIP.x + 4, s * (BOW_TIP.y - 30));
      ctx.lineTo(BOW_TIP.x, s * BOW_TIP.y);
    } else {
      ctx.bezierCurveTo(44, s * 40, 34, s * 120, BOW_TIP.x + 6, s * (BOW_TIP.y - 4));
      ctx.quadraticCurveTo(BOW_TIP.x - look.curl, s * (BOW_TIP.y + 8), BOW_TIP.x, s * BOW_TIP.y);
    }
  };
  const heavy = look.shape === 'compound' || look.shape === 'cross';
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  for (const s of [1, -1] as const) {
    ctx.strokeStyle = C.ink; ctx.lineWidth = heavy ? 19 : 17; limb(s); ctx.stroke();
    const g = ctx.createLinearGradient(0, 0, 0, s * 150);
    g.addColorStop(0, look.limbDark); g.addColorStop(1, look.limbLight);
    ctx.strokeStyle = g; ctx.lineWidth = heavy ? 13 : 11; limb(s); ctx.stroke();
    if (look.trim) circle(ctx, BOW_TIP.x, s * BOW_TIP.y, heavy ? 4 : 6, look.trim);
    if (look.shape === 'compound') {
      circle(ctx, BOW_TIP.x, s * BOW_TIP.y, 15, C.ink);
      circle(ctx, BOW_TIP.x, s * BOW_TIP.y, 11, '#9AA6B2');
      circle(ctx, BOW_TIP.x + 3, s * BOW_TIP.y, 4, C.ink);
    }
  }
  if (look.shape !== 'cross') {
    ctx.fillStyle = C.ink;
    ctx.beginPath(); ctx.roundRect(0, -32, 28, 64, 8); ctx.fill();
    ctx.fillStyle = look.grip;
    ctx.beginPath(); ctx.roundRect(3, -29, 22, 58, 6); ctx.fill();
    ctx.strokeStyle = 'rgba(247,236,216,0.5)'; ctx.lineWidth = 2;
    for (let i = -24; i < 26; i += 8) { ctx.beginPath(); ctx.moveTo(4, i); ctx.lineTo(24, i + 5); ctx.stroke(); }
  }
  if (look.sight) {
    ctx.fillStyle = C.ink; ctx.fillRect(26, -46, 14, 6);
    circle(ctx, 42, -43, 5, look.sight);
  }
  return c;
}

/** Shooting star: a gold five-point star with a paper edge. */
export function drawStar(): HTMLCanvasElement {
  const { c, ctx } = makeCanvas(120, 120);
  ctx.translate(60, 60);
  const path = (R: number, r: number) => {
    ctx.beginPath();
    for (let i = 0; i < 10; i++) {
      const rad = i % 2 === 0 ? R : r;
      const a = (i / 10) * Math.PI * 2 - Math.PI / 2;
      ctx.lineTo(Math.cos(a) * rad, Math.sin(a) * rad);
    }
    ctx.closePath();
  };
  ctx.save();
  ctx.shadowColor = 'rgba(43,29,36,0.45)'; ctx.shadowBlur = 10; ctx.shadowOffsetY = 5;
  ctx.lineJoin = 'round';
  path(46, 20); ctx.fillStyle = '#FFF8E1'; ctx.fill();
  ctx.restore();
  path(38, 16);
  const g = ctx.createRadialGradient(-6, -8, 4, 0, 0, 40);
  g.addColorStop(0, '#FFF6C9'); g.addColorStop(0.6, '#F2C14E'); g.addColorStop(1, '#D9921E');
  ctx.fillStyle = g; ctx.fill();
  circle(ctx, -8, -8, 5, 'rgba(255,255,255,0.8)');
  return c;
}

export const SHEET_CELL = { w: 48, h: 40 };

/** A strip of pre-colored cells, so nothing depends on tinting (the 2D fallback renderer can't tint). */
export function drawSheet(colors: string[], paint: (ctx: CanvasRenderingContext2D, color: string) => void): HTMLCanvasElement {
  const { c, ctx } = makeCanvas(SHEET_CELL.w * colors.length, SHEET_CELL.h);
  colors.forEach((col, i) => {
    ctx.save();
    ctx.translate(i * SHEET_CELL.w + SHEET_CELL.w / 2, SHEET_CELL.h / 2);
    paint(ctx, col);
    ctx.restore();
  });
  return c;
}

export function paintFeather(ctx: CanvasRenderingContext2D, color: string): void {
  ctx.beginPath(); ctx.moveTo(-17, 0); ctx.quadraticCurveTo(-4, -8, 16, -1); ctx.quadraticCurveTo(-2, 7, -17, 0); ctx.closePath();
  ctx.fillStyle = color; ctx.fill();
  ctx.strokeStyle = 'rgba(43,29,36,0.45)'; ctx.lineWidth = 1.2;
  ctx.beginPath(); ctx.moveTo(-17, 0); ctx.lineTo(15, -1); ctx.stroke();
}

export function paintLeaf(ctx: CanvasRenderingContext2D, color: string): void {
  ctx.beginPath(); ctx.ellipse(0, 0, 12, 6, 0.3, 0, Math.PI * 2);
  ctx.fillStyle = color; ctx.fill();
  ctx.strokeStyle = 'rgba(43,29,36,0.35)'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(-11, -3); ctx.lineTo(11, 3); ctx.stroke();
}

export function paintPip(ctx: CanvasRenderingContext2D, color: string): void {
  ctx.translate(0, 2);
  birdIcon(ctx, color);
}

export function drawSparkle(): HTMLCanvasElement {
  const { c, ctx } = makeCanvas(40, 40);
  ctx.translate(20, 20);
  ctx.beginPath();
  for (let i = 0; i < 8; i++) {
    const r = i % 2 === 0 ? 19 : 4.5;
    const a = (i / 8) * Math.PI * 2 - Math.PI / 2;
    ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
  }
  ctx.closePath();
  ctx.fillStyle = '#FFF6D1';
  ctx.fill();
  return c;
}

export function drawPuff(): HTMLCanvasElement {
  const { c, ctx } = makeCanvas(64, 64);
  const g = ctx.createRadialGradient(32, 32, 4, 32, 32, 30);
  g.addColorStop(0, 'rgba(247,236,216,0.9)');
  g.addColorStop(1, 'rgba(247,236,216,0)');
  circle(ctx, 32, 32, 30, g);
  return c;
}

export function drawGlow(): HTMLCanvasElement {
  const { c, ctx } = makeCanvas(220, 220);
  const g = ctx.createRadialGradient(110, 110, 10, 110, 110, 108);
  g.addColorStop(0, 'rgba(255,230,140,0.85)');
  g.addColorStop(0.5, 'rgba(242,193,78,0.35)');
  g.addColorStop(1, 'rgba(242,193,78,0)');
  circle(ctx, 110, 110, 108, g);
  return c;
}


/** Upright arrow for the quiver count. */
export function drawQuiverArrow(): HTMLCanvasElement {
  const { c, ctx } = makeCanvas(18, 84);
  ctx.translate(9, 0);
  ctx.strokeStyle = C.ink; ctx.lineWidth = 6; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(0, 14); ctx.lineTo(0, 80); ctx.stroke();
  ctx.strokeStyle = '#D1A25F'; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(0, 14); ctx.lineTo(0, 80); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(0, 2); ctx.lineTo(-6, 16); ctx.lineTo(6, 16); ctx.closePath();
  ctx.fillStyle = '#C9CED6'; ctx.fill(); ctx.strokeStyle = C.ink; ctx.lineWidth = 1.5; ctx.stroke();
  for (const s of [-1, 1]) {
    ctx.beginPath(); ctx.moveTo(0, 62); ctx.lineTo(s * 7, 70); ctx.lineTo(s * 7, 82); ctx.lineTo(0, 76); ctx.closePath();
    ctx.fillStyle = s < 0 ? C.cranberry : C.paper; ctx.fill(); ctx.strokeStyle = C.ink; ctx.lineWidth = 1.2; ctx.stroke();
  }
  return c;
}
