/**
 * Sample data and helpers for the optimizer replicas (`StatTargets`, `BuildCard`):
 * the values the live app rendered in a DOM dump of its optimizer (Nov 5 2026) —
 * the Stats card's six targets and their achievable maxima, and the first result
 * card's exotic, five pieces, totals and masterwork lines. The geometry helpers
 * are the app's own (`src/components/ui/slider.tsx`), so the replica's thumb, fill
 * and tick labels land where the app's do.
 */

/** The six armor stats in the app's display order, with Bungie's 51px glyphs. */
export const STATS = [
  { key: 'health', label: 'Health', glyph: '717b8b218cc14325a54869bef21d2964.png' },
  { key: 'melee', label: 'Melee', glyph: 'fa534aca76d7f2d7e7b4ba4df4271b42.png' },
  { key: 'grenade', label: 'Grenade', glyph: '065cdaabef560e5808e821cefaeaa22c.png' },
  { key: 'super', label: 'Super', glyph: '585ae4ede9c3da96b34086fccccdc8cd.png' },
  { key: 'class', label: 'Class', glyph: '7eb845acb5b3a4a9b7e0b2f05f5c43f1.png' },
  { key: 'weapons', label: 'Weapons', glyph: 'bc69675acdae9e6b9a68a02fb4d62e07.png' },
] as const

/* ── Stats card ─────────────────────────────────────────────────────────── */

/** Every stat slider runs 0–200; the number field clamps to the same. */
export const STAT_SLIDER_MAX = 200
/** The preset markers under each bar; 0 and the max sit on the row's ends instead. */
export const STAT_PRESET_TICKS = [50, 100, 150] as const
/** Achievable max per stat, as the dump's search left them (the ceiling overlay). */
export const STAT_CAPS = [180, 180, 180, 180, 180, 200] as const
/**
 * A hard-coded stand-in for the optimizer's search (Nov 5 2026): every point set on the
 * other five stats takes half a point off this one's achievable max, so the lighter
 * ceiling visibly gives way as targets move. The app works it out from your armor.
 */
export const CAP_TRADE = 0.5
export const achievableCap = (index: number, targets: readonly number[]) => {
  const others = targets.reduce((sum, v, i) => (i === index ? sum : sum + v), 0)
  return clamp(Math.round(STAT_CAPS[index] - others * CAP_TRADE), 0, STAT_CAPS[index])
}
/** What Reset returns every target to. */
export const DEFAULT_TARGETS = [0, 0, 0, 0, 0, 0] as const
/** Shift+arrow and Page Up / Down step (Base UI's `largeStep`). */
export const STAT_LARGE_STEP = 10

/** The card's width in the dump (its column at 2560). */
export const STAT_TARGETS_WIDTH = 636

/** Thumb width in px (the app's `THUMB_PX`). */
export const THUMB_PX = 2

export const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n))

export function sliderFraction(value: number, min: number, max: number) {
  return max <= min ? 0 : (value - min) / (max - min)
}

/**
 * CSS `left` for the thumb's centre at `value`. The thumb is edge-aligned (it never
 * overhangs the track), so its centre runs from THUMB_PX/2 to width − THUMB_PX/2.
 * The green fill ends on the same line.
 */
export function sliderValueLeft(value: number, min: number, max: number): string {
  const f = sliderFraction(value, min, max)
  return `calc(${f * 100}% + ${THUMB_PX / 2 - THUMB_PX * f}px)`
}

/** Fill width at `value`: 0% at min, 100% at max (the ceiling overlay). */
export function sliderFillWidth(value: number, min: number, max: number): string {
  return `${sliderFraction(value, min, max) * 100}%`
}

/** The value a pointer at `clientX` sets, mirroring Base UI's edge-aligned mapping. */
export function sliderValueAt(clientX: number, rect: DOMRect, min: number, max: number) {
  const range = rect.width - THUMB_PX
  if (range <= 0) return { value: min, x: THUMB_PX / 2 }
  const f = clamp((clientX - rect.left - THUMB_PX / 2) / range, 0, 1)
  return { value: clamp(Math.round(min + f * (max - min)), min, max), x: THUMB_PX / 2 + f * range }
}

/* ── Build card ─────────────────────────────────────────────────────────── */

/** The card's width in the dump. */
export const BUILD_CARD_WIDTH = 649

export interface ArmorPiece {
  name: string
  /** Bungie item icon (jpg) and its season watermark (png). */
  icon: string
  watermark: string
  power: number
  /** Health, Melee, Grenade, Super, Class, Weapons. */
  stats: readonly number[]
}

/** The build's exotic, shown at 56px in the header. */
export const EXOTIC = {
  name: "Khepri's Sting",
  icon: '93792e77d9b88ccf77788bdd9b25b16c.jpg',
  watermark: '58d3ec8338cc9746a2e0cf901fbcec0e.png',
}

export const PIECES: readonly ArmorPiece[] = [
  { name: 'Lightkin Mask', icon: '346e20c7e957fb4b26ef02e160f69231.jpg', watermark: '36418dde751148bd3b95a023d491ea73.png', power: 450, stats: [20, 30, 5, 5, 10, 25] },
  { name: "Khepri's Sting", icon: '93792e77d9b88ccf77788bdd9b25b16c.jpg', watermark: '58d3ec8338cc9746a2e0cf901fbcec0e.png', power: 450, stats: [20, 25, 5, 30, 5, 30] },
  { name: 'Red Moon Phantom Vest', icon: '0370f2e58544995080661e8acce6ef23.jpg', watermark: 'aeb95eb1abe8e45e1fe2573d6b3ab3c5.png', power: 450, stats: [5, 20, 30, 25, 5, 10] },
  { name: "Shadow's Strides", icon: '17c67d2d6ff6839c57dd63d7820ce54f.jpg', watermark: '58d3ec8338cc9746a2e0cf901fbcec0e.png', power: 450, stats: [20, 30, 5, 5, 10, 25] },
  { name: 'Cloak of the Exile', icon: 'ede19e6e57b9c9f49b53438c5ea0940c.jpg', watermark: '247715dd42abef457b52ef37280c0e42.png', power: 450, stats: [30, 5, 20, 10, 25, 5] },
]

/**
 * Masterwork materials, as the app's `MaterialCost` lists them (Glimmer, Enhancement Core,
 * Enhancement Prism, Ascendant Shard — its `masterwork.ts` hashes), their manifest icons.
 * The header's compact row runs them rarest first and frames the rare three (Figma 86:862).
 */
export const MATERIALS = [
  { name: 'Glimmer', icon: '88993eaeedad32f42072df6f77f47311.png' },
  { name: 'Enhancement Core', icon: '0a4eb695ed55b4e720ddc401460cc0f9.jpg', frame: 'rgb(159 60 215 / 0.6)' },
  { name: 'Enhancement Prism', icon: 'dea2a35badf7466d4c2c2697ce6e8d87.jpg', frame: 'rgb(159 60 215 / 0.6)' },
  { name: 'Ascendant Shard', icon: '0271d214fc3ec91b3def799a4b286b46.jpg', frame: '#ffd53b' },
] as const

/**
 * Made-up masterwork progress and costs (Nov 5 2026; the fixture's armor has none, so
 * the card read "masterwork unknown" throughout): every piece but the exotic at 0/5,
 * each 35,000 Glimmer, 30 Cores, 13 Prisms, 3 Shards — the shape of the user's real
 * card. Counts per `MATERIALS`, in its order; `null` is a piece already finished.
 */
export const PIECE_MASTERWORK: readonly ({ level: number; max: number; cost: readonly number[] } | null)[] = [
  { level: 0, max: 5, cost: [35000, 30, 13, 3] },
  null,
  { level: 0, max: 5, cost: [35000, 30, 13, 3] },
  { level: 0, max: 5, cost: [35000, 30, 13, 3] },
  { level: 0, max: 5, cost: [35000, 30, 13, 3] },
]
/** What finishing them all costs: the pieces' costs summed. */
export const MASTERWORK_TOTAL = MATERIALS.map((_, m) =>
  PIECE_MASTERWORK.reduce((sum, piece) => sum + (piece ? piece.cost[m] : 0), 0),
)

/** Every piece is on Balanced Tuning in the dump. */
export const BALANCED_TUNING = { label: 'Balanced Tuning', icon: '32759b0ce261d185ac8a06b7dc9cafb4.png' }

export const BUILD = {
  total: 510,
  /** Gear power: the game's average over the pieces. */
  power: 450,
  armorTotals: [95, 110, 65, 75, 55, 95],
  mods: [0, 0, 0, 0, 0, 0],
  tuning: [2, 1, 3, 3, 4, 2],
  stats: [97, 111, 68, 78, 59, 97],
} as const

export const TITLES = {
  gearPower: "Gear power — the game's average over these pieces (and your weapons, if entered)",
  notMasterworked: 'Some pieces are not fully masterworked',
  unknownCost: 'Some pieces have an unknown upgrade cost',
  power: 'Power',
}

/** Gear tier 5's gold pips (Figma 173:311's conic fill, the app's `PIP_FILL.gold`). */
export const PIP_GOLD =
  'conic-gradient(from 180deg, #F4BE0C 0%, #F5C41B 12.5%, #F7CA2A 25%, #F9D649 50%, #FCE368 75%, #FFEF86 100%)'
/** Pip geometry on the watermark's 96-unit grid: 7.64 a side, on x 12.5, 13.3 apart from y 32.8. */
const PIP_X = 12.5
const PIP_SIDE = 7.64
const PIP_FIRST_Y = 32.8
const PIP_STEP = 13.3
const pct = (units: number) => `${(units / 96) * 100}%`
export const PIP_BOXES = Array.from({ length: 5 }, (_, i) => ({
  width: pct(PIP_SIDE),
  left: pct(PIP_X - PIP_SIDE / 2),
  top: pct(PIP_FIRST_Y + i * PIP_STEP - PIP_SIDE / 2),
}))
