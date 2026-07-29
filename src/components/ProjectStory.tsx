import { Fragment, useState } from 'react'
import { ArrowLeft, ArrowSquareOut } from '@phosphor-icons/react'
import Header from './Header'
import Footer from './Footer'
import { resolvePalette, VARIANTS } from '../design-system/buttonStyles'
import { color, control, radius, space, type } from '../design-system/tokens'
import { useIsMobile } from '../hooks/useIsMobile'
import type {
  FeedbackShot,
  LandingShot,
  Project,
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
/** The centered copy column — the title block and the `copy` rows both run on it. */
const COPY_WIDTH = 720
/** Gap between the feedback wall's cards, 9.588 in the file. */
const WALL_GAP = 10

const pct = (px: number, of: number) => `${(px / of) * 100}%`

const toParagraphs = (text: string | string[]) => (Array.isArray(text) ? text : [text])

/**
 * Screenshot-led project landing (`#/work/<slug>` for any project with a
 * `landing` in `src/data/projects.ts`). The generic `ProjectLanding` — stats
 * row, section rail, stack and status — still serves everything else.
 *
 * The layout is the July 2026 file's story frames (D2 Stat Builder, Phanttom,
 * The Forge): a centered title block, then centered screenshot rows — captions
 * under side-by-side shots, beside a single one, or heading+body beside a
 * tinted panel — on a 120px gutter. Sections pad themselves rather than the
 * page padding once, because the feedback band's tint runs edge to edge.
 */
export default function ProjectStory({ project }: { project: Project }) {
  const isMobile = useIsMobile()
  const landing = project.landing
  if (!landing) return null

  const gutter = isMobile ? '20px' : `${GUTTER}px`
  const rowPad = isMobile ? '40px' : '80px'
  const heroBody = landing.hero.body ?? [project.summary]
  const eyebrow = toParagraphs(landing.eyebrow)
  const continuous = landing.flow === 'continuous'
  const continuousGap = isMobile ? space['2xl'] : `${landing.gap ?? 80}px`

  const rows = landing.sections.map((section, i) => (
    <SectionContent key={sectionKey(section, i)} section={section} />
  ))

  return (
    <div
      style={{
        minHeight: '100vh',
        background: PAGE_BG,
        color: TEXT,
        display: 'flex',
        flexDirection: 'column',
        gap: continuous ? '0' : space.xl,
      }}
    >
      <Header active="work" showProfile={false} />

      {/*
        Hero — a centered title block with the Back pill in the margin beside it,
        and the app window under it when the project has one. On a `continuous`
        page the rest of the rows run in this same block; a `banded` page gives
        each of them its own padded band below.
      */}
      <section
        style={{
          position: 'relative',
          padding: `${rowPad} ${gutter}`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: continuous ? continuousGap : isMobile ? space['2xl'] : space['5xl'],
        }}
      >
        <BackPill inset={isMobile ? undefined : rowPad} />

        <div
          style={{
            width: '100%',
            maxWidth: `${COPY_WIDTH}px`,
            display: 'flex',
            flexDirection: 'column',
            gap: space.lg,
          }}
        >
          {/* Several entries read as one row split by hairlines. */}
          <div style={{ display: 'flex', alignItems: 'stretch', gap: space.lg }}>
            {eyebrow.map((label, i) => (
              <Fragment key={label}>
                {i > 0 && <div style={{ width: '1px', background: color.border.subtle }} />}
                <p style={{ margin: 0, fontSize: '16px', fontWeight: 500, lineHeight: '24px', color: MUTED }}>
                  {label}
                </p>
              </Fragment>
            ))}
          </div>

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

          {landing.hero.links && landing.hero.links.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: space.sm }}>
              {landing.hero.links.map((link) => (
                <OutLink key={link.href} href={link.href} label={link.label} />
              ))}
            </div>
          )}

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

        {continuous && rows}
      </section>

      {!continuous &&
        landing.sections.map((section, i) => (
          <section
            key={sectionKey(section, i)}
            style={{ padding: `${rowPad} ${gutter}`, display: 'flex', justifyContent: 'center' }}
          >
            {rows[i]}
          </section>
        ))}

      {landing.feedback && (
        <section
          style={{
            background: TINT,
            padding: `${rowPad} ${gutter}`,
            display: 'flex',
            flexDirection: 'column',
            gap: '40px',
          }}
        >
          <h2
            style={{
              margin: 0,
              ...type['heading-l'],
              fontSize: isMobile ? '24px' : type['heading-l'].fontSize,
            }}
          >
            {landing.feedback.heading}
          </h2>

          {landing.feedback.body && (
            <p style={{ margin: 0, maxWidth: '720px', fontSize: isMobile ? '16px' : '18px', lineHeight: 'normal' }}>
              {landing.feedback.body}
            </p>
          )}

          <FeedbackWall shots={landing.feedback.shots} />
        </section>
      )}

      {/* Closing card — the file drops it to the bottom of a taller frame */}
      {landing.outro && (
        <section style={{ padding: `0 ${gutter}`, paddingTop: isMobile ? '24px' : '77px' }}>
          <div
            style={{
              background: ORANGE,
              borderRadius: radius['2xl'],
              padding: isMobile ? '20px 20px' : '24px 32px',
              display: 'flex',
              flexDirection: isMobile ? 'column' : 'row',
              alignItems: isMobile ? 'flex-start' : 'center',
              justifyContent: 'space-between',
              gap: isMobile ? '16px' : '24px',
            }}
          >
            <h2
              style={{
                margin: 0,
                maxWidth: '640px',
                ...(landing.outro.large ? type['display-l'] : type['heading-l']),
                fontSize: isMobile
                  ? '20px'
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

      <Footer />
    </div>
  )
}

/** Rows are keyed off their first screenshot; `copy` rows have none, so index it. */
function sectionKey(section: StorySection, i: number) {
  switch (section.kind) {
    case 'copy':
      return `${i}-${section.heading}`
    case 'columns':
      return section.columns[0].shot.src
    case 'row':
    case 'feature':
    case 'shot':
      return section.shot.src
    default: {
      const _exhaustive: never = section
      return _exhaustive
    }
  }
}

/**
 * The body of one story row, centered in the content column without a band
 * around it — the page decides whether it gets one. `columns` puts shots side
 * by side with their captions underneath, `row` seats a single shot beside its
 * caption, `feature` puts muted heading + body beside a tinted panel, `copy` is
 * a heading and body on the title column, and `shot` stands one screenshot on
 * its own. Widths are px at the file's content width, rendered as shares so each
 * group scales together.
 */
function SectionContent({ section }: { section: StorySection }) {
  const isMobile = useIsMobile()

  if (section.kind === 'copy') {
    return (
      <div
        style={{
          width: '100%',
          maxWidth: `${COPY_WIDTH}px`,
          display: 'flex',
          flexDirection: 'column',
          gap: space.lg,
        }}
      >
        <h2
          style={{
            margin: 0,
            ...type['heading-l'],
            fontSize: isMobile ? '24px' : type['heading-l'].fontSize,
          }}
        >
          {section.heading}
        </h2>
        {toParagraphs(section.body).map((paragraph) => (
          <p
            key={paragraph}
            style={{ margin: 0, fontSize: isMobile ? '16px' : '18px', lineHeight: 'normal' }}
          >
            {paragraph}
          </p>
        ))}
      </div>
    )
  }

  if (section.kind === 'shot') return <Composition section={section} />

  if (section.kind === 'feature') {
    const total = section.copyWidth + section.gap + section.panelWidth
    return (
      <div
        style={
          isMobile
            ? { display: 'flex', flexDirection: 'column', gap: space['2xl'], width: '100%' }
            : {
                display: 'grid',
                gridTemplateColumns: `${section.copyWidth}fr ${section.panelWidth}fr`,
                columnGap: pct(section.gap, total),
                width: pct(total, CONTENT_WIDTH),
                alignItems: 'start',
              }
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: space['2xl'] }}>
          <h2
            style={{
              margin: 0,
              fontSize: '24px',
              fontWeight: 600,
              lineHeight: 'normal',
              letterSpacing: '-0.067em',
              color: MUTED,
            }}
          >
            {section.heading}
          </h2>
          {toParagraphs(section.body).map((paragraph) => (
            <p
              key={paragraph}
              style={{ margin: 0, fontSize: '16px', fontWeight: 400, lineHeight: 'normal', color: BODY_TEXT }}
            >
              {paragraph}
            </p>
          ))}
        </div>
        <img
          src={section.shot.src}
          alt={section.shot.alt}
          style={{ width: '100%', height: 'auto', display: 'block' }}
        />
      </div>
    )
  }

  if (section.kind === 'columns' || section.kind === 'row') {
    const total =
      section.kind === 'columns'
        ? section.columns.reduce((sum, c) => sum + c.width, 0) + section.gap * (section.columns.length - 1)
        : section.shotWidth + section.gap + section.captionWidth

    return (
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
        {section.kind === 'columns' ? (
          section.columns.map((column) => <ShotColumn key={column.shot.src} column={column} />)
        ) : (
          <>
            <ShotFrame shot={section.shot} />
            <Caption text={section.caption} large />
          </>
        )}
      </div>
    )
  }

  const _exhaustive: never = section
  return _exhaustive
}

/** A screenshot with its caption underneath. */
function ShotColumn({ column }: { column: StoryColumn }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: space['2xl'] }}>
      <ShotFrame shot={column.shot} />
      <Caption text={column.caption} maxWidth={column.captionWidth} />
    </div>
  )
}

/**
 * Outbound hero pill — ghost Button chrome on an `<a>`, same reason as BackPill.
 * Hover uses `resolvePalette` so it can't drift from Button's ghost hover.
 */
function OutLink({ href, label }: { href: string; label: string }) {
  const [hovered, setHovered] = useState(false)
  const palette = resolvePalette('ghost', hovered ? 'hover' : 'default')

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
        gap: space.sm,
        height: control.sm,
        boxSizing: 'border-box',
        padding: `0 ${space.lg}`,
        borderRadius: radius.full,
        border: `1px solid ${palette.borderColor}`,
        background: palette.background,
        color: palette.color,
        fontSize: type['label-m'].fontSize,
        fontWeight: type['label-m'].fontWeight,
        lineHeight: type['label-m'].lineHeight,
        textDecoration: 'none',
        whiteSpace: 'nowrap',
        transition: 'background 150ms ease, border-color 150ms ease',
      }}
    >
      {label}
      <ArrowSquareOut size={16} />
    </a>
  )
}

/**
 * Not in the file's frames, kept deliberately. Styled as the design system's
 * ghost pill so it reads the same as the Design tab's controls, but kept an
 * anchor — `Button` renders a <button>, and nesting one inside a link is
 * invalid. The palette is pulled from `buttonStyles` rather than restated, so
 * the two can't drift.
 *
 * With an `inset` it floats in the margin beside the centered title block,
 * where the D2 frame puts it; without one it just stacks above.
 */
function BackPill({ inset }: { inset?: string }) {
  return (
    <a
      href="#/work"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: space.sm,
        height: control.sm,
        boxSizing: 'border-box',
        padding: `0 ${space.lg}`,
        borderRadius: radius.full,
        border: `1px solid ${VARIANTS.ghost.default.borderColor}`,
        background: VARIANTS.ghost.default.background,
        color: VARIANTS.ghost.default.color,
        fontSize: type['label-m'].fontSize,
        fontWeight: type['label-m'].fontWeight,
        lineHeight: type['label-m'].lineHeight,
        textDecoration: 'none',
        whiteSpace: 'nowrap',
        ...(inset
          ? // Hung off the copy column's left edge rather than the page's, so it
            // keeps its 70px gap from the title however wide the window gets.
            { position: 'absolute', top: inset, right: `calc(50% + ${COPY_WIDTH / 2 + 70}px)` }
          : { alignSelf: 'flex-start' }),
      }}
    >
      <ArrowLeft size={16} />
      Back
    </a>
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

const OVERLAY_STYLE: React.CSSProperties = {
  display: 'block',
  border: `1px solid ${OVERLAY_BORDER}`,
  borderRadius: radius.sm,
  boxShadow: '0px 6px 9px 5px rgba(0,0,0,0.15), 0px 3px 3px 0px rgba(0,0,0,0.3)',
}

/**
 * A screenshot standing on its own, with a panel laid over it when the file has
 * one. The box carries the whole composition's footprint and everything inside
 * it is a share of that box, so the overlap survives being scaled down.
 */
function Composition({ section }: { section: Extract<StorySection, { kind: 'shot' }> }) {
  const isMobile = useIsMobile()
  const { width, height, frame, shot, overlay } = section

  if (isMobile) {
    // Too narrow to lay the panel over the frame, so it tucks under the corner.
    return (
      <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
        <ShotFrame shot={shot} />
        {overlay && (
          <img
            src={overlay.src}
            alt={overlay.alt}
            style={{ ...OVERLAY_STYLE, width: '55%', marginTop: '-40px', marginLeft: 'auto' }}
          />
        )}
      </div>
    )
  }

  return (
    <div
      style={{
        position: 'relative',
        width: pct(width, CONTENT_WIDTH),
        aspectRatio: `${width} / ${height}`,
      }}
    >
      <ShotFrame
        shot={shot}
        style={{
          position: 'absolute',
          left: pct(frame.left, width),
          top: pct(frame.top, height),
          width: pct(frame.width, width),
        }}
      />
      {overlay && (
        <img
          src={overlay.src}
          alt={overlay.alt}
          style={{
            ...OVERLAY_STYLE,
            position: 'absolute',
            left: pct(overlay.left, width),
            top: pct(overlay.top, height),
            width: pct(overlay.width, width),
            aspectRatio: overlay.aspect,
            objectFit: 'cover',
          }}
        />
      )}
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
  const plain = shot.frame === 'plain'

  return (
    <div
      style={{
        border: framed
          ? `${shot.frame === 'border' ? '2px' : '0.57px'} solid ${FRAME_BORDER}`
          : undefined,
        borderRadius: plain ? undefined : framed ? '9px' : radius.md,
        overflow: plain ? undefined : 'hidden',
        background: plain ? undefined : FRAME_BG,
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
    gap: space.sm,
    background: PILL_BG,
    color: PILL_TEXT,
    padding: isMobile ? '8px 14px' : '8px 16px',
    borderRadius: radius.full,
    fontSize: isMobile ? '14px' : '16px',
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

/**
 * The wall of chat screenshots. The file lays them out as one row filling the
 * content column, so the cards are `fr` shares of their designed widths and
 * scale together rather than wrapping.
 */
function FeedbackWall({ shots }: { shots: FeedbackShot[] }) {
  const isMobile = useIsMobile()
  const total = shots.reduce((sum, s) => sum + s.width, 0) + WALL_GAP * (shots.length - 1)

  return (
    <div
      style={
        isMobile
          ? { display: 'flex', flexDirection: 'column', gap: space.sm }
          : {
              display: 'grid',
              gridTemplateColumns: shots.map((s) => `${s.width}fr`).join(' '),
              columnGap: pct(WALL_GAP, total),
              alignItems: 'center',
              width: '100%',
            }
      }
    >
      {shots.map((shot) => (
        <FeedbackCard key={shot.src} shot={shot} />
      ))}
    </div>
  )
}

function FeedbackCard({ shot }: { shot: FeedbackShot }) {
  const pad = shot.pad ?? 6

  return (
    <div
      style={{
        width: '100%',
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
