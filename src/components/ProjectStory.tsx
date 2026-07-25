import { ArrowNarrowLeft } from '@untitledui/icons/ArrowNarrowLeft'
import Header from './Header'
import { useIsMobile } from '../hooks/useIsMobile'
import type { Feature, FeedbackShot, LandingShot, Project, Split } from '../data/projects'

const CREAM_BG = '#f5efe0'
const TEXT_DARK = '#0f0e0e'
const ORANGE = 'var(--color-orange)'
const BUTTON_LIGHT = '#ecede6'
const MUTED = 'rgba(15,14,14,0.35)'
const BODY_TEXT = 'rgba(15,14,14,0.72)'
const FRAME_BORDER = '#373737'
const FRAME_BG = '#202124'
const WALL_BG = '#ffffff'
const CARD_BG = '#1a191e'
const OVERLAY_BORDER = '#3358c1'

/** Content width the Figma file's column measurements were taken at. */
const CONTENT_WIDTH = 1328

/**
 * The one overlapping composition in the file: a 700px browser frame with the
 * 258px sort panel hanging off its bottom-right, 797px wide overall. Everything
 * is a share of that box, so the overlap survives being scaled down.
 */
const COMPOSITION = { width: 797, base: 700, overlayLeft: 539, overlayTop: 67, height: 434 }
const pct = (px: number, of: number) => `${(px / of) * 100}%`

/**
 * Two columns in the ratio Figma has them, with the leftover width as the gap —
 * so copy, shot and gutter all scale together.
 */
function splitStyle(split: Split, alignEnd?: boolean): React.CSSProperties {
  return {
    display: 'grid',
    gridTemplateColumns: `${split.copy}fr ${split.shot}fr`,
    columnGap: pct(CONTENT_WIDTH - split.copy - split.shot, CONTENT_WIDTH),
    alignItems: alignEnd ? 'end' : 'start',
  }
}

/**
 * Screenshot-led project landing (`#/work/<slug>` for any project with a
 * `landing` in `src/data/projects.ts`). The generic `ProjectLanding` — stats
 * row, section rail, stack and status — still serves everything else.
 */
export default function ProjectStory({ project }: { project: Project }) {
  const isMobile = useIsMobile()
  const landing = project.landing
  if (!landing) return null

  const heroBody = landing.hero.body ?? [project.summary]

  return (
    <div
      style={{
        minHeight: '100vh',
        background: CREAM_BG,
        color: TEXT_DARK,
        padding: isMobile ? '0 20px 60px' : '0 80px 120px',
        display: 'flex',
        flexDirection: 'column',
        gap: '40px',
      }}
    >
      <Header active="work" barInset="0" contentInset="0" showProfile={false} />

      <a
        href="#/work"
        style={{
          color: ORANGE,
          fontSize: '16px',
          fontWeight: 500,
          textDecoration: 'none',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          width: 'fit-content',
        }}
      >
        <ArrowNarrowLeft width={16} height={16} />
        Back
      </a>

      <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? '64px' : '80px' }}>
        {/* Hero — title block beside the app */}
        <div
          style={
            isMobile
              ? { display: 'flex', flexDirection: 'column', gap: '28px' }
              : splitStyle(landing.hero.split, landing.hero.alignEnd)
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <p
              style={{
                margin: 0,
                fontSize: '16px',
                fontWeight: 500,
                lineHeight: '24px',
                color: MUTED,
              }}
            >
              {landing.eyebrow}
            </p>

            <h1
              style={{
                margin: 0,
                fontSize: isMobile ? '34px' : 'clamp(40px, 4vw, 56px)',
                fontWeight: 600,
                lineHeight: 1.1,
                letterSpacing: '-0.029em',
              }}
            >
              {project.title}
            </h1>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {heroBody.map((paragraph) => (
                <p
                  key={paragraph}
                  style={{ margin: 0, fontSize: '16px', fontWeight: 400, lineHeight: 1.4, color: BODY_TEXT }}
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          <ShotFrame shot={landing.hero.shot} />
        </div>

        {landing.features.map((feature) => (
          <FeatureBlock key={feature.heading} feature={feature} />
        ))}

        {landing.feedback && (
          <section style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <SectionCopy heading={landing.feedback.heading} body={landing.feedback.body} />

            <div
              style={{
                background: WALL_BG,
                borderRadius: '24px',
                padding: isMobile ? '16px' : '24px',
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'center',
                gap: isMobile ? '16px' : '24px',
              }}
            >
              {landing.feedback.shots.map((shot) => (
                <FeedbackCard key={shot.src} shot={shot} />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Closing card */}
      <div
        style={{
          marginTop: isMobile ? '16px' : '56px',
          background: ORANGE,
          borderRadius: isMobile ? '32px' : '56px',
          padding: isMobile ? '32px 24px' : '56px 60px',
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          alignItems: isMobile ? 'flex-start' : 'center',
          justifyContent: 'space-between',
          gap: isMobile ? '28px' : '40px',
          boxShadow: '0px 32px 64px -12px rgba(0,0,0,0.14), 0px 5px 5px -2.5px rgba(0,0,0,0.04)',
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
          {landing.outro.heading}
        </h2>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {landing.outro.command && <Pill>{landing.outro.command}</Pill>}

          {landing.outro.links?.map((link) => (
            <Pill key={link.href} href={link.href}>
              {link.label}
              <ArrowSquareOut size={isMobile ? 20 : 24} />
            </Pill>
          ))}
        </div>
      </div>
    </div>
  )
}

/** Copy beside a screenshot, with the sort-panel overlap when the feature has one. */
function FeatureBlock({ feature }: { feature: Feature }) {
  const isMobile = useIsMobile()

  const overlayStyle: React.CSSProperties = {
    display: 'block',
    border: `1px solid ${OVERLAY_BORDER}`,
    borderRadius: '8px',
    boxShadow: '0px 8px 12px 6px rgba(0,0,0,0.15), 0px 4px 4px 0px rgba(0,0,0,0.3)',
  }

  let shot = <ShotFrame shot={feature.shot} />

  if (feature.overlay) {
    shot = isMobile ? (
      // Too narrow to hang the panel off the side, so it tucks under the corner.
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {shot}
        <img
          src={feature.overlay.src}
          alt={feature.overlay.alt}
          style={{ ...overlayStyle, width: '70%', marginTop: '-40px', marginLeft: 'auto' }}
        />
      </div>
    ) : (
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

  return (
    <section
      style={
        isMobile
          ? { display: 'flex', flexDirection: 'column', gap: '32px' }
          : splitStyle(feature.split)
      }
    >
      <SectionCopy heading={feature.heading} body={feature.body} />
      {shot}
    </section>
  )
}

function SectionCopy({ heading, body }: { heading: string; body: string }) {
  const isMobile = useIsMobile()

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
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
      <p style={{ margin: 0, maxWidth: '720px', fontSize: isMobile ? '16px' : '18px', lineHeight: 1.4 }}>
        {body}
      </p>
    </div>
  )
}

/**
 * A screenshot in its designed frame. The image runs at the box's full width and
 * is clipped by the aspect box, so a full-page capture shows its top.
 */
function ShotFrame({ shot, style }: { shot: LandingShot; style?: React.CSSProperties }) {
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
        <img
          src="/work/browser-bar.png"
          alt=""
          style={{ width: '100%', height: 'auto', display: 'block' }}
        />
      )}
      <div style={{ width: '100%', aspectRatio: shot.aspect, overflow: 'hidden' }}>
        <img src={shot.src} alt={shot.alt} style={{ width: '100%', height: 'auto', display: 'block' }} />
      </div>
    </div>
  )
}

/** Cream pill in the closing card — a link when it has an `href`, static copy otherwise. */
function Pill({ href, children }: { href?: string; children: React.ReactNode }) {
  const isMobile = useIsMobile()

  const style: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: isMobile ? '10px' : '16px',
    background: BUTTON_LIGHT,
    color: TEXT_DARK,
    padding: isMobile ? '10px 18px' : '12px 24px',
    borderRadius: '1000px',
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

function FeedbackCard({ shot }: { shot: FeedbackShot }) {
  const isMobile = useIsMobile()

  return (
    <div
      style={{
        width: isMobile ? '100%' : `${shot.width}px`,
        maxWidth: '100%',
        background: shot.bg ?? CARD_BG,
        borderRadius: '16px',
        padding: `${shot.pad ?? 16}px`,
      }}
    >
      <div style={{ width: '100%', aspectRatio: shot.aspect, borderRadius: '8px', overflow: 'hidden' }}>
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

/** ArrowSquareOut, exported from the Figma file — duotone, so it isn't in @untitledui/icons. */
function ArrowSquareOut({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        opacity="0.2"
        d="M17.25 7.5V19.5C17.25 19.6989 17.171 19.8897 17.0303 20.0303C16.8897 20.171 16.6989 20.25 16.5 20.25H4.5C4.30109 20.25 4.11032 20.171 3.96967 20.0303C3.82902 19.8897 3.75 19.6989 3.75 19.5V7.5C3.75 7.30109 3.82902 7.11032 3.96967 6.96967C4.11032 6.82902 4.30109 6.75 4.5 6.75H16.5C16.6989 6.75 16.8897 6.82902 17.0303 6.96967C17.171 7.11032 17.25 7.30109 17.25 7.5Z"
        fill="currentColor"
      />
      <path
        d="M21 9.75C21 9.94891 20.921 10.1397 20.7803 10.2803C20.6397 10.421 20.4489 10.5 20.25 10.5C20.0511 10.5 19.8603 10.421 19.7197 10.2803C19.579 10.1397 19.5 9.94891 19.5 9.75V5.56125L13.2816 11.7806C13.1408 11.9214 12.95 12.0004 12.7509 12.0004C12.5519 12.0004 12.361 11.9214 12.2203 11.7806C12.0796 11.6399 12.0005 11.449 12.0005 11.25C12.0005 11.051 12.0796 10.8601 12.2203 10.7194L18.4387 4.5H14.25C14.0511 4.5 13.8603 4.42098 13.7197 4.28033C13.579 4.13968 13.5 3.94891 13.5 3.75C13.5 3.55109 13.579 3.36032 13.7197 3.21967C13.8603 3.07902 14.0511 3 14.25 3H20.25C20.4489 3 20.6397 3.07902 20.7803 3.21967C20.921 3.36032 21 3.55109 21 3.75V9.75ZM17.25 12C17.0511 12 16.8603 12.079 16.7197 12.2197C16.579 12.3603 16.5 12.5511 16.5 12.75V19.5H4.5V7.5H11.25C11.4489 7.5 11.6397 7.42098 11.7803 7.28033C11.921 7.13968 12 6.94891 12 6.75C12 6.55109 11.921 6.36032 11.7803 6.21967C11.6397 6.07902 11.4489 6 11.25 6H4.5C4.10218 6 3.72064 6.15804 3.43934 6.43934C3.15804 6.72064 3 7.10218 3 7.5V19.5C3 19.8978 3.15804 20.2794 3.43934 20.5607C3.72064 20.842 4.10218 21 4.5 21H16.5C16.8978 21 17.2794 20.842 17.5607 20.5607C17.842 20.2794 18 19.8978 18 19.5V12.75C18 12.5511 17.921 12.3603 17.7803 12.2197C17.6397 12.079 17.4489 12 17.25 12Z"
        fill="currentColor"
      />
    </svg>
  )
}
