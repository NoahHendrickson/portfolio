import { color } from '../design-system/tokens'
import { useIsMobile } from '../hooks/useIsMobile'

/**
 * A framed screenshot of something an LLM said. The card is a 4px tray around a
 * bordered inner card; the shot is pinned so the crop lands on the reply rather
 * than the thinking line above it.
 */
type Clipping = {
  src: string
  alt: string
  /** Card width in px at the design's scale. */
  width: number
  /** Aspect ratio of the image window inside the card. */
  aspect: string
  /** How the shot is scaled and pulled inside that window. */
  crop: { width: string; left: string; height: string; top: string }
}

const clippings: Clipping[] = [
  {
    src: '/work/llm-wall-claude.jpeg',
    alt: 'Claude replying “Hell yes — that’s the fix.”',
    width: 153,
    aspect: '153 / 46',
    crop: { width: '110.46%', left: '-10.46%', height: '130.43%', top: '-30.43%' },
  },
  {
    src: '/work/llm-wall-protected-by-luck.png',
    alt: 'An LLM declaring “You were protected by luck:”',
    width: 240,
    aspect: '636 / 92',
    crop: { width: '100%', left: '0%', height: '100%', top: '0%' },
  },
  {
    src: '/work/llm-wall-close-to-fatal.png',
    alt: 'An LLM saying “The review was right about the thing that mattered, and it was close to fatal.”',
    width: 360,
    aspect: '914 / 118',
    crop: { width: '100%', left: '0%', height: '100%', top: '0%' },
  },
]

export default function LlmWall() {
  const isMobile = useIsMobile()

  const heading: React.CSSProperties = {
    margin: 0,
    fontSize: isMobile ? '20px' : '24px',
    fontWeight: 600,
    lineHeight: 1.3,
    letterSpacing: '-0.2px',
  }

  return (
    <section
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        padding: isMobile ? '48px 20px 60px' : '0 80px 120px',
      }}
    >
      <h2 style={{ ...heading, color: color.text.primary }}>LLM wall of fame</h2>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
        {clippings.map((clipping) => (
          <div
            key={clipping.src}
            style={{
              display: 'flex',
              padding: '4px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(255,255,255,0.08)',
            }}
          >
            <div
              style={{
                // Fixed design widths; clamp so a 360px clip can’t overflow a
                // 320–390 phone column (and stretch the layout viewport on iOS).
                width: `min(${clipping.width}px, 100%)`,
                maxWidth: '100%',
                padding: '8px',
                boxSizing: 'border-box',
                borderRadius: '4px',
                border: `1px solid ${color.border.default}`,
                background: '#181818',
              }}
            >
              <div style={{ position: 'relative', width: '100%', aspectRatio: clipping.aspect, overflow: 'hidden' }}>
                <img
                  src={clipping.src}
                  alt={clipping.alt}
                  style={{
                    position: 'absolute',
                    width: clipping.crop.width,
                    left: clipping.crop.left,
                    height: clipping.crop.height,
                    top: clipping.crop.top,
                    maxWidth: 'none',
                    display: 'block',
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
