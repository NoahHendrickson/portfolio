import { Fragment, useEffect, useRef, useState, type ReactNode } from 'react'
import { ArrowUpRight } from '@phosphor-icons/react'
import AppLink from '../AppLink'
import Header from './Header'
import { Runs } from './ProjectIntro'
import { control, radius, space, type } from '../design-system/tokens'
import { useIsMobile } from '../hooks/useIsMobile'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { usePlayWhenVisible } from '../hooks/usePlayWhenVisible'
import type { EyebrowEntry, LandingVideo, Prose, ShowcaseImage } from '../data/projects'
import {
  COPY_MEASURE,
  FACE_FADE,
  FACE_TILE,
  FACTS_WIDTH,
  INTRO_PAD,
  LEADING,
  OVERSCROLL_RULES,
  PAGE_BG,
  RULE,
  SHEET_BODY,
  SHEET_HEADING,
  SHEET_MAX,
  TEXT,
  TEXT_SOFT,
  cellStyle,
  sheetGap,
  toParagraphs,
} from '../sheetStyle'

/*
  The ruled sheet's building blocks (Figma `461:14182`, Nov 4 2026): the page
  and its column, the intro, the ruled gap, copy and facts cells, square media,
  chips and label-only links. no3y Code (`ProjectSheet`) and D2 Conflux
  (`D2Conflux`) are built from them; the values are in `sheetStyle.ts`.
*/

/** Paints the column's rules on the root while the page is up, and puts the root back after. */
function useOverscrollRules(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return
    const root = document.documentElement.style
    const before = { color: root.backgroundColor, image: root.backgroundImage }
    root.backgroundColor = PAGE_BG
    root.backgroundImage = OVERSCROLL_RULES
    return () => {
      root.backgroundColor = before.color
      root.backgroundImage = before.image
    }
  }, [enabled])
}

/** The faces in the side margins, fading in toward the window's edges. */
function FacePattern() {
  return (
    <div
      aria-hidden
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        background: TEXT,
        maskImage: `${FACE_TILE}, ${FACE_FADE}`,
        maskRepeat: 'repeat, no-repeat',
        maskSize: 'auto, 100% 100%',
        maskComposite: 'intersect',
        WebkitMaskImage: `${FACE_TILE}, ${FACE_FADE}`,
        WebkitMaskRepeat: 'repeat, no-repeat',
        WebkitMaskSize: 'auto, 100% 100%',
        WebkitMaskComposite: 'source-in',
      }}
    />
  )
}

/**
 * The page: the dark shell with the face pattern in its margins, one column
 * between two rules, and the header (Back and Contact, inset to the intro's
 * padding) ruled off at its top. Ends on a ruled gap.
 */
export function SheetPage({ children }: { children: ReactNode }) {
  const isMobile = useIsMobile()
  // On a phone the column is the screen's width, so its rules are its edges.
  useOverscrollRules(!isMobile)

  return (
    // Clips sideways overflow: a block that bleeds to the window (D2 Conflux's Up close)
    // spans 100vw, which counts a classic scrollbar's width. `clip`, not `hidden`, so
    // nothing inside becomes a scroll container.
    <div style={{ position: 'relative', minHeight: '100vh', background: PAGE_BG, color: TEXT, overflowX: 'clip' }}>
      {/* No margins to fill on a phone. */}
      {!isMobile && <FacePattern />}
      <div
        style={{
          position: 'relative',
          maxWidth: SHEET_MAX,
          margin: '0 auto',
          borderLeft: RULE,
          borderRight: RULE,
          minHeight: '100vh',
        }}
      >
        <div style={{ borderBottom: RULE, padding: isMobile ? 0 : `${space.lg} 0` }}>
          <Header leading="back" showProfile={false} barInset={isMobile ? space.xl : INTRO_PAD} />
        </div>
        {children}
        <div aria-hidden style={{ height: sheetGap(isMobile) }} />
      </div>
    </div>
  )
}

/**
 * The intro, on the page with no fill: the icon (if the project has one) and title, the
 * helper entries joined by " / ", the description, anything the page adds
 * (`children` — onboarding's Role / Team / Partners), then any label-only links.
 */
export function SheetIntro({
  icon,
  title,
  helper,
  description,
  links,
  padding,
  children,
}: {
  icon?: string
  title: string
  helper?: string | EyebrowEntry[]
  description: string[]
  links?: { label: string; href: string }[]
  /** Overrides the sheet's own 48 / 24. */
  padding?: string
  children?: ReactNode
}) {
  const isMobile = useIsMobile()
  const entries = helper === undefined ? [] : typeof helper === 'string' ? [helper] : helper
  return (
    // No fill (Nov 4 2026): the intro sits on the page itself, so the filled
    // cells below read as the content.
    <header
      style={{
        padding: padding ?? (isMobile ? space.xl : INTRO_PAD),
        display: 'flex',
        flexDirection: 'column',
        gap: space.xl,
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: space.md }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: space.md }}>
          {icon && <img src={icon} alt="" width={36} height={36} style={{ display: 'block', flexShrink: 0 }} />}
          <h1 style={{ margin: 0, fontSize: '28px', fontWeight: 500, lineHeight: LEADING, textWrap: 'balance' }}>
            {title}
          </h1>
        </div>
        {/* The body copy's 16, like the description (Nov 4 2026; the frame's 20 read too big). */}
        {entries.length > 0 && (
          <p style={{ margin: 0, fontSize: '16px', lineHeight: LEADING, color: TEXT_SOFT }}>
            {entries.map((entry, i) => (
              <Fragment key={i}>
                {i > 0 && ' / '}
                <HelperEntry entry={entry} />
              </Fragment>
            ))}
          </p>
        )}
      </div>
      {description.map((paragraph) => (
        <p key={paragraph} style={{ margin: 0, fontSize: '16px', lineHeight: LEADING, color: TEXT_SOFT, textWrap: 'balance' }}>
          {paragraph}
        </p>
      ))}
      {children}
      {!!links?.length && <SheetLinks links={links} />}
    </header>
  )
}

/**
 * The ruled gap between blocks — the column's rules run on through it. `top`
 * draws the rule over it too, for a block above that carries no bottom rule
 * (the intro).
 */
export function SheetGap({ top = false }: { top?: boolean }) {
  const isMobile = useIsMobile()
  return <div aria-hidden style={{ height: sheetGap(isMobile), borderBottom: RULE, ...(top && { borderTop: RULE }) }} />
}

/**
 * One section: the ruled gap, then its media and copy, ruled off underneath.
 * `id` anchors it (onboarding's steps).
 */
export function SheetBlock({ id, children }: { id?: string; children: ReactNode }) {
  return (
    <section id={id}>
      <SheetGap />
      <div style={{ borderBottom: RULE }}>{children}</div>
    </section>
  )
}

/**
 * A heading and its copy on the cell fill, the copy held to the frame's
 * measure. `body` is prose; `children` take anything else (a list, links)
 * under it on the same measure. No `heading` for copy that carries on a
 * section further down (onboarding, Apply's walkthrough rows).
 */
export function CopyCell({
  heading,
  body,
  children,
  style,
}: {
  heading?: string
  body?: Prose
  children?: ReactNode
  style?: React.CSSProperties
}) {
  const isMobile = useIsMobile()
  return (
    <div style={{ ...cellStyle(isMobile), ...style }}>
      {heading && <h2 style={SHEET_HEADING}>{heading}</h2>}
      <div style={{ display: 'flex', flexDirection: 'column', gap: space.lg, maxWidth: COPY_MEASURE }}>
        {body &&
          toParagraphs(body).map((paragraph, i) => (
            <p key={i} style={SHEET_BODY}>
              {typeof paragraph === 'string' ? paragraph : <Runs runs={paragraph} />}
            </p>
          ))}
        {children}
      </div>
    </div>
  )
}

/** A copy cell beside the facts cell (Tools / Skills), ruled off underneath — the opener's row. */
export function CopyWithFacts({ copy, facts }: { copy: ReactNode; facts: { heading: string; items: string[] }[] }) {
  const isMobile = useIsMobile()
  return (
    <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', borderBottom: RULE }}>
      <div style={{ flex: '1 1 0', minWidth: 0, display: 'flex' }}>{copy}</div>
      {facts.length > 0 && (
        <div
          style={{
            ...cellStyle(isMobile),
            flex: isMobile ? undefined : `0 0 ${FACTS_WIDTH}px`,
            ...(isMobile ? { borderTop: RULE } : { borderLeft: RULE }),
          }}
        >
          <SheetFacts facts={facts} />
        </div>
      )}
    </div>
  )
}

/** The labelled chip lists (Tools, Skills), 24 apart. */
export function SheetFacts({ facts }: { facts: { heading: string; items: string[] }[] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: space.xl }}>
      {facts.map((fact) => (
        <div key={fact.heading} style={{ display: 'flex', flexDirection: 'column', gap: space.lg }}>
          <h2 style={SHEET_HEADING}>{fact.heading}</h2>
          <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexWrap: 'wrap', gap: space.sm }}>
            {fact.items.map((item) => (
              <li key={item}>
                <Chip>{item}</Chip>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

/** A looping clip across the column, square-cornered; the poster under reduced motion. */
export function SheetClip({ video, priority = false }: { video: LandingVideo; priority?: boolean }) {
  const stillOnly = useMediaQuery('(prefers-reduced-motion: reduce)')
  const clipRef = useRef<HTMLVideoElement>(null)
  usePlayWhenVisible(clipRef)
  const fill: React.CSSProperties = {
    display: 'block',
    width: '100%',
    aspectRatio: video.aspect.replace(/\s/g, ''),
    objectFit: 'cover',
  }

  return stillOnly ? (
    <img
      src={video.poster}
      alt={video.alt}
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : 'auto'}
      decoding="async"
      style={fill}
    />
  ) : (
    <video ref={clipRef} poster={video.poster} aria-label={video.alt} loop muted playsInline preload="metadata" style={fill}>
      {video.hevc && <source src={video.hevc} type='video/mp4; codecs="hvc1"' />}
      <source src={video.src} type="video/mp4" />
    </video>
  )
}

/** A still across its box, square-cornered. */
export function SheetImg({ shot, priority = false }: { shot: ShowcaseImage; priority?: boolean }) {
  return (
    <img
      src={shot.src}
      alt={shot.alt}
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : 'auto'}
      decoding="async"
      style={{ display: 'block', width: '100%', height: 'auto', aspectRatio: shot.aspect }}
    />
  )
}

/**
 * A static label, a cream pill with ink text (Nov 9 2026; it was the `ghost` button's
 * outline until then), at the `xs` control height — a fact, not a control, so it
 * takes no hover state.
 */
export function Chip({ children }: { children: ReactNode }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        height: control.xs,
        boxSizing: 'border-box',
        padding: `0 ${space.md}`,
        borderRadius: radius.full,
        background: 'var(--color-bg-cream)',
        color: 'var(--color-ink)',
        ...type['label-m'],
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </span>
  )
}

/** A row of label-only links, 24 apart. */
export function SheetLinks({ links }: { links: { label: string; href: string }[] }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: space.xl }}>
      {links.map((link) => (
        <TextLink key={link.href} href={link.href} label={link.label} />
      ))}
    </div>
  )
}

/**
 * A label-only link: the label and an up-right arrow, no fill or border,
 * underlined on hover. An outbound href opens a tab; a `/…` one routes in-app.
 */
export function TextLink({ href, label }: { href: string; label: string }) {
  const [hovered, setHovered] = useState(false)
  const internal = href.startsWith('/')
  const props = {
    onMouseEnter: () => setHovered(true),
    onMouseLeave: () => setHovered(false),
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: space.xs,
      height: control.sm,
      color: TEXT,
      ...type['label-m'],
      textDecoration: hovered ? 'underline' : 'none',
      textUnderlineOffset: '4px',
      whiteSpace: 'nowrap',
    } satisfies React.CSSProperties,
  }
  const content = (
    <>
      {label}
      <ArrowUpRight size={16} />
    </>
  )
  return internal ? (
    <AppLink href={href} {...props}>
      {content}
    </AppLink>
  ) : (
    <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
      {content}
    </a>
  )
}

/** One entry in the helper line — plain, a link, or runs (no3y Code's T3 Code link). */
function HelperEntry({ entry }: { entry: EyebrowEntry }) {
  if (typeof entry === 'string') return <>{entry}</>
  if (Array.isArray(entry)) return <Runs runs={entry} />
  return (
    <a href={entry.href} target="_blank" rel="noreferrer" style={{ color: 'inherit' }}>
      {entry.label}
    </a>
  )
}
