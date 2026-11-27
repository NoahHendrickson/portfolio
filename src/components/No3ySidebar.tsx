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
  SIDEBAR_BOTS,
  SIDEBAR_INITIAL_ACTIVE,
  SIDEBAR_MACHINE,
  SIDEBAR_PROJECT_ORDER,
  SIDEBAR_PROJECTS,
  SIDEBAR_SHELVES,
  SIDEBAR_STATUS_SECTIONS,
  SIDEBAR_THREADS,
  STATUS_LABEL,
  statusSection,
  type SidebarBot,
  type SidebarGrouping,
  type SidebarPetalLayout,
  type SidebarPlaygroundOption,
  type SidebarProjectId,
  type SidebarStatusSection,
  type SidebarThread,
} from '../data/no3ySidebar'
import {
  AlarmClock,
  ArrowLeft,
  ArrowRight,
  ArrowUpDown,
  Caret,
  ChartDonut,
  Check,
  ChevronDown,
  CircleAlert,
  CircleAlertFill,
  CircleDot,
  CircleHalf,
  CircleSlash,
  Claude,
  Clock,
  Code,
  EllipsisVertical,
  Folder,
  FolderClosed,
  FolderOpen,
  FolderPlus,
  Folders,
  GitMerge,
  GitPullRequest,
  GitPullRequestDraft,
  Laptop,
  MessageSquareText,
  Music,
  NavigationArrow,
  OpenAI,
  PanelLeft,
  Pin,
  PinOff,
  Plus,
  RefreshCw,
  Search,
  Settings,
  Worktree,
  Zap,
} from './no3ySidebarIcons'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { BEAD_RING_PERIOD, bakeBeadRingFilm } from './no3yBeadRing'
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

  Since Nov 25 2026 the Glass skin is Flat Glass (3D off, the fork's default look), re-read off
  custom 0456ab91b4 with the dev house look on (cool-darker, sidebar font 14, interface 15), and
  the panel follows the app's newer layout in every skin: the top bar's back / forward and Code /
  Chat switch, no Threads row unless nothing is grouped (each section header carries add a
  project, sort and the settings gear on hover), the Petals row's own View options (List or
  Grid, and Compact cards for the list), the gear menu's Group by switch and project search,
  the footer's Settings, Issues, Music and update buttons, and the app's Hugeicons glyphs.

  Two things are the page's, not the app's. macOS draws Flat Glass's sidebar and menus itself
  (NSGlassEffectView behind Chromium), so a browser can't: the panel wears a native capture of
  that glass over the Jolly Petal wallpaper (`inlet/flat-layer/sidebar-strip-smooth.png`, the
  strip the Flat Glass clips are rendered with), and the menus and hover card are solid in the
  panel's wash (the app's popover colour) rather than macOS's glass. And the window chrome
  (macOS 27's traffic lights, corner, ring, shadow) is the renders', since the desktop draws it.
*/

// ── Palette (read off the running app) ─────────────────────────────────────

/*
  The panel's colours ride CSS custom properties set per skin on the stage
  (`SKIN_VARS`), so one set of components draws both the Glass replica and the
  Inlet Black one the page's mockup switch picks (Nov 15 2026). Glass keeps the
  literals it always had; Inlet's are read off the running app the same way
  (Inlet Black, dark sidebar on the cream panel). Basic (Nov 16 2026, the fork's
  default theme, in its Neutral Dark tone) was read the same way: Glass's layout
  on a solid #2b2b2b panel, 8px cards, 10px rows and a plain 8% open card.
*/
type Skin = 'glass' | 'inlet' | 'basic'
const SkinContext = createContext<Skin>('glass')
const useSkin = () => useContext(SkinContext)

const v = (name: string) => `var(--n3sb-${name})`
/** `--foreground` after the appearance-contrast mix. */
const FG = v('fg')
const fgA = (alpha: number) => `oklab(0.930993 0.0000424981 0.0000185966 / ${alpha})`
/** `--sidebar-foreground`. */
const SIDEBAR_FG = v('sidebar-fg')
/** The sidebar's muted channel as the card meta and the Threads label paint it. */
const MUTED = v('muted')
/** `--muted-foreground` inside the panel: section labels, the idle ring, action glyphs. */
const MUTED_GREY = v('muted-grey')
const mutedGreyA = (alpha: number) => `color-mix(in oklab, ${MUTED_GREY} ${alpha * 100}%, transparent)`
/** A receded card's own text (`text-sidebar-muted-foreground/75`). */
const RECEDED_ROW = v('receded-row')
/** `--fork-sidebar-card-title-receded`. */
const RECEDED_TITLE = v('receded-title')
/** The footer and toggle glyphs. */
const QUIET_ICON = v('quiet-icon')
const QUIET_BUTTON = v('quiet-button')
/** The pinned divider and the Settled rule (see `SKIN_VARS`). */
const RULE = v('rule')
/** The open thread's fill. */
const ROW_ACTIVE = v('row-active')

const STATUS = {
  working: v('status-working'),
  done: v('status-done'),
  amber: v('status-amber'),
  failed: v('status-failed'),
}

const PR_TONE = {
  open: v('pr-open'),
  merged: 'oklab(0.811 0.0443873 -0.101739 / 0.9)',
  draft: 'oklab(0.705 0.00415142 -0.0144141 / 0.8)',
}

const SKIN_VARS: Record<Skin, Record<string, string>> = {
  // Flat Glass (Nov 25 2026): a receded title is the muted white now, like a bot's, the open
  // card a flat white 10% and a hovered row white 6%.
  glass: {
    fg: 'oklab(0.930993 0.0000424981 0.0000185966)',
    'sidebar-fg': '#e8e8e8',
    muted: 'rgba(255, 255, 255, 0.65)',
    'muted-grey': 'oklab(0.633425 0.0000287592 0.0000126958)',
    'receded-row': 'oklab(0.867412 -0.00337383 -0.00388575 / 0.75)',
    'receded-title': 'rgba(255, 255, 255, 0.65)',
    'bot-receded-title': 'rgba(255, 255, 255, 0.65)',
    'quiet-icon': 'rgba(255, 255, 255, 0.65)',
    'quiet-button': 'oklab(0.867412 -0.00337383 -0.00388575 / 0.8)',
    // The app draws `--sidebar-border` at 60%, an opaque grey that reads flat over the glass;
    // white at 8% lands at the same weight and lets the wallpaper through.
    rule: 'rgba(255, 255, 255, 0.08)',
    'row-active': 'rgba(255, 255, 255, 0.1)',
    sep: 'oklab(0.930993 0.0000424981 0.0000185966 / 0.12)',
    'status-working': '#24fe8a',
    'status-done': '#2498fe',
    'status-amber': '#ffcd59',
    'status-failed': '#ff6b60',
    'pr-open': 'oklab(0.845 -0.138113 0.0370641 / 0.9)',
    // Status headers take the Threads label's white at 65% (count at 39%) rather than the
    // app's opaque grey, which read flatter than Threads over the glass (Nov 4 2026).
    'status-label': 'rgba(255, 255, 255, 0.65)',
    'status-count': 'rgba(255, 255, 255, 0.39)',
    shelf: 'oklab(0.633425 0.0000287592 0.0000126958 / 0.5)',
    hover: 'rgba(255, 255, 255, 0.06)',
    'hover-fg': '#e8e8e8',
    'hover-title': 'oklab(0.930993 0.0000424981 0.0000185966)',
    'menu-hover': 'oklab(0.930993 0.0000424981 0.0000185966 / 0.08)',
    ring: 'rgb(255 255 255 / 30%)',
  },
  inlet: {
    fg: 'oklab(0.930993 0.0000424981 0.0000185966)',
    'sidebar-fg': '#e8e8e8',
    muted: 'oklab(0.686218 0.0000311732 0.0000137091)',
    'muted-grey': 'oklab(0.686218 0.0000311732 0.0000137091)',
    'receded-row': 'oklab(0.873016 0.0000399053 0.0000174642 / 0.75)',
    'receded-title': 'rgb(176, 176, 176)',
    'bot-receded-title': 'rgb(176, 176, 176)',
    'quiet-icon': '#9a9a9a',
    'quiet-button': 'oklab(0.873016 0.0000399053 0.0000174642 / 0.8)',
    rule: 'oklab(0.890759 -0.0059571 0.0344398 / 0.6)',
    'row-active': '#f8f3d8',
    sep: 'oklab(0.930993 0.0000424981 0.0000185966 / 0.12)',
    'status-working': '#24fe8a',
    'status-done': '#2498fe',
    'status-amber': '#ffcd59',
    'status-failed': '#ff6b60',
    'pr-open': 'oklch(0.765 0.177 163.223)',
    'status-label': 'oklab(0.686218 0.0000311732 0.0000137091)',
    'status-count': 'oklab(0.686218 0.0000311732 0.0000137091 / 0.6)',
    shelf: 'oklab(0.873016 0.0000399053 0.0000174642 / 0.6)',
    hover: 'rgb(39, 39, 39)',
    'hover-fg': '#e8e8e8',
    'hover-title': 'rgb(232, 232, 232)',
    'menu-hover': 'rgb(228, 224, 199)',
    ring: 'rgb(255 255 255 / 30%)',
  },
  basic: {
    fg: 'oklab(0.930993 0.0000424981 0.0000185966)',
    'sidebar-fg': 'oklab(0.930993 0.0000424981 0.0000185966)',
    muted: 'oklab(0.686218 0.0000311732 0.0000137091)',
    'muted-grey': 'oklab(0.686218 0.0000311732 0.0000137091)',
    'receded-row': 'oklab(0.7731 0.0000351667 0.0000154972 / 0.75)',
    'receded-title': 'rgb(181, 181, 181)',
    'bot-receded-title': 'rgb(181, 181, 181)',
    'quiet-icon': 'color(srgb 0.628627 0.628628 0.628627)',
    'quiet-button': 'oklab(0.7731 0.0000351667 0.0000154972 / 0.8)',
    rule: 'oklab(0.999994 0.0000455678 0.0000200868 / 0.048)',
    'row-active': 'rgba(255, 255, 255, 0.08)',
    sep: 'oklab(0.930993 0.0000424981 0.0000185966 / 0.12)',
    'status-working': '#24fe8a',
    'status-done': '#2498fe',
    'status-amber': '#ffcd59',
    'status-failed': '#ff6b60',
    'pr-open': 'oklab(0.845 -0.138113 0.0370641 / 0.9)',
    'status-label': 'oklab(0.686218 0.0000311732 0.0000137091)',
    'status-count': 'oklab(0.686218 0.0000311732 0.0000137091 / 0.6)',
    shelf: 'oklab(0.7731 0.0000351667 0.0000154972 / 0.6)',
    hover: 'rgba(255, 255, 255, 0.04)',
    'hover-fg': 'oklab(0.930993 0.0000424981 0.0000185966)',
    'hover-title': 'oklab(0.930993 0.0000424981 0.0000185966)',
    'menu-hover': 'oklab(0.930993 0.0000424981 0.0000185966 / 0.08)',
    ring: 'rgb(255 255 255 / 30%)',
  },
}

/** Inlet's open card is the cream pill the panel bridges into: its ink and marks turn dark. */
const INLET_ACTIVE_VARS = {
  '--n3sb-fg': '#1c1c1a',
  '--n3sb-sidebar-fg': '#1c1c1a',
  '--n3sb-muted': '#6c6a5e',
  '--n3sb-muted-grey': '#6c6a5e',
  '--n3sb-receded-title': '#1c1c1a',
  '--n3sb-sep': 'oklab(0.225667 -0.0010801 0.00363898 / 0.12)',
  '--n3sb-status-working': '#047857',
  '--n3sb-status-done': '#1d4ed8',
  '--n3sb-status-amber': '#e0a526',
  '--n3sb-status-failed': '#b91c1c',
  '--n3sb-pr-open': 'oklch(0.508 0.118 165.612)',
} as CSSProperties

const skinStyle = (skin: Skin) =>
  Object.fromEntries(Object.entries(SKIN_VARS[skin]).map(([name, value]) => [`--n3sb-${name}`, value])) as CSSProperties


const NOTICE_TONE = {
  error: 'rgb(251, 65, 74)',
  warning: 'oklch(0.769 0.188 70.08)',
}

const SNOOZED_TONE = 'oklch(0.707 0.165 254.624)'
const SNOOZED_RULE = 'oklab(0.623 -0.0378409 -0.210628 / 0.2)'

// ── Inlet surfaces (read off the running app) ─────────────────────────────

/** The sidebar's solid fill, `--sidebar`. */
const INLET_SIDEBAR = '#141414'
/** The chat panel the open card bridges into, and Inlet's hung menus. */
const INLET_CREAM = '#f8f3d8'
const INLET_INK = 'oklab(0.225667 -0.0010801 0.00363898)'
const INLET_RULE = 'color(srgb 0.878431 0.862745 0.760784)'
/** A hover card: the hover fill, its text and the muted channel. */
const INLET_TIP_FILL = 'rgb(39, 39, 39)'
const INLET_TIP_FG = 'rgb(232, 232, 232)'
const INLET_TIP_MUTED = 'rgb(154, 154, 154)'
/** How much of the cream chat panel shows right of the sidebar, so the open card has something to bridge into. */
const INLET_STRIP = 40
/** The cream panel's inset from the window and its corner. */
const INLET_PANEL_INSET = 8
const INLET_PANEL_RADIUS = 8
/** The concave join where a hung menu meets its button (the app's `--fork-inlet-fillet`). */
const INLET_FILLET = 9

// ── Basic surfaces (read off the running app, Neutral Dark) ─────────────────

/** The sidebar's surface, `--basic-base`. The replica shows the sidebar alone, like Glass: no
    stage beside it (Nov 17 2026; a 40px strip of it showed at first, like Inlet's panel). */
const BASIC_BASE = '#2b2b2b'
/** Its hairlines (the sidebar's right edge, the menus' and hover cards' borders): white at 8%. */
const BASIC_RULE = 'rgba(255, 255, 255, 0.08)'
/** Menus and hover cards: the ink flattened over the base, solid. */
const BASIC_POPUP = 'rgb(60, 60, 60)'
const BASIC_POPUP_SHADOW = 'rgba(0, 0, 0, 0.16) 0px 1px 2px 0px, rgba(0, 0, 0, 0.24) 0px 8px 24px 0px'
const BASIC_MUTED = 'oklab(0.686218 0.0000311732 0.0000137091)'
/** Basic's header rows are 44, not 52, and the window buttons ride their axis. */
const BASIC_TOPBAR = 44

// ── Flat Glass ──────────────────────────────────────────────────────────────

/** The stage: the user's Jolly Petal piece, one pixel per dither square (576 × 373, the design
    board's ground), scaled up nearest so the squares stay whole, as the Flat Glass renders draw it. */
const FLAT_WALLPAPER = '/work/no3y-code/design-system/collage/ground.webp'
const FLAT_WALL_ASPECT = 576 / 373
/** The panel: macOS's own sidebar glass over that piece, captured natively (2x, 323 × 834 pt)
    with the page hidden, the strip the Flat Glass clips are rendered on. */
const FLAT_PANEL = '/work/no3y-code/sidebar-flat-glass.webp'
/** The popup's own chrome (`dropdown-glass` under Flat Glass): a hairline, 12 corners, a long soft drop. */
const FLAT_POPUP_BORDER = '1px solid color(srgb 0.909804 0.909804 0.909804 / 0.12)'
const FLAT_POPUP_SHADOW = 'rgba(0, 0, 0, 0.8) 0px 18px 44px -18px'
/** macOS 27's window: 14 corners and the lights the renders draw (centres 27.75 / 50.75 / 73.75 × 21.75, 7 round). */
const FLAT_WINDOW_RADIUS = 14
/** The hover card's fill under Flat Glass (`--popover` on cool-darker): opaque. The menus take it too. */
const FLAT_TIP_FILL = 'rgb(40, 36, 39)'

/** Inlet's and Basic's stage (Nov 19 2026): the brand texture's Cool fade generated for this stage
    (`sidebar.mjs` in ~/.t3-fork/scratch/no3y-capture/inlet/backdrops/variants/, 3456 × 2240, the
    wall's 2400 × 1556 proportion): the stage shows only the wall's middle, so its two small floods
    sit at that window's top-right and bottom-left corners. Basic stood on Glass's fluted wallpaper
    until then; it now matches Inlet, as its screenshots do. */
const TEXTURE_BACKDROP = '/work/no3y-inlet/sidebar-backdrop.jpg'

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
  /** The Petals' layout and their own Compact cards (the list's alone), set from the Petals row's View options. */
  petals: SidebarPetalLayout
  compactPetals: boolean
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
            className={`n3sb-rain-${row}`}
            style={{
              fill: STATUS.working,
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

/* Inlet's and Flat Glass's working mark: the app's bead ring (the mark their captures run with, set by
   the dev house look since Nov 2026), one loop baked into a mask, frame under frame, and a strip
   stepped through it by one transform animation, as the app's FilmStrip does. 114 frames over 1.9s,
   baked at 3x the 15px box. The gear menu's Group by status option draws it in the menu's ink. */
const BEAD_RING_FRAMES = 114
let beadRingFilm: string | null = null

function BeadRing({ seed, color = STATUS.working }: { seed: string; color?: string }) {
  beadRingFilm ??= bakeBeadRingFilm(BEAD_RING_FRAMES, 45)
  const start = rainOffsetSeconds(seed) % BEAD_RING_PERIOD
  return (
    <span
      aria-hidden
      style={{ position: 'relative', display: 'block', width: 15, height: 15, margin: '-0.5px -1.5px', flexShrink: 0, overflow: 'hidden' }}
    >
      <span
        className="n3sb-film"
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          height: `${BEAD_RING_FRAMES * 100}%`,
          background: color,
          maskImage: beadRingFilm,
          WebkitMaskImage: beadRingFilm,
          maskSize: '100% 100%',
          WebkitMaskSize: '100% 100%',
          maskRepeat: 'no-repeat',
          WebkitMaskRepeat: 'no-repeat',
          animationDuration: `${BEAD_RING_PERIOD}s`,
          animationTimingFunction: `steps(${BEAD_RING_FRAMES})`,
          animationDelay: `${(-start).toFixed(4)}s`,
        }}
      />
    </span>
  )
}

function StatusMark({ thread }: { thread: SidebarThread }) {
  const skin = useSkin()
  const label = STATUS_LABEL[thread.status]
  let mark: ReactNode
  switch (thread.status) {
    case 'working':
      mark = skin === 'basic' ? <Rain seed={thread.id} /> : <BeadRing seed={thread.id} />
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
            style={{ width: 1, height: 8, flexShrink: 0, borderRadius: 9999, background: v('sep') }}
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
function HoverActions({ thread }: { thread: Pick<SidebarThread, 'pinned' | 'status'> }) {
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

/** A card's corners: Flat Glass rounds 12 (3D Glass rounded 20, 12 compact); Inlet 10, and its open
    card goes square on the right where the panel bridges into it; Basic 8. */
function cardRadius(skin: Skin, active: boolean) {
  if (skin === 'inlet') return active ? '10px 0 0 10px' : 10
  if (skin === 'basic') return 8
  return 12
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
  const skin = useSkin()
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
        borderRadius: cardRadius(skin, active),
        outline: 'none',
        background: active ? ROW_ACTIVE : 'transparent',
        color: active ? SIDEBAR_FG : recedes ? RECEDED_ROW : SIDEBAR_FG,
        ...(active && skin === 'inlet' ? INLET_ACTIVE_VARS : {}),
      }}
    >
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
          // Flat Glass's compact row is 32: the 18px line 7 in from either edge.
          padding: compact && skin === 'glass' ? '7px 12px' : '8px 12px',
        }}
      >
        <div style={{ display: 'flex', height: 18, minHeight: 18, minWidth: 0, alignItems: 'center', gap: 16 }}>
          {compact && !projectTitleHidden ? (
            <span style={{ display: 'flex', flex: '1 1 0%', minWidth: 0, alignItems: 'center', gap: 8 }}>
              {skin !== 'glass' ? (
                // Inlet and Basic set the project's icon in a chip: 18px at the ink's 12%, the icon 12px.
                <span
                  style={{
                    display: 'flex',
                    width: 18,
                    height: 18,
                    flexShrink: 0,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 5,
                    background: v('sep'),
                  }}
                >
                  <Favicon project={thread.project} size={12} />
                </span>
              ) : (
                <span style={{ display: 'flex', width: 16, height: 16, flexShrink: 0, alignItems: 'center', justifyContent: 'center' }}>
                  <Favicon project={thread.project} size={16} />
                </span>
              )}
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

// ── Petals (the app's bots) ─────────────────────────────────────────────────

/** Each mascot shape's body colour (`botMascotBaseColor` in the app's botMascotArt.ts), which tints its tile. */
const MASCOT_COLOR: Record<string, string> = {
  Classic: '#26b846', Round: '#f95b1c', Willow: '#008755', Heart: '#fcb01a', Maple: '#f95b1c', Oak: '#008755', Ginkgo: '#fcb01a',
  Monstera: '#26b846', Sakura: '#ff4f95', Spoon: '#3cb5fc', Tulip: '#f95b1c', Drop: '#7970f9', Bell: '#c841fa', Bud: '#fcb01a',
}

/** A bot's mascot, its pixel cells fitted into a box (the app's `BotMascot` with `fit`: 22 on a card,
    24 on a grid tile), or at one CSS pixel a cell (`fit` 0, a compact row's). */
function Mascot({ bot, fit = 22 }: { bot: SidebarBot; fit?: number }) {
  const { width, height, paths } = bot.mascot.sprite
  const cell = fit === 0 ? 1 : Math.min(fit / width, fit / height)
  return (
    <svg
      aria-hidden
      width={width * cell}
      height={height * cell}
      viewBox={`0 0 ${width} ${height}`}
      shapeRendering="crispEdges"
      style={{ display: 'block', flexShrink: 0 }}
    >
      {paths.map((path) => (
        <path key={path.fill} d={path.d} fill={path.fill} />
      ))}
    </svg>
  )
}

/**
 * The mascot on a 32px tile in its body colour at half strength, 8px corners, behind a 1px white
 * 24% inset edge (the app's `BotMascotTile`, custom 8916c0e81c / 5bba8f2a11; every skin's sidebar
 * is dark, so the edge is the white one), filling the card's two text lines.
 */
function MascotTile({ bot }: { bot: SidebarBot }) {
  return (
    <span
      aria-hidden
      style={{
        display: 'flex',
        width: 32,
        height: 32,
        flexShrink: 0,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
        boxShadow: 'inset 0 0 0 1px rgb(255 255 255 / 0.24)',
        backgroundColor: `color-mix(in srgb, ${MASCOT_COLOR[bot.mascot.shape] ?? '#26b846'} 50%, transparent)`,
      }}
    >
      <Mascot bot={bot} />
    </span>
  )
}

/**
 * A bot's card (the app's `SidebarV2BotCardBody`): the mascot beside two lines, the name and what
 * it is doing, with the trailing time, hover actions and status mark centred on both. 6 + 16 + 2 +
 * 14 + 6 = 44. Compact cards leave bots as they are (the app keeps its own compact-bots setting).
 * An idle bot recedes; a working one wears the working mark every card does (custom bdd28ba5db,
 * Nov 17 2026: the monitoring breath before), its mascot showing the work.
 */
/** A bot's status mark: the working mark, or the idle ring in the muted white. */
function BotMark({ bot }: { bot: SidebarBot }) {
  const skin = useSkin()
  const working = bot.status === 'working'
  return (
    <>
      <span role={working ? 'status' : undefined} style={SR_ONLY}>
        {working ? 'Working' : 'Idle'}
      </span>
      {working ? (
        skin === 'basic' ? <Rain seed={bot.id} /> : <BeadRing seed={bot.id} />
      ) : (
        <span aria-hidden style={MARK_SLOT}>
          <span style={{ width: 10, height: 10, borderRadius: '50%', border: `1px solid ${MUTED}`, boxSizing: 'border-box' }} />
        </span>
      )}
    </>
  )
}

/**
 * A Petal in the grid (the app's grid tile, Nov 25 2026): the mascot over its name on a white 4%
 * tile, 16 corners, padded 8 / 4 / 10, its status mark in the top right corner. 62 tall, as wide as
 * the auto-fit column gives it (at least 56, 8 apart).
 */
function BotTile({ bot, active, onOpen }: { bot: SidebarBot; active: boolean; onOpen: (id: string) => void }) {
  const working = bot.status === 'working'
  const recedes = !working && !active
  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`${bot.name}, ${working ? 'Working' : 'Idle'}`}
      aria-current={active ? 'page' : undefined}
      className="n3sb-card"
      data-active={active || undefined}
      onClick={() => onOpen(bot.id)}
      onKeyDown={(event) => {
        if (event.target !== event.currentTarget || (event.key !== 'Enter' && event.key !== ' ')) return
        event.preventDefault()
        onOpen(bot.id)
      }}
      style={{
        position: 'relative',
        width: '100%',
        cursor: 'pointer',
        overflow: 'hidden',
        userSelect: 'none',
        borderRadius: 16,
        outline: 'none',
        background: active ? ROW_ACTIVE : 'transparent',
        color: recedes ? RECEDED_ROW : SIDEBAR_FG,
      }}
    >
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 4,
          padding: '8px 4px 10px',
          background: fgA(0.04),
        }}
      >
        <span style={{ display: 'flex', width: 24, height: 24, alignItems: 'center', justifyContent: 'center' }}>
          <Mascot bot={bot} fit={24} />
        </span>
        <span
          className="n3sb-title"
          data-recedes={recedes || undefined}
          style={{ ...TRUNCATE, maxWidth: '100%', fontSize: 13, lineHeight: '16px', color: recedes ? RECEDED_ROW : FG }}
        >
          {bot.name}
        </span>
        <span style={{ position: 'absolute', top: 4, right: 6, display: 'flex', width: 12, height: 14, alignItems: 'center', justifyContent: 'center' }}>
          <BotMark bot={bot} />
        </span>
      </div>
    </div>
  )
}

function BotCard({
  bot,
  active,
  compact,
  startedAt,
  onOpen,
}: {
  bot: SidebarBot
  active: boolean
  /** The Petals' own Compact cards (the list's alone): one 32px line, the mascot bare at a pixel a cell. */
  compact: boolean
  startedAt: number | undefined
  onOpen: (id: string) => void
}) {
  const skin = useSkin()
  const working = bot.status === 'working'
  const recedes = !working && !active
  const onKeyDown = (event: ReactKeyboardEvent) => {
    if (event.target !== event.currentTarget) return
    if (event.key !== 'Enter' && event.key !== ' ') return
    event.preventDefault()
    onOpen(bot.id)
  }
  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`${bot.name}, ${working ? 'Working' : 'Idle'}`}
      aria-current={active ? 'page' : undefined}
      className="n3sb-card"
      data-active={active || undefined}
      onClick={() => onOpen(bot.id)}
      onKeyDown={onKeyDown}
      style={{
        position: 'relative',
        width: '100%',
        cursor: 'pointer',
        overflow: 'hidden',
        textAlign: 'left',
        userSelect: 'none',
        borderRadius: cardRadius(skin, active),
        outline: 'none',
        background: active ? ROW_ACTIVE : 'transparent',
        color: recedes ? RECEDED_ROW : SIDEBAR_FG,
        ...(active && skin === 'inlet' ? INLET_ACTIVE_VARS : {}),
      }}
    >
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          display: 'grid',
          gridTemplateColumns: compact ? '22px minmax(0, 1fr) auto' : '32px minmax(0, 1fr) auto',
          gridTemplateRows: compact ? '18px' : '16px 14px',
          alignItems: 'center',
          columnGap: 8,
          rowGap: 2,
          padding: compact ? '7px 12px' : '6px 12px',
        }}
      >
        <span style={{ gridRow: compact ? undefined : 'span 2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {compact ? <Mascot bot={bot} fit={0} /> : <MascotTile bot={bot} />}
        </span>
        <span style={{ display: 'flex', height: 16, minWidth: 0, alignItems: 'center' }}>
          <span
            className="n3sb-title"
            data-recedes={recedes || undefined}
            style={{
              ...TRUNCATE,
              flex: '1 1 0%',
              fontSize: 14,
              lineHeight: '18px',
              fontWeight: 400,
              color: recedes ? v('bot-receded-title') : FG,
            }}
          >
            {bot.name}
          </span>
        </span>
        <span style={{ gridRow: compact ? undefined : 'span 2', display: 'flex', alignItems: 'center', gap: 6, marginLeft: 8 }}>
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
                style={{ pointerEvents: 'none', gridColumn: 1, gridRow: 1, display: 'flex', alignItems: 'center', paddingRight: 4 }}
              >
                <span aria-hidden style={{ fontSize: 11, lineHeight: '15px', color: FG, fontVariantNumeric: 'tabular-nums' }}>
                  <WorkingDuration startedAt={startedAt} />
                </span>
              </span>
            )}
            <HoverActions thread={{ status: working ? 'working' : 'idle' }} />
          </span>
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
            <BotMark bot={bot} />
          </span>
        </span>
        {!compact && <div style={{ ...TRUNCATE, fontSize: 12, lineHeight: '14px', color: MUTED }}>{bot.line}</div>}
      </div>
    </div>
  )
}

/** A section's label (Petals, Threads, a status): 13px regular in the muted white, and the fold caret,
    turned a quarter while the section is folded. */
function SectionLabel({ label, collapsed = false }: { label: string; collapsed?: boolean }) {
  return (
    <span style={{ display: 'flex', minWidth: 0, alignItems: 'center', gap: 6 }}>
      <span style={{ ...TRUNCATE, fontSize: 13, lineHeight: '16px', fontWeight: 400, color: v('status-label') }}>{label}</span>
      <Caret
        size={14}
        style={{ color: v('status-label'), transform: collapsed ? 'rotate(-90deg)' : undefined, transition: 'transform 150ms cubic-bezier(0.4, 0, 0.2, 1)' }}
      />
    </span>
  )
}

/** A 32px icon button on a section's row (the app's `PROJECTS_ROW_BUTTON`; 28 on a section header). */
function RowButton({
  label,
  icon,
  size = 32,
  open,
  buttonRef,
  onClick,
  children,
}: {
  label: string
  icon: ReactNode
  size?: number
  open?: boolean
  buttonRef?: RefObject<HTMLButtonElement | null>
  onClick?: () => void
  children?: ReactNode
}) {
  const inlet = useSkin() === 'inlet'
  return (
    <button
      ref={buttonRef}
      type="button"
      aria-label={label}
      aria-haspopup={onClick && open !== undefined ? 'menu' : undefined}
      aria-expanded={open}
      className="n3sb-icon-button"
      data-open={open || undefined}
      onClick={onClick}
      style={{
        ...ICON_BUTTON,
        position: 'relative',
        width: size,
        height: size,
        flexShrink: 0,
        borderRadius: inlet && open ? '10px 10px 0 0' : 10,
        color: open ? (inlet ? INLET_INK : SIDEBAR_FG) : MUTED,
        // Open, the button holds the row's hover fill, as the app's trigger does; Inlet's is the cream
        // tab its menu hangs from.
        background: open ? (inlet ? INLET_CREAM : 'rgba(255, 255, 255, 0.08)') : undefined,
        zIndex: inlet && open ? 31 : undefined,
      }}
    >
      {children}
      <span style={{ position: 'relative', display: 'flex' }}>{icon}</span>
    </button>
  )
}

/** The Petals section between the rows above it and the threads: its row (the label, View options and
    a new Petal) over the Petals as cards in a list, or as tiles in a grid. */
function PetalsSection({
  active,
  starts,
  layout,
  compact,
  optionsOpen,
  nudge,
  optionsRef,
  onOptions,
  onOpen,
}: {
  active: string
  starts: Map<string, number>
  layout: SidebarPetalLayout
  compact: boolean
  optionsOpen: boolean
  /** The View options gear pulses until it's first opened, to say the panel's own menus are live. */
  nudge: boolean
  optionsRef: RefObject<HTMLButtonElement | null>
  onOptions: () => void
  onOpen: (id: string) => void
}) {
  return (
    <div style={{ position: 'relative', marginTop: 24, padding: '0 8px' }}>
      <div style={{ display: 'flex', height: 32, alignItems: 'center', gap: 6, padding: '0 12px' }}>
        <span role="heading" aria-level={2} style={{ display: 'flex', flex: '1 1 0%', minWidth: 0 }}>
          <SectionLabel label="Petals" />
        </span>
        <div style={{ display: 'flex', flexShrink: 0, alignItems: 'center', marginRight: -12 }}>
          <RowButton label="Petal view options" icon={<Settings size={16} />} open={optionsOpen} buttonRef={optionsRef} onClick={onOptions}>
            {nudge && (
              <>
                <span aria-hidden className="n3sb-gear-pulse" />
                <span aria-hidden className="n3sb-gear-pulse n3sb-gear-pulse-late" />
              </>
            )}
          </RowButton>
          <RowButton label="New petal" icon={<Plus size={16} />} />
        </div>
      </div>
      <ul
        style={
          layout === 'grid'
            ? { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(56px, 1fr))', gap: 8, margin: '4px 0 0', padding: 0, listStyle: 'none' }
            : { display: 'flex', flexDirection: 'column', gap: 2, margin: '4px 0 0', padding: 0, listStyle: 'none' }
        }
      >
        {SIDEBAR_BOTS.map((bot) => (
          <li key={bot.id} style={{ position: 'relative', minWidth: 0, listStyle: 'none' }}>
            {layout === 'grid' ? (
              <BotTile bot={bot} active={bot.id === active} onOpen={onOpen} />
            ) : (
              <BotCard bot={bot} active={bot.id === active} compact={compact} startedAt={starts.get(bot.id)} onOpen={onOpen} />
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

// ── Section headers ─────────────────────────────────────────────────────────

/** The list's own actions, which every section header carries (on hover) and the Threads row shows:
    add a project, sort, and the gear that opens the filter and Group by menu. Inert but the gear. */
function ListActions({
  size,
  gearOpen,
  onGear,
}: {
  size: number
  gearOpen: boolean
  onGear: (button: HTMLButtonElement) => void
}) {
  const gearRef = useRef<HTMLButtonElement>(null)
  return (
    <>
      <RowButton label="Add a project" size={size} icon={<FolderPlus size={16} />} />
      <RowButton label="Sort projects: Last user message" size={size} icon={<ArrowUpDown size={16} />} />
      <RowButton
        label="Filter threads by project and group-by"
        size={size}
        icon={<Settings size={16} />}
        open={gearOpen}
        buttonRef={gearRef}
        onClick={() => gearRef.current && onGear(gearRef.current)}
      />
    </>
  )
}

function ProjectHeader({
  project,
  first,
  afterOpenSection,
  collapsed,
  onToggle,
  gearOpen,
  onGear,
}: {
  project: SidebarProjectId
  first: boolean
  afterOpenSection: boolean
  collapsed: boolean
  onToggle: () => void
  gearOpen: boolean
  onGear: (button: HTMLButtonElement) => void
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
          right: 0,
          zIndex: 0,
          borderRadius: 12,
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
          fontSize: 13,
          fontWeight: 400,
          lineHeight: '16px',
          color: MUTED,
        }}
      >
        {label}
      </span>
      {/* The project's own ellipsis and plus, a hairline, then the list's actions (Nov 2026). */}
      <span
        className="n3sb-section-actions"
        data-held={gearOpen || undefined}
        // Laid over the row's right end rather than beside the label, as the app's are: at rest they take
        // no room, so the label runs the row's width.
        style={{ position: 'absolute', top: 2, right: 2, zIndex: 10, display: 'flex', alignItems: 'center' }}
      >
        <RowButton label={`Actions for ${label}`} size={28} icon={<EllipsisVertical size={16} />} />
        <RowButton label={`New thread in ${label}`} size={28} icon={<Plus size={16} />} />
        <span aria-hidden style={{ width: 1, height: 14, margin: '0 2px', flexShrink: 0, background: 'oklab(0.999994 0.0000455678 0.0000200868 / 0.072)' }} />
        <ListActions size={28} gearOpen={gearOpen} onGear={onGear} />
      </span>
    </div>
  )
}

/** A status section's header: its label and caret folding the section, and the list's actions on hover. */
function StatusHeader({
  label,
  first,
  collapsed,
  onToggle,
  gearOpen,
  onGear,
}: {
  label: string
  first: boolean
  collapsed: boolean
  onToggle: () => void
  gearOpen?: boolean
  onGear?: (button: HTMLButtonElement) => void
}) {
  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        height: 32,
        alignItems: 'center',
        gap: 6,
        padding: '0 12px',
        marginTop: first ? 0 : 8,
      }}
    >
      <button
        type="button"
        className="n3sb-header-pill"
        onClick={onToggle}
        aria-expanded={!collapsed}
        aria-label={`${collapsed ? 'Expand' : 'Collapse'} ${label}`}
        style={{ ...ICON_BUTTON, position: 'absolute', inset: 0, zIndex: 0, borderRadius: 12, outline: 'none' }}
      />
      <span role="heading" aria-level={3} style={{ pointerEvents: 'none', position: 'relative', zIndex: 1, display: 'flex', flex: '1 1 0%', minWidth: 0 }}>
        <SectionLabel label={label} collapsed={collapsed} />
      </span>
      {onGear && (
        <span
          className="n3sb-section-actions"
          data-held={gearOpen || undefined}
          style={{ position: 'absolute', top: 2, right: 2, zIndex: 10, display: 'flex', alignItems: 'center' }}
        >
          <ListActions size={28} gearOpen={gearOpen ?? false} onGear={onGear} />
        </span>
      )}
    </div>
  )
}

function Shelf({ label, count, tone }: { label: string; count: number; tone: 'snoozed' | 'settled' }) {
  const color = tone === 'snoozed' ? SNOOZED_TONE : v('shelf')
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

/** Inlet's radio and check boxes: cream with the menu's rule round them, filled in the ink when on. */
const INLET_MARK_ON = 'rgb(28, 28, 26)'


function MenuCheckbox({ checked }: { checked: boolean }) {
  const skin = useSkin()
  const inlet = skin === 'inlet'
  if (inlet) {
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
          border: `1px solid ${checked ? INLET_MARK_ON : INLET_RULE}`,
          background: checked ? INLET_MARK_ON : INLET_CREAM,
          color: '#ffffff',
          boxShadow: checked ? undefined : '0 1px 2px 0 oklab(0 0 0 / 0.05)',
        }}
      >
        {checked && <Check size={12} />}
      </span>
    )
  }
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
        color: skin === 'basic' ? BASIC_BASE : 'rgb(29, 29, 29)',
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

/** A menu row in the skin's own shape: Flat Glass's are 12-cornered at the 15px interface's text-sm
    (13.125 on 18.75); Inlet's 5 and Basic's 4 keep their older reads. */
function useMenuItem(): CSSProperties {
  const skin = useSkin()
  if (skin === 'inlet') return { ...MENU_ITEM, color: INLET_INK, borderRadius: 5 }
  if (skin === 'basic') return { ...MENU_ITEM, borderRadius: 4 }
  return { ...MENU_ITEM, borderRadius: 12, fontSize: 13.125, lineHeight: '18.75px' }
}

function MenuSeparator({ tight = false }: { tight?: boolean }) {
  const inlet = useSkin() === 'inlet'
  return (
    <div
      role="separator"
      style={{ height: 1, margin: tight ? '4px -4px' : '8px -4px', background: inlet ? INLET_RULE : 'color(srgb 0.909804 0.909804 0.909804 / 0.12)' }}
    />
  )
}

/** Where a menu sits: under its button, right edges aligned, 4 off (flipped above when the panel has no
    room under it); Inlet hangs it from the button, flush, the button filled in as the tab between them. */
type MenuPlacement = { top?: number; bottom?: number; right: number; hang: 'below' | 'above' }

/** A menu's surface and its dismissal (a press outside it and its button, or Escape). */
function MenuShell({
  placement,
  anchor,
  width,
  label,
  onClose,
  children,
}: {
  placement: MenuPlacement
  anchor: HTMLElement | null
  width: number
  label: string
  onClose: () => void
  children: ReactNode
}) {
  const ref = useRef<HTMLDivElement>(null)
  const skin = useSkin()
  const inlet = skin === 'inlet'
  const basic = skin === 'basic'

  useEffect(() => {
    ref.current?.querySelector<HTMLElement>('[role^="menuitem"]')?.focus({ preventScroll: true })
    const onPointer = (event: PointerEvent) => {
      const target = event.target as Node
      // A press on the button is the button's to handle: it toggles the menu shut.
      if (ref.current?.contains(target) || anchor?.contains(target)) return
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

  return (
    <div
      ref={ref}
      role="menu"
      aria-label={label}
      className="n3sb-popup"
      style={{
        position: 'absolute',
        top: placement.top,
        bottom: placement.bottom,
        right: placement.right,
        zIndex: 30,
        width,
        boxSizing: 'border-box',
        // Inlet's menu and its button are one shape: the corner at the button goes square.
        // Basic's is a plain solid menu: 8 corners, a hairline and a soft drop.
        borderRadius: inlet ? (placement.hang === 'below' ? '10px 0 10px 10px' : '10px 10px 0 10px') : basic ? 8 : 12,
        border: basic ? `1px solid ${BASIC_RULE}` : inlet ? undefined : FLAT_POPUP_BORDER,
        boxShadow: inlet ? undefined : basic ? BASIC_POPUP_SHADOW : FLAT_POPUP_SHADOW,
        // Flat Glass's menus are solid in the panel's wash (Nov 25 2026, the user's call): the hover
        // card's colour, rather than frosting the wallpaper the way macOS's own glass would.
        background: inlet ? INLET_CREAM : basic ? BASIC_POPUP : FLAT_TIP_FILL,
        color: inlet ? INLET_INK : SIDEBAR_FG,
        fontSize: 15,
        lineHeight: '22.5px',
      }}
    >
      <div style={{ position: 'relative', padding: inlet ? 5 : 4 }}>{children}</div>
    </div>
  )
}

/** The Group by switch: none, by project, by status, as icons in a pill (the app's segmented control). */
function GroupBySwitch({ value, onChange }: { value: SidebarGrouping; onChange: (value: SidebarGrouping) => void }) {
  const skin = useSkin()
  const inlet = skin === 'inlet'
  // Which option's name shows: at once on hover or focus (the browser's own title tooltip took a
  // second to come up; Nov 25 2026).
  const [tip, setTip] = useState<SidebarGrouping | null>(null)
  const wash = (alpha: number) => (inlet ? `rgb(28 28 26 / ${alpha * 100}%)` : `rgba(255, 255, 255, ${alpha})`)
  const options: { value: SidebarGrouping; label: string; icon: ReactNode }[] = [
    { value: 'none', label: 'No grouping', icon: <CircleSlash size={16} /> },
    { value: 'project', label: 'Group by project', icon: <Folders size={16} /> },
    { value: 'status', label: 'Group by status', icon: <BeadRing seed="group-by" color="currentColor" /> },
  ]
  return (
    <div
      role="radiogroup"
      aria-label="Group threads by"
      style={{ display: 'flex', flexShrink: 0, alignItems: 'center', padding: 2, borderRadius: 8, background: wash(0.08) }}
    >
      {options.map((option) => {
        const on = option.value === value
        return (
          <button
            key={option.value}
            type="button"
            role="menuitemradio"
            aria-checked={on}
            aria-label={option.label}
            className="n3sb-segment"
            onClick={() => onChange(option.value)}
            onPointerEnter={() => setTip(option.value)}
            onPointerLeave={() => setTip((current) => (current === option.value ? null : current))}
            onFocus={(event) => event.currentTarget.matches(':focus-visible') && setTip(option.value)}
            onBlur={() => setTip((current) => (current === option.value ? null : current))}
            style={{
              ...ICON_BUTTON,
              position: 'relative',
              width: 24,
              height: 24,
              boxSizing: 'border-box',
              borderRadius: 6,
              border: `1px solid ${on ? wash(0.08) : 'transparent'}`,
              background: on ? wash(0.12) : 'transparent',
              color: inlet ? INLET_INK : SIDEBAR_FG,
            }}
          >
            {option.icon}
            {tip === option.value && (
              <span
                role="tooltip"
                style={{
                  position: 'absolute',
                  bottom: 'calc(100% + 8px)',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  zIndex: 40,
                  padding: '4px 8px',
                  boxSizing: 'border-box',
                  borderRadius: 6,
                  border: inlet ? '1px solid transparent' : skin === 'basic' ? '1px solid rgba(255, 255, 255, 0.08)' : FLAT_POPUP_BORDER,
                  boxShadow: inlet ? undefined : 'rgba(0, 0, 0, 0.25) 0px 2px 16px 0px',
                  background: inlet ? INLET_TIP_FILL : skin === 'basic' ? BASIC_POPUP : FLAT_TIP_FILL,
                  color: inlet ? INLET_TIP_FG : FG,
                  fontSize: 11.25,
                  lineHeight: '15px',
                  fontWeight: 500,
                  whiteSpace: 'nowrap',
                  pointerEvents: 'none',
                }}
              >
                {option.label}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}

/** The project scope's icon for a row: the folder for All projects, else the project's own. */
function ScopeIcon({ project }: { project: SidebarProjectId | null }) {
  if (project === null) return <Folder size={16} />
  return <Favicon project={project} size={16} />
}

/** The list's gear menu: Group by, Compact cards, then the projects it shows, searchable. */
function GearMenu({
  placement,
  anchor,
  settings,
  onChange,
  filter,
  onFilter,
  onClose,
}: {
  placement: MenuPlacement
  anchor: HTMLElement | null
  settings: SidebarSettings
  onChange: (settings: SidebarSettings) => void
  filter: ProjectFilter
  onFilter: (filter: ProjectFilter) => void
  onClose: () => void
}) {
  const [query, setQuery] = useState('')
  const toggleProject = (project: SidebarProjectId) =>
    onFilter(filter.includes(project) ? filter.filter((id) => id !== project) : [...filter, project])
  const skin = useSkin()
  const inlet = skin === 'inlet'
  const basic = skin === 'basic'
  const item = useMenuItem()
  const muted = inlet ? 'oklab(0.522445 -0.00294474 0.0182579)' : basic ? BASIC_MUTED : MUTED_GREY
  const projects = SIDEBAR_PROJECT_ORDER.filter((project) =>
    SIDEBAR_PROJECTS[project].title.toLowerCase().includes(query.trim().toLowerCase()),
  )

  return (
    <MenuShell placement={placement} anchor={anchor} width={224} label="Filter threads by project and group-by" onClose={onClose}>
      <div style={{ ...item, cursor: 'default', borderRadius: 4 }}>
        <span style={TRUNCATE}>Group by</span>
        <GroupBySwitch value={settings.grouping} onChange={(grouping) => onChange({ ...settings, grouping })} />
      </div>
      <MenuSeparator />
      <button
        type="button"
        role="menuitemcheckbox"
        aria-checked={settings.compact}
        className="n3sb-menu-item"
        onClick={() => onChange({ ...settings, compact: !settings.compact })}
        style={item}
      >
        <span style={TRUNCATE}>Compact cards</span>
        <MenuCheckbox checked={settings.compact} />
      </button>
      <MenuSeparator />
      <label style={{ display: 'block', padding: '6px 8px 4px', cursor: 'text' }}>
        <span style={{ position: 'relative', display: 'flex', height: 26, alignItems: 'center' }}>
          <Search size={16} style={{ position: 'absolute', left: 0, color: muted, pointerEvents: 'none' }} />
          <input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(event) => event.stopPropagation()}
            placeholder="Search projects"
            aria-label="Search projects"
            className="n3sb-search"
            style={{
              width: '100%',
              minWidth: 0,
              height: 26,
              padding: '0 9px 0 22px',
              border: 0,
              outline: 'none',
              background: 'transparent',
              font: 'inherit',
              fontSize: 13.125,
              lineHeight: '26px',
              color: inlet ? INLET_INK : SIDEBAR_FG,
              ['--n3sb-placeholder' as string]: muted,
            }}
          />
        </span>
      </label>
      <MenuSeparator />
      <div style={{ maxHeight: 240, overflowY: 'auto' }}>
        {query.trim() === '' && (
          <button
            type="button"
            role="menuitemcheckbox"
            aria-checked={filter.length === 0}
            className="n3sb-menu-item"
            onClick={() => onFilter([])}
            style={{ ...item, justifyContent: 'flex-start', gap: 8 }}
          >
            <MenuCheckbox checked={filter.length === 0} />
            <ScopeIcon project={null} />
            <span style={TRUNCATE}>All projects</span>
          </button>
        )}
        {projects.map((project) => (
          <button
            key={project}
            type="button"
            role="menuitemcheckbox"
            aria-checked={filter.includes(project)}
            className="n3sb-menu-item"
            onClick={() => toggleProject(project)}
            style={{ ...item, justifyContent: 'flex-start', gap: 8 }}
          >
            <MenuCheckbox checked={filter.includes(project)} />
            <ScopeIcon project={project} />
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
                color: muted,
              }}
            >
              <EllipsisVertical size={16} />
            </span>
          </button>
        ))}
        {projects.length === 0 && (
          <div style={{ padding: '6px 8px', fontSize: 13.125, lineHeight: '18.75px', color: muted }}>No projects match</div>
        )}
      </div>
    </MenuShell>
  )
}

/** The Petals picker's sketches (the app's PetalLayoutPicker): a tile beside a name line, three times;
    and tiles over their names, three across and two down. */
function ListSketch() {
  return (
    <svg aria-hidden width={64} height={40} viewBox="0 0 64 40" style={{ display: 'block' }}>
      {[5, 16, 27].map((y) => (
        <g key={y}>
          <rect x={8} y={y} width={8} height={8} rx={2} fill="currentColor" opacity={0.5} />
          <rect x={20} y={y + 2} width={34} height={4} rx={2} fill="currentColor" opacity={0.28} />
        </g>
      ))}
    </svg>
  )
}

function GridSketch() {
  return (
    <svg aria-hidden width={64} height={40} viewBox="0 0 64 40" style={{ display: 'block' }}>
      {[4, 22].flatMap((y) =>
        [10, 27, 44].map((x) => (
          <g key={`${x}-${y}`}>
            <rect x={x} y={y} width={10} height={10} rx={2.5} fill="currentColor" opacity={0.5} />
            <rect x={x + 1} y={y + 12} width={8} height={2} rx={1} fill="currentColor" opacity={0.28} />
          </g>
        )),
      )}
    </svg>
  )
}

/** The Petals row's View options: List or Grid, each drawn in miniature, and Compact cards under them
    while the layout is List. */
function PetalMenu({
  placement,
  anchor,
  settings,
  onChange,
  onClose,
}: {
  placement: MenuPlacement
  anchor: HTMLElement | null
  settings: SidebarSettings
  onChange: (settings: SidebarSettings) => void
  onClose: () => void
}) {
  const skin = useSkin()
  const inlet = skin === 'inlet'
  const item = useMenuItem()
  const options = [
    { value: 'list', label: 'List', Sketch: ListSketch },
    { value: 'grid', label: 'Grid', Sketch: GridSketch },
  ] as const
  return (
    <MenuShell placement={placement} anchor={anchor} width={192} label="Petal view options" onClose={onClose}>
      <div role="radiogroup" aria-label="Petal layout" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, padding: 6 }}>
        {options.map((option) => {
          const on = settings.petals === option.value
          return (
            <button
              key={option.value}
              type="button"
              role="menuitemradio"
              aria-checked={on}
              className="n3sb-menu-item n3sb-layout-option"
              onClick={() => onChange({ ...settings, petals: option.value })}
              style={{
                ...ICON_BUTTON,
                flexDirection: 'column',
                gap: 6,
                padding: '8px 4px 6px',
                boxSizing: 'border-box',
                borderRadius: 6,
                border: `1px solid ${on ? (inlet ? INLET_INK : '#ffffff') : inlet ? INLET_RULE : 'color(srgb 1 1 1 / 0.08)'}`,
                fontSize: 11.25,
                lineHeight: '15px',
                fontWeight: 500,
                color: on ? (inlet ? INLET_INK : FG) : inlet ? 'oklab(0.522445 -0.00294474 0.0182579)' : MUTED_GREY,
                outline: 'none',
              }}
            >
              <option.Sketch />
              {option.label}
            </button>
          )
        })}
      </div>
      {settings.petals === 'list' && (
        <>
          <MenuSeparator tight />
          <button
            type="button"
            role="menuitemcheckbox"
            aria-checked={settings.compactPetals}
            className="n3sb-menu-item"
            onClick={() => onChange({ ...settings, compactPetals: !settings.compactPetals })}
            style={item}
          >
            <span style={TRUNCATE}>Compact cards</span>
            <MenuCheckbox checked={settings.compactPetals} />
          </button>
        </>
      )}
    </MenuShell>
  )
}

// ── Hover card ──────────────────────────────────────────────────────────────

const HOVER_DELAY = 150

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
  const skin = useSkin()
  const inlet = skin === 'inlet'
  const basic = skin === 'basic'
  const flat = skin === 'glass'
  // Inlet's hover card is the row's hover fill, opaque, with its own text and muted channel;
  // Basic's is its solid popup surface, Flat Glass's its palette's popover colour.
  const tipFg = inlet ? INLET_TIP_FG : FG
  const tipMuted = inlet ? INLET_TIP_MUTED : basic ? BASIC_MUTED : MUTED_GREY
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
        // Flat Glass's hover card is opaque (Nov 25 2026): the palette's popover colour, 6 corners and
        // the popups' 12% hairline, its text at the 15px interface's text-xs.
        borderRadius: inlet ? 10 : 6,
        border: inlet ? '1px solid transparent' : basic ? '1px solid rgba(255, 255, 255, 0.08)' : FLAT_POPUP_BORDER,
        boxShadow: inlet ? undefined : basic ? BASIC_POPUP_SHADOW : 'rgba(0, 0, 0, 0.25) 0px 2px 16px 0px',
        background: inlet ? INLET_TIP_FILL : basic ? BASIC_POPUP : FLAT_TIP_FILL,
        pointerEvents: 'none',
        fontSize: flat ? 11.25 : 12,
        lineHeight: flat ? '15.47px' : '16.5px',
        color: tipFg,
      }}
    >
      <div style={{ position: 'relative', padding: '4px 8px' }}>
        <div style={{ display: 'flex', maxWidth: 320 - 18, minWidth: 0, flexDirection: 'column', gap: 8, padding: '8px 4px' }}>
          <div style={{ ...TRUNCATE, fontWeight: 500, lineHeight: flat ? '14.06px' : '15px', color: tipFg }}>{thread.title}</div>
          <div style={{ display: 'grid', gap: 6, paddingLeft: 2, lineHeight: flat ? '15px' : '16px', color: tipMuted }}>
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
                color: tipMuted,
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

/* The app's rows since Nov 2026: Pull requests moved up from the footer, Add a project down to
   the section headers. */
const CHROME_ROWS: { label: string; icon: ReactNode }[] = [
  { label: 'Search', icon: <Search size={16} /> },
  { label: 'New agent', icon: <NavigationArrow size={16} /> },
  { label: 'Usage', icon: <ChartDonut size={16} /> },
  { label: 'Automations', icon: <Zap size={16} /> },
  { label: 'Pull requests', icon: <GitPullRequest size={16} /> },
]

/** The macOS window controls: macOS 27's under Flat Glass (centres 27.75 / 50.75 / 73.75, 7 round,
    as the renders draw them), the collage's older 6-round set on the toggle's row otherwise. */
function TrafficLights({ cy = 26, macos27 = false }: { cy?: number; macos27?: boolean }) {
  const lights: [string, number][] = macos27
    ? [
        ['#ff5f57', 27.75],
        ['#febc2e', 50.75],
        ['#28c840', 73.75],
      ]
    : [
        ['#ff5f57', 28],
        ['#febc2e', 48],
        ['#28c840', 68],
      ]
  const r = macos27 ? 7 : 6
  return (
    <svg
      aria-hidden
      viewBox={`0 0 90 ${cy * 2}`}
      width={90}
      height={cy * 2}
      style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible', pointerEvents: 'none' }}
    >
      {lights.map(([fill, cx]) => (
        <g key={fill}>
          <circle cx={cx} cy={cy} r={r} fill={fill} />
          <circle cx={cx} cy={cy} r={r - 0.25} fill="none" stroke="rgba(0,0,0,.18)" strokeWidth={0.5} />
        </g>
      ))}
    </svg>
  )
}

/** The top bar's Code / Chat switch (the app's sidebar mode): Code is the one this sidebar is. Inert. */
function ModeSwitch() {
  return (
    <div
      aria-label="Sidebar mode"
      role="radiogroup"
      style={{ display: 'flex', flexShrink: 0, alignItems: 'center', padding: 2, borderRadius: 8, background: 'rgba(255, 255, 255, 0.08)' }}
    >
      {[
        { label: 'Code', icon: <Code size={16} />, on: true },
        { label: 'Chat', icon: <MessageSquareText size={16} />, on: false },
      ].map((option) => (
        <button
          key={option.label}
          type="button"
          role="radio"
          aria-checked={option.on}
          aria-label={option.label}
          className="n3sb-segment"
          style={{
            ...ICON_BUTTON,
            width: 28,
            height: 28,
            boxSizing: 'border-box',
            borderRadius: 6,
            border: `1px solid ${option.on ? 'rgba(255, 255, 255, 0.08)' : 'transparent'}`,
            background: option.on ? 'rgba(255, 255, 255, 0.12)' : 'transparent',
            color: '#e8e8e8',
          }}
        >
          {option.icon}
        </button>
      ))}
    </div>
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
    for (const bot of SIDEBAR_BOTS) {
      if (bot.workingFor !== undefined) starts.set(bot.id, now - bot.workingFor * 60_000 - 20_000)
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

/** An open menu: which one, where, and the button it hangs from (a section header's gear, the Threads
    row's, or the Petals row's View options). */
type OpenMenu = MenuPlacement & { kind: 'filter' | 'petals'; button: HTMLButtonElement; gear: { left: number; top: number; bottom: number } }

/** The menus' heights, for flipping one above its button when the panel has no room under it. */
const FILTER_MENU_HEIGHT = 8 + 32 + 17 + 32 + 17 + 36 + 17 + 32 * (1 + SIDEBAR_PROJECT_ORDER.length) + 2
const PETAL_MENU_HEIGHT = 8 + 89 + 9 + 32 + 2

function SidebarPanel({ settings, onSettingsChange, width, height, hoverCards, overlay }: SidebarPanelProps) {
  const [active, setActive] = useState(SIDEBAR_INITIAL_ACTIVE)
  const skin = useSkin()
  const inlet = skin === 'inlet'
  const basic = skin === 'basic'
  const flat = skin === 'glass'
  // Flat Glass's bar is 44 (Basic's always was); Inlet keeps its older 52 until it's re-read.
  const topbar = inlet ? TOPBAR : BASIC_TOPBAR
  const windowRadius = flat ? FLAT_WINDOW_RADIUS : WINDOW_RADIUS
  const [menu, setMenu] = useState<OpenMenu | null>(null)
  const [filter, setFilter] = useState<ProjectFilter>([])
  const [collapsedProjects, setCollapsedProjects] = useState<Set<SidebarProjectId>>(new Set())
  const [collapsedSections, setCollapsedSections] = useState<Set<SidebarStatusSection>>(new Set())
  const [tip, setTip] = useState<{ id: string; anchor: TipAnchor } | null>(null)
  // The Petals gear pulses until a menu is first opened, to say the panel's own settings are live.
  const [nudge, setNudge] = useState(true)
  const [scroll, setScroll] = useState({ top: false, bottom: true })
  const starts = useStartTimes()
  const panelRef = useRef<HTMLDivElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const hoverTimer = useRef<number | undefined>(undefined)
  const petalsRef = useRef<HTMLButtonElement>(null)

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
  useLayoutEffect(updateFades, [updateFades, items, height, settings.petals, settings.compactPetals])

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
  const toggleMenu = (kind: OpenMenu['kind'], button: HTMLButtonElement | null) => {
    const panel = panelRef.current
    if (!button || !panel || (menu && menu.button === button)) {
      setMenu(null)
      return
    }
    setNudge(false)
    const g = button.getBoundingClientRect()
    const p = panel.getBoundingClientRect()
    const right = p.right - g.right
    const gear = { left: g.left - p.left, top: g.top - p.top, bottom: g.bottom - p.top }
    const menuHeight = kind === 'filter' ? FILTER_MENU_HEIGHT : PETAL_MENU_HEIGHT
    // Inlet hangs it flush off the button; the others drop it 4 under (align "end", offset 4).
    const gap = inlet ? 0 : 4
    if (p.bottom - g.bottom >= menuHeight + gap + 8 || g.top - p.top < menuHeight + gap + 8) {
      setMenu({ kind, button, gear, top: g.bottom - p.top + gap, right, hang: 'below' })
    } else {
      setMenu({ kind, button, gear, bottom: p.bottom - g.top + gap, right, hang: 'above' })
    }
  }
  const onGear = (button: HTMLButtonElement) => toggleMenu('filter', button)

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
  const filterOpen = menu?.kind === 'filter'

  return (
    <>
      <div
        ref={panelRef}
        style={{
          position: 'relative',
          width: width + (inlet ? INLET_STRIP : 0),
          height,
          borderRadius: windowRadius,
          boxShadow: WINDOW_SHADOW,
          fontFamily: '"Geist Variable", Geist, -apple-system, system-ui, sans-serif',
          // The app's interface size since the dev house look (15, Nov 2026).
          fontSize: 15,
          lineHeight: '22.5px',
          fontWeight: 400,
          color: FG,
          WebkitFontSmoothing: 'antialiased',
          textAlign: 'left',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: windowRadius,
            overflow: 'hidden',
            background: inlet ? INLET_SIDEBAR : basic ? BASIC_BASE : undefined,
            // Flat Glass: macOS's own sidebar glass, captured over the same piece the stage shows.
            backgroundImage: flat ? `url(${FLAT_PANEL})` : undefined,
            backgroundSize: flat ? '100% 100%' : undefined,
          }}
        >
          {inlet && (
            // Inlet's sidebar is solid, and the window shows the start of the cream chat panel the
            // open card bridges into.
            <div
              style={{
                position: 'absolute',
                left: width,
                top: INLET_PANEL_INSET,
                right: INLET_PANEL_INSET,
                bottom: INLET_PANEL_INSET,
                borderRadius: INLET_PANEL_RADIUS,
                background: INLET_CREAM,
              }}
            />
          )}
        </div>
        <div
          style={{
            position: 'relative',
            display: 'flex',
            width: inlet || basic ? width : undefined,
            height: '100%',
            flexDirection: 'column',
            borderRight: basic ? `1px solid ${BASIC_RULE}` : undefined,
            borderRadius: windowRadius,
          }}
        >
          {/* Top bar: the window controls' gutter, the panel toggle, back and forward, the mode switch. */}
          <div style={{ position: 'relative', display: 'flex', height: topbar, flexShrink: 0, alignItems: 'center', paddingRight: 12 }}>
            <TrafficLights cy={flat ? 21.75 : topbar / 2} macos27={flat} />
            <div style={{ display: 'flex', alignItems: 'center', paddingLeft: flat ? 85 : CONTROLS_LEFT }}>
              <button
                type="button"
                aria-label="Toggle Sidebar"
                className="n3sb-icon-button"
                style={{ ...ICON_BUTTON, width: 28, height: 28, borderRadius: 8, border: '1px solid transparent', color: QUIET_BUTTON }}
              >
                <PanelLeft size={16} style={{ color: QUIET_BUTTON }} />
              </button>
              {[
                { label: 'Go back', icon: <ArrowLeft size={14} /> },
                { label: 'Go forward', icon: <ArrowRight size={14} /> },
              ].map((item) => (
                <button
                  key={item.label}
                  type="button"
                  aria-label={item.label}
                  disabled
                  style={{ ...ICON_BUTTON, width: 28, height: 28, borderRadius: 8, opacity: 0.64, color: MUTED_GREY, cursor: 'default' }}
                >
                  {item.icon}
                </button>
              ))}
            </div>
            <span style={{ marginLeft: 'auto' }}>
              <ModeSwitch />
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
                    borderRadius: flat ? 12 : 10,
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

            <PetalsSection
              active={active}
              starts={starts}
              layout={settings.petals}
              compact={settings.compactPetals}
              optionsOpen={menu?.kind === 'petals'}
              nudge={nudge}
              optionsRef={petalsRef}
              onOptions={() => toggleMenu('petals', petalsRef.current)}
              onOpen={openThread}
            />

            {/* With nothing grouped, the Threads row holds the list's actions; otherwise every section's header does. */}
            {settings.grouping === 'none' && (
              <div style={{ position: 'relative', marginTop: 24, padding: '0 8px' }}>
                <div style={{ display: 'flex', height: 32, alignItems: 'center', gap: 6, padding: '0 12px' }}>
                  <span role="heading" aria-level={2} style={{ display: 'flex', flex: '1 1 0%', minWidth: 0 }}>
                    <SectionLabel label="Threads" />
                  </span>
                  <div style={{ position: 'relative', display: 'flex', flexShrink: 0, alignItems: 'center', marginRight: -12 }}>
                    <ListActions size={32} gearOpen={filterOpen} onGear={onGear} />
                  </div>
                </div>
              </div>
            )}

            {/* The thread list. */}
            <div
              style={{
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                marginTop: settings.grouping === 'none' ? 0 : 24,
                padding: '0 8px 4px',
              }}
            >
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
                          data-n3sb-key={item.key}
                          style={{ position: 'relative', listStyle: 'none' }}
                        >
                          <ProjectHeader
                            project={item.project}
                            first={item.first}
                            afterOpenSection={item.afterOpenSection}
                            collapsed={collapsedProjects.has(item.project)}
                            onToggle={() => toggleProject(item.project)}
                            gearOpen={filterOpen && isWithin(menu?.button, item.key)}
                            onGear={onGear}
                          />
                        </li>
                      )
                    case 'status':
                      return (
                        <li
                          key={item.key}
                          role="presentation"
                          className="n3sb-project-header"
                          data-n3sb-header=""
                          data-n3sb-key={item.key}
                          style={{ position: 'relative', listStyle: 'none' }}
                        >
                          <StatusHeader
                            label={item.label}
                            first={item.first}
                            collapsed={collapsedSections.has(item.section)}
                            onToggle={() => toggleSection(item.section)}
                            gearOpen={filterOpen && isWithin(menu?.button, item.key)}
                            onGear={onGear}
                          />
                        </li>
                      )
                    case 'card':
                      return (
                        <li
                          key={item.key}
                          data-n3sb-section={item.underProject || item.section ? '' : undefined}
                          style={{ position: 'relative', listStyle: 'none' }}
                        >
                          {card(item.thread, item.section, item.underProject)}
                        </li>
                      )
                  }
                })}
                <li key="shelf:settled" style={{ listStyle: 'none' }}>
                  {settings.grouping === 'status' ? (
                    <StatusHeader label="Settled" first={false} collapsed onToggle={() => {}} />
                  ) : (
                    <Shelf label="Settled" count={SIDEBAR_SHELVES.settled} tone="settled" />
                  )}
                </li>
              </ul>
            </div>
          </div>

          {/* Footer: Settings, Issues and Music, and the update button on the right. */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '4px 8px 8px', flexShrink: 0 }}>
            {[
              { label: 'Settings', icon: <Settings size={16} /> },
              { label: 'Issues', icon: <CircleDot size={16} /> },
              { label: 'Music', icon: <Music size={16} /> },
            ].map((item) => (
              <button
                key={item.label}
                type="button"
                aria-label={item.label}
                className="n3sb-icon-button"
                style={{ ...ICON_BUTTON, width: 32, height: 32, borderRadius: 8, fontWeight: 500, color: QUIET_ICON }}
              >
                {item.icon}
              </button>
            ))}
            <button
              type="button"
              aria-label="Check for updates"
              className="n3sb-icon-button"
              style={{ ...ICON_BUTTON, width: 32, height: 32, marginLeft: 'auto', borderRadius: 9999, opacity: 0.6, color: QUIET_ICON }}
            >
              <RefreshCw size={16} />
            </button>
          </div>
        </div>

        {menu && inlet && (
          // The concave join where the hung menu meets its button.
          <div
            aria-hidden
            style={{
              position: 'absolute',
              left: menu.gear.left - INLET_FILLET,
              top: menu.hang === 'below' ? menu.gear.bottom - INLET_FILLET : menu.gear.top,
              width: INLET_FILLET,
              height: INLET_FILLET,
              zIndex: 30,
              pointerEvents: 'none',
              background: `radial-gradient(circle at ${menu.hang === 'below' ? '0 0' : '0 100%'}, transparent ${INLET_FILLET - 0.5}px, ${INLET_CREAM} ${INLET_FILLET + 0.5}px)`,
            }}
          />
        )}
        {menu?.kind === 'filter' && (
          <GearMenu
            placement={menu}
            anchor={menu.button}
            settings={settings}
            onChange={onSettingsChange}
            filter={filter}
            onFilter={setFilter}
            onClose={closeMenu}
          />
        )}
        {menu?.kind === 'petals' && (
          <PetalMenu placement={menu} anchor={menu.button} settings={settings} onChange={onSettingsChange} onClose={closeMenu} />
        )}

        <div aria-hidden style={{ position: 'absolute', inset: 0, borderRadius: windowRadius, boxShadow: WINDOW_RING, pointerEvents: 'none' }} />
      </div>

      {tip && tipThread && overlay.current && <TipPortal target={overlay.current} thread={tipThread} anchor={tip.anchor} />}
    </>
  )
}

/** Whether a menu's button sits under the list item with this key (so its header holds its actions open). */
function isWithin(button: HTMLElement | undefined, key: string) {
  return !!button?.closest(`[data-n3sb-key="${key}"]`)
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
  const [settings, setSettings] = useState<SidebarSettings>({ grouping: 'project', compact: false, petals: 'list', compactPetals: false })
  const [stageWidth, setStageWidth] = useState(0)
  const stageRef = useRef<HTMLDivElement>(null)
  // Flat Glass only since the page dropped its theme switch (Nov 26 2026). The Basic and Inlet skins
  // stay in the replica (SKIN_VARS) should a page want them again.
  const skin = 'glass' as Skin
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
  const strip = skin === 'inlet' ? INLET_STRIP : 0
  const panelWidth = Math.min(SIDEBAR_WIDTH, Math.max(208, stageWidth - 32 - strip))
  // Centred on the wallpaper, on whole pixels so the panel's text lands on the
  // pixel grid as it does in the app. A hover card without room beside it flips
  // under its card (`placeTip`).
  const panelLeft = Math.round((stageWidth - panelWidth - strip) / 2)
  const flat = skin === 'glass'
  const wallAspect = flat ? FLAT_WALL_ASPECT : WALL_ASPECT
  const wallWidth = Math.max(stageWidth, stageHeight * wallAspect) * WALL_ZOOM
  const wallHeight = wallWidth / wallAspect

  const isOn = (option: SidebarPlaygroundOption) =>
    option.compact ? settings.compact : option.petals ? option.petals === settings.petals : option.grouping === settings.grouping
  const choose = (option: SidebarPlaygroundOption) =>
    setSettings((current) =>
      option.compact
        ? { ...current, compact: !current.compact }
        : option.petals
          ? { ...current, petals: option.petals }
          : { ...current, grouping: option.grouping ?? current.grouping },
    )

  const stage = (
    <div
      ref={stageRef}
      data-theme="dark"
      data-n3sb-skin={skin}
      style={{ ...skinStyle(skin), position: 'relative', height: stageHeight, borderRadius: radius, overflow: 'hidden', isolation: 'isolate' }}
    >
      <div
        aria-hidden
        style={{
          position: 'absolute',
          left: (stageWidth - wallWidth) / 2,
          top: (stageHeight - wallHeight) / 2,
          width: wallWidth,
          height: wallHeight,
          backgroundImage: `url(${flat ? FLAT_WALLPAPER : TEXTURE_BACKDROP})`,
          backgroundSize: '100% 100%',
          // The Jolly Petal piece is one pixel a dither square: scaled nearest, so the squares stay whole.
          imageRendering: flat ? 'pixelated' : undefined,
        }}
      />
      {stageWidth > 0 && (
        <SkinContext.Provider value={skin}>
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
        </SkinContext.Provider>
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
