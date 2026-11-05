/**
 * The "Getaway / Great Hunt" saved loadout — the user's real Prismatic Warlock card on
 * D2 Conflux's Loadouts page — as data for `LoadoutCard.tsx`. It was rendered in the
 * running app (stubbed backend, Nov 5 2026) with the real card's subclass, armor and
 * every mod placed (each picked off `loadouts.jpg` by matching its icon against the
 * manifest's candidates), and every name, stat line, tooltip text and icon below is
 * read off that render's DOM. Icons are self-hosted under `public/.../conflux/icons`.
 */
import { icon } from './confluxTheme'

const I = (file: string) => icon(`/common/destiny2_content/icons/${file}`)

/** A mod, ability, aspect or fragment: its art and the app's plug tooltip. */
export interface Plug {
  name: string
  icon: string
  /** What kind of plug it is ("Aspect", "Melee"…), after an em dash. */
  suffix?: string
  /** Armor-stat line (fragments' ±10). */
  stats?: string
  /** What it does; newlines are kept (the tooltip is `pre-line`). */
  description?: string
  /** Tuning mods leave out the square plate the other mods bake in; the app paints white 14% behind them. */
  plate?: boolean
}

/** One armor piece's column: its tile and its mod sockets (`null` = empty socket). */
export interface Piece {
  name: string
  slot: string
  exotic?: boolean
  icon: string
  watermark: string
  /** The archetype's primary-stat glyph in the label bar, blackened. */
  archetypeIcon: string
  power: number
  masterworked?: boolean
  tier: number
  /** The stat mod and the tuning socket. */
  top: (Plug | null)[]
  /** The three slot mods. */
  bottom: (Plug | null)[]
}

/** A plug's plain label (alt / aria-label): the name, kind, then the stat line. */
export const plugLabel = (p: Plug) => {
  const title = p.suffix ? `${p.name} — ${p.suffix}` : p.name
  return p.stats ? `${title}\n${p.stats}` : title
}

export const LOADOUT_NAME = 'Getaway / Great Hunt'
export const LOADOUT_META = 'Warlock · Prismatic · edited 2 hours ago'

/** Each set-bonus perk the piece count unlocks: a round blue cell with the perk's glyph. */
export const SET_BONUSES = [
  { label: '2pc Great Hunt', perk: 'Taken Barrier', icon: I('28dc5b70823b878a972034c6eb05e666.png') },
  { label: '4pc Great Hunt', perk: 'Taken Armaments', icon: I('738273f563c6cc73bfde01357418adde.png') },
]

/** The stat line, in the app's display order (Health, Melee, Grenade, Super, Class, Weapons). */
export const STAT_TOTAL = 500
export const STATS = [
  { label: 'Health', icon: I('717b8b218cc14325a54869bef21d2964.png'), value: 15 },
  { label: 'Melee', icon: I('fa534aca76d7f2d7e7b4ba4df4271b42.png'), value: 35 },
  { label: 'Grenade', icon: I('065cdaabef560e5808e821cefaeaa22c.png'), value: 150 },
  { label: 'Super', icon: I('585ae4ede9c3da96b34086fccccdc8cd.png'), value: 80 },
  { label: 'Class', icon: I('7eb845acb5b3a4a9b7e0b2f05f5c43f1.png'), value: 60 },
  { label: 'Weapons', icon: I('bc69675acdae9e6b9a68a02fb4d62e07.png'), value: 160 },
]

/** The Super as the subclass box's badge: a full-bleed diamond, outlined in Solar's line. */
export const SUBCLASS = {
  name: 'Prismatic Warlock',
  superName: 'Song of Flame',
  superIcon: I('ed2e5deb9b67c0120468ee136f98f2b2.png'),
  /** `color-mix(in srgb, var(--subclass-solar) 60%, white)` at 55%. */
  diamondStroke: 'color-mix(in srgb, #e87a32 60%, white)',
}

export const ABILITIES: Plug[] = [
  { name: 'Pocket Singularity', icon: I('afd8d014a0cf2e76a73172beae7ef0ee.jpg'), suffix: 'Melee',
    description:
      'Launch an unstable ball of Void energy that detonates when it nears a target, pushing them away from the blast and making them volatile.  \n\nProvides multiple charges.' },
  { name: 'Storm Grenade', icon: I('9f4ace2bd6ab050148f54ff6f4ce9a0f.jpg'), suffix: 'Grenade',
    description:
      'A grenade that calls down a focused lightning storm.' },
]

export const ASPECTS: Plug[] = [
  { name: "Weaver's Call", icon: I('5d38da97f92b3bdfef333a418ab8caf5.jpg'), suffix: 'Aspect',
    description:
      'Activate your class ability to weave three Threadlings and deploy any Threadlings you have perched.\n\nDealing damage and defeating targets generates perched Threadlings.' },
  { name: 'Feed the Void', icon: I('178bb0e78e55c5b960aa6f42660b9b66.jpg'), suffix: 'Aspect',
    description:
      'Defeat a target with any ability to activate Devour.\n\nYour Devour effects are improved, restoring additional health and grenade energy.' },
]

export const FRAGMENTS: Plug[] = [
  { name: 'Facet of Courage', icon: I('536765c9ed5e2f53268859591e8e9acf.png'), suffix: 'Fragment', stats: '+10 Grenade',
    description:
      'Your [Arc] Arc, [Solar] Solar, and [Void] Void abilities deal increased damage to targets afflicted with Darkness debuffs.\n\n+10 Grenade ▲' },
  { name: 'Facet of Ruin', icon: I('058a2677d6742227811e81d8c4354270.png'), suffix: 'Fragment', stats: '+10 Weapons',
    description:
      'Increases the size and damage of the burst when you shatter a Stasis crystal or frozen target, and increases the area of effect of Solar ignitions.\n\n+10 Weapon ▲' },
  { name: 'Facet of Protection', icon: I('b6d90ee669fc1fef2e22ff95188be313.png'), suffix: 'Fragment', stats: '+10 Melee',
    description:
      'While surrounded by combatants, you are more resistant to incoming damage. While transcendent, the effect is increased.\n\n+10 Melee ▲' },
  { name: 'Facet of Purpose', icon: I('7a6b1d98544eb4a8512c6be0b6486456.png'), suffix: 'Fragment', stats: '−10 Class',
    description:
      'Picking up an Orb of Power grants either Bolt Charge, Restoration, Frost Armor, Woven Mail, or Overshield based on the damage type of your equipped Super.\n\n-10 Class ▼' },
  { name: 'Facet of Dominance', icon: I('9a8bc8a614afe98844541df966a2c274.png'), suffix: 'Fragment', stats: '−10 Grenade',
    description:
      'Your Void grenades weaken targets, and your Arc grenades jolt targets.\n\n-10 Grenade ▼' },
]

export const PIECES: Piece[] = [
  {
    name: 'Hood of the Great Hunt',
    slot: 'Helmet',
    icon: I('d67fcc57ea9130643f2020598fc2df85.jpg'),
    watermark: I('e78fd9419f99464816ac8f628bc3c4af.png'),
    archetypeIcon: I('bc69675acdae9e6b9a68a02fb4d62e07.png'),
    power: 550,
    tier: 5,
    top: [
      { name: '+10 Grenade', icon: I('774854aa449ce8053f708b88d10d35c5.png') },
      { name: '+5 Weapons / −5 Health', icon: I('0899571e750ec89a444483bc8c0710ce.png'), plate: true },
    ],
    bottom: [
      { name: 'Heavy Ammo Finder', icon: I('fdcbb78db8f38cec62ec7ca2dbab12cc.png'),
        description:
          'Increases the effect of all contributions towards the Heavy ammo meter.\n\nMultiple copies of this mod stack and improve its effects.' },
      { name: 'Heavy Ammo Finder', icon: I('fdcbb78db8f38cec62ec7ca2dbab12cc.png'),
        description:
          'Increases the effect of all contributions towards the Heavy ammo meter.\n\nMultiple copies of this mod stack and improve its effects.' },
      { name: 'Heavy Ammo Scout', icon: I('660d372a9a47d94d229216582b6e0e49.png'),
        description:
          'When you fill your Heavy ammo meter, it also creates smaller bricks of Heavy ammo for your allies.\n\nMultiple copies of this mod stack, creating more ammo for your allies for each additional copy equipped.' },
    ],
  },
  {
    name: 'Getaway Artist',
    slot: 'Arms',
    exotic: true,
    icon: I('a2350076ae19cf474a88a0c2a440c93f.jpg'),
    watermark: I('2c022e452f395db7b1daec1cb44631fc.png'),
    archetypeIcon: I('bc69675acdae9e6b9a68a02fb4d62e07.png'),
    power: 544,
    masterworked: true,
    tier: 5,
    top: [
      { name: '+5 Class', icon: I('234a96c207a03c8f3bf213e7447f78d4.png') },
      { name: '+5 Weapons / −5 Health', icon: I('0899571e750ec89a444483bc8c0710ce.png'), plate: true },
    ],
    bottom: [
      { name: 'Firepower', icon: I('19e250848bd065ff0b36b410697d2bf5.png'),
        description:
          'Your grenade final blows create Orbs of Power.\n\nEquipping multiple copies of this mod increases the potency of the generated Orb and reduces the duration of the cooldown.' },
      { name: 'Firepower', icon: I('19e250848bd065ff0b36b410697d2bf5.png'),
        description:
          'Your grenade final blows create Orbs of Power.\n\nEquipping multiple copies of this mod increases the potency of the generated Orb and reduces the duration of the cooldown.' },
      { name: 'Grenade Font', icon: I('5edbc054d836cc9f8504e938bd0c0a35.png'),
        description:
          'You gain a bonus to your grenade stat while you have any Armor Charge. Your Armor Charge decays over time.\n\nMultiple copies of this mod can be stacked to increase the potency of its effect, with diminishing returns for each additional copy of the mod.' },
    ],
  },
  {
    name: 'Robes of the Great Hunt',
    slot: 'Chest',
    icon: I('fb10acf6220b725be2444aba354895e0.jpg'),
    watermark: I('e78fd9419f99464816ac8f628bc3c4af.png'),
    archetypeIcon: I('bc69675acdae9e6b9a68a02fb4d62e07.png'),
    power: 550,
    tier: 5,
    top: [
      { name: '+10 Grenade', icon: I('774854aa449ce8053f708b88d10d35c5.png') },
      { name: '+5 Grenade / −5 Health', icon: I('979240653d97bcac0763bd5a67dcaee2.png'), plate: true },
    ],
    bottom: [
      { name: 'Charged Up', icon: I('0a2dc686c46b4d7d09c53274fadd49f9.png'),
        description:
          'Increases the maximum number of stacks of Armor Charge you can carry by 1.\n\nMultiple copies of this mod stack and improve its effects.' },
      { name: 'Solar Resistance', icon: I('fe0331978affdc68f1825a8a94e444c9.png'),
        description:
          'Reduces incoming Solar damage from combatants.\n\nMultiple copies of this mod can be stacked to increase the potency of its effect, with diminishing returns for each additional copy of the mod.' },
      { name: 'Concussive Dampener', icon: I('6df50890b5e91f346630ab461cd78388.png'),
        description:
          'Reduces incoming area-of-effect damage from combatants.\n\nMultiple copies of this mod can be stacked to increase the potency of its effect, with diminishing returns for each additional copy of the mod.' },
    ],
  },
  {
    name: 'Boots of the Great Hunt',
    slot: 'Legs',
    icon: I('58b6b1dcdb64322e0d1761c6981bbf55.jpg'),
    watermark: I('e78fd9419f99464816ac8f628bc3c4af.png'),
    archetypeIcon: I('065cdaabef560e5808e821cefaeaa22c.png'),
    power: 550,
    tier: 5,
    top: [
      { name: '+10 Grenade', icon: I('774854aa449ce8053f708b88d10d35c5.png') },
      { name: '+5 Grenade / −5 Health', icon: I('979240653d97bcac0763bd5a67dcaee2.png'), plate: true },
    ],
    bottom: [
      { name: 'Weapons Font', icon: I('d50bb589a2497a809716093ca7ea5300.png'),
        description:
          'You gain a bonus to your weapons stat while you have any Armor Charge. Your Armor Charge decays over time.\n\nMultiple copies of this mod can be stacked to increase the potency of its effect, with diminishing returns for each additional copy of the mod.' },
      { name: 'Stacks on Stacks', icon: I('780fe3859af46613015a5d2670907612.png'),
        description:
          'Picking up an Orb of Power grants you 1 additional stack of Armor Charge.\n\nEquipping additional copies of this mod provides no benefit.' },
      null,
    ],
  },
  {
    name: 'Bond of the Great Hunt',
    slot: 'Class Item',
    icon: I('42a98e2899a0de554316233b2547c15e.jpg'),
    watermark: I('e78fd9419f99464816ac8f628bc3c4af.png'),
    archetypeIcon: I('bc69675acdae9e6b9a68a02fb4d62e07.png'),
    power: 550,
    tier: 5,
    top: [
      { name: '+5 Grenade', icon: I('e8b5cabcee36d609239a508097ac5773.png') },
      { name: '+5 Class / −5 Health', icon: I('da62cf43e206687a9756a41a2af68048.png'), plate: true },
    ],
    bottom: [
      { name: 'Time Dilation', icon: I('7b1acb2fa35c4eb1e752ba46538f0175.png'),
        description:
          'Your decaying Armor Charge has a longer duration.\n\nMultiple copies of this mod can be stacked to extend the duration of its effect, with diminishing returns for each additional copy of the mod.' },
      { name: 'Powerful Attraction', icon: I('f66a443a73883ec0c196ac7be4551cfc.png'),
        description:
          'Automatically collects nearby Orbs of Power when you activate your class ability.\n\nMultiple copies of this mod can be stacked to increase the potency of its effect, with diminishing returns for each additional copy of the mod.' },
      { name: 'Class Font', icon: I('859a93ee38aa9cf96d96c8a4b55d59a4.png'),
        description:
          'Collecting an Orb of Power causes you to gain 1 temporary Armor Charge.\n\nYou gain a bonus to your class stat while you have any Armor Charge. Your Armor Charge decays over time.\n\nMultiple copies of this mod can be stacked to increase the potency of its effect, with diminishing returns for each additional copy of the mod.' },
    ],
  },
]

export type MenuIcon =
  | 'optimize'
  | 'equip'
  | 'save'
  | 'edit'
  | 'tag'
  | 'share'
  | 'copy'
  | 'dim'
  | 'delete'

/** The card's actions menu, in order; `null` is a separator. */
export const MENU: ({ label: string; icon: MenuIcon; submenu?: boolean; destructive?: boolean } | null)[] = [
  { label: 'Optimize', icon: 'optimize' },
  { label: 'Equip', icon: 'equip' },
  { label: 'Save in-game', icon: 'save' },
  { label: 'Edit', icon: 'edit' },
  { label: 'Tag', icon: 'tag', submenu: true },
  { label: 'Share', icon: 'share' },
  null,
  { label: 'Duplicate', icon: 'copy' },
  { label: 'Copy item IDs', icon: 'copy' },
  { label: 'Open in DIM', icon: 'dim' },
  null,
  { label: 'Delete', icon: 'delete', destructive: true },
]
