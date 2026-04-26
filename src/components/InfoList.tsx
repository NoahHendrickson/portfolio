import React from 'react'

const chipStyle: React.CSSProperties = {
  position: 'absolute',
  left: 0,
  display: 'inline-flex',
  alignItems: 'center',
  padding: '8px 14px',
  borderRadius: 0,
  backgroundColor: '#f5efe0',
  color: 'rgba(15, 14, 14, 0.9)',
  fontSize: '18px',
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
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 2,
      }}
    >
      <span style={{ ...chipStyle, top: '38%' }}>
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

      <span style={{ ...chipStyle, top: '55%' }}>
        4yrs of experience
      </span>

      <span style={{ ...chipStyle, top: '70%' }}>
        Zero sugar soda addict
      </span>
    </div>
  )
}
