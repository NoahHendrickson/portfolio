import { ArrowSquareOut } from '@phosphor-icons/react'
import { useIsMobile } from '../hooks/useIsMobile'
import {
  BODY_TEXT,
  BORDER,
  CARD_BG,
  COMPOSITION,
  FRAME_BG,
  FRAME_BORDER,
  MUTED,
  ORANGE,
  OVERLAY_BORDER,
  PILL_BG,
  PILL_TEXT,
  TEXT,
  WALL_BG,
  pct,
} from './storyStyles'
import type { Feature, FeedbackShot, Landing, LandingShot, Project } from '../data/projects'

/**
 * Pieces shared by the three `ProjectStory` layouts (`StorySplit`,
 * `StoryCentered`, `StoryGallery`). The layouts decide composition; everything
 * that should look identical across them — screenshot frames, the stat band,
 * the feedback wall, the closing card — lives here so it can't drift. Colours
 * and geometry are in `storyStyles.ts`.
 */

/**
 * A screenshot in its designed frame. The image runs at the box's full width and
 * is clipped by the aspect box, so a full-page capture shows its top. `uncropped`
 * drops the aspect box and lets the shot run at its natural height — what the
 * gallery layout uses so a hero shows the whole app.
 */
export function ShotFrame({
  shot,
  uncropped,
  style,
}: {
  shot: LandingShot
  uncropped?: boolean
  style?: React.CSSProperties
}) {
  const framed = shot.frame === 'chrome' || shot.frame === 'border'

  return (
    <div
      style={{
        border: framed
          ? `${shot.frame === 'border' ? '2px' : '0.57px'} solid ${FRAME_BORDER}`
          : undefined,
        borderRadius: framed ? '9px' : '8px',
        overflow: 'hidden',
        background: FRAME_BG,
        display: 'flex',
        flexDirection: 'column',
        ...style,
      }}
    >
      {shot.frame === 'chrome' && (
        <img src="/work/browser-bar.png" alt="" style={{ width: '100%', height: 'auto', display: 'block' }} />
      )}
      {uncropped ? (
        <img src={shot.src} alt={shot.alt} style={{ width: '100%', height: 'auto', display: 'block' }} />
      ) : (
        <div style={{ width: '100%', aspectRatio: shot.aspect, overflow: 'hidden' }}>
          <img src={shot.src} alt={shot.alt} style={{ width: '100%', height: 'auto', display: 'block' }} />
        </div>
      )}
    </div>
  )
}

/**
 * A feature's screenshot, with the sort-panel hanging off its bottom-right when
 * the feature has an overlay. Too narrow to hang it off the side on mobile, so
 * there it tucks under the corner instead.
 */
export function FeatureMedia({ feature }: { feature: Feature }) {
  const isMobile = useIsMobile()

  const overlayStyle: React.CSSProperties = {
    display: 'block',
    border: `1px solid ${OVERLAY_BORDER}`,
    borderRadius: 'var(--radius-md)',
    boxShadow: '0px 8px 12px 6px rgba(0,0,0,0.15), 0px 4px 4px 0px rgba(0,0,0,0.3)',
  }

  if (!feature.overlay) return <ShotFrame shot={feature.shot} />

  if (isMobile) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <ShotFrame shot={feature.shot} />
        <img
          src={feature.overlay.src}
          alt={feature.overlay.alt}
          style={{ ...overlayStyle, width: '70%', marginTop: '-40px', marginLeft: 'auto' }}
        />
      </div>
    )
  }

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <ShotFrame shot={feature.shot} style={{ width: pct(COMPOSITION.base, COMPOSITION.width) }} />
      <img
        src={feature.overlay.src}
        alt={feature.overlay.alt}
        style={{
          ...overlayStyle,
          position: 'absolute',
          left: pct(COMPOSITION.overlayLeft, COMPOSITION.width),
          top: pct(COMPOSITION.overlayTop, COMPOSITION.height),
          width: pct(COMPOSITION.width - COMPOSITION.overlayLeft, COMPOSITION.width),
          aspectRatio: feature.overlay.aspect,
          objectFit: 'cover',
        }}
      />
    </div>
  )
}

export function SectionCopy({
  heading,
  body,
  align = 'left',
}: {
  heading: string
  body: string
  align?: 'left' | 'center'
}) {
  const isMobile = useIsMobile()
  const centered = align === 'center' && !isMobile

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-lg)',
        alignItems: centered ? 'center' : undefined,
        textAlign: centered ? 'center' : undefined,
      }}
    >
      <h2
        style={{
          margin: 0,
          maxWidth: '800px',
          fontSize: isMobile ? '24px' : 'clamp(26px, 2.6vw, 34px)',
          fontWeight: 500,
          lineHeight: 1.2,
          letterSpacing: '-0.01em',
        }}
      >
        {heading}
      </h2>
      <p
        style={{
          margin: 0,
          maxWidth: '720px',
          fontSize: isMobile ? '16px' : '18px',
          lineHeight: 1.4,
          color: BODY_TEXT,
        }}
      >
        {body}
      </p>
    </div>
  )
}

/**
 * The three numbers already written for each project in `projects.ts`. They were
 * only rendered by the generic `ProjectLanding` before; a product page wants them
 * up near the top.
 */
export function StatBand({
  stats,
  align = 'left',
}: {
  stats: Project['stats']
  align?: 'left' | 'center'
}) {
  const isMobile = useIsMobile()

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : `repeat(${stats.length}, minmax(0, 1fr))`,
        gap: isMobile ? '24px' : '32px',
        padding: isMobile ? '24px 0' : '32px 0',
        borderTop: `1px solid ${BORDER}`,
        borderBottom: `1px solid ${BORDER}`,
      }}
    >
      {stats.map((stat) => (
        <div
          key={stat.label}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
            alignItems: align === 'center' && !isMobile ? 'center' : undefined,
            textAlign: align === 'center' && !isMobile ? 'center' : undefined,
          }}
        >
          <span
            style={{
              fontSize: isMobile ? '30px' : 'clamp(30px, 3vw, 40px)',
              fontWeight: 500,
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
              color: TEXT,
            }}
          >
            {stat.value}
          </span>
          <span style={{ fontSize: '14px', lineHeight: 1.4, color: MUTED }}>{stat.label}</span>
        </div>
      ))}
    </div>
  )
}

export function FeedbackWall({ feedback }: { feedback: NonNullable<Landing['feedback']> }) {
  const isMobile = useIsMobile()

  return (
    <div
      style={{
        background: WALL_BG,
        border: `1px solid ${BORDER}`,
        borderRadius: 'var(--radius-2xl)',
        padding: isMobile ? '16px' : '24px',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'center',
        gap: isMobile ? '16px' : '24px',
      }}
    >
      {feedback.shots.map((shot) => (
        <FeedbackCard key={shot.src} shot={shot} />
      ))}
    </div>
  )
}

function FeedbackCard({ shot }: { shot: FeedbackShot }) {
  const isMobile = useIsMobile()

  return (
    <div
      style={{
        width: isMobile ? '100%' : `${shot.width}px`,
        maxWidth: '100%',
        background: shot.bg ?? CARD_BG,
        border: `1px solid ${BORDER}`,
        borderRadius: 'var(--radius-xl)',
        padding: `${shot.pad ?? 16}px`,
      }}
    >
      <div style={{ width: '100%', aspectRatio: shot.aspect, borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
        <img
          src={shot.src}
          alt={shot.alt}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: shot.position,
            display: 'block',
          }}
        />
      </div>
    </div>
  )
}

export function OutroCard({ outro }: { outro: Landing['outro'] }) {
  const isMobile = useIsMobile()

  return (
    <div
      style={{
        background: ORANGE,
        borderRadius: isMobile ? 'var(--radius-3xl)' : 'var(--radius-4xl)',
        padding: isMobile ? '32px 24px' : '56px 60px',
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        alignItems: isMobile ? 'flex-start' : 'center',
        justifyContent: 'space-between',
        gap: isMobile ? '28px' : '40px',
        // Deeper than the cream page's shadow — a 14%-black drop is invisible
        // against #171615.
        boxShadow: '0px 32px 64px -12px rgba(0,0,0,0.5), 0px 5px 5px -2.5px rgba(0,0,0,0.3)',
      }}
    >
      <h2
        style={{
          margin: 0,
          maxWidth: '640px',
          fontSize: isMobile ? '26px' : 'clamp(30px, 3vw, 40px)',
          fontWeight: 500,
          lineHeight: 1.15,
          letterSpacing: '-0.01em',
          color: '#ffffff',
          textWrap: 'balance',
        }}
      >
        {outro.heading}
      </h2>

      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', flexWrap: 'wrap' }}>
        {outro.command && <Pill>{outro.command}</Pill>}
        {outro.links?.map((link) => (
          <Pill key={link.href} href={link.href}>
            {link.label}
            <ArrowSquareOut size={isMobile ? 20 : 24} />
          </Pill>
        ))}
      </div>
    </div>
  )
}

/** Cream pill in the closing card — a link when it has an `href`, static copy otherwise. */
export function Pill({ href, children }: { href?: string; children: React.ReactNode }) {
  const isMobile = useIsMobile()

  const style: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: isMobile ? '10px' : '16px',
    background: PILL_BG,
    color: PILL_TEXT,
    padding: isMobile ? '10px 18px' : '12px 24px',
    borderRadius: 'var(--radius-full)',
    fontSize: isMobile ? '16px' : '20px',
    fontWeight: 500,
    lineHeight: 1.5,
    textDecoration: 'none',
    whiteSpace: 'nowrap',
  }

  if (!href) return <span style={style}>{children}</span>

  return (
    <a href={href} target="_blank" rel="noopener noreferrer" style={style}>
      {children}
    </a>
  )
}

/**
 * The project's own repo / package links, as quiet outline pills. Only the
 * centered layout uses them up top; every layout still closes on `OutroCard`.
 */
export function LinkRow({ links, align = 'left' }: { links: Project['links']; align?: 'left' | 'center' }) {
  const isMobile = useIsMobile()

  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 'var(--space-sm)',
        justifyContent: align === 'center' && !isMobile ? 'center' : undefined,
      }}
    >
      {links.map((link) => (
        <a
          key={link.href}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 'var(--space-sm)',
            height: 'var(--control-md)',
            boxSizing: 'border-box',
            padding: '0 var(--space-xl)',
            borderRadius: 'var(--radius-full)',
            border: `1px solid var(--color-border-default)`,
            color: TEXT,
            fontSize: '14px',
            fontWeight: 500,
            textDecoration: 'none',
            whiteSpace: 'nowrap',
          }}
        >
          {link.label}
          <ArrowSquareOut size={16} />
        </a>
      ))}
    </div>
  )
}
