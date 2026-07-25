import ShaderEffect from './ShaderEffect'
import { useIsMobile } from '../hooks/useIsMobile'

/**
 * The right-hand shader column. The headline sits over the gradient on the Me
 * tab; on the Work tab the content column slides over this one, so the headline
 * fades in step with that slide rather than popping out from under it.
 */
export default function ShaderPanel({ showHeadline = true }: { showHeadline?: boolean }) {
  const isMobile = useIsMobile()

  return (
    <>
      <ShaderEffect />
      <p
        style={{
          opacity: showHeadline ? 1 : 0,
          transition: 'opacity 250ms ease',
          position: 'absolute',
          // Inset from the left of the panel rather than a fixed offset, so the
          // headline holds its place in the gradient as the column resizes.
          left: isMobile ? '20px' : '31%',
          top: isMobile ? 'auto' : '38%',
          bottom: isMobile ? '20px' : 'auto',
          margin: 0,
          maxWidth: '336px',
          fontSize: isMobile ? '24px' : '48px',
          fontWeight: 600,
          lineHeight: isMobile ? 1.15 : 1.05,
          letterSpacing: isMobile ? '-0.5px' : '-1.6px',
          // Dark on the light end of the gradient, per the July 2026 file.
          color: 'var(--color-text-inverse)',
          zIndex: 2,
          pointerEvents: 'none',
        }}
      >
        And I have fallen HARD for the shader trend
      </p>
    </>
  )
}
