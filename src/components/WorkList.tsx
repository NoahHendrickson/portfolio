import { useState, type CSSProperties, type ReactNode } from 'react'
import { ArrowUpRight } from '@phosphor-icons/react'
import { Shader, Dither, FlowingGradient } from 'shaders/react'
import AppLink from '../AppLink'
import Button from '../design-system/Button'
import { projects } from '../data/projects'
import { color, radius, space, type } from '../design-system/tokens'
import { useIsMobile } from '../hooks/useIsMobile'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { WORK_LIST_MAX } from '../layout'

/**
 * The Design tab. A filter rail on the left, and whatever the active filter
 * renders beside it — since Figma node `293:10433` that is one shape for every
 * filter: full-width rows, each a live shader well with the screenshots
 * floating on it over a cream caption bar. The old featured-plus-stack bento
 * and the two-up even grid are both gone.
 */

/** A live shader backdrop — the FlowingGradient palette under the well. */
type BentoShader = {
  colorA: string
  colorB: string
  colorC: string
  colorD: string
  /**
   * FlowingGradient's organic warp. Left at its 0.5 default the bands swirl
   * diagonally; near 0 they stand up as the near-vertical ribbons the no3y
   * card is drawn with.
   */
  distortion?: number
  /** Which arrangement of those bands you get. */
  seed?: number
}

/**
 * A screenshot floating on the well, written as shares of the card the file
 * draws (966 × 266) — `left` and `width` off its width, `top` off its height —
 * so the whole composition scales with the column.
 */
type Panel = {
  src: string
  alt: string
  left: string
  width: string
  /**
   * Distance from the well's top. App windows are deliberately taller than the
   * well and clip at its bottom edge, the way the frames draw them.
   */
  top?: string
  /** Flat art (a title card, a lockup) sits whole and centred instead. */
  align?: 'center'
}

/** A row in the list. */
type ProjectCard = {
  href: string
  title: string
  /** The muted half of the caption row, seated beside the title. */
  desc: string
  /**
   * The well's FlowingGradient palette. Omitted on a card that ships its whole
   * composition as `image` instead.
   */
  shader?: BentoShader
  /**
   * The composition exported whole out of Figma, filling the well in place of
   * the shader and its panels. no3y Code's frame is a fluted-glass refraction
   * over a multi-stop gradient — neither is in the pinned `shaders` v2 — so it
   * rides as flat art rather than as an approximation that drifts from the
   * file. It also spares the row a WebGL context.
   */
  image?: { src: string; alt: string }
  /** Hover colour for the card outline and the arrow. */
  accent: string
  /**
   * The well's designed box, and the frame the panel shares resolve against.
   * Defaults to the 966 × 266 the row frames draw; no3y Code's own export is
   * half again as tall, which is what gives its panels room.
   */
  aspect?: string
  panels: Panel[]
  /** The file leaves no3y Code's gradient smooth and dithers the other two. */
  dither?: boolean
}

type Filter = {
  id: string
  label: string
  cards: ProjectCard[]
}

const personal: ProjectCard[] = [
  {
    href: '/work/no3y-code',
    title: 'no3y Code',
    desc: 'no3y Code is my fork of T3 Code, an agent and harness orchestration tool.',
    accent: '#6f5efb',
    aspect: '4423 / 1460',
    image: {
      src: '/work/bento/no3y-card.jpg',
      alt: 'no3y Code — the thread sidebar, the composer and design mode’s properties panel over a fluted gradient',
    },
    panels: [],
  },
  {
    href: '/work/stat-builder',
    title: projects['stat-builder'].title,
    desc: '3rd party tool for the Destiny 2 community',
    shader: { colorA: '#d4600d', colorB: '#ef7310', colorC: '#ff8b12', colorD: '#ffcc7c' },
    dither: true,
    accent: '#c56430',
    panels: [
      {
        src: '/work/bento/shot-stat-builder.png',
        alt: 'D2 Stat Builder — the armor table beside the stat sliders',
        left: '17.184%',
        top: '17.293%',
        width: '65.838%',
      },
    ],
  },
  {
    href: '/work/armory',
    title: projects.armory.title,
    desc: 'A command-palette-style filter and search for Destiny 2 weapons.',
    shader: { colorA: '#0d6e2b', colorB: '#12903a', colorC: '#1aab4a', colorD: '#26e875' },
    dither: true,
    accent: '#128a45',
    panels: [
      {
        src: '/work/bento/shot-armory.png',
        alt: 'Moonfang Armory — the command palette filtering Destiny 2 weapons',
        left: '23.395%',
        top: '19.173%',
        width: '53.106%',
      },
    ],
  },
]

/**
 * The Invisible work. Each card goes straight to its case study; that page
 * shows the password form when locked, so Back from there is this list rather
 * than a leftover index.
 */
const career: ProjectCard[] = [
  {
    href: '/work/invisible/onboarding',
    title: 'Revitalizing Meridial’s onboarding flow',
    desc: 'Design lead on Invisible’s onboarding platform.',
    shader: { colorA: '#2d6f9c', colorB: '#3f8dbd', colorC: '#57a8d5', colorD: '#8fc9e6' },
    dither: true,
    accent: '#3d85b5',
    // The Career shots are near enough in aspect (1.57 and 1.64) that the D2
    // row's placement reads as a pair across both cards.
    panels: [
      {
        src: '/work/bento/shot-invisible-onboarding.png',
        alt: 'Meridial onboarding — the profile step of the redesigned flow',
        left: '17.184%',
        top: '17.293%',
        width: '65.838%',
      },
    ],
  },
  {
    href: '/work/invisible/synapse',
    title: 'Launching new AI training interfaces',
    desc: 'Launch design lead on Invisible’s annotations platform.',
    shader: { colorA: '#3a2557', colorB: '#4a3070', colorC: '#5d3d8c', colorD: '#8163b8' },
    dither: true,
    accent: '#563a80',
    panels: [
      {
        src: '/work/bento/shot-invisible-synapse.png',
        alt: 'Synapse — two model responses beside the task panel',
        left: '17.184%',
        top: '17.293%',
        width: '65.838%',
      },
    ],
  },
]

const graphic: ProjectCard[] = [
  {
    href: '/work/how-to-pc',
    title: projects['how-to-pc'].title,
    desc: 'An overview of the parts, and the order to install them in.',
    // Pink at the same lightness and saturation as the D2 card's orange.
    shader: { colorA: '#c81f74', colorB: '#d62782', colorC: '#e7308c', colorD: '#ee549f' },
    dither: true,
    accent: '#e7308c',
    panels: [
      {
        // Flat art rather than an app window, so it sits whole and centred.
        src: '/work/how-to-pc/thumbnail.png',
        alt: 'How to Build a PC — the infographic’s title card',
        left: '27%',
        width: '46%',
        align: 'center',
      },
    ],
  },
  {
    href: '/work/nacho-box',
    title: projects['nacho-box'].title,
    desc: 'A chips-and-salsa box — hand-drawn lettering, icons and patterns.',
    shader: { colorA: '#d8cc55', colorB: '#e8dd6f', colorC: '#f9f18f', colorD: '#fcf6a5' },
    dither: true,
    accent: '#b3a02f',
    panels: [
      {
        // The Hint of Lime lockup keyed off the pack's chip-pattern plate.
        src: '/work/bento/shot-nacho-lime.png',
        alt: 'Nacho Box — the Hint of Lime lockup',
        left: '34%',
        width: '32%',
        align: 'center',
      },
    ],
  },
]

const FILTERS: Filter[] = [
  { id: 'career', label: 'Career', cards: career },
  { id: 'fun', label: 'Personal projects', cards: personal },
  { id: 'graphic', label: 'Graphic Design', cards: graphic },
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

/**
 * The fill on the rail's selected filter. A raw value rather than
 * `--color-bg-cream` (#f5efe0): the July file draws it a step greyer.
 */
const CARD_CREAM = '#e6dfd2'

/**
 * The caption bar under each well. Greyer again than the rail's pill — the file
 * draws the two a step apart, so they stay two raw values rather than a token.
 */
const BAND_CREAM = '#ded9c4'

export default function WorkList() {
  const isMobile = useIsMobile()
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
          // `xs` is a 28px pill — fine as a quiet rail beside the list, small as
          // the Design tab's only navigation once the rail wraps into a touch
          // row. Mobile takes the 32 the header's own controls already run at.
          size={isMobile ? 'sm' : 'xs'}
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
    active.cards.length === 0 ? (
      <p
        key={`${activeId}-empty`}
        className="tab-content-in"
        style={{ margin: 0, fontSize: type['body-s'].fontSize, color: color.text.muted }}
      >
        Nothing here yet — still digging through the archive.
      </p>
    ) : (
      <CardList key={activeId} cards={active.cards} isMobile={isMobile} />
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
 * The list every filter renders — Figma node `293:10433`. Each row is one card:
 * a live shader well the screenshots float on, over a cream caption bar. The
 * file stacks them 342 tall on a 48px gap.
 */
function CardList({ cards, isMobile }: { cards: ProjectCard[]; isMobile: boolean }) {
  return (
    <div
      className="tab-content-in"
      style={{ display: 'flex', flexDirection: 'column', gap: space['3xl'] }}
    >
      {cards.map((card) => (
        <BentoLink key={card.href} href={card.href} ariaLabel={card.title} accent={card.accent}>
          <ProjectRowCard card={card} isMobile={isMobile} />
        </BentoLink>
      ))}
    </div>
  )
}

/** The row frames' 966 x 266 well, which every card but no3y Code is drawn at. */
const WELL_ASPECT = '966 / 266'
/** Mobile keeps the composition but stands the well up, so a shot that clips at
 *  the file's ratio has room to read at a third of the width. */
const WELL_ASPECT_MOBILE = '966 / 460'

/**
 * One row: the shader well with its floating panels, then the caption bar. The
 * well is a rounded rect in its own right — its top corners land on the card's,
 * and its bottom two curve back off the cream — so the card clips the caption
 * bar into the bottom corners and nothing else.
 */
function ProjectRowCard({ card, isMobile }: { card: ProjectCard; isMobile: boolean }) {
  const stillOnly = useMediaQuery('(prefers-reduced-motion: reduce)')
  const clipped = card.panels.filter((panel) => panel.align !== 'center')
  const centred = card.panels.filter((panel) => panel.align === 'center')
  const aspect = card.aspect ?? WELL_ASPECT

  return (
    <article
      style={{
        display: 'flex',
        flexDirection: 'column',
        borderRadius: radius['2xl'],
        background: BAND_CREAM,
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'relative',
          // Mobile stands a shader well up so a clipped shot still reads at a
          // third of the width. An `image` card has nowhere to clip to and only
          // a 4.7% margin around its panels, so it holds its own ratio and
          // simply scales down.
          aspectRatio: isMobile && !card.image ? WELL_ASPECT_MOBILE : aspect,
          borderRadius: radius['2xl'],
          overflow: 'hidden',
          // The shell's dark ground holds the well until the shader paints.
          background: color.bg.primary,
        }}
      >
        {/* A card that ships its whole composition fills the well with it. The
            well is held at the export's own ratio, so `cover` is belt-and-braces
            against a rounding gap rather than a real crop. */}
        {card.image && (
          <img
            src={card.image.src}
            alt={card.image.alt}
            loading="lazy"
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
            }}
          />
        )}

        {/* The hero's recipe at half speed and a finer pixel than its 5.
            `speed={0}` freezes the same frame when motion is reduced. */}
        {card.shader && (
          <Shader
            colorSpace="srgb"
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
          >
            <FlowingGradient
              colorA={card.shader.colorA}
              colorB={card.shader.colorB}
              colorC={card.shader.colorC}
              colorD={card.shader.colorD}
              distortion={card.shader.distortion}
              seed={card.shader.seed}
              speed={stillOnly ? 0 : 0.5}
            />
            {card.dither && <Dither colorMode="source" pixelSize={3} />}
          </Shader>
        )}

        {/* A wash of the palette's base quiets the dither while keeping the
            colour forward. The undithered well has no pattern to quiet. */}
        {card.dither && card.shader && (
          <div
            aria-hidden
            style={{
              position: 'absolute',
              inset: 0,
              background: card.shader.colorC,
              opacity: 0.4,
              pointerEvents: 'none',
            }}
          />
        )}

        {/* The clipped panels ride a layer held at the file's ratio, so their
            offsets stay design-true and the taller mobile well simply reveals
            more of each shot rather than moving anything. */}
        {clipped.length > 0 && (
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', aspectRatio: aspect }}>
            {clipped.map((panel) => (
              <img
                key={panel.src}
                src={panel.src}
                alt={panel.alt}
                loading="lazy"
                style={{
                  position: 'absolute',
                  left: panel.left,
                  top: panel.top,
                  width: panel.width,
                  height: 'auto',
                  display: 'block',
                }}
              />
            ))}
          </div>
        )}

        {centred.map((panel) => (
          <img
            key={panel.src}
            src={panel.src}
            alt={panel.alt}
            loading="lazy"
            style={{
              position: 'absolute',
              left: panel.left,
              top: '50%',
              transform: 'translateY(-50%)',
              width: panel.width,
              height: 'auto',
              display: 'block',
            }}
          />
        ))}
      </div>

      {/* The file draws this band 76 tall on 20px type. It read as the loudest
          thing in the row against the art, so it runs a step down throughout —
          16px type on a 28px line, a 12px pad and a 20px arrow. */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: space.sm,
          padding: `${space.md} ${space.xl}`,
        }}
      >
        <div
          style={{
            display: 'flex',
            // The file runs the pair on one line; mobile stacks them rather
            // than ellipsing the description away.
            flexDirection: isMobile ? 'column' : 'row',
            alignItems: isMobile ? 'flex-start' : 'center',
            gap: isMobile ? space.xs : space.sm,
            height: isMobile ? undefined : '28px',
            minWidth: 0,
            flex: '1 0 0',
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: isMobile ? '15px' : type['label-l'].fontSize,
              fontWeight: 600,
              lineHeight: 'normal',
              letterSpacing: '-0.4px',
              color: color.ink.default,
            }}
          >
            {card.title}
          </h2>
          <p
            style={{
              margin: 0,
              minWidth: 0,
              flex: isMobile ? undefined : '1 0 0',
              fontSize: isMobile ? type['body-s'].fontSize : type['body-l'].fontSize,
              fontWeight: 400,
              lineHeight: 'normal',
              color: color.ink.muted,
              ...(isMobile
                ? {}
                : { whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }),
            }}
          >
            {card.desc}
          </p>
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
        width: 20,
        height: 20,
        flexShrink: 0,
      }}
    >
      <ArrowUpRight size={20} />
    </span>
  )
}

function BentoLink({
  href,
  ariaLabel,
  accent,
  children,
}: {
  href: string
  ariaLabel: string
  /**
   * Hover colour for the outline and arrow — each card passes its own tint so
   * the hover matches the well. Unset falls back to orange.
   */
  accent?: string
  children: ReactNode
}) {
  const style: CSSProperties = {
    display: 'block',
    minWidth: 0,
    color: 'inherit',
    textDecoration: 'none',
    borderRadius: radius['2xl'],
    ['--bento-accent' as string]: accent,
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
