import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react'
import { ArrowRight, ArrowSquareOut, ArrowUp } from '@phosphor-icons/react'
import AppLink from '../AppLink'
import Button from '../design-system/Button'
import { VARIANTS } from '../design-system/buttonStyles'
import { FEATURED, WORK_FILTERS, type WorkCard, type WorkFilter } from '../data/workCards'
import { color, control, radius, space, type } from '../design-system/tokens'
import { MOBILE_WIDTH_QUERY, useIsMobile, useIsWide } from '../hooks/useIsMobile'
import { useMediaQuery } from '../hooks/useMediaQuery'

/**
 * The home page's Work tab (Figma frame `320:30968`): a two-column grid of
 * cards on the file's width, three columns past `WIDE_MIN`, sectioned by the
 * rail's Work menu on desktop and by a row of filter pills over the grid on
 * mobile, where the rail is a dropdown. The cards and sections live in
 * `src/data/workCards.ts`; each card shows its art with the caption *below* —
 * title, muted subtitle, then a pill to the page ("Case study" on career
 * cards, "View" on the rest) and an optional second action (an external link,
 * or a plain employer label on the Invisible work). The art itself also
 * links to the page.
 */

/**
 * The fill on the active filter pill. A raw value rather than
 * `--color-bg-cream` (#f5efe0): the July file draws it a step greyer.
 */
const CARD_CREAM = '#e6dfd2'

/**
 * The featured boxes' fill: the rail's cream, so the pair reads as the same
 * paper as the spine and the Work menu. The copy inside runs on ink.
 */
const FEATURED_BG = color.bg.cream

/**
 * A real pointer that can hover. Only there do the grid cards hide their
 * caption until hover; touch keeps it under the art, since nothing would ever
 * reveal it.
 */
const HOVER_QUERY = '(hover: hover) and (pointer: fine)'

/**
 * Where a featured box can seat its caption beside the art. Beside, the
 * caption runs taller than the art's ratio and the art stretches to meet it,
 * cropping its sides — under 10% from 1512 up, but about 20% at 1400 and 45%
 * at 1000, where it eats into the window. Below this the box stacks instead.
 */
const BESIDE_QUERY = '(min-width: 1440px)'

const CASE_STUDY_CARDS = new Set(
  WORK_FILTERS.find((f) => f.id === 'career')?.cards ?? [],
)

export default function WorkList({
  filter,
  onSelectFilter,
}: {
  filter: WorkFilter
  onSelectFilter: (filter: WorkFilter) => void
}) {
  const isMobile = useIsMobile()
  const isWide = useIsWide()
  const canHover = useMediaQuery(HOVER_QUERY)
  const roomBeside = useMediaQuery(BESIDE_QUERY)
  // Desktop with a mouse shows the grid as bare art, caption on hover.
  const peek = canHover && !isMobile
  const active = WORK_FILTERS.find((f) => f.id === filter) ?? WORK_FILTERS[0]
  const pillsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const current = pillsRef.current?.querySelector('[aria-pressed="true"]')
    if (current instanceof HTMLElement) {
      current.scrollIntoView({ inline: 'nearest', block: 'nearest' })
    }
  }, [filter])

  // All opens on the featured work, two boxes side by side ahead of the grid,
  // and the grid leaves those cards out so nothing shows twice. Mobile keeps
  // them first but as ordinary cards, so the list reads as one style.
  const leading = active.id === 'all' ? FEATURED : []
  const featured = isMobile ? [] : leading
  const rest = [...(isMobile ? leading : []), ...active.cards.filter((card) => !leading.includes(card))]

  const cards = (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: isMobile
          ? '1fr'
          : `repeat(${isWide ? 3 : 2}, minmax(0, 1fr))`,
        // The file's 32 between columns and 56 between rows — or 32 both
        // ways when the captions only show on hover, so the bare art sits
        // on an even grid.
        columnGap: '32px',
        rowGap: isMobile ? space['3xl'] : peek ? '32px' : '56px',
      }}
    >
      {rest.map((card) =>
        peek ? <PeekCardCell key={card.href} card={card} /> : <WorkCardCell key={card.href} card={card} />,
      )}
    </div>
  )

  const grid =
    featured.length === 0 ? (
      cards
    ) : (
      <div style={{ display: 'flex', flexDirection: 'column', gap: space['4xl'] }}>
        <div
          style={{
            display: 'grid',
            // Two up only past `WIDE_MIN`; below it a half-width box is too
            // narrow for the stats, so the boxes stack and lay out sideways —
            // until `BESIDE_QUERY`, under which each box stacks too.
            gridTemplateColumns: isWide ? 'repeat(2, minmax(0, 1fr))' : '1fr',
            gap: isMobile ? space.xl : '32px',
          }}
        >
          {featured.map((card) => (
            <FeaturedCell key={card.href} card={card} beside={!isWide && !isMobile && roomBeside} />
          ))}
        </div>
        {cards}
      </div>
    )

  // Desktop's sections are the rail's Work menu; the mobile page has no rail,
  // so it keeps the pill row over the grid.
  if (!isMobile) return grid

  const pills = (
    <div
      ref={pillsRef}
      className="work-filter-row"
      style={{
        display: 'flex',
        flexWrap: 'nowrap',
        alignItems: 'center',
        gap: space.sm,
        overflowX: 'auto',
        // The page's 20 right pad is peek space, so Graphic design clips
        // in-frame instead of wrapping onto a second line.
        marginRight: -20,
        paddingRight: 20,
        WebkitOverflowScrolling: 'touch',
      }}
    >
      {WORK_FILTERS.map((entry) => (
        <Button
          key={entry.id}
          // The 32 the header's own controls already run at on mobile.
          size="sm"
          // The active filter is the one filled pill in the row; the rest read as
          // plain labels until hovered, so the row stays quiet over the grid.
          variant={entry.id === active.id ? 'secondary' : 'ghost'}
          onClick={() => onSelectFilter(entry.id)}
          aria-pressed={entry.id === active.id}
          style={
            entry.id === active.id
              ? {
                  flexShrink: 0,
                  paddingInline: space.md,
                  background: CARD_CREAM,
                  borderColor: CARD_CREAM,
                  color: color.ink.default,
                }
              : { flexShrink: 0, paddingInline: space.md, borderColor: 'transparent' }
          }
        >
          {entry.label}
        </Button>
      ))}
    </div>
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: space.xl }}>
      {pills}
      {grid}
    </div>
  )
}

/**
 * A grid cell on a hover-capable screen: just the art, with the caption
 * panel rising over its foot on hover or keyboard focus (`.work-peek-*` in
 * `index.css`). The whole cell lifts rather than the art alone, so the panel
 * rides with it. The panel lets clicks through to the art's link underneath —
 * only its pills take the pointer, and only while it shows, so a hidden pill
 * can't be clicked blind.
 */
function PeekCardCell({ card }: { card: WorkCard }) {
  return (
    <article
      className="work-peek-card"
      style={{ position: 'relative', minWidth: 0, borderRadius: radius.md, overflow: 'hidden' }}
    >
      <CardArt card={card} still />

      <div
        className="work-peek-caption"
        style={{
          position: 'absolute',
          left: space.sm,
          right: space.sm,
          bottom: space.sm,
          display: 'flex',
          flexDirection: 'column',
          gap: space.md,
          padding: space.md,
          // The art's 8 less the 8 inset would square it off; 6 keeps a curve.
          borderRadius: radius.sm,
          background: `color-mix(in srgb, ${color.bg.primary} 80%, transparent)`,
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          pointerEvents: 'none',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          <h2
            style={{
              margin: 0,
              fontSize: '16px',
              fontWeight: 500,
              lineHeight: 1.4,
              letterSpacing: 0,
              color: color.text.primary,
            }}
          >
            {card.title}
          </h2>
          <p
            style={{
              margin: 0,
              fontSize: '14px',
              fontWeight: 400,
              lineHeight: 1.4,
              letterSpacing: 0,
              // Secondary rather than the grid's muted: it sits on a scrim now.
              color: color.text.secondary,
            }}
          >
            {card.subtitle}
          </p>
        </div>

        <div className="work-peek-actions">
          <CardActions card={card} />
        </div>
      </div>
    </article>
  )
}

/** One cell: the art box linking to the page, caption and pills below. */
function WorkCardCell({ card }: { card: WorkCard }) {
  return (
    <article style={{ display: 'flex', flexDirection: 'column', gap: space.lg, minWidth: 0 }}>
      <CardArt card={card} />

      <div style={{ display: 'flex', flexDirection: 'column', gap: space.md }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <h2
            style={{
              margin: 0,
              fontSize: '16px',
              fontWeight: 500,
              lineHeight: 1.4,
              letterSpacing: 0,
              color: color.text.primary,
            }}
          >
            {card.title}
          </h2>
          <p
            style={{
              margin: 0,
              fontSize: '16px',
              fontWeight: 400,
              lineHeight: 1.4,
              letterSpacing: 0,
              color: color.text.muted,
            }}
          >
            {card.subtitle}
          </p>
        </div>

        <CardActions card={card} />
      </div>
    </article>
  )
}

/**
 * A featured cell: a cream box of its own, the art over a
 * caption on a larger title, with the card's results (or a blurb, if it has
 * none) between the subtitle and the pills. The pills sit on the box's floor,
 * so they line up across the pair whichever box runs longer. `beside` puts
 * the caption to the right of the art instead, for a stacked box with the
 * whole column to itself. The box pads the art by only 4, so it reads as a
 * thin cream border round the art rather than a frame.
 */
function FeaturedCell({ card, beside }: { card: WorkCard; beside: boolean }) {
  const results = card.feature?.results
  const blurb = card.feature?.blurb

  return (
    // The whole box lifts on hover (`.work-featured-card`), not the art: the
    // art's scale would push it out over its 4px border.
    <article
      className="work-featured-card"
      style={{
        display: 'grid',
        // The art takes a little over half a sideways box.
        gridTemplateColumns: beside ? 'minmax(0, 11fr) minmax(0, 9fr)' : 'minmax(0, 1fr)',
        // Stacked, the caption row takes the slack so the pills sink to the floor.
        gridTemplateRows: beside ? undefined : 'auto 1fr',
        gap: space.xl,
        minWidth: 0,
        // The anchor for the stretched link below.
        position: 'relative',
        padding: space.xs,
        borderRadius: radius.xl,
        background: FEATURED_BG,
      }}
    >
      {/* The whole box opens the page, not just the art: a link stretched
          over it, under everything positioned (the art's own link, the
          pills). It is a pointer target only — the art's link already gives
          keyboards and screen readers the same destination. */}
      <AppLink
        href={card.href}
        tabIndex={-1}
        aria-hidden
        style={{ position: 'absolute', inset: 0, borderRadius: 'inherit' }}
      />

      {/* The box's 16 less its 4 pad, so the corners run concentric. */}
      {/* Beside, the caption can run taller than the art's own ratio (the
          results wrap as the column narrows), so the art stretches to the
          box's height and crops its backdrop rather than stopping short;
          `BESIDE_QUERY` keeps that crop to the backdrop. */}
      <CardArt card={card} radius={radius.lg} still fill={beside} />

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: space.xl,
          minWidth: 0,
          padding: beside ? `${space.lg} ${space.lg} ${space.lg} 0` : `0 ${space.lg} ${space.lg}`,
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: space.xs }}>
          <h2
            style={{
              margin: 0,
              ...type['heading-m'],
              color: color.ink.default,
            }}
          >
            {card.title}
          </h2>
          <p style={{ margin: 0, ...type['body-l'], color: color.ink.secondary }}>{card.subtitle}</p>
        </div>

        {/* One result a line, each a plain sentence behind an up arrow. The
            arrow rides a box one line tall, so it stays on the first line if
            a sentence wraps. */}
        {results && (
          <ul
            style={{
              margin: 0,
              padding: 0,
              listStyle: 'none',
              display: 'flex',
              flexDirection: 'column',
              gap: space.sm,
            }}
          >
            {results.map((result) => (
              <li
                key={result}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: space.sm,
                  ...type['body-m'],
                  color: color.ink.default,
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', height: '1.4em', flexShrink: 0 }}>
                  <ArrowUp size={14} color={color.accent.default} aria-hidden />
                </span>
                {result}
              </li>
            ))}
          </ul>
        )}

        {blurb && (
          <p
            style={{
              margin: 0,
              ...type['body-l'],
              color: color.ink.secondary,
            }}
          >
            {blurb}
          </p>
        )}

        {/* No employer label here: the box already has enough going on. */}
        {/* Positioned, so the pills sit over the stretched link, and shrunk to
            them, so the floor beside them still opens the page. */}
        <div style={{ marginTop: 'auto', alignSelf: 'flex-start', position: 'relative' }}>
          <CardActions card={card} links light />
        </div>
      </div>
    </article>
  )
}

/** The art box, linking to the page. */
function CardArt({
  card,
  radius: corner = radius.md,
  still = false,
  fill = false,
}: {
  card: WorkCard
  radius?: string
  /** Drop the art's own hover lift, for a box that lifts as a whole. */
  still?: boolean
  /** Stretch to the grid row's height, the ratio only a floor. */
  fill?: boolean
}) {
  return (
    <AppLink
      href={card.href}
      aria-label={card.title}
      className={still ? undefined : 'work-bento-card'}
      style={{
        display: 'block',
        // The overlay's anchor, which `.work-bento-card` set before `still`.
        position: 'relative',
        borderRadius: corner,
        overflow: 'hidden',
        // The export's own box (452.5 × 250 at 2x), so the art never crops.
        aspectRatio: '905 / 500',
        // Stretched both ways, the ratio only sizes the row; the art then
        // takes the row's height. Height alone would drive the width through
        // the ratio and run the art over the caption.
        alignSelf: fill ? 'stretch' : undefined,
        justifySelf: fill ? 'stretch' : undefined,
      }}
    >
      <img
        src={card.art.src}
        srcSet={card.art.srcSet}
        // `auto` is the box's laid-out width (lazy images only); a browser
        // without it takes the fallback — the full column on mobile, about a
        // featured box (the widest desktop cell) otherwise.
        sizes={card.art.srcSet ? `auto, ${MOBILE_WIDTH_QUERY} 100vw, 460px` : undefined}
        alt={card.art.alt}
        loading="lazy"
        style={{ display: 'block', width: '100%', height: '100%', objectFit: 'cover' }}
      />
      {card.overlay && (
        <img
          src={card.overlay.src}
          alt=""
          aria-hidden
          loading="lazy"
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
    </AppLink>
  )
}

/** The pill to the page ("Case study" or "View") and the card's optional second action. */
function CardActions({
  card,
  links = false,
  light = false,
}: {
  card: WorkCard
  links?: boolean
  light?: boolean
}) {
  const cta = CASE_STUDY_CARDS.has(card) ? 'Case study' : 'View'
  // `links` keeps the second action only when it goes somewhere, dropping
  // the plain "@ Invisible Technologies" label.
  const extra = links && !card.extra?.href ? undefined : card.extra
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: space.sm }}>
      <CardPill palette="secondary" href={card.href} light={light}>
        {cta}
        <ArrowRight size={14} />
      </CardPill>
      {extra &&
        (extra.href ? (
          <CardPill palette="ghost" href={extra.href} external light={light}>
            {extra.label}
            <ArrowSquareOut size={14} />
          </CardPill>
        ) : (
          <CardPill palette="label" light={light}>
            {extra.label}
          </CardPill>
        ))}
    </div>
  )
}

/** `CardPill`'s palettes on a cream surface: an ink fill, an ink hairline, ink text. */
const LIGHT_PILLS = {
  secondary: { background: color.ink.default, borderColor: color.ink.default, color: FEATURED_BG },
  ghost: { background: 'transparent', borderColor: color.border.ink, color: color.ink.default },
  label: { background: 'transparent', borderColor: 'transparent', color: color.ink.default },
} as const

/**
 * A pill at the `xs` control's metrics. `Button` renders a `<button>`, so
 * these links pull their palette from `buttonStyles` instead of nesting one —
 * `secondary` is the file's cream "Case study" fill, `ghost` its bordered
 * external links, and `label` the borderless "@ Invisible Technologies" text
 * that keeps the pill metrics without being a control. `light` flips each
 * onto ink for a cream surface, where the cream fill would vanish.
 */
function CardPill({
  palette,
  href,
  external,
  light = false,
  children,
}: {
  palette: 'secondary' | 'ghost' | 'label'
  href?: string
  external?: boolean
  light?: boolean
  children: ReactNode
}) {
  const colors = light
    ? LIGHT_PILLS[palette]
    : palette === 'label'
      ? { background: 'transparent', borderColor: 'transparent', color: color.text.primary }
      : VARIANTS[palette].default

  const style: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: space.sm,
    height: control.xs,
    boxSizing: 'border-box',
    padding: `0 ${space.md}`,
    borderRadius: radius.full,
    border: `1px solid ${colors.borderColor}`,
    background: colors.background,
    color: colors.color,
    fontSize: type['label-s'].fontSize,
    fontWeight: type['label-s'].fontWeight,
    lineHeight: type['label-s'].lineHeight,
    textDecoration: 'none',
    whiteSpace: 'nowrap',
  }

  if (!href) return <span style={style}>{children}</span>

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" style={style}>
        {children}
      </a>
    )
  }

  return (
    <AppLink href={href} style={style}>
      {children}
    </AppLink>
  )
}
