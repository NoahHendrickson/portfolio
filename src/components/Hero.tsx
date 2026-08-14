import { color } from '../design-system/tokens'
import { useIsMobile } from '../hooks/useIsMobile'

const TEXT = color.text.primary
const MUTED = color.text.muted

/**
 * The Me tab's opening block. The display sizes here sit off the shared type
 * ramp — the Figma frame sets them directly — so they stay literal, with a
 * clamp so they scale down with the column below 1512px.
 */
export default function Hero() {
  const isMobile = useIsMobile()

  const body: React.CSSProperties = {
    margin: 0,
    maxWidth: '721px',
    fontSize: isMobile ? '17px' : 'clamp(16px, 1.6vw, 24px)',
    fontWeight: 400,
    lineHeight: 1.35,
    letterSpacing: '-0.2px',
  }

  const subtitle: React.CSSProperties = {
    margin: 0,
    fontSize: isMobile ? '19px' : 'clamp(18px, 1.6vw, 24px)',
    fontWeight: 600,
    lineHeight: 1.3,
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
          color: TEXT,
        }}
      >
        Hi, I&rsquo;m Noah
      </h1>

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <p style={{ ...subtitle, color: TEXT }}>Product Designer &amp;</p>
        <p style={{ ...subtitle, color: MUTED }}>Design Engineer x Builder x Diva</p>
      </div>

      <p style={{ ...body, color: TEXT }}>
        I&rsquo;m a product designer who adapts quickly and dives deep to improve my
        craft. I&rsquo;m looking for teams that empower people to just &ldquo;do the
        thing&rdquo;. I want to build, iterate, and ship high-quality features and
        products quickly.
      </p>

      <p style={{ ...body, color: MUTED }}>
        I have five years of experience turning business problems and ambitious
        ideas into useful products and features. I use data and research to drive
        measurable outcomes. I approach critique and adversity with humility, and
        strive to build a positive and honest culture.
      </p>
    </div>
  )
}
