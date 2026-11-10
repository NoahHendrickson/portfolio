import { Fragment, useRef, useState, type ReactNode } from 'react'
import { ArrowUpRight } from '@phosphor-icons/react'
import AppLink from '../AppLink'
import Header from './Header'
import { Runs } from './ProjectIntro'
import { VARIANTS } from '../design-system/buttonStyles'
import { color, control, radius, space, type } from '../design-system/tokens'
import { useIsMobile } from '../hooks/useIsMobile'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { usePlayWhenVisible } from '../hooks/usePlayWhenVisible'
import type { EyebrowEntry, LandingVideo, ShowcaseImage } from '../data/projects'
import {
  CURVED_MAX,
  FACE_FADE,
  FACE_TILE,
  INTRO_PAD,
  LEADING,
  PAGE_BG,
  TEXT,
  TEXT_SOFT,
  sheetGap,
} from '../sheetStyle'

/*
  The project pages' shell and small pieces: the page and its column, the intro, media
  and chips and label-only links. The cards they sit on are `Curved.tsx`'s; the values
  are in `sheetStyle.ts`.
*/

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

/** The page: the shell with the face pattern in its margins, one column, the header (Back and Contact) at its top. */
export function SheetPage({ children }: { children: ReactNode }) {
  const isMobile = useIsMobile()

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
          maxWidth: CURVED_MAX,
          margin: '0 auto',
          paddingInline: isMobile ? space.lg : undefined,
          minHeight: '100vh',
        }}
      >
        <div style={{ padding: isMobile ? 0 : `${space.lg} 0` }}>
          <Header leading="back" showProfile={false} barInset="0px" />
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
  inset,
  bodySize = '16px',
  iconSize = 36,
  children,
}: {
  /** The side padding, where it isn't the top and bottom's. */
  inset?: number
  /** The helper and description's size. */
  bodySize?: string
  iconSize?: number
  icon?: string
  title: string
  helper?: string | EyebrowEntry[]
  description: string[]
  links?: { label: string; href: string }[]
  children?: ReactNode
}) {
  const isMobile = useIsMobile()
  const entries = helper === undefined ? [] : typeof helper === 'string' ? [helper] : helper
  return (
    <header
      style={{
        paddingBlock: isMobile ? space.xl : INTRO_PAD,
        paddingInline: inset !== undefined ? inset : isMobile ? space.xl : INTRO_PAD,
        display: 'flex',
        flexDirection: 'column',
        gap: space.xl,
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: space.md }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: space.md }}>
          {icon && <img src={icon} alt="" width={iconSize} height={iconSize} style={{ display: 'block', flexShrink: 0 }} />}
          <h1 style={{ margin: 0, fontSize: '28px', fontWeight: 500, lineHeight: LEADING, textWrap: 'balance' }}>
            {title}
          </h1>
        </div>
        {/* The body copy's 16, like the description (Nov 4 2026; the frame's 20 read too big). */}
        {entries.length > 0 && (
          <p style={{ margin: 0, fontSize: bodySize, lineHeight: LEADING, color: TEXT_SOFT }}>
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
        <p key={paragraph} style={{ margin: 0, fontSize: bodySize, lineHeight: LEADING, color: TEXT_SOFT, textWrap: 'balance' }}>
          {paragraph}
        </p>
      ))}
      {children}
      {!!links?.length && <SheetLinks links={links} />}
    </header>
  )
}

/** A looping clip across its box; the poster under reduced motion. */
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

/** A still across its box. */
export function SheetImg({ shot, priority = false }: { shot: ShowcaseImage; priority?: boolean }) {
  return (
    <img
      src={shot.src}
      srcSet={shot.srcSet}
      // A lazy image is sized by its own box (`auto`); the px is for browsers without it.
      sizes={shot.srcSet ? 'auto, (max-width: 900px) 100vw, 560px' : undefined}
      alt={shot.alt}
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : 'auto'}
      decoding="async"
      style={{ display: 'block', width: '100%', height: 'auto', aspectRatio: shot.aspect }}
    />
  )
}

/**
 * A static label on the `ghost` button's palette (the Back pill's) at the `xs` control
 * height — a fact, not a control, so it takes no hover state. `filled` swaps the outline
 * for a low-opacity fill, the curved page's take.
 */
export function Chip({ children, filled = false }: { children: ReactNode; filled?: boolean }) {
  const colors = VARIANTS.ghost.default
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        height: control.xs,
        boxSizing: 'border-box',
        padding: `0 ${space.md}`,
        borderRadius: radius.full,
        border: filled ? 'none' : `1px solid ${colors.borderColor}`,
        background: filled ? color.bg.tint : colors.background,
        color: colors.color,
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
