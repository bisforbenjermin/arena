import {
  BOW_X, BOW_Y, DRAW_MAX_TICKS, GROUND_Y, MILLI, TURKEY_RADIUS, WORLD_H, WORLD_W, WAVES_PER_ROUND,
} from '../engine/constants';
import type { GameState, Turkey } from '../engine/types';
import type { Point } from './input';

const FEATHERS = ['#C1502E', '#E0A458', '#8C3B1E', '#E0A458', '#C1502E'];

function drawTurkey(ctx: CanvasRenderingContext2D, t: Turkey) {
  const x = t.pos.x / MILLI, y = t.pos.y / MILLI;
  ctx.save();
  ctx.translate(x, y);
  if (t.status === 'falling') ctx.rotate(Math.PI);
  // Feather fan behind the body
  for (let i = 0; i < 5; i++) {
    const a = -Math.PI / 2 + (i - 2) * 0.42;
    ctx.save();
    ctx.rotate(a);
    ctx.fillStyle = FEATHERS[i];
    ctx.beginPath();
    ctx.ellipse(0, -TURKEY_RADIUS * 0.95, 9, TURKEY_RADIUS * 0.8, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
  // Body
  ctx.fillStyle = '#7A4A2A';
  ctx.beginPath();
  ctx.arc(0, 0, TURKEY_RADIUS, 0, Math.PI * 2);
  ctx.fill();
  // Wing
  ctx.fillStyle = '#5E3820';
  ctx.beginPath();
  ctx.ellipse(-6, 6, 14, 9, -0.4, 0, Math.PI * 2);
  ctx.fill();
  // Head
  const dir = t.vel.x < 0 ? -1 : 1;
  ctx.fillStyle = '#B23A48';
  ctx.beginPath();
  ctx.arc(dir * (TURKEY_RADIUS - 4), -TURKEY_RADIUS + 10, 8, 0, Math.PI * 2);
  ctx.fill();
  // Beak
  ctx.fillStyle = '#E8B33A';
  ctx.beginPath();
  ctx.moveTo(dir * (TURKEY_RADIUS + 3), -TURKEY_RADIUS + 9);
  ctx.lineTo(dir * (TURKEY_RADIUS + 10), -TURKEY_RADIUS + 12);
  ctx.lineTo(dir * (TURKEY_RADIUS + 3), -TURKEY_RADIUS + 14);
  ctx.fill();
  ctx.restore();
}

export function drawFrame(ctx: CanvasRenderingContext2D, s: GameState, aim: Point) {
  // Sky
  const sky = ctx.createLinearGradient(0, 0, 0, GROUND_Y);
  sky.addColorStop(0, '#F4A259');
  sky.addColorStop(1, '#F7D08A');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, WORLD_W, GROUND_Y);
  // Setting sun and distant hills
  ctx.fillStyle = 'rgba(255, 241, 214, 0.55)';
  ctx.beginPath();
  ctx.arc(760, GROUND_Y - 40, 70, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#C98A4B';
  ctx.beginPath();
  ctx.moveTo(0, GROUND_Y);
  for (let x = 0; x <= WORLD_W; x += 40) ctx.lineTo(x, GROUND_Y - 30 - 18 * Math.sin(x / 90));
  ctx.lineTo(WORLD_W, GROUND_Y);
  ctx.fill();
  // Ground
  ctx.fillStyle = '#6B8F3A';
  ctx.fillRect(0, GROUND_Y, WORLD_W, WORLD_H - GROUND_Y);
  ctx.fillStyle = '#5C7D31';
  for (let x = 8; x < WORLD_W; x += 22) ctx.fillRect(x, GROUND_Y, 3, 7);

  for (const t of s.turkeys) if (t.status !== 'gone') drawTurkey(ctx, t);

  // Arrows
  ctx.strokeStyle = '#3B2A1A';
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';
  for (const a of s.arrows) {
    const x = a.pos.x / MILLI, y = a.pos.y / MILLI;
    const len = Math.hypot(a.vel.x, a.vel.y) || 1;
    const ux = a.vel.x / len, uy = a.vel.y / len;
    ctx.beginPath();
    ctx.moveTo(x - ux * 24, y - uy * 24);
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.fillStyle = '#F2EDE4';
    ctx.beginPath();
    ctx.moveTo(x - ux * 24, y - uy * 24);
    ctx.lineTo(x - ux * 18 - uy * 5, y - uy * 18 + ux * 5);
    ctx.lineTo(x - ux * 18 + uy * 5, y - uy * 18 - ux * 5);
    ctx.fill();
  }

  // Bow, oriented toward the aim point
  const angle = Math.atan2(aim.y - BOW_Y, aim.x - BOW_X);
  const pull = (s.drawTicks / DRAW_MAX_TICKS) * 20;
  ctx.save();
  ctx.translate(BOW_X, BOW_Y);
  ctx.rotate(angle);
  ctx.strokeStyle = '#5A3B1F';
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.arc(0, 0, 30, -Math.PI / 2, Math.PI / 2);
  ctx.stroke();
  ctx.strokeStyle = '#EDE6D6';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(0, -30);
  ctx.lineTo(-pull, 0);
  ctx.lineTo(0, 30);
  ctx.stroke();
  if (s.phase === 'playing' && s.arrowsLeft > 0) {
    ctx.strokeStyle = '#3B2A1A';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(-pull, 0);
    ctx.lineTo(34, 0);
    ctx.stroke();
  }
  ctx.setLineDash([6, 6]);
  ctx.strokeStyle = 'rgba(59, 42, 26, 0.55)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(36, 0);
  ctx.lineTo(156, 0);
  ctx.stroke();
  ctx.restore();

  // Power bar
  const frac = s.drawTicks / DRAW_MAX_TICKS;
  ctx.fillStyle = 'rgba(30, 22, 12, 0.35)';
  ctx.fillRect(16, WORLD_H - 28, 200, 12);
  ctx.fillStyle = frac >= 1 ? '#F2C14E' : '#E07A3F';
  ctx.fillRect(16, WORLD_H - 28, 200 * frac, 12);

  // Wave banner during intermission
  if (s.phase === 'intermission') {
    const w = s.waveIndex;
    const round = s.plan.waves[w].round;
    ctx.fillStyle = 'rgba(59, 42, 26, 0.75)';
    ctx.font = '600 28px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`Round ${round + 1} · Wave ${(w % WAVES_PER_ROUND) + 1}`, WORLD_W / 2, 200);
    ctx.textAlign = 'start';
  }
}
