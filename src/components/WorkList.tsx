import { type CSSProperties, type ReactNode, useRef } from 'react'
import { ArrowRight, ArrowSquareOut } from '@phosphor-icons/react'
import AppLink from '../AppLink'
import Button from '../design-system/Button'
import { VARIANTS } from '../design-system/buttonStyles'
import { NO3Y_CODE_DOWNLOAD, STAT_BUILDER_SITE, projects } from '../data/projects'
import { color, control, radius, space, type } from '../design-system/tokens'
import { useElementWidth } from '../hooks/useElementWidth'
import { useIsMobile } from '../hooks/useIsMobile'
import { WORK_FILTERS, type WorkFilter } from '../workFilter'

/**
 * The home page's Work tab (Figma frame `365:6192`): a two-column grid of
 * cards in a dark bento on the white sheet, sectioned by the second rail. Each card is its art exported whole out of
 * Figma (452.5 × 250 in the file, shipped at 2x), with the caption *below* the
 * art — title, muted subtitle, then a "Case study" pill and an optional
 * second action (an external link, or a plain employer label on the Invisible
 * work). The art itself also links to the case study.
 */

type WorkCard = {
  /** The case-study route — both the art and the "Case study" pill go here. */
  href: string
  title: string
  subtitle: string
  art: { src: string; alt: string }
  /** Hover colour for the art's outline, matched to each card's palette. */
  accent: string
  /**
   * Art laid over the export. How to Build a PC's Figma card is a bare
   * gradient — the file never had its art — so the old thumbnail sits centred
   * at `width`.
   */
  overlay?: { src: string; width?: string }
  /** The pill beside "Case study": an external link, or an href-less label
   *  (the file's "@ Invisible Technologies"). */
  extra?: { label: string; href?: string }
}

const no3y: WorkCard = {
  href: '/work/no3y-code',
  title: projects['no3y-code'].title,
  subtitle: 'Agent orchestration tool',
  art: {
    src: '/work/bento/card-no3y.png',
    alt: 'no3y Code — the composer bar over a red-and-violet gradient',
  },
  accent: '#6f5efb',
  extra: { label: 'Download from GitHub', href: NO3Y_CODE_DOWNLOAD },
}

const crisp: WorkCard = {
  href: '/work/crisp',
  title: projects.crisp.title,
  subtitle: 'Zoom editor for screen recordings',
  art: {
    src: '/work/bento/card-crisp.png',
    alt: 'Crisp — the circular mark and wordmark on magenta',
  },
  accent: '#ff2d57',
}

const statBuilder: WorkCard = {
  href: '/work/stat-builder',
  title: projects['stat-builder'].title,
  subtitle: 'Community tool for Destiny 2',
  art: {
    src: '/work/bento/card-stat-builder.png',
    alt: 'D2 Stat Builder — the armor table in a dark window on yellow',
  },
  accent: '#c56430',
  extra: { label: 'View the site', href: STAT_BUILDER_SITE },
}

const onboarding: WorkCard = {
  href: '/work/invisible/onboarding',
  title: 'Revitalizing Meridial’s onboarding flow',
  subtitle: 'Research & Product Design',
  art: {
    src: '/work/bento/card-invisible-onboarding.png',
    alt: 'Meridial — the onboarding profile step on a magenta dither',
  },
  // Follows the art, which the August 2026 frame recoloured onto the study's
  // own magenta — the same family `InvisibleOnboarding`'s `STUDY_ACCENT` runs.
  accent: '#cb52b9',
  extra: { label: '@ Invisible Technologies' },
}

const synapse: WorkCard = {
  href: '/work/invisible/synapse',
  title: 'Designing AI training interfaces for Synapse',
  subtitle: 'Product design',
  art: {
    src: '/work/bento/card-invisible-synapse.png',
    alt: 'Synapse — three model responses beside the task panel, on purple',
  },
  accent: '#a06ff0',
  extra: { label: '@ Invisible Technologies' },
}

const nachoBox: WorkCard = {
  href: '/work/nacho-box',
  title: projects['nacho-box'].title,
  subtitle: 'Packaging and graphic design project',
  art: {
    src: '/work/nacho-box/thumbnail.png',
    alt: 'Nacho Box — the “Hint of Lime” lockup on a chip-pattern yellow',
  },
  accent: '#6b9b2a',
}

const howToPc: WorkCard = {
  href: '/work/how-to-pc',
  title: projects['how-to-pc'].title,
  subtitle: 'Graphic design project',
  art: {
    src: '/work/bento/card-how-to-pc.png',
    alt: 'How to Build a PC — the graphics-card illustration on magenta',
  },
  accent: '#ff7eb6',
  // The old card's placement: the title art centred on a 76% measure.
  overlay: { src: '/work/how-to-pc/thumbnail.png', width: '76%' },
}

const armory: WorkCard = {
  href: '/work/armory',
  title: projects.armory.title,
  subtitle: 'Community tool for Destiny 2',
  art: {
    src: '/work/bento/card-armory.png',
    alt: 'Moonfang Armory — a pixel weapon sprite centered on a blue dither',
  },
  accent: '#3a6df0',
  extra: { label: 'View the site', href: 'https://noeyarmory.vercel.app/' },
}

/**
 * The rows each section of the second rail shows (`src/workFilter.ts`). The
 * frame draws the whole set under "Case studies", so that section is the full
 * list and the other two narrow it.
 */
const CARDS: Record<WorkFilter, WorkCard[]> = {
  studies: [crisp, no3y, statBuilder, onboarding, synapse, nachoBox, howToPc, armory],
  personal: [crisp, no3y, statBuilder, armory],
  graphic: [nachoBox, howToPc],
}

/**
 * The fill on the active filter pill. A raw value rather than
 * `--color-bg-cream` (#f5efe0): the July file draws it a step greyer.
 */
const CARD_CREAM = '#e6dfd2'

/**
 * The grid on the white sheet (Figma `365:6291`). The frame draws it inside a
 * dark bento; that read as a slab against the sheet, so the cards sit on the
 * white directly at the bento's own 32px inset and take the ink palette. The
 * cards are the file's 508 × 250 — a hair wider than the 452.5 × 250 exports,
 * which `object-fit` crops by a few pixels top and bottom rather than
 * letterboxing.
 */
const SHEET_PAD = 32
const CARD_ASPECT = '508 / 250'
/**
 * How the grid takes a wide sheet. The frame's two 508px columns are the
 * card's largest size — past that a card stops reading as a thumbnail — so
 * the tracks cap at `CARD_MAX` and a third column opens once three fit at
 * `CARD_MIN` (about a 1700px viewport), growing back up to 508 from there.
 * `CARD_MIN` is set so the tablet band still lands two columns, and three is
 * the most the sheet holds. The count is worked out from the measured sheet
 * rather than `auto-fill`, which sizes its repetitions off the track *max*
 * and so would drop to one column before the frame's own width.
 */
const CARD_MIN = 380
const CARD_MAX = 508
const CARD_COLUMNS_MAX = 3
const COLUMN_GAP = 32

function columnsFor(width: number) {
  if (width === 0) return 2
  const fit = Math.floor((width + COLUMN_GAP) / (CARD_MIN + COLUMN_GAP))
  return Math.min(CARD_COLUMNS_MAX, Math.max(1, fit))
}
const CARD_ASPECT_MOBILE = '905 / 500'

export default function WorkList({
  filter,
  onSelectFilter,
}: {
  filter: WorkFilter
  onSelectFilter: (filter: WorkFilter) => void
}) {
  const isMobile = useIsMobile()
  const cards = CARDS[filter]
  const sheetRef = useRef<HTMLDivElement>(null)
  // `clientWidth` includes the sheet's own padding; the grid sits inside it.
  const sheetWidth = useElementWidth(sheetRef)
  const columns = columnsFor(sheetWidth === 0 ? 0 : sheetWidth - SHEET_PAD * 2)

  const grid = (
    <div
      key={filter}
      className="tab-content-in"
      style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : `repeat(${columns}, minmax(0, ${CARD_MAX}px))`,
        justifyContent: 'start',
        // The file's 32 between columns and 56 between rows.
        columnGap: `${COLUMN_GAP}px`,
        rowGap: isMobile ? space['3xl'] : '56px',
      }}
    >
      {cards.map((card) => (
        <WorkCardCell
          key={card.href}
          card={card}
          aspect={isMobile ? CARD_ASPECT_MOBILE : CARD_ASPECT}
          onSheet={!isMobile}
        />
      ))}
    </div>
  )

  // Desktop's sections live on the second rail beside the sheet; the mobile
  // page has no rail, so it keeps the pill row over the grid.
  if (!isMobile) {
    return (
      <div ref={sheetRef} style={{ padding: SHEET_PAD }}>
        {grid}
      </div>
    )
  }

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
          size="sm"
          // The active filter is the one filled pill in the row; the rest read as
          // plain labels until hovered, so the row stays quiet over the grid.
          variant={entry.id === filter ? 'secondary' : 'ghost'}
          onClick={() => onSelectFilter(entry.id)}
          aria-pressed={entry.id === filter}
          style={
            entry.id === filter
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

/**
 * One cell: the art box linking to the case study, caption and pills below.
 * `onSheet` swaps the caption and pills onto the ink palette for the white
 * sheet; mobile keeps the dark shell's.
 */
function WorkCardCell({ card, aspect, onSheet }: { card: WorkCard; aspect: string; onSheet: boolean }) {
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
          aspectRatio: aspect,
          ['--bento-accent' as string]: card.accent,
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

      <div style={{ display: 'flex', flexDirection: 'column', gap: space.sm }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <h2
            style={{
              margin: 0,
              fontSize: '16px',
              fontWeight: 500,
              lineHeight: 1.4,
              letterSpacing: '-0.16px',
              color: onSheet ? color.ink.default : color.text.primary,
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
              letterSpacing: '-0.16px',
              color: onSheet ? color.ink.muted : color.text.muted,
            }}
          >
            {card.subtitle}
          </p>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: space.sm }}>
          <CardPill palette="secondary" href={card.href} onSheet={onSheet}>
            Case study
            <ArrowRight size={14} />
          </CardPill>
          {card.extra &&
            (card.extra.href ? (
              <CardPill palette="ghost" href={card.extra.href} external onSheet={onSheet}>
                {card.extra.label}
                <ArrowSquareOut size={14} />
              </CardPill>
            ) : (
              <CardPill palette="label" onSheet={onSheet}>
                {card.extra.label}
              </CardPill>
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
 * that keeps the pill metrics without being a control. On the sheet the same
 * three run on ink: a solid ink "Case study", an ink-bordered external link,
 * and ink text for the label.
 */
const SHEET_PILLS = {
  secondary: { background: color.ink.default, borderColor: color.ink.default, color: color.bg.cream },
  ghost: { background: 'transparent', borderColor: color.border.ink, color: color.ink.default },
  label: { background: 'transparent', borderColor: 'transparent', color: color.ink.default },
} as const

function CardPill({
  palette,
  href,
  external,
  onSheet,
  children,
}: {
  palette: 'secondary' | 'ghost' | 'label'
  href?: string
  external?: boolean
  onSheet: boolean
  children: ReactNode
}) {
  const colors = onSheet
    ? SHEET_PILLS[palette]
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
