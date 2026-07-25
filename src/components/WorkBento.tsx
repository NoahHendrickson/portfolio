import { ArrowUpRight } from '@untitledui/icons/ArrowUpRight'
import { projects } from '../data/projects'
import { useIsMobile } from '../hooks/useIsMobile'

const CARD_BG = '#dadada'
const TEXT_DARK = 'var(--color-ink)'
const TEXT_MUTED = 'var(--color-ink-secondary)'
const TEXT_FAINT = 'var(--color-ink-muted)'
const ORANGE = 'var(--color-orange)'

/** Which slot a card fills — drives padding, image placement and title size. */
type Variant = 'wide' | 'compact' | 'tall'

type Slug = keyof typeof projects

// The left column stacks the wide card over two compact ones; the right column is a
// single tall card. Column and row ratios come straight from the bento in Figma
// (673.84:514.49 columns, 343:294.2 rows), which is why they read as odd numbers.
const WIDE: Slug = 'forge'
const COMPACT: Slug[] = ['stat-builder', 'armory']
const TALL: Slug = 'phanttom'

export default function WorkBento() {
  const isMobile = useIsMobile()

  // Mobile drops the grid and stacks every card in the desktop reading order, all using
  // the compact image-over-text layout.
  if (isMobile) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
        {[WIDE, TALL, ...COMPACT].map((slug) => (
          <BentoCard key={slug} slug={slug} variant="compact" />
        ))}
      </div>
    )
  }

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '673.84fr 514.49fr',
        gap: 'var(--space-xl)',
        height: '100%',
        minHeight: '460px',
      }}
    >
      <div style={{ display: 'grid', gridTemplateRows: '343fr 294.2fr', gap: 'var(--space-xl)', minHeight: 0 }}>
        <BentoCard slug={WIDE} variant="wide" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 'var(--space-xl)', minHeight: 0 }}>
          {COMPACT.map((slug) => (
            <BentoCard key={slug} slug={slug} variant="compact" />
          ))}
        </div>
      </div>
      <BentoCard slug={TALL} variant="tall" />
    </div>
  )
}

function BentoCard({ slug, variant }: { slug: Slug; variant: Variant }) {
  const isMobile = useIsMobile()
  const project = projects[slug]
  const { cover, tagline, note } = project.bento

  // Projects whose page isn't designed yet show the card but go nowhere. An anchor
  // with no href isn't focusable or clickable, and dropping the hover lift and the
  // arrow keeps the card from promising a destination it doesn't have.
  const linked = project.pageReady === true

  const padding = variant === 'compact' ? 24 : 32
  const image = (
    <img
      src={cover}
      alt={`${project.title} screenshot`}
      draggable={false}
      style={{
        width: '100%',
        // Mobile has no fixed card height, so screenshots run at their natural ratio
        // rather than being cropped into the desktop card's box.
        height: isMobile ? 'auto' : '100%',
        objectFit: 'cover',
        objectPosition: 'left top',
        display: 'block',
        pointerEvents: 'none',
      }}
    />
  )

  return (
    <a
      href={linked ? `#/work/${project.slug}` : undefined}
      className={linked ? 'bento-card' : undefined}
      style={{
        position: 'relative',
        display: 'flex',
        // The wide card sits its text beside the image; the others stack.
        flexDirection: variant === 'wide' ? 'row' : 'column',
        alignItems: variant === 'wide' ? 'stretch' : undefined,
        justifyContent: variant === 'tall' ? 'space-between' : variant === 'compact' ? 'flex-end' : undefined,
        gap: 'var(--space-lg)',
        height: isMobile ? undefined : '100%',
        minHeight: isMobile ? undefined : '150px',
        padding: isMobile ? '20px' : `${padding}px`,
        borderRadius: isMobile ? 'var(--radius-2xl)' : 'var(--radius-3xl)',
        background: CARD_BG,
        overflow: 'hidden',
        textDecoration: 'none',
        color: TEXT_DARK,
        transition: 'transform 200ms ease, box-shadow 200ms ease',
      }}
    >
      {/* Wide and tall cards bleed their screenshot off the right edge of the card, so
          only the left corners get rounded — the right pair is clipped away. */}
      {variant === 'wide' && (
        <div
          style={{
            flex: 1,
            // Rendered before the text block but painted after it, so text sits on the left.
            order: 2,
            minWidth: 0,
            marginRight: `-${padding}px`,
            borderRadius: 'var(--radius-md) 0 0 var(--radius-md)',
            overflow: 'hidden',
          }}
        >
          {image}
        </div>
      )}

      {variant === 'tall' && (
        <div
          style={{
            alignSelf: 'stretch',
            marginRight: `-${padding}px`,
            // 482.5 × 387 — the screenshot's size in Figma once clipped to the card edge.
            aspectRatio: '482.5 / 387',
            minHeight: 0,
            borderRadius: 'var(--radius-md) 0 0 var(--radius-md)',
            overflow: 'hidden',
          }}
        >
          {image}
        </div>
      )}

      {variant === 'compact' && (
        <div
          style={{
            flex: isMobile ? undefined : 1,
            minHeight: isMobile ? undefined : 0,
            width: '100%',
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
          }}
        >
          {image}
        </div>
      )}

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-md)',
          width: variant === 'wide' ? '243px' : undefined,
          flexShrink: 0,
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span
            style={{
              fontSize: '14px',
              fontWeight: 500,
              lineHeight: '21px',
              color: TEXT_MUTED,
            }}
          >
            {project.bento.eyebrow}
          </span>

          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
            <h3
              style={{
                margin: 0,
                fontSize: !isMobile && variant === 'tall' ? '34px' : '20px',
                fontWeight: 500,
                lineHeight: 1.25,
                letterSpacing: '-0.02em',
              }}
            >
              {project.title}
            </h3>
            {linked && (
              <span className="bento-arrow" style={{ display: 'inline-flex', color: ORANGE }}>
                <ArrowUpRight width={24} height={24} />
              </span>
            )}
          </div>
        </div>

        {tagline && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
            <p
              style={{
                margin: 0,
                fontSize: variant === 'tall' ? '17px' : '16px',
                fontWeight: 400,
                lineHeight: 1.4,
                color: TEXT_MUTED,
              }}
            >
              {tagline}
            </p>
            {note && (
              <p style={{ margin: 0, fontSize: '12px', fontWeight: 400, lineHeight: 1.4, color: TEXT_FAINT }}>
                {note}
              </p>
            )}
          </div>
        )}
      </div>
    </a>
  )
}
