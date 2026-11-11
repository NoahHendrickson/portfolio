import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { useTexturePaused } from '../hooks/useTexturePaused'
import { MARK } from '../introTimeline'
import {
  DEFAULT_SWATCHES,
  FACE_GLYPHS,
  GLYPH_SIZE,
  LEAF_FAMILIES,
  LEAF_GLYPHS,
  MARK_SLOT,
  resolveSlot,
  SHAPE_GLYPHS,
  THIN_FACE_GLYPHS,
  type Glyph,
  type Swatch,
} from '../pixelTexture'
import { LANDING_SETTINGS } from '../textureSettings'

/*
  The pixel texture's canvas (Nov 11 2026), and `HomeTexture`, which puts it
  on the home page; the controls that tune it live in `TexturePlayground`
  (dev only). It's the ASCII-art texture from a couple of identity
  references (a shape built from a grid of character tiles, the characters
  cycling), with the rail's pixel faces and the logo's single leaves standing
  in for the characters.

  One canvas. A cell is 20 glyph units: an 18-unit tile, the 16-unit glyph
  inside it. A unit is a whole number of device pixels, so every square lands
  crisp. Each glyph is pre-drawn once per colour as a sprite; a frame redraws
  only the cells that changed.
*/

export type Shape = 'circle' | 'mark' | 'edge'
/** The glyph sets a texture draws from; any mix of them, never none. */
export type GlyphSet = 'faces' | 'leaves' | 'shapes'
export type Palette = 'mono' | 'leaf'
export type Size = 'S' | 'M' | 'L'
export type Speed = 'slow' | 'normal' | 'fast'
/**
 * How the shape's cells mix their treatments. `tiles` is every cell a tile;
 * `scatter` rolls each cell on its own (and re-rolls some as they change);
 * `patches` gives each region one treatment and colour, the way the
 * references block a section out in solid squares beside one of bare marks;
 * `density` ranks them by how much of the cell they cover, like an ASCII ramp:
 * solid where the light is brightest, then tiles, frames, bare glyphs;
 * `bare` is every cell a bare glyph, no squares.
 */
export type Mix = 'tiles' | 'scatter' | 'patches' | 'density' | 'bare'
export type Outline = 'tile' | 'ink'
/** `thin` the faces redrawn in the leaves' 1-unit lines; `bold` the rail's 2-unit faces. */
export type FaceWeight = 'thin' | 'bold'

const CELL_UNITS = 20
/** CSS px per glyph unit, before rounding to device pixels. */
const UNIT: Record<Size, number> = { S: 1, M: 1.5, L: 2 }
const SPEED: Record<Speed, number> = { slow: 0.4, normal: 1, fast: 2.2 }
/**
 * A fitted grid (the logo) always fills the same room; its size is how many
 * cells each of the mark's squares is cut into, a side — L one, M 2 × 2,
 * S 3 × 3 — so the leaf holds its size and only its grain changes.
 */
const FIT_GRAIN: Record<Size, number> = { S: 3, M: 2, L: 1 }
/** The background field's glyphs, as a share of the text colour. */
const FAINT = 0.09
/**
 * The ripple: a `ring` grows from a point, a `sweep` is a straight band moving
 * away from a side (from the centre, out both ways). `RIPPLE_FROM` is where
 * either starts.
 */
export type RippleKind = 'off' | 'ring' | 'sweep'
export type RippleFrom = 'centre' | 'top' | 'bottom' | 'left' | 'right' | 'bottom-left'
/** How far a cell is from where the ripple starts, in cells. */
function rippleDistance(kind: RippleKind, from: RippleFrom, x: number, y: number, cols: number, rows: number) {
  const right = cols - 1
  const bottom = rows - 1
  if (kind === 'sweep') {
    if (from === 'left') return x
    if (from === 'right') return right - x
    if (from === 'top') return y
    if (from === 'bottom') return bottom - y
    if (from === 'bottom-left') return (x + bottom - y) / Math.SQRT2
    return Math.abs(x - right / 2)
  }
  const [ox, oy] =
    from === 'left'
      ? [0, bottom / 2]
      : from === 'right'
        ? [right, bottom / 2]
        : from === 'top'
          ? [right / 2, 0]
          : from === 'bottom'
            ? [right / 2, bottom]
            : from === 'bottom-left'
              ? [0, bottom]
              : [right / 2, bottom / 2]
  return Math.hypot(x - ox, y - oy)
}

/**
 * The faint background glyphs: `full` fills every cell outside the shape,
 * `near` keeps only the rows next to it (`NEAR_ROWS`, at the grain), fading
 * out row by row, and `none` leaves the ground bare.
 */
export type Field = 'full' | 'near' | 'none'
const NEAR_ROWS = 2
/** The outermost near row's strength, as a share of the first's. */
const NEAR_FADE = 0.45

/** The field under the ripple's front. */
const FAINT_LIT = 0.4
/** How thick the ripple's front is, in cells. */
const BAND = 1.2
/** Lit-side light for the circle's shading: up and to the left, towards the viewer. */
const LIGHT = (() => {
  const v = [-0.45, -0.55, 0.7]
  const n = Math.hypot(...v)
  return v.map((x) => x / n)
})()
/** The circle's tile tones, darkest to lightest, as a mix from the ground to the text colour. */
const TONES = [0.32, 0.5, 0.72, 1]
const ACCENTS = 3

/*
  Streaks and flow, studied off the Softcrow recording (Nov 11 2026). A
  streak is a run of cells along one row that collapses into thin bars — a
  third of a cell tall, one per cell with the tiles' gaps between, in mixed
  colours — and slides left to right, the cells it leaves coming back with
  new glyphs. Flow drifts the patch seeds, so the regions of colour and
  treatment ooze and reshape instead of holding still.
*/
/** Most streaks running at once, and the gap between new ones (ms, at normal speed). */
const STREAK_MAX = 5
const STREAK_GAP: [number, number] = [220, 900]
/** A streak's length and speed, in cells and cells a second. */
const STREAK_LEN: [number, number] = [3, 11]
const STREAK_SPEED: [number, number] = [14, 32]
/** A bar's height as a share of the cell. */
const STREAK_BAR = 0.3
/** Chance a cell in a streak takes a colour of its own rather than the streak's. */
const STREAK_MIX = 0.3
/** Patch seeds' drift (cells a second) and how often the regions are re-read (ms). */
const FLOW_SPEED: [number, number] = [0.5, 1.4]
const FLOW_STEP_MS = 140

/**
 * The Edge shape's line, traced off a sketch (Nov 11 2026): a wavering edge
 * that comes in from the top, bellies out, doubles back on itself under the
 * middle and leaves off the bottom, with everything left of it filled — the
 * shape running off the canvas's top, bottom and left. Points are shares of
 * the sketch's frame, `[x, y]`, top to bottom, smoothed by a Catmull-Rom
 * spline. The doubling back means it isn't a function of `y`, so the fill is
 * a polygon, rasterised to the grid.
 */
const EDGE_LINE: [number, number][] = [
  [0.128, 0],
  [0.162, 0.042],
  [0.239, 0.117],
  [0.265, 0.214],
  [0.293, 0.291],
  [0.32, 0.342],
  [0.309, 0.379],
  [0.239, 0.434],
  [0.151, 0.493],
  [0.128, 0.575],
  [0.132, 0.601],
  [0.159, 0.628],
  [0.244, 0.646],
  [0.379, 0.624],
  [0.441, 0.623],
  [0.453, 0.657],
  [0.379, 0.745],
  [0.355, 0.819],
  [0.356, 0.884],
  [0.389, 0.914],
  [0.462, 0.956],
  [0.524, 0.986],
  [0.534, 1],
]
/** How far the sketch's x runs per row: 1 is its own square frame; the canvas is wider, so the line stretches a little to use it. */
const EDGE_STRETCH = 1.4
/** The sway's reach, in cells, and its pace. */
const SWAY_REACH = 1.1
const SWAY_PACE = 0.00035
/**
 * Taper eases the line back to its side over the grid's last rows (a
 * smoothstep on its reach), so the shape slopes away at the foot instead of
 * being cut off by the grid's bottom row. `short` touches only the last 12%,
 * keeping the line's own shape above it; `long`, a third, reaches up into
 * the line's lower bulge and reshapes it (tried first for the landing page
 * and backed out, Nov 11 2026).
 */
export type Taper = 'off' | 'short' | 'long'
const TAPER_SHARE: Record<Taper, number> = { off: 0, short: 0.12, long: 0.35 }

/** How often the swaying line is re-rasterised; it moves a cell at a time anyway. */
const SWAY_STEP_MS = 110

/**
 * A second line for the landing page's tall, narrow box (Nov 11 2026): the
 * sketch's own top only reaches 13–30% across, which in that box read as a
 * near-straight sliver. This one starts well out, throws a big lobe, notches
 * in sharply, swells again, cuts a deep inlet and runs out along a shelf before
 * settling. Shares of the box: `x` is the reach from the side, `y` down.
 */
const LANDING_LINE: [number, number][] = [
  [0.62, 0],
  [0.8, 0.05],
  [0.88, 0.11],
  [0.68, 0.17],
  [0.4, 0.21],
  [0.46, 0.26],
  [0.7, 0.31],
  [0.76, 0.36],
  [0.54, 0.42],
  [0.3, 0.47],
  [0.24, 0.53],
  [0.34, 0.57],
  [0.6, 0.6],
  [0.72, 0.62],
  [0.74, 0.66],
  [0.56, 0.72],
  [0.46, 0.79],
  [0.5, 0.86],
  [0.62, 0.92],
  [0.7, 1],
]

export type EdgeLine = 'sketch' | 'landing'

/** A line's points sampled along a Catmull-Rom spline, in its own shares. */
function sampleLine(p: [number, number][]): [number, number][] {
  const out: [number, number][] = []
  for (let i = 0; i < p.length - 1; i++) {
    const p0 = p[Math.max(0, i - 1)]
    const p1 = p[i]
    const p2 = p[i + 1]
    const p3 = p[Math.min(p.length - 1, i + 2)]
    for (let step = 0; step < 8; step++) {
      const t = step / 8
      const t2 = t * t
      const t3 = t2 * t
      const at = (k: 0 | 1) =>
        0.5 *
        (2 * p1[k] +
          (-p0[k] + p2[k]) * t +
          (2 * p0[k] - 5 * p1[k] + 4 * p2[k] - p3[k]) * t2 +
          (-p0[k] + 3 * p1[k] - 3 * p2[k] + p3[k]) * t3)
      out.push([at(0), at(1)])
    }
  }
  out.push(p[p.length - 1])
  return out
}

const EDGE_SAMPLES: Record<EdgeLine, [number, number][]> = {
  sketch: sampleLine(EDGE_LINE),
  landing: sampleLine(LANDING_LINE),
}
const SCATTER: [Kind, number][] = [
  ['tile', 0.42],
  ['ink', 0.32],
  ['solid', 0.12],
  ['frame', 0.14],
]
/** Dealt round the patch seeds in turn, so every treatment shows up. */
const PATCH_KINDS: Kind[] = ['tile', 'ink', 'solid', 'frame', 'ink', 'tile']
/**
 * Patch size: grid cells per patch seed, so the count follows the grid's area
 * (11 seeds over the whole grid, the first version, read as a few big blocks).
 */
export type PatchSize = 'S' | 'M' | 'L'
const CELLS_PER_PATCH: Record<PatchSize, number> = { S: 12, M: 26, L: 60 }
/**
 * How patches bleed into each other: `reach` is how far either side of a
 * border (cells) a cell may take the neighbouring patch, more likely the
 * nearer the border; `warp` bends the borders off Voronoi's straight lines.
 */
export type Bleed = 'none' | 'some' | 'lots'
const BLEED: Record<Bleed, { reach: number; warp: number }> = {
  none: { reach: 0, warp: 0 },
  some: { reach: 2, warp: 1.4 },
  lots: { reach: 4, warp: 2.6 },
}

function weighted(table: [Kind, number][]) {
  let r = Math.random()
  for (const [kind, weight] of table) {
    r -= weight
    if (r <= 0) return kind
  }
  return table[0][0]
}

/**
 * `field` the faint background glyph; inside the shape, `tile` a filled square
 * with the glyph cut into it, `ink` the glyph alone in the cell's colour,
 * `solid` the square with no glyph, `frame` an outlined square round the glyph.
 */
type Kind = 'field' | 'tile' | 'ink' | 'solid' | 'frame'
type Cell = {
  x: number
  y: number
  kind: Kind
  /** Its colour when it has no leaf slot (the field, the outline, Mono). */
  color: string
  /** Its leaf colour slot (`resolveSlot`), or -1. */
  slot: number
  /** Whether a change may roll the cell a new treatment (`scatter`). */
  reroll: boolean
  /** Its light level (0–3), so a new treatment can be recoloured to match. */
  level: number
  /** Index into the active glyph list, or -1 for a blank tile. */
  glyph: number
  next: number
  /** Distance from where the ripple starts, in cells. */
  d: number
  ripple: number
  /** Under the ripple's front, drawn brighter. */
  lit: boolean
  touched: number
  /** How many cells out from the shape (0 inside it), for a `near` field. */
  near: number
  /** On the shape's rim, where a cell may break up into a bare glyph. */
  rim: boolean
  /** The patch seed it belongs to, so flow knows when that changes. */
  seed: number
  /** A streak's bar over the cell: a leaf slot, or a literal colour under Mono. */
  dash: { slot: number; color: string } | null
}

const rand = (min: number, max: number) => min + Math.random() * (max - min)

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.trim().replace('#', '')
  const full = h.length === 3 ? [...h].map((c) => c + c).join('') : h.slice(0, 6)
  const n = parseInt(full, 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

/** `#rrggbb` or `rgb(r, g, b)` to its channels. */
function channels(colour: string): [number, number, number] {
  if (colour.startsWith('#')) return hexToRgb(colour)
  const [r = 0, g = 0, b = 0] = colour.match(/\d+(\.\d+)?/g)?.map(Number) ?? []
  return [r, g, b]
}

/** How long a pause takes to drain the colour out, or a play to bring it back (ms). */
const GREY_FADE_MS = 520

function mix(a: string, b: string, t: number) {
  const [ar, ag, ab] = hexToRgb(a)
  const [br, bg, bb] = hexToRgb(b)
  const c = (x: number, y: number) => Math.round(x + (y - x) * t)
  return `rgb(${c(ar, br)}, ${c(ag, bg)}, ${c(ab, bb)})`
}

/** Resolves a token to `#rrggbb` through a 2D context, whatever form the stylesheet wrote it in. */
function resolveColor(probe: HTMLElement, name: string, fallback: string) {
  const raw = getComputedStyle(probe).getPropertyValue(name).trim()
  const ctx = document.createElement('canvas').getContext('2d')
  if (!raw || !ctx) return fallback
  ctx.fillStyle = fallback
  ctx.fillStyle = raw
  const out = ctx.fillStyle
  return out.startsWith('#') ? out : fallback
}

function useThemeVersion() {
  const [version, setVersion] = useState(0)
  useEffect(() => {
    const observer = new MutationObserver(() => setVersion((v) => v + 1))
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
    return () => observer.disconnect()
  }, [])
  return version
}

type TextureProps = {
  shape: Shape
  glyphs: GlyphSet[]
  palette: Palette
  mixMode: Mix
  speed: Speed
  ripple: RippleKind
  rippleFrom?: RippleFrom
  label: string
  /** A fixed glyph unit, the grid then running as many cells as fit; or, with `fit`, how finely the grid is cut (`FIT_GRAIN`). */
  size?: Size
  /** Or a square grid this many cells across (times the grain), filling the width and the window. */
  fit?: number
  /** Literal ground and text colours, painted under the canvas, in place of the page's. */
  colors?: { ground: string; text: string }
  /** The logo's outline: filled tiles, or bare glyphs. */
  outline?: Outline
  /** Rounds the canvas's corners (with `colors`, where it is a card). */
  radius?: number
  faceWeight?: FaceWeight
  /** The leaf colours (under the Leaf palette), by slot. */
  swatches?: Swatch[]
  /** The Edge shape's line drifts side to side. */
  sway?: boolean
  /** Rows of cells collapse into bars that slide left to right. */
  streaks?: boolean
  /** The patch regions drift and reshape. */
  flow?: boolean
  patchSize?: PatchSize
  bleed?: Bleed
  /** Flips the Edge to come in from the right, its streaks running right to left. */
  mirror?: boolean
  /**
   * Sizes the grid off its wrapper's own width and height (which the caller
   * sets) rather than the window's, and seats it in the wrapper's top corner
   * on the shape's side.
   */
  fill?: boolean
  /** Extra styles for the wrapper (a placement, a mask). */
  wrapStyle?: CSSProperties
  field?: Field
  /** The Edge slopes away to its side at the foot (`TAPER_SHARE`). */
  taper?: Taper
  /** Which line the Edge follows. */
  edgeLine?: EdgeLine
  /** Holds the texture still where it is (and stops the pointer stirring it), without rebuilding it. */
  paused?: boolean
}

export function TextureCanvas({
  shape,
  glyphs,
  palette,
  mixMode,
  speed,
  ripple,
  rippleFrom = 'centre',
  label,
  size = 'M',
  fit,
  colors,
  outline = 'ink',
  radius: cornerRadius,
  faceWeight = 'thin',
  swatches = DEFAULT_SWATCHES,
  sway = true,
  streaks = true,
  flow = true,
  patchSize = 'M',
  bleed = 'some',
  mirror = false,
  fill = false,
  wrapStyle,
  field = 'near',
  taper = 'off',
  edgeLine = 'sketch',
  paused = false,
}: TextureProps) {
  const wrapRef = useRef<HTMLDivElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  // The swatches repaint the cells in place rather than rebuild the grid, so
  // dragging a colour picker doesn't reshuffle the texture under it.
  const swatchesRef = useRef(swatches)
  const repaintRef = useRef<(() => void) | null>(null)
  // Idles while off screen (the home page scrolls it away under the projects),
  // and while paused — read through a ref, so pausing holds the frame as it is.
  const visibleRef = useRef(true)
  const pausedRef = useRef(paused)
  // Paused, the texture also goes grey (like the button that paused it):
  // `greyRef` is read at draw time, and a change cross-fades by laying a copy
  // of the frame as it was over a repaint and fading the copy out.
  const greyRef = useRef(paused)
  const fadeRef = useRef<HTMLCanvasElement | null>(null)
  useEffect(() => {
    pausedRef.current = paused
    if (greyRef.current === paused) return
    greyRef.current = paused
    const canvas = canvasRef.current
    const fade = fadeRef.current
    const repaint = repaintRef.current
    if (!canvas || !fade || !repaint) return
    fade.width = canvas.width
    fade.height = canvas.height
    fade.getContext('2d')?.drawImage(canvas, 0, 0)
    fade.style.transition = 'none'
    fade.style.opacity = '1'
    repaint()
    const frame = requestAnimationFrame(() => {
      fade.style.transition = `opacity ${GREY_FADE_MS}ms ease`
      fade.style.opacity = '0'
    })
    return () => cancelAnimationFrame(frame)
  }, [paused])
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const observer = new IntersectionObserver(([entry]) => {
      visibleRef.current = entry.isIntersecting
    })
    observer.observe(canvas)
    return () => observer.disconnect()
  }, [])
  useEffect(() => {
    swatchesRef.current = swatches
    repaintRef.current?.()
  }, [swatches])
  const still = useMediaQuery('(prefers-reduced-motion: reduce)')
  const themeVersion = useThemeVersion()
  const [box, setBox] = useState({ width: 0, height: 0 })

  // The grid follows the panel's width and the window's height: from its own
  // top for the playground, which opens on screen, and the whole window for a
  // fitted grid further down.
  useEffect(() => {
    const wrap = wrapRef.current
    if (!wrap) return
    const measure = () => {
      const width = wrap.clientWidth
      const height = fill
        ? wrap.clientHeight
        : fit
          ? Math.max(320, window.innerHeight - 120)
          : Math.max(320, Math.round(window.innerHeight - wrap.getBoundingClientRect().top - 80))
      setBox((prev) => (prev.width === width && prev.height === height ? prev : { width, height }))
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(wrap)
    window.addEventListener('resize', measure)
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [fit, fill])

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx || box.width === 0) return

    const dpr = window.devicePixelRatio || 1
    // A fitted grid's cell is whatever whole number of device pixels fills the
    // room, so its glyph unit is the largest whole one that fits inside it.
    const grain = fit ? FIT_GRAIN[size] : 1
    const fitted = fit ? fit * grain : 0
    const cell = fit
      ? Math.max(6, Math.floor((Math.min(box.width, box.height) * dpr) / fitted))
      : CELL_UNITS * Math.max(1, Math.round(UNIT[size] * dpr))
    const u = Math.max(1, Math.floor(cell / CELL_UNITS))
    // The glyph sits centred in the cell; the tile is inset half as far.
    const glyphOff = Math.floor((cell - GLYPH_SIZE * u) / 2)
    const inset = Math.max(1, Math.floor(glyphOff / 2))
    // On a 1x screen the finest grain can cut a cell smaller than a glyph's 16
    // pixels; there the glyph is scaled down to fit inside the tile instead.
    const squeezed = glyphOff < 1
    const glyphAt = (spr: HTMLCanvasElement, px: number, py: number) =>
      squeezed
        ? ctx.drawImage(spr, px + 1, py + 1, cell - 2, cell - 2)
        : ctx.drawImage(spr, px + glyphOff, py + glyphOff)
    const cols = fit ? fitted : Math.max(8, Math.floor((box.width * dpr) / cell))
    const maxRows = Math.max(8, Math.floor((box.height * dpr) / cell))
    // The edge takes the whole box: it runs off the sides rather than sitting in a square.
    const rows = fit
      ? fitted
      : shape === 'mark'
        ? Math.min(maxRows, Math.max(MARK.length + 4, Math.min(cols, maxRows)))
        : shape === 'edge'
          ? maxRows
          : Math.min(cols, maxRows)
    canvas.width = cols * cell
    canvas.height = rows * cell
    canvas.style.width = `${(cols * cell) / dpr}px`
    canvas.style.height = `${(rows * cell) / dpr}px`

    const ground = colors?.ground ?? resolveColor(canvas, '--color-bg-primary', '#171615')
    const text = colors?.text ?? resolveColor(canvas, '--color-text-primary', '#ecede6')
    const accent = resolveColor(canvas, '--color-orange', '#f95b1c')

    // Each set on takes an equal share of the cells, whatever its size, so
    // the shapes' nineteen don't swamp the five faces.
    const faces = faceWeight === 'thin' ? THIN_FACE_GLYPHS : FACE_GLYPHS
    const groups: Glyph[][] = (['faces', 'leaves', 'shapes'] as const)
      .filter((id) => glyphs.includes(id))
      .map((id) => (id === 'faces' ? faces : id === 'leaves' ? LEAF_GLYPHS : SHAPE_GLYPHS))
    if (groups.length === 0) groups.push(faces)
    const set: Glyph[] = groups.flat()
    const starts = groups.map((_, i) => groups.slice(0, i).reduce((n, group) => n + group.length, 0))
    const pick = (not = -1) => {
      if (set.length < 2) return 0
      let g = not
      while (g === not) {
        const i = Math.floor(Math.random() * groups.length)
        g = starts[i] + Math.floor(Math.random() * groups[i].length)
      }
      return g
    }

    // One sprite per glyph and colour, drawn at device pixels.
    const sprites = new Map<string, HTMLCanvasElement>()
    const sprite = (g: number, ink: string) => {
      const key = `${g}|${ink}`
      let s = sprites.get(key)
      if (!s) {
        s = document.createElement('canvas')
        s.width = s.height = GLYPH_SIZE * u
        const sctx = s.getContext('2d')!
        sctx.fillStyle = ink
        for (const [x, y, w, h] of set[g].rects) sctx.fillRect(x * u, y * u, w * u, h * u)
        sprites.set(key, s)
      }
      return s
    }

    // Patches: each cell takes the nearest of a few scattered seeds' leaf
    // colour (and, under `patches`, its treatment).
    // Under flow they drift (in cells a second, so a finer grain drifts as
    // fast on screen), bouncing off a margin round the grid.
    const seedCount = Math.max(6, Math.min(180, Math.round((cols * rows) / (CELLS_PER_PATCH[patchSize] * grain * grain))))
    const seeds = Array.from({ length: seedCount }, (_, i) => {
      const angle = rand(0, Math.PI * 2)
      const pace = rand(...FLOW_SPEED) * grain
      return {
        x: rand(0, cols),
        y: rand(0, rows),
        vx: Math.cos(angle) * pace,
        vy: Math.sin(angle) * pace,
        // Dealt in turn while there are few, so each colour and treatment shows
        // up; at random past that, so they don't pair off the same way every time.
        family: i < LEAF_FAMILIES.length ? i : Math.floor(Math.random() * LEAF_FAMILIES.length),
        kind: i < PATCH_KINDS.length ? PATCH_KINDS[i] : PATCH_KINDS[Math.floor(Math.random() * PATCH_KINDS.length)],
      }
    })
    // The borders: warped by a few slow waves (fixed per build, so flow moves
    // the seeds, not the wobble), and dithered within `reach` of a border by
    // each cell's own fixed chance, so a border holds still between steps.
    const { reach, warp } = BLEED[bleed]
    const phase = Array.from({ length: 4 }, () => rand(0, Math.PI * 2))
    const jitter = Float32Array.from({ length: cols * rows }, () => Math.random())
    const seedIndexAt = (x: number, y: number) => {
      const w = warp * grain
      const wx = x + w * (Math.sin(y * 0.31 / grain + phase[0]) + 0.5 * Math.sin((y * 0.73 + x * 0.21) / grain + phase[1]))
      const wy = y + w * (Math.sin(x * 0.29 / grain + phase[2]) + 0.5 * Math.sin((x * 0.67 - y * 0.19) / grain + phase[3]))
      let first = 0
      let second = 0
      let d1 = Infinity
      let d2 = Infinity
      seeds.forEach((seed, i) => {
        const d = (seed.x - wx) ** 2 + (seed.y - wy) ** 2
        if (d < d1) {
          d2 = d1
          second = first
          d1 = d
          first = i
        } else if (d < d2) {
          d2 = d
          second = i
        }
      })
      if (reach > 0) {
        const gap = Math.sqrt(d2) - Math.sqrt(d1)
        const span = reach * grain
        if (gap < span && (jitter[y * cols + x] ?? 1) < 0.5 * (1 - gap / span)) return second
      }
      return first
    }
    const seedAt = (x: number, y: number) => seeds[seedIndexAt(x, y)]

    /** A treatment for a cell inside the shape, at light `level` (0–3); `rim` cells may break up into bare glyphs. */
    const treat = (x: number, y: number, level: number, rim: boolean): Kind => {
      if (rim && Math.random() < 0.45) return 'ink'
      if (mixMode === 'scatter') return weighted(SCATTER)
      if (mixMode === 'patches') return seedAt(x, y).kind
      if (mixMode === 'bare') return 'ink'
      if (mixMode === 'density')
        return level >= 3 ? (Math.random() < 0.4 ? 'solid' : 'tile') : level === 2 ? 'tile' : level === 1 ? 'frame' : 'ink'
      return 'tile'
    }
    /**
     * A cell's paint at `level`: a tone under Mono, a leaf colour slot under
     * Leaf. A bare glyph or frame never drops to the dimmest tones, or it
     * vanishes on the ground.
     */
    const paintAt = (x: number, y: number, level: number, kind: Kind) => {
      const l = kind === 'ink' || kind === 'frame' ? Math.max(level, 2) : level
      return palette === 'mono'
        ? { color: mix(ground, text, TONES[l]), slot: -1 }
        : { color: text, slot: seedAt(x, y).family * 2 + (l >= 2 ? 1 : 0) }
    }

    const cx = (cols - 1) / 2
    const cy = (rows - 1) / 2
    const radius = Math.min(cols, rows) / 2 - 1.5
    const markX = Math.floor((cols - MARK.length * grain) / 2)
    const markY = Math.floor((rows - MARK.length * grain) / 2)
    const now0 = performance.now()
    const blank = (kind: Kind) => kind === 'tile' && Math.random() < 0.06

    // The Edge: the line in cell coordinates, nudged sideways by `phase`, the
    // area left of it filled on a grid-sized canvas (a cell is in when its
    // pixel is mostly covered), and each cell's distance to the line for its
    // light level — brightest along the edge, darkening inwards.
    // A box the caller sized (`fill`) is the line's own frame, its full width;
    // elsewhere the line keeps near the sketch's proportions.
    const edgeWidth = fill ? cols : Math.min(cols, rows * EDGE_STRETCH)
    const edgeMask = shape === 'edge' ? document.createElement('canvas') : null
    const edgeField = (phase: number) => {
      const line = EDGE_SAMPLES[edgeLine].map(([nx, ny]): [number, number] => {
        const drift = sway
          ? SWAY_REACH * (Math.sin(Math.PI * 2 * ny * 1.6 + phase) + 0.4 * Math.sin(Math.PI * 2 * ny * 3.1 - phase * 1.7))
          : 0
        // Tapering scales the reach (sway included) down to nothing at the foot.
        const share = TAPER_SHARE[taper]
        const t = share ? Math.min(1, Math.max(0, (1 - ny) / share)) : 1
        const x = (nx * edgeWidth + drift) * t * t * (3 - 2 * t)
        return [mirror ? cols - x : x, ny * rows]
      })
      const mctx = edgeMask!.getContext('2d', { willReadFrequently: true })!
      edgeMask!.width = cols
      edgeMask!.height = rows
      mctx.clearRect(0, 0, cols, rows)
      mctx.beginPath()
      // Closed round the side the shape fills from.
      const side = mirror ? cols + 2 : -2
      mctx.moveTo(side, -2)
      mctx.lineTo(line[0][0], -2)
      for (const [x, y] of line) mctx.lineTo(x, y)
      mctx.lineTo(line[line.length - 1][0], rows + 2)
      mctx.lineTo(side, rows + 2)
      mctx.closePath()
      mctx.fill()
      const alpha = mctx.getImageData(0, 0, cols, rows).data
      const inside = new Uint8Array(cols * rows)
      const dist = new Float32Array(cols * rows)
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const i = y * cols + x
          inside[i] = alpha[i * 4 + 3] > 127 ? 1 : 0
          if (!inside[i]) continue
          let best = Infinity
          for (const [lx, ly] of line) best = Math.min(best, (lx - x - 0.5) ** 2 + (ly - y - 0.5) ** 2)
          dist[i] = Math.sqrt(best)
        }
      }
      return { inside, dist }
    }
    const edgeLevel = (dist: number) => (dist < 1.2 ? 3 : dist < 3 ? 2 : dist < 6 ? 1 : 0)
    const edge = shape === 'edge' ? edgeField(0) : null

    const cells: Cell[] = []
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const dx = x - cx
        const dy = y - cy
        const d = Math.hypot(dx, dy)
        let kind: Kind = 'field'
        let paint = { color: text, slot: -1 }
        let reroll = false
        let cellLevel = 0
        let rim = false
        if (shape === 'circle') {
          const r = d / radius
          if (r <= 1) {
            const nz = Math.sqrt(Math.max(0, 1 - r * r))
            const lit = Math.max(0, (dx / radius) * LIGHT[0] + (dy / radius) * LIGHT[1] + nz * LIGHT[2])
            const level = Math.min(TONES.length - 1, Math.floor(lit * TONES.length))
            rim = r > 0.9
            kind = treat(x, y, level, rim)
            paint = paintAt(x, y, level, kind)
            reroll = true
            cellLevel = level
          }
        } else if (edge) {
          const i = y * cols + x
          if (edge.inside[i]) {
            const level = edgeLevel(edge.dist[i])
            rim = edge.dist[i] < 0.9
            kind = treat(x, y, level, rim)
            paint = paintAt(x, y, level, kind)
            reroll = true
            cellLevel = level
          }
        } else {
          const ch = MARK[Math.floor((y - markY) / grain)]?.[Math.floor((x - markX) / grain)] ?? '.'
          // The outline stays in the text colour, so the leaves keep their edges.
          if (ch === 'k') kind = outline
          else if (ch !== '.') {
            const level = ch === ch.toUpperCase() ? 3 : 1
            kind = treat(x, y, level, false)
            paint = palette === 'mono' ? paintAt(x, y, level, kind) : { color: text, slot: MARK_SLOT[ch] }
            reroll = true
            cellLevel = level
          }
        }
        cells.push({
          x,
          y,
          kind,
          ...paint,
          reroll,
          level: cellLevel,
          glyph: blank(kind) ? -1 : pick(),
          next: now0 + (still ? Infinity : rand(0, 3000)),
          d: rippleDistance(ripple, rippleFrom, x, y, cols, rows),
          ripple: 0,
          lit: false,
          touched: 0,
          near: 0,
          rim,
          seed: seedIndexAt(x, y),
          dash: null,
        })
      }
    }

    // Read fresh each time: the swaying edge moves cells in and out.
    const shapeCells = () => cells.filter((c) => c.kind !== 'field')

    // Each cell's distance out from the shape, counted in rings of
    // neighbours (diagonals too) up to the near field's reach; anything
    // further is left at `reach + 1`. Returns the cells whose distance
    // changed, so a swaying edge can redraw just those.
    const nearReach = NEAR_ROWS * grain
    const measureNear = () => {
      const next = new Uint16Array(cells.length).fill(nearReach + 1)
      let ring: number[] = []
      cells.forEach((c, i) => {
        if (c.kind !== 'field') {
          next[i] = 0
          ring.push(i)
        }
      })
      for (let step = 1; step <= nearReach && ring.length; step++) {
        const out: number[] = []
        for (const i of ring) {
          const x = i % cols
          const y = (i - x) / cols
          for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
              const nx = x + dx
              const ny = y + dy
              if (nx < 0 || ny < 0 || nx >= cols || ny >= rows) continue
              const j = ny * cols + nx
              if (next[j] <= step) continue
              next[j] = step
              out.push(j)
            }
          }
        }
        ring = out
      }
      const changed: Cell[] = []
      cells.forEach((c, i) => {
        if (c.near !== next[i]) {
          c.near = next[i]
          changed.push(c)
        }
      })
      return changed
    }
    measureNear()
    /** A field cell's strength, or 0 where the field doesn't reach. */
    const fieldAlpha = (c: Cell) => {
      if (field === 'none') return 0
      if (field === 'full') return c.lit ? FAINT_LIT : FAINT
      if (c.near > nearReach) return 0
      const fade = nearReach > 1 ? 1 - ((c.near - 1) / (nearReach - 1)) * (1 - NEAR_FADE) : 1
      return (c.lit ? FAINT_LIT : FAINT) * fade
    }
    const accents = new Set<Cell>()
    if (palette === 'mono') {
      const pool = shapeCells()
      while (accents.size < Math.min(ACCENTS, pool.length)) accents.add(pool[Math.floor(Math.random() * pool.length)])
    }

    // Paused, every colour turns a grey of its own brightness between the
    // ground and the text, so the patches still read, just quietly.
    const greys = new Map<string, string>()
    const shade = (colour: string) => {
      if (!greyRef.current) return colour
      let grey = greys.get(colour)
      if (!grey) {
        const [r, g, b] = channels(colour)
        const light = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255
        grey = mix(ground, text, 0.12 + 0.3 * light)
        greys.set(colour, grey)
      }
      return grey
    }

    const draw = (c: Cell) => {
      const px = c.x * cell
      const py = c.y * cell
      ctx.clearRect(px, py, cell, cell)
      // A leaf slot with every swatch off falls back to the text colour.
      const own = c.slot >= 0 ? (resolveSlot(swatchesRef.current, c.slot) ?? text) : c.color
      const ink = shade(accents.has(c) ? accent : c.lit ? text : own)
      const side = cell - 2 * inset
      if (c.dash && c.kind !== 'field') {
        const bar = Math.max(u, Math.round(cell * STREAK_BAR))
        ctx.fillStyle = shade(
          c.dash.slot >= 0 ? (resolveSlot(swatchesRef.current, c.dash.slot) ?? text) : c.dash.color,
        )
        ctx.fillRect(px + inset, py + Math.round((cell - bar) / 2), side, bar)
        return
      }
      if (c.kind === 'field') {
        const alpha = fieldAlpha(c)
        if (c.glyph < 0 || alpha === 0) return
        ctx.globalAlpha = alpha
        glyphAt(sprite(c.glyph, text), px, py)
        ctx.globalAlpha = 1
        return
      }
      if (c.kind === 'tile' || c.kind === 'solid') {
        ctx.fillStyle = ink
        ctx.fillRect(px + inset, py + inset, side, side)
        if (c.kind === 'tile' && c.glyph >= 0) glyphAt(sprite(c.glyph, ground), px, py)
        return
      }
      if (c.kind === 'frame') {
        ctx.fillStyle = ink
        ctx.fillRect(px + inset, py + inset, side, u)
        ctx.fillRect(px + inset, py + cell - inset - u, side, u)
        ctx.fillRect(px + inset, py + inset, u, side)
        ctx.fillRect(px + cell - inset - u, py + inset, u, side)
      }
      if (c.glyph >= 0) glyphAt(sprite(c.glyph, ink), px, py)
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    cells.forEach(draw)
    repaintRef.current = () => cells.forEach(draw)

    const rate = SPEED[speed]
    const flip = (c: Cell) => {
      // Under `scatter` a change sometimes deals the cell a new treatment too,
      // so the solids and frames wander rather than sit in place.
      if (mixMode === 'scatter' && c.reroll && Math.random() < 0.25) {
        const kind = weighted(SCATTER)
        if (kind !== c.kind) {
          c.kind = kind
          // The logo's leaf colours are the mark's own, whatever the treatment.
          if (shape !== 'mark' || palette === 'mono') Object.assign(c, paintAt(c.x, c.y, c.level, kind))
        }
      }
      c.glyph = blank(c.kind) ? -1 : pick(c.glyph)
    }
    const dirty = new Set<Cell>()

    // The pointer stirs the cells it passes over — a direct response, so it
    // runs under reduced motion too.
    // Heard on the window, so copy laid over the canvas doesn't stop it.
    const onMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect()
      if (
        pausedRef.current ||
        event.clientX < rect.left ||
        event.clientX > rect.right ||
        event.clientY < rect.top ||
        event.clientY > rect.bottom
      )
        return
      const gx = ((event.clientX - rect.left) / rect.width) * cols
      const gy = ((event.clientY - rect.top) / rect.height) * rows
      const t = performance.now()
      const reach = 2 * grain
      for (let y = Math.floor(gy - reach); y <= gy + reach; y++) {
        for (let x = Math.floor(gx - reach); x <= gx + reach; x++) {
          if (x < 0 || y < 0 || x >= cols || y >= rows) continue
          if (Math.hypot(x + 0.5 - gx, y + 0.5 - gy) > 1.8 * grain) continue
          const c = cells[y * cols + x]
          if (t - c.touched < 300) continue
          c.touched = t
          flip(c)
          dirty.add(c)
        }
      }
      if (still) {
        dirty.forEach(draw)
        dirty.clear()
      }
    }
    window.addEventListener('pointermove', onMove)

    let frame = 0
    if (!still) {
      const maxD = cells.reduce((m, c) => Math.max(m, c.d), 0) + 1
      const rippleMs = 1600 / rate
      const ripplePeriod = 5200 / rate
      let rippleId = 0
      let rippleStart = now0 + 1200
      let nextAccent = now0 + 900 / rate
      let nextSway = now0 + SWAY_STEP_MS
      let nextFlow = now0 + FLOW_STEP_MS
      let lastFlow = now0
      let nextStreak = now0 + 600 / rate
      let last = now0

      type Streak = { y: number; head: number; from: number; len: number; speed: number; covered: Cell[] }
      const running: Streak[] = []
      /** A streak's colour: a leaf slot under Leaf, a light tone (now and then the accent) under Mono. */
      const streakPaint = () =>
        palette === 'mono'
          ? { slot: -1, color: Math.random() < 0.15 ? accent : mix(ground, text, TONES[2 + Math.floor(Math.random() * 2)]) }
          : { slot: Math.floor(Math.random() * 8), color: text }
      const spawnStreak = (y: number) => {
        const row = cells.slice(y * cols, (y + 1) * cols).filter((c) => c.kind !== 'field')
        if (!row.length) return
        // Mostly from the side the shape comes in from, so the bars sweep across it.
        const pick = Math.floor(Math.random() ** 2 * row.length)
        const start = row[mirror ? row.length - 1 - pick : pick].x
        running.push({
          y,
          head: start,
          from: start,
          len: Math.round(rand(...STREAK_LEN) * grain),
          speed: rand(...STREAK_SPEED) * grain * rate,
          covered: [],
        })
      }

      const tick = (now: number) => {
        if (!visibleRef.current || pausedRef.current) {
          last = now
          frame = requestAnimationFrame(tick)
          return
        }
        const dt = Math.min(0.1, (now - last) / 1000)
        last = now
        for (const c of cells) {
          if (now >= c.next) {
            flip(c)
            dirty.add(c)
            c.next = now + (c.kind === 'field' ? rand(1800, 9000) : rand(500, 3600)) / rate
          }
        }
        if (ripple !== 'off' && now >= rippleStart) {
          const front = ((now - rippleStart) / rippleMs) * maxD
          if (rippleId === 0 || front > maxD) {
            rippleId += 1
            for (const c of cells) {
              if (c.lit) {
                c.lit = false
                dirty.add(c)
              }
            }
            rippleStart = now + (rippleId === 1 ? 0 : ripplePeriod - rippleMs)
          } else {
            for (const c of cells) {
              if (c.ripple !== rippleId && c.d <= front) {
                c.ripple = rippleId
                flip(c)
                dirty.add(c)
              }
              const lit = Math.abs(c.d - front) < BAND * grain
              if (lit !== c.lit) {
                c.lit = lit
                dirty.add(c)
              }
            }
          }
        }
        // The edge sways: cells the line passes over come in or go out, and
        // the ones that stay take their new light level's colour (their
        // treatment holds, so the inside doesn't churn).
        if (edge && sway && now >= nextSway) {
          nextSway = now + SWAY_STEP_MS
          const next = edgeField((now - now0) * SWAY_PACE * rate)
          for (const c of cells) {
            const i = c.y * cols + c.x
            const was = c.kind !== 'field'
            if (!next.inside[i]) {
              if (!was) continue
              accents.delete(c)
              Object.assign(c, { kind: 'field', color: text, slot: -1, reroll: false, level: 0 })
              dirty.add(c)
              continue
            }
            const level = edgeLevel(next.dist[i])
            if (!was) {
              const rim = next.dist[i] < 0.9
              const kind = treat(c.x, c.y, level, rim)
              Object.assign(c, { kind, reroll: true, level, rim, seed: seedIndexAt(c.x, c.y) }, paintAt(c.x, c.y, level, kind))
              if (blank(kind)) c.glyph = -1
              dirty.add(c)
            } else if (level !== c.level) {
              c.level = level
              Object.assign(c, paintAt(c.x, c.y, level, c.kind))
              dirty.add(c)
            }
          }
          // The near field follows the line.
          if (field === 'near') for (const c of measureNear()) dirty.add(c)
        }
        // Streaks: start a few (sometimes two or three rows together, the way
        // they come in the recording), slide each one's run of bars along its
        // row over the shape's cells, and give back the cells it leaves with
        // a fresh glyph.
        if (streaks && now >= nextStreak) {
          nextStreak = now + rand(...STREAK_GAP) / rate
          if (running.length < STREAK_MAX) {
            const y = Math.floor(Math.random() * rows)
            const band = Math.random() < 0.35 ? 1 + Math.floor(Math.random() * 2) : 0
            for (let k = 0; k <= band; k++) if (y + k < rows) spawnStreak(y + k)
          }
        }
        for (let i = running.length - 1; i >= 0; i--) {
          const streak = running[i]
          // Left to right, or mirrored, right to left.
          streak.head += (mirror ? -1 : 1) * streak.speed * dt
          const headX = Math.floor(streak.head)
          const tailX = mirror ? headX + streak.len - 1 : headX - streak.len + 1
          const lo = mirror ? Math.max(0, headX) : Math.max(streak.from, tailX)
          const hi = mirror ? Math.min(streak.from, tailX) : Math.min(cols - 1, headX)
          const under: Cell[] = []
          for (let x = lo; x <= hi; x++) {
            const c = cells[streak.y * cols + x]
            if (c.kind !== 'field') under.push(c)
          }
          for (const c of streak.covered) {
            if (under.includes(c)) continue
            c.dash = null
            flip(c)
            dirty.add(c)
          }
          const base = streakPaint()
          for (const c of under) {
            if (c.dash) continue
            c.dash = Math.random() < STREAK_MIX ? streakPaint() : base
            dirty.add(c)
          }
          streak.covered = under
          if (mirror ? tailX < 0 : tailX >= cols) running.splice(i, 1)
        }
        // Flow: drift the seeds and re-read which patch each cell is in; a
        // cell that's changed patch takes the new one's colour, and under
        // Patches its treatment.
        if (flow && now >= nextFlow) {
          // Capped, so coming back on screen doesn't jump the seeds across the grid.
          const step = Math.min(0.3, (now - lastFlow) / 1000)
          lastFlow = now
          nextFlow = now + FLOW_STEP_MS
          for (const seed of seeds) {
            seed.x += seed.vx * step * rate
            seed.y += seed.vy * step * rate
            if (seed.x < -3 || seed.x > cols + 3) seed.vx *= -1
            if (seed.y < -3 || seed.y > rows + 3) seed.vy *= -1
          }
          for (const c of cells) {
            if (!c.reroll) continue
            const s = seedIndexAt(c.x, c.y)
            if (s === c.seed) continue
            c.seed = s
            if (mixMode === 'patches') c.kind = treat(c.x, c.y, c.level, c.rim)
            if (shape !== 'mark' || palette === 'mono') Object.assign(c, paintAt(c.x, c.y, c.level, c.kind))
            dirty.add(c)
          }
        }
        if (palette === 'mono' && now >= nextAccent) {
          nextAccent = now + rand(700, 1800) / rate
          const pool = shapeCells().filter((c) => !accents.has(c))
          if (accents.size >= ACCENTS) {
            const old = [...accents][Math.floor(Math.random() * accents.size)]
            accents.delete(old)
            dirty.add(old)
          }
          if (pool.length) {
            const fresh = pool[Math.floor(Math.random() * pool.length)]
            accents.add(fresh)
            dirty.add(fresh)
          }
        }
        dirty.forEach(draw)
        dirty.clear()
        frame = requestAnimationFrame(tick)
      }
      frame = requestAnimationFrame(tick)
    }

    return () => {
      repaintRef.current = null
      cancelAnimationFrame(frame)
      window.removeEventListener('pointermove', onMove)
    }
  }, [box, shape, glyphs, palette, mixMode, size, fit, colors, outline, faceWeight, speed, ripple, rippleFrom, sway, streaks, flow, patchSize, bleed, mirror, field, taper, edgeLine, fill, still, themeVersion])

  return (
    <div
      ref={wrapRef}
      style={{
        width: '100%',
        display: 'flex',
        justifyContent: fill ? (mirror ? 'flex-end' : 'flex-start') : 'center',
        alignItems: 'flex-start',
        ...(fill ? { height: '100%' } : null),
        ...wrapStyle,
      }}
    >
      <div style={{ position: 'relative', lineHeight: 0 }}>
        <canvas
          ref={canvasRef}
          aria-label={label}
          role="img"
          style={{ background: colors?.ground, borderRadius: cornerRadius }}
        />
        <canvas
          ref={fadeRef}
          aria-hidden
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            opacity: 0,
            pointerEvents: 'none',
            borderRadius: cornerRadius,
          }}
        />
      </div>
    </div>
  )
}

/**
 * The texture on Hi's first screen: the Landing preset's Edge, mirrored to
 * come in from the window's right edge. The caller places and sizes it; the
 * grid fills that box from its top right, the line reaching across its whole
 * width, and the box's far edge is softened (`mask`) so the field doesn't
 * stop on a hard line.
 */
export function HomeTexture({ style }: { style?: CSSProperties }) {
  const paused = useTexturePaused()
  return (
    <TextureCanvas
      {...LANDING_SETTINGS}
      paused={paused}
      mirror
      fill
      label="A wavering edge of pixel faces, leaves and shapes"
      wrapStyle={{
        maskImage: 'linear-gradient(to right, transparent 0, #000 12%)',
        WebkitMaskImage: 'linear-gradient(to right, transparent 0, #000 12%)',
        ...style,
      }}
    />
  )
}
