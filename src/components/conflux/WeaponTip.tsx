import { useEffect, useLayoutEffect, useRef, useState, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { FG, FONT } from './confluxTheme'
import './weapons.css'

/**
 * The app's tooltip (`ui/tooltip.tsx` on Base UI), rebuilt for the weapon
 * replicas: a frosted slate plate, square, with a hairline and a soft drop
 * shadow, 6px off its trigger, flipping and shifting to stay 5px inside the
 * window. Hover opens it after `delay` (none once another tip has just been open,
 * and then without the fade, as Base UI's delay group does), keyboard focus opens
 * it at once, pressing the trigger closes it, and on touch a still finger held
 * for 450ms opens it and swallows the tap that ends the hold, so a held tile
 * shows its name without being picked.
 */

const SIDE_OFFSET = 6
const COLLISION_PADDING = 5
const TOUCH_HOLD_MS = 450
const TOUCH_HOLD_SLOP_PX = 10
const HOLD_CLICK_MS = 400
/** A tip opening this soon after another closed opens at once, unanimated. */
const GROUP_MS = 400

/** The delay group, shared by every tip on the page. */
const group = { open: 0, closedAt: 0 }
const inGroup = () => group.open > 0 || performance.now() - group.closedAt < GROUP_MS

export function WeaponTip({
  label,
  side = 'top',
  align = 'center',
  delay = 0,
  maxWidth = 320,
  lineHeight = '19.5px',
  as = 'button',
  children,
  ...rest
}: ButtonHTMLAttributes<HTMLElement> & {
  label: ReactNode
  side?: 'top' | 'bottom'
  align?: 'center' | 'end'
  /** Hover delay in ms (the app's row icons wait 100, its perk tiles none). */
  delay?: number
  maxWidth?: number
  /** `leading-relaxed` by default; the info tip's paragraphs run on `text-xs`'s own 16. */
  lineHeight?: string
  /** The trigger's own element: a button, or a span inside one (the row icons). */
  as?: 'button' | 'span'
  children: ReactNode
}) {
  const [open, setOpen] = useState<false | 'animate' | 'instant'>(false)
  const triggerRef = useRef<HTMLButtonElement | null>(null)
  const popupRef = useRef<HTMLDivElement | null>(null)
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const hold = useRef<{ x: number; y: number } | null>(null)
  const swallow = useRef(false)
  /** Pressed while hovered: stays shut until the pointer leaves. */
  const pressed = useRef(false)

  const show = () => {
    clearTimeout(timer.current)
    const instant = inGroup()
    setOpen((was) => was || (instant ? 'instant' : 'animate'))
  }
  const hide = () => {
    clearTimeout(timer.current)
    setOpen(false)
  }

  useEffect(() => {
    if (!open) return
    group.open += 1
    const close = () => setOpen(false)
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && close()
    const capture = { capture: true }
    document.addEventListener('keydown', onKey)
    document.addEventListener('scroll', close, capture)
    // A touch-held tip closes on the next touch anywhere.
    const onDown = (event: PointerEvent) => event.pointerType === 'touch' && close()
    document.addEventListener('pointerdown', onDown, capture)
    return () => {
      group.open -= 1
      group.closedAt = performance.now()
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('scroll', close, capture)
      document.removeEventListener('pointerdown', onDown, capture)
    }
  }, [open])

  useEffect(() => () => clearTimeout(timer.current), [])

  // Placed by hand once its size is known: above (or below) the trigger,
  // flipped when that side has no room, shifted to stay inside the window.
  useLayoutEffect(() => {
    const trigger = triggerRef.current
    const popup = popupRef.current
    if (!open || !trigger || !popup) return
    const place = () => {
      const t = trigger.getBoundingClientRect()
      const w = popup.offsetWidth
      const h = popup.offsetHeight
      const vw = document.documentElement.clientWidth
      const vh = window.innerHeight
      let onTop = side === 'top'
      if (onTop && t.top - SIDE_OFFSET - h < COLLISION_PADDING && t.bottom + SIDE_OFFSET + h <= vh - COLLISION_PADDING) onTop = false
      else if (!onTop && t.bottom + SIDE_OFFSET + h > vh - COLLISION_PADDING && t.top - SIDE_OFFSET - h >= COLLISION_PADDING) onTop = true
      const y = onTop ? t.top - SIDE_OFFSET - h : t.bottom + SIDE_OFFSET
      const want = align === 'end' ? t.right - w : t.left + t.width / 2 - w / 2
      const x = Math.min(Math.max(want, COLLISION_PADDING), vw - COLLISION_PADDING - w)
      const originX = align === 'end' ? t.right - x : t.left + t.width / 2 - x
      popup.style.transform = `translate(${Math.round(x)}px, ${Math.round(y)}px)`
      const inner = popup.firstElementChild as HTMLElement | null
      if (inner) inner.style.transformOrigin = `${originX}px ${onTop ? `calc(100% + ${SIDE_OFFSET}px)` : `-${SIDE_OFFSET}px`}`
      popup.style.visibility = 'visible'
    }
    place()
    window.addEventListener('resize', place)
    return () => window.removeEventListener('resize', place)
  }, [open, side, align])

  const Trigger = as as 'button'
  return (
    <>
      <Trigger
        {...rest}
        ref={triggerRef}
        onPointerEnter={(event) => {
          if (event.pointerType === 'touch' || pressed.current) return
          clearTimeout(timer.current)
          if (delay === 0 || inGroup()) show()
          else timer.current = setTimeout(show, delay)
        }}
        onPointerLeave={(event) => {
          if (event.pointerType === 'touch') return
          pressed.current = false
          hide()
        }}
        onPointerDown={(event) => {
          if (event.pointerType !== 'touch') {
            pressed.current = true
            hide()
            return
          }
          clearTimeout(timer.current)
          hold.current = { x: event.clientX, y: event.clientY }
          timer.current = setTimeout(() => {
            hold.current = null
            swallow.current = true
            show()
          }, TOUCH_HOLD_MS)
        }}
        onPointerMove={(event) => {
          const start = hold.current
          if (start && Math.hypot(event.clientX - start.x, event.clientY - start.y) > TOUCH_HOLD_SLOP_PX) {
            hold.current = null
            clearTimeout(timer.current)
          }
        }}
        onPointerUp={() => {
          if (hold.current) {
            hold.current = null
            clearTimeout(timer.current)
          }
          if (swallow.current) setTimeout(() => (swallow.current = false), HOLD_CLICK_MS)
        }}
        onPointerCancel={() => {
          hold.current = null
          clearTimeout(timer.current)
        }}
        onClickCapture={(event) => {
          if (!swallow.current) return
          swallow.current = false
          event.preventDefault()
          event.stopPropagation()
        }}
        onFocus={(event) => {
          if ((event.currentTarget as HTMLElement).matches(':focus-visible')) show()
        }}
        onBlur={hide}
      >
        {children}
      </Trigger>
      {open &&
        createPortal(
          <div
            ref={popupRef}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              zIndex: 1000,
              pointerEvents: 'none',
              visibility: 'hidden',
            }}
          >
            <div
              role="tooltip"
              className={open === 'animate' ? 'cfx-wpn-tip-in' : undefined}
              style={{
                boxSizing: 'border-box',
                width: 'fit-content',
                maxWidth: `min(${maxWidth}px, calc(100vw - 1rem))`,
                padding: '8px 12px',
                background: 'rgb(55 67 88 / 0.82)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid rgb(252 252 245 / 0.15)',
                boxShadow: '0 2px 16px rgb(0 0 0 / 0.25)',
                color: FG,
                fontFamily: FONT,
                fontSize: 12,
                fontWeight: 400,
                lineHeight,
                whiteSpace: 'pre-line',
                textAlign: 'start',
                WebkitFontSmoothing: 'antialiased',
                MozOsxFontSmoothing: 'grayscale',
              }}
            >
              {label}
            </div>
          </div>,
          document.body,
        )}
    </>
  )
}
