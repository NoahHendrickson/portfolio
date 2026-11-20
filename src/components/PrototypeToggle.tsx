import { useSyncExternalStore } from 'react'
import { color } from '../design-system/tokens'
import { useHomePrototype, setHomePrototype } from '../hooks/useHomePrototype'
import { useNo3yPrototype, setNo3yPrototype } from '../hooks/useNo3yPrototype'
import { useIsMobile } from '../hooks/useIsMobile'
import { RAIL_SPINE } from '../layout'
import { getRoute, subscribeToRoute } from '../navigation'
import { pixelPath } from '../pixelFaces'

const A = ['.XXX.', 'X...X', 'X...X', 'XXXXX', 'X...X', 'X...X', 'X...X']
const B = ['XXXX.', 'X...X', 'X...X', 'XXXX.', 'X...X', 'X...X', 'XXXX.']

/** The theme switch's measures, so the two stack as a pair. */
const SQUARE = 2
const FRAME = 2
const SEGMENT_W = 40
const SEGMENT_H = 36
const DESKTOP_LEFT = RAIL_SPINE + 12
const PAGE_LEFT = 24
const MOBILE_LEFT = 16
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

function SwitchButton({
  active,
  left,
  ariaLabel,
  title,
  onToggle,
}: {
  active: 'A' | 'B'
  left: number
  ariaLabel: string
  title: string
  onToggle: () => void
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      data-texture-avoid="self"
      aria-label={ariaLabel}
      title={title}
      style={{
        position: 'fixed',
        left,
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
          transform: `translateY(${active === 'B' ? SEGMENT_H : 0}px)`,
        }}
      />
      <Letter rows={A} active={active === 'A'} />
      <Letter rows={B} active={active === 'B'} />
    </button>
  )
}

/**
 * Dev-only A / B prototype switch stacked over the light / dark toggle:
 * - On `/` (desktop): Hi's prototypes (`useHomePrototype`: A wordmark, B follow blob).
 * - On `/work/no3y-code`: the page's story prototypes (`useNo3yPrototype`: A current, B cohesive story).
 */
export default function PrototypeToggle() {
  const route = useSyncExternalStore(subscribeToRoute, getRoute)
  const homePrototype = useHomePrototype()
  const no3yPrototype = useNo3yPrototype()
  const isMobile = useIsMobile()

  if (route === '/') {
    if (isMobile) return null
    const next = homePrototype === 'wordmark' ? 'follow' : 'wordmark'
    return (
      <SwitchButton
        active={homePrototype === 'wordmark' ? 'A' : 'B'}
        left={DESKTOP_LEFT}
        ariaLabel={`Prototype ${homePrototype === 'wordmark' ? 'A, the wordmark' : 'B, the follow blob'}. Switch to ${next === 'wordmark' ? 'A' : 'B'}`}
        title="Hi’s prototype: A wordmark, B follow blob"
        onToggle={() => setHomePrototype(next)}
      />
    )
  }

  if (route === '/work/no3y-code') {
    const next = no3yPrototype === 'current' ? 'story' : 'current'
    return (
      <SwitchButton
        active={no3yPrototype === 'current' ? 'A' : 'B'}
        left={isMobile ? MOBILE_LEFT : PAGE_LEFT}
        ariaLabel={`no3y Code prototype ${no3yPrototype === 'current' ? 'A, current layout' : 'B, cohesive story'}. Switch to ${next === 'current' ? 'A' : 'B'}`}
        title="no3y Code prototype: A current layout, B cohesive story"
        onToggle={() => setNo3yPrototype(next)}
      />
    )
  }

  return null
}
