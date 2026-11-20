import { useLayoutEffect, useRef, useState, useSyncExternalStore, type CSSProperties, type ReactNode } from 'react'
import { radiusPx } from '../design-system/tokens'
import { unionPath, type Box } from '../interlock'
import { getTheme, subscribeToTheme } from '../theme'

/*
  The brand page's layout (Nov 12 2026): pieces set on a CSS grid, and one
  surface traced round all of them rather than a card per piece. Each surface
  piece grows by half the grid's gap, so neighbours meet and merge; the outline
  rounds every outside corner at 24 and turns every inside step concave at 24,
  the curved cards' join, so a run of pieces reads as one shape that steps and
  notches. A `bare` piece (a social post) stays off the surface: the surface is
  cut back a whole gap round it, so a post sits as far from the surface as from
  the post beside it, and the notch curves at the post's 16 plus that gap, so it
  stays concentric with the post's corner. Like the curved cards,
  the surface is the opposite of the page (`data-theme`), so its copy and art flip
  with it.
*/

const OUTER = radiusPx['2xl']
/** A post's own corner (`PostImg` in the brand page). */
const POST_RADIUS = radiusPx.xl

/** The other theme, which the surface and everything on it take. */
function useSurfaceTheme() {
  const theme = useSyncExternalStore(subscribeToTheme, getTheme)
  return theme === 'dark' ? 'light' : 'dark'
}

/** The page's own theme, which a bare piece goes back to: it stands on the page, not the surface. */
function usePageTheme() {
  return useSyncExternalStore(subscribeToTheme, getTheme)
}

export function Interlock({
  areas,
  columns = 'repeat(12, minmax(0, 1fr))',
  rows,
  gap = 16,
  join = true,
  fill = 'var(--color-bg-primary)',
  theme: themeOverride,
  radius = OUTER,
  bareRadius = POST_RADIUS,
  children,
  style,
}: {
  /** `grid-template-areas`, one string per row. */
  areas: string[]
  columns?: string
  rows?: string
  gap?: number
  /** Merge neighbouring pieces into one surface; off, each piece is its own rounded card. */
  join?: boolean
  /** The surface's paint, where it isn't the other theme's page colour (Cinnabars' blue). */
  fill?: string
  /** The theme the surface's copy reads in, where `fill` sets a colour of its own. */
  theme?: 'light' | 'dark'
  /** Every corner's curve, outside and in; the site's 24 unless a page wants it larger. */
  radius?: number
  /** A bare piece's own corner, which the notch round it stays concentric with. */
  bareRadius?: number
  children: ReactNode
  style?: CSSProperties
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [shape, setShape] = useState({ d: '', w: 0, h: 0 })
  const surfaceTheme = useSurfaceTheme()
  const theme = themeOverride ?? surfaceTheme

  useLayoutEffect(() => {
    const root = ref.current
    if (!root) return
    const measure = () => {
      // Layout boxes, not `getBoundingClientRect`: a section springs in on a transform
      // (`Reveal`), and measuring mid-spring traced the outline round shrunken pieces.
      const w = root.offsetWidth
      const h = root.offsetHeight
      // Half the gap each side, and 1 more: the grid's fractional tracks round to whole
      // pixels in the offsets, which could leave neighbours 1 short and a hairline between.
      const grow = join ? gap / 2 + 1 : 0
      const boxes: Box[] = []
      const carve: Box[] = []
      for (const piece of root.querySelectorAll<HTMLElement>(':scope > [data-piece]')) {
        // The grid is the pieces' offset parent (it's positioned).
        const left = piece.offsetLeft
        const top = piece.offsetTop
        const right = left + piece.offsetWidth
        const bottom = top + piece.offsetHeight
        // Off the surface altogether: copy sitting in a cove the surface already leaves.
        if (piece.dataset.off !== undefined) continue
        if (piece.dataset.bare !== undefined) {
          // A post keeps a whole gap clear of the surface, the same as from its neighbours.
          if (join) carve.push({ x: left - gap, y: top - gap, w: right - left + gap * 2, h: bottom - top + gap * 2 })
          continue
        }
        // Grown to meet its neighbours, but never past the grid's own edge.
        const x0 = Math.max(0, left - grow)
        const y0 = Math.max(0, top - grow)
        const x1 = Math.min(w, right + grow)
        const y1 = Math.min(h, bottom + grow)
        boxes.push({ x: round(x0), y: round(y0), w: round(x1) - round(x0), h: round(y1) - round(y0) })
      }
      // A notch round a post curves concentric with the post's own corner: its 16 plus the gap.
      const notch = bareRadius + gap
      const corners = carve.flatMap((c) => [
        [c.x, c.y],
        [c.x + c.w, c.y],
        [c.x, c.y + c.h],
        [c.x + c.w, c.y + c.h],
      ])
      const concave = (x: number, y: number) => (corners.some(([cx, cy]) => Math.abs(cx - x) < 1 && Math.abs(cy - y) < 1) ? notch : radius)
      const d = join ? unionPath(boxes, radius, concave, carve) : boxes.map((b) => unionPath([b], radius)).join('')
      setShape((prev) => (prev.d === d && prev.w === w && prev.h === h ? prev : { d, w, h }))
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(root)
    for (const piece of root.querySelectorAll(':scope > [data-piece]')) observer.observe(piece)
    return () => observer.disconnect()
  }, [join, gap, areas, radius, bareRadius])

  return (
    <div
      ref={ref}
      data-theme={theme}
      style={{
        position: 'relative',
        display: 'grid',
        gridTemplateColumns: columns,
        gridTemplateRows: rows,
        gridTemplateAreas: areas.map((row) => `"${row}"`).join(' '),
        gap,
        // The page's own colour for anything not on the surface: the grid sets the other theme.
        color: 'var(--color-text-primary)',
        ...style,
      }}
    >
      <svg
        aria-hidden
        width={shape.w}
        height={shape.h}
        viewBox={`0 0 ${shape.w || 1} ${shape.h || 1}`}
        style={{ position: 'absolute', inset: 0, overflow: 'visible', pointerEvents: 'none' }}
      >
        <path d={shape.d} fill={fill} fillRule="nonzero" />
      </svg>
      {children}
    </div>
  )
}

/** Half-pixel steps keep the outline crisp without drifting from the pieces. */
const round = (v: number) => Math.round(v * 2) / 2

/**
 * One cell of an `Interlock`: on the surface (padded, unless `flush`), `bare`,
 * standing on the page with the surface wrapped round it, or `off`, on the page in
 * room the surface leaves anyway, without cutting into it.
 */
export function Piece({
  area,
  bare = false,
  off = false,
  flush = false,
  pad = 32,
  children,
  style,
}: {
  area: string
  bare?: boolean
  off?: boolean
  flush?: boolean
  pad?: number
  children?: ReactNode
  style?: CSSProperties
}) {
  const pageTheme = usePageTheme()
  return (
    <div
      data-piece
      data-bare={bare || undefined}
      data-off={off || undefined}
      data-theme={bare || off ? pageTheme : undefined}
      style={{
        gridArea: area,
        position: 'relative',
        minWidth: 0,
        boxSizing: 'border-box',
        padding: bare || off || flush ? 0 : pad,
        ...style,
      }}
    >
      {children}
    </div>
  )
}
