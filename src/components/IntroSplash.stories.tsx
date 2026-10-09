import { useCallback, useEffect, useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import IntroSplash from './IntroSplash'
import Button from '../design-system/Button'
import { color, radius, space, type } from '../design-system/tokens'
import { DEFAULT_INTRO, INTRO_VARIANTS, type IntroConfig } from '../introTimeline'

/**
 * The tuning harness for the logo intro. Every control replays it on change;
 * Replay (or R) restarts it at any point, Loop keeps it going, and `speed`
 * slows it down to see the order squares land in. A variant worth keeping
 * goes into `INTRO_VARIANTS` in `src/introTimeline.ts`, which also makes it
 * playable over the real page at `/?intro=<name>`.
 */
type StageArgs = IntroConfig & {
  /** Phone-sized squares, and the `spine` exit lifts instead (no spine on mobile). */
  mobile: boolean
  loop: boolean
}

/** Pause between the exit finishing and the next loop. */
const LOOP_GAP = 900
/** The home rail's spine, so the `spine` exit has something to land on. */
const SPINE_W = 48

function Stage({ mobile, loop, ...config }: StageArgs) {
  const [run, setRun] = useState(0)
  const [playing, setPlaying] = useState(true)
  const replay = useCallback(() => {
    setPlaying(true)
    setRun((n) => n + 1)
  }, [])

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.code === 'KeyR' && !event.metaKey && !event.ctrlKey) replay()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [replay])

  useEffect(() => {
    if (!loop || playing) return
    const timer = window.setTimeout(replay, LOOP_GAP)
    return () => window.clearTimeout(timer)
  }, [loop, playing, replay])

  return (
    <div style={{ position: 'fixed', inset: 0, background: color.bg.primary }}>
      {!mobile && (
        <div
          aria-hidden
          style={{ position: 'absolute', top: 0, bottom: 0, left: 0, width: SPINE_W, background: color.bg.cream }}
        />
      )}

      {playing && (
        <IntroSplash
          // Any change to the controls remounts it, which is a replay.
          key={`${run}-${JSON.stringify(config)}-${mobile}`}
          isMobile={mobile}
          config={config}
          onDone={() => setPlaying(false)}
        />
      )}

      {/* Above the intro, so Replay works mid-play. */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          bottom: space['3xl'],
          transform: 'translateX(-50%)',
          zIndex: 1001,
          display: 'flex',
          alignItems: 'center',
          gap: space.lg,
          // Its own dark pill, so it reads over the cream sheet and the page alike.
          padding: `${space.xs} ${space.lg} ${space.xs} ${space.xs}`,
          background: color.bg.primary,
          borderRadius: radius.full,
        }}
      >
        <Button size="sm" variant="secondary" onClick={replay}>
          Replay
        </Button>
        <span style={{ ...type['label-s'], color: color.text.secondary, whiteSpace: 'nowrap' }}>
          R replays · any other key or click skips
        </span>
      </div>
    </div>
  )
}

const meta: Meta<StageArgs> = {
  title: 'Motion/Intro splash',
  component: Stage,
  parameters: { layout: 'fullscreen' },
  args: { ...DEFAULT_INTRO, mobile: false, loop: false },
  argTypes: {
    draw: { control: 'inline-radio', options: ['bloom', 'scan', 'scatter', 'spin', 'fan'] },
    label: { control: 'inline-radio', options: ['type', 'sweep', 'reveal'] },
    exit: { control: 'inline-radio', options: ['spine', 'lift', 'fade'] },
    pop: { control: 'inline-radio', options: ['scale', 'instant'] },
    speed: { control: { type: 'range', min: 0.1, max: 2, step: 0.05 } },
    step: { control: { type: 'range', min: 5, max: 80, step: 1 } },
    leafStagger: { control: { type: 'range', min: 0, max: 400, step: 10 } },
    spinDeg: { control: { type: 'range', min: -1080, max: 1080, step: 15 } },
    spinPivot: { control: 'inline-radio', options: ['mark', 'leaf'] },
    spinFrom: { control: { type: 'range', min: 0, max: 1, step: 0.05 } },
    spinMs: { control: { type: 'range', min: 200, max: 2500, step: 50 } },
    letterStep: { control: { type: 'range', min: 30, max: 400, step: 10 } },
    slideMs: { control: { type: 'range', min: 200, max: 2000, step: 50 } },
    hold: { control: { type: 'range', min: 0, max: 3000, step: 50 } },
    exitMs: { control: { type: 'range', min: 100, max: 2000, step: 50 } },
  },
}
export default meta

type Story = StoryObj<StageArgs>

/** The one that ships — `DEFAULT_INTRO`. Turn the knobs from here. */
export const Playground: Story = {}

export const Bloom: Story = { args: INTRO_VARIANTS.bloom }
export const Scan: Story = { args: INTRO_VARIANTS.scan }
export const Scatter: Story = { args: INTRO_VARIANTS.scatter }

/** Each leaf whole, swinging round the mark's centre and out into place. */
export const Spin: Story = { args: INTRO_VARIANTS.spin }

/** Each leaf whole, turning about its own centre like a pinwheel blade. */
export const Pinwheel: Story = { args: INTRO_VARIANTS.pinwheel }

/**
 * The front leaf (dark green, left) alone, then the other three swept out from
 * behind it clockwise at full size, front to back, dropping off at their places
 * one by one — so nothing changes depth when they land. `leafStagger` peels
 * them off the stack in turn instead; `spinMs` is the whole sweep.
 */
export const Fan: Story = { args: INTRO_VARIANTS.fan }

/** The shipped intro at quarter speed, on a loop, to read the draw order. */
export const SlowMotion: Story = { args: { ...DEFAULT_INTRO, speed: 0.25, loop: true } }

export const Mobile: Story = { args: { ...DEFAULT_INTRO, mobile: true } }
