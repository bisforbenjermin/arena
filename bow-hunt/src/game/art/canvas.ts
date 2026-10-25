// Small canvas helpers for drawing textures at boot. View-only code: floats and Math.random are fine here.
export type Ctx = CanvasRenderingContext2D;

export function makeCanvas(w: number, h: number): { c: HTMLCanvasElement; ctx: Ctx } {
  const c = document.createElement('canvas');
  c.width = Math.ceil(w); c.height = Math.ceil(h);
  const ctx = c.getContext('2d')!;
  return { c, ctx };
}

/** Same shape in one flat color. */
export function silhouette(src: HTMLCanvasElement, color: string): HTMLCanvasElement {
  const { c, ctx } = makeCanvas(src.width, src.height);
  ctx.drawImage(src, 0, 0);
  ctx.globalCompositeOperation = 'source-in';
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, c.width, c.height);
  return c;
}

/**
 * Turns art into a cut-paper sticker: a paper border around the silhouette and a soft lifted shadow.
 * `draw` paints centered on (w/2, h/2) of a w×h canvas; the result is padded by `pad` on every side.
 */
export function sticker(w: number, h: number, draw: (ctx: Ctx) => void, border = 6, paper = '#F7ECD8', shadow = 'rgba(43,29,36,0.45)'): HTMLCanvasElement {
  const art = makeCanvas(w, h);
  art.ctx.translate(w / 2, h / 2);
  draw(art.ctx);
  const pad = border + 14;
  const ring = makeCanvas(w + pad * 2, h + pad * 2);
  const sil = silhouette(art.c, paper);
  for (let i = 0; i < 24; i++) {
    const a = (i / 24) * Math.PI * 2;
    ring.ctx.drawImage(sil, pad + Math.cos(a) * border, pad + Math.sin(a) * border);
  }
  ring.ctx.drawImage(sil, pad, pad);
  const out = makeCanvas(w + pad * 2, h + pad * 2);
  out.ctx.save();
  out.ctx.shadowColor = shadow;
  out.ctx.shadowBlur = 10;
  out.ctx.shadowOffsetY = 5;
  out.ctx.drawImage(ring.c, 0, 0);
  out.ctx.restore();
  out.ctx.drawImage(art.c, pad, pad);
  return out.c;
}

export function ellipse(ctx: Ctx, x: number, y: number, rx: number, ry: number, fill: string | CanvasGradient, rot = 0): void {
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, rot, 0, Math.PI * 2);
  ctx.fillStyle = fill;
  ctx.fill();
}

export function circle(ctx: Ctx, x: number, y: number, r: number, fill: string | CanvasGradient): void {
  ellipse(ctx, x, y, r, r, fill);
}

/** Seeded float RNG for repeatable scenery (so the backdrop doesn't change between loads). */
export function scenicRng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
