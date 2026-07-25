import { useEffect, useRef, useState } from 'react'
import '@noey-17/yearn-ui/style.css'
import Header from './components/Header'
import Hero from './components/Hero'
import WorkList from './components/WorkList'
import ShaderPanel from './components/ShaderPanel'
import Experience from './components/Experience'
import LlmWall from './components/LlmWall'
import WorkPage from './components/WorkPage'
import ProjectLanding from './components/ProjectLanding'
import ProjectStory from './components/ProjectStory'
import StatBuilderShowcase from './components/StatBuilderShowcase'
import { projects } from './data/projects'
import { useIsMobile } from './hooks/useIsMobile'
import { ForgeDesignMode } from 'forge-mode/design-mode'

const BG = 'var(--color-bg-primary)'

/** Percentage of the viewport the content column takes; on Design it slides over the shader. */
const CONTENT_PCT = { me: 58.3, work: 87.3 }

/**
 * The shader column starts where the Me tab's content column ends and runs to the
 * right edge. Anchoring both sides rather than setting a width keeps it flush with
 * the column whether or not the page has a scrollbar; widening the column on Design
 * just covers more of it, so the gradient slides under the panel instead of
 * getting squished.
 */
const SHADER_LEFT = `${CONTENT_PCT.me}vw`

/**
 * The tab bar is centred in the content column, so widening the column would drag
 * it right by half the width change. Shift it back by exactly that much to hold it
 * still. Both the width and this offset ease on the same curve, so the two cancel
 * out for the whole animation, not just at the ends.
 */
const TAB_SHIFT = {
  me: '0px',
  work: `-${(CONTENT_PCT.work - CONTENT_PCT.me) / 2}vw`,
}

function getRoute() {
  return window.location.hash.replace(/^#/, '') || '/'
}

export default function App() {
  const [route, setRoute] = useState(getRoute)
  const splitRef = useRef<HTMLDivElement>(null)
  const isMobile = useIsMobile()

  useEffect(() => {
    const onHashChange = () => {
      setRoute(getRoute())
      window.scrollTo({ top: 0 })
    }
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  // The column width is a percentage, so the tab-switch transition would also ease
  // on every window resize. Mark the column while resizing; CSS drops the easing.
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>
    const onResize = () => {
      const el = splitRef.current
      if (!el) return
      el.dataset.resizing = 'true'
      clearTimeout(timeout)
      timeout = setTimeout(() => delete el.dataset.resizing, 200)
    }
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
      clearTimeout(timeout)
    }
  }, [])

  if (route === '/work/invisible') {
    return <><ForgeDesignMode /><WorkPage title="Invisible" description="As the Lead Product Designer for Meridial, I held the bigger picture: shaping product vision, setting the bar for design quality, and building the ops that kept the team moving. That meant bringing in tools like Microsoft Clarity and Mixpanel to ground decisions in real user behavior, and folding AI into my workflow to move faster without losing craft. A few of the problems I worked on here: Our marketplace onboarding flow was disjointed, delayed, and confusing — experts dropped off, and the business couldn't scale delivery. I was responsible for the redesign of our sign-up and onboarding, resulting in a 60% reduction in time to be &quot;ready to work.&quot;" /></>
  }

  // `getRoute()` has already stripped the leading '#', so routes look like '/work/forge'.
  const project = route.startsWith('/work/')
    ? projects[route.slice('/work/'.length)]
    : undefined

  if (project) {
    // Stat Builder is temporarily on a four-variant showcase sandbox; other
    // projects with a `landing` use ProjectStory; the rest fall back to the
    // generic stats/stack/status layout.
    const page =
      project.slug === 'stat-builder' ? (
        <StatBuilderShowcase project={project} />
      ) : project.landing ? (
        <ProjectStory project={project} />
      ) : (
        <ProjectLanding project={project} />
      )

    return (
      <>
        <ForgeDesignMode />
        {page}
      </>
    )
  }

  const tab = route === '/work' ? 'work' : 'me'
  const pageInset = isMobile ? '0 20px' : '0 80px'

  return (
    <div data-style="simple" style={{ position: 'relative', minHeight: '100vh', background: BG }}>
      {/*
        The shader is one viewport tall in the top-right corner and the page
        scrolls past it, rather than the content column scrolling inside a fixed
        100vh split — that is the shape of the July 2026 file, where the canvas
        stops at the fold and dark shell runs the rest of the way down.
      */}
      {!isMobile && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: SHADER_LEFT,
          right: 0,
          height: '100vh',
          overflow: 'hidden',
          zIndex: 0,
        }}>
          <ShaderPanel showHeadline={tab === 'me'} />
        </div>
      )}

      <div
        ref={splitRef}
        className={isMobile ? undefined : 'split-column'}
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
          paddingBottom: isMobile ? '0' : '40px',
          boxSizing: 'border-box',
          background: BG,
        }}
      >
        <Header
          active={tab}
          tabShift={isMobile ? undefined : TAB_SHIFT[tab]}
          showProfile={tab === 'me'}
        />

        {tab === 'work' ? (
          <div style={{ padding: pageInset }}>
            <WorkList />
          </div>
        ) : (
          <>
            <div style={{ padding: pageInset }}>
              <Hero />
            </div>
            <Experience />
            <LlmWall />
          </>
        )}

        {/* Mobile-only shader banner, in place of the pinned column */}
        {isMobile && (
          <div style={{ position: 'relative', width: '100%', height: '200px', overflow: 'hidden' }}>
            <ShaderPanel />
          </div>
        )}
      </div>

      <ForgeDesignMode />
    </div>
  )
}
