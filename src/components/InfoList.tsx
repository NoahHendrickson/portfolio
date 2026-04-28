import React from 'react'
import { useIsMobile } from '../hooks/useIsMobile'

const baseChipStyle: React.CSSProperties = {
  position: 'absolute',
  left: 0,
  display: 'inline-flex',
  alignItems: 'center',
  borderRadius: 0,
  backgroundColor: '#f5efe0',
  color: 'rgba(15, 14, 14, 0.9)',
  fontWeight: 500,
  lineHeight: 1.3,
  whiteSpace: 'nowrap',
  pointerEvents: 'auto',
}

const linkStyle: React.CSSProperties = {
  color: 'rgba(15, 14, 14, 0.9)',
  textDecoration: 'underline',
  marginLeft: '4px',
}

export default function InfoList() {
  const isMobile = useIsMobile()
  const chipStyle: React.CSSProperties = {
    ...baseChipStyle,
    padding: isMobile ? '6px 12px' : '8px 14px',
    fontSize: isMobile ? '15px' : '18px',
  }
  const tops = isMobile ? ['20%', '50%', '80%'] : ['38%', '55%', '70%']

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 2,
      }}
    >
      <span style={{ ...chipStyle, top: tops[0] }}>
        Currently @
        <a
          href="https://invisibletech.ai/"
          target="_blank"
          rel="noreferrer"
          style={linkStyle}
        >
          Invisible ↗
        </a>
      </span>

      <span style={{ ...chipStyle, top: tops[1] }}>
        4yrs of experience
      </span>

      <span style={{ ...chipStyle, top: tops[2] }}>
        Zero sugar soda addict
      </span>
    </div>
  )
}
