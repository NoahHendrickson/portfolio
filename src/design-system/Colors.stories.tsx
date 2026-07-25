import type { Meta, StoryObj } from '@storybook/react-vite'
import { color, radius, space, type } from './tokens'
import { Card, Mono, Page, Section } from './docs'

const meta: Meta = {
  title: 'Foundations/Colors',
}
export default meta

type Swatch = { name: string; value: string; cssVar: string }

const SURFACES: Swatch[] = [
  { name: 'bg/primary', value: color.bg.primary, cssVar: '--color-bg-primary' },
  { name: 'bg/raised', value: color.bg.raised, cssVar: '--color-bg-raised' },
  { name: 'bg/inverse', value: color.bg.inverse, cssVar: '--color-bg-inverse' },
  { name: 'bg/cream', value: color.bg.cream, cssVar: '--color-bg-cream' },
]

const ON_DARK: Swatch[] = [
  { name: 'text/primary', value: color.text.primary, cssVar: '--color-text-primary' },
  { name: 'text/secondary', value: color.text.secondary, cssVar: '--color-text-secondary' },
  { name: 'text/muted', value: color.text.muted, cssVar: '--color-text-muted' },
  { name: 'text/inverse', value: color.text.inverse, cssVar: '--color-text-inverse' },
]

const ON_CREAM: Swatch[] = [
  { name: 'ink/default', value: color.ink.default, cssVar: '--color-ink' },
  { name: 'ink/secondary', value: color.ink.secondary, cssVar: '--color-ink-secondary' },
  { name: 'ink/muted', value: color.ink.muted, cssVar: '--color-ink-muted' },
]

const BORDERS: Swatch[] = [
  { name: 'border/subtle', value: color.border.subtle, cssVar: '--color-border-subtle' },
  { name: 'border/default', value: color.border.default, cssVar: '--color-border-default' },
  { name: 'border/ink', value: color.border.ink, cssVar: '--color-border-ink' },
]

const ACCENT: Swatch[] = [
  { name: 'accent/default', value: color.accent.default, cssVar: '--color-orange' },
  { name: 'accent/hover', value: color.accent.hover, cssVar: '--color-orange-hover' },
  { name: 'accent/on-accent', value: color.accent.onAccent, cssVar: '--color-on-accent' },
]

function Grid({ swatches, onCream = false }: { swatches: Swatch[]; onCream?: boolean }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: space.lg }}>
      {swatches.map((s) => (
        <div key={s.name} style={{ display: 'flex', alignItems: 'center', gap: space.lg }}>
          <div
            style={{
              width: 56,
              height: 56,
              flexShrink: 0,
              borderRadius: radius.md,
              background: s.value,
              border: `1px solid ${onCream ? color.border.ink : color.border.default}`,
            }}
          />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
            <span style={{ ...type['label-m'], color: onCream ? color.ink.default : color.text.primary }}>
              {s.name}
            </span>
            <Mono>var({s.cssVar})</Mono>
          </div>
        </div>
      ))}
    </div>
  )
}

export const Colors: StoryObj = {
  render: () => (
    <Page
      title="Colors"
      lede="Every colour in the app resolves to one of these CSS variables. The dark shell and the cream content column each have their own text and border ramps, which is why there is both a text/* and an ink/* set."
    >
      <Section title="Surfaces">
        <Grid swatches={SURFACES} />
      </Section>

      <Section title="Text on the dark shell">
        <Grid swatches={ON_DARK} />
      </Section>

      <Section title="Ink on the cream column">
        <Card surface="cream">
          <Grid swatches={ON_CREAM} onCream />
        </Card>
      </Section>

      <Section title="Borders">
        <Grid swatches={BORDERS} />
      </Section>

      <Section title="Accent">
        <Grid swatches={ACCENT} />
      </Section>
    </Page>
  ),
}
