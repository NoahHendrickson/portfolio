import { useState, type CSSProperties, type ReactNode } from 'react'
import { ArrowSquareOut, ArrowUpRight, GithubLogo } from '@phosphor-icons/react'
import { Shader, Dither, FlowingGradient } from 'shaders/react'
import AppLink from '../AppLink'
import Button from '../design-system/Button'
import IconButton from '../design-system/IconButton'
import { projects } from '../data/projects'
import { color, radius, space, type } from '../design-system/tokens'
import { useIsMobile } from '../hooks/useIsMobile'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { WORK_LIST_MAX } from '../layout'
import { navigate } from '../navigation'

/**
 * The Design tab. A filter rail on the left; Personal / For-fun projects use the
 * WorkBento from Figma node `273:39477` (the R3 page's full-bleed textured
 * cards), and Career and Graphic Design run the even grid of the same cards.
 * The divided list rows are still here as a layout, but no filter picks them
 * today.
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
type Filter = {
  id: string
  label: string
  rows: Row[]
  layout?: 'bento' | 'even' | 'list'
  /** Cards for an `even` filter. */
  items?: BentoItem[]
}

/** A live dither backdrop — a FlowingGradient palette, kept to one colour
 *  family so it reads as a single tone shifting gently under the dither. */
type BentoShader = {
  colorA: string
  colorB: string
  colorC: string
  colorD: string
}

/** A card in an `even` bento. */
type BentoItem = {
  href: string
  /**
   * The art floating on the live well — wants the bare window or lockup, as
   * a baked plate would sit as a flat slab over the shader.
   */
  art: string
  artAlt: string
  title: string
  eyebrow: string
  /** The card's FlowingGradient palette. */
  shader: BentoShader
  /** The floating shot's share of the well. */
  shotWidth?: string
  /** Hover accent for the outline and arrow; unset falls back to orange. */
  accent?: string
}

/**
 * The Invisible work, captioned by the client rather than the project type.
 * Each card goes straight to its case study; that page shows the password form
 * when locked, so Back from there is this list rather than a leftover index.
 */
const career: BentoItem[] = [
  {
    href: '/work/invisible/onboarding',
    art: '/work/bento/shot-invisible-onboarding.png',
    artAlt: 'Meridial onboarding — the profile step of the redesigned flow',
    title: 'Revitalizing Meridial’s onboarding flow',
    eyebrow: 'Invisible',
    shader: { colorA: '#3f8dbd', colorB: '#4a9ac9', colorC: '#57a8d5', colorD: '#6fb5dc' },
    shotWidth: '92%',
    accent: '#3d85b5',
  },
  {
    href: '/work/invisible/synapse',
    art: '/work/bento/shot-invisible-synapse.png',
    artAlt: 'Synapse — two model responses beside the task panel',
    title: 'Launching new AI training interfaces',
    eyebrow: 'Invisible',
    shader: { colorA: '#3a2557', colorB: '#402a60', colorC: '#472f69', colorD: '#553a7c' },
    shotWidth: '72%',
    accent: '#563a80',
  },
]

const graphic: BentoItem[] = [
  {
    href: '/work/how-to-pc',
    // The title card is a transparent PNG, so it floats straight on the well.
    art: '/work/how-to-pc/thumbnail.png',
    artAlt: 'How to Build a PC — the infographic’s title card',
    title: projects['how-to-pc'].title,
    eyebrow: 'Infographic',
    // Pink at the same lightness and saturation as the D2 card's orange.
    shader: { colorA: '#c81f74', colorB: '#d62782', colorC: '#e7308c', colorD: '#ee549f' },
    shotWidth: '78%',
    accent: '#e7308c',
  },
  {
    href: '/work/nacho-box',
    // The Hint of Lime lockup keyed off the pack's chip-pattern plate.
    art: '/work/bento/shot-nacho-lime.png',
    artAlt: 'Nacho Box — the Hint of Lime lockup',
    title: projects['nacho-box'].title,
    eyebrow: 'Packaging',
    shader: { colorA: '#e8dd6f', colorB: '#f0e77e', colorC: '#f9f18f', colorD: '#fcf6a5' },
    shotWidth: '62%',
    accent: '#b3a02f',
  },
]

const FILTERS: Filter[] = [
  { id: 'career', label: 'Career', rows: [], layout: 'even', items: career },
  { id: 'fun', label: 'Personal projects', rows: [], layout: 'bento' },
  { id: 'graphic', label: 'Graphic Design', rows: [], layout: 'even', items: graphic },
]

/** Survives refresh and Back — WorkList unmounts whenever you leave `/work`. */
const FILTER_KEY = 'work-filter'

function readFilter() {
  const id = sessionStorage.getItem(FILTER_KEY)
  return FILTERS.some((filter) => filter.id === id) ? id! : FILTERS[0].id
}

function writeFilter(id: string) {
  sessionStorage.setItem(FILTER_KEY, id)
}

/** Flip to true when the Personal projects bento is ready to ship. */
const SHOW_PERSONAL_BENTO = true

/**
 * The bento card surface, and the fill on the rail's selected filter so the two
 * read as one surface. A raw value rather than `--color-bg-cream` (#f5efe0):
 * the July file draws the cards a step greyer than the token.
 */
const CARD_CREAM = '#e6dfd2'

/** Side-by-side bento needs the file's ~966px list; below this the two small
 *  cards sit under the featured one instead of in a skinny right column. */
const BENTO_BESIDE_QUERY = '(min-width: 1441px)'

export default function WorkList() {
  const isMobile = useIsMobile()
  const bentoBeside = useMediaQuery(BENTO_BESIDE_QUERY)
  const [activeId, setActiveId] = useState(readFilter)
  const active = FILTERS.find((f) => f.id === activeId) ?? FILTERS[0]

  const selectFilter = (id: string) => {
    setActiveId(id)
    writeFilter(id)
  }

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
          onClick={() => selectFilter(filter.id)}
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
      <WorkBento isMobile={isMobile} beside={bentoBeside} />
    ) : active.layout === 'even' && active.items ? (
      <EvenBento
        items={active.items}
        isMobile={isMobile}
        compact={!bentoBeside && !isMobile}
      />
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
  // The list stops at the file's 1240 rather than stretching with the column on
  // a big screen; the page's own inset is what re-centres the pair.
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `max-content minmax(0, ${WORK_LIST_MAX}px)`,
        gap: space['5xl'],
      }}
    >
      {rail}
      {list}
    </div>
  )
}

/**
 * Featured + two stacked cards — Figma `WorkBento` / `273:39477` (R3). These
 * are the full-bleed textured cards: a dithered gradient under a colour tint
 * inside the cream border, with the screenshots floating on top and the title
 * in a hover overlay rather than a reveal row. The even filters keep the older
 * cream `BentoCard`.
 */
function WorkBento({ isMobile, beside }: { isMobile: boolean; beside: boolean }) {
  const compact = !beside && !isMobile

  return (
    <div
      className="tab-content-in"
      style={{
        display: 'grid',
        // 569.342 / 380.657 of the file's 966px bento, on its 16px gutter.
        gridTemplateColumns: beside ? 'minmax(0, 569.342fr) minmax(0, 380.657fr)' : '1fr',
        gap: space.lg,
        alignItems: 'stretch',
        // Stacked, the list column can run ~800px; the file's featured card is
        // 569, so cap before the shots stretch across the leaf strip.
        maxWidth: compact ? 640 : undefined,
        width: '100%',
      }}
    >
      <BentoLink href="/work/no3y-code" ariaLabel="no3y Code" accent="rgb(9, 140, 87)">
        <TexturedBentoCard
          featured
          compact={compact}
          shaderBg={{ colorA: '#0c7a49', colorB: '#128a55', colorC: '#1d9a62', colorD: '#33a873' }}
          // The file's 569.342 width, a quarter shorter than the height that
          // would square the two cards beside it (777.314).
          artAspect="569.342 / 583"
          artAlign="start"
          // The file's 32px inset and gutter, and 241.09 / 224.25 panels, as
          // shares of the card so the composition scales with the column.
          artPad="4.988%"
          artGap="6.332%"
          shots={[
            {
              src: '/work/bento/no3y-props.png',
              width: '47.708%',
              alt: "no3y Code — design mode's properties panel",
            },
            {
              src: '/work/bento/no3y-sidebar.png',
              width: '44.376%',
              alt: 'no3y Code — the agent thread sidebar',
            },
          ]}
          title="no3y Code"
          eyebrow="Forked project"
          body="no3y Code is my fork of T3 Code, an agent and harness orchestration tool."
        />
      </BentoLink>

      {/* Beside: the stack splits the featured card's height equally.
          Narrower: the two cards sit in a row under the featured one. */}
      <div
        style={{
          display: compact ? 'grid' : 'flex',
          flexDirection: 'column',
          gridTemplateColumns: '1fr 1fr',
          gap: space.lg,
          minWidth: 0,
          height: beside ? '100%' : undefined,
        }}
      >
        <BentoLink href="/work/stat-builder" ariaLabel="D2 Stat Builder" grow={beside ? 1 : undefined} accent="rgb(197, 100, 48)">
          <TexturedBentoCard
            compact={compact}
            shaderBg={{ colorA: '#a85320', colorB: '#b45c29', colorC: '#c56430', colorD: '#d47740' }}
            // Half the featured card's height less the 16px gap — slightly
            // landscape rather than square.
            artAspect="380.657 / 283.5"
            shots={[
              {
                src: '/work/bento/shot-stat-builder.png',
                width: '74.775%',
                alt: 'D2 Stat Builder — the armor table beside the stat sliders',
              },
            ]}
            title="D2 Stat Builder"
            eyebrow="Destiny 2 project"
          />
        </BentoLink>

        <BentoLink href="/work/armory" ariaLabel="Moonfang Armory" grow={beside ? 1 : undefined} accent="rgb(46, 110, 221)">
          <TexturedBentoCard
            compact={compact}
            shaderBg={{ colorA: '#2456b1', colorB: '#2a63c8', colorC: '#2e6edd', colorD: '#4a80e4' }}
            artAspect="380.657 / 283.5"
            shots={[
              {
                src: '/work/bento/shot-armory.png',
                width: '79.966%',
                alt: 'Moonfang Armory — the command palette filtering Destiny 2 weapons',
              },
            ]}
            title="Moonfang Armory"
            eyebrow="Destiny 2 project"
          />
        </BentoLink>
      </div>
    </div>
  )
}

/**
 * A full-bleed card with a live dither well — a FlowingGradient under a
 * source-coloured Dither, screenshots floating on top. The file's 4px cream
 * frame is the card's padding rather than a border, so the card is the same
 * cream-reveal build as `BentoCard` — the shader well is the mask, and
 * hovering slides it up to show the title on the cream backdrop.
 */
function TexturedBentoCard({
  shaderBg,
  artAspect,
  artAlign = 'center',
  artPad,
  artGap,
  shots,
  title,
  eyebrow,
  body,
  featured,
  compact,
}: {
  /**
   * The well's FlowingGradient palette, kept to one colour family per project
   * so it stays background-like behind the floating shots.
   */
  shaderBg: BentoShader
  /**
   * The card's outer box. The card owns the ratio — not the well — so the
   * hover reveal shrinks the art instead of ever resizing the card.
   */
  artAspect: string
  /** `start` seats the shots top-left on `artPad` (the featured panels). */
  artAlign?: 'start' | 'center'
  artPad?: string
  artGap?: string
  shots: { src: string; width: string; alt: string }[]
  title: string
  eyebrow: string
  body?: string
  featured?: boolean
  compact?: boolean
}) {
  const titleSize = featured ? (compact ? '28px' : '34px') : compact ? '18px' : '22px'
  const metaSize = compact ? '14px' : '16px'

  const titleRow = (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-end',
        gap: '10px',
        padding: `0 ${compact ? space.lg : space.xl}`,
        flexShrink: 0,
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: compact ? space.sm : '10px', minWidth: 0, flex: '1 0 0' }}>
        <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          <h2
            style={{
              margin: 0,
              fontSize: titleSize,
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
              fontSize: metaSize,
              fontWeight: 500,
              lineHeight: compact ? '18px' : '21px',
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
              fontSize: metaSize,
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
  )

  return (
    <article
      className="work-bento-art-first work-bento-tex"
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        gap: 'var(--bento-shown-gap)',
        minHeight: '150px',
        height: '100%',
        aspectRatio: artAspect.replace(/\s/g, ''),
        // The file's 4px cream frame, as padding so the reveal shares the
        // cream cards' mechanics rather than sitting outside a border.
        paddingTop: '4px',
        paddingRight: '4px',
        paddingBottom: 'var(--bento-shown-pad)',
        paddingLeft: '4px',
        borderRadius: radius['2xl'],
        background: CARD_CREAM,
        overflow: 'hidden',
        boxSizing: 'border-box',
      }}
    >
      {/* The art well — the mask that gives way to the title on hover. */}
      <div
        style={{
          position: 'relative',
          flex: '1 1 auto',
          minHeight: 0,
          // Seated 4px inside the 24px card, so the curve hugs the frame.
          borderRadius: 'calc(var(--radius-2xl) - 4px)',
          overflow: 'hidden',
          // The shell's dark ground holds the well until the shader paints.
          background: color.bg.primary,
        }}
      >
        {/* The hero's recipe at half speed and a finer pixel than its 5. */}
        <Shader
          colorSpace="srgb"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
        >
          <FlowingGradient
            colorA={shaderBg.colorA}
            colorB={shaderBg.colorB}
            colorC={shaderBg.colorC}
            colorD={shaderBg.colorD}
            speed={0.5}
          />
          <Dither colorMode="source" pixelSize={3} />
        </Shader>

        {/* A wash of the palette's base over the dither — quiets the pattern
            while keeping the colour forward. */}
        <div
          aria-hidden
          style={{
            position: 'absolute',
            inset: 0,
            background: shaderBg.colorC,
            opacity: 0.4,
            pointerEvents: 'none',
          }}
        />

        {/* Absolute so the shots' overflow can never size the well — anything
            past its bottom edge just clips. Centered shots ride between two
            spacers that split the leftover space, so they sit centered at
            rest; the top spacer stops at 24px, so the reveal cuts the mock's
            bottom edge instead of pushing it into the frame. */}
        {artAlign === 'center' ? (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <div style={{ flex: '1 1 0%', minHeight: space.xl }} />
            {shots.map((shot) => (
              <img
                key={shot.src}
                src={shot.src}
                alt={shot.alt}
                style={{ width: shot.width, height: 'auto', display: 'block', flexShrink: 0 }}
              />
            ))}
            <div style={{ flex: '1 1 0%', minHeight: 0 }} />
          </div>
        ) : (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'flex-start',
              padding: artPad,
              gap: artGap,
              boxSizing: 'border-box',
            }}
          >
            {shots.map((shot) => (
              <img
                key={shot.src}
                src={shot.src}
                alt={shot.alt}
                style={{ width: shot.width, height: 'auto', display: 'block', flexShrink: 0 }}
              />
            ))}
          </div>
        )}
      </div>

      <div className="work-bento-reveal-title">{titleRow}</div>
    </article>
  )
}

/**
 * Equal cards in a plain grid — the Career and Graphic Design filters. The
 * personal cards' `TexturedBentoCard` at the small-card ratio, so every
 * filter reads as one family.
 */
function EvenBento({
  items,
  isMobile,
  compact,
}: {
  items: BentoItem[]
  isMobile: boolean
  compact?: boolean
}) {
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
        <BentoLink key={item.href} href={item.href} ariaLabel={item.title} accent={item.accent}>
          <TexturedBentoCard
            compact={compact}
            shaderBg={item.shader}
            artAspect="380.657 / 283.5"
            shots={[{ src: item.art, width: item.shotWidth ?? '85%', alt: item.artAlt }]}
            title={item.title}
            eyebrow={item.eyebrow}
          />
        </BentoLink>
      ))}
    </div>
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
  accent,
  children,
}: {
  href: string
  ariaLabel: string
  external?: boolean
  /**
   * Share of the stack's height — the two side cards split it equally so they
   * always add up to the featured card beside them.
   */
  grow?: number
  /**
   * Hover colour for the outline and arrow — the textured cards pass their
   * tint so the hover matches the card. Unset falls back to orange.
   */
  accent?: string
  children: ReactNode
}) {
  const style: CSSProperties = {
    display: 'block',
    minWidth: 0,
    minHeight: 0,
    color: 'inherit',
    textDecoration: 'none',
    borderRadius: radius['2xl'],
    flex: grow ? `${grow} 1 0` : undefined,
    ['--bento-accent' as string]: accent,
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
    <AppLink
      href={href}
      aria-label={ariaLabel}
      className="work-bento-card"
      style={style}
    >
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
