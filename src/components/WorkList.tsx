import { useState, type CSSProperties, type ReactNode } from 'react'
import { ArrowSquareOut, ArrowUpRight, GithubLogo } from '@phosphor-icons/react'
import AppLink from '../AppLink'
import Button from '../design-system/Button'
import IconButton from '../design-system/IconButton'
import { color, radius, space, type } from '../design-system/tokens'
import { useIsMobile } from '../hooks/useIsMobile'
import { navigate } from '../navigation'

/**
 * The Design tab. A filter rail on the left; Personal / For-fun projects use the
 * WorkBento from Figma node `136:10637`, Career keeps the divided list rows.
 */

type Link = { kind: 'site' | 'repo'; href: string }

type Row = {
  id: string
  title: string
  /** Logo beside the title. Sized to fit a 16px box, so wordless marks stay legible. */
  logo?: { src: string; width: number; height: number }
  /** Tight line under the title (role + dates). Sits closer than `body`. */
  subhead?: string
  body?: string
  /** `/...` route for the "View" button. Omitted while the page is undesigned. */
  showcase?: string
  links: Link[]
}

type Filter = { id: string; label: string; rows: Row[]; layout?: 'bento' | 'list' }

const career: Row[] = [
  {
    id: 'invisible',
    title: 'Senior Product Designer - Invisible Technologies',
    subhead: 'Aug 2022 – July 2026.',
    showcase: '/work/invisible',
    links: [],
  },
]

const FILTERS: Filter[] = [
  { id: 'career', label: 'Career', rows: career, layout: 'list' },
  { id: 'fun', label: 'Personal projects', rows: [], layout: 'bento' },
  { id: 'graphic', label: 'Graphic Design', rows: [], layout: 'list' },
]

/** Flip to true when the Personal projects bento is ready to ship. */
const SHOW_PERSONAL_BENTO = false

/** Card surfaces from the bento — tint stacks at three opacities in the file. */
const CARD_BG = {
  featured: 'rgba(255, 255, 255, 0.12)',
  raised: color.bg.tint,
  muted: 'rgba(255, 255, 255, 0.04)',
} as const

const FRAME_BORDER = '#4a4c4d'
const FRAME_BORDER_SM = '#373737'
const FRAME_BG = '#202124'

export default function WorkList() {
  const isMobile = useIsMobile()
  const [activeId, setActiveId] = useState(FILTERS[0].id)
  const active = FILTERS.find((f) => f.id === activeId) ?? FILTERS[0]

  const rail = (
    <div
      style={{
        display: 'flex',
        flexDirection: isMobile ? 'row' : 'column',
        flexWrap: isMobile ? 'wrap' : undefined,
        alignItems: 'flex-start',
        gap: space.sm,
      }}
    >
      {FILTERS.map((filter) => (
        <Button
          key={filter.id}
          size="xs"
          // The active filter is the one filled pill in the rail; the rest read as
          // plain labels until hovered, so the rail stays quiet beside the list.
          variant={filter.id === activeId ? 'secondary' : 'ghost'}
          onClick={() => setActiveId(filter.id)}
          aria-pressed={filter.id === activeId}
          style={filter.id === activeId ? undefined : { borderColor: 'transparent' }}
        >
          {filter.label}
        </Button>
      ))}
    </div>
  )

  const list =
    active.layout === 'bento' && SHOW_PERSONAL_BENTO ? (
      <WorkBento isMobile={isMobile} />
    ) : active.layout === 'bento' || active.rows.length === 0 ? (
      <p
        key={`${activeId}-empty`}
        className="tab-content-in"
        style={{ margin: 0, fontSize: type['body-s'].fontSize, color: color.text.muted }}
      >
        {active.layout === 'bento' ? 'Coming soon' : 'Nothing here yet — still digging through the archive.'}
      </p>
    ) : (
      <div style={{ display: 'flex', flexDirection: 'column', gap: space.xl }}>
        {active.rows.map((row, i) => (
          <ProjectRow key={row.id} row={row} index={i} isMobile={isMobile} />
        ))}
      </div>
    )

  if (isMobile) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: space.xl }}>
        {rail}
        {list}
      </div>
    )
  }

  // 114px rail + an 80px gutter, matching the Figma file's 80 / 194 / 1240 columns.
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'max-content minmax(0, 1fr)', gap: space['5xl'] }}>
      {rail}
      {list}
    </div>
  )
}

/** Featured + two stacked cards — Figma `WorkBento` / `136:10364`. */
function WorkBento({ isMobile }: { isMobile: boolean }) {
  return (
    <div
      className="tab-content-in"
      style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : 'minmax(0, 1.9fr) minmax(0, 1fr)',
        gap: space.xl,
        alignItems: 'stretch',
      }}
    >
      <BentoLink href="/work/forge" ariaLabel="no3y Code">
        <article
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: space['2xl'],
            height: '100%',
            padding: space['2xl'],
            borderRadius: radius['3xl'],
            background: CARD_BG.featured,
            overflow: 'hidden',
            boxSizing: 'border-box',
          }}
        >
          <div
            style={{
              width: '100%',
              aspectRatio: '3456 / 2044',
              borderRadius: '3.281px',
              border: `0.234px solid ${FRAME_BORDER}`,
              overflow: 'hidden',
              background: FRAME_BG,
              flexShrink: 0,
            }}
          >
            <img
              src="/work/bento/no3y-code.png"
              alt="no3y Code — agent orchestration and design mode"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          </div>

          <div
            style={{
              display: 'flex',
              gap: '10px',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', minWidth: 0, flex: 1 }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <p
                  style={{
                    margin: 0,
                    fontSize: '14px',
                    fontWeight: 500,
                    lineHeight: '21px',
                    color: color.text.muted,
                  }}
                >
                  Agent orchestration UI + Design mode (T3 Code fork)
                </p>
                <h2
                  style={{
                    margin: 0,
                    fontSize: isMobile ? '28px' : '34px',
                    fontWeight: 500,
                    lineHeight: 'normal',
                    letterSpacing: '-0.68px',
                    color: color.text.primary,
                  }}
                >
                  no3y Code
                </h2>
              </div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: space.lg,
                  fontSize: type['body-l'].fontSize,
                  fontWeight: 400,
                  lineHeight: 'normal',
                  color: color.text.secondary,
                  maxWidth: '405px',
                }}
              >
                <p style={{ margin: 0 }}>
                  Experimental Figma-style design mode for your own app, in your own browser that
                  hands its edits to whatever AI coding agent you already use.
                </p>
                <p style={{ margin: 0 }}>*UI is largely unfinished</p>
              </div>
            </div>
            <CardArrow />
          </div>
        </article>
      </BentoLink>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: space.xl,
          minWidth: 0,
          height: isMobile ? undefined : '100%',
        }}
      >
        <BentoLink href="/work/stat-builder" ariaLabel="D2 Stat Builder" fill={!isMobile}>
          <SmallCard
            tone="raised"
            eyebrow="Destiny 2 - 3rd party tool"
            title="D2 Stat Builder"
            image={
              <div
                style={{
                  width: '100%',
                  borderRadius: '2.476px',
                  border: `0.155px solid ${FRAME_BORDER_SM}`,
                  overflow: 'hidden',
                  background: FRAME_BG,
                  flex: '1 1 auto',
                  minHeight: 0,
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <img
                  src="/work/browser-bar.png"
                  alt=""
                  style={{ width: '100%', height: 'auto', display: 'block', flexShrink: 0 }}
                />
                <div style={{ position: 'relative', flex: '1 1 auto', minHeight: 120, overflow: 'hidden' }}>
                  <img
                    src="/work/bento/stat-builder.png"
                    alt="D2 Stat Builder armor optimizer"
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '284%',
                      maxWidth: 'none',
                      display: 'block',
                    }}
                  />
                </div>
              </div>
            }
          />
        </BentoLink>

        <BentoLink href="https://noeyarmory.vercel.app/" ariaLabel="Moonfang Armory" external fill={!isMobile}>
          <SmallCard
            tone="muted"
            eyebrow="Destiny 2 - 3rd party tool"
            title="Moonfang Armory"
            image={
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  flex: '1 1 auto',
                  minHeight: 120,
                  borderRadius: radius.lg,
                  overflow: 'hidden',
                }}
              >
                <img
                  src="/work/bento/armory.png"
                  alt="Moonfang Armory weapon browser"
                  style={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'top',
                    display: 'block',
                  }}
                />
              </div>
            }
          />
        </BentoLink>
      </div>
    </div>
  )
}

function SmallCard({
  tone,
  eyebrow,
  title,
  image,
}: {
  tone: 'raised' | 'muted'
  eyebrow: string
  title: string
  image: ReactNode
}) {
  return (
    <article
      style={{
        // Image flexes to fill extra height; padding stays even on all sides
        // (justify-end was parking leftover space above the shot).
        display: 'flex',
        flexDirection: 'column',
        gap: space['2xl'],
        minHeight: '150px',
        padding: space.xl,
        borderRadius: radius['3xl'],
        background: CARD_BG[tone],
        overflow: 'hidden',
        boxSizing: 'border-box',
        height: '100%',
      }}
    >
      {image}
      <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0, flexShrink: 0 }}>
        <p
          style={{
            margin: 0,
            fontSize: '14px',
            fontWeight: 400,
            lineHeight: '21px',
            color: color.text.secondary,
          }}
        >
          {eyebrow}
        </p>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: space.sm,
            minHeight: '25px',
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: '22px',
              fontWeight: 500,
              lineHeight: 'normal',
              letterSpacing: '-0.44px',
              color: color.text.primary,
              whiteSpace: 'nowrap',
            }}
          >
            {title}
          </h2>
          <CardArrow />
        </div>
      </div>
    </article>
  )
}

function CardArrow() {
  return (
    <span
      aria-hidden
      className="work-bento-arrow"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 24,
        height: 24,
        flexShrink: 0,
      }}
    >
      <ArrowUpRight size={24} />
    </span>
  )
}

function BentoLink({
  href,
  ariaLabel,
  external,
  fill,
  children,
}: {
  href: string
  ariaLabel: string
  external?: boolean
  /** Stretch to fill a flex column cell (desktop side cards). */
  fill?: boolean
  children: ReactNode
}) {
  const style: CSSProperties = {
    display: 'block',
    minWidth: 0,
    minHeight: 0,
    color: 'inherit',
    textDecoration: 'none',
    borderRadius: radius['3xl'],
    flex: fill ? '1 1 0' : undefined,
  }

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={ariaLabel}
        className="work-bento-card"
        style={style}
      >
        {children}
      </a>
    )
  }

  return (
    <AppLink href={href} aria-label={ariaLabel} className="work-bento-card" style={style}>
      {children}
    </AppLink>
  )
}

const ROW_STAGGER_MS = 60

const titleStyle: CSSProperties = {
  fontSize: type['body-l'].fontSize,
  fontWeight: 400,
  lineHeight: 1.6,
  letterSpacing: '-0.16px',
  color: color.text.primary,
  whiteSpace: 'nowrap',
}

function ProjectRow({
  row,
  index,
  isMobile,
}: {
  row: Row
  index: number
  isMobile: boolean
}) {
  const bodyStyle: CSSProperties = {
    margin: 0,
    minWidth: 0,
    flex: '1 1 0',
    fontSize: type['body-l'].fontSize,
    fontWeight: 400,
    lineHeight: 1.6,
    letterSpacing: '-0.16px',
    color: color.text.muted,
    // Desktop matches the file's single-line row; mobile lets the blurb wrap.
    ...(isMobile
      ? {}
      : { whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }),
  }

  return (
    <div
      className="tab-content-in"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: space.lg,
        paddingBottom: space.lg,
        borderBottom: `1px solid ${color.border.subtle}`,
        // Cascades each row after the previous when the Design tab (or filter) mounts.
        animationDelay: `${index * ROW_STAGGER_MS}ms`,
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: row.subhead ? space.xs : 0, minWidth: 0 }}>
        <div
          style={{
            display: 'flex',
            alignItems: isMobile ? 'flex-start' : 'center',
            gap: space.sm,
            minWidth: 0,
            flexWrap: isMobile ? 'wrap' : undefined,
          }}
        >
          {row.logo && (
            <img
              src={row.logo.src}
              alt=""
              style={{
                width: `${row.logo.width}px`,
                height: `${row.logo.height}px`,
                display: 'block',
                flexShrink: 0,
                marginTop: isMobile ? '4px' : undefined,
              }}
            />
          )}
          <span style={titleStyle}>{row.title}</span>
          {row.body && <p style={bodyStyle}>{row.body}</p>}
        </div>
        {row.subhead && (
          <p
            style={{
              margin: 0,
              fontSize: type['body-s'].fontSize,
              fontWeight: 400,
              lineHeight: 1.5,
              color: color.text.muted,
            }}
          >
            {row.subhead}
          </p>
        )}
      </div>

      {(row.showcase || row.links.length > 0) && (
        <div style={{ display: 'flex', alignItems: 'center', gap: space.sm }}>
          {row.showcase && (
            <Button
              size="xs"
              variant="ghost"
              onClick={() => { navigate(row.showcase!) }}
            >
              View
            </Button>
          )}
          {row.links.map((link) => (
            <IconButton
              key={link.href}
              size="xs"
              variant="ghost"
              label={link.kind === 'site' ? `${row.title} — live site` : `${row.title} — source on GitHub`}
              icon={link.kind === 'site' ? <ArrowSquareOut size={14} /> : <GithubLogo size={14} />}
              onClick={() => window.open(link.href, '_blank', 'noopener,noreferrer')}
            />
          ))}
        </div>
      )}
    </div>
  )
}
