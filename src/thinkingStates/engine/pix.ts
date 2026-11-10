import type { Shape } from "./types";

export function makePix(ctx: CanvasRenderingContext2D, S: number, shape: Shape, color: string, scale = 1) {
  // A cols×rows dot field, centered in the canvas. Unlit dots are invisible.
  function pix(cols: number, rows: number, i: number, j: number, a: number) {
    a = Math.max(0, Math.min(1, a));
    if (a < 0.02) return;
    const gap = 2.4;
    // One dot size for every chip: the size a 5-wide field fits, so the dots don't grow on a
    // small field (3×3, 2×4). A field wider or taller than 5 still shrinks to fit the canvas.
    const DOT = (S - 6) / 5 - gap;
    const size = Math.min(DOT, (S - 6) / cols - gap, (S - 6) / rows - gap) * scale;
    const w = cols * (size + gap) - gap, h = rows * (size + gap) - gap;
    let x = (S - w) / 2 + i * (size + gap), y = (S - h) / 2 + j * (size + gap), s = size;
    // Snap to whole device pixels so small icons stay crisp: same center, a whole-pixel size,
    // and at least one clear pixel to the next dot.
    const m = ctx.getTransform && ctx.getTransform(), k = m && m.a > 0 ? m.a : 0;
    if (k) {
      const px = Math.min(Math.round(size * k), Math.floor((size + gap) * k) - 1);
      if (px >= 1) {
        s = px / k;
        x = Math.round((x + size / 2 - s / 2) * k) / k;
        y = Math.round((y + size / 2 - s / 2) * k) / k;
      }
    }
    ctx.globalAlpha = a;
    ctx.fillStyle = color;
    ctx.beginPath();
    if (shape === "circle") ctx.arc(x + s / 2, y + s / 2, s / 2, 0, 6.2832);
    else if (shape === "diamond") {
      ctx.moveTo(x + s / 2, y);
      ctx.lineTo(x + s, y + s / 2);
      ctx.lineTo(x + s / 2, y + s);
      ctx.lineTo(x, y + s / 2);
      ctx.closePath();
    } else if (shape === "square") ctx.rect(x, y, s, s);
    else ctx.roundRect(x, y, s, s, s * 0.45);
    ctx.fill();
    ctx.globalAlpha = 1;
  }

  return { S, pix };
}

export type PixUtils = ReturnType<typeof makePix>;
