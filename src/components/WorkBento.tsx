import { ArrowUpRight } from '@untitledui/icons/ArrowUpRight'
import { projects } from '../data/projects'
import { useIsMobile } from '../hooks/useIsMobile'

const CARD_BG = '#dadada'
const TEXT_DARK = '#0f0e0e'
const TEXT_MUTED = 'rgba(15,14,14,0.65)'
const TEXT_FAINT = 'rgba(15,14,14,0.4)'
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
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
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
        gap: '24px',
        height: '100%',
        minHeight: '460px',
      }}
    >
      <div style={{ display: 'grid', gridTemplateRows: '343fr 294.2fr', gap: '24px', minHeight: 0 }}>
        <BentoCard slug={WIDE} variant="wide" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '24px', minHeight: 0 }}>
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
      href={`#/work/${project.slug}`}
      className="bento-card"
      style={{
        position: 'relative',
        display: 'flex',
        // The wide card sits its text beside the image; the others stack.
        flexDirection: variant === 'wide' ? 'row' : 'column',
        alignItems: variant === 'wide' ? 'stretch' : undefined,
        justifyContent: variant === 'tall' ? 'space-between' : variant === 'compact' ? 'flex-end' : undefined,
        gap: '16px',
        height: isMobile ? undefined : '100%',
        minHeight: isMobile ? undefined : '150px',
        padding: isMobile ? '20px' : `${padding}px`,
        borderRadius: isMobile ? '24px' : '32px',
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
            borderRadius: '8px 0 0 8px',
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
            borderRadius: '8px 0 0 8px',
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
            borderRadius: '12px',
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
          gap: '10px',
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

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
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
            <span className="bento-arrow" style={{ display: 'inline-flex', color: ORANGE }}>
              <ArrowUpRight width={24} height={24} />
            </span>
          </div>
        </div>

        {tagline && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
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
