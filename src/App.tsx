import { useEffect, useState } from 'react'
import '@noey-17/yearn-ui/style.css'
import Header from './components/Header'
import Hero from './components/Hero'
import InfoList from './components/InfoList'
import BottomNav, { type Tab } from './components/BottomNav'
import ShaderEffect from './components/ShaderEffect'
import About from './components/About'
import WorkPage from './components/WorkPage'

const CREAM_BG = '#f5efe0'
const TEXT_DARK = '#0f0e0e'

function getRoute() {
  return window.location.hash.replace(/^#/, '') || '/'
}

export default function App() {
  const [route, setRoute] = useState(getRoute)
  const [activeTab, setActiveTab] = useState<Tab>('about me')

  useEffect(() => {
    const onHashChange = () => setRoute(getRoute())
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  if (route === '/work/invisible') {
    return <WorkPage title="Invisible" description="As the Lead Product Designer for Meridial, I held the bigger picture: shaping product vision, setting the bar for design quality, and building the ops that kept the team moving. That meant bringing in tools like Microsoft Clarity and Mixpanel to ground decisions in real user behavior, and folding AI into my workflow to move faster without losing craft. A few of the problems I worked on here: Our marketplace onboarding flow was disjointed, delayed, and confusing — experts dropped off, and the business couldn't scale delivery. I was responsible for the redesign of our sign-up and onboarding, resulting in a 60% reduction in time to be &quot;ready to work.&quot;" />
  }

  return (
    <div data-style="simple" style={{ backgroundColor: CREAM_BG }}>
    <div style={{
      position: 'relative',
      display: 'flex',
      height: '100vh',
      overflow: 'hidden',
      backgroundColor: CREAM_BG,
    }}>
      {/* Left side — content */}
      <div style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        width: '60%',
        height: '100%',
        zIndex: 1,
        backgroundColor: CREAM_BG,
      }}>
        {/* Header */}
        <div style={{ padding: '40px 40px 0' }}>
          <Header />
        </div>

        {/* Bio text */}
        <div style={{ padding: '0 80px' }}>
          <Hero />
          <p
            style={{
              maxWidth: '1200px',
              margin: '40px 0 0',
              fontSize: '24px',
              fontWeight: 500,
              lineHeight: 1.5,
              color: TEXT_DARK,
            }}
          >
            Hi, I&rsquo;m Noah
          </p>
          <p
            style={{
              maxWidth: '1200px',
              margin: '8px 0 0',
              fontSize: '24px',
              fontWeight: 500,
              lineHeight: 1.5,
              color: TEXT_DARK,
            }}
          >
            Right now I am the Lead Product Designer for Invisible&rsquo;s
            Talent Marketplace focused on AI training gig work.
          </p>
        </div>

        {/* Bottom nav */}
        <div style={{ paddingBottom: '40px', display: 'flex', justifyContent: 'center' }}>
          <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
        </div>
      </div>

      {/* Right side — shader with floating info chips overlaid */}
      <div style={{ position: 'relative', width: '40%', height: '100%', overflow: 'hidden' }}>
        <ShaderEffect />
        <InfoList />
      </div>

    </div>

    <About activeTab={activeTab} />

    </div>
  )
}
