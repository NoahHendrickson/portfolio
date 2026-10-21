import { useState, type ReactNode } from 'react'
import { ArrowSquareOut } from '@phosphor-icons/react'
import { HOVER_OPACITY, resolvePalette, type ButtonVariant } from '../design-system/buttonStyles'
import { color, control, radius, space, type } from '../design-system/tokens'
import { useIsMobile } from '../hooks/useIsMobile'
import AppLink from '../AppLink'
import { PROJECT_COPY_MAX, projectWide } from '../layout'
import type { EyebrowEntry, Paragraph, Prose, TextRun } from '../data/projects'

/*
  The top of every project page, so each one opens the same way: the title, a
  muted line of helper text under it, the description, anything the page adds
  (a list, the study's Role / Team), then the actions. Always left-aligned on
  one measure, whatever the page below does — `Header` above it carries Back
  and Contact on the page's outer edges.

  Colours are theme vars only, so a page that re-points them (the Meridial
  onboarding study) gets the same block in its own palette.
*/

/**
 * The measure for the block's copy — the shared `PROJECT_COPY_MAX`, so the
 * intro and every section run one measure. The
 * title isn't held to it: it runs the page's full column, so a long title
 * stays on one line wherever it fits and only wraps (balanced) where it can't.
 */
const INTRO_MEASURE = PROJECT_COPY_MAX

/**
 * no3y Code's Github pill — the file's purple → pink → peach wash, not the
 * orange accent. Stops measured off node 317:25669.
 */
const NO3Y_CTA =
  'linear-gradient(to right, rgba(131,113,255,0.8) 0%, rgba(255,139,219,0.8) 53.365%, rgba(247,187,163,0.8) 100%)'

const HELPER_STYLE: React.CSSProperties = {
  margin: 0,
  fontSize: '16px',
  fontWeight: 500,
  lineHeight: '24px',
  color: color.text.muted,
}

const toParagraphs = (text: Prose): Paragraph[] => (typeof text === 'string' ? [text] : text)

export default function ProjectIntro({
  title,
  helper,
  description,
  actions,
  children,
}: {
  title: ReactNode
  /** The muted line under the title. Several entries read as one row split by hairlines. */
  helper?: string | EyebrowEntry[]
  /** The lede — one or two short paragraphs saying what the project is. */
  description: Prose
  /** Pills under everything else — `OutLink`s, usually the accent one first. */
  actions?: ReactNode
  /** Anything between the description and the actions: a list, a facts row. */
  children?: ReactNode
}) {
  const isMobile = useIsMobile()
  const entries = helper === undefined ? [] : Array.isArray(helper) ? helper : [helper]

  return (
    <header
      style={{
        width: '100%',
        boxSizing: 'border-box',
        paddingTop: isMobile ? space['2xl'] : space['4xl'],
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: space.xl,
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: space.md }}>
          <h1
            style={{
              margin: 0,
              fontSize: isMobile ? '40px' : 'clamp(48px, 5vw, 64px)',
              fontWeight: 500,
              lineHeight: 1.05,
              letterSpacing: '-0.025em',
              textWrap: 'balance',
              color: color.text.primary,
            }}
          >
            {title}
          </h1>

          {entries.length > 0 && (
            <SplitRow>
              {entries.map((entry, i) => (
                <Helper key={i} entry={entry} />
              ))}
            </SplitRow>
          )}
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: space.lg,
            marginTop: space.sm,
            maxWidth: `${INTRO_MEASURE}px`,
          }}
        >
          {toParagraphs(description).map((paragraph, i) => (
            <p
              key={i}
              style={{
                margin: 0,
                ...type['body-xl'],
                color: color.text.primary,
              }}
            >
              {typeof paragraph === 'string' ? paragraph : <Runs runs={paragraph} />}
            </p>
          ))}
        </div>

        {children && <div style={{ maxWidth: `${INTRO_MEASURE}px` }}>{children}</div>}

        {actions && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: space.md, marginTop: space.sm }}>{actions}</div>
        )}
      </div>
    </header>
  )
}

/**
 * A project page's section heading — the Meridial onboarding study's, shared so
 * every page's sections read alike. Colour inherits, so a page that re-points
 * the theme (onboarding) or sets its own ink gets it for free.
 */
export function SectionHeading({ children, id, style }: { children: ReactNode; id?: string; style?: React.CSSProperties }) {
  const isMobile = useIsMobile()
  return (
    <h2
      id={id}
      style={{
        margin: 0,
        fontSize: isMobile ? '28px' : '32px',
        fontWeight: 500,
        lineHeight: 1.15,
        letterSpacing: '-0.015em',
        textWrap: 'balance',
        ...style,
      }}
    >
      {children}
    </h2>
  )
}

/**
 * A section's opening on a project page: the heading with its copy under it,
 * flush left on the copy measure. Whatever the section shows sits under this
 * across the column, `PROJECT_STACK_GAP` down.
 */
export function SectionCopy({
  heading,
  id,
  headingStyle,
  children,
}: {
  heading: ReactNode
  id?: string
  headingStyle?: React.CSSProperties
  children?: ReactNode
}) {
  const isMobile = useIsMobile()
  return (
    <div
      style={{
        width: '100%',
        maxWidth: `${PROJECT_COPY_MAX}px`,
        display: 'flex',
        flexDirection: 'column',
        gap: isMobile ? '20px' : space.xl,
      }}
    >
      <SectionHeading id={id} style={headingStyle}>
        {heading}
      </SectionHeading>
      {children}
    </div>
  )
}

/**
 * A section's media on a project page: wider than the text column, out to
 * the hero's `PROJECT_WIDE_MAX` and centred on the column, so screenshots get
 * the room while the copy keeps its edge. The column on mobile. Must be a
 * direct child of a block the column's full width.
 */
export function WideMedia({ children, style }: { children: ReactNode; style?: React.CSSProperties }) {
  const isMobile = useIsMobile()
  return <div style={{ ...(isMobile ? { width: '100%' } : projectWide()), ...style }}>{children}</div>
}

/**
 * Supporting copy under the description — a second paragraph, a feature list.
 * The lede's size on the secondary ink; children inherit it.
 */
export function IntroBody({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: space.md,
        ...type['body-xl'],
        color: color.text.secondary,
      }}
    >
      {children}
    </div>
  )
}

/**
 * A short list as one row split by hairlines rather than a bulleted column —
 * no3y Code's features — so it costs a line of the intro, not four, and the
 * hero still shows on landing. Brighter than the helper row above it.
 */
export function IntroList({ items }: { items: string[] }) {
  return (
    <SplitRow>
      {items.map((item) => (
        <p key={item} style={{ ...HELPER_STYLE, color: color.text.secondary }}>
          {item}
        </p>
      ))}
    </SplitRow>
  )
}

/**
 * Entries in one wrapping row split by hairlines. Every entry carries the
 * hairline on its left, and the row is pulled left by one separator and
 * clipped — so whichever entry starts a line, the first one or one that
 * wrapped, has its hairline cut off and no line ever opens or ends on a stray
 * rule.
 */
function SplitRow({ children }: { children: ReactNode[] }) {
  return (
    <div style={{ overflow: 'hidden', maxWidth: `${INTRO_MEASURE}px` }}>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          rowGap: space.xs,
          marginLeft: `calc(-2 * ${space.lg} - 1px)`,
        }}
      >
        {children.map((child, i) => (
          <div
            key={i}
            style={{
              borderLeft: `1px solid ${color.border.subtle}`,
              padding: `0 0 0 ${space.lg}`,
              marginLeft: space.lg,
            }}
          >
            {child}
          </div>
        ))}
      </div>
    </div>
  )
}

/**
 * One entry in the helper row: plain copy, an outbound link with its icon, or
 * runs when only part of the entry links out (no3y Code's "Fork of T3 Code").
 */
function Helper({ entry }: { entry: EyebrowEntry }) {
  if (Array.isArray(entry)) {
    return (
      <p style={HELPER_STYLE}>
        <Runs runs={entry} />
      </p>
    )
  }

  if (typeof entry === 'string') return <p style={HELPER_STYLE}>{entry}</p>

  return (
    <a
      href={entry.href}
      target="_blank"
      rel="noopener noreferrer"
      style={{ ...HELPER_STYLE, display: 'inline-flex', alignItems: 'center', gap: space.xs, textDecoration: 'none' }}
    >
      {entry.label}
      <ArrowSquareOut size={16} />
    </a>
  )
}

/**
 * The parts of a paragraph the file styles on their own — a semibold, underlined
 * project name and the muted clause after it. A run with an `href` underlines
 * too, routing in-app for a `/work/…` target and opening a tab otherwise; links
 * inherit their colour so they read as emphasis rather than as browser blue.
 */
export function Runs({ runs }: { runs: TextRun[] }) {
  return (
    <>
      {runs.map((run, i) => {
        const style: React.CSSProperties = {
          color: run.muted ? color.text.muted : 'inherit',
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
 * Outbound pill — Button chrome on an `<a>` (`Button` is a <button>). Hover
 * uses `resolvePalette` so it can't drift from Button.
 */
export function OutLink({
  href,
  label,
  variant = 'ghost',
  gradient,
}: {
  href: string
  label: string
  /** `primary` for a page's one call to action; secondary links stay on the ghost pill. */
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
