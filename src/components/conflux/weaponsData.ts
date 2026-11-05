/**
 * Sample data and helpers for the D2 Conflux weapon replicas (`PopularityCard`,
 * `WeaponList`, Nov 5 2026). Every value is read off a DOM dump of the running app
 * (`/weapons`: the popularity card and the top of the search list), not
 * Figma. Icons are file names under `ICONS` (pass them through `icon()` from
 * `confluxTheme.ts`), saved from bungie.net; the weapon-type silhouettes are the
 * app's own `/weapon-types/*.svg`. Kept out of the component files so Fast Refresh
 * sees components only.
 */

/** A pick per perk column (keyed by column index), like the app's `Roll`. */
export type Roll = Record<number, number>

export interface PerkShare {
  name: string
  icon: string
  /** Share of counted copies running it (0–1). */
  share: number
  /** The share bar's colour, graded green (most run) to red (least) within its column. */
  grade: string
}

export interface PerkColumnShares {
  /** The column's name: its section's label, and the prefix in each perk's tooltip. */
  label: string
  perks: PerkShare[]
}

export interface ComboShare {
  leftColumn: number
  left: number
  rightColumn: number
  right: number
  share: number
}

/**
 * Mint Retrograde's columns (Nov 5 2026; Fatebringer (Timelost) until then — its 12-perk
 * trait columns ran the card ~290px taller than the column beside it), every perk in the
 * grid's order, generated from the app's own public data the way its `useWeaponPopularity`
 * builds the view: the perk-popularity snapshot (noahhendrickson.github.io/d2-conflux-data,
 * weapon 1715391576) over the app's catalog (`public/data/weapons.json`). Shares are each
 * perk's share of its column; grades are the app's `gradeColor` (green for the column's
 * most run, red for its least, mixed in OKLCH).
 */
export const POPULARITY_COLUMNS: PerkColumnShares[] = [
  {
    label: 'Barrel',
    perks: [
      { name: 'Volatile Launch', icon: 'd255c9140cf640cfc820f995d1c1e96a.png', share: 0.2051, grade: 'color-mix(in oklch, #54c55f 100%, #ff8f84)' },
      { name: 'Confined Launch', icon: '0a783b44bf9fc49b4bed0a93dfa21d5d.png', share: 0.1753, grade: 'color-mix(in oklch, #54c55f 76%, #ff8f84)' },
      { name: 'Countermass', icon: '6fda396e0f2fa3c2eceac79e39f9c44b.png', share: 0.146, grade: 'color-mix(in oklch, #54c55f 52%, #ff8f84)' },
      { name: 'Hard Launch', icon: '8bedf618841b334417b8f95c2aa35d57.png', share: 0.1214, grade: 'color-mix(in oklch, #54c55f 32%, #ff8f84)' },
      { name: 'Linear Compensator', icon: '5059f4059a4c59d0003f8fedf8987b78.png', share: 0.1165, grade: 'color-mix(in oklch, #54c55f 28%, #ff8f84)' },
      { name: 'Quick Launch', icon: 'dfad5d8b00b79c4393943b791a624874.png', share: 0.1542, grade: 'color-mix(in oklch, #54c55f 59%, #ff8f84)' },
      { name: 'Smart Drift Control', icon: '5c9fe3f49086b4d6cecc3431751edc02.png', share: 0.0815, grade: 'color-mix(in oklch, #54c55f 0%, #ff8f84)' },
    ],
  },
  {
    label: 'Magazine',
    perks: [
      { name: 'Appended Mag', icon: 'd9f468cce26fe35d9db413e2f8451127.png', share: 0.2095, grade: 'color-mix(in oklch, #54c55f 100%, #ff8f84)' },
      { name: 'Tactical Mag', icon: 'f0e309a267b25279a871d182f8910bcc.png', share: 0.17, grade: 'color-mix(in oklch, #54c55f 72%, #ff8f84)' },
      { name: 'Extended Mag', icon: '66cfea124e24e73cca1ce6370b44ca7e.png', share: 0.1306, grade: 'color-mix(in oklch, #54c55f 44%, #ff8f84)' },
      { name: 'Alloy Magazine', icon: '069170916c98748b7b3e33b80bd7d689.png', share: 0.0808, grade: 'color-mix(in oklch, #54c55f 9%, #ff8f84)' },
      { name: 'Flared Magwell', icon: 'f95e67e4ff37466505d66d3fa1030782.png', share: 0.1322, grade: 'color-mix(in oklch, #54c55f 46%, #ff8f84)' },
      { name: 'High-Velocity Rounds', icon: '2a2b757cd73305126990cd19ad011a2c.png', share: 0.1288, grade: 'color-mix(in oklch, #54c55f 43%, #ff8f84)' },
      { name: 'Implosion Rounds', icon: '3ec484f0a65df7da9bbc5582c708574b.png', share: 0.0676, grade: 'color-mix(in oklch, #54c55f 0%, #ff8f84)' },
      { name: 'High-Explosive Ordnance', icon: '1e81b08badb2fa8ce16e9df925294f45.png', share: 0.0805, grade: 'color-mix(in oklch, #54c55f 9%, #ff8f84)' },
    ],
  },
  {
    label: 'Left perk',
    perks: [
      { name: 'Beacon Rounds', icon: '53b269a1760611b75170abde8ff1032c.png', share: 0.1838, grade: 'color-mix(in oklch, #54c55f 39%, #ff8f84)' },
      { name: 'Rewind Rounds', icon: 'a201fd61905b802867b677cf927e6e04.png', share: 0.3997, grade: 'color-mix(in oklch, #54c55f 100%, #ff8f84)' },
      { name: 'Field Prep', icon: '4ee1ecaead6fe2de1a2cab07f8b7be3f.png', share: 0.1654, grade: 'color-mix(in oklch, #54c55f 34%, #ff8f84)' },
      { name: 'Hatchling', icon: '2f7e898e2231900ac968ffb2080fc02b.png', share: 0.1144, grade: 'color-mix(in oklch, #54c55f 19%, #ff8f84)' },
      { name: 'Impulse Amplifier', icon: '85269cc90d2005ccd6a41b5d830e223d.png', share: 0.0472, grade: 'color-mix(in oklch, #54c55f 0%, #ff8f84)' },
      { name: 'Envious Arsenal', icon: '234bcd9dc9f5e3ec850a8eac748afbde.png', share: 0.0894, grade: 'color-mix(in oklch, #54c55f 12%, #ff8f84)' },
    ],
  },
  {
    label: 'Right perk',
    perks: [
      { name: 'Bait and Switch', icon: 'bc91e95edfbc9163dd88339a93b66913.png', share: 0.2869, grade: 'color-mix(in oklch, #54c55f 100%, #ff8f84)' },
      { name: 'Chain Reaction', icon: 'd17a60978288581d13a4aab6b9fc2b0e.png', share: 0.1873, grade: 'color-mix(in oklch, #54c55f 54%, #ff8f84)' },
      { name: 'Cascade Point', icon: 'fd17b30233d244fc7115315633906f6a.png', share: 0.0693, grade: 'color-mix(in oklch, #54c55f 0%, #ff8f84)' },
      { name: 'Elemental Honing', icon: 'ac0323ff44f720a8db7ae9f4dee59af4.png', share: 0.2473, grade: 'color-mix(in oklch, #54c55f 82%, #ff8f84)' },
      { name: 'Master of Arms', icon: 'fce1ea2064814689d7ca08a2acdb1d23.png', share: 0.1163, grade: 'color-mix(in oklch, #54c55f 22%, #ff8f84)' },
      { name: 'Frenzy', icon: '23e06f4ced1b3e6476f342978ff5bb37.png', share: 0.0929, grade: 'color-mix(in oklch, #54c55f 11%, #ff8f84)' },
    ],
  },
  {
    label: 'Origin trait',
    perks: [
      { name: 'Accelerated Assault', icon: '0fe2a63b375af0d8b17ccee5ad65415b.png', share: 0.9545, grade: 'color-mix(in oklch, #54c55f 100%, #ff8f84)' },
      { name: 'Problem Solver', icon: '4ffd402a283074e0b635f7b1d963b331.png', share: 0.037, grade: 'color-mix(in oklch, #54c55f 3%, #ff8f84)' },
      { name: 'Vanguard Determination', icon: '0eac4566f9f8eb2179d2734e886f958e.png', share: 0.0086, grade: 'color-mix(in oklch, #54c55f 0%, #ff8f84)' },
    ],
  },
]

/** The left and right perk columns, by index into `POPULARITY_COLUMNS`. */
const LEFT = 2
const RIGHT = 3

/** The five most run left + right combos, most run first. */
export const POPULARITY_COMBOS: ComboShare[] = [
  { leftColumn: LEFT, left: 1, rightColumn: RIGHT, right: 0, share: 0.1308 },
  { leftColumn: LEFT, left: 1, rightColumn: RIGHT, right: 3, share: 0.124 },
  { leftColumn: LEFT, left: 1, rightColumn: RIGHT, right: 1, share: 0.0575 },
  { leftColumn: LEFT, left: 0, rightColumn: RIGHT, right: 0, share: 0.0555 },
  { leftColumn: LEFT, left: 0, rightColumn: RIGHT, right: 1, share: 0.0484 },
]

/**
 * What "Try most popular roll" picks: each column's most run perk, with the
 * traits from the top combo (Volatile Launch, Appended Mag, Rewind Rounds, Bait and Switch, Accelerated Assault), the app's `mostPopularRoll`.
 */
export const POPULARITY_TOP_ROLL: Roll = { 0: 0, 1: 0, [LEFT]: 1, [RIGHT]: 0, 4: 0 }

/** The info tooltip's copy, verbatim; the last line is the sample it was dumped with. */
export const POPULARITY_HOW = [
  "We find players through PvE matches and read the perks on the legendary weapons they have equipped, plus the ones in their vault when it's public. Players signed in here count with their whole vault. Each copy counts once, while its owner keeps playing and still has it.",
  'Each percentage is the share of those copies with that perk, or with that left and right perk together.',
] as const
export const POPULARITY_SAMPLE = '19,276 copies, as of Nov 5, 8 AM.'

/** A share as a whole percent; nobody at all is "0%", a few people "<1%" (the app's `percent`). */
export const percent = (share: number) =>
  share === 0 ? '0%' : share < 0.01 ? '<1%' : `${Math.round(share * 100)}%`

/** Whether every pick in `roll` is already picked. */
export const isPicked = (picked: Roll, roll: Roll) =>
  Object.entries(roll).every(([key, perk]) => picked[Number(key)] === perk)

/** The app's `pickRoll`: picks the roll's perks, or un-picks them if they're all picked already. */
export function pickRoll(picked: Roll, roll: Roll): Roll {
  const keys = Object.keys(roll).map(Number)
  if (isPicked(picked, roll))
    return Object.fromEntries(Object.entries(picked).filter(([key]) => !keys.includes(Number(key))))
  return { ...picked, ...roll }
}

export type Element = 'Arc' | 'Solar' | 'Void' | 'Stasis' | 'Strand' | 'Kinetic'
export type Ammo = 'Primary' | 'Special' | 'Heavy'

export interface WeaponRow {
  name: string
  icon: string
  /** The season watermark, laid over the icon as a luminance mask. */
  watermark: string
  type: string
  /** The type's silhouette, drawn as a mask in the ink colour. */
  typeIcon: string
  element: Element
  elementIcon: string
  frame: string
  frameIcon: string
  ammo: Ammo
  /** Bungie's grey ammo glyph, drawn as a mask in the HUD colour. */
  ammoIcon: string
  champions: { name: string; icon: string }[]
}

/** The first seven rows of the weapon search on its default sort (Newest). */
export const WEAPONS: WeaponRow[] = [
  {
    name: 'Trendsetter',
    icon: '1e15181de98f54dddb74707a54893713.jpg',
    watermark: 'e78fd9419f99464816ac8f628bc3c4af.png',
    type: 'Auto Rifle',
    typeIcon: 'auto_rifle.svg',
    element: 'Arc',
    elementIcon: 'DestinyDamageTypeDefinition_092d066688b879c807c3b460afdd61e6.png',
    frame: 'Adaptive Frame',
    frameIcon: '967fb4abc6ab98f74639d6c08e5f56ee.png',
    ammo: 'Primary',
    ammoIcon: '30850order_icon_ammo_primary.v2.png',
    champions: [{ name: 'Barrier', icon: 'DestinyBreakerTypeDefinition_07b9ba0194e85e46b258b04783e93d5d.png' }],
  },
  {
    name: 'Sullen Claw',
    icon: '2e37778d6c3cdcbd3d32819f735522c2.jpg',
    watermark: '95f7754d52d6016fdc445fb62aa7a31e.png',
    type: 'Sword',
    typeIcon: 'sword.svg',
    element: 'Void',
    elementIcon: 'DestinyDamageTypeDefinition_ceb2f6197dccf3958bb31cc783eb97a0.png',
    frame: 'Lightweight Frame',
    frameIcon: '6db8cd21c2b3e6fffeb6f111d6c70dd2.png',
    ammo: 'Heavy',
    ammoIcon: '30870order_icon_ammo_heavy.v2.png',
    champions: [{ name: 'Overload', icon: 'DestinyBreakerTypeDefinition_da558352b624d799cf50de14d7cb9565.png' }],
  },
  {
    name: 'Bitter End',
    icon: '7676ddf1e3306b5f61b7d58eadcef875.jpg',
    watermark: '95f7754d52d6016fdc445fb62aa7a31e.png',
    type: 'Machine Gun',
    typeIcon: 'machinegun.svg',
    element: 'Arc',
    elementIcon: 'DestinyDamageTypeDefinition_092d066688b879c807c3b460afdd61e6.png',
    frame: 'Balanced Heat Weapon',
    frameIcon: 'b46e3f554098e175b34f6abe2b311c7c.png',
    ammo: 'Heavy',
    ammoIcon: '30870order_icon_ammo_heavy.v2.png',
    champions: [{ name: 'Overload', icon: 'DestinyBreakerTypeDefinition_da558352b624d799cf50de14d7cb9565.png' }],
  },
  {
    name: 'Conspiracy Honed',
    icon: 'c7fef3b2cd1832d11841b7f7e0b04604.jpg',
    watermark: '95f7754d52d6016fdc445fb62aa7a31e.png',
    type: 'Sniper Rifle',
    typeIcon: 'sniper_rifle.svg',
    element: 'Stasis',
    elementIcon: 'DestinyDamageTypeDefinition_530c4c3e7981dc2aefd24fd3293482bf.png',
    frame: 'Dynamic Heat Weapon',
    frameIcon: '4e065ecc7e8166279873c55b563b5311.png',
    ammo: 'Special',
    ammoIcon: '30871order_icon_ammo_special.v2.png',
    champions: [{ name: 'Overload', icon: 'DestinyBreakerTypeDefinition_da558352b624d799cf50de14d7cb9565.png' }],
  },
  {
    name: 'Voltaic Shade',
    icon: '943d41dc70ecc2b3d4d48ead9673cb5b.jpg',
    watermark: '95f7754d52d6016fdc445fb62aa7a31e.png',
    type: 'Scout Rifle',
    typeIcon: 'scout_rifle.svg',
    element: 'Arc',
    elementIcon: 'DestinyDamageTypeDefinition_092d066688b879c807c3b460afdd61e6.png',
    frame: 'Balanced Heat Weapon',
    frameIcon: 'b46e3f554098e175b34f6abe2b311c7c.png',
    ammo: 'Primary',
    ammoIcon: '30850order_icon_ammo_primary.v2.png',
    champions: [{ name: 'Overload', icon: 'DestinyBreakerTypeDefinition_da558352b624d799cf50de14d7cb9565.png' }],
  },
  {
    name: 'High Tyrant',
    icon: 'c407c0039ceddedd9f6c43c7b1a49f1c.jpg',
    watermark: '95f7754d52d6016fdc445fb62aa7a31e.png',
    type: 'Pulse Rifle',
    typeIcon: 'pulse_rifle.svg',
    element: 'Void',
    elementIcon: 'DestinyDamageTypeDefinition_ceb2f6197dccf3958bb31cc783eb97a0.png',
    frame: 'Balanced Heat Weapon',
    frameIcon: 'b46e3f554098e175b34f6abe2b311c7c.png',
    ammo: 'Primary',
    ammoIcon: '30850order_icon_ammo_primary.v2.png',
    champions: [{ name: 'Overload', icon: 'DestinyBreakerTypeDefinition_da558352b624d799cf50de14d7cb9565.png' }],
  },
  {
    name: 'Zealous Ideal',
    icon: '2e86eec32721d89f885b1b9c2b2f03f7.jpg',
    watermark: '95f7754d52d6016fdc445fb62aa7a31e.png',
    type: 'Auto Rifle',
    typeIcon: 'auto_rifle.svg',
    element: 'Solar',
    elementIcon: 'DestinyDamageTypeDefinition_2a1773e10968f2d088b97c22b22bba9e.png',
    frame: 'Balanced Heat Weapon',
    frameIcon: 'b46e3f554098e175b34f6abe2b311c7c.png',
    ammo: 'Primary',
    ammoIcon: '30850order_icon_ammo_primary.v2.png',
    champions: [{ name: 'Overload', icon: 'DestinyBreakerTypeDefinition_da558352b624d799cf50de14d7cb9565.png' }],
  },
]

/** The catalog's size: the count shown while nothing is typed (the seven rows are its top). */
export const WEAPON_TOTAL = 1335
export const CATALOG_UPDATED = '2026-10-18'

/** Each element's tint as RGB channels (the app's `ELEMENT_PLATE`). */
const ELEMENT_PLATE: Record<Element, string> = {
  Arc: '40 180 220',
  Solar: '255 120 40',
  Void: '125 88 194',
  Stasis: '60 140 220',
  Strand: '60 200 120',
  Kinetic: '180 180 180',
}

/**
 * A row's fill: its element's colour easing off to the right, or, for the open
 * weapon, brightening toward its end instead (the app's `nameplate`).
 */
export function nameplate(element: Element, current: boolean) {
  const tint = ELEMENT_PLATE[element]
  const [from, to] = current ? [0.3, 0.42] : [0.28, 0.12]
  return `linear-gradient(90deg, rgb(${tint} / ${from}), rgb(${tint} / ${to}))`
}

/** The in-game HUD tints for the ammo glyph (Primary takes the ink). */
export const AMMO_COLOR: Record<Ammo, string> = {
  Primary: '#fcfcf5',
  Special: '#58c26c',
  Heavy: '#7d58c2',
}

export const SORTS = [
  ['season-desc', 'Newest'],
  ['season-asc', 'Oldest'],
  ['name', 'A–Z'],
] as const
export type Sort = (typeof SORTS)[number][0]
export const sortLabel = (sort: Sort) => SORTS.find(([value]) => value === sort)?.[1] ?? 'Newest'

/**
 * The rows whose name contains `query` (ignoring case), in `sort`'s order. All
 * seven come from the newest season, so Oldest is taken as Newest reversed.
 */
export function searchWeapons(query: string, sort: Sort) {
  const q = query.trim().toLowerCase()
  const hits = WEAPONS.filter((weapon) => weapon.name.toLowerCase().includes(q))
  if (sort === 'season-asc') return hits.reverse()
  if (sort === 'name') return hits.sort((a, b) => a.name.localeCompare(b.name))
  return hits
}
