import { ArrowRight } from '@phosphor-icons/react'
import AppLink from '../AppLink'
import { NO3Y_CARD, WORK_FILTERS, type WorkCard } from '../data/workCards'
import { VARIANTS } from '../design-system/buttonStyles'
import { color, control, radius, space, type } from '../design-system/tokens'
import { MOBILE_WIDTH_QUERY } from '../hooks/useIsMobile'
import { useMediaQuery } from '../hooks/useMediaQuery'

/**
 * Every project, one to a row, under the Hi tab's copy — the experiment that
 * replaces the Work tab (branch `experiment/home-project-column`). Each row is
 * the card's art at the panel's full width (1000, growing to 1400 on a big
 * screen; the copy stays 700);
 * on a screen with a mouse the title and a View pill rise over the art's foot on hover or keyboard focus
 * (`.home-project-*` in `index.css`). Touch has nothing to reveal it, so the
 * caption sits under the art instead.
 *
 * no3y Code leads, then the rest in All's order from the old Work tab
 * (`WORK_FILTERS[0]`).
 *
 * The art is never cropped into: the zoomed cards (D2 Conflux, Synapse) show
 * their whole export (`art.whole`), and no3y Code shows its project page's
 * hero shot — the whole window centred on the wallpaper — at that shot's own
 * ratio, rather than the card cut that runs the window off the foot.
 */

const HOVER_QUERY = '(hover: hover) and (pointer: fine)'

const CARDS: WorkCard[] = [NO3Y_CARD, ...WORK_FILTERS[0].cards.filter((card) => card !== NO3Y_CARD)]

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

export default function HomeProjects() {
  const canHover = useMediaQuery(HOVER_QUERY)

  return (
    <section aria-label="Projects" style={{ display: 'flex', flexDirection: 'column', gap: space['3xl'] }}>
      {CARDS.map((card) => (
        <ProjectRow key={card.href} card={card} peek={canHover} />
      ))}
    </section>
  )
}

function ProjectRow({ card, peek }: { card: WorkCard; peek: boolean }) {
  const art = rowArt(card)
  return (
    // The whole row is the link, so the View pill is a label inside it rather
    // than a second control.
    <AppLink
      href={card.href}
      className="home-project"
      aria-label={`${card.title} — ${card.subtitle}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: space.lg,
        textDecoration: 'none',
        color: 'inherit',
        borderRadius: CARD_RADIUS,
      }}
    >
      <div
        style={{
          position: 'relative',
          overflow: 'hidden',
          borderRadius: CARD_RADIUS,
          // The art's own box, so it never crops.
          aspectRatio: art.aspect,
        }}
      >
        <div style={{ position: 'absolute', inset: 0 }}>
          <img
            src={art.src}
            srcSet={art.srcSet}
            sizes={art.srcSet ? `auto, ${MOBILE_WIDTH_QUERY} 100vw, 1400px` : undefined}
            alt={art.alt}
            loading="lazy"
            decoding="async"
            style={{ display: 'block', width: '100%', height: '100%', objectFit: 'cover' }}
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
              left: space.md,
              right: space.md,
              bottom: space.md,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: space.lg,
              padding: `${space.md} ${space.md} ${space.md} ${space.lg}`,
              // 12 against the card's 16: strictly concentric would be 4, which
              // reads as squared off this close to the card's curve.
              borderRadius: radius.lg,
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

      {!peek && <Caption card={card} />}
    </AppLink>
  )
}

function Caption({ card, onScrim = false }: { card: WorkCard; onScrim?: boolean }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
      <span style={{ ...type['body-l'], fontWeight: 500, color: color.text.primary }}>{card.title}</span>
      <span
        style={{
          ...type['body-m'],
          // Secondary over the scrim, where muted would sink into the art.
          color: onScrim ? color.text.secondary : color.text.muted,
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
