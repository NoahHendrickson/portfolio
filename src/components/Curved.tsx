import { Fragment, createContext, useCallback, useContext, useEffect, useRef, useState, useSyncExternalStore, type CSSProperties, type ElementType, type ReactNode } from 'react'
import { Runs } from './ProjectIntro'
import Reveal from './Reveal'
import { Chip } from './Sheet'
import { radius, radiusPx, space, spacePx } from '../design-system/tokens'
import { useFullyInView, useInView } from '../hooks/useInView'
import { useIsMobile } from '../hooks/useIsMobile'
import { PlayGate } from '../hooks/playGate'
import {
  COPY_MEASURE,
  CURVED_BODY_SIZE,
  CURVED_INNER,
  SHEET_BODY,
  SHEET_HEADING,
  TEXT_SOFT,
  curvedInset,
  toParagraphs,
} from '../sheetStyle'
import { getTheme, subscribeToTheme, type Theme } from '../theme'
import type { ClusterSlots, Prose } from '../data/projects'

/*
  The curved project page's pieces (Nov 9 2026): no3y Code (`ProjectCurved`) and
  the Meridial onboarding study are built from them. Each section is one
  continuous surface: a rounded card holding the media, with the section's
  heading and copy on a tab hanging off its foot, joined by the rail's concave
  curve, so the words and the picture they describe read as one shape.
*/

/**
 * What the cards are made of (on trial). `solid` is the opposite of the page:
 * each card carries the other theme (`useCardTheme`), so its fill, its copy,
 * chips and controls all flip together. `tint` is a faint lift off the page.
 */
const CARD_STYLE: 'solid' | 'tint' = 'solid'
/** Opaque either way, so the curves can overlap the card without doubling up. */
const SURFACE = `var(--curved-surface, ${
  CARD_STYLE === 'solid'
    ? 'var(--color-bg-primary)'
    : 'color-mix(in srgb, var(--color-text-primary) 5%, var(--color-bg-primary))'
})`
/** A faint cream over the dark page, opaque like the others: see `CurvedSoftInDark`. */
const SOFT_SURFACE = 'color-mix(in srgb, var(--color-bg-cream) 14%, var(--color-bg-primary))'
const OUTER = radius['2xl']
const MEDIA_INSET = spacePx.sm
/** The concave join where a tab meets its card: the card's own outer corner, so the two curves match. */
const CURVE = radiusPx['2xl']
/** Round the card that stands apart under the media. */
const SIDE_GAP = spacePx.md
const SIDE_RADIUS = radiusPx.xl
/** A step under the sheet's 20 / 16, so a section's copy fits on screen under its media. */
const HEADING: CSSProperties = { ...SHEET_HEADING, fontSize: '18px' }
const BODY: CSSProperties = { ...SHEET_BODY, fontSize: CURVED_BODY_SIZE }
/** The card beside a tab, narrower than the sheet's 390 now the column is. */
const SIDE_WIDTH = 340
/** A tab holds the copy's measure and the padding either side. */
const tabWidth = (inset: number) => COPY_MEASURE + inset * 2

const SoftInDark = createContext(false)

/**
 * For a page whose captures are themselves light and cream (Crisp), where a solid
 * cream card clashes with them: in dark mode its cards are a faint cream with the
 * page's own light text. Light mode's dark cards are left alone.
 */
export function CurvedSoftInDark({ children }: { children: ReactNode }) {
  return <SoftInDark.Provider value>{children}</SoftInDark.Provider>
}

/** What a card sets on itself: the opposite theme when `solid`, or the soft surface. */
function useCardTheme(): { theme?: Theme; vars?: CSSProperties } {
  const theme = useSyncExternalStore(subscribeToTheme, getTheme)
  const soft = useContext(SoftInDark)
  if (soft && theme === 'dark') return { vars: { '--curved-surface': SOFT_SURFACE } as CSSProperties }
  if (CARD_STYLE !== 'solid') return {}
  return { theme: theme === 'dark' ? 'light' : 'dark' }
}

/**
 * The concave join where a tab meets its card: the surface's colour with a
 * quarter-disk knocked out, sitting outside the tab. 1 down, for the tab's
 * overlap with the card.
 */
function Curve() {
  return (
    <span
      aria-hidden
      style={{
        position: 'absolute',
        top: 1,
        left: '100%',
        width: CURVE,
        height: CURVE,
        background: `radial-gradient(circle ${CURVE}px at 100% 100%, transparent ${CURVE - 0.5}px, ${SURFACE} ${CURVE}px)`,
      }}
    />
  )
}

/** `.curved-tab-*` in `index.css`: its transition's delay plus its duration. */
const TAB_GROW_MS = 900

/**
 * The concave join under a tab that runs on into the next card (`CurvedChain`): where
 * the tab's right edge meets that card's top, the surface turns the corner.
 */
function CurveBelow() {
  return (
    <span
      aria-hidden
      style={{
        position: 'absolute',
        bottom: 0,
        left: '100%',
        width: CURVE,
        height: CURVE,
        background: `radial-gradient(circle ${CURVE}px at 100% 0, transparent ${CURVE - 0.5}px, ${SURFACE} ${CURVE}px)`,
      }}
    />
  )
}

function Tab({
  flex,
  onGrown,
  joinBelow = false,
  children,
}: {
  flex: string
  onGrown?: () => void
  /** The next card hangs straight off this tab's foot. */
  joinBelow?: boolean
  children: ReactNode
}) {
  const inset = curvedInset(false)
  // Its own moment, after the card has grown: it grows out as it comes into view.
  const [ref, shown] = useInView<HTMLDivElement>()
  useEffect(() => {
    if (!shown || !onGrown) return
    const timer = window.setTimeout(onGrown, TAB_GROW_MS)
    return () => window.clearTimeout(timer)
  }, [shown, onGrown])
  return (
    <div
      ref={ref}
      className="curved-tab"
      data-shown={shown || undefined}
      style={{
        position: 'relative',
        flex,
        minWidth: 0,
        // Over the card's foot by 1, so no hairline can open between them.
        marginTop: -1,
      }}
    >
      <div className="curved-tab-surface" style={{ background: SURFACE, borderRadius: joinBelow ? 0 : `0 0 ${OUTER} ${OUTER}` }}>
        <Curve />
        {joinBelow && <CurveBelow />}
      </div>
      <div
        className="curved-tab-copy"
        style={{
          position: 'relative',
          boxSizing: 'border-box',
          padding: `${spacePx.xl + 1}px ${inset}px ${inset}px`,
          display: 'flex',
          flexDirection: 'column',
          gap: space.xl,
        }}
      >
        {children}
      </div>
    </div>
  )
}

/**
 * A section: its media and its copy on a tab under it. `side` stands apart at the
 * right, under the media. `holdClip` keeps a clip in the media still until the whole
 * card is on screen and its tab has finished growing.
 */
export function CurvedCard({
  media,
  copy,
  side,
  holdClip = false,
}: {
  media: ReactNode
  copy: ReactNode
  side?: ReactNode
  holdClip?: boolean
}) {
  const isMobile = useIsMobile()
  const { theme: cardTheme, vars } = useCardTheme()
  const rootRef = useRef<HTMLElement>(null)
  const [tabGrown, setTabGrown] = useState(false)
  const markGrown = useCallback(() => setTabGrown(true), [])
  const fullyInView = useFullyInView(rootRef, holdClip)
  // A phone has no tab to wait for.
  const mayPlay = !holdClip || (fullyInView && (isMobile || tabGrown))
  const mediaBox = (
    <div style={{ borderRadius: CURVED_INNER, overflow: 'hidden' }}>
      <PlayGate.Provider value={mayPlay}>{media}</PlayGate.Provider>
    </div>
  )
  const sideCard = (
    <div
      style={{
        background: SURFACE,
        borderRadius: isMobile ? OUTER : SIDE_RADIUS,
        padding: curvedInset(isMobile),
        display: 'flex',
        flexDirection: 'column',
        gap: space.xl,
      }}
    >
      {side}
    </div>
  )

  // No room for tabs on a phone: one rounded card, the copy under the media.
  if (isMobile) {
    const pad = curvedInset(true)
    return (
      <section ref={rootRef} data-theme={cardTheme} style={{ ...vars, display: 'flex', flexDirection: 'column', gap: spacePx.md }}>
        <div style={{ background: SURFACE, borderRadius: OUTER, padding: MEDIA_INSET }}>
          {mediaBox}
          <div style={{ padding: `${pad}px ${pad - MEDIA_INSET}px`, display: 'flex', flexDirection: 'column', gap: space.xl }}>
            {copy}
          </div>
        </div>
        {side && sideCard}
      </section>
    )
  }

  return (
    <section ref={rootRef} data-theme={cardTheme} style={vars}>
      <div
        style={{
          background: SURFACE,
          padding: MEDIA_INSET,
          // The foot stays square where the tab carries the surface on.
          borderRadius: `${OUTER} ${OUTER} ${OUTER} 0`,
        }}
      >
        {mediaBox}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: SIDE_GAP }}>
        <Tab onGrown={holdClip ? markGrown : undefined} flex={side ? '1 1 0' : `0 1 ${tabWidth(curvedInset(false))}px`}>
          {copy}
        </Tab>
        {side && (
          <div style={{ flex: `0 0 ${SIDE_WIDTH}px`, marginTop: SIDE_GAP }}>
            <Reveal>{sideCard}</Reveal>
          </div>
        )}
      </div>
    </section>
  )
}

/**
 * Steps that belong together (Crisp's timeline passes) as one shape: each step's media
 * on the card, its copy on a tab, and the next step's media hanging straight off that
 * tab's foot, the surface turning concave where the tab meets it.
 */
export function CurvedChain({ steps }: { steps: { key: string; media: ReactNode; copy: ReactNode }[] }) {
  const isMobile = useIsMobile()
  const { theme: cardTheme, vars } = useCardTheme()
  const box = (media: ReactNode) => <div style={{ borderRadius: CURVED_INNER, overflow: 'hidden' }}>{media}</div>
  const last = steps.length - 1

  if (isMobile) {
    const pad = curvedInset(true)
    return (
      <section data-theme={cardTheme} style={{ ...vars, display: 'flex', flexDirection: 'column' }}>
        {steps.map((step, i) => (
          <div
            key={step.key}
            style={{
              background: SURFACE,
              padding: MEDIA_INSET,
              marginTop: i > 0 ? -1 : undefined,
              borderRadius: `${i === 0 ? OUTER : 0} ${i === 0 ? OUTER : 0} ${i === last ? OUTER : 0} ${i === last ? OUTER : 0}`,
            }}
          >
            {box(step.media)}
            <div style={{ padding: `${pad}px ${pad - MEDIA_INSET}px`, display: 'flex', flexDirection: 'column', gap: space.xl }}>
              {step.copy}
            </div>
          </div>
        ))}
      </section>
    )
  }

  return (
    <section data-theme={cardTheme} style={vars}>
      {steps.map((step, i) => (
        <Fragment key={step.key}>
          <div
            style={{
              background: SURFACE,
              padding: MEDIA_INSET,
              // Over the tab above by 1, so no hairline opens at the join.
              marginTop: i > 0 ? -1 : undefined,
              borderRadius: `${i === 0 ? OUTER : 0} ${OUTER} ${OUTER} 0`,
            }}
          >
            {box(step.media)}
          </div>
          <div style={{ display: 'flex' }}>
            <Tab flex={`0 1 ${tabWidth(curvedInset(false))}px`} joinBelow={i < last}>
              {step.copy}
            </Tab>
          </div>
        </Fragment>
      ))}
    </section>
  )
}

/** How much of its height a stepped tile shares with the next one along the centre seam. */
const STEP_OVERLAP = 0.3

/**
 * The concave join at one end of the seam two cards share: `at` is the knocked-out
 * disk's centre, the corner away from both cards. The square runs 1 under each of
 * them so no hairline opens, and is that 1 bigger both ways so the arc still meets
 * each card's edge on the tangent. Laid 1 under at its own size, the arc crossed
 * the edges 7px early and the curve arrived at a visible angle.
 */
function StepCurve({ at, style, className }: { at: string; style: CSSProperties; className?: string }) {
  return (
    <span
      aria-hidden
      className={className}
      style={{
        position: 'absolute',
        width: CURVE + 1,
        height: CURVE + 1,
        background: `radial-gradient(circle ${CURVE}px at ${at}, transparent ${CURVE - 0.5}px, ${SURFACE} ${CURVE}px)`,
        ...style,
      }}
    />
  )
}

/**
 * Pictures with no copy of their own (no3y Code's component tiles), each on its own
 * card, stepping down the column left, right, left: every card meets the next along
 * the foot of the centre seam, and the surface turns concave at both ends of that
 * join, so the six read as separate boxes joined at their corners. `ratio` is a
 * picture's height over its width. One card to a row on a phone, apart.
 */
export function CurvedSteps({ tiles, ratio }: { tiles: { key: string; media: ReactNode }[]; ratio: number }) {
  const isMobile = useIsMobile()
  const { theme: cardTheme, vars } = useCardTheme()
  const box = (media: ReactNode) => <div style={{ borderRadius: CURVED_INNER, overflow: 'hidden' }}>{media}</div>

  if (isMobile) {
    return (
      <section data-theme={cardTheme} style={{ ...vars, display: 'flex', flexDirection: 'column', gap: spacePx.md }}>
        {tiles.map((tile) => (
          <div key={tile.key} style={{ background: SURFACE, borderRadius: OUTER, padding: MEDIA_INSET }}>
            {box(tile.media)}
          </div>
        ))}
      </section>
    )
  }

  const last = tiles.length - 1
  // A card is its picture plus the inset round it, so its height is a share of the
  // column's width plus a constant: a margin's percentage reads off that same width.
  const lift = `calc(-1 * (${(STEP_OVERLAP * ratio * 50).toFixed(3)}% + ${(STEP_OVERLAP * MEDIA_INSET * 2 * (1 - ratio)).toFixed(2)}px))`
  // Over its neighbour by 1 either way, so no hairline opens along a join.
  const past = 'calc(100% - 1px)'

  return (
    <section data-theme={cardTheme} style={vars}>
      {tiles.map((tile, i) => {
        const right = i % 2 === 1
        // Square where a join runs through the corner, the card's own curve elsewhere.
        const joinsAbove = i > 0 ? '0' : OUTER
        const joinsBelow = i < last ? '0' : OUTER
        const corners = right
          ? `${joinsAbove} ${OUTER} ${OUTER} ${joinsBelow}`
          : `${OUTER} ${joinsAbove} ${joinsBelow} ${OUTER}`
        return (
          <div key={tile.key} style={{ display: 'flex', justifyContent: right ? 'flex-end' : 'flex-start', marginTop: i > 0 ? lift : undefined }}>
            <div
              style={{
                position: 'relative',
                boxSizing: 'border-box',
                width: 'calc(50% + 0.5px)',
                background: SURFACE,
                padding: MEDIA_INSET,
                borderRadius: corners,
              }}
            >
              {box(tile.media)}
              {/* Above its top, on the far side of the seam from the card it hangs off. */}
              {i > 0 && (
                <StepCurve
                  at={right ? '100% 0' : '0 0'}
                  style={{ bottom: past, ...(right ? { left: 0 } : { right: 0 }) }}
                />
              )}
              {/* Under its foot, where the next card's side carries on down. */}
              {i < last && (
                <StepCurve
                  at={right ? '100% 100%' : '0 100%'}
                  style={{ top: past, ...(right ? { left: 0 } : { right: 0 }) }}
                />
              )}
            </div>
          </div>
        )
      })}
    </section>
  )
}

/** A length that scales with the column: a share of its width plus px, written in `cqw`. */
type Len = readonly [share: number, px: number]
const sum = (...lens: Len[]): Len => [lens.reduce((t, l) => t + l[0], 0), lens.reduce((t, l) => t + l[1], 0)]
const times = (len: Len, k: number): Len => [len[0] * k, len[1] * k]
const cqw = ([share, px]: Len) => `calc(${(share * 100).toFixed(4)}cqw + ${px.toFixed(2)}px)`

/**
 * How far a box in a cut stands off the cards round it. With the box's 16 corners
 * this makes its curve concentric with the 24 concave joins it nests into (12, the
 * Tools / Skills card's gap, was used first and left the box smaller than it needed
 * to be).
 */
const CLUSTER_GAP = spacePx.sm
/** How close a box that runs past the column may come to the window's edge. */
const CLUSTER_EDGE = spacePx.xl

/** A cluster picture and its drawn size, which sets its scale beside the others. */
type ClusterTile = { key: string; media: ReactNode; width: number; height: number }

/**
 * Six pictures with no copy of their own (no3y Code's component tiles) as an uneven
 * shape rather than a grid. Four cards step down the column, left, right, left,
 * right, each joined to the next along the foot of the centre seam. That leaves a cut
 * on each side, between the two cards of a column and closed by the card across the
 * seam, and in each cut one picture sits in a box of its own, clear of the rest like
 * the Tools / Skills card. Both boxes are drawn at the cards' scale and take pictures
 * wider than a card's, so each runs out past its own edge of the column (never closer
 * than `CLUSTER_EDGE` to the window's, where it crops its sides instead of
 * shrinking). Every join turns concave
 * at both ends. Positions are worked out from the column's width (`cqw`), since each
 * card's height follows its picture's. A phone stacks six separate cards.
 */
export function CurvedCluster({ tiles, slots }: { tiles: ClusterTile[]; slots: ClusterSlots }) {
  const isMobile = useIsMobile()
  const { theme: cardTheme, vars } = useCardTheme()
  const box = (media: ReactNode) => <div style={{ borderRadius: CURVED_INNER, overflow: 'hidden' }}>{media}</div>
  // Which of the four stepping cards (top left, first right, second left, second right)
  // have sprung in. A join's curves and squared corners only show once both cards
  // either side of it have, so a card that lands first is a plain rounded card rather
  // than one with its curves hanging off into nothing.
  const [landed, setLanded] = useState([false, false, false, false])
  const land = useCallback((index: number) => setLanded((was) => (was[index] ? was : was.map((v, i) => v || i === index))), [])
  const joined = (a: number, b: number) => landed[a] && landed[b]
  const j01 = joined(0, 1)
  const j12 = joined(1, 2)
  const j23 = joined(2, 3)
  const corner = (on: boolean) => (on ? '0px' : OUTER)

  if (isMobile) {
    return (
      <section data-theme={cardTheme} style={{ ...vars, display: 'flex', flexDirection: 'column', gap: spacePx.md }}>
        {tiles.map((tile) => (
          <Piece key={tile.key} style={{ background: SURFACE, borderRadius: OUTER, padding: MEDIA_INSET }}>
            {box(tile.media)}
          </Piece>
        ))}
      </section>
    )
  }

  const at = (index: number) => tiles[index]
  const frame = MEDIA_INSET * 2
  const half: Len = [0.5, 0]
  // A card's picture fills half the column less the inset: every picture takes that scale.
  const card = at(slots.right[0])
  const drawn = (px: number): Len => times(sum(half, [0, -frame]), px / card.width)
  const height = sum(drawn(card.height), [0, frame])
  const minus = (len: Len): Len => times(len, -1)
  const leftBox = at(slots.leftBetween)
  const rightBox = at(slots.rightBetween)
  const leftBoxHeight = sum(drawn(leftBox.height), [0, frame])
  const rightBoxHeight = sum(drawn(rightBox.height), [0, frame])
  const gaps: Len = [0, CLUSTER_GAP * 2]
  // A card is one card tall and has to reach both cards across the seam, past the cut
  // between them. The first right-hand card splits what the left cut leaves of its
  // height evenly between its two joins; the second left-hand card already has that
  // join at its head, so its foot takes what the right cut leaves.
  const join = times(sum(height, minus(leftBoxHeight), minus(gaps)), 0.5)
  const lastJoin = sum(height, minus(rightBoxHeight), minus(gaps), minus(join))

  // Down the page from the first left card's top.
  const rightTop = sum(height, minus(join))
  const leftBoxTop = sum(height, [0, CLUSTER_GAP])
  const lowerLeftTop = sum(rightTop, height, minus(join))
  const rightBoxTop = sum(rightTop, height, [0, CLUSTER_GAP])
  const lowerRightTop = sum(lowerLeftTop, height, minus(lastJoin))
  const total = sum(lowerRightTop, height)

  // Over the seam by half a pixel each, so no hairline opens along a join.
  const column = (right: boolean): CSSProperties => ({
    position: 'absolute',
    boxSizing: 'border-box',
    left: right ? cqw([0.5, -0.5]) : 0,
    width: cqw([0.5, 0.5]),
    background: SURFACE,
    padding: MEDIA_INSET,
  })
  const past = 'calc(100% - 1px)'
  // The concave ends of a join, on the card they sit above or below. A left card's are on
  // its right, at the seam, and a right card's on its left.
  const above = (right: boolean, on: boolean) => (
    <StepCurve
      at={right ? '100% 0' : '0 0'}
      className="cluster-join"
      style={{ bottom: past, opacity: on ? 1 : 0, ...(right ? { left: 0 } : { right: 0 }) }}
    />
  )
  const below = (right: boolean, on: boolean) => (
    <StepCurve
      at={right ? '100% 100%' : '0 100%'}
      className="cluster-join"
      style={{ top: past, opacity: on ? 1 : 0, ...(right ? { left: 0 } : { right: 0 }) }}
    />
  )
  // A box in a cut: its picture at the cards' scale and centred, so a box narrower than
  // the picture crops its sides.
  const between = (tile: ClusterTile, style: CSSProperties) => (
    <Piece style={{ position: 'absolute', boxSizing: 'border-box', background: SURFACE, padding: MEDIA_INSET, borderRadius: SIDE_RADIUS, ...style }}>
      <div style={{ position: 'relative', height: cqw(drawn(tile.height)), borderRadius: SIDE_RADIUS - MEDIA_INSET, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: '50%', width: cqw(drawn(tile.width)), transform: 'translateX(-50%)' }}>
          {tile.media}
        </div>
      </div>
    </Piece>
  )
  // A box starts the gap off the seam and may run out past its column's edge. The column
  // is centred, so the margin beside it is half of what the window has left over.
  const room = `calc(50cqw - ${CLUSTER_GAP + CLUSTER_EDGE}px + (100vw - 100cqw) / 2)`
  const boxWidth = (tile: ClusterTile) => `min(${cqw(sum(drawn(tile.width), [0, frame]))}, ${room})`

  return (
    <section data-theme={cardTheme} style={{ ...vars, containerType: 'inline-size' }}>
      <div style={{ position: 'relative', height: cqw(total) }}>
        {/* Top left: the left cut opens under it. */}
        <Piece onShow={() => land(0)} style={{ ...column(false), top: 0, borderRadius: `${OUTER} ${OUTER} ${corner(j01)} ${OUTER}` }}>
          {box(at(slots.left[0]).media)}
          {below(false, j01)}
        </Piece>

        {/* On its own in the left cut, out past the column's left edge. */}
        {between(leftBox, { right: cqw([0.5, CLUSTER_GAP]), top: cqw(leftBoxTop), width: boxWidth(leftBox) })}

        {/* The first right-hand card closes the left cut; the right cut opens under it. */}
        <Piece onShow={() => land(1)} style={{ ...column(true), top: cqw(rightTop), borderRadius: `${corner(j01)} ${OUTER} ${OUTER} ${corner(j12)}` }}>
          {box(card.media)}
          {above(true, j01)}
          {below(true, j12)}
        </Piece>

        {/* The second left-hand card closes the right cut. */}
        <Piece onShow={() => land(2)} style={{ ...column(false), top: cqw(lowerLeftTop), borderRadius: `${OUTER} ${corner(j12)} ${corner(j23)} ${OUTER}` }}>
          {box(at(slots.left[1]).media)}
          {above(false, j12)}
          {below(false, j23)}
        </Piece>

        {/* On its own in the right cut, out past the column. */}
        {between(rightBox, { left: cqw([0.5, CLUSTER_GAP]), top: cqw(rightBoxTop), width: boxWidth(rightBox) })}

        {/* The second right-hand card, off the foot of the second left-hand one. */}
        <Piece onShow={() => land(3)} style={{ ...column(true), top: cqw(lowerRightTop), borderRadius: `${corner(j23)} ${OUTER} ${OUTER} ${OUTER}` }}>
          {box(at(slots.right[1]).media)}
          {above(true, j23)}
        </Piece>
      </div>
    </section>
  )
}

/**
 * One card or box of the cluster, springing in on its own as it scrolls into view
 * (`.reveal`), from 90% like Hi's bento cards: the cluster runs taller than a laptop
 * window, so springing it in whole moved only the edge that was on screen.
 */
function Piece({ style, onShow, children }: { style: CSSProperties; onShow?: () => void; children: ReactNode }) {
  const [ref, shown] = useInView<HTMLDivElement>()
  useEffect(() => {
    if (shown) onShow?.()
  }, [shown, onShow])
  return (
    <div
      ref={ref}
      className="reveal cluster-card"
      data-shown={shown || undefined}
      style={{ ...style, '--reveal-scale': 0.9 } as CSSProperties}
    >
      {children}
    </div>
  )
}

/** A plain rounded card on the same surface, for what has no media and tab of its own. */
export function CurvedPanel({
  as: Tag = 'section',
  style,
  children,
}: {
  as?: ElementType
  style?: CSSProperties
  children: ReactNode
}) {
  const { theme: cardTheme, vars } = useCardTheme()
  return (
    <Tag data-theme={cardTheme} style={{ ...vars, background: SURFACE, borderRadius: OUTER, ...style }}>
      {children}
    </Tag>
  )
}

/** Media with no copy of its own, on a plain card: for when the page's intro carries its words. */
export function CurvedMedia({ children }: { children: ReactNode }) {
  return (
    <CurvedPanel style={{ padding: MEDIA_INSET }}>
      <div style={{ borderRadius: CURVED_INNER, overflow: 'hidden' }}>{children}</div>
    </CurvedPanel>
  )
}

/**
 * A tab's copy: the heading, a soft line saying what the media shows, then the
 * paragraphs. `children` take anything else on the same measure (links, or
 * paragraphs that need more than `Prose` carries).
 */
export function CurvedCopy({
  heading,
  caption,
  body,
  children,
}: {
  heading?: ReactNode
  caption?: string
  body?: Prose
  children?: ReactNode
}) {
  return (
    <>
      {(heading || caption) && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: space.xs }}>
          {heading && <h2 style={HEADING}>{heading}</h2>}
          {caption && <p style={{ ...BODY, fontSize: '14px', color: TEXT_SOFT }}>{caption}</p>}
        </div>
      )}
      {(body || children) && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: space.lg, maxWidth: COPY_MEASURE }}>
          {body &&
            toParagraphs(body).map((paragraph, i) => (
              <p key={i} style={BODY}>
                {typeof paragraph === 'string' ? paragraph : <Runs runs={paragraph} />}
              </p>
            ))}
          {children}
        </div>
      )}
    </>
  )
}

/** Headed lists of filled chips (Tools / Skills, Role / Team / Partners), for a card's `side`. */
export function CurvedFacts({ facts }: { facts: { heading: string; items: string[] }[] }) {
  return (
    <>
      {facts.map((fact) => (
        <div key={fact.heading} style={{ display: 'flex', flexDirection: 'column', gap: space.lg }}>
          <h2 style={HEADING}>{fact.heading}</h2>
          <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexWrap: 'wrap', gap: space.sm }}>
            {fact.items.map((item) => (
              <li key={item}>
                <Chip filled>{item}</Chip>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </>
  )
}
