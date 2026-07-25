import { useIsMobile } from '../hooks/useIsMobile'

const ORANGE = 'var(--color-orange)'

export type Tab = 'me' | 'work'

const TABS: { id: Tab; label: string; href: string }[] = [
  { id: 'me', label: 'Me', href: '#/' },
  { id: 'work', label: 'Work', href: '#/work' },
]

export default function TabBar({ active }: { active: Tab }) {
  const isMobile = useIsMobile()

  return (
    <nav style={{ display: 'flex', alignItems: 'center' }}>
      {TABS.map((tab) => {
        const isActive = tab.id === active
        return (
          <a
            key={tab.id}
            href={tab.href}
            aria-current={isActive ? 'page' : undefined}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: isMobile ? '8px 12px' : '8px 16px',
              fontSize: '16px',
              fontWeight: isActive ? 500 : 400,
              lineHeight: 1.3,
              color: isActive ? '#000000' : 'rgba(0,0,0,0.65)',
              textDecoration: 'none',
              borderBottom: `2px solid ${isActive ? ORANGE : 'transparent'}`,
              whiteSpace: 'nowrap',
              transition: 'color 150ms ease, border-color 150ms ease',
            }}
          >
            {tab.label}
          </a>
        )
      })}
    </nav>
  )
}
