import { useEffect, useState } from 'react'
import '@noey-17/yearn-ui/style.css'
import Header from './components/Header'
import Footer from './components/Footer'
import Hero from './components/Hero'
import WorkList from './components/WorkList'
import ShaderPanel from './components/ShaderPanel'
import Experience from './components/Experience'
import LlmWall from './components/LlmWall'
import WorkPage from './components/WorkPage'
import InvisibleOnboarding from './components/InvisibleOnboarding'
import ProjectLanding from './components/ProjectLanding'
import ProjectStory from './components/ProjectStory'
import { projects } from './data/projects'
import { useIsMobile } from './hooks/useIsMobile'
import { ForgeDesignMode } from 'forge-mode/design-mode'

const BG = 'var(--color-bg-primary)'

/** Percentage of the viewport the content column takes; on Design it covers more of the shader. */
const CONTENT_PCT = { me: 58.3, work: 87.3 }

/**
 * The shader column starts where the Me tab's content column ends and runs to the
 * right edge. Anchoring both sides rather than setting a width keeps it flush with
 * the column whether or not the page has a scrollbar; widening the column on Design
 * just covers more of it, so the gradient sits under the panel instead of
 * getting squished.
 */
const SHADER_LEFT = `${CONTENT_PCT.me}vw`

/**
 * The tab bar is centred in the content column, so widening the column would drag
 * it right by half the width change. Shift it back by exactly that much to hold it
 * still when the column snaps wider on Design.
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
  const isMobile = useIsMobile()

  useEffect(() => {
    const onHashChange = () => {
      setRoute(getRoute())
      window.scrollTo({ top: 0 })
    }
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  if (route === '/work/invisible/onboarding') {
    return <><ForgeDesignMode /><InvisibleOnboarding /></>
  }

  if (route === '/work/invisible') {
    return <><ForgeDesignMode /><WorkPage title="Invisible" subtitle="Senior Product Designer" description="As the Lead Product Designer for Meridial, I held the bigger picture: shaping product vision, setting the bar for design quality, and building the ops that kept the team moving. That meant bringing in tools like Microsoft Clarity and Mixpanel to ground decisions in real user behavior, and folding AI into my workflow to move faster without losing craft. A few of the problems I worked on here: Our marketplace onboarding flow was disjointed, delayed, and confusing. Experts dropped off, and the business couldn't scale delivery." /></>
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
          background: BG,
        }}
      >
        {/*
          Header stays mounted across Me ↔ Design so the tabs don’t remount and
          re-run the content entrance. Only the page body below animates in.
          On Me, this shell is 100svh so the hero fills the fold; Experience
          starts below.
        */}
        <div
          style={{
            minHeight: tab === 'me' ? '100svh' : undefined,
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
              style={{ padding: pageInset, boxSizing: 'border-box', flex: '1 0 auto' }}
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

      {/*
        Outside the content column — the footer is a full-width band in the file,
        so it can't sit inside the Me tab's 58.3vw column. `position: relative`
        keeps it above the shader's absolutely-positioned panel.
      */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <Footer />
      </div>

      <ForgeDesignMode />
    </div>
  )
}
