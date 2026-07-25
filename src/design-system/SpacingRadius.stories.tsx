import type { Meta, StoryObj } from '@storybook/react-vite'
import { color, control, controlPx, radius, radiusPx, space, spacePx, type } from './tokens'
import { Mono, Page, Section } from './docs'

const meta: Meta = { title: 'Foundations/Spacing & Radius' }
export default meta

export const SpacingAndRadius: StoryObj = {
  name: 'Spacing & Radius',
  render: () => (
    <Page
      title="Spacing & Radius"
      lede="Nine spacing steps, three control heights and eight radii. Components reach for these rather than one-off pixel values — the 32px and 56px radii exist because the big panels and bento cards genuinely use them."
    >
      <Section title="Spacing">
        <div style={{ display: 'flex', flexDirection: 'column', gap: space.md }}>
          {(Object.keys(spacePx) as (keyof typeof spacePx)[]).map((key) => (
            <div key={key} style={{ display: 'flex', alignItems: 'center', gap: space.xl }}>
              <span style={{ ...type['label-m'], color: color.text.primary, width: 100 }}>{key}</span>
              <span style={{ width: 40 }}>
                <Mono>{spacePx[key]}</Mono>
              </span>
              <div
                style={{
                  width: spacePx[key],
                  height: 24,
                  background: color.accent.default,
                  borderRadius: 2,
                }}
              />
            </div>
          ))}
        </div>
      </Section>

      <Section title="Control heights">
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: space.xl, flexWrap: 'wrap' }}>
          {(Object.keys(controlPx) as (keyof typeof controlPx)[]).map((key) => (
            <div key={key} style={{ display: 'flex', flexDirection: 'column', gap: space.sm, alignItems: 'center' }}>
              <div
                style={{
                  height: control[key],
                  width: 120,
                  borderRadius: radius.full,
                  background: color.bg.raised,
                  border: `1px solid ${color.border.default}`,
                }}
              />
              <span style={{ ...type['label-s'], color: color.text.primary }}>{key}</span>
              <Mono>{controlPx[key]}</Mono>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Radius">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: space.lg }}>
          {(Object.keys(radiusPx) as (keyof typeof radiusPx)[]).map((key) => (
            <div key={key} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: space.sm }}>
              <div
                style={{
                  width: 104,
                  height: 104,
                  borderRadius: radius[key],
                  background: color.bg.raised,
                  border: `1px solid ${color.border.default}`,
                }}
              />
              <span style={{ ...type['label-s'], color: color.text.primary }}>{key}</span>
              <Mono>{radiusPx[key]}</Mono>
            </div>
          ))}
        </div>
      </Section>
    </Page>
  ),
}
