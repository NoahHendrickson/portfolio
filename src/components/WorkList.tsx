import { type CSSProperties, type ReactNode } from 'react'
import { ArrowRight, ArrowSquareOut } from '@phosphor-icons/react'
import AppLink from '../AppLink'
import Button from '../design-system/Button'
import { VARIANTS } from '../design-system/buttonStyles'
import { WORK_FILTERS, type WorkCard, type WorkFilter } from '../data/workCards'
import { color, control, radius, space, type } from '../design-system/tokens'
import { useIsMobile } from '../hooks/useIsMobile'

/**
 * The home page's Work tab (Figma frame `320:30968`): a two-column grid of
 * cards, sectioned by the rail's Work menu on desktop and by a row of filter
 * pills over the grid on mobile, where the rail is a dropdown. The cards and
 * sections live in `src/data/workCards.ts`; each card shows its art with the
 * caption *below* — title, muted subtitle, then a pill to the page ("Case
 * study" on career cards, "View" on the rest) and an optional second action
 * (an external link, or a plain employer label on the Invisible work). The
 * art itself also links to the page.
 */

/**
 * The fill on the active filter pill. A raw value rather than
 * `--color-bg-cream` (#f5efe0): the July file draws it a step greyer.
 */
const CARD_CREAM = '#e6dfd2'

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
  const active = WORK_FILTERS.find((f) => f.id === filter) ?? WORK_FILTERS[0]

  const grid = (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, minmax(0, 1fr))',
        // The file's 32 between columns and 56 between rows.
        columnGap: '32px',
        rowGap: isMobile ? space['3xl'] : '56px',
      }}
    >
      {active.cards.map((card) => (
        <WorkCardCell key={card.href} card={card} />
      ))}
    </div>
  )

  // Desktop's sections are the rail's Work menu; the mobile page has no rail,
  // so it keeps the pill row over the grid.
  if (!isMobile) return grid

  const pills = (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'flex-start',
        gap: space.sm,
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
              ? { background: CARD_CREAM, borderColor: CARD_CREAM, color: color.ink.default }
              : { borderColor: 'transparent' }
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

/** One cell: the art box linking to the page, caption and pills below. */
function WorkCardCell({ card }: { card: WorkCard }) {
  const cta = CASE_STUDY_CARDS.has(card) ? 'Case study' : 'View'
  return (
    <article style={{ display: 'flex', flexDirection: 'column', gap: space.lg, minWidth: 0 }}>
      <AppLink
        href={card.href}
        aria-label={card.title}
        className="work-bento-card"
        style={{
          display: 'block',
          borderRadius: radius.md,
          overflow: 'hidden',
          // The export's own box (452.5 × 250 at 2x), so the art never crops.
          aspectRatio: '905 / 500',
        }}
      >
        <img
          src={card.art.src}
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

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: space.sm }}>
          <CardPill palette="secondary" href={card.href}>
            {cta}
            <ArrowRight size={14} />
          </CardPill>
          {card.extra &&
            (card.extra.href ? (
              <CardPill palette="ghost" href={card.extra.href} external>
                {card.extra.label}
                <ArrowSquareOut size={14} />
              </CardPill>
            ) : (
              <CardPill palette="label">{card.extra.label}</CardPill>
            ))}
        </div>
      </div>
    </article>
  )
}

/**
 * A pill at the `xs` control's metrics. `Button` renders a `<button>`, so
 * these links pull their palette from `buttonStyles` instead of nesting one —
 * `secondary` is the file's cream "Case study" fill, `ghost` its bordered
 * external links, and `label` the borderless "@ Invisible Technologies" text
 * that keeps the pill metrics without being a control.
 */
function CardPill({
  palette,
  href,
  external,
  children,
}: {
  palette: 'secondary' | 'ghost' | 'label'
  href?: string
  external?: boolean
  children: ReactNode
}) {
  const colors =
    palette === 'label'
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
