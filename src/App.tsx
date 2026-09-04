import { useEffect, useRef, useState, useSyncExternalStore } from 'react'
import '@noey-17/yearn-ui/style.css'
import { ProfileRow } from './components/Header'
import Hero from './components/Hero'
import HomeRail from './components/HomeRail'
import { readHomeTab, writeHomeTab, type HomeTab } from './homeTab'
import { readWorkFilter, writeWorkFilter, type WorkFilter } from './data/workCards'
import WorkList from './components/WorkList'
import ShaderPanel from './components/ShaderPanel'
import {
  LEAF_PANEL_HEIGHT_VH,
  LEAF_STRIP_MAX,
  LEAF_TIP_INSET,
  SHIFT_EASE,
  SHIFT_MS,
} from './components/LeafPattern'
import { DesigningNow, LlmQuotes, PreviousRoles } from './components/Experience'
import ContactPanel from './components/ContactPanel'
import InvisibleApply from './components/InvisibleApply'
import InvisibleOnboarding from './components/InvisibleOnboarding'
import InvisibleSynapse from './components/InvisibleSynapse'
import ProjectLanding from './components/ProjectLanding'
import ProjectStory from './components/ProjectStory'
import { projects } from './data/projects'
import { useIsMobile } from './hooks/useIsMobile'
import { useMediaQuery } from './hooks/useMediaQuery'
import { getRoute, navigate, subscribeToRoute } from './navigation'
import { pageGutter, TABLET_MAX } from './layout'

const BG = 'var(--color-bg-primary)'

/**
 * The dark fill over the content column. Stops short of its own right edge so
 * the leaf tips peek past the column as a jagged edge rather than a square cut.
 */
const COLUMN_FILL = `linear-gradient(to right, ${BG} 0%, ${BG} calc(100% - ${LEAF_TIP_INSET}px), transparent calc(100% - ${LEAF_TIP_INSET}px))`

/**
 * Percentage of the viewport the content column takes, and the panel's width
 * cap, per tab. Work runs a 937px two-column grid against everything else's
 * 700 (Figma frames `320:30803` / `320:30968`), so its column reaches further
 * and the leaf field starts at the file's 1268 instead of ~1050. Both
 * percentages sit a touch past the content's edge so the leaf tips peek from
 * under the column rather than crowding the copy.
 */
const CONTENT_PCT = { default: 70, work: 84.4 }
const PANEL_MAX = { default: 700, work: 937 }
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
 * equal negative margin — the content box stays exactly `PANEL_MAX` wide and
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
 * Where the leaf field's left frontier sits for a given content width — the
 * column's right edge less the tip overhang, pinned so the strip stops growing
 * past `LEAF_STRIP_MAX` on a big screen.
 */
const leafLeft = (pct: number) =>
  `max(calc(${contentWidth(pct)} - ${LEAF_TIP_INSET}px), calc(100vw - ${LEAF_STRIP_MAX}px))`

/**
 * The Work tab pushes the field right by the extra width its column takes. The
 * panel stays hung at the default tab's edge and this is handed to the leaves
 * as a `transform`, so the field's own width never changes and the switch can
 * animate — see `LeafPattern`'s `shift`. Past ~1660px both expressions clamp to
 * the same pinned edge and this resolves to 0, which is the field already
 * holding still between tabs up there.
 */
const LEAF_WORK_SHIFT = `calc(${leafLeft(CONTENT_PCT.work)} - ${leafLeft(CONTENT_PCT.default)})`

/**
 * `/work` was the Design tab before the vertical-tab home page; project Back
 * pills and old links still point at it, so it (and the retired project routes
 * behind it) lands on home with the Work tab active.
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
  const stillOnly = useMediaQuery('(prefers-reduced-motion: reduce)')
  const legacyWork = isLegacyWorkRoute(route)
  const [tab, setTab] = useState<HomeTab>(() => (legacyWork ? 'work' : readHomeTab()))
  // The Work section, held here because the rail's Work menu and the grid both
  // read it; sessionStorage like the tab, so it survives refresh.
  const [filter, setFilter] = useState<WorkFilter>(readWorkFilter)

  // Landing on a legacy work route mid-session (a project page's Back pill)
  // flips the tab during render, so the redirected-to home never paints the
  // previous tab first. The initializer covers a cold load on `/work`.
  const panelRef = useRef<HTMLElement | null>(null)

  const [prevRoute, setPrevRoute] = useState(route)
  if (route !== prevRoute) {
    setPrevRoute(route)
    if (legacyWork) setTab('work')
  }

  const selectTab = (next: HomeTab) => {
    setTab(next)
    writeHomeTab(next)
    // The panels replace each other wholesale, so a switch made while scrolled
    // deep in Work or Previous roles starts the next tab at its top.
    window.scrollTo({ top: 0 })
  }

  const selectFilter = (next: WorkFilter) => {
    setFilter(next)
    writeWorkFilter(next)
  }

  // Home only: project routes scroll the window and have no panel to redirect
  // into, and mobile keeps the ordinary page scroll.
  useWheelAnywhere(panelRef, !isMobile && !route.startsWith('/work/'))

  useEffect(() => {
    if (legacyWork) {
      writeHomeTab('work')
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
  const panel =
    tab === 'work' ? (
      <WorkList filter={filter} onSelectFilter={selectFilter} />
    ) : tab === 'design' ? (
      <DesigningNow />
    ) : tab === 'been' ? (
      <PreviousRoles />
    ) : tab === 'contact' ? (
      <ContactPanel />
    ) : tab === 'lols' ? (
      <LlmQuotes />
    ) : (
      // The Me tab: the profile row over the hero copy, on the file's 32.
      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        <ProfileRow />
        <Hero />
      </div>
    )

  // One shared left edge with the project pages (see `layout.ts`). The right
  // side stays on the plain gutter — the shared inset is centred against the
  // viewport, and mirroring it inside a column narrower than the viewport
  // would eat the content's width instead.
  // 120 at tablet and up; on a thin desktop it gives up space so the copy
  // is not left on a ~340px measure beside a third of the viewport of leaves.
  const rightInset = isMobile
    ? '20px'
    : `max(24px, calc(${pageGutter()} - max(0px, (${TABLET_MAX}px - 100vw) * 0.24)))`
  const contentPct = tab === 'work' ? CONTENT_PCT.work : CONTENT_PCT.default
  const columnWidth = contentWidth(contentPct)
  const panelMax = tab === 'work' ? PANEL_MAX.work : PANEL_MAX.default
  const leafShift = tab === 'work' ? LEAF_WORK_SHIFT : '0px'
  // Work cards lift into this; the other tabs have no hover overhang, so a
  // thinner bleed on them hands the squeezed column back to the copy.
  const sideBleed = tab === 'work' ? SCROLL_BLEED : 16

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

        The panel is hung at the *default* tab's edge on every tab; Work's
        wider column moves the leaves inside it instead (`leafShift`), so the
        slide animates and the field is never rebuilt mid-transition. What it
        pushes off the right is clipped, and the column's own fill covers the
        band it vacates on the left.
      */}
      {!isMobile && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: leafLeft(CONTENT_PCT.default),
          right: 0,
          height: `${LEAF_PANEL_HEIGHT_VH}vh`,
          overflow: 'hidden',
          zIndex: 0,
        }}>
          <ShaderPanel shift={leafShift} />
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
            width: columnWidth,
            background: COLUMN_FILL,
            transition: stillOnly ? undefined : `width ${SHIFT_MS}ms ${SHIFT_EASE}`,
            pointerEvents: 'none',
            zIndex: 1,
          }}
        />
      )}

      <div
        style={{
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          // The rail runs the full height of the frame; the panel beside
          // it is what scrolls.
          alignItems: isMobile ? 'flex-start' : 'stretch',
          // The file's 56 from the rail to the content column.
          gap: isMobile ? '24px' : '56px',
          // Sized in `vw` rather than `%` so the split geometry doesn't shift by the
          // width of the page scrollbar. `overflow-x: hidden` on the body keeps the
          // shader's overhang from adding a horizontal scrollbar.
          width: isMobile ? '100%' : columnWidth,
          height: isMobile ? undefined : '100%',
          boxSizing: 'border-box',
          // The rail's spine is flush with the viewport's left edge, so the
          // shared `shellPad()` gutter no longer applies on home — the rail
          // pads its own rows 48 from the top instead.
          padding: isMobile ? '20px 20px 60px' : `0 ${rightInset} 0 0`,
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
          filter={filter}
          onSelectFilter={selectFilter}
          isMobile={isMobile}
        />
        <main
          key={tab}
          ref={panelRef}
          className={isMobile ? 'tab-content-in' : 'tab-content-in panel-scroll'}
          style={{
            flex: isMobile ? undefined : `0 1 ${panelMax + sideBleed * 2}px`,
            width: isMobile ? '100%' : undefined,
            maxWidth: isMobile ? `${panelMax}px` : `${panelMax + sideBleed * 2}px`,
            minWidth: 0,
            boxSizing: 'border-box',
            // The only thing on the page that scrolls. `key={tab}` remounts it,
            // so a switch already starts the next panel at its top — the
            // `window.scrollTo` calls are for the project routes now.
            height: isMobile ? undefined : `calc(100% - ${PANEL_TOP - SCROLL_BLEED}px)`,
            overflowY: isMobile ? undefined : 'auto',
            // The other axis can't stay `visible` on a scroll container, so it
            // is pinned rather than left to flash a scrollbar when a hover lift
            // scales a card past the edge. `SCROLL_BLEED` is what keeps that
            // overhang inside the box in the first place.
            overflowX: isMobile ? undefined : 'hidden',
            padding: isMobile ? undefined : `${SCROLL_BLEED}px ${sideBleed}px 80px`,
            // The file's 56 above the panel: `SCROLL_BLEED` of it is padding
            // inside the scroller so a first-row hover lift isn't clipped, and
            // the rest stays as margin so the copy still starts at 56.
            margin: isMobile ? undefined : `${PANEL_TOP - SCROLL_BLEED}px -${sideBleed}px 0`,
          }}
        >
          {panel}
        </main>
      </div>
    </div>
  )
}
