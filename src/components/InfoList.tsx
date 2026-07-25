import React from 'react'
import { useIsMobile } from '../hooks/useIsMobile'

const baseChipStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignSelf: 'flex-start',
  alignItems: 'center',
  borderRadius: 0,
  backgroundColor: 'var(--color-bg-cream)',
  color: 'rgba(15, 14, 14, 0.9)',
  fontWeight: 500,
  lineHeight: 1.3,
  whiteSpace: 'nowrap',
  pointerEvents: 'auto',
}

export default function InfoList() {
  const isMobile = useIsMobile()
  const chipStyle: React.CSSProperties = {
    ...baseChipStyle,
    padding: isMobile ? '6px 12px' : '8px 14px',
    fontSize: isMobile ? '15px' : '18px',
  }

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 2,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-evenly',
        alignItems: 'flex-start',
        paddingTop: isMobile ? '8px' : '20%',
        paddingBottom: isMobile ? '8px' : '20%',
      }}
    >
      <span style={chipStyle}>
        4yrs of experience
      </span>

      <span style={chipStyle}>
        Zero sugar soda addict
      </span>
    </div>
  )
}
