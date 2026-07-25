import { useIsMobile } from '../hooks/useIsMobile'

const TEXT_DARK = '#0f0e0e'
const TEXT_MUTED = 'rgba(15,14,14,0.65)'

export default function Hero() {
  const isMobile = useIsMobile()

  // Figma sizes hold at 1512px wide; below that everything scales down with the column.
  const body: React.CSSProperties = {
    margin: 0,
    maxWidth: '721px',
    fontSize: isMobile ? '17px' : 'clamp(16px, 1.6vw, 24px)',
    fontWeight: 400,
    lineHeight: 1.35,
    letterSpacing: '-0.2px',
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? '16px' : 'clamp(14px, 1.6vw, 24px)' }}>
      <h1
        style={{
          margin: 0,
          fontSize: isMobile ? '34px' : 'clamp(32px, 3.2vw, 48px)',
          fontWeight: 600,
          lineHeight: 1.1,
          letterSpacing: '-1.6px',
          color: TEXT_DARK,
        }}
      >
        Hi, I&rsquo;m Noah
      </h1>

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <p
          style={{
            margin: 0,
            fontSize: isMobile ? '19px' : 'clamp(18px, 1.6vw, 24px)',
            fontWeight: 600,
            lineHeight: 1.3,
            letterSpacing: '-0.2px',
            color: TEXT_DARK,
          }}
        >
          Product Designer &amp;
        </p>
        <p
          style={{
            margin: 0,
            fontSize: isMobile ? '19px' : 'clamp(18px, 1.6vw, 24px)',
            fontWeight: 600,
            lineHeight: 1.3,
            letterSpacing: '-0.2px',
            color: TEXT_MUTED,
          }}
        >
          Design Engineer x Builder x Diva
        </p>
      </div>

      <p style={{ ...body, color: TEXT_DARK }}>
        I am a Product Designer who adapts quickly to push and improve my craft. I
        have 5 years of experience creating products that care about the user,
        making impact with strategic flows and micro UX/UI. I bring a chill
        resilience to adversity, and can lift the room in high pressure situations.
      </p>

      <p style={{ ...body, color: TEXT_MUTED }}>
        I&rsquo;m looking for environments that prioritize shipping quality products
        and features often, and aren&rsquo;t afraid to see a designer in the codebase.
      </p>
    </div>
  )
}
