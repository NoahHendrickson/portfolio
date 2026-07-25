import type { Meta, StoryObj } from '@storybook/react-vite'
import { ArrowUpRight, CaretDown, Copy } from '@phosphor-icons/react'
import Button, { type ButtonSize, type ButtonState, type ButtonVariant } from './Button'
import { color, space, type } from './tokens'
import { Page, Section } from './docs'

const VARIANTS: ButtonVariant[] = ['primary', 'secondary', 'ghost']
const SIZES: ButtonSize[] = ['xs', 'sm', 'md', 'lg']
const STATES: ButtonState[] = ['default', 'hover', 'disabled']

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  args: { children: 'Button', variant: 'primary', size: 'md', disabled: false },
  argTypes: {
    variant: { control: 'inline-radio', options: VARIANTS },
    size: { control: 'inline-radio', options: SIZES },
    state: { control: 'inline-radio', options: [undefined, ...STATES] },
    leadingIcon: { control: false },
    trailingIcon: { control: false },
  },
}
export default meta

type Story = StoryObj<typeof Button>

export const Playground: Story = {
  render: (args) => (
    <div style={{ display: 'flex', justifyContent: 'center', paddingTop: space['4xl'] }}>
      <Button {...args} />
    </div>
  ),
}

export const AllVariants: Story = {
  name: 'All variants',
  parameters: { controls: { disable: true } },
  render: () => (
    <Page
      title="Button"
      lede="36 combinations of style, size and state — the same matrix as the Figma component set. Buttons are sized by height (xs 28, sm 32, md 36, lg 40), not by vertical padding, so a row of them lines up regardless of label or icon. Hover and disabled are pinned here; in the app they resolve from real interaction."
    >
      {VARIANTS.map((variant) => (
        <Section key={variant} title={variant}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: space.lg }}>
            {SIZES.map((size) => (
              <div key={size} style={{ display: 'flex', alignItems: 'center', gap: space.xl, flexWrap: 'wrap' }}>
                <span style={{ ...type['label-s'], color: color.text.muted, width: 32 }}>{size}</span>
                {STATES.map((state) => (
                  <div key={state} style={{ display: 'flex', flexDirection: 'column', gap: space.sm, alignItems: 'center' }}>
                    <Button variant={variant} size={size} state={state}>
                      Button
                    </Button>
                    <span style={{ ...type.caption, color: color.text.muted }}>{state}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </Section>
      ))}
    </Page>
  ),
}

export const WithIcons: Story = {
  name: 'With icons',
  parameters: { controls: { disable: true } },
  render: () => (
    <Page title="Button — with icons" lede="Icons come from the Phosphor set. Match the icon to the action, not to the button style.">
      <Section title="In use">
        <div style={{ display: 'flex', gap: space.lg, flexWrap: 'wrap', alignItems: 'center' }}>
          <Button variant="primary" size="md" trailingIcon={<CaretDown size={20} />}>
            Contact
          </Button>
          <Button variant="secondary" size="md" trailingIcon={<ArrowUpRight size={20} />}>
            View project
          </Button>
          <Button variant="ghost" size="sm" leadingIcon={<Copy size={16} />}>
            Copy email
          </Button>
          <Button variant="primary" size="lg">
            Read the case study
          </Button>
        </div>
      </Section>
    </Page>
  ),
}

export const OnCream: Story = {
  name: 'On the cream column',
  parameters: { controls: { disable: true } },
  render: () => (
    <div
      style={{
        background: color.bg.cream,
        padding: space['3xl'],
        borderRadius: 'var(--radius-3xl)',
        display: 'flex',
        gap: space.lg,
        flexWrap: 'wrap',
        alignItems: 'center',
      }}
    >
      <Button variant="primary" size="md" trailingIcon={<ArrowUpRight size={20} />}>
        Primary
      </Button>
      <Button
        variant="ghost"
        size="md"
        style={{ borderColor: color.border.ink, color: color.ink.default }}
      >
        Ghost, ink border
      </Button>
    </div>
  ),
}
