/*
  The Texture playground's settings, apart from the component files so both
  can read them (Fast Refresh wants a component file to export only
  components): `TexturePlayground` (dev only) and the home page's
  `HomeTexture`, which draws the Landing settings.
*/
import type {
  Bleed,
  EdgeLine,
  FaceWeight,
  Field,
  GlyphSet,
  Mix,
  Outline,
  Palette,
  PatchSize,
  RippleFrom,
  RippleKind,
  Shape,
  Size,
  Speed,
  Taper,
} from './components/PixelTexture'
import { DEFAULT_SWATCHES, LANDING_SWATCHES, type Swatch } from './pixelTexture'

/** The controls the circle and the logo share. */
export type Settings = {
  shape: Shape
  sway: boolean
  outline: Outline
  ground: 'page' | 'cream'
  mixMode: Mix
  glyphs: GlyphSet[]
  faceWeight: FaceWeight
  palette: Palette
  size: Size
  speed: Speed
  ripple: RippleKind
  rippleFrom: RippleFrom
  streaks: boolean
  flow: boolean
  patchSize: PatchSize
  bleed: Bleed
  field: Field
  taper: Taper
  edgeLine: EdgeLine
  swatches: Swatch[]
}

export const DEFAULT_SETTINGS: Settings = {
  shape: 'circle',
  sway: true,
  outline: 'tile',
  ground: 'page',
  mixMode: 'patches',
  glyphs: ['faces', 'leaves', 'shapes'],
  faceWeight: 'thin',
  palette: 'leaf',
  size: 'M',
  speed: 'normal',
  ripple: 'ring',
  rippleFrom: 'centre',
  streaks: true,
  flow: true,
  patchSize: 'M',
  bleed: 'some',
  field: 'near',
  taper: 'off',
  edgeLine: 'sketch',
  swatches: DEFAULT_SWATCHES,
}

/**
 * The landing page's texture (Nov 11 2026, the user's pick off the
 * playground): Edge patches with the ripple off and the top leaf's highlight
 * swapped for a blue (read off their screenshot). `HomeTexture` draws it
 * mirrored, coming in from the right edge of Hi's first screen, on the
 * Landing line drawn for its tall, narrow box.
 */
export const LANDING_SETTINGS: Settings = {
  ...DEFAULT_SETTINGS,
  shape: 'edge',
  faceWeight: 'bold',
  size: 'S',
  ripple: 'off',
  // It sits on the first screen's foot, so it slopes away rather than stop at it.
  taper: 'short',
  edgeLine: 'landing',
  swatches: LANDING_SWATCHES,
}
