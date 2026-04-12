import { useState } from 'react'
import { Tab2 } from '@noey-17/yearn-ui'

const TABS = [
  { label: 'about me', value: 'about' },
  { label: 'work', value: 'work' },
]

export default function BottomNav() {
  const [activeTab, setActiveTab] = useState('about')

  return (
    <div className="flex items-end justify-center gap-4">
      <Tab2 tabs={TABS} value={activeTab} onChange={setActiveTab} />

      {/* Arrow down button */}
      <button
        aria-label="Scroll down"
        style={{
          width: '55px',
          height: '55px',
          borderRadius: '9999px',
          backgroundColor: 'rgba(15,14,14,0.8)',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <img
          src="/icons/arrow-forward.svg"
          alt=""
          width={24}
          height={24}
          style={{ transform: 'rotate(90deg)', filter: 'invert(1)' }}
        />
      </button>
    </div>
  )
}
