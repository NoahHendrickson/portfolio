import type { Meta, StoryObj } from '@storybook/react-vite'
import { color, space, type, type TypeName } from './tokens'
import { Mono, Page, Section } from './docs'

const meta: Meta = { title: 'Foundations/Typography' }
export default meta

const SAMPLES: Record<TypeName, string> = {
  'display-xl': 'Design & build',
  'display-l': 'Design & build',
  'heading-l': 'Things I have shipped',
  'heading-m': 'Things I have shipped',
  'body-l':
    'A product designer who writes the code. I care about the seams — the places where a design meets its implementation and usually loses something.',
  'body-m': 'A product designer who writes the code. I care about the seams.',
  'body-s': 'A product designer who writes the code. I care about the seams.',
  'label-l': 'Contact',
  'label-m': 'View project',
  'label-s': 'View project',
  eyebrow: 'Case study',
  caption: 'Last updated July 2026',
}

const ORDER: TypeName[] = [
  'display-xl', 'display-l', 'heading-l', 'heading-m',
  'body-l', 'body-m', 'body-s',
  'label-l', 'label-m', 'label-s',
  'eyebrow', 'caption',
]

function spec(name: TypeName) {
  const t = type[name]
  const weight = { 400: 'Regular', 500: 'Medium', 600: 'SemiBold' }[t.fontWeight] ?? String(t.fontWeight)
  const tracking = t.letterSpacing === '0' ? '' : ` / ${t.letterSpacing}`
  return `${weight} ${t.fontSize} / ${t.lineHeight}${tracking}`
}

export const Typography: StoryObj = {
  render: () => (
    <Page
      title="Typography"
      lede="Geist Variable, set globally on body. Display/XL is fluid because it drives the hero; every other step is fixed."
    >
      <Section title="The ramp">
        <div style={{ display: 'flex', flexDirection: 'column', gap: space.xl }}>
          {ORDER.map((name) => (
            <div
              key={name}
              style={{
                display: 'flex',
                gap: space['2xl'],
                alignItems: 'baseline',
                flexWrap: 'wrap',
                paddingBottom: space.lg,
                borderBottom: `1px solid ${color.border.subtle}`,
              }}
            >
              <div style={{ width: 200, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
                <span style={{ ...type['label-m'], color: color.text.primary }}>{name}</span>
                <Mono>{spec(name)}</Mono>
              </div>
              <p style={{ ...type[name], margin: 0, color: color.text.primary, maxWidth: '52ch', flex: 1 }}>
                {SAMPLES[name]}
              </p>
            </div>
          ))}
        </div>
      </Section>
    </Page>
  ),
}
