import { useEffect, useState, type CSSProperties, type ReactNode } from 'react'
import { ArrowUpRight, Check, Copy, GithubLogo, LinkedinLogo } from '@phosphor-icons/react'
import Button from '../design-system/Button'
import { resolveOpacity, resolvePalette } from '../design-system/buttonStyles'
import { color, control, radius, space, type } from '../design-system/tokens'
import { useIsMobile } from '../hooks/useIsMobile'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { setTexturePaused, useTexturePaused } from '../hooks/useTexturePaused'
import { HOME_TEXTURE } from '../layout'
import { FACE_GLYPHS, LANDING_SWATCHES, LEAF_GLYPHS, SHAPE_GLYPHS } from '../pixelTexture'

const EMAIL = 'noahjames017@gmail.com'
const LINKEDIN_URL = 'https://www.linkedin.com/in/noah-hendrickson-808959192/'
const GITHUB_URL = 'https://github.com/NoahHendrickson'

/**
 * The `md` control's 24 a side read loose on a row of short labels with
 * icons, so these run the `sm` control's 16 at the `md` height.
 */
const PILL_PAD = space.lg

/**
 * The row of contact pills under the Hi tab's hero copy: the email, LinkedIn and
 * GitHub. The email pill reads "Email me!" with a copy icon after it; a click
 * copies the address and reads "Copied" with a check for a moment, the way
 * the Contact tab and the name popover do, rather than opening a mail client
 * the visitor may not have set up. The two links open a tab. Ahead of them,
 * while the texture is up, `CalmButton` pauses it, set off by a divider.
 */
export default function ContactButtons() {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!copied) return
    const timeout = setTimeout(() => setCopied(false), 1500)
    return () => clearTimeout(timeout)
  }, [copied])

  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: space.sm,
      }}
    >
      <CalmButton divider />
      <Button
        variant="secondary"
        size="md"
        style={{ padding: `0 ${PILL_PAD}` }}
        aria-label={copied ? 'Email copied' : `Copy email, ${EMAIL}`}
        // The check in the label's own colour at regular weight: duotone's tint read as a blot behind it.
        trailingIcon={copied ? <Check size={20} weight="regular" /> : <Copy size={20} />}
        onClick={() => {
          navigator.clipboard?.writeText(EMAIL)
          setCopied(true)
        }}
      >
        {copied ? 'Copied' : 'Email me!'}
      </Button>
      <LinkPill href={LINKEDIN_URL} icon={<LinkedinLogo size={20} />}>
        LinkedIn
      </LinkPill>
      <LinkPill href={GITHUB_URL} icon={<GithubLogo size={20} />}>
        GitHub
      </LinkPill>
    </div>
  )
}

/**
 * An outbound link dressed as the `md` ghost button. `Button` renders a
 * `<button>`, so this pulls its palette and opacity from `buttonStyles` rather
 * than nesting one in an anchor.
 */
function LinkPill({ href, icon, children }: { href: string; icon: ReactNode; children: ReactNode }) {
  const [hovered, setHovered] = useState(false)
  const state = hovered ? 'hover' : 'default'
  const palette = resolvePalette('ghost', state)

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
        justifyContent: 'center',
        gap: space.sm,
        height: control.md,
        boxSizing: 'border-box',
        padding: `0 ${PILL_PAD}`,
        borderRadius: radius.full,
        border: `1px solid ${palette.borderColor}`,
        background: palette.background,
        color: palette.color,
        opacity: resolveOpacity('ghost', state),
        ...type['label-l'],
        textDecoration: 'none',
        whiteSpace: 'nowrap',
        transition: 'background 150ms ease, border-color 150ms ease',
      }}
    >
      <span style={{ display: 'inline-flex' }} aria-hidden>
        {icon}
      </span>
      {children}
      <span style={{ display: 'inline-flex', color: color.text.muted }} aria-hidden>
        <ArrowUpRight size={16} />
      </span>
    </a>
  )
}

/**
 * The four leaves' highlights in the landing page's colours (the blue in for
 * the top leaf's green), dealt to the button's tiles.
 */
const PATTERN = LANDING_SWATCHES.filter((_, i) => i % 2 === 1).map((swatch) => swatch.value)
/** The landing texture's glyphs: its bold faces (and the heart), the leaves, the shapes. */
const TILE_GLYPHS = [...FACE_GLYPHS, ...LEAF_GLYPHS, ...SHAPE_GLYPHS]
/** Each glyph as one SVG path on its 16-unit grid. */
const TILE_PATHS = TILE_GLYPHS.map((glyph) => glyph.rects.map(([x, y, w, h]) => `M${x} ${y}h${w}v${h}h${-w}z`).join(''))
/** Three tiles, each in its own colour, as the texture's cells are. */
const TILE_COLOURS = [PATTERN[0], PATTERN[1], PATTERN[3]]
/** A cell at the texture's S size: 20px, the tile 18 inside it, the 16-unit glyph a pixel a unit. */
const TILE = 18
/** How often one of the tiles swaps its glyph (ms). */
const TILE_SWAP: [number, number] = [550, 1300]

const randomGlyph = (not = -1) => {
  let g = not
  while (g === not) g = Math.floor(Math.random() * TILE_GLYPHS.length)
  return g
}

/**
 * Three of the texture's own cells — a colour tile with a glyph cut into it,
 * the glyphs swapping now and then like the texture's — leading the calm pill.
 * Paused, they hold still and go grey with the rest of the pill.
 */
function PatternTiles({ paused }: { paused: boolean }) {
  const [glyphs, setGlyphs] = useState(() => TILE_COLOURS.map(() => randomGlyph()))

  useEffect(() => {
    if (paused) return
    let timeout: ReturnType<typeof setTimeout>
    const swap = () => {
      setGlyphs((prev) => {
        const i = Math.floor(Math.random() * prev.length)
        return prev.map((g, j) => (j === i ? randomGlyph(g) : g))
      })
      timeout = setTimeout(swap, TILE_SWAP[0] + Math.random() * (TILE_SWAP[1] - TILE_SWAP[0]))
    }
    timeout = setTimeout(swap, TILE_SWAP[0])
    return () => clearTimeout(timeout)
  }, [paused])

  return (
    <span aria-hidden style={{ display: 'inline-flex', gap: '2px' }}>
      {TILE_COLOURS.map((fill, i) => (
        <svg
          key={i}
          width={TILE}
          height={TILE}
          viewBox="-1 -1 18 18"
          shapeRendering="crispEdges"
          style={{ display: 'block', transition: 'opacity 150ms ease' }}
        >
          <rect x={-1} y={-1} width={18} height={18} fill={paused ? 'var(--color-border-default)' : fill} />
          <path d={TILE_PATHS[glyphs[i]]} style={{ fill: 'var(--color-bg-primary)' }} />
        </svg>
      ))}
    </span>
  )
}

/**
 * "I'm overstimulated": pauses the moving texture on the right of Hi's first
 * screen so the copy can be read in peace, then offers to bring it back. The
 * outlined button of the LinkedIn / GitHub links but square-cornered, like the
 * texture's cells, led by three of them; first in the row, with a hairline
 * between it and the contact pills (`divider`). The other home tabs carry it
 * too, at the foot of their copy, beside the same texture. Every copy shares
 * one paused state. Shown only where the texture is (desktop, `HOME_TEXTURE`)
 * and moving (not under reduced motion, which already holds it still).
 */
export function CalmButton({ divider = false, style }: { divider?: boolean; style?: CSSProperties }) {
  const paused = useTexturePaused()
  const isMobile = useIsMobile()
  const still = useMediaQuery('(prefers-reduced-motion: reduce)')
  const [hovered, setHovered] = useState(false)
  if (!HOME_TEXTURE || isMobile || still) return null

  const state = hovered ? 'hover' : 'default'
  const palette = resolvePalette('ghost', state)
  return (
    <>
      <button
        type="button"
        // The visible words lead the accessible name, so a voice-control user can
        // say what they see; the action follows for a screen reader.
        aria-label={
          paused ? 'I need stimmy: play the animated pattern' : 'I’m overstimulated: pause the animated pattern'
        }
        onClick={() => setTexturePaused(!paused)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: space.sm,
          height: control.md,
          boxSizing: 'border-box',
          // The tiles sit as far in from the square edge as they sit from its top.
          padding: `0 ${PILL_PAD} 0 8px`,
          borderRadius: 0,
          border: `1px solid ${palette.borderColor}`,
          background: palette.background,
          color: palette.color,
          opacity: resolveOpacity('ghost', state),
          cursor: 'pointer',
          whiteSpace: 'nowrap',
          ...type['label-l'],
          transition: 'background 150ms ease, border-color 150ms ease',
          ...style,
        }}
      >
        <PatternTiles paused={paused} />
        {paused ? 'I need stimmy' : 'I’m overstimulated'}
      </button>
      {divider && (
        <span
          aria-hidden
          style={{
            width: '1px',
            height: '20px',
            margin: `0 ${space.xs}`,
            background: color.border.default,
          }}
        />
      )}
    </>
  )
}
