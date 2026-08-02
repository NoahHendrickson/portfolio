import { useState } from 'react'
import { ArrowSquareOut } from '@phosphor-icons/react'
import { VARIANTS } from '../../design-system/buttonStyles'
import { control, radius, space, type } from '../../design-system/tokens'
import { useIsMobile } from '../../hooks/useIsMobile'
import type { FeedbackShot, Landing, LandingShot } from '../../data/projects'
import type { Feature } from './content'
import {
  APP_HREF,
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
  QUOTES,
  REPO_HREF,
  TEXT,
  WALL_BG,
  pct,
} from './styles'

/**
 * Pieces shared by the four D2 Stat Builder showcase layouts. Layouts own
 * composition; anything that should look identical across them lives here.
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

/** Table shot with the sort panel hanging off the bottom-right. */
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

/** Primary / ghost anchors styled like the design-system buttons. */
export function CtaRow({ align = 'left', size = 'md' }: { align?: 'left' | 'center'; size?: 'sm' | 'md' }) {
  const isMobile = useIsMobile()
  const centered = align === 'center' && !isMobile

  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: space.sm,
        justifyContent: centered ? 'center' : undefined,
      }}
    >
      <LinkPill href={APP_HREF} variant="primary" size={size}>
        Open app
        <ArrowSquareOut size={size === 'sm' ? 14 : 16} />
      </LinkPill>
      <LinkPill href={REPO_HREF} variant="ghost" size={size}>
        GitHub
      </LinkPill>
    </div>
  )
}

function LinkPill({
  href,
  variant,
  size,
  children,
}: {
  href: string
  variant: 'primary' | 'ghost'
  size: 'sm' | 'md'
  children: React.ReactNode
}) {
  const [hovered, setHovered] = useState(false)
  const palette = VARIANTS[variant][hovered ? 'hover' : 'default']
  const sizing =
    size === 'sm'
      ? { height: control.sm, pad: space.lg, text: type['label-m'], gap: space.sm }
      : { height: control.md, pad: space.xl, text: type['label-l'], gap: space.sm }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: sizing.gap,
        height: sizing.height,
        boxSizing: 'border-box',
        padding: `0 ${sizing.pad}`,
        borderRadius: radius.full,
        border: `1px solid ${palette.borderColor}`,
        background: palette.background,
        color: palette.color,
        fontSize: sizing.text.fontSize,
        fontWeight: sizing.text.fontWeight,
        lineHeight: sizing.text.lineHeight,
        textDecoration: 'none',
        transition: 'background 120ms ease, border-color 120ms ease',
      }}
    >
      {children}
    </a>
  )
}

export function BrandMark({ size = 28 }: { size?: number }) {
  return (
    <img
      src="/work/logos/stat-builder.png"
      alt=""
      width={size}
      height={size}
      style={{ width: size, height: size, display: 'block', borderRadius: 6 }}
    />
  )
}

/** One or more pull quotes — text only, no chat-card chrome. */
export function QuoteStrip({ count = 1, align = 'left' }: { count?: 1 | 2 | 3; align?: 'left' | 'center' }) {
  const isMobile = useIsMobile()
  const centered = align === 'center' && !isMobile
  const items = QUOTES.slice(0, count)

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: isMobile || count === 1 ? '1fr' : `repeat(${count}, minmax(0, 1fr))`,
        gap: isMobile ? '28px' : '40px',
        padding: isMobile ? '28px 0' : '40px 0',
        borderTop: `1px solid ${BORDER}`,
        borderBottom: `1px solid ${BORDER}`,
        textAlign: centered ? 'center' : undefined,
      }}
    >
      {items.map((quote) => (
        <figure key={quote.text} style={{ margin: 0, display: 'flex', flexDirection: 'column', gap: space.md }}>
          <blockquote
            style={{
              margin: 0,
              fontSize: isMobile ? '18px' : count === 1 ? 'clamp(22px, 2.4vw, 28px)' : '18px',
              fontWeight: 500,
              lineHeight: 1.35,
              letterSpacing: '-0.01em',
              color: TEXT,
              textWrap: 'balance',
            }}
          >
            “{quote.text}”
          </blockquote>
          <figcaption style={{ fontSize: '13px', fontWeight: 500, color: MUTED }}>
            {quote.attribution}
          </figcaption>
        </figure>
      ))}
    </div>
  )
}

/** Quiet closing CTA — product pages end with an action, not a loud card. */
export function SoftClose({ heading = 'Try it on your vault.' }: { heading?: string } = {}) {
  const isMobile = useIsMobile()

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        alignItems: isMobile ? 'flex-start' : 'center',
        justifyContent: 'space-between',
        gap: isMobile ? '24px' : '40px',
        padding: isMobile ? '32px 0 0' : '48px 0 0',
        borderTop: `1px solid ${BORDER}`,
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: space.md, maxWidth: '520px' }}>
        <h2
          style={{
            margin: 0,
            fontSize: isMobile ? '24px' : 'clamp(26px, 2.8vw, 34px)',
            fontWeight: 500,
            lineHeight: 1.2,
            letterSpacing: '-0.02em',
          }}
        >
          {heading}
        </h2>
        <p style={{ margin: 0, fontSize: '16px', lineHeight: 1.5, color: BODY_TEXT }}>
          Sign in with Bungie. Read-only. Your account stays yours.
        </p>
      </div>
      <CtaRow />
    </div>
  )
}

export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p
      style={{
        margin: 0,
        fontSize: type.eyebrow.fontSize,
        fontWeight: type.eyebrow.fontWeight,
        lineHeight: type.eyebrow.lineHeight,
        letterSpacing: type.eyebrow.letterSpacing,
        textTransform: type.eyebrow.textTransform,
        color: MUTED,
      }}
    >
      {children}
    </p>
  )
}

/** Matches `ProjectStory` section copy — heading + body from `projects.ts`. */
export function SectionCopy({
  heading,
  body,
  align = 'left',
}: {
  heading: string
  body?: string
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
      {body && (
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
      )}
    </div>
  )
}

/** Original Discord screenshot wall from `landing.feedback`. */
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

/** Original orange closing card from `landing.outro`. */
export function OutroCard({ outro }: { outro: Landing['outro'] }) {
  const isMobile = useIsMobile()

  if (!outro) return null

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
        {outro.command && <OutroPill>{outro.command}</OutroPill>}
        {outro.links?.map((link) => (
          <OutroPill key={link.href} href={link.href}>
            {link.label}
            <ArrowSquareOut size={isMobile ? 20 : 24} />
          </OutroPill>
        ))}
      </div>
    </div>
  )
}

function OutroPill({ href, children }: { href?: string; children: React.ReactNode }) {
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
