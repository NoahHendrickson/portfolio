import { useEffect, useState, useSyncExternalStore } from 'react'
import '@noey-17/yearn-ui/style.css'
import { ProfileRow } from './components/Header'
import Hero from './components/Hero'
import HomeRail from './components/HomeRail'
import { readHomeTab, writeHomeTab, type HomeTab } from './homeTab'
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
import InvisibleOnboarding from './components/InvisibleOnboarding'
import InvisibleSynapse from './components/InvisibleSynapse'
import ProjectLanding from './components/ProjectLanding'
import ProjectStory from './components/ProjectStory'
import { projects } from './data/projects'
import { useIsMobile } from './hooks/useIsMobile'
import { useMediaQuery } from './hooks/useMediaQuery'
import { getRoute, navigate, subscribeToRoute } from './navigation'
import { pageGutter, shellPad } from './layout'

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
 * Breathing room each side of the scrolling panel, as padding paid back by an
 * equal negative margin — the content box stays exactly `PANEL_MAX` wide and
 * lands where it always did, but the scroller's own box reaches past it.
 *
 * A scroll container clips, and the Work cards run flush to the panel's right
 * edge: their hover lift's shadow would have been cut off in a hard vertical
 * line down that edge. The slack it borrows is empty either side — the rail's
 * 56px gap on the left, the page gutter on the right.
 */
const SCROLL_BLEED = 40

/**
 * Where the leaf field's left frontier sits for a given content width — the
 * column's right edge less the tip overhang, pinned so the strip stops growing
 * past `LEAF_STRIP_MAX` on a big screen.
 */
const leafLeft = (pct: number) =>
  `max(calc(${pct}vw - ${LEAF_TIP_INSET}px), calc(100vw - ${LEAF_STRIP_MAX}px))`

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

  // Landing on a legacy work route mid-session (a project page's Back pill)
  // flips the tab during render, so the redirected-to home never paints the
  // previous tab first. The initializer covers a cold load on `/work`.
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
      <WorkList />
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
  const inset = isMobile ? '20px' : shellPad()
  const rightInset = isMobile ? '20px' : pageGutter()
  const contentPct = tab === 'work' ? CONTENT_PCT.work : CONTENT_PCT.default
  const panelMax = tab === 'work' ? PANEL_MAX.work : PANEL_MAX.default
  const leafShift = tab === 'work' ? LEAF_WORK_SHIFT : '0px'

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
            width: `${contentPct}vw`,
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
          alignItems: 'flex-start',
          // The file's 56 from the rail to the content column.
          gap: isMobile ? '24px' : '56px',
          // Sized in `vw` rather than `%` so the split geometry doesn't shift by the
          // width of the page scrollbar. `overflow-x: hidden` on the body keeps the
          // shader's overhang from adding a horizontal scrollbar.
          width: isMobile ? '100%' : `${contentPct}vw`,
          height: isMobile ? undefined : '100%',
          boxSizing: 'border-box',
          // The file's 56 above the rail and the panel alike. The 80 below the
          // panel moves inside the scroller, so its content runs to the bottom
          // edge of the screen rather than stopping short of a dead band.
          padding: isMobile ? '20px 20px 60px' : `56px ${rightInset} 0 ${inset}`,
          // Desktop's fill is the animated mask layer above; mobile has no leaf
          // field beside it and paints its own.
          background: isMobile ? BG : undefined,
        }}
      >
        {/* The rail stays mounted across tab switches so only the panel below
            re-runs the content entrance. */}
        <HomeRail active={tab} onSelect={selectTab} isMobile={isMobile} />
        <main
          key={tab}
          className="tab-content-in"
          style={{
            flex: isMobile ? undefined : `0 1 ${panelMax + SCROLL_BLEED * 2}px`,
            width: isMobile ? '100%' : undefined,
            maxWidth: isMobile ? `${panelMax}px` : `${panelMax + SCROLL_BLEED * 2}px`,
            minWidth: 0,
            boxSizing: 'border-box',
            // The only thing on the page that scrolls. `key={tab}` remounts it,
            // so a switch already starts the next panel at its top — the
            // `window.scrollTo` calls are for the project routes now.
            height: isMobile ? undefined : '100%',
            overflowY: isMobile ? undefined : 'auto',
            // The other axis can't stay `visible` on a scroll container, so it
            // is pinned rather than left to flash a scrollbar when a hover lift
            // scales a card past the edge. `SCROLL_BLEED` is what keeps that
            // overhang inside the box in the first place.
            overflowX: isMobile ? undefined : 'hidden',
            padding: isMobile ? undefined : `0 ${SCROLL_BLEED}px 80px`,
            margin: isMobile ? undefined : `0 -${SCROLL_BLEED}px`,
          }}
        >
          {panel}
        </main>
      </div>
    </div>
  )
}
