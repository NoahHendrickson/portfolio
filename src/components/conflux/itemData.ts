/**
 * The Items page's inventory tile (D2 Conflux `components/manager/item-tile.tsx`), as
 * data for the replica in `ItemTile.tsx`. The tile's look is read off a DOM dump of the
 * running app (dark + Slate, Nov 5 2026); the six weapons are the user's picks (Nov 5
 * 2026: no kinetic weapons; Vex Mythoclast, Mint Retrograde and Kindled Orchid, plus a
 * tier 5, lower tiers and crafted ones), their art, watermarks and elements taken from
 * Bungie's item manifest (`DestinyInventoryItemDefinition` / `DestinyDamageTypeDefinition`).
 * Power, tier and champion are set by hand to show the states — none of these has an
 * intrinsic champion, so the app would show the season artifact's (anti-barrier on
 * pulses and SMGs, unstoppable on hand cannons and Deliverance, overload on Vex and the
 * grenade launcher).
 */
import { icon } from './confluxTheme'
import { PIECES } from './loadoutData'

export interface ItemTileData {
  /** React key; the same weapon can appear twice. */
  id: string
  name: string
  typeName: string
  power: number
  /** The item's art (bungie.net icon path). */
  icon: string
  /** Season / quality watermark, drawn as a luminance mask over white. */
  watermark?: string
  /** The element glyph in the label bar (weapons; armor has none). */
  damageIcon?: string
  /** Armor: its archetype's primary-stat glyph in the label bar, blackened, as the app draws it. */
  archetypeIcon?: string
  /** Kinetic's glyph is uncoloured, so the app greys it ("no element"). */
  kinetic?: boolean
  /** Gold frame, inner gold glow. */
  masterworked?: boolean
  /** Gear tier (1–5); 2–5 draw that many pips down the watermark strip. */
  tier?: number
  /** A crafted (shaped) or enhanced weapon: its glyph and red glow in the bottom-right corner. */
  craft?: 'crafted' | 'enhanced'
  /** The champion it stuns: its glyph, blackened, beside the element in the label bar. */
  breaker?: Breaker
  exotic?: boolean
}

export type Breaker = 'barrier' | 'overload' | 'unstoppable'

/** Champion glyphs (`DestinyBreakerTypeDefinition`: Shield Piercing, Disruption, Stagger) and their names. */
export const BREAKERS: Record<Breaker, { name: string; icon: string }> = {
  barrier: { name: 'Anti-Barrier', icon: icon('/common/destiny2_content/icons/DestinyBreakerTypeDefinition_07b9ba0194e85e46b258b04783e93d5d.png') },
  overload: { name: 'Overload', icon: icon('/common/destiny2_content/icons/DestinyBreakerTypeDefinition_da558352b624d799cf50de14d7cb9565.png') },
  unstoppable: { name: 'Unstoppable', icon: icon('/common/destiny2_content/icons/DestinyBreakerTypeDefinition_825a438c85404efd6472ff9e97fc7251.png') },
}
/** Narrower than this, the app leaves a tile's champion glyph to its title. */
export const CHAMPION_FOOTER = 48

const B = '/common/destiny2_content/icons/'

/** Element glyphs (`DestinyDamageTypeDefinition` icons). */
const ARC = icon(`${B}DestinyDamageTypeDefinition_092d066688b879c807c3b460afdd61e6.png`)
const SOLAR = icon(`${B}DestinyDamageTypeDefinition_2a1773e10968f2d088b97c22b22bba9e.png`)
const VOID = icon(`${B}DestinyDamageTypeDefinition_ceb2f6197dccf3958bb31cc783eb97a0.png`)
const STASIS = icon(`${B}DestinyDamageTypeDefinition_530c4c3e7981dc2aefd24fd3293482bf.png`)
const STRAND = icon(`${B}DestinyDamageTypeDefinition_b2fe51a94f3533f97079dfa0d27a4096.png`)

/** The current seasons' watermark, the one tiered (Edge of Fate on) weapons carry. */
const TIERED_MARK = icon(`${B}e78fd9419f99464816ac8f628bc3c4af.png`)

/**
 * Vex Mythoclast (exotic, masterworked), Mint Retrograde (tier 5, masterworked),
 * Kindled Orchid (tier 3), IKELOS_SMG_v1.0.3 (crafted, masterworked), Edge Transit
 * (tier 4), Deliverance (crafted). Every element but kinetic.
 */
export const ITEM_TILE_SET: ItemTileData[] = [
  {
    id: 'vex-mythoclast',
    breaker: 'overload',
    name: 'Vex Mythoclast',
    typeName: 'Fusion Rifle',
    power: 550,
    icon: icon(`${B}111a10b59029fc6a9ca5e821267e6f6c.jpg`),
    watermark: icon(`${B}36418dde751148bd3b95a023d491ea73.png`),
    damageIcon: SOLAR,
    masterworked: true,
    exotic: true,
  },
  {
    id: 'mint-retrograde',
    breaker: 'barrier',
    name: 'Mint Retrograde',
    typeName: 'Pulse Rifle',
    power: 550,
    icon: icon(`${B}fcb3832c5d129eb787c2fff1506f70c3.jpg`),
    watermark: TIERED_MARK,
    damageIcon: STRAND,
    masterworked: true,
    tier: 5,
  },
  {
    id: 'kindled-orchid',
    breaker: 'unstoppable',
    name: 'Kindled Orchid',
    typeName: 'Hand Cannon',
    power: 512,
    icon: icon(`${B}b7795be7e1f59f4e7f0c17028210f969.jpg`),
    watermark: TIERED_MARK,
    damageIcon: VOID,
    tier: 3,
  },
  {
    id: 'ikelos-smg',
    breaker: 'barrier',
    name: 'IKELOS_SMG_v1.0.3',
    typeName: 'Submachine Gun',
    power: 535,
    icon: icon(`${B}f12d04f740f02f82958233a55fa259f5.jpg`),
    watermark: icon(`${B}41d05b7cb5cc0a384af07ee9b7d36dd2.png`),
    damageIcon: ARC,
    masterworked: true,
    craft: 'crafted',
  },
  {
    id: 'edge-transit',
    breaker: 'overload',
    name: 'Edge Transit',
    typeName: 'Grenade Launcher',
    power: 547,
    icon: icon(`${B}728e25f53bcdda0e6e60acb2c8605f21.jpg`),
    watermark: TIERED_MARK,
    damageIcon: VOID,
    tier: 4,
  },
  {
    id: 'deliverance',
    breaker: 'unstoppable',
    name: 'Deliverance',
    typeName: 'Fusion Rifle',
    power: 498,
    icon: icon(`${B}b32b09e7a3e0cf827ca1bea39dc71d05.jpg`),
    watermark: icon(`${B}0b441021fbc328e6d0e2abc895f5c96e.png`),
    damageIcon: STASIS,
    craft: 'crafted',
  },
]

/** The app's tile: 60px wide (frame included), a 16px label bar, 8px between tiles. */
export const TILE_WIDTH = 60
export const TILE_FOOTER = 16
export const TILE_GAP = 8
/** Narrower than this, the bar's glyph and Power sit flush (no 2px gap). */
export const ROOMY_FOOTER = 56

/** The tile's title (newline-joined) — the app's `title`; its aria-label joins with ", ". */
export const tileLabel = (item: ItemTileData) =>
  [item.name, item.typeName, `Power ${item.power}`, item.breaker ? BREAKERS[item.breaker].name : undefined, item.craft === 'crafted' ? 'Crafted' : item.craft === 'enhanced' ? 'Enhanced' : undefined]
    .filter(Boolean)
    .join('\n')

/**
 * Tier pip geometry on the watermark's 96-unit grid (`armor-thumb.tsx`, Figma 173:311):
 * rounded squares turned 45°, 7.64 a side, centred on x 12.5, 13.3 apart from y 32.8.
 */
const pct = (units: number) => `${(units / 96) * 100}%`
export const PIP_SIDE = pct(7.64)
export const PIP_LEFT = pct(12.5 - 7.64 / 2)
export const pipTop = (i: number) => pct(32.8 + i * 13.3 - 7.64 / 2)
export const PIP_FILL = {
  gold: 'conic-gradient(from 180deg, #F4BE0C 0%, #F5C41B 12.5%, #F7CA2A 25%, #F9D649 50%, #FCE368 75%, #FFEF86 100%)',
  purple: 'conic-gradient(from 180deg, #A58BE0 0%, #AE96E5 12.5%, #B8A2EA 25%, #C9B8F0 50%, #DCCFF6 75%, #EEE7FC 100%)',
  white: 'conic-gradient(from 180deg, #D6D6D6 0%, #E4E4E4 25%, #F2F2F2 50%, #FFFFFF 100%)',
}
export const pipFill = (tier: number) =>
  tier === 5 ? PIP_FILL.gold : tier === 4 ? PIP_FILL.purple : PIP_FILL.white

/**
 * The craft glyph's box on the 96-unit grid (Bungie's are 18; the enhanced diamond a touch
 * larger) and its centre, the strip's x 12.5 / y 80.5 mirrored into the bottom-right corner
 * (`armor-thumb.tsx`).
 */
export const CRAFT_GLYPH_SIZE = { crafted: 14.7, enhanced: 17 } as const
export const CRAFT_GLYPH_X = 96 - 12.5
export const CRAFT_GLYPH_Y = 80.5

/**
 * Copies of each weapon in the vault, for the item card's "Compare N copies" button (it
 * only shows past one). Set by hand so every weapon shows it (Nov 5 2026); kept here,
 * not in the generated `itemDetailsData.ts`, so a regeneration doesn't drop it.
 */
export const ITEM_COPIES: Record<string, number> = {
  'vex-mythoclast': 2,
  'mint-retrograde': 3,
  'kindled-orchid': 2,
  'ikelos-smg': 2,
  'edge-transit': 4,
  deliverance: 2,
}

/**
 * The loadout card's five Great Hunt / Getaway Artist pieces as inventory tiles (Nov 5
 * 2026), stacked beside the item card to fill the room the stat targets jut into. Same
 * art, tier pips, archetype glyph and Power as on the loadout card.
 */
export const ARMOR_TILES: ItemTileData[] = PIECES.map((p) => ({
  id: `armor-${p.slot.toLowerCase().replace(/\s+/g, '-')}`,
  name: p.name,
  typeName: p.slot,
  power: p.power,
  icon: p.icon,
  watermark: p.watermark,
  archetypeIcon: p.archetypeIcon,
  masterworked: p.masterworked,
  tier: p.tier,
  exotic: p.exotic,
}))
