/*
  The brand page's pixel art as SVG paths, read off the site's own data (the
  mark and label from `introTimeline`, the faces from `pixelFaces`, every glyph
  from `pixelTexture`), so the page shows the real thing rather than exports.
  Each colour is traced as one outline (`unionPath` at radius 0), so no
  hairline opens between neighbouring squares at any scale. Kept out of the
  component file for Fast Refresh.
*/
import { LABEL, LEAVES, MARK, MARK_INK } from './introTimeline'
import { unionPath } from './interlock'
import { FACE_DOTS } from './pixelFaces'
import { FACE_GLYPHS, LEAF_GLYPHS, SHAPE_GLYPHS, THIN_FACE_GLYPHS, type Glyph } from './pixelTexture'

export type Ink = { color: string; d: string }

/** Every square of `rows` whose character passes `on`, one outline. */
export function rowsPath(rows: string[], on: (ch: string) => boolean, ox = 0, oy = 0): string {
  const boxes = rows.flatMap((row, y) => [...row].flatMap((ch, x) => (on(ch) ? [{ x: x + ox, y: y + oy, w: 1, h: 1 }] : [])))
  return unionPath(boxes, 0)
}

/** Rows split by ink, in the order given (later ones paint over earlier). */
function inks(rows: string[], map: Record<string, string>, order: string[], ox = 0, oy = 0): Ink[] {
  return order
    .map((ch) => ({ color: map[ch], d: rowsPath(rows, (c) => c === ch, ox, oy) }))
    .filter((ink) => ink.d)
}

/** Fills before the outline, so the black reads on top like the file. */
const MARK_ORDER = ['g', 'G', 'o', 'O', 'y', 'Y', 't', 'T', 'k']

/** The four-leaf mark, 23 × 23. */
export const MARK_INKS: Ink[] = inks(MARK, MARK_INK, MARK_ORDER)
export const MARK_SIZE = MARK.length

/** The "Noey" label, 13 × 3 blocks. */
export const LABEL_PATH = rowsPath(LABEL, (c) => c === 'X')
export const LABEL_COLS = LABEL[0].length
export const LABEL_ROWS = LABEL.length

/** Clockwise from the top. */
export const LEAF_NAMES = ['Top', 'Right', 'Bottom', 'Left']

/** Each of the mark's leaves on its own, pushed `spread` squares out from the centre. */
export function leavesApart(spread: number): { leaf: number; inks: Ink[] }[] {
  const out: [number, number][] = [
    [0, -1],
    [1, 0],
    [0, 1],
    [-1, 0],
  ]
  return LEAVES.map(({ leaf, x, y, rows }) => ({
    leaf,
    inks: inks(rows, MARK_INK, MARK_ORDER, x + out[leaf][0] * spread + spread, y + out[leaf][1] * spread + spread),
  }))
}

/** A glyph as one outline on its 16-square cell, centred on its own bounds (not the grid's floor). */
export function glyphPath(glyph: Glyph): string {
  const boxes = glyph.rects.map(([x, y, w, h]) => ({ x, y, w, h }))
  if (!boxes.length) return ''
  const minX = Math.min(...boxes.map((b) => b.x))
  const maxX = Math.max(...boxes.map((b) => b.x + b.w))
  const minY = Math.min(...boxes.map((b) => b.y))
  const maxY = Math.max(...boxes.map((b) => b.y + b.h))
  const dx = (16 - (maxX - minX)) / 2 - minX
  const dy = (16 - (maxY - minY)) / 2 - minY
  return unionPath(
    boxes.map((b) => ({ ...b, x: b.x + dx, y: b.y + dy })),
    0,
  )
}

export type NamedGlyph = { name: string; d: string }
const named = (list: Glyph[]): NamedGlyph[] =>
  // A glyph with no squares (the shapes' `square-filled`, whose rows trim to dots) is left out.
  list.map((g) => ({ name: g.name, d: glyphPath(g) })).filter((g) => g.d)

export const GLYPH_SETS: { name: string; glyphs: NamedGlyph[] }[] = [
  { name: 'Faces', glyphs: named(FACE_GLYPHS) },
  { name: 'Thin faces', glyphs: named(THIN_FACE_GLYPHS) },
  { name: 'Leaves', glyphs: named(LEAF_GLYPHS) },
  { name: 'Shapes', glyphs: named(SHAPE_GLYPHS) },
]

/** The rail's faces in their own 2px squares, as they sit in a tab. */
export const RAIL_FACES = Object.fromEntries(
  Object.entries(FACE_DOTS).map(([name, dots]) => [
    name,
    unionPath(
      dots.map(([x, y]) => ({ x, y, w: 2, h: 2 })),
      0,
    ),
  ]),
) as Record<keyof typeof FACE_DOTS, string>
