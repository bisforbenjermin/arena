/**
 * Canvas composables — extracted from F4 reference games.
 * Agent prompt injects these so generated views share a baseline look.
 *
 * All functions are pure: they take a CanvasRenderingContext2D and draw.
 * Nothing here holds state or listens to events.
 */

/** Standard background fill used across all Arcade Realm games. */
export function fillBackground(ctx: CanvasRenderingContext2D, w: number, h: number): void {
  ctx.fillStyle = '#0a0a14';
  ctx.fillRect(0, 0, w, h);
}

/** Bottom-edge tick progress bar. p is 0–1. */
export function drawProgressBar(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  p: number,
  color = '#00ffcc',
): void {
  ctx.fillStyle = '#1a1a2e';
  ctx.fillRect(0, h - 6, w, 6);
  ctx.fillStyle = color;
  ctx.fillRect(0, h - 6, w * Math.max(0, Math.min(1, p)), 6);
}

/** Centred score line at top. */
export function drawScoreLabel(
  ctx: CanvasRenderingContext2D,
  w: number,
  text: string,
  color = '#ffffff',
): void {
  ctx.fillStyle  = color;
  ctx.font       = 'bold 26px monospace';
  ctx.textAlign  = 'center';
  ctx.fillText(text, w / 2, 38);
}

/**
 * Neon-style circle: outer glow ring + inner solid dot.
 * Used by precision-tap and any agent game that needs a tap target.
 */
export function drawNeonCircle(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  outerRadius: number,
  innerRadius: number,
  alpha: number,
  color = '#00ffcc',
): void {
  ctx.beginPath();
  ctx.arc(cx, cy, outerRadius, 0, Math.PI * 2);
  ctx.strokeStyle = `rgba(0,255,204,${alpha})`;
  ctx.lineWidth   = 2;
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(cx, cy, innerRadius, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();
}

/**
 * Rounded-rect button. Drawn filled + stroked.
 * active=true → accent fill; false → dim background.
 */
export function drawButton(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  label: string,
  active: boolean,
): void {
  ctx.fillStyle   = active ? 'rgba(0,255,204,0.15)' : '#1a1a2e';
  ctx.strokeStyle = active ? '#00ffcc' : '#334455';
  ctx.lineWidth   = 2;
  ctx.beginPath();
  ctx.rect(x, y, w, h);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle  = active ? '#00ffcc' : '#556677';
  ctx.font       = 'bold 18px monospace';
  ctx.textAlign  = 'center';
  ctx.fillText(label, x + w / 2, y + h * 0.62);
}
