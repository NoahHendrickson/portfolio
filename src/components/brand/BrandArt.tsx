import type { CSSProperties, ReactNode } from 'react'
import {
  GLYPH_SETS,
  LABEL_COLS,
  LABEL_PATH,
  LABEL_ROWS,
  LEAF_NAMES,
  MARK_INKS,
  MARK_SIZE,
  RAIL_FACES,
  leavesApart,
  type NamedGlyph,
} from '../../brandArt'
import { roundedLoop } from '../../interlock'
import { LANDING_SWATCHES } from '../../pixelTexture'
import { radius, space } from '../../design-system/tokens'
import { TEXT_SOFT } from '../../sheetStyle'

/*
  The brand page's art, drawn live from the site's own data (`brandArt.ts`):
  the mark, the word, the glyphs, the cell treatments, the Spine post. Everything sits
  straight on the page's surface (the V2 guidelines: no panel inside the card),
  so a glyph cut into a tile is cut in the surface's own colour.
*/

/** The surface the art sits on: a glyph cut into a tile shows it. */
const SURFACE = 'var(--color-bg-primary)'
const LANDING = LANDING_SWATCHES.map((s) => s.value)
/** The label's blocks are three of the mark's squares; the gap to the mark is the intro's 4.6. */
const BLOCK = 3
const LOCKUP_GAP = 4.6

/** Drawn at its size, but shrinks with its box (height follows) rather than overflow it. */
const FIT: CSSProperties = { display: 'block', maxWidth: '100%', height: 'auto', minWidth: 0, flexShrink: 1 }

const LABEL: CSSProperties = { fontFamily: '"Geist Mono", ui-monospace, monospace', fontSize: '12px', lineHeight: 1.4, color: TEXT_SOFT }

export function Mono({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return <span style={{ ...LABEL, ...style }}>{children}</span>
}

/** The four-leaf mark at `square` px a square. */
export function Mark({ square = 8, title = 'The Noey four-leaf mark' }: { square?: number; title?: string }) {
  const size = MARK_SIZE * square
  return (
    <svg width={size} height={size} viewBox={`0 0 ${MARK_SIZE} ${MARK_SIZE}`} role="img" aria-label={title} style={FIT}>
      {MARK_INKS.map((ink) => (
        <path key={ink.color} d={ink.d} fill={ink.color} />
      ))}
    </svg>
  )
}

/** The "Noey" label at the mark's `square`: each block is three of them. */
export function Wordmark({ square = 8, color = 'currentColor' }: { square?: number; color?: string }) {
  const block = square * BLOCK
  return (
    <svg
      width={LABEL_COLS * block}
      height={LABEL_ROWS * block}
      viewBox={`0 0 ${LABEL_COLS} ${LABEL_ROWS}`}
      role="img"
      aria-label="Noey"
      style={FIT}
    >
      <path d={LABEL_PATH} fill={color} />
    </svg>
  )
}

/** The mark, then the word, 4.6 squares apart and centred on it, the way the intro sets them. */
export function Lockup({ square = 8, color }: { square?: number; color?: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: square * LOCKUP_GAP }}>
      <Mark square={square} />
      <Wordmark square={square} color={color} />
    </div>
  )
}

/** The mark on its 23 × 23 grid, every square ruled. */
export function MarkConstruction({ square = 16 }: { square?: number }) {
  const n = MARK_SIZE
  const lines = Array.from({ length: n + 1 }, (_, i) => i)
  return (
    <svg
      viewBox={`-0.5 -0.5 ${n + 1} ${n + 1}`}
      width={(n + 1) * square}
      height={(n + 1) * square}
      role="img"
      aria-label="The mark on its 23 by 23 grid"
      style={FIT}
    >
      {MARK_INKS.map((ink) => (
        <path key={ink.color} d={ink.d} fill={ink.color} />
      ))}
      <g stroke="currentColor" strokeOpacity={0.16}>
        {lines.map((i) => (
          <g key={i}>
            <line x1={i} y1={0} x2={i} y2={n} vectorEffect="non-scaling-stroke" />
            <line x1={0} y1={i} x2={n} y2={i} vectorEffect="non-scaling-stroke" />
          </g>
        ))}
      </g>
    </svg>
  )
}

/** The four leaves pulled apart, each the same 9 × 13 leaf turned, named beside it. */
export function LeavesApart({ square = 12, spread = 4 }: { square?: number; spread?: number }) {
  const span = MARK_SIZE + spread * 2
  const leaves = leavesApart(spread)
  return (
    <svg
      viewBox={`0 0 ${span} ${span}`}
      width={span * square}
      height={span * square}
      role="img"
      aria-label="The mark's four leaves, pulled apart: green top, orange right, yellow bottom, teal left"
      style={FIT}
    >
      {leaves.map(({ leaf, inks }) => (
        <g key={leaf}>
          <title>{LEAF_NAMES[leaf]}</title>
          {inks.map((ink) => (
            <path key={ink.color} d={ink.d} fill={ink.color} />
          ))}
        </g>
      ))}
    </svg>
  )
}

/** The word on its block grid, one block cut into its three-by-three squares. */
export function WordmarkConstruction({ square = 12 }: { square?: number }) {
  const block = BLOCK
  const w = LABEL_COLS * block
  const h = LABEL_ROWS * block
  return (
    <svg
      viewBox={`-0.5 -0.5 ${w + 1} ${h + 1}`}
      width={(w + 1) * square}
      height={(h + 1) * square}
      role="img"
      aria-label="The word Noey on its grid of blocks, each block three squares"
      style={FIT}
    >
      <g transform={`scale(${block})`}>
        <path d={LABEL_PATH} fill="currentColor" />
      </g>
      <g stroke="currentColor" strokeOpacity={0.18}>
        {Array.from({ length: LABEL_COLS + 1 }, (_, i) => (
          <line key={`v${i}`} x1={i * block} y1={0} x2={i * block} y2={h} vectorEffect="non-scaling-stroke" />
        ))}
        {Array.from({ length: LABEL_ROWS + 1 }, (_, i) => (
          <line key={`h${i}`} x1={0} y1={i * block} x2={w} y2={i * block} vectorEffect="non-scaling-stroke" />
        ))}
      </g>
      <g stroke="var(--color-orange)" strokeWidth={1.5}>
        {[1, 2].map((i) => (
          <g key={i}>
            <line x1={i} y1={0} x2={i} y2={block} vectorEffect="non-scaling-stroke" />
            <line x1={0} y1={i} x2={block} y2={i} vectorEffect="non-scaling-stroke" />
          </g>
        ))}
        <rect x={0} y={0} width={block} height={block} fill="none" vectorEffect="non-scaling-stroke" />
      </g>
    </svg>
  )
}

/** A glyph alone (`ink`) or cut into a square tile of `tile` colour. */
export function GlyphTile({
  glyph,
  size = 56,
  tile,
  ink,
}: {
  glyph: NamedGlyph
  size?: number
  tile?: string
  ink?: string
}) {
  return (
    <svg width={size} height={size} viewBox="-2 -2 20 20" role="img" aria-label={glyph.name} style={{ display: 'block', flexShrink: 0 }}>
      {tile && <rect x={-1} y={-1} width={18} height={18} fill={tile} />}
      <path d={glyph.d} fill={tile ? SURFACE : (ink ?? 'currentColor')} />
    </svg>
  )
}

/** Every glyph set, each glyph cut into a tile in the landing colours. */
export function GlyphSheet({ size = 56 }: { size?: number }) {
  let n = 0
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: space.xl }}>
      {GLYPH_SETS.map((set) => (
        <div key={set.name} style={{ display: 'flex', flexDirection: 'column', gap: space.sm }}>
          <Mono>
            {set.name} / {set.glyphs.length}
          </Mono>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {set.glyphs.map((g) => {
              const color = LANDING[n++ % LANDING.length]
              // Thin faces read as bare line, the way the texture sets them; the rest as tiles.
              return set.name === 'Thin faces' ? (
                <GlyphTile key={g.name} glyph={g} size={size} ink={color} />
              ) : (
                <GlyphTile key={g.name} glyph={g} size={size} tile={color} />
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}

/** The texture's six treatments, a cell each, named under it. */
export function Treatments({ size = 88 }: { size?: number }) {
  const smirk = GLYPH_SETS[0].glyphs[0]
  const leaf = GLYPH_SETS[2].glyphs[0]
  const flower = GLYPH_SETS[3].glyphs.find((g) => g.name === 'flower') ?? leaf
  const cells: { name: string; art: ReactNode }[] = [
    { name: 'tile', art: <><rect x={-1} y={-1} width={18} height={18} fill={LANDING[0]} /><path d={smirk.d} fill={SURFACE} /></> },
    { name: 'ink', art: <path d={flower.d} fill={LANDING[2]} /> },
    { name: 'solid', art: <rect x={-1} y={-1} width={18} height={18} fill={LANDING[1]} /> },
    {
      name: 'frame',
      art: (
        <>
          <path d="M-1 -1H17V17H-1Z M0 0V16H16V0Z" fill={LANDING[4]} fillRule="evenodd" />
          <path d={leaf.d} fill={LANDING[4]} />
        </>
      ),
    },
    { name: 'field', art: <path d={smirk.d} fill="currentColor" fillOpacity={0.2} /> },
    { name: 'streak', art: <rect x={-1} y={5} width={18} height={6} fill={LANDING[7]} /> },
  ]
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: space.lg }}>
      {cells.map((cell) => (
        <div key={cell.name} style={{ display: 'flex', flexDirection: 'column', gap: space.sm }}>
          <svg width={size} height={size} viewBox="-2 -2 20 20" role="img" aria-label={`${cell.name} cell`} style={{ display: 'block' }}>
            {cell.art}
          </svg>
          <Mono>{cell.name}</Mono>
        </div>
      ))}
    </div>
  )
}

/** A base colour over its highlight, the way each leaf carries both. */
export function LeafSwatch({ base, highlight, minHeight = 0 }: { base: string; highlight: string; minHeight?: number }) {
  return (
    <div style={{ borderRadius: radius.xl, overflow: 'hidden', flex: 1, minHeight, display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 7, background: base }} />
      <div style={{ flex: 3, background: highlight }} />
    </div>
  )
}

/** The radius scale, one rounded square each, smallest first. */
export function RadiusScale() {
  const steps: [string, number][] = [
    ['6', 6],
    ['8', 8],
    ['12', 12],
    ['16', 16],
    ['24', 24],
    ['32', 32],
    ['full', 999],
  ]
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: space.md }}>
      {steps.map(([name, r]) => (
        <div key={name} style={{ display: 'flex', flexDirection: 'column', gap: space.sm, alignItems: 'flex-start' }}>
          <div style={{ width: 56, height: 56, borderRadius: r, background: 'var(--color-text-primary)' }} />
          <Mono>{name}</Mono>
        </div>
      ))}
    </div>
  )
}

/** The leaf sprites the field walks through, from `public/leaves/`. */
const LEAF_SRC = {
  orange: '/leaves/leaf-00.webp',
  amber: '/leaves/leaf-01.webp',
  teal: '/leaves/leaf-02.webp',
  green: '/leaves/leaf-03.webp',
  pink: '/leaves/leaf-04.png',
  blue: '/leaves/leaf-05.png',
  red: '/leaves/leaf-06.png',
}
/** One set of columns walks these, each colour two leaves running… */
const EVEN_WALK = [LEAF_SRC.amber, LEAF_SRC.orange, LEAF_SRC.blue, LEAF_SRC.red]
/** …and the columns between walk these, so neighbours never match. */
const ODD_WALK = [LEAF_SRC.green, LEAF_SRC.teal, LEAF_SRC.pink]

/**
 * The original leaf pattern (Figma Frame 455), full bleed: the home field's
 * brick lattice (`LeafPattern`: a 117 × 81 leaf on a 79 × 72 grid, odd columns
 * dropped half a row), in seven of the sprite colours, each column walking its
 * own set two leaves at a time. Whole CSS pixels, `pixelated`, and a fixed
 * count of leaves comfortably past any slot it fills; the box clips.
 */
export function LeafField({ cols = 12, rows = 16 }: { cols?: number; rows?: number }) {
  const leaves: { key: string; src: string; x: number; y: number }[] = []
  for (let col = -1; col < cols; col++) {
    const odd = Math.abs(col) % 2 === 1
    for (let row = -1; row < rows; row++) {
      const walk = odd ? ODD_WALK : EVEN_WALK
      // As the frame runs: the first column opens on one amber, then pairs; its neighbour on a pair of greens.
      const step = odd ? Math.floor(row / 2) : Math.floor((row + 1) / 2)
      const at = ((step % walk.length) + walk.length) % walk.length
      leaves.push({ key: `${col}:${row}`, src: walk[at], x: col * 79 - 20, y: row * 72 + (odd ? 36 : 0) })
    }
  }
  return (
    <div
      role="img"
      aria-label="The pixel leaf pattern: rows of interlocking leaves in amber, orange, blue, red, green, teal and pink"
      style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#000' }}
    >
      {leaves.map((leaf) => (
        <img
          key={leaf.key}
          src={leaf.src}
          alt=""
          draggable={false}
          loading="lazy"
          decoding="async"
          style={{
            position: 'absolute',
            left: leaf.x,
            top: leaf.y,
            width: 117,
            height: 81,
            maxWidth: 'none',
            display: 'block',
            imageRendering: 'pixelated',
          }}
        />
      ))}
    </div>
  )
}

/** The Spine post's outline: the spine runs into bands past the frame, so it meets the top and bottom edges concave. */
const SPINE_POST_PATH = roundedLoop(
  [
    [0, -120],
    [1200, -120],
    [1200, 0],
    [150, 0],
    [150, 160],
    [640, 160],
    [640, 330],
    [150, 330],
    [150, 455],
    [900, 455],
    [900, 625],
    [150, 625],
    [150, 750],
    [520, 750],
    [520, 920],
    [150, 920],
    [150, 1080],
    [1200, 1080],
    [1200, 1200],
    [0, 1200],
  ],
  44,
  60,
)

/**
 * The Spine post (`06 · Spine` in the brand file), drawn live so its spine takes
 * the page's own colour: cream in light mode, char in dark, the page cutting
 * into the blue either way. The faces keep colours that read on both.
 */
export function SpinePost() {
  const glyph = (name: string) => GLYPH_SETS.flatMap((set) => set.glyphs).find((g) => g.name === name)
  const heart = glyph('heart')
  const up = glyph('arrow-up')
  const faces: [keyof typeof RAIL_FACES, string, number][] = [
    ['smirk', '#FF4F95', 165],
    ['laugh', '#F95B1C', 460],
    ['emoticon', '#26B846', 755],
  ]
  return (
    <svg
      viewBox="0 0 1080 1080"
      role="img"
      aria-label="A spine with three pills growing out of it, a face in each, cut into deep blue"
      style={{ display: 'block', width: '100%', height: 'auto' }}
    >
      <rect width={1080} height={1080} fill="#0D81DE" />
      <path d={SPINE_POST_PATH} fill="var(--color-bg-primary)" />
      {faces.map(([face, color, y]) => (
        <path key={face} d={RAIL_FACES[face]} fill={color} transform={`translate(170 ${y}) scale(10)`} />
      ))}
      {heart && <path d={heart.d} fill="#0D81DE" transform="translate(740 480) scale(7.5)" />}
      {up && <path d={up.d} fill="#FFD233" transform="translate(955 915) scale(6)" />}
    </svg>
  )
}
