import { useEffect, useState } from 'react'
import '@noey-17/yearn-ui/style.css'
import Header from './components/Header'
import Hero from './components/Hero'
import InfoList from './components/InfoList'
import BottomNav from './components/BottomNav'
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

  useEffect(() => {
    const onHashChange = () => setRoute(getRoute())
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  if (route === '/work/marketplace') {
    return <WorkPage title="Marketplace team" />
  }
  if (route === '/work/annotations') {
    return <WorkPage title="Annotations team" />
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
          <BottomNav />
        </div>
      </div>

      {/* Right side — shader with floating info chips overlaid */}
      <div style={{ position: 'relative', width: '40%', height: '100%', overflow: 'hidden' }}>
        <ShaderEffect />
        <InfoList />
      </div>

    </div>

    <About />

    </div>
  )
}
