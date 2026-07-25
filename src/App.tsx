import { useEffect, useRef, useState } from 'react'
import '@noey-17/yearn-ui/style.css'
import Header from './components/Header'
import Hero from './components/Hero'
import WorkBento from './components/WorkBento'
import ShaderPanel from './components/ShaderPanel'
import About from './components/About'
import WorkPage from './components/WorkPage'
import ProjectLanding from './components/ProjectLanding'
import ProjectStory from './components/ProjectStory'
import { projects } from './data/projects'
import { useIsMobile } from './hooks/useIsMobile'
import { ForgeDesignMode } from 'forge-mode/design-mode'

const CREAM_BG = '#f5efe0'

/** Percentage of the viewport the content column takes; on Work it slides over the shader. */
const CONTENT_PCT = { me: 58.3, work: 84.7 }

const CONTENT_WIDTH = {
  me: `${CONTENT_PCT.me}%`,
  work: `${CONTENT_PCT.work}%`,
}

/**
 * The shader column is pinned to the right at the width it has on the Me tab and
 * never resizes — widening the content column just covers more of it, so the
 * gradient slides under the cream panel instead of getting squished.
 */
const SHADER_WIDTH = `calc(100% - ${CONTENT_WIDTH.me})`

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
    // Projects with a `landing` get the screenshot-led page; the rest fall back
    // to the generic stats/stack/status layout.
    return (
      <>
        <ForgeDesignMode />
        {project.landing ? <ProjectStory project={project} /> : <ProjectLanding project={project} />}
      </>
    )
  }

  const tab = route === '/work' ? 'work' : 'me'

  return (
    <div data-style="simple" style={{ backgroundColor: CREAM_BG }}>
      <div style={{
        position: 'relative',
        display: 'flex',
        // Sized against the viewport rather than the content box: the Me tab has a
        // page scrollbar (About sits below the fold) and Work doesn't, and a 100%
        // basis would shrink by the scrollbar's width on Me, nudging every
        // percentage inside — the tab bar included. `vw` includes the scrollbar, so
        // the split geometry is identical on both tabs. `overflow-x: hidden` on the
        // body keeps the overhang from adding a horizontal scrollbar.
        width: isMobile ? '100%' : '100vw',
        flexDirection: isMobile ? 'column' : 'row',
        height: isMobile ? 'auto' : '100vh',
        minHeight: isMobile ? '100vh' : undefined,
        overflow: isMobile ? 'visible' : 'hidden',
        backgroundColor: CREAM_BG,
      }}>
        {/* Left side — chrome + tab content */}
        <div ref={splitRef} className={isMobile ? undefined : 'split-column'} style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          width: isMobile ? '100%' : CONTENT_WIDTH[tab],
          height: isMobile ? 'auto' : '100%',
          zIndex: 1,
          backgroundColor: CREAM_BG,
        }}>
          <Header active={tab} tabShift={isMobile ? undefined : TAB_SHIFT[tab]} />

          <div style={{
            flex: 1,
            minHeight: 0,
            padding: isMobile
              ? '8px 20px 0'
              : tab === 'work'
                ? '0 24px 24px'
                : '0 clamp(32px, 5.3vw, 80px)',
            overflowY: isMobile ? 'visible' : 'auto',
          }}>
            {tab === 'work' ? <WorkBento /> : <Hero />}
          </div>

          {/* Mobile-only shader banner */}
          {isMobile && (
            <div style={{
              position: 'relative',
              width: '100%',
              height: '200px',
              overflow: 'hidden',
              marginTop: '32px',
            }}>
              <ShaderPanel />
            </div>
          )}

          {!isMobile && <div style={{ height: '40px', flexShrink: 0 }} />}
        </div>

        {/* Right side — shader (desktop only), fixed width beneath the content column */}
        {!isMobile && (
          <div style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: SHADER_WIDTH,
            height: '100%',
            overflow: 'hidden',
            zIndex: 0,
          }}>
            <ShaderPanel showHeadline={tab === 'me'} />
          </div>
        )}
      </div>

      {tab === 'me' && <About />}

      <ForgeDesignMode />
    </div>
  )
}
