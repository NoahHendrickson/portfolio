import type { Meta, StoryObj } from '@storybook/react-vite'
import { ArrowUpRight, Copy, GithubLogo, Sparkle, X } from '@phosphor-icons/react'
import IconButton from './IconButton'
import { ICON_SIZE, type ButtonSize, type ButtonState, type ButtonVariant } from './buttonStyles'
import { color, controlPx, space, type } from './tokens'
import { Page, Section } from './docs'

const VARIANTS: ButtonVariant[] = ['primary', 'secondary', 'ghost']
const SIZES: ButtonSize[] = ['xs', 'sm', 'md', 'lg']
const STATES: ButtonState[] = ['default', 'hover', 'disabled']

const meta: Meta<typeof IconButton> = {
  title: 'Components/Icon Button',
  component: IconButton,
  args: { label: 'Open project', variant: 'primary', size: 'md', disabled: false },
  argTypes: {
    variant: { control: 'inline-radio', options: VARIANTS },
    size: { control: 'inline-radio', options: SIZES },
    state: { control: 'inline-radio', options: [undefined, ...STATES] },
    icon: { control: false },
  },
}
export default meta

type Story = StoryObj<typeof IconButton>

export const Playground: Story = {
  render: (args) => (
    <div style={{ display: 'flex', justifyContent: 'center', paddingTop: space['4xl'] }}>
      <IconButton {...args} icon={<ArrowUpRight size={ICON_SIZE[args.size ?? 'md']} />} />
    </div>
  ),
}

export const AllVariants: Story = {
  name: 'All variants',
  parameters: { controls: { disable: true } },
  render: () => (
    <Page
      title="Icon Button"
      lede="Circular, icon-only. Same style, size and state matrix as Button and the same control heights — xs 28, sm 32, md 36, lg 40 — with the width locked to the height so it stays a circle."
    >
      {VARIANTS.map((variant) => (
        <Section key={variant} title={variant}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: space.lg }}>
            {SIZES.map((size) => (
              <div key={size} style={{ display: 'flex', alignItems: 'center', gap: space.xl, flexWrap: 'wrap' }}>
                <span style={{ ...type['label-s'], color: color.text.muted, width: 32 }}>{size}</span>
                {STATES.map((state) => (
                  <div key={state} style={{ display: 'flex', flexDirection: 'column', gap: space.sm, alignItems: 'center' }}>
                    <IconButton
                      variant={variant}
                      size={size}
                      state={state}
                      label={`${variant} ${size} ${state}`}
                      icon={<ArrowUpRight size={ICON_SIZE[size]} />}
                    />
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

export const Sizes: Story = {
  name: 'Sizes',
  parameters: { controls: { disable: true } },
  render: () => (
    <Page title="Icon Button — sizes" lede="Each size is a perfect circle at its control height.">
      <Section title="Side by side">
        <div style={{ display: 'flex', alignItems: 'center', gap: space.xl }}>
          {SIZES.map((size) => (
            <div key={size} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: space.sm }}>
              <IconButton size={size} label={`Open, ${size}`} icon={<ArrowUpRight size={ICON_SIZE[size]} />} />
              <span style={{ ...type.caption, color: color.text.muted }}>{size} · {controlPx[size]}px</span>
            </div>
          ))}
        </div>
      </Section>
    </Page>
  ),
}

export const InUse: Story = {
  name: 'In use',
  parameters: { controls: { disable: true } },
  render: () => (
    <Page
      title="Icon Button — in use"
      lede="Only reach for an icon-only button when the icon is unambiguous on its own. Every one still needs a label prop — it becomes the aria-label."
    >
      <Section title="Examples">
        <div style={{ display: 'flex', gap: space.lg, flexWrap: 'wrap', alignItems: 'center' }}>
          <IconButton label="Open project" icon={<ArrowUpRight size={20} />} />
          <IconButton variant="secondary" label="Copy email" icon={<Copy size={20} />} />
          <IconButton variant="ghost" label="View on GitHub" icon={<GithubLogo size={20} />} />
          <IconButton variant="ghost" size="sm" label="Dismiss" icon={<X size={16} />} />
          <IconButton size="lg" label="Surprise me" icon={<Sparkle size={20} />} />
        </div>
      </Section>
    </Page>
  ),
}
