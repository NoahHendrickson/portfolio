import { useEffect, useState } from 'react'
import '@noey-17/yearn-ui/style.css'
import Header from './components/Header'
import Hero from './components/Hero'
import WorkList from './components/WorkList'
import ShaderPanel from './components/ShaderPanel'
import { LEAF_PANEL_HEIGHT_VH, LEAF_SHIFT_X, LEAF_TIP_INSET } from './components/LeafPattern'
import Experience from './components/Experience'
import LlmWall from './components/LlmWall'
import WorkPage from './components/WorkPage'
import InvisibleOnboarding from './components/InvisibleOnboarding'
import ProjectLanding from './components/ProjectLanding'
import ProjectStory from './components/ProjectStory'
import { projects } from './data/projects'
import { useIsMobile } from './hooks/useIsMobile'
import { getRoute, ROUTE_CHANGE_EVENT } from './navigation'

const BG = 'var(--color-bg-primary)'

/** Percentage of the viewport the content column takes; on Design it covers more of the shader. */
const CONTENT_PCT = { me: 58.3, work: 87.3 }

/**
 * The tab bar is centred in the content column, so widening the column would drag
 * it right by half the width change. Shift it back by exactly that much to hold it
 * still when the column snaps wider on Design.
 */
const TAB_SHIFT = {
  me: '0px',
  work: `-${(CONTENT_PCT.work - CONTENT_PCT.me) / 2}vw`,
}

export default function App() {
  const [route, setRoute] = useState(getRoute)
  const isMobile = useIsMobile()

  useEffect(() => {
    const onRouteChange = () => {
      setRoute(getRoute())
      window.scrollTo({ top: 0 })
    }
    window.addEventListener('popstate', onRouteChange)
    window.addEventListener(ROUTE_CHANGE_EVENT, onRouteChange)
    return () => {
      window.removeEventListener('popstate', onRouteChange)
      window.removeEventListener(ROUTE_CHANGE_EVENT, onRouteChange)
    }
  }, [])

  if (route === '/work/invisible/onboarding') {
    return <InvisibleOnboarding />
  }

  if (route === '/work/invisible') {
    return <WorkPage title="Invisible" subtitle="Senior Product Designer" description="As the Lead Product Designer for Meridial, I held the bigger picture: shaping product vision, setting the bar for design quality, and building the ops that kept the team moving. That meant bringing in tools like Microsoft Clarity and Mixpanel to ground decisions in real user behavior, and folding AI into my workflow to move faster without losing craft." />
  }

  // Routes are pathnames like '/work/forge'.
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

  const tab = route === '/work' ? 'work' : 'me'
  const pageInset = isMobile ? '0 20px' : '0 80px'

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
          // Me keeps the 100px nudge; Design's strip is already tight (~12.7vw),
          // so the same shift would clip leaves to a smushed half-column.
          left: `calc(${CONTENT_PCT[tab]}vw - ${LEAF_TIP_INSET}px${tab === 'me' ? ` + ${LEAF_SHIFT_X}px` : ''})`,
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
          <Header
            active={tab}
            tabShift={isMobile ? undefined : TAB_SHIFT[tab]}
            showProfile={tab === 'me'}
          />
          {tab === 'work' ? (
            <div key="work" style={{ padding: pageInset }}>
              <WorkList />
            </div>
          ) : (
            <div
              key="me"
              className="tab-content-in"
              style={{
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
        {tab === 'me' && (
          <>
            <Experience />
            <LlmWall />
          </>
        )}
      </div>
    </div>
  )
}
