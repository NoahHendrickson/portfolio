import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
  type RefObject,
} from 'react'
import { createPortal } from 'react-dom'
import autoAnimate, { getTransitionSizes, type AutoAnimationPlugin } from '@formkit/auto-animate'
import {
  SIDEBAR_INITIAL_ACTIVE,
  SIDEBAR_MACHINE,
  SIDEBAR_PROJECT_ORDER,
  SIDEBAR_PROJECTS,
  SIDEBAR_SHELVES,
  SIDEBAR_STATUS_SECTIONS,
  SIDEBAR_THREADS,
  STATUS_LABEL,
  statusSection,
  type SidebarGrouping,
  type SidebarPlaygroundOption,
  type SidebarProjectId,
  type SidebarStatusSection,
  type SidebarThread,
} from '../data/no3ySidebar'
import {
  AlarmClock,
  ArrowUpDown,
  BrandMark,
  ChartDonut,
  Check,
  ChevronDown,
  CircleAlert,
  CircleAlertFill,
  CircleHalf,
  Claude,
  Clock,
  EllipsisVertical,
  Folder,
  FolderClosed,
  FolderOpen,
  FolderPlus,
  GitMerge,
  GitPullRequest,
  GitPullRequestDraft,
  Laptop,
  NavigationArrow,
  OpenAI,
  PanelLeft,
  Pin,
  PinOff,
  Plus,
  Search,
  Settings,
  Wordmark,
  Worktree,
  Zap,
} from './no3ySidebarIcons'
import { useMediaQuery } from '../hooks/useMediaQuery'
import './No3ySidebar.css'

/*
  no3y Code's thread sidebar, rebuilt so the page can run it live: switch the
  grouping, toggle compact cards, point at a card for its hover state and
  click one to open it.

  It is a replica, not the app. The real Sidebar.tsx is 5,000 lines on the
  router, the Effect stores and a live server, so the parts you can see are
  rebuilt here and fed fixed threads (`data/no3ySidebar.ts`). Every size,
  colour and state is read off the running app — the fork's dev build, Glass
  palette (cool-darker) with sidebar vibrancy on, at the 322.5px width the
  desktop captures used — not taken from Figma, so this matches what ships.
  The colours are the app's own and stay literal (oklab where the app resolves
  to oklab), the way screenshot chrome does elsewhere on the site.

  Two things are the page's, not the app's. The glass is the collage's bake
  recipe — the wallpaper blurred 48px, saturated 1.35× and dimmed to 62%
  behind the panel, the panel's tint thinned so its transmission runs 1.3× the
  app's (73% → 64.9%) — because a browser cannot sample the desktop. And the
  window chrome (traffic lights, corner, ring, shadow) is the collage's too,
  since the desktop draws those natively.
*/

// ── Palette (read off the running app) ─────────────────────────────────────

/** `--foreground` after the appearance-contrast mix. */
const FG = 'oklab(0.930993 0.0000424981 0.0000185966)'
const fgA = (alpha: number) => `oklab(0.930993 0.0000424981 0.0000185966 / ${alpha})`
/** `--sidebar-foreground`. */
const SIDEBAR_FG = '#e8e8e8'
/** The sidebar's muted channel as the card meta and the Threads label paint it. */
const MUTED = 'rgba(255, 255, 255, 0.65)'
/** `--muted-foreground` inside the panel: section labels, the idle ring, action glyphs. */
const MUTED_GREY = 'oklab(0.633425 0.0000287592 0.0000126958)'
const mutedGreyA = (alpha: number) => `oklab(0.633425 0.0000287592 0.0000126958 / ${alpha})`
/** A receded card's own text (`text-sidebar-muted-foreground/75`). */
const RECEDED_ROW = 'oklab(0.867412 -0.00337383 -0.00388575 / 0.75)'
/** `--fork-sidebar-card-title-receded`. */
const RECEDED_TITLE = 'rgb(174, 178, 182)'
/** The footer and toggle glyphs. */
const QUIET_ICON = 'rgb(138, 138, 138)'
const QUIET_BUTTON = 'oklab(0.867412 -0.00337383 -0.00388575 / 0.8)'
/**
 * The pinned divider and the Settled rule. The app draws `--sidebar-border`
 * at 60%, an opaque grey that reads flat over the glass; white at 8% lands at
 * the same weight and lets the wallpaper through like the panel's other lines.
 */
const RULE = 'rgba(255, 255, 255, 0.08)'
/** The open thread's fill: the app's 6% white, under the panel's glass only. */
const ROW_ACTIVE = 'rgba(255, 255, 255, 0.06)'
/**
 * The open thread as a pane of glass (`--fork-glass-selected-shadow`): a dark
 * 1px halo, a tight sheen inside the top and bottom runs, and two soft inner
 * glows. Its glint, reflection band and dark edge ring are the sheet's
 * (`.n3sb-card[data-active]`), since they ride pseudo-elements.
 */
const ROW_ACTIVE_SHADOW = [
  '0 0 2px 1px rgb(0 0 0 / 25%)',
  'inset 0 2px 3px -2px rgb(255 255 255 / 6%)',
  'inset 0 -2px 3px -2px rgb(255 255 255 / 4%)',
  'inset 0 5px 14px rgb(255 255 255 / 4%)',
  'inset 0 -5px 14px rgb(255 255 255 / 4%)',
].join(', ')
/** A glass popup's drop shadow and halo (the app's `--fork-glass-halo` on `.dropdown-glass`). */
const POPUP_SHADOW = '0 2px 16px rgb(0 0 0 / 25%), 0 0 2px 1px rgb(0 0 0 / 25%)'
/**
 * Its sheens (`--fork-glass-sheen`). The app insets them on the popup itself;
 * here the glass fill would cover an inset shadow, so they ride a layer over it.
 */
const POPUP_SHEEN = [
  'inset 0 3px 4px -3px rgb(255 255 255 / 6%)',
  'inset 0 -3px 4px -3px rgb(255 255 255 / 4%)',
  'inset 0 14px 16px -8px rgb(255 255 255 / 3%)',
  'inset 0 -14px 16px -8px rgb(255 255 255 / 3%)',
].join(', ')

const STATUS = {
  working: '#24fe8a',
  done: '#2498fe',
  amber: '#ffcd59',
  failed: '#ff6b60',
}

const PR_TONE = {
  open: 'oklab(0.845 -0.138113 0.0370641 / 0.9)',
  merged: 'oklab(0.811 0.0443873 -0.101739 / 0.9)',
  draft: 'oklab(0.705 0.00415142 -0.0144141 / 0.8)',
}

const NOTICE_TONE = {
  error: 'rgb(251, 65, 74)',
  warning: 'oklch(0.769 0.188 70.08)',
}

const SNOOZED_TONE = 'oklch(0.707 0.165 254.624)'
const SNOOZED_RULE = 'oklab(0.623 -0.0378409 -0.210628 / 0.2)'

// ── Glass ───────────────────────────────────────────────────────────────────

const SIDEBAR_WALLPAPER = '/work/no3y-code/sidebar-wallpaper.jpg'
const GLASS_FILTER = 'blur(48px) saturate(1.35) brightness(0.62)'
/** The panel's `rgb(22 22 22 / 73%)`, its transmission scaled 1.3×. */
const PANEL_TINT = 'rgba(22, 22, 22, 0.649)'
/** A popup's `rgb(22 22 22 / 82%)` plus its 6% white lift, scaled the same way. */
const POPUP_TINT =
  'linear-gradient(rgba(255, 255, 255, 0.06), rgba(255, 255, 255, 0.06)), rgba(22, 22, 22, 0.766)'

/** The wallpaper element every glass surface samples, so each one lines its blur up with the stage. */
const WallContext = createContext<RefObject<HTMLDivElement | null> | null>(null)

/**
 * A glass fill for the element it sits in: the stage's wallpaper, blurred,
 * cut to this element's box, under the surface's tint. A popup samples the
 * wallpaper, not the panel under it — the app clears the panel out from under
 * a menu (its popup cutout) so the menu frosts the desktop directly.
 */
function GlassFill({ tint }: { tint: string }) {
  const wall = useContext(WallContext)
  const ref = useRef<HTMLDivElement>(null)
  const [offset, setOffset] = useState<{ x: number; y: number; w: number; h: number } | null>(null)

  useLayoutEffect(() => {
    const host = ref.current?.parentElement
    const paper = wall?.current
    if (!host || !paper) return
    const measure = () => {
      const a = host.getBoundingClientRect()
      const b = paper.getBoundingClientRect()
      setOffset({ x: b.left - a.left, y: b.top - a.top, w: b.width, h: b.height })
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(paper)
    observer.observe(host)
    return () => observer.disconnect()
  }, [wall])

  return (
    <div
      ref={ref}
      aria-hidden
      style={{ position: 'absolute', inset: 0, overflow: 'hidden', borderRadius: 'inherit', pointerEvents: 'none' }}
    >
      {offset && (
        <div
          style={{
            position: 'absolute',
            left: offset.x,
            top: offset.y,
            width: offset.w,
            height: offset.h,
            backgroundImage: `url(${SIDEBAR_WALLPAPER})`,
            backgroundSize: '100% 100%',
            filter: GLASS_FILTER,
          }}
        />
      )}
      <div style={{ position: 'absolute', inset: 0, background: tint }} />
    </div>
  )
}

// ── Layout constants ────────────────────────────────────────────────────────

/** The width the desktop captures ran the sidebar at, its 1px divider included. */
const SIDEBAR_WIDTH = 322.5
const TOPBAR = 52
/** Where the toggle sits once the traffic lights take the bar's left end. */
const CONTROLS_LEFT = 80
const WINDOW_RADIUS = 10
const WINDOW_SHADOW = '0 24px 60px rgba(0, 0, 0, 0.35), 0 2px 8px rgba(0, 0, 0, 0.2)'
const WINDOW_RING = 'inset 0 0 0 1px rgba(255, 255, 255, 0.14)'

const ICON_BUTTON: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 0,
  border: 0,
  background: 'transparent',
  cursor: 'pointer',
  font: 'inherit',
}

const TRUNCATE: CSSProperties = {
  minWidth: 0,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
}

const SR_ONLY: CSSProperties = {
  position: 'absolute',
  width: 1,
  height: 1,
  margin: -1,
  padding: 0,
  overflow: 'hidden',
  clip: 'rect(0, 0, 0, 0)',
  whiteSpace: 'nowrap',
  border: 0,
}

// ── List animation (the app's AutoAnimate plugin, verbatim) ──────────────

const LIST_DURATION = 150
const LIST_EASING = 'ease-out'

/**
 * The fork's `sidebarV2ListAnimation`: add is the exact reverse of remove
 * (scale .98 and fade over 150ms ease-out), and a card that stays slides to
 * its new place. Plugins skip AutoAnimate's reduced-motion gate, so the
 * duration drops to zero there.
 */
const listAnimation: AutoAnimationPlugin = (el, action, first, second) => {
  const duration = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : LIST_DURATION
  if (action === 'add') {
    return new KeyframeEffect(
      el,
      [
        { transform: 'scale(.98)', opacity: 0 },
        { transform: 'scale(1)', opacity: 1 },
      ],
      { duration, easing: LIST_EASING },
    )
  }
  if (action === 'remove') {
    return new KeyframeEffect(
      el,
      [
        { transform: 'scale(1)', opacity: 1 },
        { transform: 'scale(.98)', opacity: 0 },
      ],
      { duration, easing: LIST_EASING },
    )
  }
  const from = first!
  const to = second!
  let deltaLeft = from.left - to.left
  let deltaTop = from.top - to.top
  const deltaRight = from.left + from.width - (to.left + to.width)
  const deltaBottom = from.top + from.height - (to.top + to.height)
  if (deltaBottom === 0) deltaTop = 0
  if (deltaRight === 0) deltaLeft = 0
  const [widthFrom, widthTo, heightFrom, heightTo] = getTransitionSizes(el, from, to)
  const start: Keyframe = { transform: `translate(${deltaLeft}px, ${deltaTop}px)` }
  const end: Keyframe = { transform: 'translate(0, 0)' }
  if (widthFrom !== widthTo) {
    start.width = `${widthFrom}px`
    end.width = `${widthTo}px`
  }
  if (heightFrom !== heightTo) {
    start.height = `${heightFrom}px`
    end.height = `${heightTo}px`
  }
  return new KeyframeEffect(el, [start, end], { duration, easing: LIST_EASING })
}

// ── State ───────────────────────────────────────────────────────────────────

export type SidebarSettings = {
  grouping: SidebarGrouping
  compact: boolean
}

/** Which projects the gear menu's filter shows; empty is "All projects". */
type ProjectFilter = SidebarProjectId[]

// ── Status marks ────────────────────────────────────────────────────────────

const MARK_SLOT: CSSProperties = {
  display: 'flex',
  width: 12,
  height: 14,
  flexShrink: 0,
  alignItems: 'center',
  justifyContent: 'center',
}

/* The rain: three columns of five drops falling through a 14px slot, each
   column on its own clock — the app's SidebarV2WorkingRain, constants and all. */
const RAIN_ROWS = 5
const RAIN_PITCH = 3.8
const RAIN_CELL = 2.85
const RAIN_SPAN = RAIN_ROWS + 3
const RAIN_COLUMNS = [
  { speed: 2.5, phase: 0 },
  { speed: 4.504345, phase: 1.961008 },
  { speed: 3.80266, phase: 2.768793 },
]
const RAIN_WIDTH = (RAIN_COLUMNS.length - 1) * RAIN_PITCH + RAIN_CELL
const RAIN_HEIGHT = (RAIN_ROWS - 1) * RAIN_PITCH + RAIN_CELL

function rainAlpha(dy: number) {
  const alpha = dy >= 0 ? Math.exp(-dy * 0.8) : Math.exp(dy * 8)
  return alpha >= 0.02 ? alpha : 0
}

/** The app's per-thread phase offset, so a list of working rows never blinks in step. */
function rainOffsetSeconds(seed: string) {
  let hash = 0x811c9dc5
  for (let index = 0; index < seed.length; index++) {
    hash ^= seed.charCodeAt(index)
    hash = Math.imul(hash, 0x01000193)
  }
  hash ^= hash >>> 16
  hash = Math.imul(hash, 0x85ebca6b)
  hash ^= hash >>> 13
  hash = Math.imul(hash, 0xc2b2ae35)
  hash ^= hash >>> 16
  return ((hash >>> 0) / 0x1_0000_0000) * 32
}

function Rain({ seed }: { seed: string }) {
  const offset = rainOffsetSeconds(seed)
  return (
    <svg
      aria-hidden
      width={(RAIN_WIDTH / RAIN_HEIGHT) * 14}
      height={14}
      viewBox={`0 0 ${RAIN_WIDTH} ${RAIN_HEIGHT}`}
      style={{ display: 'block', flexShrink: 0, overflow: 'hidden' }}
    >
      {RAIN_COLUMNS.flatMap((column, col) =>
        Array.from({ length: RAIN_ROWS }, (_, row) => (
          <rect
            key={`${col}:${row}`}
            x={col * RAIN_PITCH}
            y={row * RAIN_PITCH}
            width={RAIN_CELL}
            height={RAIN_CELL}
            rx={RAIN_CELL * 0.28}
            fill={STATUS.working}
            className={`n3sb-rain-${row}`}
            style={{
              opacity: rainAlpha((((0.6 + offset) * column.speed + column.phase) % RAIN_SPAN) - 1.5 - row),
              animationDuration: `${(RAIN_SPAN / column.speed).toFixed(4)}s`,
              animationDelay: `${(-column.phase / column.speed - offset).toFixed(4)}s`,
            }}
          />
        )),
      )}
    </svg>
  )
}

function StatusMark({ thread }: { thread: SidebarThread }) {
  const label = STATUS_LABEL[thread.status]
  let mark: ReactNode
  switch (thread.status) {
    case 'working':
      mark = <Rain seed={thread.id} />
      break
    case 'waiting':
      mark = (
        <span aria-hidden style={MARK_SLOT}>
          <span className="n3sb-pulse" style={{ width: 10, height: 10, borderRadius: '50%' }} />
        </span>
      )
      break
    case 'done':
      mark = (
        <span aria-hidden style={{ ...MARK_SLOT, color: STATUS.done }}>
          <span style={{ width: 10, height: 10, borderRadius: '50%', background: 'currentColor' }} />
        </span>
      )
      break
    case 'input':
    case 'approval':
    case 'limited':
      mark = (
        <span aria-hidden style={{ ...MARK_SLOT, color: STATUS.amber }}>
          <CircleHalf size={12} />
        </span>
      )
      break
    case 'failed':
      mark = (
        <span aria-hidden style={{ ...MARK_SLOT, color: STATUS.failed }}>
          <CircleAlertFill size={12} />
        </span>
      )
      break
    case 'woke':
      mark = (
        <span aria-hidden style={MARK_SLOT}>
          <AlarmClock size={10} style={{ color: STATUS.amber }} />
        </span>
      )
      break
    case 'idle':
      mark = (
        <span aria-hidden style={MARK_SLOT}>
          <span
            style={{ width: 10, height: 10, borderRadius: '50%', border: `1px solid ${MUTED_GREY}`, boxSizing: 'border-box' }}
          />
        </span>
      )
      break
  }
  return (
    <>
      <span role={label ? 'status' : undefined} style={SR_ONLY}>
        {label ?? 'Idle'}
      </span>
      {mark}
    </>
  )
}

// ── Card pieces ─────────────────────────────────────────────────────────────

function formatWorking(ms: number) {
  const seconds = Math.max(0, Math.floor(ms / 1000))
  if (seconds < 60) return `${seconds}s`
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m`
  return `${Math.floor(minutes / 60)}h ${minutes % 60}m`
}

/** The working timer, ticking once a second like the app's. */
function WorkingDuration({ startedAt }: { startedAt: number }) {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(id)
  }, [])
  return <>{formatWorking(now - startedAt)}</>
}

function Favicon({ project, size }: { project: SidebarProjectId; size: number }) {
  return (
    <img
      src={SIDEBAR_PROJECTS[project].favicon}
      alt=""
      width={size}
      height={size}
      style={{ display: 'block', flexShrink: 0, width: size, height: size, borderRadius: '25%', objectFit: 'contain' }}
    />
  )
}

function PrBadge({ pr }: { pr: NonNullable<SidebarThread['pr']> }) {
  const Icon = pr.state === 'merged' ? GitMerge : pr.state === 'draft' ? GitPullRequestDraft : GitPullRequest
  return (
    <span
      className="n3sb-pr"
      style={{
        display: 'flex',
        flexShrink: 0,
        alignItems: 'center',
        gap: 4,
        fontWeight: 400,
        color: PR_TONE[pr.state],
        fontVariantNumeric: 'tabular-nums',
        textUnderlineOffset: 2,
        cursor: 'pointer',
      }}
    >
      <Icon size={12} />
      <span>{pr.number}</span>
    </span>
  )
}

/** The worktree mark; every thread here runs in its own worktree, so the branch is labelled by position. */
function CheckoutMark({ branch, showBranch }: { branch: string; showBranch: boolean }) {
  return (
    <span
      style={
        showBranch
          ? { display: 'flex', flex: '1 1 0%', minWidth: 0, alignItems: 'center', gap: 2 }
          : { display: 'flex', alignItems: 'center' }
      }
    >
      <span style={SR_ONLY}>Worktree</span>
      <Worktree size={12} />
      <span style={showBranch ? TRUNCATE : SR_ONLY}>{branch}</span>
    </span>
  )
}

/** The card's second line: where it runs, which checkout, the PR, the model. */
function CardMeta({ thread, projectTitleHidden }: { thread: SidebarThread; projectTitleHidden: boolean }) {
  return (
    <div
      style={{
        display: 'flex',
        height: 16,
        minWidth: 0,
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
        fontSize: 12,
        lineHeight: '16px',
        color: MUTED,
      }}
    >
      <span style={{ display: 'flex', flex: '1 1 0%', minWidth: 0, alignItems: 'center', gap: 12 }}>
        <span style={{ display: 'flex', flex: '1 1 0%', minWidth: 0, alignItems: 'center', gap: 4 }}>
          <Laptop size={12} />
          <span
            aria-hidden
            style={{ width: 1, height: 8, flexShrink: 0, borderRadius: 9999, background: fgA(0.12) }}
          />
          {projectTitleHidden ? (
            <span style={SR_ONLY}>{SIDEBAR_PROJECTS[thread.project].title}</span>
          ) : (
            <span style={{ display: 'flex', maxWidth: '40%', flexShrink: 0, alignItems: 'center', gap: 4 }}>
              <Favicon project={thread.project} size={12} />
              <span style={TRUNCATE}>{SIDEBAR_PROJECTS[thread.project].title}</span>
            </span>
          )}
          <CheckoutMark branch={thread.branch} showBranch />
        </span>
        {thread.pr && <PrBadge pr={thread.pr} />}
      </span>
      <span style={{ ...TRUNCATE, maxWidth: '45%', fontSize: 11, lineHeight: '15px' }}>{thread.model}</span>
    </div>
  )
}

/** Pin, snooze and settle — the hover actions. Inert here: the page shows them, it doesn't act on them. */
function HoverActions({ thread }: { thread: SidebarThread }) {
  // Threads blocked on you can't be snoozed (the app's canSnooze).
  const snoozable = thread.status !== 'input' && thread.status !== 'approval'
  const actions: { label: string; icon: ReactNode }[] = [
    thread.pinned
      ? { label: 'Unpin thread', icon: <PinOff size={12} /> }
      : { label: 'Pin thread', icon: <Pin size={12} /> },
    ...(snoozable ? [{ label: 'Snooze thread', icon: <Clock size={12} /> }] : []),
    { label: 'Settle thread', icon: <Check size={12} /> },
  ]
  return (
    <span
      className="n3sb-actions"
      style={{ position: 'relative', gridColumn: 1, gridRow: 1, display: 'flex', alignItems: 'center', gap: 2 }}
    >
      {actions.map((action) => (
        <button
          key={action.label}
          type="button"
          aria-label={action.label}
          className="n3sb-action"
          onClick={(event) => event.stopPropagation()}
          style={{
            ...ICON_BUTTON,
            position: 'relative',
            width: 24,
            height: 24,
            flexShrink: 0,
            borderRadius: 8,
            color: MUTED_GREY,
          }}
        >
          {action.icon}
        </button>
      ))}
    </span>
  )
}

type CardProps = {
  thread: SidebarThread
  compact: boolean
  /** Under a project header, which already names the project. */
  projectTitleHidden: boolean
  active: boolean
  recedes: boolean
  startedAt: number | undefined
  onOpen: (id: string) => void
  onHover: (id: string | null, el: HTMLElement | null) => void
}

function ThreadCard({ thread, compact, projectTitleHidden, active, recedes, startedAt, onOpen, onHover }: CardProps) {
  const project = SIDEBAR_PROJECTS[thread.project]
  const label = [thread.title, STATUS_LABEL[thread.status], project.title].filter(Boolean).join(', ')
  const title = (
    <span
      className="n3sb-title"
      data-recedes={recedes || undefined}
      style={{
        ...TRUNCATE,
        flex: '1 1 0%',
        fontSize: 14,
        lineHeight: '18px',
        fontWeight: 400,
        color: recedes ? RECEDED_TITLE : FG,
      }}
    >
      {thread.title}
    </span>
  )

  const onKeyDown = (event: ReactKeyboardEvent) => {
    if (event.target !== event.currentTarget) return
    if (event.key !== 'Enter' && event.key !== ' ') return
    event.preventDefault()
    onOpen(thread.id)
  }

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={label}
      aria-current={active ? 'page' : undefined}
      className="n3sb-card"
      data-active={active || undefined}
      data-compact={compact || undefined}
      onClick={() => onOpen(thread.id)}
      onKeyDown={onKeyDown}
      onPointerEnter={(event) => onHover(thread.id, event.currentTarget)}
      onPointerLeave={() => onHover(null, null)}
      style={{
        position: 'relative',
        width: '100%',
        cursor: 'pointer',
        overflow: 'hidden',
        textAlign: 'left',
        userSelect: 'none',
        borderRadius: compact ? 12 : 20,
        outline: 'none',
        background: active ? ROW_ACTIVE : 'transparent',
        boxShadow: active ? ROW_ACTIVE_SHADOW : undefined,
        color: active ? SIDEBAR_FG : recedes ? RECEDED_ROW : SIDEBAR_FG,
      }}
    >
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
          padding: '8px 12px',
        }}
      >
        <div style={{ display: 'flex', height: 18, minHeight: 18, minWidth: 0, alignItems: 'center', gap: 16 }}>
          {compact && !projectTitleHidden ? (
            <span style={{ display: 'flex', flex: '1 1 0%', minWidth: 0, alignItems: 'center', gap: 8 }}>
              <span style={{ display: 'flex', width: 16, height: 16, flexShrink: 0, alignItems: 'center', justifyContent: 'center' }}>
                <Favicon project={thread.project} size={16} />
              </span>
              {title}
            </span>
          ) : (
            title
          )}
          <span style={{ display: 'flex', flexShrink: 0, alignItems: 'center', gap: 6 }}>
            {compact && (
              <span
                style={{
                  display: 'flex',
                  flexShrink: 0,
                  alignItems: 'center',
                  gap: 6,
                  fontSize: 12,
                  lineHeight: '16px',
                  color: MUTED,
                }}
              >
                <CheckoutMark branch={thread.branch} showBranch={false} />
                {thread.pr && <PrBadge pr={thread.pr} />}
              </span>
            )}
            <span
              style={{
                display: 'grid',
                height: 24,
                flexShrink: 0,
                gridTemplateColumns: 'minmax(0, 1fr)',
                alignItems: 'center',
                justifyItems: 'end',
              }}
            >
              {startedAt !== undefined && (
                <span
                  className="n3sb-timer"
                  style={{
                    pointerEvents: 'none',
                    gridColumn: 1,
                    gridRow: 1,
                    display: 'flex',
                    alignItems: 'center',
                    paddingRight: 4,
                  }}
                >
                  <span
                    aria-hidden
                    style={{ fontSize: 11, lineHeight: '15px', color: SIDEBAR_FG, fontVariantNumeric: 'tabular-nums' }}
                  >
                    <WorkingDuration startedAt={startedAt} />
                  </span>
                </span>
              )}
              <HoverActions thread={thread} />
            </span>
            {thread.pinned && <Pin size={12} style={{ color: mutedGreyA(0.65) }} />}
            <span
              style={{
                pointerEvents: 'none',
                display: 'flex',
                width: 12,
                height: 14,
                flexShrink: 0,
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                marginRight: -2,
              }}
            >
              <StatusMark thread={thread} />
            </span>
          </span>
        </div>
        {!compact && <CardMeta thread={thread} projectTitleHidden={projectTitleHidden} />}
      </div>
    </div>
  )
}

// ── Section headers ─────────────────────────────────────────────────────────

function ProjectHeader({
  project,
  first,
  afterOpenSection,
  collapsed,
  onToggle,
}: {
  project: SidebarProjectId
  first: boolean
  afterOpenSection: boolean
  collapsed: boolean
  onToggle: () => void
}) {
  const label = SIDEBAR_PROJECTS[project].title
  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        height: 32,
        width: '100%',
        alignItems: 'center',
        gap: 6,
        padding: '0 12px',
        marginTop: first ? 0 : afterOpenSection ? 22 : 6,
        textAlign: 'left',
      }}
    >
      <button
        type="button"
        className="n3sb-header-pill"
        aria-expanded={!collapsed}
        aria-label={collapsed ? `Expand ${label}` : `Collapse ${label}`}
        onClick={onToggle}
        style={{
          ...ICON_BUTTON,
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          right: 64,
          zIndex: 0,
          borderRadius: 10,
          outline: 'none',
        }}
      />
      <span
        className="n3sb-header-mark"
        style={{
          pointerEvents: 'none',
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          width: 16,
          height: 16,
          flexShrink: 0,
          alignItems: 'center',
          justifyContent: 'center',
          color: MUTED,
        }}
      >
        {collapsed ? (
          <span className="n3sb-folder">
            <FolderClosed size={16} />
          </span>
        ) : (
          <span className="n3sb-folder">
            <FolderOpen size={16} />
          </span>
        )}
        <span className="n3sb-chevron" style={{ position: 'absolute', inset: 0 }}>
          <ChevronDown size={16} style={{ transform: collapsed ? 'rotate(-90deg)' : undefined }} />
        </span>
      </span>
      <span
        role="heading"
        aria-level={3}
        className="n3sb-header-label"
        style={{
          ...TRUNCATE,
          pointerEvents: 'none',
          position: 'relative',
          zIndex: 1,
          flex: '1 1 0%',
          fontSize: 12,
          fontWeight: 500,
          lineHeight: '16px',
          color: MUTED,
        }}
      >
        {label}
      </span>
      <span
        className="n3sb-section-actions"
        style={{ position: 'relative', zIndex: 10, display: 'flex', flexShrink: 0, alignItems: 'center', marginRight: -12 }}
      >
        {[
          { label: `Actions for ${label}`, icon: <EllipsisVertical size={16} /> },
          { label: `New thread in ${label}`, icon: <Plus size={16} /> },
        ].map((action) => (
          <button
            key={action.label}
            type="button"
            aria-label={action.label}
            className="n3sb-action"
            style={{ ...ICON_BUTTON, width: 32, height: 32, borderRadius: 10, color: MUTED }}
          >
            {action.icon}
          </button>
        ))}
      </span>
    </div>
  )
}

function StatusHeader({
  label,
  count,
  first,
  collapsed,
  onToggle,
}: {
  label: string
  count: number
  first: boolean
  collapsed: boolean
  onToggle: () => void
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={!collapsed}
      style={{
        ...ICON_BUTTON,
        width: '100%',
        justifyContent: 'flex-start',
        gap: 6,
        padding: '0 12px',
        marginTop: first ? 12 : 22,
        marginBottom: 6,
        fontSize: 13,
        lineHeight: '16px',
        textAlign: 'left',
      }}
    >
      <span style={{ ...TRUNCATE, fontWeight: 600, color: MUTED_GREY }}>{label}</span>
      <span style={{ flexShrink: 0, fontWeight: 600, color: mutedGreyA(0.6), fontVariantNumeric: 'tabular-nums' }}>
        {count}
      </span>
    </button>
  )
}

function Shelf({ label, count, tone }: { label: string; count: number; tone: 'snoozed' | 'settled' }) {
  const color = tone === 'snoozed' ? SNOOZED_TONE : mutedGreyA(0.5)
  return (
    <button
      type="button"
      aria-expanded={false}
      style={{
        ...ICON_BUTTON,
        width: '100%',
        height: 16,
        justifyContent: 'flex-start',
        gap: 8,
        padding: '0 10px',
        marginTop: 14,
        marginBottom: 6,
      }}
    >
      <span style={{ fontSize: 13, fontWeight: 500, lineHeight: '16px', color }}>{`${label} (${count})`}</span>
      <span style={{ flex: '1 1 0%', height: 1, background: tone === 'snoozed' ? SNOOZED_RULE : RULE }} />
      <ChevronDown size={12} style={{ color }} />
    </button>
  )
}

// ── The list ────────────────────────────────────────────────────────────────

type ListItem =
  | { key: string; kind: 'pinned'; threads: SidebarThread[] }
  | { key: string; kind: 'divider' }
  | { key: string; kind: 'project'; project: SidebarProjectId; first: boolean; afterOpenSection: boolean }
  | { key: string; kind: 'status'; section: SidebarStatusSection; label: string; count: number; first: boolean }
  | { key: string; kind: 'card'; thread: SidebarThread; section?: SidebarStatusSection; underProject?: SidebarProjectId }

/**
 * The list the app draws for a grouping: pinned threads first, then either one
 * list (no grouping), a header per project in order of its latest thread, or
 * the five status sections. Within every group the threads keep activity order.
 */
function buildList(
  grouping: SidebarGrouping,
  threads: SidebarThread[],
  collapsedProjects: Set<SidebarProjectId>,
  collapsedSections: Set<SidebarStatusSection>,
): ListItem[] {
  const items: ListItem[] = []
  const pinned = threads.filter((thread) => thread.pinned)
  const rest = threads.filter((thread) => !thread.pinned)

  if (grouping === 'status') {
    let first = true
    for (const { key, label } of SIDEBAR_STATUS_SECTIONS) {
      const members = threads.filter((thread) => statusSection(thread) === key)
      if (members.length === 0) continue
      items.push({
        key: `status:${key}`,
        kind: 'status',
        section: key,
        label,
        count: members.length,
        first,
      })
      first = false
      if (collapsedSections.has(key)) continue
      if (key === 'pinned') items.push({ key: 'pinned', kind: 'pinned', threads: members })
      else for (const thread of members) items.push({ key: thread.id, kind: 'card', thread, section: key })
    }
    return items
  }

  if (pinned.length > 0) {
    items.push({ key: 'pinned', kind: 'pinned', threads: pinned })
    items.push({ key: 'pinned-divider', kind: 'divider' })
  }

  if (grouping === 'none') {
    for (const thread of rest) items.push({ key: thread.id, kind: 'card', thread })
    return items
  }

  const projects: SidebarProjectId[] = []
  for (const thread of rest) if (!projects.includes(thread.project)) projects.push(thread.project)
  projects.forEach((project, index) => {
    const previousOpen = index > 0 && !collapsedProjects.has(projects[index - 1])
    items.push({ key: `project:${project}`, kind: 'project', project, first: index === 0, afterOpenSection: previousOpen })
    if (collapsedProjects.has(project)) return
    for (const thread of rest.filter((thread) => thread.project === project)) {
      items.push({ key: thread.id, kind: 'card', thread, underProject: project })
    }
  })
  return items
}

/**
 * The app's recede rule: the open thread never recedes; under a status header
 * the Working and Idle sections recede; otherwise a done or idle thread does.
 */
function recedes(thread: SidebarThread, active: boolean, section: SidebarStatusSection | undefined) {
  if (active) return false
  if (section !== undefined) return section === 'working' || section === 'idle'
  return thread.status === 'done' || thread.status === 'idle'
}

// ── Gear menu ───────────────────────────────────────────────────────────────

function MenuRadio({ checked }: { checked: boolean }) {
  return (
    <span
      aria-hidden
      style={{
        display: 'flex',
        width: 16,
        height: 16,
        flexShrink: 0,
        alignItems: 'center',
        justifyContent: 'center',
        boxSizing: 'border-box',
        borderRadius: '50%',
        border: `1px solid ${checked ? '#ffffff' : fgA(0.24)}`,
        background: checked ? '#ffffff' : 'transparent',
        boxShadow: checked ? undefined : '0 1px 2px 0 oklab(0 0 0 / 0.05)',
      }}
    >
      {checked && <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'rgb(20, 22, 24)' }} />}
    </span>
  )
}

function MenuCheckbox({ checked }: { checked: boolean }) {
  return (
    <span
      aria-hidden
      style={{
        display: 'flex',
        width: 16,
        height: 16,
        flexShrink: 0,
        alignItems: 'center',
        justifyContent: 'center',
        boxSizing: 'border-box',
        borderRadius: 4,
        border: `1px solid ${checked ? '#ffffff' : fgA(0.24)}`,
        background: checked ? '#ffffff' : 'transparent',
        color: 'rgb(20, 22, 24)',
        boxShadow: checked ? undefined : '0 1px 2px 0 oklab(0 0 0 / 0.05)',
      }}
    >
      {checked && <Check size={12} />}
    </span>
  )
}

const MENU_ITEM: CSSProperties = {
  ...ICON_BUTTON,
  width: '100%',
  height: 32,
  justifyContent: 'space-between',
  gap: 16,
  padding: '0 6px 0 8px',
  borderRadius: 8,
  fontSize: 14,
  fontWeight: 500,
  lineHeight: '20px',
  color: FG,
  textAlign: 'left',
  outline: 'none',
}

function MenuSeparator() {
  return <div role="separator" style={{ height: 1, margin: '8px -4px', background: 'color(srgb 0.909804 0.909804 0.909804 / 0.12)' }} />
}

function GearMenu({
  top,
  right,
  anchor,
  settings,
  onChange,
  filter,
  onFilter,
  onClose,
}: {
  top: number
  right: number
  anchor: RefObject<HTMLElement | null>
  settings: SidebarSettings
  onChange: (settings: SidebarSettings) => void
  filter: ProjectFilter
  onFilter: (filter: ProjectFilter) => void
  onClose: () => void
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    ref.current?.querySelector<HTMLElement>('[role^="menuitem"]')?.focus({ preventScroll: true })
    const onPointer = (event: PointerEvent) => {
      const target = event.target as Node
      // A press on the gear is the gear's to handle — it toggles the menu shut.
      if (ref.current?.contains(target) || anchor.current?.contains(target)) return
      onClose()
    }
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('pointerdown', onPointer, true)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onPointer, true)
      document.removeEventListener('keydown', onKey)
    }
  }, [onClose, anchor])

  const groupings: { value: SidebarGrouping; label: string }[] = [
    { value: 'none', label: 'No grouping' },
    { value: 'project', label: 'Group by project' },
    { value: 'status', label: 'Group by status' },
  ]
  const toggleProject = (project: SidebarProjectId) =>
    onFilter(filter.includes(project) ? filter.filter((id) => id !== project) : [...filter, project])

  return (
    <div
      ref={ref}
      role="menu"
      aria-label="Filter threads by project and group-by"
      className="n3sb-popup"
      style={{
        position: 'absolute',
        top,
        right,
        zIndex: 30,
        width: 224,
        boxSizing: 'border-box',
        borderRadius: 12,
        boxShadow: POPUP_SHADOW,
        color: SIDEBAR_FG,
        fontSize: 16,
        lineHeight: '24px',
      }}
    >
      <GlassFill tint={POPUP_TINT} />
      <div aria-hidden style={{ position: 'absolute', inset: 0, borderRadius: 'inherit', boxShadow: POPUP_SHEEN, pointerEvents: 'none' }} />
      <div style={{ position: 'relative', padding: 4 }}>
        {groupings.map((option) => (
          <button
            key={option.value}
            type="button"
            role="menuitemradio"
            aria-checked={settings.grouping === option.value}
            className="n3sb-menu-item"
            onClick={() => onChange({ ...settings, grouping: option.value })}
            style={MENU_ITEM}
          >
            <span style={TRUNCATE}>{option.label}</span>
            <MenuRadio checked={settings.grouping === option.value} />
          </button>
        ))}
        <MenuSeparator />
        <button
          type="button"
          role="menuitemcheckbox"
          aria-checked={settings.compact}
          className="n3sb-menu-item"
          onClick={() => onChange({ ...settings, compact: !settings.compact })}
          style={MENU_ITEM}
        >
          <span style={TRUNCATE}>Compact cards</span>
          <MenuCheckbox checked={settings.compact} />
        </button>
        <MenuSeparator />
        <button
          type="button"
          role="menuitemcheckbox"
          aria-checked={filter.length === 0}
          className="n3sb-menu-item"
          onClick={() => onFilter([])}
          style={{ ...MENU_ITEM, justifyContent: 'flex-start', gap: 8 }}
        >
          <MenuCheckbox checked={filter.length === 0} />
          <Folder size={16} />
          <span style={TRUNCATE}>All projects</span>
        </button>
        {SIDEBAR_PROJECT_ORDER.map((project) => (
          <button
            key={project}
            type="button"
            role="menuitemcheckbox"
            aria-checked={filter.includes(project)}
            className="n3sb-menu-item"
            onClick={() => toggleProject(project)}
            style={{ ...MENU_ITEM, justifyContent: 'flex-start', gap: 8 }}
          >
            <MenuCheckbox checked={filter.includes(project)} />
            <Favicon project={project} size={16} />
            <span style={TRUNCATE}>{SIDEBAR_PROJECTS[project].title}</span>
            <span
              aria-hidden
              style={{
                display: 'flex',
                width: 24,
                height: 24,
                marginLeft: 'auto',
                flexShrink: 0,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 8,
                color: 'oklab(0.999994 0.0000455678 0.0000200868 / 0.5)',
              }}
            >
              <EllipsisVertical size={16} />
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}

// ── Hover card ──────────────────────────────────────────────────────────────

const HOVER_DELAY = 150
const TIP_MUTED = 'oklab(0.999994 0.0000455678 0.0000200868 / 0.5)'

/** The app's MiddleTruncate split: keep the last path segment (up to 16), else the last 10. */
function splitBranch(value: string): { head: string; tail: string } | null {
  const chars = Array.from(value)
  let keep = 10
  const slash = chars.lastIndexOf('/')
  if (slash > 0 && slash < chars.length - 1) {
    const segment = chars.length - slash - 1
    keep = segment <= 16 ? segment : 10
  }
  if (chars.length <= keep + 4) return null
  const cut = chars.length - keep
  return { head: chars.slice(0, cut).join(''), tail: chars.slice(cut).join('') }
}

function TipRow({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <div style={{ display: 'flex', minWidth: 0, alignItems: 'center', gap: 8 }}>
      {icon}
      {children}
    </div>
  )
}

type TipAnchor = { top: number; left: number; right: number; bottom: number }

/**
 * Where a hover card goes, the way the app's Base UI positioner resolves it:
 * right of the card, start-aligned, 4px off (end-aligned if that runs off the
 * bottom); flipped to the left, then onto the other axis — under the card,
 * then over it — when a side has no room, shifted to stay inside, with 5px of
 * collision padding against the stage.
 */
function placeTip(a: TipAnchor, w: number, h: number, bounds: { width: number; height: number }) {
  const pad = 5
  const fitsX = (left: number) => left >= pad && left + w <= bounds.width - pad
  const fitsY = (top: number) => top >= pad && top + h <= bounds.height - pad
  const alignY = () => (fitsY(a.top) ? a.top : Math.max(pad, a.bottom - h))
  const shiftX = (left: number) => Math.min(Math.max(left, pad), bounds.width - pad - w)
  if (fitsX(a.right + 4)) return { left: a.right + 4, top: alignY() }
  if (fitsX(a.left - 4 - w)) return { left: a.left - 4 - w, top: alignY() }
  if (fitsY(a.bottom + 4)) return { left: shiftX(a.left), top: a.bottom + 4 }
  if (fitsY(a.top - 4 - h)) return { left: shiftX(a.left), top: a.top - 4 - h }
  return { left: shiftX(a.left), top: Math.min(a.bottom + 4, bounds.height - pad - h) }
}

function ThreadHoverCard({ thread, anchor }: { thread: SidebarThread; anchor: TipAnchor }) {
  const ref = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null)
  useLayoutEffect(() => {
    const el = ref.current
    const stage = el?.parentElement
    if (!el || !stage) return
    setPos(placeTip(anchor, el.offsetWidth, el.offsetHeight, { width: stage.clientWidth, height: stage.clientHeight }))
  }, [anchor, thread])
  const split = splitBranch(thread.branch)
  const ProviderIcon = thread.provider === 'claude' ? Claude : OpenAI
  const modelName = thread.provider === 'claude' ? `Claude ${thread.model}` : thread.model
  return (
    <div
      ref={ref}
      role="tooltip"
      className="n3sb-popup n3sb-tip"
      style={{
        position: 'absolute',
        top: pos?.top ?? 0,
        left: pos?.left ?? 0,
        visibility: pos ? undefined : 'hidden',
        zIndex: 40,
        display: 'flex',
        maxWidth: 320,
        boxSizing: 'border-box',
        borderRadius: 8,
        border: '1px solid rgba(255, 255, 255, 0.08)',
        boxShadow: 'rgba(0, 0, 0, 0.25) 0px 2px 16px 0px',
        pointerEvents: 'none',
        fontSize: 12,
        lineHeight: '16.5px',
        color: FG,
      }}
    >
      {pos && <GlassFill key={`${pos.top},${pos.left}`} tint={POPUP_TINT} />}
      <div style={{ position: 'relative', padding: '4px 8px' }}>
        <div style={{ display: 'flex', maxWidth: 320 - 18, minWidth: 0, flexDirection: 'column', gap: 8, padding: '8px 4px' }}>
          <div style={{ ...TRUNCATE, fontWeight: 500, lineHeight: '15px', color: FG }}>{thread.title}</div>
          <div style={{ display: 'grid', gap: 6, paddingLeft: 2, lineHeight: '16px', color: TIP_MUTED }}>
            <TipRow icon={<Favicon project={thread.project} size={12} />}>
              <div style={{ ...TRUNCATE, color: fgA(0.75) }}>{SIDEBAR_PROJECTS[thread.project].title}</div>
            </TipRow>
            <TipRow icon={<Laptop size={12} />}>
              <div style={{ ...TRUNCATE, color: fgA(0.75) }}>{SIDEBAR_MACHINE}</div>
            </TipRow>
            <TipRow icon={<Worktree size={12} />}>
              <span style={{ display: 'flex', minWidth: 0, maxWidth: '100%', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                {split ? (
                  <>
                    <span style={TRUNCATE}>{split.head}</span>
                    <span style={{ flexShrink: 0 }}>{split.tail}</span>
                  </>
                ) : (
                  <span style={TRUNCATE}>{thread.branch}</span>
                )}
              </span>
              <span style={{ flexShrink: 0 }}>Worktree</span>
            </TipRow>
            <TipRow
              icon={
                <span style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ProviderIcon size={12} style={{ opacity: 0.6, filter: 'grayscale(1)' }} />
                </span>
              }
            >
              <div style={{ ...TRUNCATE, color: fgA(0.75) }}>{modelName}</div>
            </TipRow>
            {thread.notice && (
              <div
                style={{
                  display: 'flex',
                  minWidth: 0,
                  alignItems: 'flex-start',
                  gap: 8,
                  color: NOTICE_TONE[thread.notice.tone],
                }}
              >
                <CircleAlert size={12} style={{ marginTop: 2 }} />
                <div style={{ minWidth: 0, flex: '1 1 0%', overflowWrap: 'break-word', lineHeight: '20px' }}>
                  {thread.notice.text}
                </div>
              </div>
            )}
          </div>
          {thread.pr && (
            <div
              style={{
                paddingTop: 8,
                paddingLeft: 2,
                borderTop: '1px solid oklab(0.999994 0.0000455678 0.0000200868 / 0.048)',
                lineHeight: '16px',
                color: TIP_MUTED,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {thread.pr.state === 'merged' ? (
                  <GitMerge size={12} style={{ color: PR_TONE.merged }} />
                ) : thread.pr.state === 'draft' ? (
                  <GitPullRequestDraft size={12} style={{ color: PR_TONE.draft }} />
                ) : (
                  <GitPullRequest size={12} style={{ color: PR_TONE.open }} />
                )}
                <span style={{ flexShrink: 0, fontVariantNumeric: 'tabular-nums' }}>{`# ${thread.pr.number}`}</span>
                <span style={{ ...TRUNCATE, color: fgA(0.75) }}>{thread.pr.title}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ── The panel ───────────────────────────────────────────────────────────────

const CHROME_ROWS: { label: string; icon: ReactNode }[] = [
  { label: 'Search', icon: <Search size={16} /> },
  { label: 'New agent', icon: <NavigationArrow size={16} /> },
  { label: 'Add a project', icon: <FolderPlus size={16} /> },
  { label: 'Usage', icon: <ChartDonut size={16} /> },
  { label: 'Automations', icon: <Zap size={16} /> },
]

/** The macOS window controls, drawn the way the collage drew them: on the toggle's row, red on the icon column. */
function TrafficLights() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 90 52"
      width={90}
      height={52}
      style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible', pointerEvents: 'none' }}
    >
      {[
        ['#ff5f57', 28],
        ['#febc2e', 48],
        ['#28c840', 68],
      ].map(([fill, cx]) => (
        <g key={fill}>
          <circle cx={cx} cy={26} r={6} fill={fill as string} />
          <circle cx={cx} cy={26} r={5.75} fill="none" stroke="rgba(0,0,0,.18)" strokeWidth={0.5} />
        </g>
      ))}
    </svg>
  )
}

/** The working runs' start times, fixed at mount so each timer reads as its seed did and then ticks on. */
function useStartTimes() {
  const [starts] = useState(() => {
    const now = Date.now()
    const starts = new Map<string, number>()
    for (const thread of SIDEBAR_THREADS) {
      if (thread.workingFor !== undefined) starts.set(thread.id, now - thread.workingFor * 60_000 - 20_000)
    }
    return starts
  })
  return starts
}

type SidebarPanelProps = {
  settings: SidebarSettings
  /** The sidebar is resizable in the app; a narrow screen gets a narrower one rather than a scaled one. */
  width: number
  onSettingsChange: (settings: SidebarSettings) => void
  /** Panel height; the list scrolls inside it. */
  height: number
  /** Whether a card's hover card may open (off on touch, where nothing hovers). */
  hoverCards: boolean
  /** Where hover cards mount — the stage, so they can leave the panel's box. */
  overlay: RefObject<HTMLDivElement | null>
}

function SidebarPanel({ settings, onSettingsChange, width, height, hoverCards, overlay }: SidebarPanelProps) {
  const [active, setActive] = useState(SIDEBAR_INITIAL_ACTIVE)
  const [menu, setMenu] = useState<{ top: number; right: number } | null>(null)
  const menuOpen = menu !== null
  const [filter, setFilter] = useState<ProjectFilter>([])
  const [collapsedProjects, setCollapsedProjects] = useState<Set<SidebarProjectId>>(new Set())
  const [collapsedSections, setCollapsedSections] = useState<Set<SidebarStatusSection>>(new Set())
  const [tip, setTip] = useState<{ id: string; anchor: TipAnchor } | null>(null)
  // The gear pulses until it's first opened, to say the panel's own settings are live.
  const [nudge, setNudge] = useState(true)
  const [scroll, setScroll] = useState({ top: false, bottom: true })
  const starts = useStartTimes()
  const panelRef = useRef<HTMLDivElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const hoverTimer = useRef<number | undefined>(undefined)
  const gearRef = useRef<HTMLButtonElement>(null)

  const threads = useMemo(
    () => (filter.length === 0 ? SIDEBAR_THREADS : SIDEBAR_THREADS.filter((thread) => filter.includes(thread.project))),
    [filter],
  )
  const items = useMemo(
    () => buildList(settings.grouping, threads, collapsedProjects, collapsedSections),
    [settings.grouping, threads, collapsedProjects, collapsedSections],
  )

  const listRef = useCallback((node: HTMLUListElement | null) => {
    if (node) autoAnimate(node, listAnimation)
  }, [])

  const updateFades = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    setScroll({ top: el.scrollTop > 0, bottom: el.scrollTop + el.clientHeight < el.scrollHeight - 1 })
  }, [])
  useLayoutEffect(updateFades, [updateFades, items, height])

  const onHover = useCallback(
    (id: string | null, el: HTMLElement | null) => {
      window.clearTimeout(hoverTimer.current)
      if (!id || !el || !hoverCards) {
        setTip(null)
        return
      }
      const show = () => {
        const stage = overlay.current
        const panel = panelRef.current
        if (!stage || !panel) return
        const s = stage.getBoundingClientRect()
        const p = panel.getBoundingClientRect()
        const r = el.getBoundingClientRect()
        if (r.bottom < p.top || r.top > p.bottom) return
        setTip({
          id,
          anchor: { top: r.top - s.top, left: r.left - s.left, right: r.right - s.left, bottom: r.bottom - s.top },
        })
      }
      // Once one hover card is up, the next opens at once, as in the app's tooltip group.
      if (tip) show()
      else hoverTimer.current = window.setTimeout(show, HOVER_DELAY)
    },
    [hoverCards, overlay, tip],
  )
  useEffect(() => () => window.clearTimeout(hoverTimer.current), [])

  const openThread = useCallback((id: string) => setActive(id), [])
  const closeMenu = useCallback(() => setMenu(null), [])
  const toggleMenu = () => {
    const gear = gearRef.current
    const panel = panelRef.current
    if (menu || !gear || !panel) {
      setMenu(null)
      return
    }
    setNudge(false)
    const g = gear.getBoundingClientRect()
    const p = panel.getBoundingClientRect()
    // Under the gear with their right edges aligned (align "end", offset 4).
    setMenu({ top: g.bottom - p.top + 4, right: p.right - g.right })
  }

  const toggleProject = (project: SidebarProjectId) =>
    setCollapsedProjects((prev) => {
      const next = new Set(prev)
      if (next.has(project)) next.delete(project)
      else next.add(project)
      return next
    })
  const toggleSection = (section: SidebarStatusSection) =>
    setCollapsedSections((prev) => {
      const next = new Set(prev)
      if (next.has(section)) next.delete(section)
      else next.add(section)
      return next
    })

  const card = (thread: SidebarThread, section?: SidebarStatusSection, underProject?: SidebarProjectId) => (
    <ThreadCard
      thread={thread}
      compact={settings.compact}
      projectTitleHidden={underProject !== undefined}
      active={thread.id === active}
      recedes={recedes(thread, thread.id === active, section)}
      startedAt={starts.get(thread.id)}
      onOpen={openThread}
      onHover={onHover}
    />
  )

  const fade = 12
  const mask = `linear-gradient(to bottom, ${scroll.top ? 'transparent 0' : '#000 0'}, #000 ${fade}px, #000 calc(100% - ${fade}px), ${
    scroll.bottom ? 'transparent 100%' : '#000 100%'
  })`
  const tipThread = tip ? SIDEBAR_THREADS.find((thread) => thread.id === tip.id) : undefined

  return (
    <>
      <div
        ref={panelRef}
        style={{
          position: 'relative',
          width,
          height,
          borderRadius: WINDOW_RADIUS,
          boxShadow: WINDOW_SHADOW,
          fontFamily: '"Geist Variable", Geist, -apple-system, system-ui, sans-serif',
          fontSize: 16,
          lineHeight: '24px',
          fontWeight: 400,
          color: FG,
          WebkitFontSmoothing: 'antialiased',
          textAlign: 'left',
        }}
      >
        <div style={{ position: 'absolute', inset: 0, borderRadius: WINDOW_RADIUS, overflow: 'hidden' }}>
          <GlassFill tint={PANEL_TINT} />
        </div>
        <div
          style={{
            position: 'relative',
            display: 'flex',
            height: '100%',
            flexDirection: 'column',
            borderRight: '1px solid rgba(64, 64, 64, 0.6)',
            borderRadius: WINDOW_RADIUS,
          }}
        >
          {/* Top bar: the window controls' gutter, the panel toggle, the logo. */}
          <div style={{ position: 'relative', display: 'flex', height: TOPBAR, flexShrink: 0, alignItems: 'center', gap: 8 }}>
            <TrafficLights />
            <div style={{ display: 'flex', alignItems: 'center', paddingLeft: CONTROLS_LEFT }}>
              <button
                type="button"
                aria-label="Toggle Sidebar"
                className="n3sb-icon-button"
                style={{
                  ...ICON_BUTTON,
                  width: 28,
                  height: 28,
                  borderRadius: 8,
                  border: '1px solid transparent',
                  color: QUIET_BUTTON,
                }}
              >
                <PanelLeft size={16} style={{ margin: '0 -2px', color: QUIET_BUTTON }} />
              </button>
            </div>
            <span
              aria-label="no3y Code"
              style={{
                display: 'flex',
                height: 16,
                marginLeft: 'auto',
                alignItems: 'center',
                gap: 4,
                paddingRight: 16,
                overflow: 'hidden',
                color: SIDEBAR_FG,
              }}
            >
              <BrandMark size={16} />
              <Wordmark width={34.667} height={8} style={{ color: fgA(0.4) }} />
            </span>
          </div>

          <div
            ref={scrollRef}
            className="n3sb-scroll"
            onScroll={() => {
              updateFades()
              closeMenu()
              setTip(null)
            }}
            style={{
              position: 'relative',
              flex: '1 1 0%',
              minHeight: 0,
              overflowY: 'auto',
              overscrollBehavior: 'contain',
              maskImage: mask,
              WebkitMaskImage: mask,
            }}
          >
            {/* Search, New agent and the rest. */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2, padding: '0 8px' }}>
              {CHROME_ROWS.map((row) => (
                <button
                  key={row.label}
                  type="button"
                  className="n3sb-chrome"
                  style={{
                    ...ICON_BUTTON,
                    justifyContent: 'flex-start',
                    gap: 6,
                    padding: '6px 12px',
                    height: 32,
                    boxSizing: 'border-box',
                    borderRadius: 12,
                    fontSize: 14,
                    lineHeight: '20px',
                    color: SIDEBAR_FG,
                    textAlign: 'left',
                  }}
                >
                  {row.icon}
                  <span style={{ ...TRUNCATE, flex: '1 1 0%' }}>{row.label}</span>
                </button>
              ))}
            </div>

            {/* The Threads row: sort and the settings gear. */}
            <div style={{ position: 'relative', marginTop: 24, padding: '0 8px' }}>
              <div style={{ display: 'flex', height: 32, alignItems: 'center', gap: 6, padding: '0 12px' }}>
                <span
                  role="heading"
                  aria-level={2}
                  style={{ ...TRUNCATE, flex: '1 1 0%', fontSize: 13, lineHeight: '16px', fontWeight: 600, color: MUTED }}
                >
                  Threads
                </span>
                <div style={{ position: 'relative', display: 'flex', flexShrink: 0, alignItems: 'center', marginRight: -12 }}>
                  <button
                    type="button"
                    aria-label="Sort projects — Last user message"
                    className="n3sb-icon-button"
                    style={{ ...ICON_BUTTON, width: 32, height: 32, borderRadius: 10, color: MUTED }}
                  >
                    <ArrowUpDown size={16} style={{ color: MUTED }} />
                  </button>
                  <button
                    type="button"
                    aria-label="Filter threads by project and group-by"
                    aria-haspopup="menu"
                    aria-expanded={menuOpen}
                    className="n3sb-icon-button"
                    ref={gearRef}
                    onClick={toggleMenu}
                    style={{ ...ICON_BUTTON, position: 'relative', width: 32, height: 32, borderRadius: 10, color: MUTED }}
                  >
                    {nudge && (
                      <>
                        <span aria-hidden className="n3sb-gear-pulse" />
                        <span aria-hidden className="n3sb-gear-pulse n3sb-gear-pulse-late" />
                      </>
                    )}
                    <Settings size={16} style={{ position: 'relative', color: MUTED }} />
                  </button>
                </div>
              </div>
            </div>

            {/* The thread list. */}
            <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', padding: '0 8px 4px' }}>
              <ul
                ref={listRef}
                style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 2, margin: 0, padding: 0, listStyle: 'none' }}
              >
                {items.map((item) => {
                  switch (item.kind) {
                    case 'pinned':
                      return (
                        <li key={item.key} style={{ listStyle: 'none' }}>
                          <ul style={{ display: 'flex', flexDirection: 'column', gap: 2, margin: 0, padding: 0, listStyle: 'none' }}>
                            {item.threads.map((thread) => (
                              <li key={thread.id} style={{ position: 'relative', listStyle: 'none' }}>
                                {/* The pinned block keeps the plain recede rule, even under status headers. */}
                                {card(thread)}
                              </li>
                            ))}
                          </ul>
                        </li>
                      )
                    case 'divider':
                      return <li key={item.key} aria-hidden style={{ listStyle: 'none', height: 1, margin: '8px 10px', background: RULE }} />
                    case 'project':
                      return (
                        <li
                          key={item.key}
                          role="presentation"
                          className="n3sb-project-header"
                          data-n3sb-header=""
                          style={{ position: 'relative', listStyle: 'none' }}
                        >
                          <ProjectHeader
                            project={item.project}
                            first={item.first}
                            afterOpenSection={item.afterOpenSection}
                            collapsed={collapsedProjects.has(item.project)}
                            onToggle={() => toggleProject(item.project)}
                          />
                        </li>
                      )
                    case 'status':
                      return (
                        <li key={item.key} style={{ listStyle: 'none' }}>
                          <StatusHeader
                            label={item.label}
                            count={item.count}
                            first={item.first}
                            collapsed={collapsedSections.has(item.section)}
                            onToggle={() => toggleSection(item.section)}
                          />
                        </li>
                      )
                    case 'card':
                      return (
                        <li
                          key={item.key}
                          data-n3sb-section={item.underProject ? '' : undefined}
                          style={{ position: 'relative', listStyle: 'none' }}
                        >
                          {card(item.thread, item.section, item.underProject)}
                        </li>
                      )
                  }
                })}
                <li key="shelf:snoozed" style={{ listStyle: 'none' }}>
                  <Shelf label="Snoozed" count={SIDEBAR_SHELVES.snoozed} tone="snoozed" />
                </li>
                <li key="shelf:settled" style={{ listStyle: 'none' }}>
                  {settings.grouping === 'status' ? (
                    <StatusHeader label="Settled" count={SIDEBAR_SHELVES.settled} first={false} collapsed onToggle={() => {}} />
                  ) : (
                    <Shelf label="Settled" count={SIDEBAR_SHELVES.settled} tone="settled" />
                  )}
                </li>
              </ul>
            </div>
          </div>

          {/* Footer: Settings and pull requests. */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: '4px 8px', flexShrink: 0 }}>
            <ul style={{ display: 'flex', alignItems: 'center', gap: 4, margin: 0, padding: 0, listStyle: 'none' }}>
              {[
                { label: 'Settings', icon: <Settings size={16} style={{ color: QUIET_ICON }} /> },
                { label: 'Pull requests', icon: <GitPullRequest size={16} style={{ color: QUIET_ICON }} /> },
              ].map((item) => (
                <li key={item.label} style={{ position: 'relative', listStyle: 'none' }}>
                  <button
                    type="button"
                    aria-label={item.label}
                    className="n3sb-icon-button"
                    style={{ ...ICON_BUTTON, width: 32, height: 32, borderRadius: 8, fontWeight: 500, color: QUIET_BUTTON }}
                  >
                    {item.icon}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* The gear menu hangs off the Threads row, right-aligned to the gear. */}
        {menu && (
          <GearMenu
            top={menu.top}
            right={menu.right}
            anchor={gearRef}
            settings={settings}
            onChange={onSettingsChange}
            filter={filter}
            onFilter={setFilter}
            onClose={closeMenu}
          />
        )}

        <div aria-hidden style={{ position: 'absolute', inset: 0, borderRadius: WINDOW_RADIUS, boxShadow: WINDOW_RING, pointerEvents: 'none' }} />
      </div>

      {tip && tipThread && overlay.current && <TipPortal target={overlay.current} thread={tipThread} anchor={tip.anchor} />}
    </>
  )
}

/** Hover cards render into the stage rather than the panel, which clips. */
function TipPortal({ target, thread, anchor }: { target: HTMLElement; thread: SidebarThread; anchor: TipAnchor }) {
  return createPortal(<ThreadHoverCard thread={thread} anchor={anchor} />, target)
}


// ── The playground ──────────────────────────────────────────────────────────

const PAGE_ACCENT = 'var(--color-orange)'
const PAGE_RING = 'var(--color-border-default)'
/** The wallpaper overshoots the stage like the collage's tiles did, so the blur never reaches its edge. */
const WALL_ZOOM = 1.13
const WALL_ASPECT = 2400 / 1556

/** The indicator beside a control's label: a radio for a grouping, a check box for compact cards. */
function OptionMark({ shape, on }: { shape: 'radio' | 'check'; on: boolean }) {
  return (
    <span
      aria-hidden
      style={{
        display: 'flex',
        width: 16,
        height: 16,
        flexShrink: 0,
        alignItems: 'center',
        justifyContent: 'center',
        boxSizing: 'border-box',
        borderRadius: shape === 'radio' ? '50%' : 4,
        border: `1.5px solid ${on ? PAGE_ACCENT : PAGE_RING}`,
        background: on && shape === 'check' ? PAGE_ACCENT : 'transparent',
        color: 'var(--color-on-accent)',
      }}
    >
      {on && shape === 'radio' && <span style={{ width: 8, height: 8, borderRadius: '50%', background: PAGE_ACCENT }} />}
      {on && shape === 'check' && <Check size={12} />}
    </span>
  )
}

/**
 * no3y Code's sidebar, live, on the fluted wallpaper the captures were baked
 * over, beside the row's copy with the page's own controls under it. The
 * controls and the panel's gear menu drive the same settings, so either one
 * moves the other; a control that isn't showing sits dim.
 */
export default function SidebarPlayground({
  options,
  copy,
  radius,
  isMobile,
}: {
  options: SidebarPlaygroundOption[]
  /** The row's heading and body, which the controls stand under. */
  copy: ReactNode
  /** The project pages' shared mockup corner. */
  radius: string
  isMobile: boolean
}) {
  const [settings, setSettings] = useState<SidebarSettings>({ grouping: 'project', compact: false })
  const [stageWidth, setStageWidth] = useState(0)
  const stageRef = useRef<HTMLDivElement>(null)
  const wallRef = useRef<HTMLDivElement>(null)
  const canHover = useMediaQuery('(hover: hover) and (pointer: fine)')

  useLayoutEffect(() => {
    const stage = stageRef.current
    if (!stage) return
    const measure = () => setStageWidth(stage.clientWidth)
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(stage)
    return () => observer.disconnect()
  }, [])

  const pad = isMobile ? 24 : 40
  const panelHeight = isMobile ? 640 : 820
  const stageHeight = panelHeight + pad * 2
  const panelWidth = Math.min(SIDEBAR_WIDTH, Math.max(208, stageWidth - 32))
  // Centred on the wallpaper, on whole pixels so the panel's text lands on the
  // pixel grid as it does in the app. A hover card without room beside it flips
  // under its card (`placeTip`).
  const panelLeft = Math.round((stageWidth - panelWidth) / 2)
  const wallWidth = Math.max(stageWidth, stageHeight * WALL_ASPECT) * WALL_ZOOM
  const wallHeight = wallWidth / WALL_ASPECT

  const isOn = (option: SidebarPlaygroundOption) =>
    option.compact ? settings.compact : option.grouping === settings.grouping
  const choose = (option: SidebarPlaygroundOption) =>
    setSettings((current) =>
      option.compact ? { ...current, compact: !current.compact } : { ...current, grouping: option.grouping ?? current.grouping },
    )

  const stage = (
    <div
      ref={stageRef}
      style={{ position: 'relative', height: stageHeight, borderRadius: radius, overflow: 'hidden', isolation: 'isolate' }}
    >
      <div
        ref={wallRef}
        aria-hidden
        style={{
          position: 'absolute',
          left: (stageWidth - wallWidth) / 2,
          top: (stageHeight - wallHeight) / 2,
          width: wallWidth,
          height: wallHeight,
          backgroundImage: `url(${SIDEBAR_WALLPAPER})`,
          backgroundSize: '100% 100%',
        }}
      />
      {stageWidth > 0 && (
        <WallContext.Provider value={wallRef}>
          <div style={{ position: 'absolute', top: pad, left: panelLeft }}>
            <SidebarPanel
              settings={settings}
              onSettingsChange={setSettings}
              width={panelWidth}
              height={panelHeight}
              hoverCards={canHover}
              overlay={stageRef}
            />
          </div>
        </WallContext.Provider>
      )}
    </div>
  )

  const controls = (
    <div role="group" aria-label="Sidebar settings" style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? 20 : 24 }}>
      {options.map((option) => {
        const on = isOn(option)
        return (
          <button
            key={option.label}
            type="button"
            className="n3sb-option"
            aria-pressed={on}
            onClick={() => choose(option)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 4,
              padding: 0,
              border: 0,
              background: 'transparent',
              textAlign: 'left',
              cursor: 'pointer',
              font: 'inherit',
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <OptionMark shape={option.compact ? 'check' : 'radio'} on={on} />
              <span className="n3sb-option-label" style={{ fontSize: 16, fontWeight: 500, lineHeight: 1.4 }}>
                {option.label}
              </span>
            </span>
            <span className="n3sb-option-caption" style={{ paddingLeft: 26, fontSize: 16, fontWeight: 400, lineHeight: 1.4 }}>
              {option.caption}
            </span>
          </button>
        )
      })}
    </div>
  )

  // Mobile stacks the controls under the stage, so a tap changes what's on screen.
  if (isMobile) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {copy}
        {stage}
        {controls}
      </div>
    )
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '2fr 3fr', columnGap: 64, alignItems: 'start' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 48 }}>
        {copy}
        {controls}
      </div>
      {stage}
    </div>
  )
}
