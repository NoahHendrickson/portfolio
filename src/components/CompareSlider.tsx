import { useCallback, useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent } from 'react'
import { CaretLeft, CaretRight } from '@phosphor-icons/react'
import { DIVIDER_GAP, HANDLE, gripOffset, gripStyle, pushSplits } from '../compareGrip'

/*
  Pictures of the same thing laid one over the other with dividers between them that the
  visitor drags (no3y Code's hero, Nov 15 2026: the new agent screen in Glass and in Inlet,
  captured from the same state and placed identically, so only the theme changes across a line;
  Basic joined them Nov 16 2026, three pictures on two dividers). `layers` run left to right:
  the first fills the frame, each after it is clipped to the right of its divider. The whole
  frame takes the pointer, so a press anywhere moves the nearest divider there and dragging
  carries it; each grip is a slider for keyboards (arrows step 2%, Shift 10%, Home / End to the
  edges). A divider dragged within 24px of its neighbour pushes it along
  (`pushSplits`, as the page's dividers do). Vertical page scrolling still
  works on touch (`touch-action: pan-y`).
*/

export type CompareImage = { src: string; srcSet?: string; label: string }

const LINE = 2
/** A label hides once its band is narrower than this share of the frame. */
const LABEL_ROOM = 0.12

export default function CompareSlider({
  layers,
  alt,
  aspect,
  priority = false,
  radius,
}: {
  layers: CompareImage[]
  /** Describes the pictures and the control. */
  alt: string
  aspect: string
  priority?: boolean
  radius?: string
}) {
  const frameRef = useRef<HTMLDivElement>(null)
  const count = layers.length - 1
  // Percentages, evenly spaced to start.
  const [splits, setSplits] = useState(() => Array.from({ length: count }, (_, i) => ((i + 1) * 100) / layers.length))
  const [dragging, setDragging] = useState<number | null>(null)
  const [frameWidth, setFrameWidth] = useState(0)

  const place = useCallback((index: number, value: number) => {
    const width = frameRef.current?.getBoundingClientRect().width || 1
    setSplits((prev) => pushSplits(prev, index, value, (DIVIDER_GAP / width) * 100, 100))
  }, [])
  const percentAt = (clientX: number) => {
    const r = frameRef.current!.getBoundingClientRect()
    setFrameWidth(r.width)
    return ((clientX - r.left) / r.width) * 100
  }

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0 || !frameRef.current) return
    const at = percentAt(e.clientX)
    // A grip pressed directly drags that divider; elsewhere, the nearest one jumps there.
    const grip = (e.target as HTMLElement).closest<HTMLElement>('[data-grip]')
    const index = grip ? Number(grip.dataset.grip) : splits.reduce((best, s, i) => (Math.abs(s - at) < Math.abs(splits[best] - at) ? i : best), 0)
    e.currentTarget.setPointerCapture(e.pointerId)
    setDragging(index)
    place(index, at)
  }
  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (dragging !== null) place(dragging, percentAt(e.clientX))
  }
  const onPointerUp = (e: PointerEvent<HTMLDivElement>) => {
    if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId)
    setDragging(null)
  }
  const onKeyDown = (index: number) => (e: KeyboardEvent<HTMLDivElement>) => {
    const step = e.shiftKey ? 10 : 2
    const split = splits[index]
    const next =
      e.key === 'ArrowLeft' || e.key === 'ArrowDown' ? split - step
      : e.key === 'ArrowRight' || e.key === 'ArrowUp' ? split + step
      : e.key === 'Home' ? 0
      : e.key === 'End' ? 100
      : null
    if (next === null) return
    e.preventDefault()
    place(index, next)
  }

  const cuts = [0, ...splits, 100]
  // The grips step apart vertically when they'd overlap (measured off the frame once it's been touched).
  const gapPx = count > 1 && frameWidth > 0 ? ((splits[1] - splits[0]) / 100) * frameWidth : Infinity

  const img: CSSProperties = { position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block', userSelect: 'none', pointerEvents: 'none' }
  const tag = (band: number): CSSProperties => {
    const hidden = (cuts[band + 1] - cuts[band]) / 100 < LABEL_ROOM
    return {
      position: 'absolute',
      top: 12,
      // Each band's label sits at its top left, the last's at the frame's top right.
      ...(band === layers.length - 1 ? { right: 12 } : { left: `calc(${cuts[band]}% + 12px)` }),
      padding: '4px 10px',
      borderRadius: 'var(--radius-full)',
      background: 'rgb(0 0 0 / 45%)',
      color: '#fff',
      fontSize: '13px',
      fontWeight: 500,
      lineHeight: '18px',
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
      opacity: hidden ? 0 : 1,
      transition: 'opacity 200ms ease-out',
      pointerEvents: 'none',
    }
  }

  return (
    <div
      ref={frameRef}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      style={{
        position: 'relative',
        width: '100%',
        aspectRatio: aspect,
        overflow: 'hidden',
        borderRadius: radius,
        cursor: 'ew-resize',
        touchAction: 'pan-y',
        userSelect: 'none',
      }}
    >
      {layers.map((layer, i) => (
        <img
          key={layer.src}
          src={layer.src}
          srcSet={layer.srcSet}
          sizes="auto, 100vw"
          alt={i === 0 ? alt : ''}
          aria-hidden={i === 0 ? undefined : true}
          draggable={false}
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority && i === 0 ? 'high' : undefined}
          decoding="async"
          style={i === 0 ? img : { ...img, clipPath: `inset(0 0 0 ${cuts[i]}%)` }}
        />
      ))}
      {layers.map((layer, i) => (
        <span key={layer.label} aria-hidden style={tag(i)}>
          {layer.label}
        </span>
      ))}
      {splits.map((split, i) => {
        const top = gripOffset(gapPx, i)
        return (
          <div key={i}>
            <div aria-hidden style={{ position: 'absolute', top: 0, bottom: 0, left: `${split}%`, width: LINE, marginLeft: -LINE / 2, background: '#fff', boxShadow: '0 0 0 0.5px rgb(0 0 0 / 25%), 0 0 12px rgb(0 0 0 / 25%)', pointerEvents: 'none' }} />
            <div
              role="slider"
              tabIndex={0}
              data-grip={i}
              aria-label={`Divider between ${layers[i].label} and ${layers[i + 1].label}`}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(split)}
              aria-valuetext={`${Math.round(split)}% from the left`}
              onKeyDown={onKeyDown(i)}
              className="compare-grip"
              style={{ ...gripStyle(dragging === i), top: `calc(50% + ${top - HANDLE / 2}px)`, left: `${split}%`, marginLeft: -HANDLE / 2 }}
            >
              <CaretLeft size={14} />
              <CaretRight size={14} />
            </div>
          </div>
        )
      })}
    </div>
  )
}
