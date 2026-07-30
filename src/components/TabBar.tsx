import { useLayoutEffect, useRef, useState } from 'react'
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
  const navRef = useRef<HTMLElement>(null)
  const [indicator, setIndicator] = useState({ left: 0, width: 0 })
  // Skip the slide on first paint so the underline seats under the active tab
  // without animating in from the origin.
  const [animate, setAnimate] = useState(false)

  useLayoutEffect(() => {
    const nav = navRef.current
    if (!nav) return

    const update = () => {
      const el = nav.querySelector<HTMLElement>(`[data-tab="${active}"]`)
      if (!el) return
      setIndicator({ left: el.offsetLeft, width: el.offsetWidth })
    }

    update()
    const raf = requestAnimationFrame(() => setAnimate(true))
    window.addEventListener('resize', update)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', update)
    }
  }, [active, isMobile])

  return (
    <nav
      ref={navRef}
      style={{ display: 'flex', alignItems: 'center', position: 'relative' }}
    >
      {TABS.map((tab) => {
        const isActive = tab.id === active
        return (
          <a
            key={tab.id}
            data-tab={tab.id}
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
              borderBottom: '2px solid transparent',
              whiteSpace: 'nowrap',
              transition: 'color 150ms ease, font-weight 150ms ease',
            }}
          >
            {tab.label}
          </a>
        )
      })}
      <span
        aria-hidden
        style={{
          position: 'absolute',
          bottom: 0,
          left: indicator.left,
          width: indicator.width,
          height: 2,
          backgroundColor: ORANGE,
          pointerEvents: 'none',
          transition: animate ? 'left 200ms ease, width 200ms ease' : undefined,
        }}
      />
    </nav>
  )
}
