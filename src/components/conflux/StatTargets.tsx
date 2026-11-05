import { useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent } from 'react'
import { CARD_BG, CARD_LINE, FG, FG_MUTED, FONT, SHADOW_RAISED, icon } from './confluxTheme'
import {
  DEFAULT_TARGETS,
  achievableCap,
  STAT_LARGE_STEP,
  STAT_PRESET_TICKS,
  STAT_SLIDER_MAX,
  STAT_TARGETS_WIDTH,
  STATS,
  clamp,
  sliderFillWidth,
  sliderValueAt,
  sliderValueLeft,
} from './optimizerData'
import OptimizerTooltip from './OptimizerTooltip'
import './optimizer.css'

/**
 * D2 Conflux's optimizer "Stats" card, rebuilt from the live app's DOM
 * (`builder-panel.tsx` / `stat-target-row.tsx` / `ui/slider.tsx`, dark + slate, plain
 * lines): six target rows, each a glyph and name, a number chip with "/ max", and a
 * bar — a 10px well in a hairline frame, the lighter "achievable" ceiling behind the
 * green fill, a 2px thumb — over clickable 0 / 50 / 100 / 150 / MAX ticks. Drag or
 * click the bar, use the arrow keys on the thumb, type a value (clamped to 0–200), or
 * Reset. The card is translucent and meant to sit on `SLATE`.
 */

/** `--popover` (dark): the slider's hover badge. */
const POPOVER = '#1c1f23'
const mix = (pct: number) => `color-mix(in srgb, ${FG} ${pct}%, transparent)`

const SR_ONLY: CSSProperties = {
  position: 'absolute',
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: 'hidden',
  clip: 'rect(0, 0, 0, 0)',
  whiteSpace: 'nowrap',
  border: 0,
}

export default function StatTargets({
  style,
  width,
}: {
  /** Merged onto the card's root. */
  style?: CSSProperties
  /** The card's width; defaults to the app's (636), never wider than its container. */
  width?: CSSProperties['width']
}) {
  const [values, setValues] = useState<number[]>(() => [...DEFAULT_TARGETS])
  const set = (index: number, value: number) =>
    setValues((prev) => (prev[index] === value ? prev : prev.map((v, i) => (i === index ? value : v))))

  return (
    <section
      className="cfx-opt-root cfx-opt-card"
      style={
        {
          '--cfx-opt-fg': FG,
          '--cfx-opt-muted': FG_MUTED,
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          padding: 12,
          boxSizing: 'border-box',
          width: width ?? STAT_TARGETS_WIDTH,
          maxWidth: '100%',
          background: CARD_BG,
          // The popularity card's raised shadow, so the cards sit alike on the Slate (Nov 5 2026).
          boxShadow: SHADOW_RAISED,
          color: FG,
          fontFamily: FONT,
          fontSize: 16,
          fontWeight: 400,
          lineHeight: '24px',
          textAlign: 'start',
          ...style,
        } as CSSProperties
      }
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <h3 style={{ margin: 0, fontSize: 14, lineHeight: '20px', fontWeight: 500 }}>Stats</h3>
        <span style={{ display: 'flex', flexShrink: 0, alignItems: 'center' }}>
          <button
            type="button"
            className="cfx-opt-btn cfx-opt-ring"
            onClick={() => setValues([...DEFAULT_TARGETS])}
            style={{
              display: 'inline-flex',
              flexShrink: 0,
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              height: 32,
              padding: '0 12px',
              boxSizing: 'border-box',
              borderRadius: 0,
              backgroundClip: 'padding-box',
              color: FG,
              fontFamily: 'inherit',
              fontSize: 14,
              lineHeight: '20px',
              fontWeight: 500,
              whiteSpace: 'nowrap',
              userSelect: 'none',
              cursor: 'pointer',
            }}
          >
            Reset
          </button>
        </span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
        {STATS.map((stat, i) => (
          <StatRow key={stat.key} index={i} value={values[i]} cap={achievableCap(i, values)} onChange={set} />
        ))}
      </div>
    </section>
  )
}

function StatRow({
  index,
  value,
  cap,
  onChange,
}: {
  index: number
  value: number
  /** Its achievable max given the other targets (`achievableCap`). */
  cap: number
  onChange: (index: number, value: number) => void
}) {
  const { label, glyph } = STATS[index]
  const change = (v: number) => onChange(index, v)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {/* Glyph + name left; value chip + "/ max" right. */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <div style={{ display: 'flex', minWidth: 0, alignItems: 'center', gap: 4 }}>
          <OptimizerTooltip label={label}>
            {(tip) => (
              <img
                {...tip}
                src={icon(glyph)}
                alt={label}
                tabIndex={0}
                width={16}
                height={16}
                decoding="async"
                style={{ display: 'block', width: 16, height: 16, flexShrink: 0, opacity: 0.65 }}
              />
            )}
          </OptimizerTooltip>
          <span
            style={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              fontSize: 12,
              lineHeight: '20px',
              fontWeight: 500,
            }}
          >
            {label}
          </span>
        </div>
        <div style={{ display: 'flex', flexShrink: 0, alignItems: 'center', gap: 8 }}>
          <input
            type="number"
            className="cfx-opt-input"
            min={0}
            max={STAT_SLIDER_MAX}
            step={1}
            value={value}
            aria-label={`${label} target value`}
            onFocus={(e) => e.target.select()}
            onChange={(e) => {
              const n = Math.round(Number(e.target.value))
              change(Number.isFinite(n) ? clamp(n, 0, STAT_SLIDER_MAX) : 0)
            }}
            style={{
              display: 'block',
              width: 36,
              height: 20,
              minWidth: 0,
              margin: 0,
              padding: 4,
              boxSizing: 'border-box',
              borderRadius: 0,
              color: FG,
              fontFamily: 'inherit',
              fontSize: 11,
              lineHeight: '20px',
              fontWeight: 500,
              fontVariantNumeric: 'tabular-nums',
              textAlign: 'center',
            }}
          />
          <span style={SR_ONLY}>
            {label} achievable max: {cap}
          </span>
          <span
            aria-hidden
            style={{
              fontSize: 11,
              lineHeight: '20px',
              fontWeight: 500,
              color: mix(50),
              fontVariantNumeric: 'tabular-nums',
              whiteSpace: 'nowrap',
            }}
          >
            / {cap}
          </span>
        </div>
      </div>
      {/* The end ticks sit on this unpadded box, flush with the header's edges. */}
      <div style={{ position: 'relative', minWidth: 0 }}>
        {/* 3px each side makes room for the bar's frame, 3px outside the well. */}
        <div style={{ padding: '0 3px' }}>
          <StatSlider label={label} value={value} cap={cap} onChange={change} />
          <div style={{ position: 'relative', marginTop: 2, height: 16 }}>
            {STAT_PRESET_TICKS.map((t) => (
              <Tick
                key={t}
                text={String(t)}
                aria={`Set ${label} to ${t}`}
                active={value === t}
                onClick={() => change(t)}
                style={{ top: 0, left: sliderValueLeft(t, 0, STAT_SLIDER_MAX), translate: '-50%' }}
              />
            ))}
          </div>
        </div>
        <Tick
          text="0"
          aria={`Set ${label} to 0`}
          active={value === 0}
          onClick={() => change(0)}
          end="start"
          style={{ bottom: 0, left: 0 }}
        />
        {/* Uppercase tracking leaves 0.05em after the last glyph; the negative margin
            pulls it past the edge so "MAX" ends flush. */}
        <Tick
          text="Max"
          aria={`Set ${label} to its max (${cap})`}
          active={value === cap}
          onClick={() => change(cap)}
          end="end"
          style={{ right: 0, bottom: 0, marginRight: '-0.05em' }}
        />
      </div>
    </div>
  )
}

/** One clickable marker under the bar, with its own tooltip. */
function Tick({
  text,
  aria,
  active,
  onClick,
  end,
  style,
}: {
  text: string
  aria: string
  active: boolean
  onClick: () => void
  /** An end tick grows its hit area outwards only. */
  end?: 'start' | 'end'
  style: CSSProperties
}) {
  return (
    <OptimizerTooltip label={aria}>
      {(tip) => (
        <button
          {...tip}
          type="button"
          className="cfx-opt-tick"
          aria-label={aria}
          data-active={active || undefined}
          data-end={end}
          onClick={onClick}
          style={{
            position: 'absolute',
            margin: 0,
            padding: 0,
            border: 0,
            background: 'none',
            cursor: 'pointer',
            fontFamily: 'inherit',
            fontSize: 10,
            lineHeight: '16px',
            fontWeight: 500,
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            fontVariantNumeric: 'tabular-nums',
            ...style,
          }}
        >
          {text}
        </button>
      )}
    </OptimizerTooltip>
  )
}

/**
 * The bar (the app's `Slider` fork): a press anywhere on it sets the value under the
 * pointer and drags from there, hovering shows the value a click would set in a badge
 * above it (the live value while dragging), and the focused thumb takes the arrow
 * keys (Shift / Page Up / Page Down for 10, Home / End for the ends).
 */
function StatSlider({
  label,
  value,
  cap,
  onChange,
}: {
  label: string
  value: number
  cap: number
  onChange: (value: number) => void
}) {
  const [hover, setHover] = useState<{ x: number; value: number } | null>(null)
  const [dragging, setDragging] = useState(false)
  const thumb = useRef<HTMLDivElement>(null)

  const at = (e: PointerEvent<HTMLDivElement>) =>
    sliderValueAt(e.clientX, e.currentTarget.getBoundingClientRect(), 0, STAT_SLIDER_MAX)

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const big = STAT_LARGE_STEP
    let next: number
    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowUp':
        next = value + (e.shiftKey ? big : 1)
        break
      case 'ArrowLeft':
      case 'ArrowDown':
        next = value - (e.shiftKey ? big : 1)
        break
      case 'PageUp':
        next = value + big
        break
      case 'PageDown':
        next = value - big
        break
      case 'Home':
        next = 0
        break
      case 'End':
        next = STAT_SLIDER_MAX
        break
      default:
        return
    }
    e.preventDefault()
    onChange(clamp(next, 0, STAT_SLIDER_MAX))
  }

  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        width: '100%',
        alignItems: 'center',
        padding: '6px 0',
        touchAction: 'none',
        userSelect: 'none',
        cursor: 'pointer',
      }}
      onPointerDown={(e) => {
        if (e.button !== 0) return
        e.preventDefault()
        e.currentTarget.setPointerCapture(e.pointerId)
        const p = at(e)
        setDragging(true)
        setHover(p)
        onChange(p.value)
        thumb.current?.focus({ preventScroll: true })
      }}
      onPointerMove={(e) => {
        const p = at(e)
        setHover(p)
        if (dragging) onChange(p.value)
      }}
      onPointerUp={() => setDragging(false)}
      onLostPointerCapture={() => setDragging(false)}
      onPointerLeave={() => {
        if (!dragging) setHover(null)
      }}
      onPointerCancel={() => {
        setDragging(false)
        setHover(null)
      }}
    >
      {/* The 10px well; its frame is the ::before 3px outside it. */}
      <div
        className="cfx-opt-track"
        style={{ position: 'relative', flexGrow: 1, width: '100%', height: 10, boxSizing: 'content-box' }}
      >
        {/* What's achievable given the other targets: a lighter fill up to it. */}
        <div
          aria-hidden
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            height: '100%',
            width: sliderFillWidth(cap, 0, STAT_SLIDER_MAX),
            background: mix(12),
            transition: 'width 300ms cubic-bezier(0, 0, 0.2, 1)',
          }}
        />
        {/* The green fill, wearing the line in white, out to the thumb's centre. */}
        <div
          aria-hidden
          style={{
            position: 'relative',
            height: '100%',
            width: sliderValueLeft(value, 0, STAT_SLIDER_MAX),
            boxSizing: 'border-box',
            border: '1px solid rgb(255 255 255 / 0.2)',
            backgroundImage: 'linear-gradient(to right, #54c55f, #378b3f)',
          }}
        />
      </div>
      {hover && (
        <div
          aria-hidden
          style={{
            position: 'absolute',
            bottom: '100%',
            left: hover.x,
            zIndex: 10,
            marginBottom: 6,
            translate: '-50%',
            padding: '2px 6px',
            borderRadius: 4,
            border: `1px solid ${CARD_LINE}`,
            background: POPOVER,
            boxShadow: '0 6px 16px rgb(0 0 0 / 0.5)',
            color: FG,
            fontSize: 11,
            lineHeight: '16.5px',
            fontWeight: 500,
            fontVariantNumeric: 'tabular-nums',
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
          }}
        >
          {dragging ? value : hover.value}
        </div>
      )}
      <div
        ref={thumb}
        role="slider"
        tabIndex={0}
        className="cfx-opt-thumb"
        aria-label={`${label} target`}
        aria-orientation="horizontal"
        aria-valuemin={0}
        aria-valuemax={STAT_SLIDER_MAX}
        aria-valuenow={value}
        data-dragging={dragging || undefined}
        onKeyDown={onKeyDown}
        style={{
          position: 'absolute',
          display: 'block',
          top: '50%',
          left: sliderValueLeft(value, 0, STAT_SLIDER_MAX),
          translate: '-50% -50%',
          width: 2,
          height: 16,
          flexShrink: 0,
          background: FG,
          userSelect: 'none',
        }}
      />
    </div>
  )
}
