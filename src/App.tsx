import '@noey-17/yearn-ui/style.css'
import Header from './components/Header'
import Hero from './components/Hero'
import InfoList from './components/InfoList'
import BottomNav from './components/BottomNav'
import FlowerRow from './components/FlowerRow'
import ShaderEffect from './components/ShaderEffect'
import About from './components/About'

export default function App() {

  return (
    <div data-style="simple" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
    <div style={{
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: '100vh',
      overflow: 'hidden',
      backgroundColor: 'var(--color-bg-primary)',
    }}>
      <ShaderEffect />

      {/* Decorative background flower row */}

      <div style={{
        position: 'absolute',
        top: '45%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 0,
        pointerEvents: 'none',
      }}>
        <FlowerRow />
      </div>

      {/* "Noah" watermark */}
      {/* <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          left: '517px',
          top: '592px',
          fontSize: '600px',
          fontWeight: 900,
          lineHeight: 1,
          color: 'rgba(255,255,255,0.04)',
          userSelect: 'none',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      >
        Noah
      </div> */}

      {/* Header */}
      <div style={{ position: 'relative', zIndex: 1, padding: '40px 40px 0', width: "100vw" }}>
        <Header />
      </div>

      {/* Bio text */}
      <div style={{ position: 'relative', width: "100%", padding: "80px" , zIndex: 1, background: "#171717" }}>
        <Hero />
        <InfoList />
      </div>


      {/* Bottom nav */}
      <div style={{
        position: 'relative',
        paddingBottom: '40px',
        zIndex: 1,
      }}>
        <BottomNav />
      </div>

    </div>

    <About />

    </div>
  )
}
