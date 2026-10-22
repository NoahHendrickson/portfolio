import { Fragment, useRef, useState } from 'react'
import { FastForward, MagnifyingGlassPlus, MouseMiddleClick, Scissors, VideoCamera } from '@phosphor-icons/react'
import Header from './Header'
import ProjectIntro, { IntroList, OutLink, Runs, SectionCopy, SectionHeading, WideMedia } from './ProjectIntro'
import ArtGallery from './ArtGallery'
import ProjectShowcase from './ProjectShowcase'
import SidebarPlayground from './No3ySidebar'
import { radius, radiusPx, space, type } from '../design-system/tokens'
import { useIsMobile } from '../hooks/useIsMobile'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { usePlayWhenVisible } from '../hooks/usePlayWhenVisible'
import {
  copyMeasure,
  PAGE_GUTTER,
  PROJECT_COPY_MAX,
  PROJECT_MOBILE_PAD,
  PROJECT_SECTION_GAP,
  PROJECT_STACK_GAP,
  projectPad,
  projectWide,
} from '../layout'
import type {
  FeedbackShot,
  Landing,
  LandingShot,
  LandingVideo,
  Paragraph,
  Project,
  Prose,
  ShowcaseImage,
  StoryColumn,
  StorySection,
  TimelineTrack,
} from '../data/projects'

const PAGE_BG = 'var(--color-bg-primary)'
const TEXT = 'var(--color-text-primary)'
const ORANGE = 'var(--color-orange)'
/** The outro card is orange in both themes, so its pill stays cream-on-orange. */
const PILL_BG = 'var(--color-bg-cream)'
const PILL_TEXT = 'var(--color-text-inverse)'
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
/** The content width inside the page gutters, which every row width is measured against. */
const CONTENT_WIDTH = 1512 - PAGE_GUTTER * 2

// The horizontal rhythm is the shared `shellPad` — every row is a share of the
// content column, which the page sizes off the viewport, so without a stop the
// rows keep stretching on a big screen. The shared gutter caps the column at
// `SHELL_MAX` (measured off this page, the site's widest) and takes the slack
// past it. It stays horizontal padding rather than a capped wrapper because
// the feedback band's tint has to keep running edge to edge.
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

const flattenProse = (text: Prose) =>
  toParagraphs(text)
    .map((paragraph) => (typeof paragraph === 'string' ? paragraph : paragraph.map((run) => run.text).join('')))
    .join(' ')

/** Body copy on every story row — the intro description's size, on the secondary ink. */
const BODY_STYLE: React.CSSProperties = {
  margin: 0,
  ...type['body-xl'],
  color: BODY_TEXT,
}

/** The heading over copy laid on a shot — the showcase overlay and the closing band. Section rows use `SectionHeading`. */
const ROW_HEADING: React.CSSProperties = {
  margin: 0,
  fontSize: '24px',
  fontWeight: 600,
  lineHeight: 'normal',
  letterSpacing: 0,
  color: TEXT,
}

/** Crisp's pin / speed-up / clips rows — same size as the row heading, medium. */
const ROW_HEADLINE: React.CSSProperties = {
  ...ROW_HEADING,
  fontWeight: 500,
  lineHeight: 1.3,
  letterSpacing: 0,
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
  if (landing.showcasePage) return <ProjectShowcase project={project} content={landing.showcasePage} />

  const gutter = isMobile ? PROJECT_MOBILE_PAD : projectPad()
  const rowPad = isMobile ? '40px' : '80px'
  const heroBody = landing.hero.body ?? [project.summary]
  const continuous = landing.flow === 'continuous'
  // The shared project frame's section rhythm, from the hero down through every row.
  const sectionGap = `${isMobile ? PROJECT_SECTION_GAP.mobile : PROJECT_SECTION_GAP.desktop}px`
  // A hero drawn the column's full width breaks out of it, as on every project page.
  const wide = (px: number) => (!isMobile && px >= CONTENT_WIDTH ? projectWide() : { width: heroWidth(px) })

  /*
    Whatever opens the page under the intro — the showcase, the hero shot or
    clip, or on a `continuous` page the first row. It always sits the Meridial
    onboarding study's 80 (48 on mobile) under the intro, whatever `gap` the
    frame runs between the blocks after it, so the hero shows on landing.
  */
  const hasBody = !!landing.showcase || !!landing.hero.shot || !!landing.hero.video || continuous

  const rows = landing.sections.map((section, i) => <SectionContent key={sectionKey(section, i)} section={section} />)

  // Every project page opens on the same block — see `ProjectIntro`.
  const intro = (
    <ProjectIntro
      title={project.title}
      helper={landing.eyebrow}
      description={heroBody}
      actions={
        (landing.hero.cta || !!landing.hero.links?.length) && (
          <>
            {landing.hero.cta && (
              <OutLink
                href={landing.hero.cta.href}
                label={landing.hero.cta.label}
                variant="primary"
                gradient={landing.hero.cta.gradient}
              />
            )}
            {landing.hero.links?.map((link) => (
              <OutLink key={link.href} href={link.href} label={link.label} />
            ))}
          </>
        )
      }
    >
      {landing.hero.list && <IntroList items={landing.hero.list} />}
    </ProjectIntro>
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
      <Header leading="back" showProfile={false} barInset={gutter} />

      {/*
        Hero — title block. On a `continuous` page the rest of the rows run in
        this same block; a `banded` page gives each of them its own padded band
        below. Back lives in the header in place of the tab bar.
      */}
      <section
        style={{
          position: 'relative',
          // The intro pads its own top; the bottom keeps the file's 80px so
          // the next band / page end still breathe.
          padding: `0 ${gutter} ${rowPad}`,
        }}
      >
        {intro}

        {hasBody && (
          <div
            style={{
              marginTop: isMobile ? space['3xl'] : space['5xl'],
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              gap: continuous ? sectionGap : isMobile ? space['2xl'] : space['5xl'],
            }}
          >
            {landing.showcase && <Showcase showcase={landing.showcase} style={wide(CONTENT_WIDTH)} />}

            {landing.hero.shot && (
              <ShotFrame shot={landing.hero.shot} style={wide(landing.hero.shotWidth ?? 718)} priority />
            )}

            {landing.hero.video && (
              <HeroVideo
                video={landing.hero.video}
                maxWidth={landing.hero.shotWidth ?? 718}
                style={wide(landing.hero.shotWidth ?? 718)}
              />
            )}

            {/*
              The rows get their own track, flush left on the column like every
              project page's sections.
            */}
            {continuous && (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  gap: sectionGap,
                  width: '100%',
                }}
              >
                {rows}
              </div>
            )}
          </div>
        )}
      </section>

      {!continuous &&
        landing.sections.map((section, i) => (
          <section
            key={sectionKey(section, i)}
            style={{
              padding: `${rowPad} ${gutter}`,
              display: 'flex',
              justifyContent: 'center',
            }}
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
          <SectionHeading>{landing.feedback.heading}</SectionHeading>

          {landing.feedback.body && (
            <p style={{ margin: 0, maxWidth: `${PROJECT_COPY_MAX}px`, ...type['body-xl'] }}>{landing.feedback.body}</p>
          )}

          <FeedbackWall shots={landing.feedback.shots} />
        </section>
      )}

      {/* Closing card — the file drops it to the bottom of a taller frame */}
      {landing.outro && (
        <section
          style={{
            padding: `0 ${gutter}`,
            paddingTop: isMobile ? '24px' : '77px',
          }}
        >
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

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: space.sm,
                flexWrap: 'wrap',
              }}
            >
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
 * The wide opener under the page's `ProjectIntro`: the shot across the hero
 * breakout, then the grid of feature images two to a row on the same 16px
 * rhythm, so the five read as one set.
 */
function Showcase({
  showcase,
  style,
}: {
  showcase: NonNullable<Landing['showcase']>
  /** Its width — the hero breakout on desktop. */
  style: React.CSSProperties
}) {
  const isMobile = useIsMobile()
  // The wide shot is the page's hero; the grid under it can wait its turn.
  const image = (shot: ShowcaseImage, hero = false) => (
    <img
      src={shot.src}
      alt={shot.alt}
      loading={hero ? 'eager' : 'lazy'}
      fetchPriority={hero ? 'high' : 'auto'}
      decoding="async"
      style={{
        display: 'block',
        width: '100%',
        height: 'auto',
        aspectRatio: shot.aspect,
        borderRadius: MOCKUP_RADIUS,
      }}
    />
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: space.lg, ...style }}>
      {image(showcase.shot, true)}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: space.lg }}>
        {showcase.grid.map((shot) => (
          <Fragment key={shot.src}>{image(shot)}</Fragment>
        ))}
      </div>
    </div>
  )
}

/** Rows are keyed off their first screenshot; `copy` rows have none, so index it. */
function sectionKey(section: StorySection, i: number) {
  switch (section.kind) {
    case 'copy':
    case 'tracks':
    case 'gallery':
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

  // Media runs wider than the copy column, out to the hero's width (`WideMedia`).
  if (section.kind === 'gallery') {
    return (
      <WideMedia>
        <ArtGallery heading={section.heading} items={section.items} />
      </WideMedia>
    )
  }

  if (section.kind === 'tracks') return <TrackLegend section={section} />

  if (section.kind === 'copy') {
    return (
      <SectionCopy heading={section.heading}>
        <Body body={section.body} />
      </SectionCopy>
    )
  }

  if (section.kind === 'shot') {
    return (
      <WideMedia>
        <Composition section={section} />
      </WideMedia>
    )
  }

  if (section.kind === 'band') return <Band section={section} />

  if (section.kind === 'feature') {
    const copy = section.headline ? (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: space.xl,
          ...(section.stack
            ? { width: '100%', maxWidth: copyMeasure(section.copyWidth) }
            : null),
        }}
      >
        <h2 style={ROW_HEADLINE}>
          {`${section.heading.replace(/[.!?]$/, '')}. ${flattenProse(section.body)}`}
        </h2>
      </div>
    ) : (
      <SectionCopy heading={section.heading}>
        <Body body={section.body} lead={section.lead} />
      </SectionCopy>
    )
    const shotMedia =
      section.panel && section.shot ? (
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
            loading="lazy"
            decoding="async"
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
          loading="lazy"
          decoding="async"
          style={{
            width: '100%',
            height: 'auto',
            display: 'block',
            borderRadius: MOCKUP_RADIUS,
          }}
        />
      ) : null

    // The live sidebar takes the copy into its own layout — heading and
    // controls beside the stage — and any shot stands under it (no3y Code's
    // card states board).
    if (section.sidebarPlayground) {
      return (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: isMobile ? space['2xl'] : space['4xl'],
            width: '100%',
          }}
        >
          <SidebarPlayground
            options={section.sidebarPlayground}
            copy={copy}
            radius={MOCKUP_RADIUS}
            isMobile={isMobile}
          />
          {shotMedia && <WideMedia>{shotMedia}</WideMedia>}
        </div>
      )
    }

    const media = section.video ? <StoryClip video={section.video} /> : shotMedia

    if (section.stack) {
      return (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: `${isMobile ? PROJECT_STACK_GAP.mobile : PROJECT_STACK_GAP.desktop}px`,
            width: '100%',
          }}
        >
          {copy}
          {media &&
            (section.panelWidth ? (
              <div style={{ width: heroWidth(section.panelWidth) }}>{media}</div>
            ) : (
              <WideMedia>{media}</WideMedia>
            ))}
        </div>
      )
    }

    const total = section.copyWidth + section.gap + (section.panelWidth ?? 0)
    return (
      <div
        style={
          isMobile
            ? {
                display: 'flex',
                flexDirection: 'column',
                gap: space['2xl'],
                width: '100%',
              }
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
      <WideMedia>
        <div
          style={
            isMobile
              ? {
                  display: 'flex',
                  flexDirection: 'column',
                  gap: space['2xl'],
                  width: '100%',
                }
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
              <Caption text={section.caption} />
            </>
          )}
        </div>
      </WideMedia>
    )
  }

  const _exhaustive: never = section
  return _exhaustive
}

const TRACK_ICONS = {
  'video-camera': VideoCamera,
  'magnifying-glass-plus': MagnifyingGlassPlus,
  'mouse-middle-click': MouseMiddleClick,
  scissors: Scissors,
  'fast-forward': FastForward,
} as const

/** Matches the 16×16 Phosphor glyphs on the player's track rail. */
const TRACK_ICON_SIZE = 16

/**
 * Crisp's timeline legend — heading and first-player copy over that shot,
 * final-player copy over the five-track shot, then a row per track.
 */
function TrackLegend({ section }: { section: Extract<StorySection, { kind: 'tracks' }> }) {
  const isMobile = useIsMobile()
  const stackGap = `${isMobile ? PROJECT_STACK_GAP.mobile : PROJECT_STACK_GAP.desktop}px`
  const copyStyle = {
    display: 'flex' as const,
    flexDirection: 'column' as const,
    gap: space.xl,
    width: '100%',
    maxWidth: `${PROJECT_COPY_MAX}px`,
  }
  const shotStyle = {
    width: '100%',
    objectFit: 'cover' as const,
    display: 'block',
    borderRadius: MOCKUP_RADIUS,
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: stackGap,
        width: '100%',
      }}
    >
      <div style={copyStyle}>
        <SectionHeading>{section.heading}</SectionHeading>
        {section.attempt && <Body body={section.attempt.body} />}
      </div>
      {section.attempt && (
        <img
          src={section.attempt.shot.src}
          alt={section.attempt.shot.alt}
          loading="lazy"
          decoding="async"
          style={{
            ...shotStyle,
            aspectRatio: section.attempt.shot.aspect.replace(/\s/g, ''),
          }}
        />
      )}
      <div style={copyStyle}>
        <Body body={section.body} />
      </div>
      <img
        src={section.shot.src}
        alt={section.shot.alt}
        loading="lazy"
        decoding="async"
        style={{
          ...shotStyle,
          aspectRatio: section.shot.aspect.replace(/\s/g, ''),
        }}
      />
      <div style={copyStyle}>
        {section.items.map((item) => (
          <TrackRow key={item.heading} item={item} />
        ))}
      </div>
    </div>
  )
}

function TrackRow({ item }: { item: TimelineTrack }) {
  const Icon = TRACK_ICONS[item.icon]
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: space.xs }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: space.md }}>
        <Icon size={TRACK_ICON_SIZE} color={item.color} />
        <h3
          style={{
            margin: 0,
            ...type['label-l'],
            fontWeight: 600,
            color: item.color,
          }}
        >
          {item.heading}
        </h3>
      </div>
      <p
        style={{
          ...BODY_STYLE,
          margin: 0,
          paddingLeft: `calc(${TRACK_ICON_SIZE}px + ${space.md})`,
        }}
      >
        {item.body}
      </p>
    </div>
  )
}

/** Body copy — one `<p>` per paragraph, with inline runs where the file styles part of one. */
function Body({ body, lead }: { body: Prose; lead?: boolean }) {
  const style = lead ? { ...BODY_STYLE, color: TEXT } : BODY_STYLE

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
 * A looping clip standing in for a feature-row still. Muted and inline so
 * mobile Safari will play it once it enters the viewport; `prefers-reduced-motion`
 * gets the poster. Unlike `HeroVideo` it just fills the panel — no backdrop,
 * no mid-clip zoom.
 */
function StoryClip({ video }: { video: LandingVideo }) {
  const stillOnly = useMediaQuery('(prefers-reduced-motion: reduce)')
  const clipRef = useRef<HTMLVideoElement>(null)
  usePlayWhenVisible(clipRef)
  const fill: React.CSSProperties = {
    width: '100%',
    aspectRatio: video.aspect.replace(/\s/g, ''),
    objectFit: 'cover',
    display: 'block',
    borderRadius: MOCKUP_RADIUS,
    overflow: 'hidden',
  }

  return stillOnly ? (
    <img src={video.poster} alt={video.alt} loading="lazy" decoding="async" style={fill} />
  ) : (
    <video
      ref={clipRef}
      poster={video.poster}
      aria-label={video.alt}
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
 * muted and inline once it enters the viewport, and carries a `poster`
 * so the box shows the opening frame instead of black while the file loads.
 * The clip is cover-fit, so a source wider than the designed box is cropped
 * evenly rather than letterboxed. `prefers-reduced-motion` gets the poster
 * alone. `zoomAfter` eases into `zoom` mid-clip; `zoomUntil` eases back out
 * so the loop meets a full-bleed frame.
 */
const ZOOM_IN = 'transform 1.35s cubic-bezier(0.4, 0, 0.2, 1)'
const ZOOM_OUT = 'transform 2s cubic-bezier(0.4, 0, 0.2, 1)'

function HeroVideo({
  video,
  maxWidth,
  style,
}: {
  video: LandingVideo
  /** The width the file draws it at, which the backdrop window is placed against. */
  maxWidth: number
  style: React.CSSProperties
}) {
  const stillOnly = useMediaQuery('(prefers-reduced-motion: reduce)')
  const clipRef = useRef<HTMLVideoElement>(null)
  usePlayWhenVisible(clipRef)
  const [lateZoom, setLateZoom] = useState({
    scale: 1,
    smooth: false,
    out: false,
  })

  const { backdrop } = video

  const box: React.CSSProperties = {
    position: 'relative',
    ...style,
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
      ? {
          ...fill,
          transform: `scale(${video.zoom})`,
          transformOrigin: video.focus ?? 'center',
        }
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

/** Caption copy under a shot column or beside a row shot — the rows' body size. */
function Caption({ text, maxWidth }: { text: string | string[]; maxWidth?: number }) {
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
            ...type['body-xl'],
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
            loading="lazy"
            decoding="async"
            style={{
              ...OVERLAY_STYLE,
              width: '55%',
              marginTop: '-40px',
              marginLeft: 'auto',
            }}
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
          loading="lazy"
          decoding="async"
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
      loading="lazy"
      decoding="async"
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
          ? {
              display: 'flex',
              flexDirection: 'column',
              gap: space.xl,
              padding: space.xl,
            }
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
        loading="lazy"
        decoding="async"
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
function ShotFrame({
  shot,
  style,
  priority,
}: {
  shot: LandingShot
  style?: React.CSSProperties
  /** The hero: fetched first rather than when it nears the viewport. */
  priority?: boolean
}) {
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
          src="/work/browser-bar.webp"
          alt=""
          style={{ width: '100%', height: 'auto', display: 'block' }}
        />
      )}
      <div style={{ width: '100%', aspectRatio: shot.aspect, overflow: 'hidden' }}>
        <img
          src={shot.src}
          alt={shot.alt}
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : 'auto'}
          decoding="async"
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
      <div
        style={{
          width: '100%',
          aspectRatio: shot.aspect,
          borderRadius: '3px',
          overflow: 'hidden',
        }}
      >
        <img
          src={shot.src}
          alt={shot.alt}
          loading="lazy"
          decoding="async"
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
