import { Fragment, useRef, useState } from 'react'
import { ArrowSquareOut } from '@phosphor-icons/react'
import Header from './Header'
import { resolvePalette, HOVER_OPACITY } from '../design-system/buttonStyles'
import type { ButtonVariant } from '../design-system/buttonStyles'
import { color, control, radius, radiusPx, space, type } from '../design-system/tokens'
import { useIsMobile } from '../hooks/useIsMobile'
import { useMediaQuery } from '../hooks/useMediaQuery'
import AppLink from '../AppLink'
import { copyPad, PAGE_GUTTER, PROJECT_MOBILE_PAD, shellPad } from '../layout'
import type {
  EyebrowEntry,
  FeedbackShot,
  LandingShot,
  LandingVideo,
  Paragraph,
  Project,
  Prose,
  StoryColumn,
  StorySection,
  TextRun,
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
/**
 * no3y Code's Github pill — the file's purple → pink → peach wash, not the
 * orange accent. Stops measured off node 317:25669.
 */
const NO3Y_CTA =
  'linear-gradient(to right, rgba(131,113,255,0.8) 0%, rgba(255,139,219,0.8) 53.365%, rgba(247,187,163,0.8) 100%)'

/** The content width inside the page gutters, which every row width is measured against. */
const CONTENT_WIDTH = 1512 - PAGE_GUTTER * 2

// The horizontal rhythm is the shared `shellPad` — every row is a share of the
// content column, which the page sizes off the viewport, so without a stop the
// rows keep stretching on a big screen. The shared gutter caps the column at
// `SHELL_MAX` (measured off this page, the site's widest) and takes the slack
// past it. It stays horizontal padding rather than a capped wrapper because
// the feedback band's tint has to keep running edge to edge.
/** The centered copy column — the title block and the `copy` rows both run on it. */
const COPY_WIDTH = 720
/**
 * Outer clip on every mockup across the project pages — hero shots, feature
 * stills, looping clips, the hero video's wallpaper box and the closing band.
 * One value on purpose: anything whose surface is a screenshot, a video or a
 * chart lands here. Nested chrome inside a mockup (a `framed` shot's optical
 * inset, `Composition`'s overlay panel, a `backdrop` window) keeps its own
 * smaller radius — this is the *outer* corner only.
 */
const MOCKUP_RADIUS = radius.xl
/** A `framed` shot draws its border outside the clip, so it takes an optical +1. */
const FRAMED_RADIUS = `${radiusPx.xl + 1}px`
/** Gap between the feedback wall's cards, 9.588 in the file. */
const WALL_GAP = 10

const pct = (px: number, of: number) => `${(px / of) * 100}%`

/**
 * A hero's width. The rows below it are shares of the content column, which the
 * page never caps, so a fixed px hero stays pinned while everything under it
 * grows on a wide screen. This holds the designed px until the column reaches
 * the file's width and then takes the same share of it the rows do, still
 * filling the column when it is narrower than the design.
 */
const heroWidth = (px: number) => `min(100%, max(${px}px, ${pct(px, CONTENT_WIDTH)}))`

const toParagraphs = (text: Prose): Paragraph[] => (typeof text === 'string' ? [text] : text)

/** Body copy on every story row — the file's 16px regular on the secondary ink. */
const BODY_STYLE: React.CSSProperties = {
  margin: 0,
  fontSize: '16px',
  fontWeight: 400,
  lineHeight: 1.4,
  color: BODY_TEXT,
}

/** The heading over a row's copy — `feature` rows and the closing band. */
const ROW_HEADING: React.CSSProperties = {
  margin: 0,
  fontSize: '24px',
  fontWeight: 600,
  lineHeight: 'normal',
  letterSpacing: '-0.067em',
  color: TEXT,
}

/** The muted line(s) above a story title. */
const EYEBROW_STYLE: React.CSSProperties = {
  margin: 0,
  fontSize: '16px',
  fontWeight: 500,
  lineHeight: '24px',
  color: MUTED,
}

/**
 * Screenshot-led project landing (`/work/<slug>` for any project with a
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

  const gutter = isMobile ? PROJECT_MOBILE_PAD : shellPad()
  const rowPad = isMobile ? '40px' : '80px'
  const heroBody = landing.hero.body ?? [project.summary]
  const eyebrow = Array.isArray(landing.eyebrow) ? landing.eyebrow : [landing.eyebrow]
  const continuous = landing.flow === 'continuous'
  const continuousGap = isMobile ? space['2xl'] : `${landing.gap ?? 80}px`
  // Desktop rows sit 80–200 apart. Mobile keeps heading+copy above the shot,
  // so this gap is what stops one section's screenshot sitting on the next
  // heading — 120 matches the page gutter rather than the old 32.
  const rowGap = isMobile ? '120px' : `${landing.rowGap ?? landing.gap ?? 80}px`
  const flush = landing.align === 'start'
  const paired = landing.titleRhythm === 'paired'
  // Rows follow the title's alignment unless the frame splits them — no3y Code
  // left-aligns the title but centres its 1225-wide composer row.
  const rowsFlush = (landing.rowAlign ?? landing.align) === 'start'

  const rows = landing.sections.map((section, i) => (
    <SectionContent key={sectionKey(section, i)} section={section} />
  ))

  /* Several entries read as one row split by hairlines. */
  const eyebrowRow = (
    <div style={{ display: 'flex', alignItems: 'stretch', gap: space.lg }}>
      {eyebrow.map((entry, i) => (
        <Fragment key={i}>
          {i > 0 && <div style={{ width: '1px', background: color.border.subtle }} />}
          <Eyebrow entry={entry} />
        </Fragment>
      ))}
    </div>
  )

  const heading = (
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
  )

  const titleBlock = (
    <div
      style={{
        width: '100%',
        maxWidth: `${landing.copyWidth ?? COPY_WIDTH}px`,
        display: 'flex',
        flexDirection: 'column',
        gap: paired ? space.xl : space.lg,
      }}
    >
      {/*
        A `paired` frame groups the eyebrow with the title so the two sit flush;
        an `even` one spaces them like everything else in the block. Moonfang
        Armory is the one frame that seats the eyebrow under the title.
      */}
      {paired ? (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {landing.eyebrowPlacement === 'below' ? (
            <>
              {heading}
              {eyebrowRow}
            </>
          ) : (
            <>
              {eyebrowRow}
              {heading}
            </>
          )}
        </div>
      ) : (
        <>
          {eyebrowRow}
          {heading}
        </>
      )}

      {landing.hero.links && landing.hero.links.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: space.sm }}>
          {landing.hero.links.map((link) => (
            <OutLink key={link.href} href={link.href} label={link.label} />
          ))}
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: space.lg }}>
        <Body body={heroBody} />
      </div>

      {/* Wrapped so the pill sizes to its label instead of stretching the column. */}
      {landing.hero.cta && (
        <div style={{ display: 'flex' }}>
          <OutLink
            href={landing.hero.cta.href}
            label={landing.hero.cta.label}
            variant="primary"
            gradient={landing.hero.cta.gradient}
          />
        </div>
      )}
    </div>
  )

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
      <Header
        leading="back"
        showProfile={false}
        barInset={isMobile || flush ? gutter : copyPad(landing.copyWidth ?? COPY_WIDTH)}
        trailingInset={gutter}
      />

      {/*
        Hero — title block. On a `continuous` page the rest of the rows run in
        this same block; a `banded` page gives each of them its own padded band
        below. Back lives in the header in place of the tab bar.
      */}
      <section
        style={{
          position: 'relative',
          // Top pad stays tight under the header Back row; bottom keeps the
          // file's 80px so the next band / page end still breathe.
          padding: `${isMobile ? '24px' : '32px'} ${gutter} ${rowPad}`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: flush ? 'flex-start' : 'center',
          gap: continuous ? continuousGap : isMobile ? space['2xl'] : space['5xl'],
        }}
      >
        {titleBlock}

        {landing.hero.shot && (
          <ShotFrame
            shot={landing.hero.shot}
            style={{ width: heroWidth(landing.hero.shotWidth ?? 718) }}
          />
        )}

        {landing.hero.video && (
          <HeroVideo video={landing.hero.video} maxWidth={landing.hero.shotWidth ?? 718} />
        )}

        {/*
          The rows get their own track so a frame can space them wider than it
          spaces the title block from the hero shot, and align them separately.
        */}
        {continuous && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: rowsFlush ? 'flex-start' : 'center',
              gap: rowGap,
              width: '100%',
            }}
          >
            {rows}
          </div>
        )}
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
            <p style={{ margin: 0, maxWidth: '720px', fontSize: isMobile ? '16px' : '18px', lineHeight: 1.4 }}>
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
    case 'feature':
      return section.video?.src ?? section.shot?.src ?? section.heading
    case 'row':
    case 'shot':
    case 'band':
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
 * caption, `feature` puts muted heading + body beside a tinted panel — or
 * stacked, copy then media — `copy` is a heading and body on the title column, and `shot` stands one screenshot on
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
        <Body body={section.body} />
      </div>
    )
  }

  if (section.kind === 'shot') return <Composition section={section} />

  if (section.kind === 'band') return <Band section={section} />

  if (section.kind === 'feature') {
    const copy = (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: space.xl,
          ...(section.stack
            ? { width: '100%', maxWidth: `${section.copyWidth}px` }
            : null),
        }}
      >
        <h2 style={ROW_HEADING}>{section.heading}</h2>
        <Body body={section.body} lead={section.lead} />
      </div>
    )
    const media = section.video ? (
      <StoryClip video={section.video} />
    ) : section.panel && section.shot ? (
      /*
        CSS clip around the media. D2 uses it to tint a raw screenshot.
      */
      <div
        style={{
          width: '100%',
          aspectRatio: section.shot.aspect.replace(/\s/g, ''),
          background: section.panel.background ?? TINT,
          overflow: 'hidden',
          borderRadius: MOCKUP_RADIUS,
        }}
      >
        <img
          src={section.shot.src}
          alt={section.shot.alt}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: section.shot.position ?? 'center',
            display: 'block',
          }}
        />
      </div>
    ) : section.shot ? (
      <img
        src={section.shot.src}
        alt={section.shot.alt}
        style={{
          width: '100%',
          height: 'auto',
          display: 'block',
          borderRadius: MOCKUP_RADIUS,
        }}
      />
    ) : null

    if (section.stack) {
      return (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: isMobile ? space['2xl'] : `${section.gap}px`,
            width: '100%',
          }}
        >
          {copy}
          {media && (
            <div
              style={{
                width: section.panelWidth ? heroWidth(section.panelWidth) : '100%',
              }}
            >
              {media}
            </div>
          )}
        </div>
      )
    }

    const total = section.copyWidth + section.gap + (section.panelWidth ?? 0)
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
        {copy}
        {media}
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

/**
 * One entry in the hairline-split eyebrow row: plain copy, an outbound link with
 * its icon (The Forge's "Github"), or runs when only part of the entry links out
 * (no3y Code's "Fork of T3 Code").
 */
function Eyebrow({ entry }: { entry: EyebrowEntry }) {
  if (Array.isArray(entry)) {
    return (
      <p style={EYEBROW_STYLE}>
        <Runs runs={entry} />
      </p>
    )
  }

  if (typeof entry === 'string') return <p style={EYEBROW_STYLE}>{entry}</p>

  return (
    <a
      href={entry.href}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        ...EYEBROW_STYLE,
        display: 'inline-flex',
        alignItems: 'center',
        gap: space.xs,
        textDecoration: 'none',
      }}
    >
      {entry.label}
      <ArrowSquareOut size={16} />
    </a>
  )
}

/** Body copy — one `<p>` per paragraph, with inline runs where the file styles part of one. */
function Body({ body, lead }: { body: Prose; lead?: boolean }) {
  const style = lead ? { ...BODY_STYLE, fontSize: '18px', color: TEXT } : BODY_STYLE

  return (
    <>
      {toParagraphs(body).map((paragraph, i) => (
        <p key={i} style={style}>
          {typeof paragraph === 'string' ? paragraph : <Runs runs={paragraph} />}
        </p>
      ))}
    </>
  )
}

/**
 * The parts of a paragraph the file styles on their own — a semibold, underlined
 * project name and the muted clause after it. A run with an `href` underlines
 * too, routing in-app for a `/work/…` target and opening a tab otherwise; links
 * inherit their colour so they read as emphasis rather than as browser blue.
 */
function Runs({ runs }: { runs: TextRun[] }) {
  return (
    <>
      {runs.map((run, i) => {
        const style: React.CSSProperties = {
          color: run.muted ? MUTED : 'inherit',
          fontWeight: run.strong ? 600 : undefined,
          textDecoration: run.strong || run.href ? 'underline' : undefined,
        }

        if (!run.href) {
          return (
            <span key={i} style={style}>
              {run.text}
            </span>
          )
        }

        return run.href.startsWith('/') ? (
          <AppLink key={i} href={run.href} style={style}>
            {run.text}
          </AppLink>
        ) : (
          <a key={i} href={run.href} target="_blank" rel="noopener noreferrer" style={style}>
            {run.text}
          </a>
        )
      })}
    </>
  )
}

/**
 * A looping clip standing in for a feature-row still. Muted and inline so
 * mobile Safari will autoplay it; `prefers-reduced-motion` gets the poster.
 * Unlike `HeroVideo` it just fills the panel — no backdrop, no mid-clip zoom.
 */
function StoryClip({ video }: { video: LandingVideo }) {
  const stillOnly = useMediaQuery('(prefers-reduced-motion: reduce)')
  const fill: React.CSSProperties = {
    width: '100%',
    aspectRatio: video.aspect.replace(/\s/g, ''),
    objectFit: 'cover',
    display: 'block',
    borderRadius: MOCKUP_RADIUS,
    overflow: 'hidden',
  }

  return stillOnly ? (
    <img src={video.poster} alt={video.alt} style={fill} />
  ) : (
    <video
      poster={video.poster}
      aria-label={video.alt}
      autoPlay
      loop
      muted
      playsInline
      preload="metadata"
      style={fill}
    >
      {video.hevc && <source src={video.hevc} type='video/mp4; codecs="hvc1"' />}
      <source src={video.src} type="video/mp4" />
    </video>
  )
}

/**
 * The hero as a looping clip rather than a still — Moonfang Armory. It plays
 * muted and inline so mobile Safari will autoplay it, and carries a `poster`
 * so the box shows the opening frame instead of black while the file loads.
 * The clip is cover-fit, so a source wider than the designed box is cropped
 * evenly rather than letterboxed. `prefers-reduced-motion` gets the poster
 * alone. `zoomAfter` eases into `zoom` mid-clip; `zoomUntil` eases back out
 * so the loop meets a full-bleed frame.
 */
const ZOOM_IN = 'transform 1.35s cubic-bezier(0.4, 0, 0.2, 1)'
const ZOOM_OUT = 'transform 2s cubic-bezier(0.4, 0, 0.2, 1)'

function HeroVideo({ video, maxWidth }: { video: LandingVideo; maxWidth: number }) {
  const stillOnly = useMediaQuery('(prefers-reduced-motion: reduce)')
  const clipRef = useRef<HTMLVideoElement>(null)
  const [lateZoom, setLateZoom] = useState({ scale: 1, smooth: false, out: false })

  const { backdrop } = video

  const box: React.CSSProperties = {
    position: 'relative',
    width: heroWidth(maxWidth),
    aspectRatio: video.aspect.replace(/\s/g, ''),
    borderRadius: MOCKUP_RADIUS,
    overflow: 'hidden',
    background: FRAME_BG,
  }

  const fill: React.CSSProperties = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
  }

  const syncZoom = () => {
    const el = clipRef.current
    if (!el || video.zoomAfter == null || video.zoom == null) return
    const due = el.currentTime >= video.zoomAfter
    const held = due && (video.zoomUntil == null || el.currentTime < video.zoomUntil)
    const scale = held ? video.zoom : 1
    setLateZoom((prev) =>
      prev.scale === scale ? prev : { scale, smooth: due, out: due && !held },
    )
  }

  /* Static crop (Armory) vs a delayed ease into the same crop (no3y Code). */
  const clip: React.CSSProperties = !video.zoom
    ? fill
    : video.zoomAfter == null
      ? { ...fill, transform: `scale(${video.zoom})`, transformOrigin: video.focus ?? 'center' }
      : {
          ...fill,
          transform: `scale(${lateZoom.scale})`,
          transformOrigin: video.focus ?? 'center',
          transition: lateZoom.smooth ? (lateZoom.out ? ZOOM_OUT : ZOOM_IN) : 'none',
        }

  /*
    On a desktop the clip is a window: centred, its own ratio, and lifted off
    the wallpaper with a shadow. Sizes are shares of the box so the margin holds
    at any width. Without a backdrop it just fills the box.
  */
  const stage: React.CSSProperties = backdrop
    ? {
        position: 'absolute',
        top: '50%',
        left: pct((maxWidth - backdrop.width) / 2, maxWidth),
        width: pct(backdrop.width, maxWidth),
        transform: 'translateY(-50%)',
        aspectRatio: backdrop.aspect.replace(/\s/g, ''),
        borderRadius: `${backdrop.radius ?? 12}px`,
        overflow: 'hidden',
        boxShadow: '0 24px 60px rgba(0, 0, 0, 0.45)',
      }
    : { width: '100%', height: '100%' }

  const media = stillOnly ? (
    <img src={video.poster} alt={video.alt} style={clip} />
  ) : (
    <video
      ref={clipRef}
      src={video.src}
      poster={video.poster}
      aria-label={video.alt}
      autoPlay
      loop
      muted
      playsInline
      preload="metadata"
      onTimeUpdate={video.zoomAfter != null ? syncZoom : undefined}
      onSeeked={video.zoomAfter != null ? syncZoom : undefined}
      style={clip}
    />
  )

  return (
    <div style={box}>
      {backdrop && <img src={backdrop.src} alt="" style={{ ...fill, position: 'absolute', inset: 0 }} />}
      <div style={stage}>{media}</div>
    </div>
  )
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
 * Outbound hero pill — ghost Button chrome on an `<a>` (`Button` is a
 * <button>). Hover uses `resolvePalette` so it can't drift from Button.
 */
function OutLink({
  href,
  label,
  variant = 'ghost',
  gradient,
}: {
  href: string
  label: string
  /** `primary` for the hero CTA; the link rows stay on the ghost pill. */
  variant?: ButtonVariant
  /** no3y Code's purple–pink wash in place of the orange accent. */
  gradient?: boolean
}) {
  const [hovered, setHovered] = useState(false)
  const palette = resolvePalette(variant, hovered ? 'hover' : 'default')

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
        border: gradient ? 'none' : `1px solid ${palette.borderColor}`,
        background: gradient ? NO3Y_CTA : palette.background,
        color: gradient ? color.accent.onAccent : palette.color,
        opacity: hovered && gradient ? HOVER_OPACITY : 1,
        fontSize: type['label-m'].fontSize,
        fontWeight: type['label-m'].fontWeight,
        lineHeight: type['label-m'].lineHeight,
        textDecoration: 'none',
        whiteSpace: 'nowrap',
        transition: 'background 150ms ease, border-color 150ms ease, opacity 150ms ease',
      }}
    >
      {label}
      <ArrowSquareOut size={16} />
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
            ...(large ? { fontSize: '18px', lineHeight: 1.4 } : type['body-l']),
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
 * The closing band — no3y Code's "Learning to Design Engineer". A wallpaper
 * fills the box, a blurred black wedge darkens the left so the copy reads over
 * it, and the screenshot sits to the right. The two columns are `fr` shares of
 * the band's designed width, and a spacer holds the file's height as a floor
 * rather than a cap, so the box keeps its proportions but grows instead of
 * clipping when the copy wraps to more lines at narrower widths.
 */
function Band({ section }: { section: Extract<StorySection, { kind: 'band' }> }) {
  const isMobile = useIsMobile()
  const { width, height, pad, copyWidth, shotWidth, shot } = section
  const inner = width - pad.left - pad.right
  const gap = inner - copyWidth - shotWidth

  const copy = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: space.xl }}>
      <h2 style={ROW_HEADING}>{section.heading}</h2>
      <Body body={section.body} />
    </div>
  )

  const picture = (
    <img
      src={shot.src}
      alt={shot.alt}
      style={{
        width: '100%',
        aspectRatio: shot.aspect.replace(/\s/g, ''),
        display: 'block',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.25)',
      }}
    />
  )

  return (
    <div
      style={{
        position: 'relative',
        width: pct(width, CONTENT_WIDTH),
        borderRadius: MOCKUP_RADIUS,
        overflow: 'hidden',
        ...(isMobile
          ? { display: 'flex', flexDirection: 'column', gap: space.xl, padding: space.xl }
          : {
              display: 'grid',
              gridTemplateColumns: `${copyWidth}fr ${shotWidth}fr`,
              columnGap: pct(gap, inner),
              alignItems: 'center',
              padding: `0 ${pct(pad.right, width)} 0 ${pct(pad.left, width)}`,
            }),
      }}
    >
      <img
        src={section.background}
        alt=""
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block',
        }}
      />
      {/*
        The file draws this as a black wedge hung off the top-left corner under a
        32px blur, which doesn't survive the translation to CSS — the blur widens
        the ramp to about twice what the gradient alone gives. These stops are the
        opacity measured across the rendered frame instead, so a plain gradient
        lands on it without the cost of a filter. Mobile is too narrow to fade
        across, so a flat wash does the same job there.
      */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: isMobile
            ? 'rgba(0, 0, 0, 0.6)'
            : `linear-gradient(90deg,
                rgba(0, 0, 0, 0.76) 0%,
                rgb(0, 0, 0) 4%,
                rgb(0, 0, 0) 16%,
                rgba(0, 0, 0, 0.34) 63%,
                rgba(0, 0, 0, 0.14) 68%,
                rgba(0, 0, 0, 0) 72.5%)`,
        }}
      />
      {!isMobile && (
        <div
          aria-hidden
          style={{
            gridColumn: '1 / -1',
            gridRow: 1,
            aspectRatio: `${inner} / ${height}`,
            pointerEvents: 'none',
          }}
        />
      )}
      <div style={{ position: 'relative', gridColumn: 1, gridRow: 1 }}>{copy}</div>
      <div style={{ position: 'relative', gridColumn: 2, gridRow: 1 }}>{picture}</div>
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
        borderRadius: framed ? FRAMED_RADIUS : MOCKUP_RADIUS,
        overflow: 'hidden',
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
