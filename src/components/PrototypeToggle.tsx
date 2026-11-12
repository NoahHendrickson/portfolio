import { color } from '../design-system/tokens'
import { useHomePrototype, setHomePrototype } from '../hooks/useHomePrototype'
import { useIsMobile } from '../hooks/useIsMobile'
import { RAIL_SPINE } from '../layout'
import { pixelPath } from '../pixelFaces'

const A = ['.XXX.', 'X...X', 'X...X', 'XXXXX', 'X...X', 'X...X', 'X...X']
const B = ['XXXX.', 'X...X', 'X...X', 'XXXX.', 'X...X', 'X...X', 'XXXX.']

/** The theme switch's measures, so the two stack as a pair. */
const SQUARE = 2
const FRAME = 2
const SEGMENT_W = 40
const SEGMENT_H = 36
const LEFT = RAIL_SPINE + 12
/** Over the theme switch: its 24 off the foot, its two segments and frame, and 8 between. */
const BOTTOM = 24 + SEGMENT_H * 2 + FRAME * 2 + 8

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
 * Switches Hi between its prototypes (`useHomePrototype`): A, the Edge with
 * the wordmark, and B, the blob that follows the pointer. Drawn like the
 * theme switch under it (the cut-out over the current pick), and mounted on
 * the dev server only, so it never ships. Desktop only, like the texture.
 */
export default function PrototypeToggle() {
  const prototype = useHomePrototype()
  const isMobile = useIsMobile()
  if (isMobile) return null
  const next = prototype === 'wordmark' ? 'follow' : 'wordmark'
  return (
    <button
      type="button"
      onClick={() => setHomePrototype(next)}
      data-texture-avoid="self"
      aria-label={`Prototype ${prototype === 'wordmark' ? 'A, the wordmark' : 'B, the follow blob'}. Switch to ${next === 'wordmark' ? 'A' : 'B'}`}
      title="Hi's prototype: A wordmark, B follow blob"
      style={{
        position: 'fixed',
        left: LEFT,
        bottom: BOTTOM,
        zIndex: 900,
        display: 'flex',
        flexDirection: 'column',
        padding: FRAME,
        border: 'none',
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
          borderRadius: 'var(--radius-sm)',
          background: color.bg.primary,
          transform: `translateY(${prototype === 'follow' ? SEGMENT_H : 0}px)`,
        }}
      />
      <Letter rows={A} active={prototype === 'wordmark'} />
      <Letter rows={B} active={prototype === 'follow'} />
    </button>
  )
}
