import { useMemo, useState } from 'react'
import { CurvedCard, CurvedCopy, CurvedFacts, CurvedMedia } from './Curved'
import Reveal from './Reveal'
import { SheetIntro, SheetPage } from './Sheet'
import ChipField from './thinking/ChipField'
import ThinkingChip from './thinking/ThinkingChip'
import { THINKING_STATES_REPO } from '../data/workCards'
import { space } from '../design-system/tokens'
import { useIsMobile } from '../hooks/useIsMobile'
import { CHIPS, GROUPS, chipById } from '../thinkingStates/chips'
import type { Shape } from '../thinkingStates/engine/types'
import { CURVED_BODY_SIZE, CURVED_INNER, SHEET_BODY, TEXT_SOFT, curvedInset, sheetGap } from '../sheetStyle'

/*
  `/work/thinking-states`, hand-built on the curved cards the other project pages run
  (`Curved.tsx`, Nov 9 2026; it was on the ruled sheet until then): the intro, a live
  field of chips as the hero with "What's in here" on its tab and Tools / Skills as a
  card of its own, then a playground (one chip on a stage beside the project's own
  controls, over every chip by family, each a button that picks it) on a plain card.
  The chips stand on dark stages, the project's
  own ground, in either theme; the controls sit on the card. Every chip is the
  project's own draw function, copied verbatim into `src/thinkingStates/`, running on
  its shared loop, so nothing here is a recording.
*/

/** The project mark's green on Contact, with fixed dark ink: white on it is unreadable. */
const THEME = {
  '--color-orange': '#4ade80',
  '--color-orange-hover': '#3cc96f',
  '--color-on-accent': '#0f0e0e',
} as React.CSSProperties

const FACTS = [
  { heading: 'Tools', items: ['Claude Opus', 'Figma', 'Storybook'] },
  { heading: 'Skills', items: ['Motion design', 'Design engineering', 'Prototyping'] },
]

const SHAPES: { id: Shape; label: string }[] = [
  { id: 'rounded', label: 'Rounded' },
  { id: 'square', label: 'Square' },
  { id: 'circle', label: 'Circle' },
  { id: 'diamond', label: 'Diamond' },
]

/** The chips' own colours, once each, as the colour swatches. */
const SWATCHES = [...new Set(CHIPS.map((chip) => chip.color.toUpperCase()))].slice(0, 9)

const PARAGRAPH: React.CSSProperties = { ...SHEET_BODY, fontSize: CURVED_BODY_SIZE, margin: 0 }

/** A dark ground for the chips, the project's own, rounded inside its card. */
const STAGE: React.CSSProperties = { background: 'var(--color-bg-primary)', borderRadius: CURVED_INNER, overflow: 'hidden' }

export default function ThinkingStates() {
  const isMobile = useIsMobile()

  return (
    <div style={THEME}>
      <SheetPage>
        <SheetIntro
          icon="/work/thinking-states/icon.svg"
          title="Thinking States"
          helper={['Side project', '2026']}
          description={[
            'This was an experiment in motion design: some loading and thinking animations for the AI stuff I was working on. I made it all by prompting Claude and never opened a design tool, to see what I could get with minimal hands-on work.',
          ]}
          links={[{ label: 'Repo', href: THINKING_STATES_REPO }]}
          inset={0}
          bodySize={CURVED_BODY_SIZE}
        />

        <div style={{ display: 'flex', flexDirection: 'column', gap: sheetGap(isMobile) }}>
          {/* The hero: the field the home card shows, wider, so the pills draw near their own size. */}
          <CurvedCard
            media={
              <div data-theme="dark" style={{ ...STAGE, position: 'relative', aspectRatio: isMobile ? '4 / 3' : '16 / 7' }}>
                <ChipField designWidth={isMobile ? 560 : 1000} />
              </div>
            }
            copy={
              <CurvedCopy
                heading="What's in here"
                body={[
                  'I wanted a set of variations I could tweak, changing the color, size and shape, and copy straight into other projects.',
                ]}
              />
            }
            side={<CurvedFacts facts={FACTS} />}
          />

          <Reveal>
            <Playground isMobile={isMobile} />
          </Reveal>
        </div>
      </SheetPage>
    </div>
  )
}

/**
 * One chip on the stage, with the project's editor controls beside it, over every
 * chip by family. Picking a chip resets the label and colour to its own and takes
 * its fixed cell shape if it has one; size and speed carry over.
 */
function Playground({ isMobile }: { isMobile: boolean }) {
  const [id, setId] = useState(CHIPS[0].id)
  const chip = chipById(id) ?? CHIPS[0]
  const [label, setLabel] = useState(chip.label)
  const [color, setColor] = useState(chip.color)
  const [shape, setShape] = useState<Shape>(chip.shape ?? 'rounded')
  const [size, setSize] = useState<16 | 24>(16)
  const [speed, setSpeed] = useState(1)

  const pick = (next: string) => {
    const c = chipById(next)
    if (!c) return
    setId(next)
    setLabel(c.label)
    setColor(c.color)
    setShape(c.shape ?? 'rounded')
  }

  const swatches = useMemo(
    () => (SWATCHES.includes(chip.color.toUpperCase()) ? SWATCHES : [chip.color.toUpperCase(), ...SWATCHES.slice(0, -1)]),
    [chip.color],
  )

  const media = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: space.sm }}>
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '3fr 2fr', gap: space.sm }}>
        {/* The stage: the icon large, then the pill and the bare chip at their real size. */}
        <div
          data-theme="dark"
          style={{
            ...STAGE,
            minHeight: isMobile ? 240 : 360,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: space['2xl'],
            padding: space['2xl'],
          }}
        >
          <ThinkingChip chip={chip} color={color} shape={shape} speed={speed} size={96} iconOnly title={chip.name} />
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', gap: space.xl }}>
            <ThinkingChip chip={chip} label={label || chip.label} color={color} shape={shape} speed={speed} size={size} shimmer />
            <ThinkingChip chip={chip} label={label || chip.label} color={color} shape={shape} speed={speed} size={size} bare />
          </div>
        </div>

        {/* The controls, on the card itself. */}
        <div style={{ padding: curvedInset(isMobile), display: 'flex', flexDirection: 'column', gap: space.xl }}>
          <Control label="Chip">
            <p style={PARAGRAPH}>
              {chip.name} <span style={{ color: TEXT_SOFT }}>/ {GROUPS.find((g) => g.id === chip.group)?.label}</span>
            </p>
          </Control>
          <Control label="Label" htmlFor="ts-label">
            <input id="ts-label" className="ts-label-input" value={label} maxLength={28} onChange={(e) => setLabel(e.target.value)} />
          </Control>
          <Control label="Colour">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: space.sm }}>
              {swatches.map((swatch) => (
                <button
                  key={swatch}
                  type="button"
                  className="ts-swatch"
                  aria-label={swatch}
                  aria-pressed={color.toUpperCase() === swatch}
                  onClick={() => setColor(swatch)}
                  style={{ background: swatch }}
                />
              ))}
            </div>
          </Control>
          <Control label="Cell shape">
            <Options options={SHAPES} value={shape} onChange={setShape} />
          </Control>
          <Control label="Icon size">
            <Options
              options={[
                { id: 16, label: '16px' },
                { id: 24, label: '24px' },
              ]}
              value={size}
              onChange={setSize}
            />
          </Control>
          <Control label={`Speed ${speed.toFixed(2)}×`} htmlFor="ts-speed">
            <input
              id="ts-speed"
              className="ts-range"
              type="range"
              min={0.25}
              max={2}
              step={0.05}
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
            />
          </Control>
        </div>
      </div>

      {/* Every chip, by family; each one picks itself onto the stage. */}
      <div
        data-theme="dark"
        style={{ ...STAGE, padding: isMobile ? space.xl : space['2xl'], display: 'flex', flexDirection: 'column', gap: space['2xl'] }}
      >
        {GROUPS.map((group) => {
          const chips = CHIPS.filter((c) => c.group === group.id)
          return (
            <div key={group.id} style={{ display: 'flex', flexDirection: 'column', gap: space.md }}>
              <p style={PARAGRAPH}>
                {group.label} <span style={{ color: TEXT_SOFT }}>/ {chips.length} / {group.blurb}</span>
              </p>
              <div role="group" aria-label={group.label} style={{ display: 'flex', flexWrap: 'wrap', gap: space.xs }}>
                {chips.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    className="ts-pick"
                    aria-pressed={c.id === id}
                    aria-label={`${c.name}: ${c.label}`}
                    title={`${c.name}: ${c.label}`}
                    onClick={() => pick(c.id)}
                  >
                    <ThinkingChip chip={c} size={24} iconOnly />
                  </button>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )

  // A plain card, no tab: the controls speak for themselves.
  return <CurvedMedia>{media}</CurvedMedia>
}

/** A control under its name: a `<label>` for an input, a group's name otherwise. */
function Control({ label, htmlFor, children }: { label: string; htmlFor?: string; children: React.ReactNode }) {
  const name = { fontSize: '14px', lineHeight: 1.3, color: TEXT_SOFT }
  return htmlFor ? (
    <div style={{ display: 'flex', flexDirection: 'column', gap: space.sm }}>
      <label htmlFor={htmlFor} style={name}>
        {label}
      </label>
      {children}
    </div>
  ) : (
    <div role="group" aria-label={label} style={{ display: 'flex', flexDirection: 'column', gap: space.sm }}>
      <span style={name}>{label}</span>
      {children}
    </div>
  )
}

function Options<T extends string | number>({
  options,
  value,
  onChange,
}: {
  options: { id: T; label: string }[]
  value: T
  onChange: (value: T) => void
}) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: space.sm }}>
      {options.map((option) => (
        <button key={option.id} type="button" className="ts-option" aria-pressed={option.id === value} onClick={() => onChange(option.id)}>
          {option.label}
        </button>
      ))}
    </div>
  )
}
