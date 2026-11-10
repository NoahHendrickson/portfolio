import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type FocusEvent, type PointerEvent, type ReactElement, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { CARD_LINE, FG, FG_MUTED, FONT } from './confluxTheme'
import { clamp } from './optimizerData'
import './optimizer.css'

/**
 * The app's `TooltipLabel` (Base UI Tooltip + `TooltipContent`), shared by the
 * optimizer replicas: opens 150ms after the mouse rests on the trigger, or at once on
 * keyboard focus, and closes the moment either leaves. The plate is `d2-glass
 * bg-panel-strong` under slate: the backdrop's blue at 82% over a 20px blur, the plain
 * 15% hairline, square, 6px above the trigger (flipped under it when there's no room),
 * fading and growing in from 97%. Touch holds aren't replicated; touch never opens it.
 */

/** `--panel-strong` under `.dark[data-app-theme="slate"]`. */
const PANEL_STRONG = 'rgb(55 67 88 / 0.82)'
/** TooltipProvider's delay and TooltipContent's side offset. */
const DELAY_MS = 150
const OFFSET = 6
/** Keep the plate this far inside the viewport. */
const EDGE = 8

export interface TipTriggerProps {
  onPointerEnter: (e: PointerEvent<HTMLElement>) => void
  onPointerLeave: () => void
  onFocus: (e: FocusEvent<HTMLElement>) => void
  onBlur: () => void
}

export default function OptimizerTooltip({
  label,
  children,
}: {
  label: ReactNode
  /** Render the trigger, spreading these handlers onto it. */
  children: (trigger: TipTriggerProps) => ReactElement
}) {
  const [anchor, setAnchor] = useState<HTMLElement | null>(null)
  // The trigger the mouse is resting on; it opens once it has rested DELAY_MS.
  const [pending, setPending] = useState<HTMLElement | null>(null)

  useEffect(() => {
    if (!pending) return
    const id = window.setTimeout(() => setAnchor(pending), DELAY_MS)
    return () => window.clearTimeout(id)
  }, [pending])
  // A scroll moves the trigger out from under a fixed plate; Base UI closes on it too.
  useEffect(() => {
    if (!anchor) return
    const close = () => setAnchor(null)
    window.addEventListener('scroll', close, true)
    return () => window.removeEventListener('scroll', close, true)
  }, [anchor])

  const close = () => {
    setPending(null)
    setAnchor(null)
  }
  const trigger: TipTriggerProps = {
    onPointerEnter: (e) => {
      if (e.pointerType !== 'touch') setPending(e.currentTarget)
    },
    onPointerLeave: close,
    onFocus: (e) => {
      if (e.currentTarget.matches(':focus-visible')) setAnchor(e.currentTarget)
    },
    onBlur: close,
  }

  return (
    <>
      {children(trigger)}
      {anchor && createPortal(<TipPlate anchor={anchor}>{label}</TipPlate>, document.body)}
    </>
  )
}

function TipPlate({ anchor, children }: { anchor: HTMLElement; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)

  // Seat the plate before it paints: centred over the trigger, inside the viewport.
  useLayoutEffect(() => {
    const tip = ref.current
    if (!tip) return
    const a = anchor.getBoundingClientRect()
    const w = tip.offsetWidth
    const h = tip.offsetHeight
    let top = a.top - OFFSET - h
    let side = 'bottom'
    if (top < EDGE) {
      top = a.bottom + OFFSET
      side = 'top'
    }
    const centre = a.left + a.width / 2
    const left = clamp(centre - w / 2, EDGE, Math.max(EDGE, window.innerWidth - EDGE - w))
    tip.style.left = `${left}px`
    tip.style.top = `${top}px`
    tip.style.transformOrigin = `${centre - left}px ${side}`
    tip.style.visibility = 'visible'
  }, [anchor])

  return (
    <div
      ref={ref}
      role="tooltip"
      data-theme="dark"
      className="cfx-opt-tip"
      style={
        {
          '--cfx-opt-fg': FG,
          '--cfx-opt-muted': FG_MUTED,
          position: 'fixed',
          left: 0,
          top: 0,
          zIndex: 50,
          visibility: 'hidden',
          pointerEvents: 'none',
          width: 'max-content',
          maxWidth: `min(320px, calc(100vw - 16px))`,
          padding: '8px 12px',
          boxSizing: 'border-box',
          background: PANEL_STRONG,
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: `1px solid ${CARD_LINE}`,
          borderRadius: 0,
          boxShadow: '0 2px 16px rgb(0 0 0 / 0.25)',
          color: FG,
          fontFamily: FONT,
          fontSize: 12,
          fontWeight: 400,
          lineHeight: '19.5px',
          whiteSpace: 'pre-line',
          textAlign: 'start',
        } as CSSProperties
      }
    >
      {children}
    </div>
  )
}
