import type { CSSProperties } from 'react'
import { setMockTheme, useMockTheme, type MockTheme } from '../mockTheme'
import { space } from '../design-system/tokens'
import { TEXT_SOFT } from '../sheetStyle'

/*
  The no3y Code page's Glass / Inlet switch (Nov 14 2026): a recessed well on the Back pill's
  tint with a thumb that slides under the chosen theme. It swaps every mockup on the page.
*/

const OPTIONS: { id: MockTheme; label: string }[] = [
  { id: 'glass', label: 'Glass' },
  { id: 'inlet', label: 'Inlet' },
]

const INSET = 3

export default function MockThemeSwitch() {
  const theme = useMockTheme()
  const index = OPTIONS.findIndex((option) => option.id === theme)

  const well: CSSProperties = {
    position: 'relative',
    display: 'grid',
    gridTemplateColumns: `repeat(${OPTIONS.length}, 1fr)`,
    padding: INSET,
    borderRadius: 'var(--radius-full)',
    background: 'var(--color-bg-tint)',
  }
  const thumb: CSSProperties = {
    position: 'absolute',
    top: INSET,
    bottom: INSET,
    left: INSET,
    width: `calc((100% - ${INSET * 2}px) / ${OPTIONS.length})`,
    borderRadius: 'var(--radius-full)',
    background: 'var(--color-bg-cream)',
    transform: `translateX(${index * 100}%)`,
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: space.md }}>
      <span style={{ fontSize: '14px', color: TEXT_SOFT }}>Theme</span>
      <div role="radiogroup" aria-label="Mockup theme" style={well}>
        <span aria-hidden className="mock-theme-thumb" style={thumb} />
        {OPTIONS.map((option) => {
          const on = option.id === theme
          return (
            <button
              key={option.id}
              type="button"
              role="radio"
              aria-checked={on}
              onClick={() => setMockTheme(option.id)}
              style={{
                position: 'relative',
                height: 'var(--control-xs)',
                paddingInline: space.lg,
                border: 0,
                borderRadius: 'var(--radius-full)',
                background: 'transparent',
                color: on ? 'var(--color-ink)' : TEXT_SOFT,
                font: 'inherit',
                fontSize: '14px',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'color 200ms ease-out',
              }}
            >
              {option.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
