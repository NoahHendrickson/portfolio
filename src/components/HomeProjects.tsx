import { ArrowRight } from '@phosphor-icons/react'
import AppLink from '../AppLink'
import { NO3Y_CARD, WORK_FILTERS, type WorkCard } from '../data/workCards'
import { VARIANTS } from '../design-system/buttonStyles'
import { CREAM, CREAM_GAP, CREAM_GAP_PHONE, CREAM_RADIUS, CREAM_RADIUS_PHONE } from '../creamStyle'
import { color, control, radius, space, type } from '../design-system/tokens'
import { MOBILE_WIDTH_QUERY } from '../hooks/useIsMobile'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { MARK, MARK_INK } from '../introTimeline'
import { HOME_BENTO, RAIL_SPINE } from '../layout'
import { Fillet } from './Cream'

/**
 * Every project under the Hi tab's copy, as a two-column bento (Nov 4 2026;
 * it ran one to a row until then) — the layout of a reference the user
 * shared, not its style. Each card is tuned on its own in `TUNES`: its shape,
 * and how its art fills it. `cover` fills the card and crops, optionally
 * zoomed in on a point (no3y Code's sidebar); `inset` sets the art smaller on
 * a fill of its own backdrop colour, so the background still runs the whole
 * card (D2 Conflux's window, Crisp's logo). Cards drop into whichever column
 * is shorter, so the columns stagger. On a screen with a mouse the title and
 * a View pill rise over the art's foot on hover or keyboard focus
 * (`.home-project-*` in `index.css`); touch puts the caption under the art.
 * Mobile is one column, the cards keeping their shapes (`rounded`); `ruled`
 * keeps the two columns, edge to edge. Either way a phone shows the art alone,
 * with no caption.
 *
 * no3y Code leads, then the rest in All's order from the old Work tab
 * (`WORK_FILTERS[0]`).
 */

const HOVER_QUERY = '(hover: hover) and (pointer: fine)'

/**
 * no3y Code, then All's order — except that Apply comes ahead of Synapse
 * (Nov 5 2026), so the two trade places.
 */
const CARDS: WorkCard[] = (() => {
  const cards = [NO3Y_CARD, ...WORK_FILTERS[0].cards.filter((card) => card !== NO3Y_CARD)]
  const synapse = cards.findIndex((card) => card.href === '/work/invisible/synapse')
  const apply = cards.findIndex((card) => card.href === '/work/invisible/apply')
  if (synapse >= 0 && apply >= 0) [cards[synapse], cards[apply]] = [cards[apply], cards[synapse]]
  return cards
})()

/** The art a row shows, and the box it sits in. */
type RowArt = { src: string; srcSet?: string; alt: string; aspect: string }

/** The exports' own box (452.5 × 250 at 2x). */
const CARD_ASPECT = '905 / 500'

/**
 * no3y Code's page hero (`collage/new-agent.webp`, the Oct 22 capture). It is
 * lossless on purpose (the glass's dither), so there are no smaller cuts.
 */
const NO3Y_ART: RowArt = {
  src: '/work/no3y-code/collage/new-agent.webp',
  alt: 'no3y Code — the new-agent screen on the Glass theme, over a fluted gradient',
  aspect: '2544 / 1640',
}

function rowArt(card: WorkCard): RowArt {
  if (card === NO3Y_CARD) return NO3Y_ART
  const whole = card.art.whole
  return {
    src: whole?.src ?? card.art.src,
    srcSet: whole?.srcSet ?? card.art.srcSet,
    alt: card.art.alt,
    aspect: CARD_ASPECT,
  }
}

/** The art's corner: larger than the grid cards' 8, since the art is twice the size. */
const CARD_RADIUS = radius.xl
/**
 * The hover ring: 1px wide (2 at first), 4px off the art (2 read too tight), so
 * its outer edge sits 5 out.
 */
const RING_WIDTH = 1
const RING_REACH = 5
/**
 * Which ring the cards wear: `cream` (Nov 4 2026, on trial) is one ring in the
 * site's cream with a soft cream glow on every card; `gradient` is each card's
 * own colours (`ring` in `TUNES`), the first version.
 */
const RING_STYLE: 'cream' | 'gradient' = 'cream'
const CREAM_GLOW = 'color-mix(in srgb, var(--color-bg-cream) 18%, transparent)'

/**
 * A framed inset's edge: the D2 Conflux page's window hairline (white 10%),
 * drawn as an outline just inside the window so it reads on the dark panel
 * rather than vanishing into the yellow, and a lighter drop than the page's
 * (`0 16px 40px -12px` at 55%).
 */
const WINDOW_FRAME: React.CSSProperties = {
  outline: '1px solid rgb(255 255 255 / 0.1)',
  outlineOffset: '-1px',
  boxShadow: '0 8px 24px -8px rgb(0 0 0 / 0.35)',
}

/** Width over height, off a CSS `a / b` ratio. */
function ratio(aspect: string) {
  const [w, h] = aspect.split('/').map(Number)
  return w / h
}

/**
 * How one card shows its art. `shape` is the card's own ratio.
 * - `cover` fills the card and crops. `focus` is the point of the art that
 *   stays put (an `object-position`, so `0% 0%` holds the top-left corner),
 *   and `zoom` scales in about it.
 * - `inset` sits the art `width` across the card (a share of its width; over
 *   100% crops the art's own backdrop margin), on `bg`, the art's backdrop
 *   colour read off its edge pixels, so the seam doesn't show. `bottom` seats
 *   it on the card's floor, for the windows the exports already run off their
 *   foot; `center` floats it.
 */
type Tune = {
  shape: string
  art?: RowArt
  /**
   * The hover ring's gradient stops, read off the card's art (its plate and the
   * mockup's own colours), brightened where the art is dark so the ring shows
   * on the page.
   */
  ring?: string[]
} & (
  | { fit: 'cover'; focus?: string; zoom?: number }
  | {
      fit: 'inset'
      bg: string
      width: number
      anchor: 'center' | 'bottom'
      /**
       * Draws the window's edge in CSS (`WINDOW_FRAME`) — for art cut down to
       * the bare window, square-cornered, rather than one with its frame baked.
       */
      frame?: boolean
    }
)

/**
 * Each card's shape and fill, keyed by its href. The shapes run tall, wide and
 * square in turn down each column; `PLACEMENT` puts no3y Code, Apply, Crisp
 * and How to PC on the left.
 */
const TUNES: Record<string, Tune> = {
  // In on the sidebar: the window's top-left, the thread list down the card.
  '/work/no3y-code': { ring: ['#7c73fe', '#d37bbb', '#fbb59c'], shape: '4 / 5', fit: 'cover', focus: '8% 4%', zoom: 1.5 },
  // The windows sit smaller on their plates, running off the card's floor.
  '/work/invisible/onboarding': { ring: ['#aa6aa4', '#cb52b9', '#f3d9ef'], shape: '3 / 2', fit: 'inset', bg: '#aa6aa4', width: 105, anchor: 'bottom' },
  // The builds window alone (`card-d2-window.jpg`, cut inside the export's
  // baked stroke with its rounded top corners squared off), framed in CSS the
  // way the D2 Conflux page frames its windows. 79.5% is where the window sat
  // in the whole export at 116%.
  '/work/stat-builder': {
    ring: ['#fed65a', '#ffb347', '#8fa3c4'],
    shape: '5 / 4',
    fit: 'inset',
    bg: '#fed65a',
    width: 79.5,
    anchor: 'bottom',
    frame: true,
    art: {
      src: '/work/bento/card-d2-window.jpg',
      srcSet:
        '/work/bento/card-d2-window-620.jpg 620w, /work/bento/card-d2-window-890.jpg 890w, /work/bento/card-d2-window.jpg 1240w',
      alt: 'D2 Conflux — the builds column, a list of stat builds, on yellow',
      aspect: '1240 / 920',
    },
  },
  // The plate is a gradient with dark corners baked in, so it crops: the
  // zoomed export, held on the prompt and Response A's annotate tip.
  '/work/invisible/synapse': { ring: ['#b48be0', '#7a4f9e'], shape: '4 / 5', fit: 'cover', focus: '0% 0%' },
  // The Explore list, from the nav rail to the selected (pink) project.
  '/work/invisible/apply': { ring: ['#d3efff', '#9fd4f5', '#cb52b9'], shape: '1 / 1', fit: 'cover', focus: '14% 0%' },
  '/work/crisp': { ring: ['#ff2d57', '#ff8aa1'], shape: '4 / 5', fit: 'inset', bg: '#ff2d57', width: 110, anchor: 'center' },
  '/work/pixel-art': { ring: ['#c3a918', '#fa3c00'], shape: '3 / 2', fit: 'inset', bg: '#2a2a2e', width: 100, anchor: 'center' },
  // The pattern carries on past any crop; LIME stays centred.
  '/work/nacho-box': { ring: ['#f9f18f', '#9be15d'], shape: '1 / 1', fit: 'cover' },
  '/work/how-to-pc': { ring: ['#00a2a2', '#de1440'], shape: '1 / 1', fit: 'inset', bg: '#00a2a2', width: 110, anchor: 'center' },
}

const DEFAULT_TUNE: Tune = { shape: '5 / 4', fit: 'cover' }

function tuneFor(card: WorkCard): Tune {
  const tune = TUNES[card.href] ?? DEFAULT_TUNE
  // Synapse crops the zoomed export (the window from its top-left) rather
  // than the whole one.
  if (card.href === '/work/invisible/synapse' && card.art.whole) {
    return { ...tune, art: { src: card.art.src, srcSet: card.art.srcSet, alt: card.art.alt, aspect: '1392 / 769' } }
  }
  return tune
}

type Placed = { card: WorkCard; tune: Tune }

/**
 * Which column each card sits in, top to bottom. Pinned rather than dropped
 * into the shorter column: that greedy fill put Synapse second on the left and
 * Apply third on the right, and the two were swapped by hand (Nov 5 2026),
 * which the greedy fill can't give without reshuffling everything under them.
 * Each card keeps its own shape; Apply went square and Synapse 4 / 5 the same
 * day, so the two columns end about level again. A card missing from both (a
 * new one) goes to the shorter column.
 */
const PLACEMENT: [string[], string[]] = [
  ['/work/no3y-code', '/work/invisible/apply', '/work/crisp', '/work/how-to-pc'],
  ['/work/invisible/onboarding', '/work/stat-builder', '/work/invisible/synapse', '/work/pixel-art', '/work/nacho-box'],
]

function columns(cards: WorkCard[]): [Placed[], Placed[]] {
  const byHref = new Map(cards.map((card) => [card.href, card]))
  const cols = PLACEMENT.map((hrefs) =>
    hrefs.flatMap((href) => {
      const card = byHref.get(href)
      return card ? [{ card, tune: tuneFor(card) }] : []
    }),
  ) as [Placed[], Placed[]]
  const height = (col: Placed[]) => col.reduce((sum, { tune }) => sum + 1 / ratio(tune.shape), 0)
  for (const card of cards) {
    if (PLACEMENT.some((hrefs) => hrefs.includes(card.href))) continue
    cols[height(cols[0]) <= height(cols[1]) ? 0 : 1].push({ card, tune: tuneFor(card) })
  }
  return cols
}

const COLUMNS = columns(CARDS)
const GAP = space.xl
/** A column's widest, at the 1400 panel; the `sizes` cuts scale off it. */
const COLUMN_MAX = 700

const RULE_COLOR = 'var(--color-border-default)'

export default function HomeProjects() {
  if (HOME_BENTO === 'cream') return <CreamBento />
  return HOME_BENTO === 'ruled' ? <RuledBento /> : <RoundedBento />
}

/** Half the dark area right of the spine: the grid centres on it. */
const DARK_HALF = `((100vw - ${RAIL_SPINE}px) / 2)`

/**
 * The cards suspended in cream (Nov 9 2026): the grid's own fill shows through
 * the gaps and round the outside, and each card rounds off inside it. Past the
 * grid, every horizontal gap carries on as a cream rule, from the grid's edge
 * to the rail's spine on the left and off the screen on the right, flaring
 * into concave fillets where it leaves the grid and where it meets the spine.
 * The columns keep their stagger, so each column's rules go out its own side.
 * The last card in each column takes up any slack (only the shorter column has
 * any), so the grid closes on one level rule. A phone has no margin past the
 * grid, which runs edge to edge, so it has no rules or fillets.
 */
function CreamBento() {
  const canHover = useMediaQuery(HOVER_QUERY)
  const single = useMediaQuery(MOBILE_WIDTH_QUERY)
  const gap = single ? CREAM_GAP_PHONE : CREAM_GAP

  return (
    <section
      aria-label="Projects"
      style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
        gap,
        padding: gap,
        boxSizing: 'border-box',
        background: CREAM,
        // Mobile: the full phone width, out past the page's pad.
        ...(single ? { width: '100vw', marginLeft: -MOBILE_PAGE_PAD } : {}),
      }}
    >
      {COLUMNS.map((col, c) => {
        const side = c === 0 ? 'left' : 'right'
        return (
          <div key={c} style={{ display: 'flex', flexDirection: 'column', gap, minWidth: 0 }}>
            {col.map(({ card, tune }, i) => {
              const last = i === col.length - 1
              return (
                <div
                  key={card.href}
                  style={{ position: 'relative', display: 'flex', flexDirection: 'column', flex: last ? 1 : undefined }}
                >
                  {!single && <CreamRule side={side} place="above" first={i === 0} />}
                  <ProjectCard card={card} tune={tune} peek={canHover} cream fill={last} />
                  {!single && last && <CreamRule side={side} place="below" />}
                </div>
              )
            })}
          </div>
        )
      })}
    </section>
  )
}

/**
 * One gap carried past the grid, seated off its card: `above` is the gap over
 * it, `below` the grid's closing rule under the last one. The grid's outer edge
 * only has cream below the top rule and above the closing one, so those two
 * take a single fillet there; the spine runs the page's height, so its fillets
 * are always a pair.
 */
function CreamRule({
  side,
  place,
  first = false,
}: {
  side: 'left' | 'right'
  place: 'above' | 'below'
  first?: boolean
}) {
  const G = CREAM_GAP
  // From the card's outer edge out to the spine, or to the screen's right
  // edge: the grid centres on the dark area, so both are the same distance.
  const reach = `calc(100% + ${G / 2}px - ${DARK_HALF})`
  // The fillets on the grid's edge, a gap out from the card (less the 1px each
  // tucks under the cream beside it, so no seam can open).
  const outer = { [side === 'left' ? 'right' : 'left']: G - 1 }
  const arcX = side === 'left' ? '0' : '100%'
  const above = -CREAM_RADIUS
  const below = G - 1

  return (
    <div
      aria-hidden
      style={{
        position: 'absolute',
        top: place === 'above' ? -G : '100%',
        height: G,
        background: CREAM,
        pointerEvents: 'none',
        ...(side === 'left' ? { left: reach, right: '100%' } : { right: reach, left: '100%' }),
      }}
    >
      {!first && <Fillet at={`${arcX} 0`} style={{ ...outer, top: above }} />}
      {place === 'above' && <Fillet at={`${arcX} 100%`} style={{ ...outer, top: below }} />}
      {side === 'left' && (
        <>
          <Fillet at="100% 0" style={{ left: -1, top: above }} />
          <Fillet at="100% 100%" style={{ left: -1, top: below }} />
        </>
      )}
    </div>
  )
}

function RoundedBento() {
  const canHover = useMediaQuery(HOVER_QUERY)
  const single = useMediaQuery(MOBILE_WIDTH_QUERY)

  const card = ({ card, tune }: Placed) => <ProjectCard key={card.href} card={card} tune={tune} peek={canHover} />

  return (
    <section aria-label="Projects">
      {single ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: GAP }}>
          {CARDS.map((c) => card({ card: c, tune: tuneFor(c) }))}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: GAP, alignItems: 'start' }}>
          {COLUMNS.map((col, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: GAP, minWidth: 0 }}>
              {col.map(card)}
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

/**
 * Square cards divided by 1px rules instead of gaps. The horizontal rules run
 * past the panel to the whole dark area (`App` widens the scroller on Hi so
 * they aren't clipped), and the four-leaf mark sits wherever one meets the
 * centre rule. Mobile keeps the two staggered columns too (Nov 5 2026), out to
 * the phone's edges: the grid bleeds past the page's 20px pad
 * (`MOBILE_PAGE_PAD`), so the cards meet the screen's sides and the centre
 * rule. The outer-edge marks would sit half off the screen there, so mobile
 * drops them.
 */
function RuledBento() {
  const canHover = useMediaQuery(HOVER_QUERY)
  const single = useMediaQuery(MOBILE_WIDTH_QUERY)

  // The columns keep their stagger, so a rule can't cross both: each column's
  // rules run from the centre rule out to its own edge of the screen, and each
  // meets the centre rule in a T. The left column's top rule carries the one
  // mark both share.
  return (
    <section
      aria-label="Projects"
      style={{
        display: 'grid',
        gridTemplateColumns: TRACKS,
        // Mobile: the full phone width, out past the page's pad.
        ...(single ? { width: '100vw', marginLeft: -MOBILE_PAGE_PAD } : {}),
      }}
    >
      {COLUMNS.map((col, c) => (
        <div key={c} style={{ gridColumn: c === 0 ? 1 : 3, gridRow: 1, alignSelf: 'start', minWidth: 0 }}>
          <Rule side={c === 0 ? 'left' : 'right'} mark={c === 0} />
          {col.map(({ card, tune }) => (
            <div key={card.href}>
              <ProjectCard card={card} tune={tune} peek={canHover} ruled />
              <Rule side={c === 0 ? 'left' : 'right'} mark outer={!single && OUTER_MARKS.has(card.href)} />
            </div>
          ))}
        </div>
      ))}
      <div aria-hidden style={{ gridColumn: 2, gridRow: 1, background: RULE_COLOR }} />
    </section>
  )
}

/**
 * The cards whose rule underneath also carries a mark on the column's outer
 * edge, where it passes the card's side. A few, not every rule: under
 * onboarding (right), Apply (left) and pixel art (right), so they fall
 * scattered down the page rather than in a row.
 */
const OUTER_MARKS = new Set(['/work/invisible/onboarding', '/work/invisible/apply', '/work/pixel-art'])

/** `App`'s pad round the page on mobile, which the grid bleeds past. */
const MOBILE_PAGE_PAD = 20

/** The two columns and the 1px centre rule between them. */
const TRACKS = 'minmax(0, 1fr) 1px minmax(0, 1fr)'

/**
 * A 1px horizontal rule, drawn past the panel (the scroller, or on mobile the
 * page, clips it at the screen's edge). `both` runs both ways (mobile, one
 * column); `left` / `right` is a column's rule, running from the centre rule
 * out to its side, with the mark on the centre rule if `mark`, and one on the
 * column's outer edge if `outer`.
 */
function Rule({
  side = 'both',
  mark = false,
  outer = false,
}: {
  side?: 'both' | 'left' | 'right'
  mark?: boolean
  outer?: boolean
}) {
  return (
    <div aria-hidden style={{ position: 'relative', height: 1 }}>
      <span
        style={{
          position: 'absolute',
          top: 0,
          height: 1,
          // The right column's reaches back over the 1px centre track to join it.
          left: side === 'right' ? -1 : '-100vw',
          right: side === 'left' ? 0 : '-100vw',
          background: RULE_COLOR,
        }}
      />
      {mark && side !== 'both' && (
        <LeafMark
          style={{
            position: 'absolute',
            // Over a hovered card's ring, which reaches past the rules.
            zIndex: 2,
            top: -LEAF_HALF,
            // Its centre square on the centre track: the left column's right
            // edge, or the pixel just left of the right column.
            left: side === 'left' ? `calc(100% - ${LEAF_HALF}px)` : -1 - LEAF_HALF,
          }}
        />
      )}
      {outer && side !== 'both' && (
        <LeafMark
          style={{
            position: 'absolute',
            zIndex: 2,
            top: -LEAF_HALF,
            // Its centre square on the pixel just past the column's outer edge,
            // mirroring the centre marks.
            left: side === 'left' ? -1 - LEAF_HALF : `calc(100% - ${LEAF_HALF}px)`,
          }}
        />
      )}
    </div>
  )
}

/**
 * The four-leaf mark (`MARK`, 23 × 23), at `LEAF_SQUARE` px a square, so its
 * centre square lands on the 1px rules' crossing.
 */
const LEAF_SQUARE = 1
const LEAF_SIZE = MARK.length * LEAF_SQUARE
const LEAF_HALF = Math.floor(MARK.length / 2) * LEAF_SQUARE

/** The mark's squares merged into horizontal runs, one rect a run. */
const LEAF_RUNS = MARK.flatMap((row, y) => {
  const runs: { x: number; y: number; w: number; fill: string }[] = []
  for (let x = 0; x < row.length; ) {
    const ch = row[x]
    let end = x + 1
    while (end < row.length && row[end] === ch) end++
    if (ch !== '.') runs.push({ x, y, w: end - x, fill: MARK_INK[ch] })
    x = end
  }
  return runs
})

function LeafMark({ style }: { style?: React.CSSProperties }) {
  return (
    <svg
      width={LEAF_SIZE}
      height={LEAF_SIZE}
      viewBox={`0 0 ${MARK.length} ${MARK.length}`}
      shapeRendering="crispEdges"
      style={{ display: 'block', ...style }}
    >
      {LEAF_RUNS.map(({ x, y, w, fill }) => (
        <rect key={`${x}-${y}`} x={x} y={y} width={w} height={1} fill={fill} />
      ))}
    </svg>
  )
}

function ProjectCard({
  card,
  tune,
  peek,
  ruled = false,
  cream = false,
  fill = false,
}: {
  card: WorkCard
  tune: Tune
  peek: boolean
  /** Square, its ring too, which sits over the rules round it. */
  ruled?: boolean
  /** Rounded inside the cream grid, its ring and any caption under it in ink. */
  cream?: boolean
  /** Grows past its shape to take up the height its column has spare. */
  fill?: boolean
}) {
  const art = tune.art ?? rowArt(card)
  // Touch puts the caption under the art — except on a phone, where the cards
  // stand as art alone (Nov 5 2026); the link's label still names them.
  const phone = useMediaQuery(MOBILE_WIDTH_QUERY)
  const captionUnder = !peek && !phone
  const creamCorner = `${phone ? CREAM_RADIUS_PHONE : CREAM_RADIUS}px`
  const corner = ruled ? '0px' : cream ? creamCorner : CARD_RADIUS
  const twoUpOnPhone = ruled || cream
  // Ruled, a square bar across the card's foot rather than a floating rounded
  // one. In the cream it floats one gap in, on the corner concentric with the
  // card's. Otherwise 12 against the card's 16: strictly concentric would be
  // 4, which reads as squared off this close to the card's curve.
  const captionInset = ruled ? '0px' : cream ? `${CREAM_GAP}px` : space.md
  const captionCorner = ruled ? '0px' : cream ? `${CREAM_RADIUS - CREAM_GAP}px` : radius.lg

  // How wide the art draws against the card, so `sizes` asks for enough pixels:
  // a cover crop draws past the card's sides when the card is narrower than
  // the art, and a zoom scales that again.
  const spread =
    tune.fit === 'cover'
      ? Math.max(1, ratio(art.aspect) / ratio(tune.shape)) * (tune.zoom ?? 1)
      : tune.width / 100
  const sizes = art.srcSet
    ? `${MOBILE_WIDTH_QUERY} ${Math.round((twoUpOnPhone ? 50 : 100) * spread)}vw, ${Math.round(COLUMN_MAX * spread)}px`
    : undefined

  const artBox: React.CSSProperties =
    tune.fit === 'cover'
      ? { position: 'absolute', inset: 0 }
      : {
          position: 'absolute',
          left: '50%',
          width: `${tune.width}%`,
          aspectRatio: art.aspect,
          ...(tune.anchor === 'bottom'
            ? { bottom: 0, transform: 'translateX(-50%)' }
            : { top: '50%', transform: 'translate(-50%, -50%)' }),
          ...(tune.frame ? WINDOW_FRAME : {}),
        }

  const imgStyle: React.CSSProperties =
    tune.fit === 'cover'
      ? {
          objectFit: 'cover',
          objectPosition: tune.focus ?? '50% 50%',
          transform: tune.zoom ? `scale(${tune.zoom})` : undefined,
          transformOrigin: tune.focus ?? '50% 50%',
        }
      : {}

  return (
    // The whole card is the link, so the View pill is a label inside it rather
    // than a second control.
    <AppLink
      href={card.href}
      className="home-project"
      data-ruled={ruled || undefined}
      data-cream={cream || undefined}
      aria-label={`${card.title} — ${card.subtitle}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: space.lg,
        textDecoration: 'none',
        color: 'inherit',
        borderRadius: corner,
        flex: fill ? 1 : undefined,
        // Touch puts the caption under the art, inside the cell.
        paddingBottom: twoUpOnPhone && captionUnder ? space.lg : undefined,
      }}
    >
      {/* The art and, behind it, the hover ring (`.home-project-ring` in `index.css`). */}
      <div
        style={{
          position: 'relative',
          ...(fill ? { flex: 1, display: 'flex', flexDirection: 'column' } : {}),
        }}
      >
        {RING_STYLE === 'cream' || cream ? (
          <span
            aria-hidden
            className="home-project-ring"
            style={{
              position: 'absolute',
              inset: `-${RING_REACH}px`,
              borderRadius: ruled ? 0 : `calc(${corner} + ${RING_REACH}px)`,
              // In the cream grid a cream ring would vanish, so it's ink, and
              // it only shows for keyboard focus (`index.css`).
              border: `${RING_WIDTH}px solid ${cream ? color.ink.default : CREAM}`,
              // The glow: outward from the ring and into the gap; the card
              // covers it inside.
              boxShadow: cream ? undefined : `0 0 10px ${CREAM_GLOW}, inset 0 0 4px ${CREAM_GLOW}`,
              pointerEvents: 'none',
              // Ruled, the ring reaches over the rules and the next cards'
              // edges, so it has to sit above them.
              zIndex: ruled ? 1 : undefined,
            }}
          />
        ) : (
          tune.ring && (
            <span
              aria-hidden
              className="home-project-ring"
              style={{
                position: 'absolute',
                inset: `-${RING_REACH}px`,
                padding: `${RING_WIDTH}px`,
                borderRadius: ruled ? 0 : `calc(${CARD_RADIUS} + ${RING_REACH}px)`,
                background: `linear-gradient(135deg, ${tune.ring.join(', ')})`,
                // Only the ring: the padding box minus the content box.
                mask: 'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',
                maskComposite: 'exclude',
                WebkitMask: 'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',
                WebkitMaskComposite: 'xor',
                pointerEvents: 'none',
              // Ruled, the ring reaches over the rules and the next cards'
              // edges, so it has to sit above them.
              zIndex: ruled ? 1 : undefined,
              }}
            />
          )
        )}
        <div
          style={{
            position: 'relative',
            overflow: 'hidden',
            borderRadius: corner,
            aspectRatio: tune.shape,
            ...(fill ? { flex: 1, width: '100%' } : {}),
            backgroundColor: tune.fit === 'inset' ? tune.bg : color.bg.raised,
            // The dark placeholder behind a cover crop stops 1px short of the
            // rounded edge: reaching it, it bled through the corner's
            // antialiasing as a dark fringe against the cream.
            ...(cream && tune.fit === 'cover' ? { padding: 1, backgroundClip: 'content-box' } : {}),
          }}
        >
          <div style={artBox}>
            <img
              src={art.src}
              srcSet={art.srcSet}
              sizes={sizes}
              alt={art.alt}
              loading="lazy"
              decoding="async"
              style={{ display: 'block', width: '100%', height: '100%', ...imgStyle }}
            />
            {card.overlay && (
              <img
                src={card.overlay.src}
                alt=""
                aria-hidden
                loading="lazy"
                decoding="async"
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: card.overlay.width,
                  height: 'auto',
                }}
              />
            )}
          </div>

          {peek && (
            <div
              className="home-project-caption"
              style={{
                position: 'absolute',
                left: captionInset,
                right: captionInset,
                bottom: captionInset,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: space.lg,
                padding: `${space.md} ${space.md} ${space.md} ${space.lg}`,
                borderRadius: captionCorner,
                background: `color-mix(in srgb, ${color.bg.primary} 80%, transparent)`,
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
              }}
            >
              <Caption card={card} onScrim />
              <ViewPill />
            </div>
          )}
        </div>
      </div>

      {captionUnder && (
        <div style={{ paddingInline: twoUpOnPhone ? space.lg : undefined }}>
          <Caption card={card} onCream={cream} />
        </div>
      )}
    </AppLink>
  )
}

function Caption({
  card,
  onScrim = false,
  onCream = false,
}: {
  card: WorkCard
  onScrim?: boolean
  onCream?: boolean
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
      <span
        style={{ ...type['body-l'], fontWeight: 500, color: onCream ? color.ink.default : color.text.primary }}
      >
        {card.title}
      </span>
      <span
        style={{
          ...type['body-m'],
          // Secondary over the scrim, where muted would sink into the art.
          color: onCream ? color.ink.secondary : onScrim ? color.text.secondary : color.text.muted,
        }}
      >
        {card.subtitle}
      </span>
    </div>
  )
}

/** The `secondary` button's palette at the `sm` control, as a label — the row itself is the link. */
function ViewPill() {
  const colors = VARIANTS.secondary.default
  return (
    <span
      aria-hidden
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: space.sm,
        flexShrink: 0,
        height: control.sm,
        boxSizing: 'border-box',
        padding: `0 ${space.lg}`,
        borderRadius: radius.full,
        border: `1px solid ${colors.borderColor}`,
        background: colors.background,
        color: colors.color,
        ...type['label-m'],
        whiteSpace: 'nowrap',
      }}
    >
      View
      <ArrowRight size={14} />
    </span>
  )
}
