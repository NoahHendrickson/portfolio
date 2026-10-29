import { useState, type ReactNode } from 'react'
import { color, control, radius, space, type } from '../design-system/tokens'
import AppLink from '../AppLink'
import {
  CRISP_CARD,
  NO3Y_CARD,
  ONBOARDING_CARD,
  STAT_BUILDER_CARD,
  type WorkCard,
} from '../data/workCards'
import { useIsMobile } from '../hooks/useIsMobile'
import LeafMark from './LeafMark'
import Popover from './Popover'

const TEXT = color.text.primary
const MUTED = color.text.muted
const AVATAR = 26
const PREVIEW = 200
/** A card thumbnail's width in its popover. */
const THUMB = 360
/**
 * A card popover's caption row: inset 4 all round inside the panel's cream
 * and 4 under the art, so the View button has 8 above it and 8 below — 12
 * above read as the button sitting low — and as tall as the button plus that
 * inset. The name sits a further `CAPTION_LEAD` in, 12 off the panel's edge.
 */
const CAPTION_INSET = 4
const CAPTION_GAP = 4
const CAPTION_LEAD = 4
const CAPTION_H = 32 + CAPTION_INSET * 2

/** A box out of a card's art, which is `size` (its master's pixels) whole. */
type Crop = { size: [number, number]; x: number; y: number; w: number; h: number }

/**
 * Onboarding's thumbnail is a crop of its 1810 × 1000 card, tight round the
 * window so it fills the frame, still running off the foot as it does on the
 * Work tab: 60 either side of the window (the export sits it 27px right of
 * centre, so the crop recentres it) and 60 above.
 */
const ONBOARDING_CROP: Crop = { size: [1810, 1000], x: 148, y: 82, w: 1568, h: 918 }
/**
 * The "explore, design, build and iterate faster" popover hangs two small
 * cream cards off its tab instead of one panel: no3y Code in front on the
 * left, tipped left side down, and Crisp behind it on the right, tipped right
 * side down. Each turns about one of the tab's bottom corners — its top edge
 * leaves the tab exactly there — and reaches `FAN_REACH` past it, so the two
 * fan out from the tab and cross under its middle. Each card is the
 * popover's panel over again — the same thin `FAN_PAD` of cream round its
 * Work card art (whole, the same 1392 : 769, so it keeps its backdrop) at
 * the panel's 12 corner, its name and View under it at the same gap, and the
 * same width.
 */
const FAN_REACH = 96
const FAN_TILT = 5
const FAN_PAD = 4
/** As wide as the other card popovers: their thumbnail and its cream either side. */
const FAN_CARD_W = THUMB + FAN_PAD * 2
const CARD_ASPECT = 1392 / 769
/** D2 Conflux's card is a zoomed cut as well, shown whole. */
const STAT_BUILDER_CROP: Crop = { size: [1392, 769], x: 0, y: 0, w: 1392, h: 769 }
/** The Psychespeeders icon beside "built a tool", off the pixel-art set. */
const GEAR_ICON = 20
/** The leaf mark beside "explore, design, build and iterate faster". */
const LEAF_ICON = 20

/**
 * For an icon leading a trigger set with `iconAlign="baseline"`: sat on the
 * baseline, an icon taller than the capitals towers over them, so this drops
 * it by half its overhang to centre it on the cap height (Geist's ~0.7em).
 * In `em`, so it holds at the mobile body size too.
 */
function capCentre(size: number) {
  return `translateY(calc((${size}px - 0.7em) / 2))`
}

/**
 * A little more room before an icon-led trigger than a plain space, so the
 * icon reads with the words after it rather than the one before — and the
 * open tab, which reaches 8 past the icon, clears that word.
 */
const LEAD_ROOM = '4px'

/**
 * The pixel heart beside "using data, UX research, and empathy": 9 × 7
 * squares (18 × 14), drawn at 2px a square like the rail's glyphs, in Meridial's
 * magenta (the onboarding page's accent) with two lighter squares for a shine.
 */
const HEART = [
  '.###.###.',
  '##+######',
  '#+#######',
  '.#######.',
  '..#####..',
  '...###...',
  '....#....',
]
const HEART_INK: Record<string, string> = { '#': '#cb52b9', '+': '#e5a8dc' }
const HEART_SQUARE = 2

/** As `LeafMark`, one path per colour so no seams show between squares. */
const HEART_PATHS = (() => {
  const byInk = new Map<string, string>()
  HEART.forEach((row, y) =>
    [...row].forEach((ch, x) => {
      const ink = HEART_INK[ch]
      if (ink) byInk.set(ink, `${byInk.get(ink) ?? ''}M${x} ${y}h1v1h-1z`)
    }),
  )
  return [...byInk]
})()

function PixelHeart() {
  const w = HEART[0].length
  const h = HEART.length
  return (
    <svg
      aria-hidden
      width={w * HEART_SQUARE}
      height={h * HEART_SQUARE}
      viewBox={`0 0 ${w} ${h}`}
      shapeRendering="crispEdges"
      style={{ display: 'block', flexShrink: 0, transform: capCentre(h * HEART_SQUARE) }}
    >
      {HEART_PATHS.map(([ink, d]) => (
        <path key={ink} d={d} fill={ink} />
      ))}
    </svg>
  )
}

/** The avatar and the name in the title, opening a larger copy of the photo and a line about me. */
function NameTag() {
  return (
    <Popover
      // Fully round over the avatar: half the tab's height (the avatar plus
      // the tab's 4 above and below), so the curve keeps an even 4 off it.
      leadRadius={AVATAR / 2 + 4}
      content={
        <span style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: `${PREVIEW}px` }}>
          <img
            src="/profile.jpg"
            alt="Noah"
            width={PREVIEW}
            height={PREVIEW}
            style={{
              display: 'block',
              width: `${PREVIEW}px`,
              height: `${PREVIEW}px`,
              borderRadius: radius.md,
              objectFit: 'cover',
            }}
          />
          <span style={{ ...type['body-m'], padding: '0 4px 4px' }}>
            I&rsquo;m a gamer, athlete, and listen to the same song on repeat for weeks.
          </span>
        </span>
      }
    >
      <img
        src="/profile.jpg"
        alt=""
        width={AVATAR}
        height={AVATAR}
        style={{
          width: `${AVATAR}px`,
          height: `${AVATAR}px`,
          borderRadius: '50%',
          objectFit: 'cover',
          flexShrink: 0,
        }}
      />
      Noah
    </Popover>
  )
}

/**
 * The row under a card popover's art: its name and View. Inset 4 inside the
 * panel's own 4 of cream, so the button sits 8 off the panel's right and
 * bottom edges, clear of its corner, and 8 under the art; the name sits 12
 * off the panel's left edge.
 */
function CardCaption({ card }: { card: WorkCard }) {
  return (
    <span
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
        padding: CAPTION_INSET,
      }}
    >
      <span style={{ ...type['label-m'], paddingLeft: CAPTION_LEAD }}>{card.title}</span>
      <ViewLink href={card.href} />
    </span>
  )
}

/**
 * The popover's View button: an in-app link on the system's button shape,
 * hand-built because `Button` renders a `<button>` (as `OutLink` is). It is
 * ink on the cream panel rather than the orange accent, and eases to the
 * secondary ink on hover.
 */
function ViewLink({ href }: { href: string }) {
  const [hovered, setHovered] = useState(false)
  const fill = hovered ? color.ink.secondary : color.ink.default

  return (
    <AppLink
      href={href}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        flexShrink: 0,
        height: control.sm,
        boxSizing: 'border-box',
        padding: `0 ${space.lg}`,
        borderRadius: radius.full,
        border: 'none',
        background: fill,
        color: color.bg.cream,
        ...type['label-m'],
        textDecoration: 'none',
        whiteSpace: 'nowrap',
        transition: 'background 150ms ease',
      }}
    >
      View
    </AppLink>
  )
}

/**
 * A phrase in the copy that opens a project as its Work card thumbnail,
 * linking to its page: "using data, UX research, and empathy" opens the
 * Meridial onboarding study (the research-led one) and "built a tool" opens
 * D2 Conflux. ("explore, design, build and iterate faster" opens two, through
 * `FanTag`.)
 */
function CardTag({
  card,
  crop,
  gap,
  iconAlign,
  thumb = THUMB,
  children,
}: {
  card: WorkCard
  crop: Crop
  gap?: number
  iconAlign?: 'center' | 'baseline'
  /**
   * The thumbnail's least width. A long trigger wants a wider one, or the
   * panel only just clears the tab and the tab reads as the panel's whole
   * top edge rather than a tab sat in its middle.
   */
  thumb?: number
  children: ReactNode
}) {
  return (
    <Popover
      content={
        <span
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: CAPTION_GAP,
            // At least the thumbnail's width, and otherwise filling the panel:
            // a long trigger holds the panel wider than that (it has to clear
            // the tab and its fillet), and fixed at the thumbnail's width the
            // spare width all landed on the right.
            minWidth: `min(${thumb}px, calc(100vw - 64px))`,
          }}
        >
          {/* The art links too, but only View takes a tab stop. */}
          <AppLink
            href={card.href}
            tabIndex={-1}
            style={{
              position: 'relative',
              display: 'block',
              aspectRatio: `${crop.w} / ${crop.h}`,
              overflow: 'hidden',
              borderRadius: radius.md,
              // An outline paints over the art, where an inset shadow would sit under it.
              outline: `1px solid ${color.border.ink}`,
              outlineOffset: '-1px',
            }}
          >
            <img
              src={card.art.src}
              srcSet={card.art.srcSet}
              sizes={`${Math.round((thumb * crop.size[0]) / crop.w)}px`}
              alt={card.art.alt}
              width={crop.size[0]}
              height={crop.size[1]}
              style={{
                position: 'absolute',
                left: `${(-crop.x / crop.w) * 100}%`,
                top: `${(-crop.y / crop.h) * 100}%`,
                width: `${(crop.size[0] / crop.w) * 100}%`,
                height: `${(crop.size[1] / crop.h) * 100}%`,
                maxWidth: 'none',
              }}
            />
          </AppLink>
          <CardCaption card={card} />
        </span>
      }
      gap={gap}
      iconAlign={iconAlign}
    >
      {children}
    </Popover>
  )
}

/**
 * One card in `FanTag`'s fan: a small cream panel turned about the tab's
 * bottom corner on its side. The art links (with no tab stop; View takes it).
 */
function FanCard({
  card,
  side,
  front,
  onRaise,
}: {
  card: WorkCard
  side: 'left' | 'right'
  /** On top of the other card. */
  front: boolean
  /** Brings this card in front, on hover or when its View takes focus. */
  onRaise: () => void
}) {
  const left = side === 'left'
  // The pivot, on the card's top edge, is the tab's corner, `FAN_REACH` in
  // from the card's outer side.
  const pivot = left ? FAN_REACH : FAN_CARD_W - FAN_REACH
  return (
    <span
      onMouseEnter={onRaise}
      onFocus={onRaise}
      style={{
        position: 'absolute',
        top: 0,
        ...(left ? { left: -FAN_REACH } : { right: -FAN_REACH }),
        // The front card's shadow is what parts it from the other where they
        // cross; under the tab it is covered.
        zIndex: front ? 2 : 1,
        display: 'flex',
        flexDirection: 'column',
        gap: CAPTION_GAP,
        width: FAN_CARD_W,
        boxSizing: 'border-box',
        padding: FAN_PAD,
        background: color.bg.cream,
        borderRadius: radius.lg,
        boxShadow: front ? '0 10px 28px rgba(15, 14, 14, 0.28)' : undefined,
        // Left side down is a turn anticlockwise; right side down, clockwise.
        transform: `rotate(${left ? -FAN_TILT : FAN_TILT}deg)`,
        transformOrigin: `${pivot}px 0`,
      }}
    >
      <AppLink
        href={card.href}
        tabIndex={-1}
        style={{
          display: 'block',
          aspectRatio: `${CARD_ASPECT}`,
          overflow: 'hidden',
          borderRadius: radius.md,
          // An outline paints over the art, where an inset shadow would sit under it.
          outline: `1px solid ${color.border.ink}`,
          outlineOffset: '-1px',
        }}
      >
        <img
          src={card.art.src}
          srcSet={card.art.srcSet}
          sizes={`${FAN_CARD_W - FAN_PAD * 2}px`}
          alt={card.art.alt}
          width={1392}
          height={769}
          style={{ display: 'block', width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </AppLink>
      <CardCaption card={card} />
    </span>
  )
}

/**
 * "explore, design, build and iterate faster" in the copy: a popover holding
 * two projects rather than one, no3y Code and Crisp fanned out from its tab
 * like a hand of cards.
 */
function FanTag({ children }: { children: ReactNode }) {
  // no3y Code leads; hovering a card brings it in front until the other is
  // hovered.
  const [front, setFront] = useState<'left' | 'right'>('left')
  // A card's height, and how far below the tab its outer corner drops once
  // tipped, so the hover area under the tab reaches its foot.
  const cardH = FAN_PAD * 2 + (FAN_CARD_W - FAN_PAD * 2) / CARD_ASPECT + CAPTION_GAP + CAPTION_H
  const tilt = (FAN_TILT * Math.PI) / 180
  const depth = FAN_REACH * Math.sin(tilt) + cardH * Math.cos(tilt)

  return (
    <Popover
      bare
      content={
        <span style={{ position: 'relative', display: 'block', height: Math.ceil(depth) }}>
          <FanCard
            card={CRISP_CARD}
            side="right"
            front={front === 'right'}
            onRaise={() => setFront('right')}
          />
          <FanCard
            card={NO3Y_CARD}
            side="left"
            front={front === 'left'}
            onRaise={() => setFront('left')}
          />
        </span>
      }
      gap={4}
      iconAlign="baseline"
    >
      {children}
    </Popover>
  )
}

/**
 * The Me tab's opening block. The sizes sit off the shared type ramp — the
 * Figma frame (`320:30805`) sets them directly: a 24px medium title over 18px
 * subtitle and body copy, all small enough now that nothing needs to clamp
 * with the column.
 */
export default function Hero() {
  const isMobile = useIsMobile()

  const body: React.CSSProperties = {
    margin: 0,
    maxWidth: '700px',
    fontSize: isMobile ? '17px' : '18px',
    fontWeight: 400,
    lineHeight: 1.4,
    letterSpacing: 0,
  }

  const subtitle: React.CSSProperties = {
    margin: 0,
    fontSize: '18px',
    fontWeight: 500,
    lineHeight: 1.3,
    letterSpacing: 0,
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? '16px' : '24px' }}>
      <h1
        style={{
          margin: 0,
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          fontSize: '24px',
          fontWeight: 500,
          lineHeight: 1.1,
          letterSpacing: 0,
          color: TEXT,
        }}
      >
        Hi, I&rsquo;m
        <NameTag />
      </h1>

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <p style={{ ...subtitle, color: TEXT }}>Product Designer &amp;</p>
        <p style={{ ...subtitle, color: MUTED }}>Design Engineer x Builder x Diva</p>
      </div>

      <p style={{ ...body, color: TEXT }}>
        I&rsquo;m a super fast learner and eager to explore and embrace new tech, ideas
        and workflows to hone my craft. I am comfortable in this evolving era of the
        industry because it empowers me to{' '}
        <span style={{ marginLeft: LEAD_ROOM }}>
          <FanTag>
            <span style={{ display: 'block', transform: capCentre(LEAF_ICON) }}>
              <LeafMark size={LEAF_ICON} />
            </span>
            explore, design, build and iterate faster
          </FanTag>
        </span>{' '}
        than ever possible before. I have multiple years of experience{' '}
        <span style={{ marginLeft: LEAD_ROOM }}>
          <CardTag card={ONBOARDING_CARD} crop={ONBOARDING_CROP} gap={4} iconAlign="baseline">
            <PixelHeart />
            using data, UX research, and empathy
          </CardTag>
        </span>{' '}
        to solve business problems with product design.
      </p>

      <p style={{ ...body, color: MUTED }}>
        I&rsquo;ve worked on consumer facing products and features like onboarding
        users, driving engagement and simple IA. I also got to design
        complex workflows, admin tools and user management systems. Using words,
        diagrams and research, I laid out clear conceptual models that served as
        the blueprint for the UX/UI.
      </p>

      <p style={{ ...body, color: MUTED }}>
        I spend much of my free time gaming, hanging with friends and exercising. I
        have been a hard-core gamer for more than a decade. My most played and
        favorite game is Destiny 2. Participating in World First races and other PvE
        challenges requires a lot of optimization. So I designed and{' '}
        <span style={{ marginLeft: LEAD_ROOM }}>
          <CardTag card={STAT_BUILDER_CARD} crop={STAT_BUILDER_CROP} gap={4} iconAlign="baseline">
            <img
              src="/work/pixel-art/psyche-speeders.webp"
              alt=""
              width={GEAR_ICON}
              height={GEAR_ICON}
              style={{
                display: 'block',
                width: `${GEAR_ICON}px`,
                height: `${GEAR_ICON}px`,
                flexShrink: 0,
                transform: capCentre(GEAR_ICON),
              }}
            />
            built a tool
          </CardTag>
        </span>{' '}
        to help with that.
      </p>
    </div>
  )
}
