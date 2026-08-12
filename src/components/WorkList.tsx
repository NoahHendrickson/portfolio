import { useState, type CSSProperties, type ReactNode } from 'react'
import { ArrowSquareOut, ArrowUpRight, GithubLogo } from '@phosphor-icons/react'
import AppLink from '../AppLink'
import Button from '../design-system/Button'
import IconButton from '../design-system/IconButton'
import { projects } from '../data/projects'
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

/**
 * `bento` is the Personal-projects layout (one featured card beside a stack of
 * two); `even` is a plain grid of equal cards; `list` is the divided rows.
 */
type Filter = { id: string; label: string; rows: Row[]; layout?: 'bento' | 'even' | 'list' }

/** A card in an `even` bento. */
type BentoItem = {
  href: string
  art: string
  artAlt: string
  title: string
  eyebrow: string
  /**
   * Fill behind the art, for a transparent PNG that would otherwise sit on the
   * bare cream. The other cards bake their plate into the export.
   */
  artBg?: string
}

const career: Row[] = [
  {
    id: 'invisible',
    title: 'Senior Product Designer - Invisible Technologies',
    subhead: 'Aug 2022 – July 2026.',
    showcase: '/work/invisible',
    links: [],
  },
]

const graphic: BentoItem[] = [
  {
    href: '/work/how-to-pc',
    art: '/work/how-to-pc/thumbnail.png',
    artAlt: 'How to Build a PC — the infographic’s title card',
    title: projects['how-to-pc'].title,
    eyebrow: 'Infographic',
    // The title card is a transparent PNG, so it needs its own plate. Pink at
    // the same lightness and saturation as the D2 card's orange.
    artBg: '#e7308c',
  },
  {
    href: '/work/nacho-box',
    art: '/work/nacho-box/thumbnail.png',
    artAlt: 'Nacho Box — the Hint of Lime pack art on its chip pattern',
    title: projects['nacho-box'].title,
    eyebrow: 'Packaging',
  },
]

const FILTERS: Filter[] = [
  { id: 'career', label: 'Career', rows: career, layout: 'list' },
  { id: 'fun', label: 'Personal projects', rows: [], layout: 'bento' },
  { id: 'graphic', label: 'Graphic Design', rows: [], layout: 'even' },
]

/** Flip to true when the Personal projects bento is ready to ship. */
const SHOW_PERSONAL_BENTO = true

/**
 * The bento card surface, and the fill on the rail's selected filter so the two
 * read as one surface. A raw value rather than `--color-bg-cream` (#f5efe0):
 * the July file draws the cards a step greyer than the token.
 */
const CARD_CREAM = '#e6dfd2'

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
          // The selected pill takes the cards' cream, so the rail and the bento
          // read as one surface. Secondary only dims on hover, so this holds.
          style={
            filter.id === activeId
              ? { background: CARD_CREAM, borderColor: CARD_CREAM, color: color.ink.default }
              : { borderColor: 'transparent' }
          }
        >
          {filter.label}
        </Button>
      ))}
    </div>
  )

  const list =
    active.layout === 'bento' && SHOW_PERSONAL_BENTO ? (
      <WorkBento isMobile={isMobile} />
    ) : active.layout === 'even' ? (
      <EvenBento items={graphic} isMobile={isMobile} />
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

/**
 * Featured + two stacked cards — Figma `WorkBento` / `249:31730`. The July redo
 * turned the cards cream, so everything inside them runs on the **ink** ramp
 * rather than the dark shell's text ramp.
 */
function WorkBento({ isMobile }: { isMobile: boolean }) {
  return (
    <div
      className="tab-content-in"
      style={{
        display: 'grid',
        // 625.078 / 324.922 of the file's 966px bento, on its 16px gutter.
        gridTemplateColumns: isMobile ? '1fr' : 'minmax(0, 625.078fr) minmax(0, 324.922fr)',
        gap: space.lg,
        alignItems: 'stretch',
      }}
    >
      <BentoLink href="/work/no3y-code" ariaLabel="no3y Code">
        <BentoCard
          featured
          art="/work/bento/card-no3y-code.jpg"
          artAlt="no3y Code — the thread sidebar beside design mode's properties panel"
          artAspect="609.078 / 362.942"
          title="no3y Code"
          eyebrow="Forked project"
          body="no3y Code is my fork of T3 Code, an agent and harness orchestration tool."
        />
      </BentoLink>

      {/* The stack splits the featured card's height 266.942 / 245 in the file. */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: space.lg,
          minWidth: 0,
          height: isMobile ? undefined : '100%',
        }}
      >
        <BentoLink href="/work/stat-builder" ariaLabel="D2 Stat Builder" grow={isMobile ? undefined : 266.942}>
          <BentoCard
            art="/work/bento/card-stat-builder.jpg"
            artAlt="D2 Stat Builder — the armor table on its orange card"
            artAspect="308.922 / 168.942"
            title="D2 Stat Builder"
            eyebrow="Destiny 2 project"
          />
        </BentoLink>

        <BentoLink href="/work/armory" ariaLabel="Moonfang Armory" grow={isMobile ? undefined : 245}>
          <BentoCard
            art="/work/bento/card-armory.jpg"
            artAlt="Moonfang Armory — the command palette filtering Destiny 2 weapons"
            artAspect="308.922 / 147"
            title="Moonfang Armory"
            eyebrow="Destiny 2 project"
          />
        </BentoLink>
      </div>
    </div>
  )
}

/**
 * Equal cards in a plain grid — the Graphic Design filter. They share the small
 * bento card's art ratio so the two filters read as one family.
 */
function EvenBento({ items, isMobile }: { items: BentoItem[]; isMobile: boolean }) {
  return (
    <div
      className="tab-content-in"
      style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : `repeat(${items.length}, minmax(0, 1fr))`,
        gap: space.lg,
        alignItems: 'stretch',
      }}
    >
      {items.map((item) => (
        <BentoLink key={item.href} href={item.href} ariaLabel={item.title}>
          <BentoCard
            art={item.art}
            artAlt={item.artAlt}
            artAspect="308.922 / 168.942"
            artBg={item.artBg}
            title={item.title}
            eyebrow={item.eyebrow}
          />
        </BentoLink>
      ))}
    </div>
  )
}

/**
 * One card: art in a rounded well, then the title block with the arrow pinned to
 * its baseline. The art fills whatever height the stack gives it, so `artAspect`
 * only sets the card's natural height.
 */
function BentoCard({
  art,
  artAlt,
  artAspect,
  artBg,
  title,
  eyebrow,
  body,
  featured,
}: {
  art: string
  artAlt: string
  artAspect: string
  /** Fill behind a transparent art PNG; the other cards bake their plate in. */
  artBg?: string
  title: string
  eyebrow: string
  body?: string
  featured?: boolean
}) {
  return (
    <article
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        gap: space.lg,
        minHeight: '150px',
        height: '100%',
        // 8 on three sides, 24 under the copy.
        padding: `${space.sm} ${space.sm} ${space.xl}`,
        borderRadius: radius['3xl'],
        background: CARD_CREAM,
        overflow: 'hidden',
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          width: '100%',
          aspectRatio: artAspect.replace(/\s/g, ''),
          flex: '1 1 auto',
          minHeight: 0,
          borderRadius: radius['2xl'],
          overflow: 'hidden',
          background: artBg,
        }}
      >
        <img
          src={art}
          alt={artAlt}
          style={{
            width: '100%',
            height: '100%',
            // A transparent PNG on a plate is artwork, not a screenshot — fit it
            // whole rather than cropping to fill.
            objectFit: artBg ? 'contain' : 'cover',
            display: 'block',
          }}
        />
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          gap: '10px',
          padding: `0 ${space.xl}`,
          flexShrink: 0,
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', minWidth: 0, flex: '1 0 0' }}>
          <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
            <h2
              style={{
                margin: 0,
                fontSize: featured ? '34px' : '22px',
                fontWeight: featured ? 600 : 500,
                lineHeight: 'normal',
                letterSpacing: featured ? '-0.68px' : '-0.44px',
                color: color.ink.default,
              }}
            >
              {title}
            </h2>
            <p
              style={{
                margin: 0,
                fontSize: '16px',
                fontWeight: 500,
                lineHeight: '21px',
                color: color.ink.muted,
              }}
            >
              {eyebrow}
            </p>
          </div>
          {body && (
            <p
              style={{
                margin: 0,
                fontSize: '16px',
                fontWeight: 400,
                lineHeight: 'normal',
                color: color.ink.secondary,
                maxWidth: '405px',
              }}
            >
              {body}
            </p>
          )}
        </div>
        <CardArrow />
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
  grow,
  children,
}: {
  href: string
  ariaLabel: string
  external?: boolean
  /**
   * Share of the stack's height, as the file's card heights (266.942 / 245), so
   * the two side cards always add up to the featured card beside them.
   */
  grow?: number
  children: ReactNode
}) {
  const style: CSSProperties = {
    display: 'block',
    minWidth: 0,
    minHeight: 0,
    color: 'inherit',
    textDecoration: 'none',
    borderRadius: radius['3xl'],
    flex: grow ? `${grow} 1 0` : undefined,
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
