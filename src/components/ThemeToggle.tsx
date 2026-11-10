import { useSyncExternalStore } from 'react'
import { color } from '../design-system/tokens'
import { useIsMobile } from '../hooks/useIsMobile'
import { RAIL_SPINE } from '../layout'
import { pixelPath } from '../pixelFaces'
import { getTheme, setTheme, subscribeToTheme } from '../theme'

const SUN = [
  '.....X.....',
  '.X...X...X.',
  '..X.....X..',
  '....XXX....',
  '...XXXXX...',
  'XX.XXXXX.XX',
  '...XXXXX...',
  '....XXX....',
  '..X.....X..',
  '.X...X...X.',
  '.....X.....',
]

const MOON = [
  '...XXX',
  '..XXX.',
  '.XXX..',
  'XXXX..',
  'XXXX..',
  'XXXX..',
  '.XXX..',
  '..XXX.',
  '...XXX',
]

/** The rail's glyphs are 2px a square. */
const SQUARE = 2
/** The stroke left round the cut-out, on the same 2px grid as the glyphs. */
const FRAME = 2
const SEGMENT_W = 40
const SEGMENT_H = 36
/** On the rail's labels: its rows pad 12 in from the spine. */
const DESKTOP_LEFT = RAIL_SPINE + 12
const MOBILE_LEFT = 16
const BOTTOM = 24

function Glyph({ rows, active }: { rows: string[]; active: boolean }) {
  const cols = rows[0].length
  return (
    <span
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: SEGMENT_W,
        height: SEGMENT_H,
      }}
    >
      <svg
        aria-hidden
        width={cols * SQUARE}
        height={rows.length * SQUARE}
        viewBox={`0 0 ${cols} ${rows.length}`}
        shapeRendering="crispEdges"
        style={{ display: 'block', color: active ? color.accent.default : color.text.inverse }}
      >
        <path d={pixelPath(rows)} fill="currentColor" />
      </svg>
    </span>
  )
}

/**
 * The light / dark switch, in the window's bottom left on every page, drawn
 * like the rail's tabs. It is one solid shape in the pill's fill with a cut-out
 * in the page's colour over the current mode, so the sun always sits on light
 * and the moon on dark, and the fill meets the cut-out in concave corners. (With
 * the cut-out over the mode that's off, the current mode read as switched off.)
 * The cut-out slides across on a change (`.theme-toggle-*` in `index.css`). A
 * click anywhere flips it.
 */
export default function ThemeToggle() {
  const theme = useSyncExternalStore(subscribeToTheme, getTheme)
  const isMobile = useIsMobile()
  const next = theme === 'dark' ? 'light' : 'dark'

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={() => setTheme(next)}
      aria-label={`Switch to ${next} mode`}
      style={{
        position: 'fixed',
        left: isMobile ? MOBILE_LEFT : DESKTOP_LEFT,
        bottom: BOTTOM,
        // Over the page's content, under the intro splash.
        zIndex: 900,
        display: 'flex',
        padding: FRAME,
        border: 'none',
        // The rail tabs' corner and fill.
        borderRadius: 'var(--radius-md)',
        background: color.bg.cream,
        cursor: 'pointer',
      }}
    >
      <span
        aria-hidden
        className="theme-toggle-hole"
        style={{
          position: 'absolute',
          top: FRAME,
          left: FRAME,
          width: SEGMENT_W,
          height: SEGMENT_H,
          // Concentric with the frame's 8.
          borderRadius: 'var(--radius-sm)',
          background: color.bg.primary,
          transform: `translateX(${theme === 'dark' ? SEGMENT_W : 0}px)`,
        }}
      />
      <Glyph rows={SUN} active={theme === 'light'} />
      <Glyph rows={MOON} active={theme === 'dark'} />
    </button>
  )
}
