import { Shader, FlutedGlass, LinearGradient, MultiPointGradient } from 'shaders/react'
import type { CSSProperties } from 'react'
import { PALETTES, type FlutedPalette, type PaletteName } from '../flutedPalettes'

/**
 * A fluted-glass refraction over a colour bed — the frame no3y Code's card art
 * is drawn from. It was baked to a JPEG while the pinned `shaders` was v2.5,
 * which had neither `FlutedGlass` nor multi-stop `LinearGradient`; both landed
 * in v3, so the composition can run live again.
 *
 * Two beds, because the file's frame reads as both: `linear` is a multi-stop
 * axis (capped at the library's 8 stops), `mesh` is five placed points, which
 * holds a colour in a corner the way an axis can't.
 */

export type FlutedGradientProps = {
  /** A key into `PALETTES`, or a palette written out. */
  palette?: PaletteName | FlutedPalette
  /** Which colour bed the flutes refract. */
  bed?: 'linear' | 'mesh'
  /** Cross-section of each flute. */
  shape?: 'bars' | 'rounded' | 'waves'
  /** Flutes across the longest axis. The editor's slider stops at 20; the prop
   *  itself doesn't, and the file's frame is far finer than 20 across a card. */
  frequency?: number
  /** Flute direction in degrees — 0 is the file's vertical bars. */
  angle?: number
  /** How hard each flute bends the bed under it. */
  refraction?: number
  /** RGB split at the flute seams. */
  aberration?: number
  /** Specular strength on each flute. Carries most of the flute's read: pure
   *  refraction of a smooth bed lands back on nearly the same smooth bed. */
  highlight?: number
  /** Seam softness — 0 is a flat middle with sharp seams. */
  softness?: number
  /** Drifts the flutes sideways. 0 (the default) is static, like the export. */
  speed?: number
  /** How the gradient's colours blend. `oklab` keeps the mid-tones off grey. */
  colorSpace?: 'linear' | 'oklab' | 'oklch' | 'hsl' | 'hsv' | 'lch'
  style?: CSSProperties
  className?: string
}

export default function FlutedGradient({
  palette = 'no3y',
  bed = 'linear',
  shape = 'bars',
  frequency = 90,
  angle = 0,
  refraction = 2.5,
  aberration = 0.2,
  highlight = 1.2,
  softness = 0.1,
  speed = 0,
  colorSpace = 'oklab',
  style,
  className,
}: FlutedGradientProps) {
  const p: FlutedPalette = typeof palette === 'string' ? PALETTES[palette] : palette

  return (
    <Shader
      colorSpace="srgb"
      className={className}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        ...style,
      }}
    >
      <FlutedGlass
        shape={shape}
        angle={angle}
        frequency={frequency}
        softness={softness}
        refraction={refraction}
        aberration={aberration}
        highlight={highlight}
        speed={speed}
        edges="mirror"
      >
        {bed === 'linear' ? (
          <LinearGradient
            stops={p.stops}
            start={p.start ?? { x: 0, y: 0.5 }}
            end={p.end ?? { x: 1, y: 0.5 }}
            colorSpace={colorSpace}
          />
        ) : (
          <MultiPointGradient
            colorA={p.mesh[0].color}
            positionA={{ x: p.mesh[0].x, y: p.mesh[0].y }}
            colorB={p.mesh[1].color}
            positionB={{ x: p.mesh[1].x, y: p.mesh[1].y }}
            colorC={p.mesh[2].color}
            positionC={{ x: p.mesh[2].x, y: p.mesh[2].y }}
            colorD={p.mesh[3].color}
            positionD={{ x: p.mesh[3].x, y: p.mesh[3].y }}
            colorE={p.mesh[4].color}
            positionE={{ x: p.mesh[4].x, y: p.mesh[4].y }}
            colorSpace={colorSpace}
          />
        )}
      </FlutedGlass>
    </Shader>
  )
}
