import { useEffect, useSyncExternalStore } from 'react'
import '@noey-17/yearn-ui/style.css'
import Header from './components/Header'
import Hero from './components/Hero'
import WorkList from './components/WorkList'
import ShaderPanel from './components/ShaderPanel'
import {
  LEAF_PANEL_HEIGHT_VH,
  LEAF_SHIFT_X,
  LEAF_STRIP_MAX,
  LEAF_TIP_INSET,
} from './components/LeafPattern'
import Experience from './components/Experience'
import InvisibleOnboarding from './components/InvisibleOnboarding'
import InvisibleSynapse from './components/InvisibleSynapse'
import ProjectLanding from './components/ProjectLanding'
import ProjectStory from './components/ProjectStory'
import { projects } from './data/projects'
import { useIsMobile } from './hooks/useIsMobile'
import { getRoute, navigate, subscribeToRoute } from './navigation'
import { PAGE_GUTTER, shellPad } from './layout'

const BG = 'var(--color-bg-primary)'

/** Percentage of the viewport the content column takes; on Design it covers more of the shader. */
const CONTENT_PCT = { me: 58.3, work: 87.3 }

export default function App() {
  const route = useSyncExternalStore(subscribeToRoute, getRoute)
  const isMobile = useIsMobile()

  useEffect(() => {
    // Retired routes: the Invisible index, plus Forge and Phanttom pages that
    // are no longer in the portfolio. Bookmarks land on Design.
    if (
      route === '/work/invisible' ||
      route === '/work/forge' ||
      route === '/work/phanttom'
    ) {
      navigate('/work', { replace: true })
      return
    }
    window.scrollTo({ top: 0 })
  }, [route])

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

  const tab =
    route === '/work' ||
    route === '/work/invisible' ||
    route === '/work/forge' ||
    route === '/work/phanttom'
      ? 'work'
      : 'me'
  // One shared left edge on every route (see `layout.ts`). The right gutter
  // stays the fixed 120 — the shared inset is centred against the viewport,
  // and mirroring it inside a column narrower than the viewport would eat the
  // content's width instead.
  const inset = isMobile ? '20px' : shellPad()
  const rightInset = isMobile ? '20px' : `${PAGE_GUTTER}px`
  const pageInset = `0 ${rightInset} 0 ${inset}`

  return (
    <div
      data-style="simple"
      style={{
        position: 'relative',
        minHeight: '100vh',
        background: BG,
        // The leaf panel is absolutely positioned at 260vh. Without a footer the
        // Me column is shorter than that, and the abs panel's overflow padded the
        // document with empty scroll. Clip to in-flow content height.
        overflow: 'hidden',
      }}
    >
      {/*
        Leaf field hangs in the top-right and runs past the fold, thinning out
        until it's gone — page scrolls over the same dark shell underneath.
      */}
      {!isMobile && (
        <div style={{
          position: 'absolute',
          top: 0,
          // Track the active content edge so the first leaf column is always
          // fully visible — jagged silhouette instead of a mid-leaf square cut.
          // Me hangs off that edge on its nudge until the strip would run wider
          // than the frame shows, and is pinned to `LEAF_STRIP_MAX` past there so
          // a big screen moves the field right rather than revealing more of it.
          // Design's strip is already tight (~12.7vw), so any shift would clip
          // leaves to a smushed half-column.
          left: tab === 'me'
            ? `max(calc(${CONTENT_PCT.me}vw - ${LEAF_TIP_INSET}px + ${LEAF_SHIFT_X}px), calc(100vw - ${LEAF_STRIP_MAX}px))`
            : `calc(${CONTENT_PCT.work}vw - ${LEAF_TIP_INSET}px)`,
          right: 0,
          height: `${LEAF_PANEL_HEIGHT_VH}vh`,
          overflow: 'hidden',
          zIndex: 0,
        }}>
          <ShaderPanel />
        </div>
      )}

      <div
        style={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
          // Sized in `vw` rather than `%` so the split geometry doesn't shift by the
          // width of the page scrollbar. `overflow-x: hidden` on the body keeps the
          // shader's overhang from adding a horizontal scrollbar.
          width: isMobile ? '100%' : `${CONTENT_PCT[tab]}vw`,
          minHeight: isMobile ? undefined : '100vh',
          boxSizing: 'border-box',
          // Stop the fill short of the right edge so leaf tips peek past the
          // column as a jagged edge (Figma Frame 455), not a square cut.
          background: isMobile
            ? BG
            : `linear-gradient(to right, ${BG} 0%, ${BG} calc(100% - ${LEAF_TIP_INSET}px), transparent calc(100% - ${LEAF_TIP_INSET}px))`,
        }}
      >
        {/*
          Header stays mounted across Me ↔ Design so the tabs don’t remount and
          re-run the content entrance. Only the page body below animates in.
          On desktop Me, this shell is 100svh so the hero fills the fold beside
          the shader; on mobile there’s no shader, so a forced viewport height
          just leaves a tall empty band under the bio.
        */}
        <div
          style={{
            minHeight: tab === 'me' && !isMobile ? '100svh' : undefined,
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
            boxSizing: 'border-box',
          }}
        >
          {/* Header rides the same inset, so the tabs and profile row stay
              aligned with the copy when the content re-centres on a big screen. */}
          <Header
            active={tab}
            showProfile={tab === 'me'}
            barInset={inset}
            contentInset={inset}
            trailingInset={rightInset}
          />
          {tab === 'work' ? (
            <div
              key="work"
              style={{
                padding: `0 ${rightInset} ${isMobile ? '60px' : '80px'} ${inset}`,
              }}
            >
              <WorkList />
            </div>
          ) : (
            <div
              key="me"
              className="tab-content-in"
              style={{
                display: 'flex',
                flexDirection: 'column',
                padding: pageInset,
                boxSizing: 'border-box',
                // Grow to fill the desktop fold; on mobile the shell has no
                // min-height, so flex-grow would only invent empty space.
                flex: isMobile ? undefined : '1 0 auto',
              }}
            >
              <Hero />
            </div>
          )}
        </div>
        {tab === 'me' && <Experience />}
      </div>
    </div>
  )
}
