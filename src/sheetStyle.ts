import { radius } from './design-system/tokens'
import { FACE_DOTS } from './pixelFaces'
import type { Paragraph, Prose } from './data/projects'

/*
  The project pages' shared values, kept out of the component files (`Sheet.tsx`,
  `Curved.tsx`), which Fast Refresh wants exporting components only.
*/

/** The column, at the frame's 1728: 300 either side. */
export const SHEET_MAX = 1128
export const PAGE_BG = 'var(--color-bg-primary)'
export const TEXT = 'var(--color-text-primary)'
/** The frame's 65% copy — the intro's helper and description. */
export const TEXT_SOFT = 'color-mix(in srgb, var(--color-text-primary) 65%, transparent)'
/** The frame's 16% rule. */
export const RULE = '1px solid var(--color-border-default)'
/** The intro's padding, which the header's Back and Contact inset to. */
export const INTRO_PAD = '48px'
/** Every line in the frame runs at Geist's normal leading, about 1.3. */
export const LEADING = 1.3
/** A copy cell's measure, the frame's "What I wanted" text (673). */
export const COPY_MEASURE = 680
/** The curved pages' body copy, a step under the sheet's 16. */
export const CURVED_BODY_SIZE = '15px'
/** Media's corner inside a curved card: concentric with the card's 24 round its 8 of padding. */
export const CURVED_INNER = radius.xl

/** The curved page's text inset (`ProjectCurved`): the header, intro and cards share it. */
export const curvedInset = (isMobile: boolean) => (isMobile ? 20 : 32)

/**
 * The curved page's column, set off the window's height so a 16:9 clip and its
 * copy fit on one screen (about 995 on a 16-inch MacBook), up to the sheet's
 * 1128 on a tall monitor. 440 is what the card's padding, a typical tab and some
 * air take; the 16 is the card's padding across.
 */
export const CURVED_MAX = `clamp(820px, calc((100vh - 440px) * 16 / 9 + 16px), ${SHEET_MAX}px)`

/** The open space between sections — 96, 48 on a phone. */
export const sheetGap = (isMobile: boolean) => (isMobile ? 48 : 96)

export const SHEET_HEADING: React.CSSProperties = { margin: 0, fontSize: '20px', fontWeight: 500, lineHeight: LEADING }
export const SHEET_BODY: React.CSSProperties = {
  margin: 0,
  fontSize: '16px',
  fontWeight: 400,
  lineHeight: LEADING,
  color: TEXT,
}

export const toParagraphs = (text: Prose): Paragraph[] => (typeof text === 'string' ? [text] : text)

/**
 * The margins' pattern: the rail's five pixel faces scattered over one
 * 1440px tile, so the repeat is too far apart to read. Placed by a seeded
 * random walk (the same scatter every load): each face tries random spots
 * until it lands `FACE_GAP` clear of the rest (measured across the tile's
 * wrap, so none crowd at a seam), and takes its own strength, 40–100%. Each
 * face is drawn once in `<defs>` and placed with `<use>`, so the SVG stays
 * small, and the whole thing is used as a mask, so the colour stays a token.
 * (A staggered grid came first — 48, then 96, then 144 apart — and read too
 * regular.)
 */
export const FACE_TILE = (() => {
  const tile = 1440
  const count = 45
  const gap = 160
  // Each 2px square drawn at 5px, so a face is 40 rather than the rail's 16.
  const scale = 2.5
  const size = 16 * scale

  // mulberry32: a small seeded generator, so the scatter is stable.
  let seed = 0x6e6f3379
  const random = () => {
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
  const wrapGap = (a: number, b: number) => {
    const d = Math.abs(a - b)
    return Math.min(d, tile - d)
  }

  const faces = Object.values(FACE_DOTS)
  const defs = faces
    .map(
      (dots, i) =>
        `<g id="f${i}">${dots
          .map(([dx, dy]) => `<rect x="${dx * scale}" y="${dy * scale}" width="${2 * scale}" height="${2 * scale}"/>`)
          .join('')}</g>`,
    )
    .join('')

  const placed: { x: number; y: number }[] = []
  const uses: string[] = []
  for (let n = 0; n < count; n++) {
    for (let attempt = 0; attempt < 60; attempt++) {
      // Inside the tile, so no face is cut by its edge.
      const x = Math.round(random() * (tile - size))
      const y = Math.round(random() * (tile - size))
      if (placed.some((p) => Math.hypot(wrapGap(p.x, x), wrapGap(p.y, y)) < gap)) continue
      placed.push({ x, y })
      const face = Math.floor(random() * faces.length)
      const strength = (0.4 + random() * 0.6).toFixed(2)
      uses.push(`<use href="#f${face}" x="${x}" y="${y}" opacity="${strength}"/>`)
      break
    }
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${tile}" height="${tile}" shape-rendering="crispEdges"><defs>${defs}</defs>${uses.join('')}</svg>`
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`
})()

/**
 * How strongly the faces show across the page: 35% at the window's edges, gone
 * `FACE_REACH` of the way in to the column, so the margin nearest it is bare. (It ran
 * 90% → 6% at first, which read loud, then 35% → 4%, which carried too far in.)
 */
const FACE_REACH = 0.6
const FACE_MARGIN = `(50% - ${SHEET_MAX / 2}px)`
export const FACE_FADE = `linear-gradient(to right,
  rgb(0 0 0 / 0.35) 0,
  transparent calc(${FACE_MARGIN} * ${FACE_REACH}),
  transparent calc(100% - ${FACE_MARGIN} * ${FACE_REACH}),
  rgb(0 0 0 / 0.35) 100%)`

/** The CSS vars that re-point the site's accent to a page's own (`PageAccent`). */
export function accentTheme(accent?: { color: string; hover: string; ink: string }): React.CSSProperties | undefined {
  if (!accent) return undefined
  return {
    '--color-orange': accent.color,
    '--color-orange-hover': accent.hover,
    '--color-on-accent': accent.ink,
  } as React.CSSProperties
}
