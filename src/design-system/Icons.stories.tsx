import type { Meta, StoryObj } from '@storybook/react-vite'
import type { IconWeight } from '@phosphor-icons/react'
import { icons, type IconName } from './icons'
import { color, radius, space, type } from './tokens'
import { Mono, Page, Section } from './docs'

type Args = { size: number; weight: IconWeight; color: string }

const meta: Meta<Args> = {
  title: 'Foundations/Icons',
  args: { size: 24, weight: 'duotone', color: color.text.primary },
  argTypes: {
    size: { control: { type: 'range', min: 12, max: 64, step: 2 } },
    weight: {
      control: 'inline-radio',
      options: ['thin', 'light', 'regular', 'bold', 'fill', 'duotone'],
    },
    color: {
      control: 'select',
      options: [color.text.primary, color.text.secondary, color.text.muted, color.accent.default],
    },
  },
}
export default meta

const NAMES = Object.keys(icons) as IconName[]

export const Set: StoryObj<Args> = {
  name: 'The set',
  render: (args) => (
    <Page
      title="Icons"
      lede="Phosphor, duotone weight — the same 17 icons that exist as components on the Figma page. Duotone is set once via IconContext in main.tsx, so call sites never pass a weight. The controls below let you preview the other five weights, but duotone is the system default."
    >
      <Section title={`${NAMES.length} icons`}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: space.lg }}>
          {NAMES.map((name) => {
            const Icon = icons[name]
            return (
              <div
                key={name}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: space.md,
                  padding: space.lg,
                  borderRadius: radius.lg,
                  border: `1px solid ${color.border.subtle}`,
                }}
              >
                <Icon size={args.size} weight={args.weight} color={args.color} />
                <Mono>{name}</Mono>
              </div>
            )
          })}
        </div>
      </Section>

      <Section title="Usage">
        <pre
          style={{
            ...type['body-s'],
            margin: 0,
            padding: space.lg,
            borderRadius: radius.lg,
            background: color.bg.raised,
            border: `1px solid ${color.border.subtle}`,
            color: color.text.secondary,
            fontFamily: 'ui-monospace, monospace',
            overflowX: 'auto',
          }}
        >
{`import { ArrowUpRight } from '@phosphor-icons/react'

// Weight comes from IconContext — don't pass it per call site.
<ArrowUpRight size={20} />`}
        </pre>
      </Section>
    </Page>
  ),
}
