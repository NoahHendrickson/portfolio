import { useSyncExternalStore } from 'react'
import { color } from '../design-system/tokens'
import { useIsMobile } from '../hooks/useIsMobile'
import { RAIL_SPINE } from '../layout'
import { pixelPath } from '../pixelFaces'
import { getLiveFont, setLiveFont, subscribeLiveFont, type LiveFont } from '../cinnabarLive'

const I = ['XXX', '.X.', '.X.', '.X.', '.X.', '.X.', 'XXX']
const S = ['.XXXX', 'X....', 'X....', '.XXX.', '....X', '....X', 'XXXX.']
const G = ['.XXX.', 'X...X', 'X....', 'X.XXX', 'X...X', 'X...X', '.XXX.']
/** Top to bottom: Cinnabar Interface, Cinnabar Sans, the site's own Geist. */
const OPTIONS: { font: LiveFont; rows: string[]; label: string }[] = [
  { font: 'interface', rows: I, label: 'Cinnabar Interface (live)' },
  { font: 'sans', rows: S, label: 'Cinnabar Sans (live)' },
  { font: 'geist', rows: G, label: 'Geist' },
]

/** The theme and prototype switches' measures, so the three switches stack as a column. */
const SQUARE = 2
const FRAME = 2
const SEGMENT_W = 40
const SEGMENT_H = 36
const LEFT = RAIL_SPINE + 12
/** The theme and prototype switches have two segments each. */
const PAIR_H = SEGMENT_H * 2 + FRAME * 2
/** Over the prototype switch, which sits over the theme switch: 24 off the foot, 8 between each. */
const BOTTOM = 24 + (PAIR_H + 8) * 2

function Letter({ rows, active }: { rows: string[]; active: boolean }) {
  return (
    <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: SEGMENT_W, height: SEGMENT_H }}>
      <svg
        aria-hidden
        width={rows[0].length * SQUARE}
        height={rows.length * SQUARE}
        viewBox={`0 0 ${rows[0].length} ${rows.length}`}
        shapeRendering="crispEdges"
        style={{ display: 'block', position: 'relative', color: active ? color.accent.default : color.text.inverse }}
      >
        <path d={pixelPath(rows)} fill="currentColor" />
      </svg>
    </span>
  )
}

/**
 * Sets the site's text in Cinnabar Studio's live Cinnabar Interface (I) or Cinnabar Sans (S), or the
 * site's own Geist (G), for comparison (`cinnabarLive.ts`). Each segment picks its font. Drawn like
 * the theme and prototype switches, and mounted only on a dev server started with
 * VITE_CINNABAR_LIVE, so it never ships. Desktop only.
 */
export default function FontSwitch() {
  const font = useSyncExternalStore(subscribeLiveFont, getLiveFont, getLiveFont)
  const isMobile = useIsMobile()
  if (isMobile) return null
  const at = OPTIONS.findIndex((o) => o.font === font)
  return (
    <div
      role="radiogroup"
      aria-label="Site font"
      data-texture-avoid="self"
      style={{
        position: 'fixed',
        left: LEFT,
        bottom: BOTTOM,
        zIndex: 900,
        display: 'flex',
        flexDirection: 'column',
        padding: FRAME,
        borderRadius: 'var(--radius-md)',
        background: color.bg.cream,
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
          borderRadius: 'var(--radius-sm)',
          background: color.bg.primary,
          transform: `translateY(${at * SEGMENT_H}px)`,
        }}
      />
      {OPTIONS.map((o) => (
        <button
          key={o.font}
          type="button"
          role="radio"
          aria-checked={o.font === font}
          aria-label={o.label}
          title={o.label}
          onClick={() => setLiveFont(o.font)}
          style={{ display: 'block', padding: 0, border: 'none', background: 'none', cursor: 'pointer' }}
        >
          <Letter rows={o.rows} active={o.font === font} />
        </button>
      ))}
    </div>
  )
}
