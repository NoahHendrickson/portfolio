import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import { color } from '../design-system/tokens'
import { BLOCK, DEFAULT_INTRO, LABEL, LABEL_GAP, MARK, buildIntro, type IntroConfig } from '../introTimeline'

/**
 * The first-visit intro: the logo mark and label from the July 2026 file
 * (frame `419:7381`) drawn in on a cream sheet, which then leaves to hand over
 * to the home page — by default folding into the rail's spine. `App` mounts it
 * once per browser (see `src/intro.ts`); any click, key, wheel or touch skips
 * straight to the exit.
 *
 * What draws when lives in `src/introTimeline.ts`, as an `IntroConfig`; the
 * Storybook story (`Motion/Intro splash`) is the place to replay and tune it.
 */

const LABEL_INK = color.ink.secondary
const CURSOR_INK = color.accent.default
/** The rail's spine, which the `spine` exit folds the sheet into. */
const SPINE_W = 48
const EXIT_EASE = 'cubic-bezier(0.76, 0, 0.24, 1)'
const SLIDE_EASE = 'cubic-bezier(0.65, 0, 0.35, 1)'

function squareStyle(size: number, x: number, y: number, ink: string): CSSProperties {
  return {
    position: 'absolute',
    left: x * size,
    top: y * size,
    width: size,
    height: size,
    background: ink,
  }
}

export default function IntroSplash({
  isMobile,
  onDone,
  config = DEFAULT_INTRO,
}: {
  isMobile: boolean
  onDone: () => void
  config?: IntroConfig
}) {
  const timeline = useMemo(() => buildIntro(config), [config])
  const [leaving, setLeaving] = useState(false)
  const leavingRef = useRef(false)
  const onDoneRef = useRef(onDone)

  useEffect(() => {
    onDoneRef.current = onDone
  })

  useEffect(() => {
    let doneTimer: number | undefined

    const leave = () => {
      if (leavingRef.current) return
      leavingRef.current = true
      setLeaving(true)
      doneTimer = window.setTimeout(() => onDoneRef.current(), timeline.exitMs)
    }

    const leaveTimer = window.setTimeout(leave, timeline.foldAt)
    const skipOn = ['pointerdown', 'keydown', 'wheel', 'touchstart'] as const
    skipOn.forEach((type) => window.addEventListener(type, leave, { passive: true }))

    return () => {
      window.clearTimeout(leaveTimer)
      window.clearTimeout(doneTimer)
      skipOn.forEach((type) => window.removeEventListener(type, leave))
      leavingRef.current = false
    }
  }, [timeline])

  // Integer squares keep the edges between them crisp: 6 is the frame's 6.6
  // at a 1512 laptop, 4 keeps the lockup inside a phone's width.
  const unit = isMobile ? 4 : 6
  const block = unit * BLOCK
  const gap = Math.round(LABEL_GAP * unit)
  const labelWidth = LABEL[0].length * block

  // The `reveal` label. The mark starts centred on the sheet — shifted right
  // by half of the gap plus the label — and slides back into the lockup. The
  // label sits in a window whose left edge rides the mark's right edge, and
  // slides right by the same amount inside it, so it starts tucked wholly
  // behind the mark and comes out of its edge as the two part. All three
  // share one curve, which is what keeps the edge and the label in step.
  const { slide } = timeline
  const slideBy = (gap + labelWidth) / 2
  const slideStyle = (from: number): CSSProperties | undefined =>
    slide
      ? ({
          animationDelay: `${slide.at}ms`,
          animationDuration: `${slide.ms}ms`,
          animationTimingFunction: SLIDE_EASE,
          '--slide-from': `${from}px`,
        } as CSSProperties)
      : undefined

  // The spine is the same cream, so folding down to its 48px leaves no seam.
  // Mobile has no spine (the rail is a dropdown there) and lifts instead.
  const exit = config.exit === 'spine' && isMobile ? 'lift' : config.exit
  const gone: CSSProperties =
    exit === 'fade'
      ? { opacity: 0 }
      : { clipPath: exit === 'spine' ? `inset(0 calc(100% - ${SPINE_W}px) 0 0)` : 'inset(0 0 100% 0)' }
  const squareTiming = (delay: number): CSSProperties => ({
    animationDelay: `${delay}ms`,
    animationDuration: `${timeline.popMs}ms`,
  })

  const labelArt = (
    <div style={{ position: 'relative', width: labelWidth, height: LABEL.length * block }}>
      {timeline.label.map(({ x, y, delay }) => (
        <span
          key={`${x}-${y}`}
          // `reveal` slides the label out whole rather than popping it in.
          className={slide ? undefined : 'intro-square'}
          style={{ ...squareStyle(block, x, y, LABEL_INK), ...(slide ? undefined : squareTiming(delay)) }}
        />
      ))}
      {timeline.cursor.map(({ col, from, iterations }) => (
        <span
          key={col}
          className="intro-cursor"
          style={{
            ...squareStyle(block, col, 0, CURSOR_INK),
            height: block * LABEL.length,
            animationDuration: `${timeline.blinkMs}ms`,
            animationDelay: `${from}ms`,
            animationIterationCount: iterations,
          }}
        />
      ))}
    </div>
  )

  return (
    <div
      aria-hidden
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: color.bg.cream,
        clipPath: 'inset(0 0 0 0)',
        opacity: 1,
        ...(leaving ? gone : undefined),
        transition: `clip-path ${timeline.exitMs}ms ${EXIT_EASE}, opacity ${timeline.exitMs}ms ease`,
        pointerEvents: leaving ? 'none' : 'auto',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap }}>
        <div
          className={slide ? 'intro-slide' : undefined}
          style={{
            position: 'relative',
            width: MARK[0].length * unit,
            height: MARK.length * unit,
            ...slideStyle(slideBy),
          }}
        >
          {timeline.mark.map(({ x, y, ink, delay }) => (
            <span
              key={`${x}-${y}`}
              className="intro-square"
              style={{ ...squareStyle(unit, x, y, ink), ...squareTiming(delay) }}
            />
          ))}
          {/* The `spin` draw: each leaf a layer of its own, in the file's paint
              order so the overlaps settle the way the mark draws them. */}
          {timeline.leaves.map((leaf) => (
            <div
              key={`${leaf.x}-${leaf.y}`}
              className={`intro-leaf-${leaf.role}`}
              style={
                {
                  position: 'absolute',
                  left: leaf.x * unit,
                  top: leaf.y * unit,
                  width: leaf.width * unit,
                  height: leaf.height * unit,
                  transformOrigin: `${leaf.pivot.x * unit}px ${leaf.pivot.y * unit}px`,
                  animationDelay: `${leaf.delay}ms`,
                  animationDuration: `${leaf.duration}ms`,
                  '--spin-from': `${leaf.from}deg`,
                  '--spin-scale': leaf.scale,
                } as CSSProperties
              }
            >
              {leaf.squares.map(({ x, y, ink }) => (
                <span key={`${x}-${y}`} style={squareStyle(unit, x, y, ink)} />
              ))}
            </div>
          ))}
        </div>
        {slide ? (
          // The window takes the gap back so its left edge is the mark's own.
          <div className="intro-window" style={{ marginLeft: -gap, paddingLeft: gap, ...slideStyle(slideBy) }}>
            <div className="intro-slide" style={slideStyle(-slideBy)}>
              {labelArt}
            </div>
          </div>
        ) : (
          labelArt
        )}
      </div>
    </div>
  )
}
