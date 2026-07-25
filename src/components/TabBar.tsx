import { color, type } from '../design-system/tokens'
import { useIsMobile } from '../hooks/useIsMobile'

const ORANGE = color.accent.default

export type Tab = 'me' | 'work'

// The second tab is labelled "Design" as of the July 2026 redesign; the route
// behind it is still `#/work`, so existing links keep resolving.
const TABS: { id: Tab; label: string; href: string }[] = [
  { id: 'me', label: 'Me', href: '#/' },
  { id: 'work', label: 'Design', href: '#/work' },
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
              fontSize: type['label-l'].fontSize,
              fontWeight: isActive ? 500 : 400,
              lineHeight: 1.3,
              letterSpacing: 0,
              color: isActive ? color.text.primary : color.text.secondary,
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
