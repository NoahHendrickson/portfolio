import '@noey-17/yearn-ui/style.css'
import '@noey-17/yearn-ui/theme.css'
import Header from './components/Header'
import Hero from './components/Hero'
import BottomNav from './components/BottomNav'

export default function App() {
  return (
    <div style={{ position: 'relative', minHeight: '100svh', overflow: 'hidden' }}>

      {/* Content column — right half */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          marginLeft: '40%',
          marginTop: '120px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          minHeight: '100svh',
          padding: '40px 60px 40px 60px',
          boxSizing: 'border-box',
        }}
      >
        <Header />

        <Hero />

        {/* BottomNav — above fixed Noah watermark */}
        <div style={{ position: 'relative', marginTop: 'auto', minHeight: '100px' }}>
          <div style={{ position: 'absolute', bottom: '40px', left: 0, right: 0 }}>
            <BottomNav />
          </div>
        </div>
      </div>

      {/* Noah — viewport watermark: baseline at bottom, spans ~center → right edge */}
      <div
        aria-hidden
        style={{
          position: 'fixed',
          left: '50%',
          right: 0,
          bottom: '-0.04em',
          fontSize: 'clamp(150px, 26vw, 360px)',
          fontWeight: 700,
          color: '#EBEBEB',
          lineHeight: 0.82,
          letterSpacing: '-0.03em',
          userSelect: 'none',
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      >
        Noah
      </div>

      {/* Pixel art — export from Figma (node 26:55731) and save as public/pixel-art.png */}
      <img
        src="/pixel-art.png"
        alt=""
        aria-hidden="true"
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          height: '100%',
          width: '48%',
          objectFit: 'cover',
          objectPosition: 'right center',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />
    </div>
  )
}
