import type { CSSProperties, ReactNode } from 'react'
import Header from './Header'
import { Runs } from './ProjectIntro'
import Reveal from './Reveal'
import { space } from '../design-system/tokens'
import { useIsMobile } from '../hooks/useIsMobile'
import { useReveal } from '../hooks/useReveal'
import type { CreamSide, PageAccent, Prose } from '../data/projects'
import { CREAM, CREAM_COLUMN, CREAM_GAP, CREAM_MARGIN, CREAM_RADIUS, creamMetrics } from '../creamStyle'
import { PAGE_BG, SHEET_BODY, SHEET_HEADING, TEXT, accentTheme, sheetGap, toParagraphs } from '../sheetStyle'

/*
  The cream lattice's building blocks (Nov 9 2026), the home bento's language
  for a project page: the showpieces suspended in blocks of cream, the copy
  between them straight on the dark, and a few gaps running on past a block to
  the screen's edge, flaring into concave fillets where they leave. Values are
  in `creamStyle.ts`.
*/

/**
 * A concave corner: cream everywhere but a dark quarter-circle on `at`. One
 * pixel bigger than the arc, on the sides that tuck under the cream.
 */
export function Fillet({ at, style, className }: { at: string; style: CSSProperties; className?: string }) {
  const R = CREAM_RADIUS
  return (
    <span
      className={className}
      style={{
        position: 'absolute',
        width: R + 1,
        height: R + 1,
        background: `radial-gradient(circle ${R}px at ${at}, transparent ${R - 0.5}px, ${CREAM} ${R + 0.5}px)`,
        ...style,
      }}
    />
  )
}

/**
 * The page: Back and Contact over one centred column, in line with the copy.
 * Sideways overflow is clipped because the rules run past the window. On a
 * phone the column runs edge to edge.
 */
export function CreamPage({ accent, children }: { accent?: PageAccent; children: ReactNode }) {
  const isMobile = useIsMobile()
  const { inset } = creamMetrics(isMobile)
  const column: CSSProperties = {
    width: isMobile ? '100%' : `min(${CREAM_COLUMN}px, 100% - ${CREAM_MARGIN * 2}px)`,
    margin: '0 auto',
    boxSizing: 'border-box',
  }

  return (
    <div style={{ ...accentTheme(accent), minHeight: '100vh', background: PAGE_BG, color: TEXT, overflowX: 'clip' }}>
      <div style={{ ...column, padding: isMobile ? 0 : `${space.lg} 0` }}>
        <Header leading="back" showProfile={false} barInset={`${inset}px`} />
      </div>
      <main style={{ ...column, display: 'flex', flexDirection: 'column' }}>{children}</main>
      <div aria-hidden style={{ height: sheetGap(isMobile) }} />
    </div>
  )
}

/**
 * One row of a block. `rule` carries the gap over it out past the block on that
 * side (for the first row, the block's top edge); `below` does the same for the
 * block's bottom edge, on the last row.
 */
export type CreamRow = { node: ReactNode; rule?: CreamSide; below?: CreamSide }

/**
 * Showpieces suspended in cream: the cream shows through the gaps and round the
 * outside. Its outer corners are concentric with the cells', except where a
 * rule leaves, which needs the corner square to run on from. A phone runs it
 * edge to edge, with no corners or rules.
 */
export function CreamBlock({ rows }: { rows: CreamRow[] }) {
  const isMobile = useIsMobile()
  const { gap, radius } = creamMetrics(isMobile)
  const last = rows.length - 1
  const corner = (side: CreamSide, rule?: CreamSide) => (isMobile || rule === side ? 0 : radius + gap)
  const top = rows[0]?.rule
  const bottom = rows[last]?.below

  return (
    <section
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap,
        padding: gap,
        background: CREAM,
        borderRadius: `${corner('left', top)}px ${corner('right', top)}px ${corner('right', bottom)}px ${corner('left', bottom)}px`,
      }}
    >
      {rows.map((row, i) => (
        <div key={i} style={{ position: 'relative' }}>
          {!isMobile && row.rule && <CreamRule place="above" edge={i === 0} side={row.rule} />}
          {row.node}
          {!isMobile && i === last && row.below && <CreamRule place="below" edge side={row.below} />}
        </div>
      ))}
    </section>
  )
}

/**
 * One gap carried past the block on one side, seated off its row. The box spans
 * the block's two outer edges, so everything hangs off those. On the block's
 * own top or bottom (`edge`) there is only cream on the block's side of the
 * rule, so it takes the one fillet; a gap inside the block takes a pair.
 */
function CreamRule({ place, edge = false, side }: { place: 'above' | 'below'; edge?: boolean; side: CreamSide }) {
  const G = CREAM_GAP
  const ref = useReveal<HTMLDivElement>()
  const isLeft = side === 'left'
  // Each piece tucks 1px under the cream beside it, so no seam can open.
  const out = isLeft ? { right: 'calc(100% - 1px)' } : { left: 'calc(100% - 1px)' }
  const arcX = isLeft ? '0' : '100%'
  // The corner each fillet grows out of, where the wall meets the rule.
  const originX = isLeft ? '100%' : '0'
  const over = place === 'below' || !edge
  const under = place === 'above'

  return (
    <div
      ref={ref}
      aria-hidden
      className="cream-rule"
      style={{
        position: 'absolute',
        left: -G,
        right: -G,
        top: place === 'above' ? -G : '100%',
        height: G,
        pointerEvents: 'none',
      }}
    >
      {/* From the block's wall to the screen's edge, so it grows at a visible
          pace (`.cream-rule` in `index.css`). The column is centred, so 50% is its half. */}
      <span
        className="cream-arm"
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          width: 'calc(50vw - 50% + 1px)',
          background: CREAM,
          transformOrigin: `${originX} 50%`,
          ...out,
        }}
      />
      {over && (
        <Fillet className="cream-fillet" at={`${arcX} 0`} style={{ ...out, top: -CREAM_RADIUS, transformOrigin: `${originX} 100%` }} />
      )}
      {under && (
        <Fillet className="cream-fillet" at={`${arcX} 100%`} style={{ ...out, top: G - 1, transformOrigin: `${originX} 0` }} />
      )}
    </div>
  )
}

/**
 * Media filling a cell, its corners clipped straight onto the cream. The cell
 * stays put and the media settles inside it as it scrolls in.
 */
export function CreamMedia({ delay, children }: { delay?: number; children: ReactNode }) {
  const isMobile = useIsMobile()
  const { radius } = creamMetrics(isMobile)
  return (
    <div style={{ position: 'relative', borderRadius: radius, overflow: 'hidden', isolation: 'isolate' }}>
      {/* The dark while it loads stops 1px short of the edge: reaching it, it
          bleeds through the corner's antialiasing as a fringe on the cream. */}
      <span aria-hidden style={{ position: 'absolute', inset: 1, borderRadius: radius - 1, background: PAGE_BG }} />
      <Reveal kind="settle" delay={delay} style={{ position: 'relative' }}>
        {children}
      </Reveal>
    </div>
  )
}

/** Paragraphs of section copy, 16 apart. `color` for copy off the dark (a cream cell's ink). */
export function CreamProse({ body, color }: { body: Prose; color?: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: space.lg }}>
      {toParagraphs(body).map((paragraph, i) => (
        // Stepped after the heading; capped, since a long run arrives a paragraph at a time.
        <Reveal key={i} delay={Math.min(i + 1, 3) * 70}>
          <p style={{ ...SHEET_BODY, ...(color && { color }) }}>
            {typeof paragraph === 'string' ? paragraph : <Runs runs={paragraph} />}
          </p>
        </Reveal>
      ))}
    </div>
  )
}

/** A heading beside its copy, straight on the dark; stacked on a phone. */
export function CreamCopy({ heading, body }: { heading: string; body?: Prose }) {
  const isMobile = useIsMobile()
  const { pad, inset } = creamMetrics(isMobile)
  return (
    <div
      style={{
        padding: `${isMobile ? 32 : 64}px ${inset}px`,
        display: 'grid',
        gridTemplateColumns: isMobile ? 'minmax(0, 1fr)' : 'minmax(0, 1fr) minmax(0, 2fr)',
        gap: isMobile ? space.lg : pad,
      }}
    >
      <Reveal>
        <h2 style={{ ...SHEET_HEADING, textWrap: 'balance' }}>{heading}</h2>
      </Reveal>
      {body && <CreamProse body={body} />}
    </div>
  )
}
