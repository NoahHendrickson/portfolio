import {
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type FocusEvent,
  type PointerEvent,
  type ReactNode,
} from 'react'
import { createPortal } from 'react-dom'
import { FG, FG_MUTED, FONT, ITEM_FRAME, ITEM_FRAME_MASTERWORK } from './confluxTheme'
import { ItemArt, TileFooter } from './ItemTile'
import {
  ABILITIES,
  ASPECTS,
  FRAGMENTS,
  LOADOUT_META,
  LOADOUT_NAME,
  MENU,
  PIECES,
  SET_BONUSES,
  STATS,
  STAT_TOTAL,
  SUBCLASS,
  plugLabel,
  type MenuIcon,
  type Piece,
  type Plug,
} from './loadoutData'
import './loadout.css'

/** The app's exotic gold (`--exotic`), for an exotic piece's name. */
const EXOTIC = '#ceae33'

const TRUNCATE: CSSProperties = { overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }

// ── Tooltip ──────────────────────────────────────────────────────────────

/** How long a finger rests on a trigger before its tooltip opens (touch never hovers). */
const TOUCH_HOLD_MS = 450
const TOUCH_SLOP_PX = 10

/**
 * The app's tooltip (`ui/tooltip.tsx`, Base UI): opens after `delay` on a mouse hover,
 * at once on keyboard focus, or on a press-and-hold by touch; sits 6px above its
 * trigger, centred, flipping under it and shifting to stay on screen. No arrow.
 */
function Tip({
  content,
  delay = 150,
  popStyle,
  focusable = true,
  label,
  className,
  style,
  children,
}: {
  content: ReactNode
  delay?: number
  popStyle?: CSSProperties
  /** A tab stop of its own (false where it sits inside a button). */
  focusable?: boolean
  label?: string
  className?: string
  style?: CSSProperties
  children: ReactNode
}) {
  const [open, setOpen] = useState(false)
  const trigger = useRef<HTMLSpanElement>(null)
  const pop = useRef<HTMLDivElement | null>(null)
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const press = useRef<{ x: number; y: number } | null>(null)

  const clear = () => {
    clearTimeout(timer.current)
    press.current = null
  }
  const close = () => {
    clear()
    setOpen(false)
  }

  useLayoutEffect(() => {
    if (!open) return
    const place = () => {
      const t = trigger.current
      const p = pop.current
      if (!t || !p) return
      const r = t.getBoundingClientRect()
      const w = p.offsetWidth
      const h = p.offsetHeight
      let top = r.top - 6 - h
      let origin = 'bottom'
      if (top < 4) {
        top = r.bottom + 6
        origin = 'top'
      }
      const left = Math.max(8, Math.min(r.left + r.width / 2 - w / 2, window.innerWidth - w - 8))
      p.style.left = `${left}px`
      p.style.top = `${top}px`
      p.style.transformOrigin = `${r.left + r.width / 2 - left}px ${origin}`
    }
    place()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('scroll', place, true)
    window.addEventListener('resize', place)
    document.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('scroll', place, true)
      window.removeEventListener('resize', place)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  // A hold-opened tooltip closes on the next touch anywhere.
  useEffect(() => {
    if (!open) return
    const onDown = (e: Event) => {
      if ((e as globalThis.PointerEvent).pointerType === 'touch') setOpen(false)
    }
    document.addEventListener('pointerdown', onDown, true)
    return () => document.removeEventListener('pointerdown', onDown, true)
  }, [open])

  useEffect(() => () => clearTimeout(timer.current), [])

  const handlers = {
    onPointerEnter: (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return
      clear()
      timer.current = setTimeout(() => setOpen(true), delay)
    },
    onPointerLeave: () => {
      if (press.current) return
      close()
    },
    onPointerDown: (e: PointerEvent) => {
      if (e.pointerType !== 'touch') return
      clear()
      press.current = { x: e.clientX, y: e.clientY }
      timer.current = setTimeout(() => {
        press.current = null
        setOpen(true)
      }, TOUCH_HOLD_MS)
    },
    onPointerMove: (e: PointerEvent) => {
      const p = press.current
      if (p && Math.hypot(e.clientX - p.x, e.clientY - p.y) > TOUCH_SLOP_PX) clear()
    },
    onPointerUp: () => {
      if (press.current) clear()
    },
    onFocus: (e: FocusEvent) => {
      if (e.currentTarget.matches(':focus-visible')) setOpen(true)
    },
    onBlur: close,
  }

  return (
    <>
      <span
        ref={trigger}
        tabIndex={focusable ? 0 : undefined}
        aria-label={label}
        className={className}
        style={style}
        {...handlers}
      >
        {children}
      </span>
      {open &&
        createPortal(
          <div ref={pop} role="tooltip" data-theme="dark" className="cfx-lo-tip" style={{ fontFamily: FONT, ...popStyle }}>
            {content}
          </div>,
          document.body,
        )}
    </>
  )
}

/** A mod, perk or subclass plug's tooltip: name (and kind), any stat line, then what it does. */
function PlugTooltip({ plug }: { plug: Plug }) {
  return (
    <span style={{ display: 'flex', flexDirection: 'column', gap: 4, maxWidth: 256 }}>
      <span>
        <span style={{ fontWeight: 500 }}>{plug.name}</span>
        {plug.suffix && <span style={{ color: FG_MUTED }}> — {plug.suffix}</span>}
      </span>
      {plug.stats && <span>{plug.stats}</span>}
      {plug.description && <span style={{ color: FG_MUTED }}>{plug.description}</span>}
    </span>
  )
}

// ── Glyphs (the app's Hugeicons, verbatim) ───────────────────────────────

function Svg({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      color="currentColor"
      className={className}
      aria-hidden
    >
      {children}
    </svg>
  )
}

/** ArrowDown01, stroke 2. */
function ChevronDown({ className }: { className?: string }) {
  return (
    <Svg className={className}>
      <path d="M18 9.00005C18 9.00005 13.5811 15 12 15C10.4188 15 6 9 6 9" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
    </Svg>
  )
}

/** MoreVertical, stroke 2. */
function MoreVertical() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" color="currentColor" aria-hidden>
      <path d="M11.9967 12.5V12M11.9967 6.5V6M11.9967 18.5V18M12.9967 12.5C12.9967 11.9477 12.549 11.5 11.9967 11.5C11.4444 11.5 10.9967 11.9477 10.9967 12.5C10.9967 13.0523 11.4444 13.5 11.9967 13.5C12.549 13.5 12.9967 13.0523 12.9967 12.5ZM12.9967 6.5C12.9967 5.94772 12.549 5.5 11.9967 5.5C11.4444 5.5 10.9967 5.94772 10.9967 6.5C10.9967 7.05228 11.4444 7.5 11.9967 7.5C12.549 7.5 12.9967 7.05228 12.9967 6.5ZM12.9967 18.5C12.9967 17.9477 12.549 17.5 11.9967 17.5C11.4444 17.5 10.9967 17.9477 10.9967 18.5C10.9967 19.0523 11.4444 19.5 11.9967 19.5C12.549 19.5 12.9967 19.0523 12.9967 18.5Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
    </svg>
  )
}

/** ArrowRight01: the submenu chevron. */
function ChevronRight() {
  return (
    <Svg>
      <path d="M9.00005 6C9.00005 6 15 10.4189 15 12C15 13.5812 9 18 9 18" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
    </Svg>
  )
}

const COPY = (
  <>
    <path d="M7.5 14.5C7.5 11.2002 7.5 9.55025 8.52513 8.52513C9.55025 7.5 11.2002 7.5 14.5 7.5C17.7998 7.5 19.4497 7.5 20.4749 8.52513C21.5 9.55025 21.5 11.2002 21.5 14.5C21.5 17.7998 21.5 19.4497 20.4749 20.4749C19.4497 21.5 17.7998 21.5 14.5 21.5C11.2002 21.5 9.55025 21.5 8.52513 20.4749C7.5 19.4497 7.5 17.7998 7.5 14.5Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
    <path d="M7.5 16.5C6.10355 16.5 5.40533 16.5 4.84402 16.3036C3.83866 15.9518 3.0482 15.1613 2.69641 14.156C2.5 13.5947 2.5 12.8964 2.5 11.5V9.5C2.5 6.20017 2.5 4.55025 3.52513 3.52513C4.55025 2.5 6.20017 2.5 9.5 2.5H11.5C12.8964 2.5 13.5947 2.5 14.156 2.69641C15.1613 3.0482 15.9518 3.83866 16.3036 4.84402C16.5 5.40533 16.5 6.10355 16.5 7.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
  </>
)

/** The actions menu's icons: SlidersHorizontal, Download04, FloppyDisk, PencilEdit02, Tag, Share08, Copy01, LinkSquare02, Delete02. */
const MENU_ICONS: Record<MenuIcon, ReactNode> = {
  optimize: (
    <>
      <path d="M3.99963 5.00055L9.99963 5.00031" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
      <path d="M12.9996 5.00031L19.9996 5.00031" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
      <path d="M15.9996 9.00031L15.9996 15.0003" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
      <path d="M9.99963 2.00031L9.99963 8.00031" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
      <path d="M11.9996 16.0003L11.9996 22.0003" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
      <path d="M15.9996 12.0001L19.9996 12.0003" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
      <path d="M3.99963 12.0005L12.9996 12.0003" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
      <path d="M11.9996 19.0003L19.9996 19.0003" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
      <path d="M3.99963 19.0005L8.99963 19.0003" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
    </>
  ),
  equip: (
    <>
      <path d="M16.9504 12.1817C17.1981 12.814 16.5076 13.5726 15.1267 15.0899C13.6702 16.6902 12.9201 17.4904 12 17.5C11.0799 17.4904 10.3298 16.6902 8.87331 15.0899C7.49239 13.5726 6.80193 12.814 7.04964 12.1817C7.05868 12.1586 7.06851 12.1359 7.0791 12.1135C7.34928 11.542 8.24477 11.5029 10 11.5002V4.99998C10 4.53501 10 4.30253 10.0511 4.11179C10.1898 3.59414 10.5941 3.1898 11.1118 3.05111C11.3025 3 11.535 3 12 3C12.4649 3 12.6974 3 12.8882 3.05111C13.4058 3.1898 13.8102 3.59414 13.9489 4.11179C14 4.30253 14 4.53501 14 4.99998V11.5002C15.7552 11.5029 16.6507 11.542 16.9209 12.1135C16.9315 12.1359 16.9413 12.1586 16.9504 12.1817Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
      <path d="M5.00006 21H19.0001" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
    </>
  ),
  save: (
    <>
      <path d="M8 22V19C8 17.1144 8 16.1716 8.58579 15.5858C9.17157 15 10.1144 15 12 15C13.8856 15 14.8284 15 15.4142 15.5858C16 16.1716 16 17.1144 16 19V22" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.5" />
      <path d="M10 7H14" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
      <path d="M3 11.8584C3 7.28199 3 4.99376 4.38674 3.54394C4.43797 3.49038 4.49038 3.43797 4.54394 3.38674C5.99376 2 8.28199 2 12.8584 2C13.943 2 14.4655 2.00376 14.9628 2.18936C15.4417 2.3681 15.8429 2.70239 16.6452 3.37099L18.8411 5.20092C19.9027 6.08561 20.4335 6.52795 20.7168 7.13266C21 7.73737 21 8.42833 21 9.81025V13C21 16.7497 21 18.6246 20.0451 19.9389C19.7367 20.3634 19.3634 20.7367 18.9389 21.0451C17.6246 22 15.7497 22 12 22C8.25027 22 6.3754 22 5.06107 21.0451C4.6366 20.7367 4.26331 20.3634 3.95491 19.9389C3 18.6246 3 16.7497 3 13V11.8584Z" stroke="currentColor" strokeWidth="1.5" />
    </>
  ),
  edit: (
    <>
      <path d="M16.4249 4.60509L17.4149 3.6151C18.2351 2.79497 19.5648 2.79497 20.3849 3.6151C21.205 4.43524 21.205 5.76493 20.3849 6.58507L19.3949 7.57506M16.4249 4.60509L9.76558 11.2644C9.25807 11.772 8.89804 12.4078 8.72397 13.1041L8 16L10.8959 15.276C11.5922 15.102 12.228 14.7419 12.7356 14.2344L19.3949 7.57506M16.4249 4.60509L19.3949 7.57506" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.5" />
      <path d="M18.9999 13.5C18.9999 16.7875 18.9999 18.4312 18.092 19.5376C17.9258 19.7401 17.7401 19.9258 17.5375 20.092C16.4312 21 14.7874 21 11.4999 21H11C7.22876 21 5.34316 21 4.17159 19.8284C3.00003 18.6569 3 16.7712 3 13V12.5C3 9.21252 3 7.56879 3.90794 6.46244C4.07417 6.2599 4.2599 6.07417 4.46244 5.90794C5.56879 5 7.21252 5 10.5 5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
    </>
  ),
  tag: (
    <>
      <circle cx="1.5" cy="1.5" r="1.5" transform="matrix(1 0 0 -1 16 8.00024)" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
      <path d="M2.77423 11.1439C1.77108 12.2643 1.7495 13.9546 2.67016 15.1437C4.49711 17.5033 6.49674 19.5029 8.85633 21.3298C10.0454 22.2505 11.7357 22.2289 12.8561 21.2258C15.8979 18.5022 18.6835 15.6559 21.3719 12.5279C21.6377 12.2187 21.8039 11.8397 21.8412 11.4336C22.0062 9.63798 22.3452 4.46467 20.9403 3.05974C19.5353 1.65481 14.362 1.99377 12.5664 2.15876C12.1603 2.19608 11.7813 2.36233 11.472 2.62811C8.34412 5.31646 5.49781 8.10211 2.77423 11.1439Z" stroke="currentColor" strokeWidth="1.5" />
      <path d="M7.00002 14.0002L10 17.0002" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
    </>
  ),
  share: (
    <>
      <path d="M21 6.5C21 8.15685 19.6569 9.5 18 9.5C16.3431 9.5 15 8.15685 15 6.5C15 4.84315 16.3431 3.5 18 3.5C19.6569 3.5 21 4.84315 21 6.5Z" stroke="currentColor" strokeWidth="1.5" />
      <path d="M9 12C9 13.6569 7.65685 15 6 15C4.34315 15 3 13.6569 3 12C3 10.3431 4.34315 9 6 9C7.65685 9 9 10.3431 9 12Z" stroke="currentColor" strokeWidth="1.5" />
      <path d="M21 17.5C21 19.1569 19.6569 20.5 18 20.5C16.3431 20.5 15 19.1569 15 17.5C15 15.8431 16.3431 14.5 18 14.5C19.6569 14.5 21 15.8431 21 17.5Z" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8.72852 10.7495L15.2285 7.75M8.72852 13.25L15.2285 16.2495" stroke="currentColor" strokeWidth="1.5" />
    </>
  ),
  copy: COPY,
  dim: (
    <>
      <path d="M11.0991 3.00012C7.45013 3.00669 5.53932 3.09629 4.31817 4.31764C3.00034 5.63568 3.00034 7.75704 3.00034 11.9997C3.00034 16.2424 3.00034 18.3638 4.31817 19.6818C5.63599 20.9999 7.75701 20.9999 11.9991 20.9999C16.241 20.9999 18.3621 20.9999 19.6799 19.6818C20.901 18.4605 20.9906 16.5493 20.9972 12.8998" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
      <path d="M20.556 3.49612L11.0487 13.0586M20.556 3.49612C20.062 3.00151 16.7343 3.04761 16.0308 3.05762M20.556 3.49612C21.05 3.99074 21.0039 7.32273 20.9939 8.02714" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
    </>
  ),
  delete: (
    <>
      <path d="M19.5 5.5L18.8803 15.5251C18.7219 18.0864 18.6428 19.3671 18.0008 20.2879C17.6833 20.7431 17.2747 21.1273 16.8007 21.416C15.8421 22 14.559 22 11.9927 22C9.42312 22 8.1383 22 7.17905 21.4149C6.7048 21.1257 6.296 20.7408 5.97868 20.2848C5.33688 19.3626 5.25945 18.0801 5.10461 15.5152L4.5 5.5" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
      <path d="M3 5.5H21M16.0557 5.5L15.3731 4.09173C14.9196 3.15626 14.6928 2.68852 14.3017 2.39681C14.215 2.3321 14.1231 2.27454 14.027 2.2247C13.5939 2 13.0741 2 12.0345 2C10.9688 2 10.436 2 9.99568 2.23412C9.8981 2.28601 9.80498 2.3459 9.71729 2.41317C9.32164 2.7167 9.10063 3.20155 8.65861 4.17126L8.05292 5.5" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
      <path d="M9.5 16.5L9.5 10.5" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
      <path d="M14.5 16.5L14.5 10.5" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
    </>
  ),
}

// ── Header ───────────────────────────────────────────────────────────────

/** Each set-bonus perk as a round blue cell; piece count, set and perk name in its tooltip. */
function SetBonuses() {
  return (
    <div style={{ display: 'flex', flexShrink: 0, alignItems: 'center', gap: 6 }}>
      {SET_BONUSES.map((b) => (
        <Tip
          key={b.label}
          delay={100}
          label={`${b.label}: ${b.perk}`}
          className="cfx-lo-bonus"
          style={{
            display: 'flex',
            flexShrink: 0,
            alignItems: 'center',
            justifyContent: 'center',
            width: 40,
            height: 40,
            boxSizing: 'border-box',
            borderRadius: 9999,
            border: '1px solid rgb(252 252 245 / 0.12)',
            backgroundColor: '#305f8e',
          }}
          popStyle={{ display: 'grid', padding: '10px 12px', fontSize: 14, lineHeight: '24px' }}
          content={
            <>
              <div>{b.label}</div>
              <div style={{ color: FG_MUTED }}>{b.perk}</div>
            </>
          }
        >
          <img src={b.icon} alt={b.label} width={24} height={24} style={{ display: 'block', width: 24, height: 24 }} />
        </Tip>
      ))}
    </div>
  )
}

/** The stat line: total, then each stat's glyph and value; it toggles the stat breakdown. */
function StatLine({ open, onToggle }: { open: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      className="cfx-lo-stats cfx-lo-ring"
      aria-expanded={open}
      aria-label={open ? 'Hide stat breakdown' : 'Show stat breakdown'}
      onClick={onToggle}
    >
      <span style={{ fontSize: 16, lineHeight: '24px', fontWeight: 500 }}>{STAT_TOTAL}</span>
      {STATS.map((s) => (
        <span key={s.label} className="cfx-lo-stat">
          <Tip content={s.label} focusable={false} style={{ display: 'inline-flex', flexShrink: 0 }}>
            <img src={s.icon} alt={s.label} width={16} height={16} decoding="async" className="cfx-lo-glyph" />
          </Tip>
          <span style={s.value === 0 ? { color: FG_MUTED } : undefined}>{s.value}</span>
        </span>
      ))}
      <ChevronDown className="cfx-lo-chevron" />
    </button>
  )
}

/**
 * The ⋮ actions menu (`ui/dropdown-menu.tsx`, Base UI): the dashed corner-tick well,
 * opening a frosted menu under it, right-aligned. Arrow keys walk the items, the pointer
 * highlights them, Escape / Tab / a click outside close it. The items do nothing here.
 */
function ActionsMenu() {
  const [open, setOpen] = useState(false)
  const [fromKeyboard, setFromKeyboard] = useState(false)
  const button = useRef<HTMLButtonElement>(null)
  const menu = useRef<HTMLDivElement>(null)
  const menuId = useId()
  const buttonId = useId()

  const close = (refocus = true) => {
    setOpen(false)
    if (refocus) button.current?.focus()
  }

  useLayoutEffect(() => {
    if (!open) return
    const place = () => {
      const b = button.current
      const m = menu.current
      if (!b || !m) return
      const r = b.getBoundingClientRect()
      const w = m.offsetWidth
      const h = m.offsetHeight
      let top = r.bottom + 4
      let origin = 'top'
      if (top + h > window.innerHeight - 4 && r.top - 4 - h >= 4) {
        top = r.top - 4 - h
        origin = 'bottom'
      }
      const left = Math.max(8, Math.min(r.right - w, window.innerWidth - w - 8))
      m.style.left = `${left}px`
      m.style.top = `${top}px`
      m.style.transformOrigin = `right ${origin}`
    }
    place()
    const items = menu.current?.querySelectorAll<HTMLElement>('[role="menuitem"]')
    if (fromKeyboard) items?.[0]?.focus()
    else menu.current?.focus()
    const onDown = (e: Event) => {
      const t = e.target as Node
      if (!menu.current?.contains(t) && !button.current?.contains(t)) setOpen(false)
    }
    window.addEventListener('scroll', place, true)
    window.addEventListener('resize', place)
    document.addEventListener('pointerdown', onDown, true)
    return () => {
      window.removeEventListener('scroll', place, true)
      window.removeEventListener('resize', place)
      document.removeEventListener('pointerdown', onDown, true)
    }
  }, [open, fromKeyboard])

  const step = (dir: 1 | -1 | 'first' | 'last') => {
    const items = [...(menu.current?.querySelectorAll<HTMLElement>('[role="menuitem"]') ?? [])]
    if (items.length === 0) return
    const at = items.indexOf(document.activeElement as HTMLElement)
    const next =
      dir === 'first'
        ? 0
        : dir === 'last'
          ? items.length - 1
          : at === -1
            ? dir === 1
              ? 0
              : items.length - 1
            : (at + dir + items.length) % items.length
    items[next].focus()
  }

  return (
    <>
      <button
        ref={button}
        id={buttonId}
        type="button"
        className="cfx-lo-well cfx-lo-more cfx-lo-ring"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        aria-label={`Actions for ${LOADOUT_NAME}`}
        onClick={() => {
          setFromKeyboard(false)
          setOpen((o) => !o)
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
            e.preventDefault()
            setFromKeyboard(true)
            setOpen(true)
          }
        }}
      >
        <MoreVertical />
      </button>
      {open &&
        createPortal(
          <div
            ref={menu}
            id={menuId}
            role="menu"
            aria-labelledby={buttonId}
            tabIndex={-1}
            data-theme="dark"
            className="cfx-lo-menu"
            style={{ fontFamily: FONT }}
            onMouseLeave={() => menu.current?.focus()}
            onKeyDown={(e) => {
              if (e.key === 'ArrowDown') step(1)
              else if (e.key === 'ArrowUp') step(-1)
              else if (e.key === 'Home') step('first')
              else if (e.key === 'End') step('last')
              else if (e.key === 'Escape') close()
              else if (e.key === 'Tab') {
                // Back to the trigger, then let Tab move on from it (the menu unmounts).
                close()
                return
              } else return
              e.preventDefault()
            }}
          >
            {MENU.map((item, i) =>
              item === null ? (
                <div key={`sep-${i}`} role="separator" className="cfx-lo-sep" />
              ) : (
                <button
                  key={item.label}
                  type="button"
                  role="menuitem"
                  tabIndex={-1}
                  aria-haspopup={item.submenu ? 'menu' : undefined}
                  data-variant={item.destructive ? 'destructive' : 'default'}
                  className="cfx-lo-mi"
                  onMouseMove={(e) => {
                    if (document.activeElement !== e.currentTarget) e.currentTarget.focus()
                  }}
                  onClick={() => {
                    if (!item.submenu) close()
                  }}
                >
                  <Svg>{MENU_ICONS[item.icon]}</Svg>
                  {item.submenu ? (
                    <>
                      <span style={{ flex: 1, minWidth: 0 }}>{item.label}</span>
                      <ChevronRight />
                    </>
                  ) : (
                    item.label
                  )}
                </button>
              ),
            )}
          </div>,
          document.body,
        )}
    </>
  )
}

// ── Body ─────────────────────────────────────────────────────────────────

/** A mod or subclass plug with its tooltip; subclass plugs carry the white/40 hairline. */
function PlugTile({
  plug,
  framed = false,
  className = '',
}: {
  plug: Plug
  framed?: boolean
  className?: string
}) {
  return (
    <Tip
      content={<PlugTooltip plug={plug} />}
      className={`cfx-lo-plug ${framed ? 'cfx-lo-framed' : ''} ${className}`}
      style={framed ? { width: 40, height: 40 } : undefined}
    >
      <img
        src={plug.icon}
        alt={plugLabel(plug)}
        width={40}
        height={40}
        decoding="async"
        draggable={false}
        style={plug.plate ? { backgroundColor: 'rgb(255 255 255 / 0.14)' } : undefined}
      />
    </Tip>
  )
}

/** A run of tiles; groups are told apart by the gaps between them, not labels. */
function TileRow({ label, plugs }: { label: string; plugs: Plug[] }) {
  return (
    <div role="group" aria-label={label} style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
      {plugs.map((p, i) => (
        <PlugTile key={`${p.name}-${i}`} plug={p} framed />
      ))}
    </div>
  )
}

/** Super as the box's badge (a diamond outlined in its element), then abilities + aspects over fragments. */
function SubclassColumn() {
  const label = `${SUBCLASS.superName}, ${SUBCLASS.name}`
  return (
    <section aria-label={`Subclass: ${SUBCLASS.name}`} className="cfx-lo-well cfx-lo-col cfx-lo-sub">
      <div style={{ display: 'flex', minWidth: 0, alignItems: 'center', gap: 10 }}>
        <Tip content={label} className="cfx-lo-plug" style={{ width: 48, height: 48 }}>
          <img src={SUBCLASS.superIcon} alt={label} width={48} height={48} style={{ display: 'block', width: 48, height: 48 }} />
          <svg
            viewBox="0 0 48 48"
            aria-hidden
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'visible', pointerEvents: 'none' }}
          >
            <polygon
              points="24,0 48,24 24,48 0,24"
              fill="none"
              strokeOpacity={0.55}
              vectorEffect="non-scaling-stroke"
              style={{ stroke: SUBCLASS.diamondStroke }}
            />
          </svg>
        </Tip>
        <div style={{ display: 'flex', minWidth: 0, flexDirection: 'column' }}>
          <span style={{ ...TRUNCATE, fontSize: 14, lineHeight: '20px', fontWeight: 500 }}>{SUBCLASS.superName}</span>
          <span style={{ ...TRUNCATE, fontSize: 12, lineHeight: '16px', color: FG_MUTED }}>{SUBCLASS.name}</span>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          <TileRow label="Abilities" plugs={ABILITIES} />
          <TileRow label="Aspects" plugs={ASPECTS} />
        </div>
        <TileRow label="Fragments" plugs={FRAGMENTS} />
      </div>
    </section>
  )
}

/** The armor archetype's primary-stat glyph beside Power, blackened and cropped to its middle 43 of 51px. */
function ArchetypeGlyph({ src }: { src: string }) {
  return (
    <span style={{ position: 'relative', width: 14, height: 14, flexShrink: 0, overflow: 'hidden' }}>
      <img
        src={src}
        alt=""
        width={51}
        height={51}
        style={{
          position: 'absolute',
          top: '-9.302%',
          left: '-9.302%',
          width: '118.605%',
          height: 'auto',
          maxWidth: 'none',
          filter: 'brightness(0)',
        }}
      />
    </span>
  )
}

/** One row of mod tiles; from @6xl the row dissolves into the box's grid. */
function ModRow({ sockets, newLine }: { sockets: (Plug | null)[]; newLine: boolean }) {
  return (
    <div className="cfx-lo-modrow">
      {sockets.map((plug, i) => {
        const cls = `cfx-lo-mod ${newLine && i === 0 ? 'cfx-lo-newline' : ''}`
        return plug ? (
          <PlugTile key={i} plug={plug} className={cls} />
        ) : (
          <span key={i} aria-hidden className={`cfx-lo-empty ${cls}`} />
        )
      })}
    </div>
  )
}

/**
 * One armor piece: from @6xl its name (exotics in gold) and slot head the box, then the
 * item tile — the grey frame, gold with an inner glow when masterworked, over the bar
 * with the archetype glyph and Power — with the stat + tuning mods on top and the three
 * slot mods underneath. Below @6xl the rows sit under the art as compact icon columns.
 */
function PieceColumn({ piece }: { piece: Piece }) {
  return (
    <section aria-label={`${piece.name}, ${piece.slot}`} className="cfx-lo-well cfx-lo-col cfx-lo-piece">
      <div className="cfx-lo-pname">
        <span
          title={piece.name}
          style={{ ...TRUNCATE, fontSize: 14, lineHeight: '20px', color: piece.exotic ? EXOTIC : undefined }}
        >
          {piece.name}
        </span>
        <span style={{ fontSize: 12, lineHeight: '16px', color: FG_MUTED }}>{piece.slot}</span>
      </div>
      <div className="cfx-lo-pbody">
        <div
          className="cfx-lo-ptile"
          style={{ backgroundColor: piece.masterworked ? ITEM_FRAME_MASTERWORK : ITEM_FRAME }}
        >
          <ItemArt
            src={piece.icon}
            alt={piece.name}
            watermark={piece.watermark}
            tier={piece.tier}
            masterworked={piece.masterworked}
            className="cfx-lo-pthumb"
          />
          <TileFooter>
            <ArchetypeGlyph src={piece.archetypeIcon} />
            {piece.power}
          </TileFooter>
        </div>
        <div className="cfx-lo-mods" aria-label="Mods">
          <ModRow sockets={piece.top} newLine={false} />
          <ModRow sockets={piece.bottom} newLine={piece.top.length > 0} />
        </div>
      </div>
    </section>
  )
}

/**
 * One saved loadout as D2 Conflux's Loadouts page draws it (`loadouts/loadout-row.tsx`,
 * `loadout-card-body.tsx`): the user's "Getaway / Great Hunt" Prismatic Warlock. Header —
 * name and meta, the two Great Hunt set-bonus cells, the stat line (which toggles), the
 * green EQUIP and the ⋮ actions menu — over the subclass box and one box per armor piece.
 * The card is its own container, like the app's: from 48rem of content the subclass box
 * moves beside the pieces, from 72rem each piece box shows its name and lays its mods
 * out in a grid; under a 768px viewport the stat line spreads full width and the tiles
 * shrink to fit. Translucent: meant to sit on the Slate backdrop. Nothing has real effect.
 */
export default function LoadoutCard({ style }: { style?: CSSProperties }) {
  const [open, setOpen] = useState(false)
  return (
    <article
      aria-label={LOADOUT_NAME}
      className="cfx-lo-card"
      style={{ fontFamily: FONT, color: FG, fontSize: 16, lineHeight: '24px', ...style }}
    >
      <div className="cfx-lo-head">
        <div style={{ display: 'flex', minWidth: 0, flex: '1 1 12rem', flexDirection: 'column' }}>
          <h3
            style={{
              display: 'flex',
              minWidth: 0,
              alignItems: 'center',
              gap: 6,
              margin: 0,
              fontSize: 16,
              lineHeight: '24px',
              fontWeight: 500,
            }}
          >
            <span style={TRUNCATE}>{LOADOUT_NAME}</span>
          </h3>
          <p style={{ ...TRUNCATE, margin: 0, fontSize: 12, lineHeight: '16px', color: FG_MUTED }}>{LOADOUT_META}</p>
        </div>
        <SetBonuses />
        <StatLine open={open} onToggle={() => setOpen((o) => !o)} />
        <div style={{ display: 'flex', flexShrink: 0, alignItems: 'center', gap: 8 }}>
          <button type="button" className="cfx-lo-equip cfx-lo-ring">
            Equip
          </button>
          <ActionsMenu />
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div className="cfx-lo-grid">
          <div className="cfx-lo-subcell">
            <SubclassColumn />
          </div>
          {PIECES.map((p) => (
            <PieceColumn key={p.name} piece={p} />
          ))}
        </div>
      </div>
    </article>
  )
}
