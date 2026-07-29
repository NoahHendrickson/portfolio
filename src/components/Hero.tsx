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
        <p style={{ ...subtitle, color: MUTED }}>Design Engineer x Builder</p>
      </div>

      <p style={{ ...body, color: TEXT }}>
        I have 5 years of experience taking business problems and ambitious ideas
        and turning them into caring products. I adapt fast and am eager to immerse
        myself in new domains and ways of working. I care about the craft, and about bringing
        the people around me up with it.
      </p>

      <p style={{ ...body, color: MUTED }}>
        I&rsquo;m looking for environments that prioritize shipping high-quality products
        and features often, and aren&rsquo;t afraid to see a designer in the codebase.
      </p>
    </div>
  )
}
