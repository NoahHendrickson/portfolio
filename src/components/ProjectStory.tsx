import { ArrowLeft, ArrowSquareOut } from '@phosphor-icons/react'
import Header from './Header'
import { VARIANTS } from '../design-system/buttonStyles'
import { control, radius, space, type } from '../design-system/tokens'
import { useIsMobile } from '../hooks/useIsMobile'
import type { Feature, FeedbackShot, LandingShot, Project, Split } from '../data/projects'

const PAGE_BG = 'var(--color-bg-primary)'
const TEXT = 'var(--color-text-primary)'
const ORANGE = 'var(--color-orange)'
/** The outro card is orange in both themes, so its pill stays light-on-orange. */
const PILL_BG = 'var(--color-bg-inverse)'
const PILL_TEXT = 'var(--color-text-inverse)'
const MUTED = 'var(--color-text-muted)'
const BODY_TEXT = 'var(--color-text-secondary)'
const BORDER = 'var(--color-border-subtle)'
/** Screenshot chrome, not theme surface — these are the browser frame's own colours. */
const FRAME_BORDER = '#373737'
const FRAME_BG = '#202124'
/**
 * The feedback wall was a white panel holding dark chat screenshots. On the dark
 * shell that inverts: the wall is a raised surface and each card takes a hairline
 * so it still separates from it, whatever fill the shot asks for.
 */
const WALL_BG = 'var(--color-bg-raised)'
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
        background: PAGE_BG,
        color: TEXT,
        padding: isMobile ? '0 20px 60px' : '0 80px 120px',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-3xl)',
      }}
    >
      <Header active="work" barInset="0" contentInset="0" showProfile={false} />

      {/*
        Styled as the design system's ghost pill so it reads the same as the
        Design tab's controls, but kept an anchor — `Button` renders a <button>,
        and nesting one inside a link is invalid. The palette is pulled from
        `buttonStyles` rather than restated, so the two can't drift.
      */}
      <a
        href="#/work"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: space.sm,
          height: control.sm,
          boxSizing: 'border-box',
          padding: `0 ${space.lg}`,
          width: 'fit-content',
          borderRadius: radius.full,
          border: `1px solid ${VARIANTS.ghost.default.borderColor}`,
          background: VARIANTS.ghost.default.background,
          color: VARIANTS.ghost.default.color,
          fontSize: type['label-m'].fontSize,
          fontWeight: type['label-m'].fontWeight,
          lineHeight: type['label-m'].lineHeight,
          textDecoration: 'none',
        }}
      >
        <ArrowLeft size={16} />
        Back
      </a>

      <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? '64px' : '80px' }}>
        {/* Hero — title block beside the app */}
        <div
          style={
            isMobile
              ? { display: 'flex', flexDirection: 'column', gap: 'var(--space-2xl)' }
              : splitStyle(landing.hero.split, landing.hero.alignEnd)
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
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

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xl)' }}>
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
          <section style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2xl)' }}>
            <SectionCopy heading={landing.feedback.heading} body={landing.feedback.body} />

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
          {landing.outro.heading}
        </h2>

        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', flexWrap: 'wrap' }}>
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
    borderRadius: 'var(--radius-md)',
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
          ? { display: 'flex', flexDirection: 'column', gap: 'var(--space-2xl)' }
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
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
