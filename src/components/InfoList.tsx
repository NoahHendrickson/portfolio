import React from 'react'

function DiamondBullet() {
  const dot: React.CSSProperties = {
    width: '5.33px',
    height: '5.33px',
    backgroundColor: 'rgba(255,255,255,0.16)',
    position: 'absolute',
  }
  return (
    <div style={{
      position: 'relative',
      width: '22.6px',
      height: '22.6px',
      flexShrink: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div style={{ position: 'relative', width: '16px', height: '16px', transform: 'rotate(45deg)' }}>
        <div style={{ ...dot, top: '5.33px', left: '0' }} />
        <div style={{ ...dot, top: '0', left: '5.33px' }} />
        <div style={{ ...dot, top: '5.33px', left: '10.67px' }} />
        <div style={{ ...dot, top: '10.67px', left: '5.33px' }} />
      </div>
    </div>
  )
}

const textStyle: React.CSSProperties = {
  margin: 0,
  fontSize: '20px',
  fontWeight: 500,
  color: 'rgba(255,255,255,0.5)',
  whiteSpace: 'nowrap',
}

const linkStyle: React.CSSProperties = {
  color: 'rgba(255,255,255,0.5)',
  textDecoration: 'underline',
}

export default function InfoList() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <DiamondBullet />
        <p style={textStyle}>
          Currently @{' '}
          <a href="https://invisibletech.ai/" target="_blank" rel="noreferrer" style={linkStyle}>
            Invisible ↗
          </a>
        </p>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <DiamondBullet />
        <p style={textStyle}>Lead designer</p>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <DiamondBullet />
        <p style={textStyle}>Design Ops shaper</p>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <DiamondBullet />
        <p style={textStyle}>Research + UAT</p>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <DiamondBullet />
        <p style={textStyle}>Zero sugar soda addict</p>
      </div>
    </div>
  )
}
