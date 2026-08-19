import type { Meta, StoryObj } from '@storybook/react-vite'
import FlutedGradient from './FlutedGradient'
import { PALETTES, type PaletteName } from '../flutedPalettes'
import { color, radius, space, type } from '../design-system/tokens'

const meta: Meta<typeof FlutedGradient> = {
  title: 'Shaders/Fluted gradient',
  component: FlutedGradient,
  parameters: { layout: 'fullscreen' },
  args: {
    palette: 'no3y',
    bed: 'linear',
    shape: 'bars',
    frequency: 90,
    angle: 0,
    refraction: 2.5,
    aberration: 0.2,
    highlight: 1.2,
    softness: 0.1,
    speed: 0,
    colorSpace: 'oklab',
  },
  argTypes: {
    palette: { control: 'inline-radio', options: Object.keys(PALETTES) },
    bed: { control: 'inline-radio', options: ['linear', 'mesh'] },
    shape: { control: 'inline-radio', options: ['bars', 'rounded', 'waves'] },
    frequency: { control: { type: 'range', min: 1, max: 160, step: 1 } },
    angle: { control: { type: 'range', min: 0, max: 360, step: 1 } },
    refraction: { control: { type: 'range', min: 0, max: 4, step: 0.05 } },
    aberration: { control: { type: 'range', min: 0, max: 1, step: 0.01 } },
    highlight: { control: { type: 'range', min: 0, max: 2, step: 0.05 } },
    softness: { control: { type: 'range', min: 0, max: 1, step: 0.01 } },
    speed: { control: { type: 'range', min: -1, max: 1, step: 0.01 } },
    colorSpace: {
      control: 'select',
      options: ['linear', 'oklab', 'oklch', 'hsl', 'hsv', 'lch'],
    },
    style: { control: false },
    className: { control: false },
  },
}
export default meta

type Story = StoryObj<typeof FlutedGradient>

/** The card's well: the 966 × 266 the Design-tab rows are drawn at, halved. */
const WELL = { width: 483, height: 133 }

function Well({
  caption,
  children,
  width = WELL.width,
  height = WELL.height,
}: {
  caption: string
  children: React.ReactNode
  width?: number
  height?: number
}) {
  return (
    <figure style={{ margin: 0, display: 'grid', gap: space.sm }}>
      <div
        style={{
          position: 'relative',
          width,
          height,
          borderRadius: radius.xl,
          overflow: 'hidden',
        }}
      >
        {children}
      </div>
      <figcaption style={{ ...type['label-m'], color: color.text.secondary }}>{caption}</figcaption>
    </figure>
  )
}

function Grid({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: color.bg.primary,
        padding: space['4xl'],
        display: 'flex',
        flexWrap: 'wrap',
        gap: space['3xl'],
        alignContent: 'start',
      }}
    >
      {children}
    </div>
  )
}

export const Playground: Story = {
  render: (args) => (
    <Grid>
      <Well caption="Playground — tune it with the controls" width={966} height={266}>
        <FlutedGradient {...args} />
      </Well>
    </Grid>
  ),
}

/** Both beds against the baked export, at the card's own size. */
export const AgainstTheExport: Story = {
  name: 'Against the export',
  parameters: { controls: { disable: true } },
  render: () => (
    <Grid>
      <Well caption="card-no3y.png — the baked Figma export" width={966} height={266}>
        <img
          src="/work/bento/card-no3y.png"
          alt=""
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </Well>
      <Well caption="Live — multi-stop LinearGradient bed" width={966} height={266}>
        <FlutedGradient palette="no3y" bed="linear" />
      </Well>
      <Well caption="Live — MultiPointGradient bed" width={966} height={266}>
        <FlutedGradient palette="no3y" bed="mesh" />
      </Well>
    </Grid>
  ),
}

/** Every palette on both beds. */
export const Palettes: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Grid>
      {(Object.keys(PALETTES) as PaletteName[]).flatMap((name) =>
        (['linear', 'mesh'] as const).map((bed) => (
          <Well key={`${name}-${bed}`} caption={`${PALETTES[name].label} — ${bed}`}>
            <FlutedGradient palette={name} bed={bed} />
          </Well>
        )),
      )}
    </Grid>
  ),
}

/** The knobs that change the flute itself, all on the no3y bed. */
export const Flutes: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Grid>
      {[
        { caption: 'bars — the export', props: { shape: 'bars' as const } },
        { caption: 'rounded', props: { shape: 'rounded' as const } },
        { caption: 'waves', props: { shape: 'waves' as const } },
        { caption: 'frequency 20', props: { frequency: 20 } },
        { caption: 'frequency 60', props: { frequency: 60 } },
        { caption: 'frequency 120', props: { frequency: 120 } },
        { caption: 'refraction 0.5', props: { refraction: 0.5 } },
        { caption: 'refraction 3', props: { refraction: 3 } },
        { caption: 'aberration 0.6', props: { aberration: 0.6 } },
        { caption: 'softness 0 — sharp seams', props: { softness: 0 } },
        { caption: 'highlight 1', props: { highlight: 1 } },
        { caption: 'angle 90 — horizontal', props: { angle: 90 } },
      ].map(({ caption, props }) => (
        <Well key={caption} caption={caption}>
          <FlutedGradient palette="no3y" {...props} />
        </Well>
      ))}
    </Grid>
  ),
}

/**
 * How hard the flutes read. Refraction alone barely shows on a smooth bed — it
 * bends the gradient into nearly the same gradient — so the seam softness and
 * the specular carry it.
 */
export const FluteStrength: Story = {
  name: 'Flute strength',
  parameters: { controls: { disable: true } },
  render: () => (
    <Grid>
      {[
        { caption: 'refraction only (highlight 0, soft seams)', props: { highlight: 0, softness: 1 } },
        { caption: 'highlight 1.2, softness 0.1 — the default', props: {} },
        { caption: 'highlight 1.2', props: { highlight: 1.2 } },
        { caption: 'highlight 2, softness 0', props: { highlight: 2, softness: 0 } },
        { caption: 'aberration 0.8', props: { aberration: 0.8 } },
        { caption: 'refraction 4', props: { refraction: 4 } },
      ].map(({ caption, props }) => (
        <Well key={caption} caption={caption} width={966} height={266}>
          <FlutedGradient palette="no3y" {...props} />
        </Well>
      ))}
    </Grid>
  ),
}
