import React from 'react'

const bulletWrap: React.CSSProperties = {
  width: '23px',
  height: '23px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
}

function XBullet() {
  return (
    <div style={bulletWrap}>
    <svg width="23" height="23" viewBox="0 0 23 23" fill="none" style={{ flexShrink: 0 }}>
      <rect x="7.54273" y="3.76953" width="5.33361" height="5.33361" transform="rotate(45 7.54273 3.76953)" fill="white" fillOpacity="0.225" />
      <rect x="15.0818" y="3.76953" width="5.33361" height="5.33361" transform="rotate(45 15.0818 3.76953)" fill="white" fillOpacity="0.225" />
      <rect x="15.0818" y="11.3121" width="5.33361" height="5.33361" transform="rotate(45 15.0818 11.3121)" fill="white" fillOpacity="0.225" />
      <rect x="7.54273" y="11.3121" width="5.33361" height="5.33361" transform="rotate(45 7.54273 11.3121)" fill="white" fillOpacity="0.225" />
    </svg>
    </div>
  )
}

function PlusBullet() {
  return (
    <div style={bulletWrap}>
    <svg width="23" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
      <rect x="10.6612" y="6.99259e-07" width="5.33332" height="5.33312" transform="rotate(90 10.6612 6.99259e-07)" fill="white" fillOpacity="0.225" />
      <rect x="15.9972" y="5.3335" width="5.33332" height="5.33312" transform="rotate(90 15.9972 5.3335)" fill="white" fillOpacity="0.225" />
      <rect x="10.6652" y="10.6665" width="5.33332" height="5.33312" transform="rotate(90 10.6652 10.6665)" fill="white" fillOpacity="0.225" />
      <rect x="5.33312" y="5.3335" width="5.33332" height="5.33312" transform="rotate(90 5.33312 5.3335)" fill="white" fillOpacity="0.225" />
    </svg>
    </div>
  )
}

const textStyle: React.CSSProperties = {
  margin: 0,
  fontSize: '20px',
  fontWeight: 500,
  color: 'rgba(255, 255, 255, 0.8)',
  whiteSpace: 'nowrap',
}

const linkStyle: React.CSSProperties = {
  color: 'rgba(255,255,255,0.8)',
  textDecoration: 'underline',
}

export default function InfoList() {
  return (
    <div style={{ display: 'flex', flexDirection: 'row', gap: '24px', flexWrap: 'wrap', maxWidth: '1100px', margin: '16px auto 0' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      
        <p style={textStyle}>
          Currently @{' '}
          <a href="https://invisibletech.ai/" target="_blank" rel="noreferrer" style={linkStyle}>
            Invisible ↗
          </a>
        </p>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <XBullet />
        <p style={textStyle}>Lead designer</p>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <PlusBullet />
        <p style={textStyle}>Research + UAT</p>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <XBullet />
        <p style={textStyle}>Zero sugar soda addict</p>
      </div>
    </div>
  )
}
