import type { CSSProperties, ReactNode } from 'react'
import { color, radius, space, type } from './tokens'

/** Shared chrome for the foundations stories. Not part of the shipped app. */

const textStyle = (name: keyof typeof type): CSSProperties => ({ ...type[name] })

export function Page({ title, lede, children }: { title: string; lede?: string; children: ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: space['2xl'], maxWidth: '1080px' }}>
      <header style={{ display: 'flex', flexDirection: 'column', gap: space.md }}>
        <h1 style={{ ...textStyle('display-l'), margin: 0, color: color.text.primary }}>{title}</h1>
        {lede && (
          <p style={{ ...textStyle('body-l'), margin: 0, color: color.text.secondary, maxWidth: '68ch' }}>{lede}</p>
        )}
      </header>
      {children}
    </div>
  )
}

export function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section style={{ display: 'flex', flexDirection: 'column', gap: space.lg }}>
      <h2 style={{ ...textStyle('eyebrow'), margin: 0, color: color.text.muted }}>{title}</h2>
      {children}
    </section>
  )
}

export function Row({ children }: { children: ReactNode }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: space.lg, alignItems: 'flex-end' }}>{children}</div>
  )
}

export function Card({ children, surface = 'raised' }: { children: ReactNode; surface?: 'raised' | 'cream' }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: space.md,
        padding: space.xl,
        borderRadius: radius.xl,
        background: surface === 'cream' ? color.bg.cream : color.bg.raised,
        border: `1px solid ${surface === 'cream' ? color.border.ink : color.border.subtle}`,
      }}
    >
      {children}
    </div>
  )
}

export function Mono({ children }: { children: ReactNode }) {
  return (
    <code style={{ ...textStyle('caption'), color: color.text.muted, fontFamily: 'ui-monospace, monospace' }}>
      {children}
    </code>
  )
}
