import { type CSSProperties, type ReactNode, useState } from 'react'
import { ArrowRight, ArrowSquareOut } from '@phosphor-icons/react'
import AppLink from '../AppLink'
import Button from '../design-system/Button'
import { VARIANTS } from '../design-system/buttonStyles'
import { NO3Y_CODE_DOWNLOAD, STAT_BUILDER_SITE, projects } from '../data/projects'
import { color, control, radius, space, type } from '../design-system/tokens'
import { useIsMobile } from '../hooks/useIsMobile'

/**
 * The home page's Work tab (Figma frame `320:30968`): a row of filter pills
 * over a two-column grid of cards. Each card is its art exported whole out of
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

type Filter = {
  id: string
  label: string
  cards: WorkCard[]
}

const FILTERS: Filter[] = [
  { id: 'all', label: 'All', cards: [no3y, statBuilder, onboarding, synapse, nachoBox, howToPc, armory] },
  { id: 'fun', label: 'Personal projects', cards: [no3y, statBuilder, armory] },
  { id: 'career', label: 'Career', cards: [onboarding, synapse] },
  { id: 'graphic', label: 'Graphic design', cards: [nachoBox, howToPc] },
]

/** Survives refresh — the whole home page lives on `/`, so the filter isn't in the path. */
const FILTER_KEY = 'work-filter'

function readFilter() {
  const id = sessionStorage.getItem(FILTER_KEY)
  return FILTERS.some((filter) => filter.id === id) ? id! : FILTERS[0].id
}

function writeFilter(id: string) {
  sessionStorage.setItem(FILTER_KEY, id)
}

/**
 * The fill on the active filter pill. A raw value rather than
 * `--color-bg-cream` (#f5efe0): the July file draws it a step greyer.
 */
const CARD_CREAM = '#e6dfd2'

export default function WorkList() {
  const isMobile = useIsMobile()
  const [activeId, setActiveId] = useState(readFilter)
  const active = FILTERS.find((f) => f.id === activeId) ?? FILTERS[0]

  const selectFilter = (id: string) => {
    setActiveId(id)
    writeFilter(id)
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
      {FILTERS.map((filter) => (
        <Button
          key={filter.id}
          // `xs` is the file's 28px pill; mobile takes the 32 the header's own
          // controls already run at.
          size={isMobile ? 'sm' : 'xs'}
          // The active filter is the one filled pill in the row; the rest read as
          // plain labels until hovered, so the row stays quiet over the grid.
          variant={filter.id === activeId ? 'secondary' : 'ghost'}
          onClick={() => selectFilter(filter.id)}
          aria-pressed={filter.id === activeId}
          style={
            filter.id === activeId
              ? { background: CARD_CREAM, borderColor: CARD_CREAM, color: color.ink.default }
              : { borderColor: 'transparent' }
          }
        >
          {filter.label}
        </Button>
      ))}
    </div>
  )

  return (
    // The file's 32 from the pill row down to the grid.
    <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? space.xl : '32px' }}>
      {pills}
      <div
        key={activeId}
        className="tab-content-in"
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
    </div>
  )
}

/** One cell: the art box linking to the case study, caption and pills below. */
function WorkCardCell({ card }: { card: WorkCard }) {
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
              lineHeight: 1.6,
              letterSpacing: '-0.16px',
              color: color.text.muted,
            }}
          >
            {card.subtitle}
          </p>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: space.sm }}>
          <CardPill palette="secondary" href={card.href}>
            Case study
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
