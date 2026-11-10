import type { Shape } from "./types";

export function makeUtils(ctx: CanvasRenderingContext2D, S: number, shape: Shape, color: string) {
  const N = 5, g = 3, cs = (S - (N - 1) * g) / N;

  // Stable pseudo-random 0..1 per input.
  function frac(n: number) {
    const x = Math.sin(n) * 43758.5453;
    return x - Math.floor(x);
  }

  // Device pixels per canvas unit, read from the current transform (0 if unknown).
  function unit() {
    const m = ctx.getTransform && ctx.getTransform();
    return m && m.a > 0 ? m.a : 0;
  }

  // Snaps a cell to whole device pixels so small icons stay crisp: same center, a whole-pixel
  // size, and at least one clear pixel to the next cell (`gap` is the spacing in canvas units).
  function shapePath(x: number, y: number, s: number, radius: number, gap: number) {
    const k = unit();
    if (k) {
      const px = Math.min(Math.round(s * k), Math.floor((s + gap) * k) - 1);
      if (px >= 1) {
        const n = px / k;
        x = Math.round((x + s / 2 - n / 2) * k) / k;
        y = Math.round((y + s / 2 - n / 2) * k) / k;
        radius *= n / s;
        s = n;
      }
    }
    ctx.beginPath();
    if (shape === "circle") ctx.arc(x + s / 2, y + s / 2, s / 2, 0, 6.2832);
    else if (shape === "diamond") {
      ctx.moveTo(x + s / 2, y);
      ctx.lineTo(x + s, y + s / 2);
      ctx.lineTo(x + s / 2, y + s);
      ctx.lineTo(x, y + s / 2);
      ctx.closePath();
    } else if (shape === "square") ctx.rect(x, y, s, s);
    else ctx.roundRect(x, y, s, s, radius);
  }

  function fill(alpha: number) {
    ctx.globalAlpha = alpha;
    ctx.fillStyle = color;
    ctx.fill();
    ctx.globalAlpha = 1;
  }

  const clamp = (a: number) => Math.max(0, Math.min(1, a));

  // 5×5 cell with a 10% floor, so unlit cells show as a dim grid.
  function cell(i: number, j: number, a: number) {
    shapePath(i * (cs + g), j * (cs + g), cs, 2.5, g);
    fill(0.1 + 0.9 * clamp(a));
  }

  // Same geometry, no floor: unlit cells are invisible.
  function cellA(i: number, j: number, a: number) {
    a = clamp(a);
    if (a < 0.02) return;
    shapePath(i * (cs + g), j * (cs + g), cs, 2.5, g);
    fill(a);
  }

  // Finer n×n grid (used by the 7×7 radial loaders).
  function cellN(n: number, i: number, j: number, a: number) {
    const g2 = 2, csn = (S - (n - 1) * g2) / n;
    shapePath(i * (csn + g2), j * (csn + g2), csn, csn * 0.28, g2);
    fill(0.1 + 0.9 * clamp(a));
  }

  // Free-floating circle.
  function dot(x: number, y: number, r: number, a: number) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 6.2832);
    fill(0.1 + 0.9 * clamp(a));
  }

  return { S, N, color, cell, cellA, cellN, dot, frac };
}

export type GridUtils = ReturnType<typeof makeUtils>;
