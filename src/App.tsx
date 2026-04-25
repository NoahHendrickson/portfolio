import '@noey-17/yearn-ui/style.css'
import Header from './components/Header'
import Hero from './components/Hero'
import InfoList from './components/InfoList'
import BottomNav from './components/BottomNav'
import ShaderEffect from './components/ShaderEffect'
import About from './components/About'

const CREAM_BG = '#f5efe0'

export default function App() {

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
        <div style={{ padding: '80px' }}>
          <Hero />
          <InfoList />
          <p
            style={{
              maxWidth: '1200px',
              margin: '32px auto 0',
              fontSize: 'clamp(16px, 1.4vw, 20px)',
              fontWeight: 400,
              lineHeight: 1.6,
              color: 'var(--color-bg-primary)',
              opacity: 0.75,
            }}
          >
            I am leading Product Design for Invisible&apos;s AI training marketplace.
            I owned a complete redesign of the Meridial Marketplace experience from
            signup to thriving user.
          </p>
        </div>

        {/* Bottom nav */}
        <div style={{ paddingBottom: '40px', display: 'flex', justifyContent: 'center' }}>
          <BottomNav />
        </div>
      </div>

      {/* Right side — shader */}
      <div style={{ position: 'relative', width: '40%', height: '100%', overflow: 'hidden' }}>
        <ShaderEffect />
      </div>

    </div>

    <About />

    </div>
  )
}
