import { useState } from 'react'

const TABS = ['about me', 'work']

export default function BottomNav() {
  const [activeTab, setActiveTab] = useState('about me')

  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '16px' }}>
      {/* Orange pill tab switcher */}
      <div style={{
        backgroundColor: 'var(--color-orange)',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        padding: '8px',
        borderRadius: '100px',
      }}>
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '8px 16px',
              borderRadius: '1000px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '18px',
              fontWeight: 500,
              fontFamily: 'inherit',
              backgroundColor: activeTab === tab ? 'var(--color-text-primary)' : 'transparent',
              color: activeTab === tab ? '#0e0e0f' : 'var(--color-text-primary)',
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Scroll down button */}
      <button
        aria-label="Scroll down"
        onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
        style={{
          width: '55px',
          height: '55px',
          borderRadius: '9999px',
          backgroundColor: '#ffffff',
          color: '#171717',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#171717" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: 'rotate(90deg)' }}>
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      </button>
    </div>
  )
}
