import { useRef } from 'react'
import { ArrowDown } from '@untitledui/icons/ArrowDown'

export type Tab = 'about me' | 'work'

const TABS: Tab[] = ['about me', 'work']
const SCROLL_TOP_OFFSET = 24

type Props = {
  activeTab: Tab
  onTabChange: (tab: Tab) => void
}

export default function BottomNav({ activeTab, onTabChange }: Props) {
  const wrapperRef = useRef<HTMLDivElement>(null)

  const scrollNavToTop = () => {
    const el = wrapperRef.current
    if (!el) return
    const top = el.getBoundingClientRect().top + window.scrollY - SCROLL_TOP_OFFSET
    window.scrollTo({ top, behavior: 'smooth' })
  }

  const handleTabClick = (tab: Tab) => {
    if (tab !== activeTab && wrapperRef.current) {
      const navTop = wrapperRef.current.getBoundingClientRect().top
      if (navTop > SCROLL_TOP_OFFSET + 1) {
        scrollNavToTop()
      }
    }
    onTabChange(tab)
  }

  return (
    <div ref={wrapperRef} style={{ display: 'flex', alignItems: 'flex-end', gap: '16px' }}>
      {/* Orange pill tab switcher */}
      <div style={{
        backgroundColor: 'var(--color-orange)',
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        padding: '4px',
        borderRadius: '100px',
      }}>
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => handleTabClick(tab)}
            style={{
              padding: '6px 14px',
              borderRadius: '1000px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '15px',
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
        onClick={scrollNavToTop}
        style={{
          width: '44px',
          height: '44px',
          borderRadius: '9999px',
          backgroundColor: '#171717',
          color: '#ffffff',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          padding: 0,
        }}
      >
        <ArrowDown width={20} height={20} />
      </button>
    </div>
  )
}
