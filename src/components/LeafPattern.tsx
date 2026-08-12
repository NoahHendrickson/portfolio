import { useEffect, useRef, useState } from 'react'

/**
 * Pixel-art leaf field for the right panel. Opaque PNG overlays — black in the
 * asset stays black. Lattice from Figma Frame 455 (124×113, half-row stagger).
 * Original 4-color set only: orange / amber / teal / green, in a fixed
 * diagonal walk (not shuffled).
 */
const LEAF_ASSET_V = '10'
const LEAVES = [
  `/leaves/leaf-00.png?v=${LEAF_ASSET_V}`, // orange
  `/leaves/leaf-01.png?v=${LEAF_ASSET_V}`, // amber
  `/leaves/leaf-02.png?v=${LEAF_ASSET_V}`, // dark green
  `/leaves/leaf-03.png?v=${LEAF_ASSET_V}`, // green
]

/**
 * Display size — exact 1/3 of the 546×378 source so X/Y scale match and
 * `image-rendering: pixelated` lands on whole device pixels (184×128 was a
 * slightly non-uniform squash and made shared edges stairstep).
 */
const LEAF_W = 182
const LEAF_H = 126
/** Horizontal column pitch — Figma ~124, scaled to the 182px leaf. */
const COL_X = 123
/** Vertical step within a column — even so the brick offset stays integer. */
const ROW_Y = 112
/** Odd-column brick offset — exactly half the row pitch, whole pixels only. */
const COL_ODD_Y = 56

/** How far leaf tips poke past the content column's right edge. */
export const LEAF_TIP_INSET = 8
/** Extra shift of the whole field away from the content edge (px) on Me. */
export const LEAF_SHIFT_X = 100
/**
 * Figma frame width. On Me, viewports wider than this pick up an extra right
 * nudge so the leaf field doesn't sit too close to the copy on large screens.
 * Design never applies this.
 */
export const LEAF_SHIFT_LARGE_FROM_PX = 1512
/** Cap on the large-screen extra Me nudge (px). */
export const LEAF_SHIFT_LARGE_EXTRA_MAX = 80

/**
 * How tall the leaf panel runs past the fold. Dense through the first viewport,
 * then retreats and thins until it's gone near the bottom of this extent.
 */
export const LEAF_PANEL_HEIGHT_VH = 260

/**
 * Left-edge taper: whole leaves only. Mostly 1-col steps with a few 2-col bites
 * so the silhouette cuts in harder without emptying a wide band.
 */
const LEFT_EDGE = [0, 1, 1, 0, 1, 2, 1, 1, 0, 1, 2, 1, 0, 1, 1, 2, 1, 0]

type Leaf = {
  key: string
  src: string
  x: number
  y: number
}

/** First column to draw for this visual band — jagged left frontier. */
function leftEdgeCol(band: number): number {
  const i = ((band % LEFT_EDGE.length) + LEFT_EDGE.length) % LEFT_EDGE.length
  return LEFT_EDGE[i]
}

/** Stable 0..1 hash for sparse dropout in the fade. */
function hash01(a: number, b: number): number {
  let n = Math.imul(a + 1, 374761393) ^ Math.imul(b + 1, 668265263)
  n = Math.imul(n ^ (n >>> 13), 1274126177)
  return (n >>> 0) / 4294967296
}

function buildLeaves(width: number, height: number, viewH: number): Leaf[] {
  const padRight = LEAF_W
  const padY = LEAF_H
  const colEnd = Math.ceil((width + padRight) / COL_X) + 1
  const rowStart = -1
  const rowEnd = Math.ceil((height + padY) / ROW_Y) + 1

  // Dense through the fold, then a long inset tail that keeps right-side leaves
  // going a bit further down without sticking out as far as the band above.
  const fadeStart = Math.min(viewH * 0.95, height * 0.4)
  const fadeEnd = height - ROW_Y

  const leaves: Leaf[] = []
  for (let col = 0; col <= colEnd; col++) {
    const odd = col % 2 === 1
    for (let row = rowStart; row <= rowEnd; row++) {
      const x = col * COL_X
      const y = row * ROW_Y + (odd ? COL_ODD_Y : 0)
      if (y > height + padY || y + LEAF_H < -padY) continue
      if (x > width + padRight) continue

      const t =
        y <= fadeStart ? 0 : Math.min(1, (y - fadeStart) / Math.max(1, fadeEnd - fadeStart))
      // Cut the tail before a lone orphan tip can hang off the bottom.
      if (t > 0.58) continue

      // Half-row bands so brick-staggered neighbours share the same frontier.
      const band = Math.round(y / COL_ODD_Y)
      // Ease-in retreat: jump in by ~2 cols as soon as the tail starts, then
      // slowly walk further right so a thinner ribbon continues downward.
      const retreat =
        t <= 0 ? 0 : 2 + Math.floor(Math.pow(t, 1.75) * Math.max(1, colEnd - 1))
      const edge = leftEdgeCol(band) + retreat
      if (col < edge) continue
      // No single-column whiskers once the field has started thinning.
      if (t > 0.35 && edge >= colEnd - 1) continue

      // Scatter the end of the tail so it breaks up before a lone tip.
      if (t > 0.4 && hash01(col, row) < ((t - 0.4) / 0.18) * 0.95) continue

      // Fixed diagonal order through the 4 hues (same walk as the early pass).
      const colorIndex = (((row * 2 + col) % LEAVES.length) + LEAVES.length) % LEAVES.length
      leaves.push({
        key: `${col}:${row}`,
        src: LEAVES[colorIndex],
        // Whole CSS pixels only — no subpixel top edges between neighbours.
        x: Math.round(x),
        y: Math.round(y),
      })
    }
  }
  return leaves
}

/** Full-bleed static leaf pattern — drop-in replacement for the shader panel. */
export default function LeafPattern() {
  const rootRef = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState({ w: 0, h: 0, viewH: 0 })

  useEffect(() => {
    const el = rootRef.current
    if (!el) return
    const update = () => {
      const { width, height } = el.getBoundingClientRect()
      setSize({
        w: Math.ceil(width),
        h: Math.ceil(height),
        viewH: Math.ceil(window.innerHeight),
      })
    }
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    window.addEventListener('resize', update)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', update)
    }
  }, [])

  const leaves =
    size.w > 0 && size.h > 0 ? buildLeaves(size.w, size.h, size.viewH || size.h) : []

  return (
    <div
      ref={rootRef}
      aria-hidden
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        pointerEvents: 'none',
        background: 'transparent',
      }}
    >
      {leaves.map((leaf) => (
        <img
          key={leaf.key}
          src={leaf.src}
          alt=""
          draggable={false}
          style={{
            position: 'absolute',
            left: leaf.x,
            top: leaf.y,
            width: LEAF_W,
            height: LEAF_H,
            // Tailwind preflight sets `max-width: 100%` on img. The leaf panel
            // is often narrower than one leaf (Design's ~12.7vw strip), and that
            // rule would shrink width while our fixed height stayed — squashing
            // the pixel art. Leaves intentionally overflow; the panel clips.
            maxWidth: 'none',
            display: 'block',
            imageRendering: 'pixelated',
          }}
        />
      ))}
    </div>
  )
}
