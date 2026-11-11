/*
  The Texture tab's glyphs, apart from `PixelTexture` so the component file
  exports only components (Fast Refresh).

  Every glyph sits on the rail's 16-unit face grid as rects, so a face and a
  leaf can share one cell. A leaf is its outline and veins only (the `k`
  squares of one of the mark's four leaves), 1 unit a square, centred in the
  16. The faces come two ways: `FACE_GLYPHS`, the rail's own, in 2-unit
  squares, and `THIN_FACE_GLYPHS`, the same five redrawn smaller in 1-unit
  lines so they carry the leaves' weight (Nov 11 2026, the rail's read too big
  and heavy beside the leaves).
*/
import { LEAVES } from './introTimeline'
import { FACE_DOTS, HEART_ROWS } from './pixelFaces'

export type Glyph = { name: string; rects: [number, number, number, number][] }

export const GLYPH_SIZE = 16

/**
 * The Hero's pixel heart, set with the faces (it's the same hand's pixel art).
 * Glyphs are one colour, so its two shine squares are left out as holes:
 * the shine shows through in whatever the cell is drawn on.
 */
const heart = (): Glyph => fromRows('heart', HEART_ROWS, (ch) => ch === '#')

export const FACE_GLYPHS: Glyph[] = [
  ...Object.entries(FACE_DOTS).map(([name, dots]): Glyph => ({
    name,
    rects: dots.map(([x, y]) => [x, y, 2, 2]),
  })),
  heart(),
]

/** Rows of pixel art (`on` filled), 1 unit a square, centred in the 16. */
function fromRows(name: string, rows: string[], on: (ch: string) => boolean): Glyph {
  const width = Math.max(...rows.map((row) => row.length))
  const ox = Math.floor((GLYPH_SIZE - width) / 2)
  const oy = Math.floor((GLYPH_SIZE - rows.length) / 2)
  return {
    name,
    rects: rows.flatMap((row, y) =>
      [...row].flatMap((ch, x): [number, number, number, number][] => (on(ch) ? [[ox + x, oy + y, 1, 1]] : [])),
    ),
  }
}

/** Clockwise from the top, the way the intro numbers them. */
export const LEAF_GLYPHS: Glyph[] = [...LEAVES]
  .sort((a, b) => a.leaf - b.leaf)
  .map(({ leaf, rows }) => fromRows(`leaf-${leaf}`, rows, (ch) => ch === 'k'))

/** The rail's five faces in 1-unit lines, each keeping its own eyes and mouth. */
const THIN_FACES: Record<keyof typeof FACE_DOTS, string[]> = {
  smirk: [
    '..#....#..',
    '..#....#..',
    '..#....#..',
    '..........',
    '..........',
    '.........#',
    '..#######.',
  ],
  grin: [
    '..#...#..',
    '..#...#..',
    '.........',
    '.........',
    '#.......#',
    '.#######.',
  ],
  laugh: [
    '..#...#..',
    '..#...#..',
    '.........',
    '#########',
    '#.......#',
    '.#######.',
  ],
  emoticon: [
    '...#...#...',
    '...#...#...',
    '...........',
    '...........',
    '#.........#',
    '.#.......#.',
    '..#######..',
  ],
  eyeroll: [
    '.#...#...',
    '..#...#..',
    '.........',
    '.........',
    '#########',
  ],
}

export const THIN_FACE_GLYPHS: Glyph[] = [
  ...Object.entries(THIN_FACES).map(([name, rows]) => fromRows(name, rows, (ch) => ch === '#')),
  heart(),
]

/** Fills each row between its outermost squares, turning an outline into its solid. */
const solid = (rows: string[]) =>
  rows.map((row) => {
    const a = row.indexOf('#')
    const b = row.lastIndexOf('#')
    return a < 0 ? row : '.'.repeat(a) + '#'.repeat(b - a + 1) + '.'.repeat(row.length - b - 1)
  })
const flipY = (rows: string[]) => [...rows].reverse()
const flipX = (rows: string[]) => rows.map((row) => [...row].reverse().join(''))

const CARET = ['....#....', '...#.#...', '..#...#..', '.#.....#.', '#.......#']
const CIRCLE = ['..#####..', '.#.....#.', '#.......#', '#.......#', '#.......#', '#.......#', '#.......#', '.#.....#.', '..#####..']
const DIAMOND = ['....#....', '...#.#...', '..#...#..', '.#.....#.', '#.......#', '.#.....#.', '..#...#..', '...#.#...', '....#....']
const SQUARE = ['#########', '#.......#', '#.......#', '#.......#', '#.......#', '#.......#', '#.......#', '#.......#', '#########']
const ARROW_UP = ['....#....', '...###...', '..#####..', '.#######.', '#########', '...###...', '...###...', '...###...', '...###...']
const ARROW_RIGHT = ['....#....', '.....#...', '......#..', '.......#.', '#########', '.......#.', '......#..', '.....#...', '....#....']

/**
 * Generic marks to set beside the faces and leaves, the way the references mix
 * ×s, slashes and diamonds in with their characters: some in the leaves' 1-unit
 * line, some bold or filled. Each fits inside the 16 like the rest.
 */
const SHAPES: Record<string, string[]> = {
  x: ['#.......#', '.#.....#.', '..#...#..', '...#.#...', '....#....', '...#.#...', '..#...#..', '.#.....#.', '#.......#'],
  'x-bold': [
    '##......##',
    '###....###',
    '.###..###.',
    '..######..',
    '...####...',
    '...####...',
    '..######..',
    '.###..###.',
    '###....###',
    '##......##',
  ],
  slash: ['........#', '.......#.', '......#..', '.....#...', '....#....', '...#.....', '..#......', '.#.......', '#........'],
  'slash-bold': ['.......##', '......###', '.....###.', '....###..', '...###...', '..###....', '.###.....', '###......', '##.......'],
  caret: CARET,
  'caret-bold': ['....#....', '...###...', '..##.##..', '.##...##.', '##.....##'],
  'arrow-up': ARROW_UP,
  'arrow-down': flipY(ARROW_UP),
  'arrow-right': ARROW_RIGHT,
  'arrow-left': flipX(ARROW_RIGHT),
  square: SQUARE,
  'square-filled': solid(SQUARE.slice(1, -1).map((row) => row.slice(1, -1))),
  circle: CIRCLE,
  'circle-filled': solid(CIRCLE),
  diamond: DIAMOND,
  'diamond-filled': solid(DIAMOND),
  plus: ['....#....', '....#....', '....#....', '....#....', '#########', '....#....', '....#....', '....#....', '....#....'],
  'plus-bold': ['...##...', '...##...', '...##...', '########', '########', '...##...', '...##...', '...##...'],
  triangle: solid(CARET),
  /**
   * A five-petal flower with a hole at its heart (Figma `487:7931`, a vector
   * 92 × 88), sampled onto 13 × 12 and tidied symmetric by hand: the notches
   * between the petals kept, the hole a small round.
   */
  flower: [
    '.....###.....',
    '....#####....',
    '.##.#####.##.',
    '#############',
    '######.######',
    '#####...#####',
    '.####...####.',
    '..####.####..',
    '.###########.',
    '.###########.',
    '..####.####..',
    '..###...###..',
  ],
  /** A square in a square, the Softcrow piece's ◎ tile. */
  target: ['#########', '#.......#', '#.......#', '#..###..#', '#..###..#', '#..###..#', '#.......#', '#.......#', '#########'],
}

export const SHAPE_GLYPHS: Glyph[] = Object.entries(SHAPES).map(([name, rows]) =>
  fromRows(name, rows, (ch) => ch === '#'),
)

/** The four leaves' base and highlight, in the same clockwise order. */
export const LEAF_FAMILIES: [string, string][] = [
  ['#26b846', '#3aed62'],
  ['#f95b1c', '#ff8f0c'],
  ['#fcb01a', '#ffd233'],
  ['#008755', '#08b776'],
]

/**
 * The colour picker's swatches: the four leaves' base and highlight as eight
 * slots, `family * 2 + (highlight ? 1 : 0)`, all on by default. A cell holds
 * its slot rather than a colour, so a swatch can change without reshuffling
 * the texture.
 */
export type Swatch = { value: string; on: boolean }

export const SWATCH_NAMES = LEAF_FAMILIES.flatMap((_, family) => {
  const leaf = ['Top', 'Right', 'Bottom', 'Left'][family]
  return [`${leaf} leaf`, `${leaf} leaf highlight`]
})

export const DEFAULT_SWATCHES: Swatch[] = LEAF_FAMILIES.flatMap(([base, highlight]) => [
  { value: base, on: true },
  { value: highlight, on: true },
])

/**
 * The landing page's colours: the defaults with the top leaf's highlight
 * swapped for a blue (the user's pick, read off their screenshot, Nov 11
 * 2026). The home texture and the "I'm overstimulated" button share them.
 */
export const LANDING_SWATCHES: Swatch[] = DEFAULT_SWATCHES.map((swatch, i) =>
  i === 1 ? { ...swatch, value: '#44aaf8' } : swatch,
)

/** The mark's inks as slots, in the same order (`MARK_INK`'s colours are the families'). */
export const MARK_SLOT: Record<string, number> = { g: 0, G: 1, o: 2, O: 3, y: 4, Y: 5, t: 6, T: 7 }

/**
 * A slot's colour. One that's off falls back to the other half of its leaf;
 * a leaf with both off hands its cells to the next leaf round that has one on,
 * so turning a colour off swaps it out rather than leaving holes. Null when
 * every swatch is off.
 */
export function resolveSlot(swatches: Swatch[], slot: number): string | null {
  const families = swatches.length / 2
  const family = slot >> 1
  const highlight = slot & 1
  for (let step = 0; step < families; step++) {
    const f = (family + step) % families
    const same = swatches[f * 2 + highlight]
    if (same.on) return same.value
    const other = swatches[f * 2 + 1 - highlight]
    if (other.on) return other.value
  }
  return null
}
