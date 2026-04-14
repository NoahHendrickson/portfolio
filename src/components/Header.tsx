import React from 'react'
import { Button } from '@noey-17/yearn-ui'

function FilledCaretDown() {
  return (
    <svg width="12" height="8" viewBox="0 0 12 8" fill="currentColor" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" aria-hidden="true">
      <path d="M0.5 0.5h11L6 7.5z" />
    </svg>
  )
}

function DiamondDots({ opacity = '0.22' }: { opacity?: string }) {
  const dotStyle: React.CSSProperties = {
    width: '5.33px',
    height: '5.33px',
    backgroundColor: `rgba(255,255,255,${opacity})`,
    position: 'absolute',
  }
  return (
    <div style={{ position: 'relative', width: '16px', height: '16px', transform: 'rotate(45deg)' }}>
      <div style={{ ...dotStyle, top: '5.33px', left: '0' }} />
      <div style={{ ...dotStyle, top: '0', left: '5.33px' }} />
      <div style={{ ...dotStyle, top: '5.33px', left: '10.67px' }} />
      <div style={{ ...dotStyle, top: '10.67px', left: '5.33px' }} />
    </div>
  )
}

export default function Header() {
  return (
    <div className="flex items-start justify-between">
      {/* Profile photo + decorative dots + pixel flower */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
        <img
          src="/profile.jpg"
          alt="Noah"
          style={{
            width: '150px',
            height: '150px',
            borderRadius: '40px',
            objectFit: 'cover',
          }}
        />
        <div
          className="flex flex-col items-center justify-between py-1"
          style={{ height: '150px' }}
        >
          <DiamondDots />
          <DiamondDots />
          <DiamondDots />
          <DiamondDots />
        </div>
        <img
          src="/pixel-flower.png"
          alt=""
          style={{ width: '150px', height: '150px', objectFit: 'contain' }}
        />
      </div>

      {/* Contact button */}
      <Button variant="secondary" size="lg" trailingIcon={<FilledCaretDown />} className="!bg-white !text-black !border-white hover:!bg-white/90">
        Contact
      </Button>
    </div>
  )
}
