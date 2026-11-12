import { lazy, Suspense, useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore } from 'react'
import '@noey-17/yearn-ui/style.css'
import Hero from './components/Hero'
import HomeRail from './components/HomeRail'
import IntroSplash from './components/IntroSplash'
import LogoWatermark from './components/LogoWatermark'
import ScrollHint from './components/ScrollHint'
import { introConfigFromUrl, markIntroSeen, shouldPlayIntro } from './intro'
import { readHomeTab, writeHomeTab, type HomeTab } from './homeTab'
import HomeProjects from './components/HomeProjects'
import ContactButtons, { CalmButton } from './components/ContactButtons'
import ShaderPanel from './components/ShaderPanel'
import {
  LEAF_PANEL_HEIGHT_VH,
  LEAF_STRIP_MAX,
  LEAF_TIP_INSET,
  LEAF_W,
  SHIFT_EASE,
  SHIFT_MS,
} from './components/LeafPattern'
import { DesigningNow, LlmQuotes, PreviousRoles } from './components/Experience'
import ContactPanel from './components/ContactPanel'
import { HomeTexture } from './components/PixelTexture'
import D2Conflux from './components/D2Conflux'
import InvisibleApply from './components/InvisibleApply'
import InvisibleOnboarding from './components/InvisibleOnboarding'
import InvisibleSynapse from './components/InvisibleSynapse'
import ProjectLanding from './components/ProjectLanding'
import ProjectStory from './components/ProjectStory'
import ThinkingStates from './components/ThinkingStates'
import BrandGuidelines from './components/BrandGuidelines'
import { projects } from './data/projects'
import { useHomePrototype } from './hooks/useHomePrototype'
import { useIsMobile } from './hooks/useIsMobile'
import { useMediaQuery } from './hooks/useMediaQuery'
import { getRoute, navigate, subscribeToRoute } from './navigation'
import { HOME_TEXTURE, HOME_WORDMARK, pageGutter, RAIL_SPINE, TABLET_MAX } from './layout'

const BG = 'var(--color-bg-primary)'

/**
 * The Texture tab's playground, a reference kept off the published site: only
 * the dev server imports it (the rail lists the tab only there too), so a
 * production build drops the import and the module with it.
 */
const TexturePlayground = import.meta.env.DEV ? lazy(() => import('./components/TexturePlayground')) : null

/**
 * The dark fill over the content column. Stops short of its own right edge so
 * the leaf tips peek past the column as a jagged edge rather than a square cut.
 */
/** The Hi tab's corner logo (`LogoWatermark`). */
const WATERMARK_WIDTH = '72vw'
const WATERMARK_RIGHT = 32
const WATERMARK_OPACITY = 0.08
/**
 * The home texture's box stops this far short of the copy's right edge: its
 * line reaches the box's whole width, so running it under the copy (120, at
 * first, behind a fade) would put tiles behind the text.
 */
const TEXTURE_COPY_GAP = 32
/**
 * With the wordmark on, the texture's box is Hi's whole scroller, and the Edge
 * keeps to the strip it had on its own: from the box's right edge to
 * `TEXTURE_COPY_GAP` short of the copy, which is centred on the box (the
 * scroller spans the dark area the panel centres on). Module scope, so its
 * identity holds and the grid doesn't rebuild on every render.
 */
const homeEdgeWidth = (boxWidth: number, boxHeight: number) =>
  Math.max(
    TEXTURE_MIN_WIDTH,
    Math.min(boxWidth / 2 - COPY_MAX / 2 - TEXTURE_COPY_GAP, boxHeight * TEXTURE_ASPECT_MAX),
  )
/**
 * The widest the Edge's strip runs, as a share of its height. The Landing line
 * was drawn for a tall, narrow strip (about 0.41 on a laptop); on a big screen
 * the room right of the copy grows faster than the height, which stretched its
 * lobes into sharp peaks (Nov 11 2026), so past this it stays the laptop's
 * shape and sits further right instead.
 */
const TEXTURE_ASPECT_MAX = 0.42
/** Prototype B's upright wordmark sits this far in from the window's right edge. */
const UPRIGHT_INSET = 40
/** The pause button's distance below a tab's copy. */
const CALM_GAP = 64
/** Below this the box would be a sliver beside the copy; it holds here and slides under the copy's edge. */
const TEXTURE_MIN_WIDTH = 240
const SCROLL_HINT_BOTTOM = 32

const COLUMN_FILL = `linear-gradient(to right, ${BG} 0%, ${BG} calc(100% - ${LEAF_TIP_INSET}px), transparent calc(100% - ${LEAF_TIP_INSET}px))`

/**
 * Percentage of the viewport the content column takes, and the panel's width
 * cap (Figma frame `320:30803`). The percentage sits a touch past the
 * content's edge so the leaf tips peek from under the column rather than
 * crowding the copy. (The Work tab's wider 84.4 / 937 column went with the
 * tab on this branch.)
 */
const CONTENT_PCT = 70
/**
 * The copy's measure, and the panel's: the panel runs wider so Hi's project
 * thumbnails can break out past the copy, and every tab's copy sits centred
 * on the copy measure inside it — so on a tab without thumbnails the text
 * lands where a 700 panel would.
 *
 * The panel is 1000 until 60% of the dark area passes that (~1715), then
 * grows with the screen — ~1120 at 1920, ~1290 at 2200 — to `PANEL_CAP` at
 * ~2380. The cap is where the 1810 card exports would start to read soft on
 * a 2x screen. The thumbnails are its full width; the copy stays 700.
 */
const COPY_MAX = 700
const PANEL_MIN = 1000
const PANEL_CAP = 1400
const PANEL_GROWTH = 0.6
const PANEL_MAX = `clamp(${PANEL_MIN}px, (100vw - ${RAIL_SPINE}px) * ${PANEL_GROWTH}, ${PANEL_CAP}px)`
/**
 * Extra column width below `TABLET_MAX`, so the leaf strip yields space to
 * the copy instead of holding a 70/30 split on a ~1100px screen. Zero at
 * tablet and up, so the 1512 frame does not move.
 */
const THIN_GROW = 0.37

const contentWidth = (pct: number) =>
  `calc(${pct}vw + max(0px, (${TABLET_MAX}px - 100vw) * ${THIN_GROW}))`

/**
 * Breathing room each side of the scrolling panel, as padding paid back by an
 * equal negative margin — the content box stays exactly `panelWidth` wide and
 * lands where it always did, but the scroller's own box reaches past it.
 *
 * A scroll container clips, and the Work cards run flush to the panel's edges:
 * their hover lift would be cut off in a hard line along any side they grow
 * past. The slack it borrows is empty — the rail's 56px gap on the left, the
 * same 56 above the panel, the page gutter on the right.
 */
const SCROLL_BLEED = 40
/** The file's gap from the frame's top edge to the panel copy. */
const PANEL_TOP = 56
/** The file's 56 from the rail to the content column. */
const RAIL_GAP = 56

/**
 * A wheel notch over the rail or the leaf field scrolls the panel between them.
 *
 * The panel is the only scroller on desktop home, so anywhere outside it the
 * wheel had nothing to move — the pointer had to be inside a ~700px column for
 * the page to respond. This forwards the delta instead, and only when the event
 * didn't already land inside the panel (or any other scroller, so a nested one
 * keeps its own wheel). `passive: false` is what lets it call `preventDefault`,
 * which stops the rubber-band bounce the redirected notch would otherwise leave
 * on the window.
 */
function useWheelAnywhere(panel: React.RefObject<HTMLElement | null>, enabled: boolean) {
  useEffect(() => {
    if (!enabled) return

    const onWheel = (event: WheelEvent) => {
      const target = panel.current
      if (!target) return
      if (event.target instanceof Node && target.contains(event.target)) return

      // Firefox reports lines and (rarely) pages rather than pixels.
      const scale =
        event.deltaMode === WheelEvent.DOM_DELTA_LINE
          ? 16
          : event.deltaMode === WheelEvent.DOM_DELTA_PAGE
            ? target.clientHeight
            : 1

      event.preventDefault()
      target.scrollTop += event.deltaY * scale
    }

    window.addEventListener('wheel', onWheel, { passive: false })
    return () => window.removeEventListener('wheel', onWheel)
  }, [panel, enabled])
}

/**
 * The narrowest the leaf strip gets when it steps aside for the centred copy.
 * Below about 1450 this binds, and on the tabs with leaves the copy moves
 * left of centre rather than run into them.
 */
const LEAF_MIN = 280

/**
 * Where the panel centres: the middle of the dark area right of the rail's
 * spine — what Hi shows, with no leaves — on every tab, so hovering across the
 * rail never moves the copy sideways.
 */
const CENTRE = `((100vw + ${RAIL_SPINE}px) / 2)`

/**
 * The content row's width out to where the leaf tips start, so the leaf
 * field's left frontier is this less `LEAF_TIP_INSET`. The largest of:
 *
 * - the 70vw column the file draws;
 * - the edge that holds the strip at `LEAF_STRIP_MAX` on a big screen;
 * - room for the centred copy plus the right inset, so the leaves move right
 *   rather than crowd it — but never so far the strip drops under `LEAF_MIN`.
 *
 * Only the copy is reckoned, not the 1000 panel: the thumbnails are on Hi,
 * which has no leaves.
 */
const rowWidthFor = (rightInset: string) =>
  `max(${contentWidth(CONTENT_PCT)}, calc(100vw - ${LEAF_STRIP_MAX - LEAF_TIP_INSET}px), min(${CENTRE} + ${COPY_MAX / 2}px + ${rightInset}, calc(100vw - ${LEAF_MIN - LEAF_TIP_INSET}px)))`

/**
 * How far the leaf field slides to leave Hi: the strip's width (the viewport
 * less its left edge) plus one leaf, so every column ends up past the clip.
 */
const LEAF_HIDE_SHIFT = (leafEdge: string) => `calc(100vw - ${leafEdge} + ${LEAF_W}px)`

/**
 * The rail's right edge, in px from the viewport's left (the rail is glued to
 * it). The rail is `max-content` wide, so CSS can't know it; the panel's
 * centring below needs it to work out how far the panel can move.
 * A layout effect, so the first paint already has it.
 */
function useRailEnd(row: React.RefObject<HTMLElement | null>, enabled: boolean) {
  const [end, setEnd] = useState(0)
  useLayoutEffect(() => {
    // The rail is the row's first child.
    const rail = row.current?.firstElementChild
    if (!enabled || !rail) return
    const measure = () => setEnd(rail.getBoundingClientRect().right)
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(rail)
    return () => observer.disconnect()
  }, [row, enabled])
  return end
}

/**
 * `/work` was the Design tab before the vertical-tab home page; project Back
 * pills and old links still point at it, so it (and the retired project routes
 * behind it) lands on home — on Hi, where the projects now run.
 */
function isLegacyWorkRoute(route: string) {
  return (
    route === '/work' ||
    route === '/work/invisible' ||
    route === '/work/forge' ||
    route === '/work/phanttom'
  )
}

export default function App() {
  const route = useSyncExternalStore(subscribeToRoute, getRoute)
  const isMobile = useIsMobile()
  // Hi's prototype (the switch is dev-only; production runs B): B swaps the
  // Edge and wordmark for a blob that follows the pointer.
  const follow = useHomePrototype() === 'follow'
  const stillOnly = useMediaQuery('(prefers-reduced-motion: reduce)')
  const legacyWork = isLegacyWorkRoute(route)
  // There is no Work tab on this branch: the projects run under Hi's copy, so
  // the legacy `/work` routes land on Hi.
  const [tab, setTab] = useState<HomeTab>(() => (legacyWork ? 'me' : readHomeTab()))
  // The logo intro plays once, on a first visit that lands on home — a cold
  // link to a project page goes straight to it, and a legacy `/work` redirect
  // is someone coming Back. Reduced motion skips it outright.
  const [intro, setIntro] = useState(() => route === '/' && !stillOnly && shouldPlayIntro())

  // Marked in an effect rather than the initializer, which StrictMode runs
  // twice — the second run would read its own mark and skip the intro.
  useEffect(() => {
    if (intro) markIntroSeen()
  }, [intro])

  const [introConfig] = useState(introConfigFromUrl)

  // Dev only: Shift+I replays the intro over the page as it stands, so a
  // variant can be watched again without a reload. While it is playing the
  // same press is just a key, which skips it.
  useEffect(() => {
    if (!import.meta.env.DEV) return
    const onKey = (event: KeyboardEvent) => {
      if (event.shiftKey && event.code === 'KeyI') setIntro(true)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // Landing on a legacy work route mid-session (a project page's Back pill)
  // flips the tab during render, so the redirected-to home never paints the
  // previous tab first. The initializer covers a cold load on `/work`.
  const panelRef = useRef<HTMLElement | null>(null)
  const rowRef = useRef<HTMLDivElement | null>(null)

  const [prevRoute, setPrevRoute] = useState(route)
  if (route !== prevRoute) {
    setPrevRoute(route)
    if (legacyWork) setTab('me')
  }

  const selectTab = (next: HomeTab) => {
    setTab(next)
    writeHomeTab(next)
    // The panels replace each other wholesale, so a switch made while scrolled
    // deep in Hi's projects or Previous roles starts the next tab at its top.
    window.scrollTo({ top: 0 })
  }

  // Home only: project routes scroll the window and have no panel to redirect
  // into, and mobile keeps the ordinary page scroll.
  useWheelAnywhere(panelRef, !isMobile && !route.startsWith('/work/'))
  const railEnd = useRailEnd(rowRef, !isMobile && !route.startsWith('/work/'))

  useEffect(() => {
    if (legacyWork) {
      writeHomeTab('me')
      navigate('/', { replace: true })
      return
    }
    window.scrollTo({ top: 0 })
  }, [route, legacyWork])

  if (route === '/work/invisible/onboarding') {
    return <InvisibleOnboarding />
  }

  if (route === '/work/invisible/synapse') {
    return <InvisibleSynapse />
  }

  if (route === '/work/invisible/apply') {
    return <InvisibleApply />
  }

  // D2 Conflux wears the app's own skin rather than the story layout.
  if (route === '/work/stat-builder') {
    return <D2Conflux />
  }

  // Hand-built around its live chips; it has no `projects` entry.
  if (route === '/work/thinking-states') {
    return <ThinkingStates />
  }

  // The brand guidelines, laid out as interlocking surfaces; no `projects` entry either.
  if (route === '/work/noey-brand') {
    return <BrandGuidelines />
  }

  // Routes are pathnames like '/work/no3y-code'.
  const project = route.startsWith('/work/')
    ? projects[route.slice('/work/'.length)]
    : undefined

  if (project) {
    // Projects with a `landing` get the screenshot-led page; the rest fall back
    // to the generic stats/stack/status layout.
    const page = project.landing ? (
      <ProjectStory project={project} />
    ) : (
      <ProjectLanding project={project} />
    )

    return page
  }

  // Everything else is the home page: the vertical tab rail beside whichever
  // panel the hovered tab shows (Figma section `321:38613`).
  // One shared left edge with the project pages (see `layout.ts`). The right
  // side stays on the plain gutter — the shared inset is centred against the
  // viewport, and mirroring it inside a column narrower than the viewport
  // would eat the content's width instead.
  // 120 at tablet and up; on a thin desktop it gives up space so the copy
  // is not left on a ~340px measure beside a third of the viewport of leaves.
  const rightInset = isMobile
    ? '20px'
    : `max(24px, calc(${pageGutter()} - max(0px, (${TABLET_MAX}px - 100vw) * 0.24)))`
  const panelMax = PANEL_MAX
  // The left bleed takes the rail's whole gap: the copy's popovers
  // (`Popover`) open centred under a phrase and run ~48 past it each side,
  // so one near the start of a line needs that room to keep its left curve.
  const bleedLeft = RAIL_GAP
  const bleedRight = 16

  // The panel centres on the dark area right of the spine (`CENTRE`), as wide
  // as it can be while keeping 56 off the rail on both sides of that centre —
  // so on Hi the gaps either side are even all the way down to ~1100. The
  // tabs with leaves share that centre; only where the copy would run into
  // the leaves (under ~1450) does it slide left, never back past the rail.
  const rowWidth = rowWidthFor(rightInset)
  const leafEdge = `calc(${rowWidth} - ${LEAF_TIP_INSET}px)`
  const railStop = railEnd + RAIL_GAP
  const panelWidth = `max(0px, min(${panelMax}, 2 * (${CENTRE} - ${railStop}px)))`
  const centredLeft = `(${CENTRE} - ${panelWidth} / 2)`
  // The tabs with leaves show only copy, so their panel *is* the copy box: on
  // the shared centre while it clears the leaves' inset, slid left when it
  // wouldn't, and once it is back against the rail, narrowed to the room
  // before the leaves rather than run its 700 over them (~1100–1450).
  const leafLimit = `(${rowWidth} - ${rightInset})`
  const copyLeft = `max(${railStop}px, min(${CENTRE} - ${COPY_MAX / 2}px, ${leafLimit} - ${COPY_MAX}px))`
  const copyWidth = `max(0px, min(${COPY_MAX}px, ${leafLimit} - ${copyLeft}))`
  // Hi and the Texture experiment run the full centred panel with no leaves.
  const widePanel = tab === 'me' || tab === 'texture'
  const panelLeft = widePanel ? centredLeft : copyLeft
  const boxWidth = widePanel ? panelWidth : copyWidth
  // Hi's corner logo (and the ruled bento's rules) reach past the panel, so on
  // Hi the scroller spans the whole dark area — from the spine (under the rail,
  // which stays on top) to the viewport's right edge — and pads the panel back
  // onto its seat. It clips sideways, so anything narrower would cut them off.
  const spanDark = !isMobile && tab === 'me'

  // Every tab's copy holds the 700 measure, centred in the wider panel.
  const copy = (node: React.ReactNode) =>
    isMobile ? node : <div style={{ width: '100%', maxWidth: COPY_MAX, marginInline: 'auto' }}>{node}</div>
  // The tabs beside the texture end on the button that pauses it, so it's in
  // reach wherever a visitor has read to (Hi has it in its contact row).
  // Marked as content prototype B's blob keeps off, read line by line.
  const withCalm = (node: React.ReactNode) =>
    HOME_TEXTURE ? (
      <div data-texture-avoid="text" style={{ display: 'flex', flexDirection: 'column' }}>
        {node}
        <CalmButton style={{ alignSelf: 'flex-start', marginTop: CALM_GAP }} />
      </div>
    ) : (
      node
    )

  const panel =
    tab === 'design' ? (
      copy(withCalm(<DesigningNow />))
    ) : tab === 'been' ? (
      copy(withCalm(<PreviousRoles />))
    ) : tab === 'contact' ? (
      copy(withCalm(<ContactPanel />))
    ) : tab === 'lols' ? (
      copy(withCalm(<LlmQuotes />))
    ) : tab === 'texture' && TexturePlayground ? (
      <Suspense fallback={null}>
        <TexturePlayground />
      </Suspense>
    ) : (
      // The Me tab: the hero copy, on the file's 32, then every project under
      // it, on the panel's full width. On desktop the copy fills at least the
      // first screen, so the projects start just past the fold.
      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        {!isMobile && HOME_TEXTURE && !follow && (
          // Against the scroller like the watermark, so it fills
          // the first screen and scrolls away with it: from the window's right
          // edge to just short of the copy's, behind everything.
          // With the wordmark it spans the whole scroller, the Edge still in
          // its strip and the word at the foot (`HOME_WORDMARK`). Prototype B
          // (`useHomePrototype`) draws its own, outside the scroller.
          <HomeTexture
            edgeWidth={HOME_WORDMARK ? homeEdgeWidth : undefined}
            wordmark={HOME_WORDMARK && 'foot'}
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              zIndex: -1,
              width: HOME_WORDMARK
                ? '100%'
                : `max(${TEXTURE_MIN_WIDTH}px, calc(100vw - ${CENTRE} - ${COPY_MAX / 2}px - ${TEXTURE_COPY_GAP}px))`,
              height: '100%',
            }}
          />
        )}
        {!isMobile && !(HOME_TEXTURE && (HOME_WORDMARK || follow)) && (
          // Placed against the scroller itself (nothing between is positioned):
          // its bottom edge is the window's at any height, and the logo still
          // scrolls away with the content. Behind the copy if a short window
          // brings the two together; over the texture, which comes first.
          <LogoWatermark
            style={{
              position: 'absolute',
              right: WATERMARK_RIGHT,
              bottom: 0,
              zIndex: -1,
              width: WATERMARK_WIDTH,
              color: 'var(--color-bg-cream)',
              opacity: WATERMARK_OPACITY,
            }}
          />
        )}
        <div style={isMobile ? undefined : { minHeight: `calc(100vh - ${PANEL_TOP}px)` }}>
          {copy(
            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
              {/* What prototype B's blob keeps off: the copy line by line, the buttons box by box. */}
              <div data-texture-avoid="text">
                <Hero />
              </div>
              <div data-texture-avoid="boxes">
                <ContactButtons />
              </div>
            </div>,
          )}
        </div>
        <div data-texture-avoid="links" style={{ marginTop: '48px' }}>
          <HomeProjects />
        </div>
      </div>
    )

  return (
    <div
      data-style="simple"
      style={{
        position: 'relative',
        // Desktop home is a fixed frame: the rail and the leaf field hold still
        // and only the panel between them scrolls, so the page itself is exactly
        // one viewport and never scrolls. Mobile keeps the ordinary page scroll —
        // there is no leaf field beside the content to hold still for.
        minHeight: '100vh',
        height: isMobile ? undefined : '100vh',
        background: BG,
        // The leaf panel is absolutely positioned at 260vh. A short panel (Me,
        // LOLs) leaves the document shorter than that, and the abs panel's
        // overflow would pad it with empty scroll. Clip to in-flow content.
        overflow: 'hidden',
      }}
    >
      {/*
        Leaf field hangs in the top-right and runs past the fold, thinning out
        until it's gone — page scrolls over the same dark shell underneath.
        Pinned at `LEAF_STRIP_MAX` on a big screen so extra width moves the
        field right rather than revealing more of it.

        Hi has no leaves: the field slides off the right edge there and back
        in on the other tabs, on `LeafPattern`'s tab-switch wave (the one the
        Work tab's wider column used to push it aside with). The shift is the
        strip's own width plus a leaf, so even the leftmost column clears the
        clip. The panel keeps the seat the field gives it on every tab, so
        hovering across the rail never moves the copy.
      */}
      {/*
        With the texture on (`HOME_TEXTURE`, Nov 11 2026) it takes the leaf
        field's place on the other tabs: the same strip, from just past the
        copy's column to the window's right edge, the window's height, holding
        still while the panel scrolls, as the field did. Hi carries its own,
        in its scroller. It stays mounted across the leafy tabs, so switching
        between them doesn't rebuild it.
      */}
      {!isMobile && HOME_TEXTURE && !widePanel && !follow && (
        // How I design trades the Edge for the "no3y" wordmark stood upright,
        // the window's height (Nov 11 2026); the switch rebuilds the grid.
        <HomeTexture
          wordmark={tab === 'design' && 'upright'}
          style={{
            position: 'absolute',
            top: 0,
            left: leafEdge,
            right: 0,
            // Sized by its two edges: the texture's wrapper is 100% wide unless told otherwise.
            width: 'auto',
            height: '100vh',
            zIndex: 0,
          }}
        />
      )}
      {/*
        Prototype B's texture (`useHomePrototype`), on every tab but the
        Texture playground: the follow blob and the "no3y" wordmark stood
        upright at the window's right edge, the window's height, on one layer
        holding still over the whole dark area while the panel scrolls under
        it, so the blob comes down the page with the pointer. Mounted across
        the tabs, so a switch doesn't rebuild it. It keeps off each tab's copy,
        Hi's buttons and project cards (`[data-texture-avoid]`), re-read as they
        scroll past or a tab swaps them, so it moves round them into the
        margins and any gap wide enough. Over the column fill (1), under the
        rail and panel (2, later in the order).
      */}
      {!isMobile && HOME_TEXTURE && follow && tab !== 'texture' && (
        <HomeTexture
          follow
          wordmark="upright"
          wordmarkInset={UPRIGHT_INSET}
          avoid="[data-texture-avoid]"
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: `calc(100vw - ${RAIL_SPINE}px)`,
            height: '100vh',
            zIndex: 2,
          }}
        />
      )}
      {!isMobile && !HOME_TEXTURE && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: leafEdge,
            right: 0,
            height: `${LEAF_PANEL_HEIGHT_VH}vh`,
            overflow: 'hidden',
            zIndex: 0,
          }}
        >
          <ShaderPanel shift={widePanel ? LEAF_HIDE_SHIFT(leafEdge) : '0px'} />
        </div>
      )}

      {/*
        The column's fill is its own layer rather than the content container's
        `background`, so its right edge can travel on the leaves' curve while
        the layout underneath still snaps. Painted on the container, the edge
        jumped the full 184px the instant a tab changed: growing, it swallowed
        the leaves before they had moved (the slide only became visible once
        they cleared the new edge), and shrinking it left a hard-edged empty
        band the leaves then walked into. On the same duration and easing as the
        leaves — and no delay, which is what the field's leftmost column also
        takes — that edge and the nearest leaf now travel together.
      */}
      {!isMobile && (
        <div
          aria-hidden
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            width: rowWidth,
            background: COLUMN_FILL,
            transition: stillOnly ? undefined : `width ${SHIFT_MS}ms ${SHIFT_EASE}`,
            pointerEvents: 'none',
            zIndex: 1,
          }}
        />
      )}

      {/* Pinned to the window, at its foot on the panel's centre. */}
      {!isMobile && tab === 'me' && (
        <ScrollHint
          scroller={panelRef}
          style={{
            position: 'absolute',
            left: `calc(${CENTRE})`,
            transform: 'translateX(-50%)',
            bottom: SCROLL_HINT_BOTTOM,
            zIndex: 3,
          }}
        />
      )}

      <div
        ref={rowRef}
        style={{
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          // The rail runs the full height of the frame; the panel beside
          // it is what scrolls.
          alignItems: isMobile ? 'flex-start' : 'stretch',
          // The file's 56 from the rail to the content column.
          gap: isMobile ? '24px' : `${RAIL_GAP}px`,
          // Sized in `vw` rather than `%` so the split geometry doesn't shift by the
          // width of the page scrollbar. `overflow-x: hidden` on the body keeps the
          // shader's overhang from adding a horizontal scrollbar.
          // The full viewport on desktop: the panel places itself (`panelLeft`),
          // and the leaves' edge is the fill layer's and the field's business.
          width: '100%',
          height: isMobile ? undefined : '100%',
          boxSizing: 'border-box',
          // The rail's spine is flush with the viewport's left edge, so the
          // shared `shellPad()` gutter no longer applies on home — the rail
          // pads its own rows 48 from the top instead.
          padding: isMobile ? '20px 20px 60px' : 0,
          // Desktop's fill is the animated mask layer above; mobile has no leaf
          // field beside it and paints its own.
          background: isMobile ? BG : undefined,
        }}
      >
        {/* The rail stays mounted across tab switches so only the panel below
            re-runs the content entrance. */}
        <HomeRail
          active={tab}
          onSelect={selectTab}
          isMobile={isMobile}
        />
        <main
          key={tab}
          ref={panelRef}
          className={isMobile ? 'tab-content-in' : 'tab-content-in panel-scroll'}
          style={{
            flex: isMobile ? undefined : '0 0 auto',
            position: 'relative',
            zIndex: 0,
            width: isMobile
              ? '100%'
              : spanDark
                ? `calc(100vw - ${RAIL_SPINE}px)`
                : `calc(${boxWidth} + ${bleedLeft + bleedRight}px)`,
            maxWidth: isMobile ? `${COPY_MAX}px` : undefined,
            minWidth: 0,
            boxSizing: 'border-box',
            // The only thing on the page that scrolls. `key={tab}` remounts it,
            // so a switch already starts the next panel at its top — the
            // `window.scrollTo` calls are for the project routes now.
            // Hi's runs the window's full height (all 56 of its top inset as
            // padding), so the texture placed against it reaches the window's
            // top edge; the copy still starts at 56.
            height: isMobile ? undefined : spanDark ? '100%' : `calc(100% - ${PANEL_TOP - SCROLL_BLEED}px)`,
            overflowY: isMobile ? undefined : 'auto',
            // The other axis can't stay `visible` on a scroll container, so it
            // is pinned rather than left to flash a scrollbar when a hover lift
            // scales a card past the edge. `SCROLL_BLEED` is what keeps that
            // overhang inside the box in the first place.
            overflowX: isMobile ? undefined : 'hidden',
            padding: isMobile
              ? undefined
              : spanDark
                ? `${PANEL_TOP}px calc(100vw - ${panelLeft} - ${panelWidth}) 80px calc(${panelLeft} - ${RAIL_SPINE}px)`
                : `${SCROLL_BLEED}px ${bleedRight}px 80px ${bleedLeft}px`,
            // The file's 56 above the panel: `SCROLL_BLEED` of it is padding
            // inside the scroller so a first-row hover lift isn't clipped, and
            // the rest stays as margin so the copy still starts at 56 (on Hi,
            // all of it is padding; see `height`).
            margin: isMobile
              ? undefined
              : spanDark
                ? `0 0 0 ${RAIL_SPINE - railStop}px`
                : `${PANEL_TOP - SCROLL_BLEED}px -${bleedRight}px 0 calc(${panelLeft} - ${railStop + bleedLeft}px)`,
          }}
        >
          {panel}
        </main>
      </div>

      {intro && (
        <IntroSplash isMobile={isMobile} config={introConfig} onDone={() => setIntro(false)} />
      )}
    </div>
  )
}
