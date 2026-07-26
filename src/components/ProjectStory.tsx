import { ArrowLeft } from '@phosphor-icons/react'
import Header from './Header'
import { VARIANTS } from '../design-system/buttonStyles'
import { control, radius, space, type } from '../design-system/tokens'
import { useIsMobile } from '../hooks/useIsMobile'
import type {
  FeedbackShot,
  LandingShot,
  Project,
  ShotOverlay,
  StoryColumn,
  StorySection,
} from '../data/projects'

const PAGE_BG = 'var(--color-bg-primary)'
const TEXT = 'var(--color-text-primary)'
const ORANGE = 'var(--color-orange)'
/** The outro card is orange in both themes, so its pill stays light-on-orange. */
const PILL_BG = 'var(--color-bg-inverse)'
const PILL_TEXT = 'var(--color-text-inverse)'
const MUTED = 'var(--color-text-muted)'
const BODY_TEXT = 'var(--color-text-secondary)'
/**
 * The feedback band and the wall inside it are both a translucent lift, so they
 * stack into two steps off the shell exactly as the file has them.
 */
const TINT = 'var(--color-bg-tint)'
/** Screenshot chrome, not theme surface — these are the browser frame's own colours. */
const FRAME_BORDER = '#373737'
const FRAME_BG = '#202124'
const CARD_BG = '#1a191e'
const OVERLAY_BORDER = '#3358c1'

/** Page gutter, 120 of the file's 1512 frame. */
const GUTTER = 120
/** The content width inside those gutters, which every row width is measured against. */
const CONTENT_WIDTH = 1512 - GUTTER * 2

const pct = (px: number, of: number) => `${(px / of) * 100}%`

/**
 * The one overlapping composition in the file: a 409px browser frame with the
 * 175px sort panel hanging off its bottom-right, 471px wide overall — wider
 * than the column it sits in, so the panel overhangs into the trailing gutter.
 * Everything is a share of that box, so the overlap survives being scaled down.
 */
const COMPOSITION = {
  /** The group against its 409px column — the overhang past 100% is the panel. */
  column: pct(471.1, 409),
  width: 471.1,
  base: 408.9,
  overlayLeft: 296,
  overlayTop: 37.9,
  height: 252.8,
}

/**
 * Screenshot-led project landing (`#/work/<slug>` for any project with a
 * `landing` in `src/data/projects.ts`). The generic `ProjectLanding` — stats
 * row, section rail, stack and status — still serves everything else.
 *
 * The layout is the July 2026 file's story frames (D2 Stat Builder, Phanttom,
 * The Forge): a centered 688px title block, then centered screenshot rows —
 * captions under side-by-side shots, or beside a single one — on a 120px
 * gutter with 80px rows and the page container's own 24px gap between them.
 * Sections pad themselves rather than the page padding once, because the
 * feedback band's tint runs edge to edge.
 */
export default function ProjectStory({ project }: { project: Project }) {
  const isMobile = useIsMobile()
  const landing = project.landing
  if (!landing) return null

  const gutter = isMobile ? '20px' : `${GUTTER}px`
  const rowPad = isMobile ? '40px' : '80px'
  const heroBody = landing.hero.body ?? [project.summary]

  return (
    <div
      style={{
        minHeight: '100vh',
        background: PAGE_BG,
        color: TEXT,
        paddingBottom: isMobile ? '60px' : '76px',
        display: 'flex',
        flexDirection: 'column',
        gap: space.xl,
      }}
    >
      <Header active="work" showProfile={false} />

      {/*
        Not in the file's frames, kept deliberately. Styled as the design
        system's ghost pill so it reads the same as the Design tab's controls,
        but kept an anchor — `Button` renders a <button>, and nesting one inside
        a link is invalid. The palette is pulled from `buttonStyles` rather than
        restated, so the two can't drift.
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
          marginLeft: gutter,
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

      {/* Hero — a centered title block, the app window under it when the project has one */}
      <section
        style={{
          padding: `${rowPad} ${gutter}`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: isMobile ? space['2xl'] : space['5xl'],
        }}
      >
        <div style={{ width: '100%', maxWidth: '688px', display: 'flex', flexDirection: 'column', gap: space.lg }}>
          <p style={{ margin: 0, fontSize: '16px', fontWeight: 500, lineHeight: '24px', color: MUTED }}>
            {landing.eyebrow}
          </p>

          <h1
            style={{
              margin: 0,
              fontSize: isMobile ? '34px' : 'clamp(40px, 4vw, 56px)',
              fontWeight: 600,
              lineHeight: 'normal',
              letterSpacing: '-0.029em',
            }}
          >
            {project.title}
          </h1>

          <div style={{ display: 'flex', flexDirection: 'column', gap: space.lg }}>
            {heroBody.map((paragraph) => (
              <p
                key={paragraph}
                style={{ margin: 0, fontSize: '16px', fontWeight: 400, lineHeight: 'normal', color: BODY_TEXT }}
              >
                {paragraph}
              </p>
            ))}
          </div>
        </div>

        {landing.hero.shot && (
          <ShotFrame
            shot={landing.hero.shot}
            style={{ width: '100%', maxWidth: `${landing.hero.shotWidth ?? 718}px` }}
          />
        )}
      </section>

      {landing.sections.map((section) => (
        <StoryRow
          key={section.kind === 'columns' ? section.columns[0].shot.src : section.shot.src}
          section={section}
          gutter={gutter}
          rowPad={rowPad}
        />
      ))}

      {landing.feedback && (
        <section
          style={{
            background: TINT,
            padding: `${rowPad} ${gutter}`,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '40px',
          }}
        >
          <div style={{ width: '100%', maxWidth: '800px', display: 'flex', flexDirection: 'column', gap: space.lg }}>
            <h2
              style={{
                margin: 0,
                ...type['heading-l'],
                fontSize: isMobile ? '24px' : type['heading-l'].fontSize,
              }}
            >
              {landing.feedback.heading}
            </h2>
            <p style={{ margin: 0, maxWidth: '720px', fontSize: isMobile ? '16px' : '18px', lineHeight: 'normal' }}>
              {landing.feedback.body}
            </p>
          </div>

          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'center',
              gap: space.sm,
              width: isMobile ? '100%' : 'max-content',
              maxWidth: '100%',
              boxSizing: 'border-box',
            }}
          >
            {landing.feedback.shots.map((shot) => (
              <FeedbackCard key={shot.src} shot={shot} />
            ))}
          </div>
        </section>
      )}

      {/* Closing card — the file drops it to the bottom of a taller frame */}
      {landing.outro && (
        <section style={{ padding: `0 ${gutter}`, paddingTop: isMobile ? '24px' : '77px' }}>
          <div
            style={{
              background: ORANGE,
              borderRadius: isMobile ? radius['3xl'] : radius['4xl'],
              padding: isMobile ? '32px 24px' : '56px 60px',
              display: 'flex',
              flexDirection: isMobile ? 'column' : 'row',
              alignItems: isMobile ? 'flex-start' : 'center',
              justifyContent: 'space-between',
              gap: isMobile ? '28px' : '40px',
              // Deeper than the file's 14%-black drop, which is invisible against #171615.
              boxShadow: '0px 32px 64px -12px rgba(0,0,0,0.5), 0px 5px 5px -2.5px rgba(0,0,0,0.3)',
            }}
          >
            <h2
              style={{
                margin: 0,
                maxWidth: '640px',
                ...(landing.outro.large ? type['display-l'] : type['heading-l']),
                fontSize: isMobile
                  ? '24px'
                  : (landing.outro.large ? type['display-l'] : type['heading-l']).fontSize,
                color: '#ffffff',
                textWrap: 'balance',
              }}
            >
              {landing.outro.heading}
            </h2>

            <div style={{ display: 'flex', alignItems: 'center', gap: space.sm, flexWrap: 'wrap' }}>
              {landing.outro.command && <Pill>{landing.outro.command}</Pill>}

              {landing.outro.links?.map((link) => (
                <Pill key={link.href} href={link.href}>
                  {link.label}
                </Pill>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}

/**
 * One centered screenshot row. `columns` puts shots side by side with their
 * captions underneath; `row` seats a single shot beside its caption. Widths
 * are px at the file's 1272px content width, rendered as shares of it so the
 * whole group scales together.
 */
function StoryRow({ section, gutter, rowPad }: { section: StorySection; gutter: string; rowPad: string }) {
  const isMobile = useIsMobile()

  const total =
    section.kind === 'columns'
      ? section.columns.reduce((sum, c) => sum + c.width, 0) + section.gap * (section.columns.length - 1)
      : section.shotWidth + section.gap + section.captionWidth

  const row =
    section.kind === 'columns' ? (
      section.columns.map((column) => <ShotColumn key={column.shot.src} column={column} />)
    ) : (
      <>
        <ShotFrame shot={section.shot} />
        <Caption text={section.caption} large />
      </>
    )

  return (
    <section style={{ padding: `${rowPad} ${gutter}`, display: 'flex', justifyContent: 'center' }}>
      <div
        style={
          isMobile
            ? { display: 'flex', flexDirection: 'column', gap: space['2xl'], width: '100%' }
            : {
                display: 'grid',
                gridTemplateColumns:
                  section.kind === 'columns'
                    ? section.columns.map((c) => `${c.width}fr`).join(' ')
                    : `${section.shotWidth}fr ${section.captionWidth}fr`,
                columnGap: pct(section.gap, total),
                width: pct(total, CONTENT_WIDTH),
                alignItems: section.kind === 'columns' ? 'start' : 'center',
              }
        }
      >
        {row}
      </div>
    </section>
  )
}

/** A screenshot — or the sort-panel composition — with its caption underneath. */
function ShotColumn({ column }: { column: StoryColumn }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: space['2xl'] }}>
      {column.overlay ? (
        <OverlaidShot shot={column.shot} overlay={column.overlay} />
      ) : (
        <ShotFrame shot={column.shot} />
      )}
      <Caption text={column.caption} maxWidth={column.captionWidth} />
    </div>
  )
}

/** Caption copy — Body/L under the shot columns, the file's 18px beside a row shot. */
function Caption({ text, maxWidth, large }: { text: string | string[]; maxWidth?: number; large?: boolean }) {
  const paragraphs = Array.isArray(text) ? text : [text]

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: space.lg,
        maxWidth: maxWidth ? `${maxWidth}px` : undefined,
      }}
    >
      {paragraphs.map((paragraph) => (
        <p
          key={paragraph}
          style={{
            margin: 0,
            ...(large ? { fontSize: '18px', lineHeight: 'normal' } : type['body-l']),
          }}
        >
          {paragraph}
        </p>
      ))}
    </div>
  )
}

/** The browser frame with the sort panel hanging off its bottom-right corner. */
function OverlaidShot({ shot, overlay }: { shot: LandingShot; overlay: ShotOverlay }) {
  const isMobile = useIsMobile()

  const overlayStyle: React.CSSProperties = {
    display: 'block',
    border: `1px solid ${OVERLAY_BORDER}`,
    borderRadius: radius.sm,
    boxShadow: '0px 6px 9px 5px rgba(0,0,0,0.15), 0px 3px 3px 0px rgba(0,0,0,0.3)',
  }

  if (isMobile) {
    // Too narrow to hang the panel off the side, so it tucks under the corner.
    return (
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <ShotFrame shot={shot} />
        <img
          src={overlay.src}
          alt={overlay.alt}
          style={{ ...overlayStyle, width: '70%', marginTop: '-40px', marginLeft: 'auto' }}
        />
      </div>
    )
  }

  // The panel hangs past the frame, so the box reserves the whole group's
  // footprint — otherwise the caption stacks against the frame alone and the
  // overlay's percentage offsets resolve against the wrong height.
  return (
    <div
      style={{
        position: 'relative',
        width: COMPOSITION.column,
        aspectRatio: `${COMPOSITION.width} / ${COMPOSITION.height}`,
      }}
    >
      <ShotFrame shot={shot} style={{ width: pct(COMPOSITION.base, COMPOSITION.width) }} />
      <img
        src={overlay.src}
        alt={overlay.alt}
        style={{
          ...overlayStyle,
          position: 'absolute',
          left: pct(COMPOSITION.overlayLeft, COMPOSITION.width),
          top: pct(COMPOSITION.overlayTop, COMPOSITION.height),
          width: pct(COMPOSITION.width - COMPOSITION.overlayLeft, COMPOSITION.width),
          aspectRatio: overlay.aspect,
          objectFit: 'cover',
        }}
      />
    </div>
  )
}

/**
 * A screenshot in its designed frame. The image runs at the box's full width
 * (or `zoom` times it) pinned top-left and is clipped by the aspect box, so a
 * full-page capture shows its top and a zoomed one shows its corner.
 */
function ShotFrame({ shot, style }: { shot: LandingShot; style?: React.CSSProperties }) {
  const framed = shot.frame === 'chrome' || shot.frame === 'border'

  return (
    <div
      style={{
        border: framed
          ? `${shot.frame === 'border' ? '2px' : '0.57px'} solid ${FRAME_BORDER}`
          : undefined,
        borderRadius: framed ? '9px' : radius.md,
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
        <img
          src={shot.src}
          alt={shot.alt}
          style={{
            width: shot.zoom ? `${shot.zoom * 100}%` : '100%',
            maxWidth: 'none',
            height: 'auto',
            display: 'block',
          }}
        />
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
    gap: isMobile ? '10px' : space.lg,
    background: PILL_BG,
    color: PILL_TEXT,
    padding: isMobile ? '10px 18px' : '12px 24px',
    borderRadius: radius.full,
    fontSize: isMobile ? '16px' : '20px',
    fontWeight: 500,
    lineHeight: 1.5,
    textDecoration: 'none',
    whiteSpace: 'nowrap',
  }

  if (!href) return <span style={style}>{children}</span>

  const external = !href.startsWith('#')
  return (
    <a
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      style={style}
    >
      {children}
    </a>
  )
}

function FeedbackCard({ shot }: { shot: FeedbackShot }) {
  const isMobile = useIsMobile()
  const pad = shot.pad ?? 6

  return (
    <div
      style={{
        width: isMobile ? '100%' : `${shot.width}px`,
        maxWidth: '100%',
        boxSizing: 'border-box',
        background: shot.bg ?? CARD_BG,
        borderRadius: radius.sm,
        padding: `${pad}px`,
      }}
    >
      {/* 3px against the card's 6px — an optical inset, as in the browser frame */}
      <div style={{ width: '100%', aspectRatio: shot.aspect, borderRadius: '3px', overflow: 'hidden' }}>
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
