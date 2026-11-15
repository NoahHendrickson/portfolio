import { useCallback, useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent } from 'react'
import { CaretLeft, CaretRight } from '@phosphor-icons/react'

/*
  Two pictures of the same thing laid one over the other with a divider between them that the
  visitor drags (no3y Code's hero, Nov 15 2026: the new agent screen in Glass and in Inlet,
  captured from the same state and placed identically, so only the theme changes across the
  line). `before` fills the frame; `after` is clipped to the right of the divider. The whole frame
  takes the pointer, so a press anywhere moves the divider there and dragging carries it; the
  handle is the slider for keyboards (arrows step 2%, Shift 10%, Home / End to the ends). Vertical
  page scrolling still works on touch (`touch-action: pan-y`).
*/

export type CompareImage = { src: string; srcSet?: string; label: string }

const HANDLE = 40
const LINE = 2

export default function CompareSlider({
  before,
  after,
  alt,
  aspect,
  priority = false,
  radius,
}: {
  before: CompareImage
  after: CompareImage
  /** Describes both pictures and the control. */
  alt: string
  aspect: string
  priority?: boolean
  radius?: string
}) {
  const frameRef = useRef<HTMLDivElement>(null)
  const [split, setSplit] = useState(50)
  const [dragging, setDragging] = useState(false)

  const moveTo = useCallback((clientX: number) => {
    const frame = frameRef.current
    if (!frame) return
    const r = frame.getBoundingClientRect()
    setSplit(Math.min(100, Math.max(0, ((clientX - r.left) / r.width) * 100)))
  }, [])

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return
    e.currentTarget.setPointerCapture(e.pointerId)
    setDragging(true)
    moveTo(e.clientX)
  }
  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (dragging) moveTo(e.clientX)
  }
  const onPointerUp = (e: PointerEvent<HTMLDivElement>) => {
    if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId)
    setDragging(false)
  }
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const step = e.shiftKey ? 10 : 2
    const next =
      e.key === 'ArrowLeft' || e.key === 'ArrowDown' ? split - step
      : e.key === 'ArrowRight' || e.key === 'ArrowUp' ? split + step
      : e.key === 'Home' ? 0
      : e.key === 'End' ? 100
      : null
    if (next === null) return
    e.preventDefault()
    setSplit(Math.min(100, Math.max(0, next)))
  }

  const img: CSSProperties = { position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block', userSelect: 'none', pointerEvents: 'none' }
  const tag = (side: 'left' | 'right', hidden: boolean): CSSProperties => ({
    position: 'absolute',
    top: 12,
    [side]: 12,
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
  })

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
      <img src={before.src} srcSet={before.srcSet} sizes="auto, 100vw" alt={alt} draggable={false} loading={priority ? 'eager' : 'lazy'} fetchPriority={priority ? 'high' : undefined} decoding="async" style={img} />
      <img
        src={after.src}
        srcSet={after.srcSet}
        sizes="auto, 100vw"
        alt=""
        aria-hidden
        draggable={false}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        style={{ ...img, clipPath: `inset(0 0 0 ${split}%)` }}
      />
      <span aria-hidden style={tag('left', split < 12)}>{before.label}</span>
      <span aria-hidden style={tag('right', split > 88)}>{after.label}</span>
      {/* The divider and its grip. */}
      <div aria-hidden style={{ position: 'absolute', top: 0, bottom: 0, left: `${split}%`, width: LINE, marginLeft: -LINE / 2, background: '#fff', boxShadow: '0 0 0 0.5px rgb(0 0 0 / 25%), 0 0 12px rgb(0 0 0 / 25%)', pointerEvents: 'none' }} />
      <div
        role="slider"
        tabIndex={0}
        aria-label={`Compare ${before.label} and ${after.label}`}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(split)}
        aria-valuetext={`${Math.round(100 - split)}% ${after.label}`}
        onKeyDown={onKeyDown}
        className="compare-grip"
        style={{
          position: 'absolute',
          top: '50%',
          left: `${split}%`,
          width: HANDLE,
          height: HANDLE,
          marginLeft: -HANDLE / 2,
          marginTop: -HANDLE / 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '50%',
          background: '#fff',
          color: '#141414',
          boxShadow: '0 2px 10px rgb(0 0 0 / 30%), 0 0 0 0.5px rgb(0 0 0 / 20%)',
          transform: dragging ? 'scale(0.94)' : undefined,
          transition: 'transform 150ms ease-out',
        }}
      >
        <CaretLeft size={14} />
        <CaretRight size={14} />
      </div>
    </div>
  )
}
