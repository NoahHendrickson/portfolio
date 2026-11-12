/*
  The outline `Interlock` draws: one surface traced round a set of boxes, every
  corner rounded, convex and concave alike, so neighbouring pieces read as one
  shape joined by the rail's concave curve. Apart from the component so the
  component file exports only components (Fast Refresh).
*/

export type Box = { x: number; y: number; w: number; h: number }

/** A cubic's handle length for a quarter circle. */
const K = 0.5523

/**
 * The union of axis-aligned boxes as an SVG path. Each corner is rounded at
 * `radius` (convex) or `concave` (an inside step), never more than half of
 * either edge it joins, so a short step still turns cleanly. Boxes that only
 * touch along an edge merge; the trace runs clockwise round the outside and
 * the other way round any hole, so `fill-rule: nonzero` keeps holes open.
 * `carve` boxes are cut out of the union afterwards; `concave` can be a
 * function of the corner's position, for a notch that wants its own curve.
 */
export function unionPath(
  boxes: Box[],
  radius: number,
  concave: number | ((x: number, y: number) => number) = radius,
  carve: Box[] = [],
): string {
  if (!boxes.length) return ''
  const all = [...boxes, ...carve]
  const xs = [...new Set(all.flatMap((b) => [b.x, b.x + b.w]))].sort((a, b) => a - b)
  const ys = [...new Set(all.flatMap((b) => [b.y, b.y + b.h]))].sort((a, b) => a - b)
  const cols = xs.length - 1
  const rows = ys.length - 1
  const filled = (i: number, j: number) => {
    if (i < 0 || j < 0 || i >= cols || j >= rows) return false
    const cx = (xs[i] + xs[i + 1]) / 2
    const cy = (ys[j] + ys[j + 1]) / 2
    const inside = (b: Box) => cx > b.x && cx < b.x + b.w && cy > b.y && cy < b.y + b.h
    return boxes.some(inside) && !carve.some(inside)
  }
  const grid: boolean[][] = Array.from({ length: cols }, (_, i) => Array.from({ length: rows }, (_, j) => filled(i, j)))
  const on = (i: number, j: number) => i >= 0 && j >= 0 && i < cols && j < rows && grid[i][j]

  // Directed boundary edges, clockwise on screen (y down), keyed by their start.
  const next = new Map<string, string[]>()
  const add = (a: [number, number], b: [number, number]) => {
    const key = `${a[0]},${a[1]}`
    const list = next.get(key) ?? []
    list.push(`${b[0]},${b[1]}`)
    next.set(key, list)
  }
  for (let i = 0; i < cols; i++)
    for (let j = 0; j < rows; j++) {
      if (!grid[i][j]) continue
      if (!on(i, j - 1)) add([i, j], [i + 1, j])
      if (!on(i + 1, j)) add([i + 1, j], [i + 1, j + 1])
      if (!on(i, j + 1)) add([i + 1, j + 1], [i, j + 1])
      if (!on(i - 1, j)) add([i, j + 1], [i, j])
    }

  let d = ''
  while (next.size) {
    const start = next.keys().next().value as string
    const loop: [number, number][] = []
    let at = start
    for (;;) {
      const [i, j] = at.split(',').map(Number)
      loop.push([xs[i], ys[j]])
      const list = next.get(at)
      if (!list) break
      const to = list.pop() as string
      if (!list.length) next.delete(at)
      at = to
      if (at === start) break
    }
    // Drop the points mid-way along a straight edge.
    const pts = loop.filter((p, n) => {
      const a = loop[(n - 1 + loop.length) % loop.length]
      const c = loop[(n + 1) % loop.length]
      return !((a[0] === p[0] && p[0] === c[0]) || (a[1] === p[1] && p[1] === c[1]))
    })
    if (pts.length < 3) continue
    d += roundedLoop(pts, radius, concave)
  }
  return d
}

/** A closed loop of right-angled corners, each rounded (see `unionPath`). */
export function roundedLoop(
  pts: [number, number][],
  radius: number,
  concave: number | ((x: number, y: number) => number) = radius,
): string {
  const n = pts.length
  let d = ''
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n]
    const p = pts[i]
    const p1 = pts[(i + 1) % n]
    const inLen = Math.hypot(p[0] - p0[0], p[1] - p0[1])
    const outLen = Math.hypot(p1[0] - p[0], p1[1] - p[1])
    const din = [Math.sign(p[0] - p0[0]), Math.sign(p[1] - p0[1])]
    const dout = [Math.sign(p1[0] - p[0]), Math.sign(p1[1] - p[1])]
    // Clockwise on screen: a right turn is an outside corner, a left turn an inside step.
    const turn = din[0] * dout[1] - din[1] * dout[0]
    const inside = typeof concave === 'number' ? concave : concave(p[0], p[1])
    const r = Math.min(turn > 0 ? radius : inside, inLen / 2, outLen / 2)
    const a = [p[0] - din[0] * r, p[1] - din[1] * r]
    const b = [p[0] + dout[0] * r, p[1] + dout[1] * r]
    d += `${i ? 'L' : 'M'}${f(a[0])} ${f(a[1])}`
    if (r > 0)
      d += `C${f(a[0] + din[0] * r * K)} ${f(a[1] + din[1] * r * K)} ${f(b[0] - dout[0] * r * K)} ${f(b[1] - dout[1] * r * K)} ${f(b[0])} ${f(b[1])}`
  }
  return d + 'Z'
}

const f = (v: number) => Math.round(v * 100) / 100
