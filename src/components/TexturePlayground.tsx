import { useEffect, useRef, useState } from 'react'
import Button from '../design-system/Button'
import { color, radius, type } from '../design-system/tokens'
import { MARK } from '../introTimeline'
import { pixelPath } from '../pixelFaces'
import { DEFAULT_SWATCHES, SWATCH_NAMES, type Swatch } from '../pixelTexture'
import { DEFAULT_SETTINGS, LANDING_SETTINGS, type Settings } from '../textureSettings'
import { TextureCanvas, type FaceWeight, type GlyphSet, type RippleFrom } from './PixelTexture'

/*
  The Texture tab: a playground for `PixelTexture`'s canvas (Nov 11 2026),
  every control over one `Settings` object, with presets and a colour picker.
  It's a reference, not part of the site: the rail only lists it on the dev
  server, and `App` imports it only there, so a production build leaves it
  out. The home page's texture is `HomeTexture`, on the Landing preset.
*/

const GLYPH_SET_OPTIONS: { id: GlyphSet; label: string }[] = [
  { id: 'faces', label: 'Faces' },
  { id: 'leaves', label: 'Leaves' },
  { id: 'shapes', label: 'Shapes' },
]
const FACE_WEIGHT_OPTIONS: { id: FaceWeight; label: string }[] = [
  { id: 'thin', label: 'Thin' },
  { id: 'bold', label: 'Bold' },
]

const RIPPLE_FROM_OPTIONS: { id: RippleFrom; label: string }[] = [
  { id: 'centre', label: 'Centre' },
  { id: 'top', label: 'Top' },
  { id: 'bottom', label: 'Bottom' },
  { id: 'left', label: 'Left' },
  { id: 'right', label: 'Right' },
  { id: 'bottom-left', label: 'Bottom-left' },
]

function Segmented<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: T
  options: { id: T; label: string }[]
  onChange: (next: T) => void
}) {
  return (
    <div role="group" aria-label={label} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <span style={{ ...type['label-s'], color: color.text.muted, minWidth: '48px' }}>{label}</span>
      <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
        {options.map((option) => (
          <Button
            key={option.id}
            size="xs"
            variant={option.id === value ? 'secondary' : 'ghost'}
            aria-pressed={option.id === value}
            onClick={() => onChange(option.id)}
          >
            {option.label}
          </Button>
        ))}
      </div>
    </div>
  )
}

function OnOff({ label, value, onChange }: { label: string; value: boolean; onChange: (next: boolean) => void }) {
  return (
    <Segmented
      label={label}
      value={value ? 'on' : 'off'}
      onChange={(next) => onChange(next === 'on')}
      options={[
        { id: 'on', label: 'On' },
        { id: 'off', label: 'Off' },
      ]}
    />
  )
}

/** `Segmented` for a set: each option toggles, and the last one on stays on. */
function MultiSegmented<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: T[]
  options: { id: T; label: string }[]
  onChange: (next: T[]) => void
}) {
  return (
    <div role="group" aria-label={label} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <span style={{ ...type['label-s'], color: color.text.muted, minWidth: '48px' }}>{label}</span>
      <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
        {options.map((option) => {
          const on = value.includes(option.id)
          return (
            <Button
              key={option.id}
              size="xs"
              variant={on ? 'secondary' : 'ghost'}
              aria-pressed={on}
              onClick={() => {
                if (on && value.length === 1) return
                onChange(on ? value.filter((id) => id !== option.id) : options.map((o) => o.id).filter((id) => id === option.id || value.includes(id)))
              }}
            >
              {option.label}
            </Button>
          )
        })}
      </div>
    </div>
  )
}

const intro = { display: 'flex', flexDirection: 'column', gap: '8px', maxWidth: '700px' } as const
const controlsRow = { display: 'flex', flexWrap: 'wrap', columnGap: '24px', rowGap: '8px' } as const

/** The logo's own ground and ink, the intro sheet's cream and the mark's black, in either theme. */
const LOGO_COLORS = { ground: '#f5efe0', text: '#0f0e0e' }
/** The mark's 23 squares and two cells of field round them. */
const LOGO_FIT = MARK.length + 4

function useSettings(initial: Settings) {
  const [settings, setSettings] = useState(initial)
  const set = <K extends keyof Settings>(key: K) => (value: Settings[K]) => setSettings((prev) => ({ ...prev, [key]: value }))
  return [settings, set, setSettings] as const
}

type Preset = { name: string; settings: Settings }

/** Presets kept in the code, so they're there in every browser. */
const BUILT_IN_PRESETS: Preset[] = [
  {
    // Nov 11 2026, the user's pick: the swaying edge in small, bleeding patches.
    name: 'Edge patches',
    // A ring from the bottom rather than a sweep from the left (the user's ask, same day).
    settings: { ...DEFAULT_SETTINGS, shape: 'edge', faceWeight: 'bold', size: 'S', rippleFrom: 'bottom' },
  },
  { name: 'Landing', settings: LANDING_SETTINGS },
]


const PRESETS_KEY = 'texture-presets'

/**
 * A stored preset laid over the defaults, so one saved before a control
 * existed still loads, with that control at its default.
 */
function withDefaults(stored: Partial<Settings>): Settings {
  const settings = { ...DEFAULT_SETTINGS, ...stored }
  // Ripple was On / Off before it had kinds.
  const ripple: unknown = settings.ripple
  if (typeof ripple === 'boolean') settings.ripple = ripple ? 'ring' : 'off'
  // Taper was On / Off for a few minutes too.
  const taper: unknown = settings.taper
  if (typeof taper === 'boolean') settings.taper = taper ? 'short' : 'off'
  return settings
}

const sameSettings = (a: Settings, b: Settings) =>
  (Object.keys(DEFAULT_SETTINGS) as (keyof Settings)[]).every((key) => JSON.stringify(a[key]) === JSON.stringify(b[key]))

/** Presets saved in this browser (a per-viewer convenience: storage failing just means none). */
function useSavedPresets() {
  const [saved, setSaved] = useState<Preset[]>(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(PRESETS_KEY) ?? '[]')
      return Array.isArray(stored)
        ? stored
            .filter((p) => p && typeof p.name === 'string' && p.settings && typeof p.settings === 'object')
            .map((p) => ({ name: p.name, settings: withDefaults(p.settings) }))
        : []
    } catch {
      return []
    }
  })
  const write = (next: Preset[]) => {
    setSaved(next)
    try {
      localStorage.setItem(PRESETS_KEY, JSON.stringify(next))
    } catch {
      // Private window or blocked storage: the presets just won't outlive the page.
    }
  }
  const save = (name: string, settings: Settings) =>
    write([...saved.filter((p) => p.name !== name), { name, settings }])
  const remove = (name: string) => write(saved.filter((p) => p.name !== name))
  return { saved, save, remove }
}

/**
 * The presets row: the built-in ones, then any saved in this browser (each
 * with a × to delete), the one matching the current settings filled in, and
 * Save, which names the current settings as a new preset (a name already
 * taken is overwritten).
 */
function PresetBar({ settings, onLoad }: { settings: Settings; onLoad: (settings: Settings) => void }) {
  const { saved, save, remove } = useSavedPresets()
  const [naming, setNaming] = useState<string | null>(null)
  const commit = () => {
    const name = naming?.trim()
    if (name) save(name, settings)
    setNaming(null)
  }

  return (
    <div role="group" aria-label="Presets" style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
      <span style={{ ...type['label-s'], color: color.text.muted, minWidth: '48px' }}>Presets</span>
      <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', alignItems: 'center' }}>
        {BUILT_IN_PRESETS.map((preset) => {
          const active = sameSettings(preset.settings, settings)
          return (
            <Button
              key={`built-in-${preset.name}`}
              size="xs"
              variant={active ? 'secondary' : 'ghost'}
              aria-pressed={active}
              onClick={() => onLoad(preset.settings)}
            >
              {preset.name}
            </Button>
          )
        })}
        {saved.map((preset) => {
          const active = sameSettings(preset.settings, settings)
          return (
            <span key={`saved-${preset.name}`} style={{ display: 'inline-flex', alignItems: 'center' }}>
              <Button
                size="xs"
                variant={active ? 'secondary' : 'ghost'}
                aria-pressed={active}
                onClick={() => onLoad(preset.settings)}
                style={{ borderTopRightRadius: 0, borderBottomRightRadius: 0, paddingRight: '8px' }}
              >
                {preset.name}
              </Button>
              <Button
                size="xs"
                variant={active ? 'secondary' : 'ghost'}
                aria-label={`Delete the ${preset.name} preset`}
                title="Delete"
                onClick={() => remove(preset.name)}
                style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0, borderLeftWidth: 0, paddingInline: '8px' }}
              >
                ×
              </Button>
            </span>
          )
        })}
        {naming === null ? (
          <Button size="xs" variant="ghost" onClick={() => setNaming('')}>
            Save…
          </Button>
        ) : (
          <form
            onSubmit={(event) => {
              event.preventDefault()
              commit()
            }}
            style={{ display: 'inline-flex', gap: '4px', alignItems: 'center' }}
          >
            <input
              autoFocus
              aria-label="Preset name"
              placeholder="Name"
              value={naming}
              onChange={(event) => setNaming(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Escape') setNaming(null)
              }}
              style={{
                ...type['label-s'],
                height: '28px',
                width: '140px',
                boxSizing: 'border-box',
                padding: '0 10px',
                borderRadius: radius.full,
                border: `1px solid ${color.border.default}`,
                background: 'transparent',
                color: color.text.primary,
              }}
            />
            <Button size="xs" variant="secondary" type="submit" disabled={!naming.trim()}>
              Save
            </Button>
            <Button size="xs" variant="ghost" type="button" onClick={() => setNaming(null)}>
              Cancel
            </Button>
          </form>
        )}
      </div>
    </div>
  )
}

function SharedControls({
  settings,
  set,
}: {
  settings: Settings
  set: ReturnType<typeof useSettings>[1]
}) {
  return (
    <>
      <Segmented
        label="Mix"
        value={settings.mixMode}
        onChange={set('mixMode')}
        options={[
          { id: 'patches', label: 'Patches' },
          { id: 'scatter', label: 'Scatter' },
          { id: 'density', label: 'Density' },
          { id: 'tiles', label: 'Tiles' },
          { id: 'bare', label: 'Bare' },
        ]}
      />
      <Segmented
        label="Patch"
        value={settings.patchSize}
        onChange={set('patchSize')}
        options={[
          { id: 'S', label: 'S' },
          { id: 'M', label: 'M' },
          { id: 'L', label: 'L' },
        ]}
      />
      <Segmented
        label="Bleed"
        value={settings.bleed}
        onChange={set('bleed')}
        options={[
          { id: 'none', label: 'None' },
          { id: 'some', label: 'Some' },
          { id: 'lots', label: 'Lots' },
        ]}
      />
      <Segmented
        label="Field"
        value={settings.field}
        onChange={set('field')}
        options={[
          { id: 'full', label: 'Full' },
          { id: 'near', label: 'Near' },
          { id: 'none', label: 'None' },
        ]}
      />
      <MultiSegmented label="Glyphs" value={settings.glyphs} onChange={set('glyphs')} options={GLYPH_SET_OPTIONS} />
      <Segmented label="Faces" value={settings.faceWeight} onChange={set('faceWeight')} options={FACE_WEIGHT_OPTIONS} />
      <Segmented
        label="Colour"
        value={settings.palette}
        onChange={set('palette')}
        options={[
          { id: 'mono', label: 'Mono' },
          { id: 'leaf', label: 'Leaf' },
        ]}
      />
      <Segmented
        label="Size"
        value={settings.size}
        onChange={set('size')}
        options={[
          { id: 'S', label: 'S' },
          { id: 'M', label: 'M' },
          { id: 'L', label: 'L' },
        ]}
      />
      <Segmented
        label="Speed"
        value={settings.speed}
        onChange={set('speed')}
        options={[
          { id: 'slow', label: 'Slow' },
          { id: 'normal', label: 'Normal' },
          { id: 'fast', label: 'Fast' },
        ]}
      />
      <Segmented
        label="Ripple"
        value={settings.ripple}
        onChange={set('ripple')}
        options={[
          { id: 'off', label: 'Off' },
          { id: 'ring', label: 'Ring' },
          { id: 'sweep', label: 'Sweep' },
        ]}
      />
      {settings.ripple !== 'off' && (
        <Segmented label="From" value={settings.rippleFrom} onChange={set('rippleFrom')} options={RIPPLE_FROM_OPTIONS} />
      )}
      <OnOff label="Streaks" value={settings.streaks} onChange={set('streaks')} />
      <OnOff label="Flow" value={settings.flow} onChange={set('flow')} />
    </>
  )
}

/** A pixel tick for a swatch that's on, 1 unit a square like the glyphs. */
const TICK = pixelPath(['......##', '.....##.', '##..##..', '.####...', '..##....'])

const RECENTS_KEY = 'texture-recent-colours'
const RECENTS_MAX = 12
const HEX = /^#?([0-9a-f]{6})$/i

/**
 * The colours you've replaced, newest first, kept in this browser (a
 * per-viewer convenience, so storage failing just means an empty list).
 */
function useRecents() {
  const [recents, setRecents] = useState<string[]>(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(RECENTS_KEY) ?? '[]')
      return Array.isArray(stored) ? stored.filter((c): c is string => typeof c === 'string' && HEX.test(c)) : []
    } catch {
      return []
    }
  })
  const add = (colour: string) =>
    setRecents((prev) => {
      const next = [colour, ...prev.filter((c) => c.toLowerCase() !== colour.toLowerCase())].slice(0, RECENTS_MAX)
      try {
        localStorage.setItem(RECENTS_KEY, JSON.stringify(next))
      } catch {
        // Private window or blocked storage: the list just won't outlive the page.
      }
      return next
    })
  return [recents, add] as const
}

/** A row of colour chips to pick from; the one matching `current` is ringed. */
function ChipRow({
  label,
  colours,
  current,
  onPick,
  empty,
}: {
  label: string
  colours: string[]
  current: string
  onPick: (colour: string) => void
  empty?: string
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <span style={{ ...type['label-s'], color: color.text.muted }}>{label}</span>
      {colours.length === 0 ? (
        <span style={{ ...type['caption'], color: color.text.muted }}>{empty}</span>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 24px)', gap: '6px' }}>
          {colours.map((colour, i) => {
            const selected = colour.toLowerCase() === current.toLowerCase()
            return (
              <button
                key={`${colour}-${i}`}
                type="button"
                aria-label={`Use ${colour}`}
                title={colour}
                onClick={() => onPick(colour)}
                style={{
                  width: '24px',
                  height: '24px',
                  padding: 0,
                  borderRadius: radius.sm,
                  background: colour,
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: selected
                    ? `0 0 0 2px ${color.bg.raised}, 0 0 0 3px ${color.text.primary}`
                    : 'inset 0 0 0 1px rgba(0, 0, 0, 0.18)',
                }}
              />
            )
          })}
        </div>
      )}
    </div>
  )
}

/**
 * One swatch's popover: the system picker's well and a hex field, then the
 * logo's own eight colours (always there to go back to) and the recent ones.
 */
function SwatchPopover({
  name,
  value,
  recents,
  onChange,
}: {
  name: string
  value: string
  recents: string[]
  onChange: (colour: string) => void
}) {
  const [draft, setDraft] = useState(value)
  const [prevValue, setPrevValue] = useState(value)
  // Keep the hex field in step with the well and the chips.
  if (value !== prevValue) {
    setPrevValue(value)
    setDraft(value)
  }
  const apply = (colour: string) => onChange(colour.toLowerCase())

  return (
    <div
      role="dialog"
      aria-label={`${name} colour`}
      style={{
        position: 'absolute',
        top: 'calc(100% + 8px)',
        left: 0,
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
        padding: '14px',
        width: 'max-content',
        borderRadius: radius.lg,
        background: color.bg.raised,
        border: `1px solid ${color.border.default}`,
        boxShadow: '0 12px 32px rgba(0, 0, 0, 0.28)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <input
          type="color"
          aria-label={`Pick the ${name.toLowerCase()} colour`}
          value={value}
          onChange={(event) => apply(event.target.value)}
          style={{
            width: '32px',
            height: '32px',
            padding: 0,
            border: 'none',
            borderRadius: radius.sm,
            background: 'none',
            cursor: 'pointer',
          }}
        />
        <input
          type="text"
          aria-label="Hex"
          spellCheck={false}
          value={draft}
          onChange={(event) => {
            setDraft(event.target.value)
            const match = HEX.exec(event.target.value.trim())
            if (match) apply(`#${match[1]}`)
          }}
          onBlur={() => setDraft(value)}
          style={{
            ...type['label-m'],
            fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
            width: '96px',
            height: '32px',
            boxSizing: 'border-box',
            padding: '0 8px',
            borderRadius: radius.sm,
            border: `1px solid ${color.border.default}`,
            background: 'transparent',
            color: color.text.primary,
          }}
        />
      </div>
      <ChipRow label="Logo" colours={DEFAULT_SWATCHES.map((s) => s.value)} current={value} onPick={apply} />
      <ChipRow
        label="Recent"
        colours={recents}
        current={value}
        onPick={apply}
        empty="Colours you replace show up here."
      />
    </div>
  )
}

/**
 * The leaf colours, as their four leaves' base and highlight. Each swatch's
 * well opens a popover (`SwatchPopover`); the tick beside it takes it in or
 * out (one that's out hands its cells to the other half of its leaf, or the
 * next leaf round — `resolveSlot`). All on, at the logo's own colours, by
 * default. Whatever a swatch held when its popover opened goes into the
 * recent colours when it closes, if it changed.
 */
function SwatchPicker({
  swatches,
  onChange,
  recents,
  onRecent,
}: {
  swatches: Swatch[]
  onChange: (next: Swatch[]) => void
  recents: string[]
  onRecent: (colour: string) => void
}) {
  const [open, setOpen] = useState<{ index: number; start: string } | null>(null)
  const openRef = useRef<HTMLDivElement | null>(null)
  const update = (i: number, patch: Partial<Swatch>) =>
    onChange(swatches.map((swatch, j) => (j === i ? { ...swatch, ...patch } : swatch)))
  const changed = swatches.some(
    (swatch, i) => swatch.value !== DEFAULT_SWATCHES[i].value || swatch.on !== DEFAULT_SWATCHES[i].on,
  )

  // Closing is where a replaced colour is saved, so every way out goes through here.
  const closeRef = useRef<() => void>(() => {})
  useEffect(() => {
    closeRef.current = () => {
      if (open && swatches[open.index].value.toLowerCase() !== open.start.toLowerCase()) onRecent(open.start)
      setOpen(null)
    }
  })
  useEffect(() => {
    if (!open) return
    const onPointer = (event: PointerEvent) => {
      if (!openRef.current?.contains(event.target as Node)) closeRef.current()
    }
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      closeRef.current()
      openRef.current?.querySelector<HTMLButtonElement>('button')?.focus()
    }
    document.addEventListener('pointerdown', onPointer)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onPointer)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <div role="group" aria-label="Colours" style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
      <span style={{ ...type['label-s'], color: color.text.muted, minWidth: '48px' }}>Colours</span>
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        {[0, 2, 4, 6].map((first) => (
          <div key={first} style={{ display: 'flex', gap: '4px' }}>
            {[first, first + 1].map((i) => {
              const { value, on } = swatches[i]
              const name = SWATCH_NAMES[i]
              const isOpen = open?.index === i
              return (
                <div
                  key={i}
                  ref={isOpen ? openRef : undefined}
                  style={{
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '2px',
                    padding: '2px',
                    borderRadius: radius.full,
                    border: `1px solid ${isOpen ? color.text.primary : color.border.default}`,
                  }}
                >
                  <button
                    type="button"
                    aria-label={`Change the ${name.toLowerCase()} colour`}
                    aria-expanded={isOpen}
                    aria-haspopup="dialog"
                    title={value}
                    onClick={() => {
                      if (isOpen) closeRef.current()
                      else setOpen({ index: i, start: value })
                    }}
                    style={{
                      width: '22px',
                      height: '22px',
                      padding: 0,
                      borderRadius: '50%',
                      background: value,
                      opacity: on ? 1 : 0.35,
                      border: 'none',
                      boxShadow: 'inset 0 0 0 1px rgba(0, 0, 0, 0.18)',
                      cursor: 'pointer',
                    }}
                  />
                  <button
                    type="button"
                    aria-pressed={on}
                    aria-label={`Use the ${name.toLowerCase()} colour`}
                    title={on ? 'Leave this colour out' : 'Use this colour'}
                    onClick={() => update(i, { on: !on })}
                    style={{
                      width: '22px',
                      height: '22px',
                      padding: 0,
                      borderRadius: '50%',
                      display: 'grid',
                      placeItems: 'center',
                      cursor: 'pointer',
                      background: on ? color.text.primary : 'transparent',
                      color: color.text.inverse,
                      border: on ? 'none' : `1px solid ${color.border.default}`,
                    }}
                  >
                    {on && (
                      <svg width="10" height="6.25" viewBox="0 0 8 5" shapeRendering="crispEdges" aria-hidden>
                        <path d={TICK} fill="currentColor" />
                      </svg>
                    )}
                  </button>
                  {isOpen && (
                    <SwatchPopover
                      name={name}
                      value={value}
                      recents={recents}
                      onChange={(colour) => update(i, { value: colour })}
                    />
                  )}
                </div>
              )
            })}
          </div>
        ))}
      </div>
      {changed && (
        <Button
          size="xs"
          variant="ghost"
          onClick={() => {
            // Reset counts as replacing: anything changed goes into the recents first.
            swatches.forEach((swatch, i) => {
              if (swatch.value !== DEFAULT_SWATCHES[i].value) onRecent(swatch.value)
            })
            setOpen(null)
            onChange(DEFAULT_SWATCHES)
          }}
        >
          Reset
        </Button>
      )}
    </div>
  )
}

export default function TexturePlayground() {
  const [recents, addRecent] = useRecents()
  const [settings, set, setSettings] = useSettings(DEFAULT_SETTINGS)
  const { shape, sway, outline, ground, ...canvasSettings } = settings

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={intro}>
        <h1 style={{ ...type['heading-l'], margin: 0, color: color.text.primary }}>Texture</h1>
        <p style={{ ...type['body-m'], margin: 0, color: color.text.secondary }}>
          A shape built from a grid of tiles, with my pixel faces and single leaves in place of characters. Move the
          mouse over it to stir the cells.
        </p>
      </div>
      <PresetBar settings={settings} onLoad={setSettings} />
      <div style={controlsRow}>
        <Segmented
          label="Shape"
          value={shape}
          onChange={set('shape')}
          options={[
            { id: 'circle', label: 'Circle' },
            { id: 'mark', label: 'Logo' },
            { id: 'edge', label: 'Edge' },
          ]}
        />
        {shape === 'mark' && (
          <Segmented
            label="Outline"
            value={outline}
            onChange={set('outline')}
            options={[
              { id: 'tile', label: 'Tiles' },
              { id: 'ink', label: 'Bare' },
            ]}
          />
        )}
        {shape === 'edge' && <OnOff label="Sway" value={sway} onChange={set('sway')} />}
        {shape === 'edge' && (
          <Segmented
            label="Line"
            value={settings.edgeLine}
            onChange={set('edgeLine')}
            options={[
              { id: 'sketch', label: 'Sketch' },
              { id: 'landing', label: 'Landing' },
            ]}
          />
        )}
        {shape === 'edge' && (
          <Segmented
            label="Taper"
            value={settings.taper}
            onChange={set('taper')}
            options={[
              { id: 'off', label: 'Off' },
              { id: 'short', label: 'Short' },
              { id: 'long', label: 'Long' },
            ]}
          />
        )}
        <SharedControls settings={settings} set={set} />
        <Segmented
          label="Ground"
          value={ground}
          onChange={set('ground')}
          options={[
            { id: 'page', label: 'Page' },
            { id: 'cream', label: 'Cream' },
          ]}
        />
      </div>
      {settings.palette === 'leaf' && (
        <SwatchPicker swatches={settings.swatches} onChange={set('swatches')} recents={recents} onRecent={addRecent} />
      )}
      <TextureCanvas
        {...canvasSettings}
        shape={shape}
        sway={sway}
        outline={outline}
        // The logo is a fitted grid: it keeps its size, and Size sets its grain.
        fit={shape === 'mark' ? LOGO_FIT : undefined}
        colors={ground === 'cream' ? LOGO_COLORS : undefined}
        radius={ground === 'cream' ? 24 : undefined}
        label={
          shape === 'edge'
            ? 'An animated wavering edge of pixel faces, leaves and shapes'
            : shape === 'mark'
              ? 'The four-leaf logo built from pixel faces, leaves and shapes'
              : 'An animated circle of pixel faces, leaves and shapes'
        }
      />
    </div>
  )
}
