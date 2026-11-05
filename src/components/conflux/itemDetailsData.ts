/**
 * The six collage weapons as D2 Conflux's item details popover shows them
 * (`components/manager/item-details.tsx`), for the replica in `ItemDetails.tsx`.
 * Generated from Bungie's manifest (245114.26.10.13.2000-1-bnet.66137): each weapon's frame, perk
 * sockets and their plug sets (`DestinyInventoryItemDefinition` sockets →
 * `DestinyPlugSetDefinition`), mods and cosmetics, its stat group's display curves
 * (`DestinyStatGroupDefinition`) and investment stats. The rolled perk in each column
 * and the alternatives a tiered weapon carries are picked (plausible rolls for each
 * gear tier: tier 5 two barrels, two magazines and three per trait column, all
 * enhanced; tier 4 two of each; tier 3 two per trait column; exotics and crafted
 * weapons one per column), and the live stats are the game's: base investment plus
 * every plug's non-conditional stats through the curves, then a tiered masterwork's
 * +tier (the app's `weaponStats` / `tieredMasterworkBonus`). Perk tooltips carry
 * Bungie's descriptions and Clarity's community insight (its live `dim.json` feed),
 * base and enhanced tiers merged the way the app's `clarityLines` does.
 * Regenerate rather than hand-edit.
 */
import { icon } from './confluxTheme'

const B = '/common/destiny2_content/icons/'

/** A plug as the panel draws it: icon, name, Bungie's own description. */
export interface DetailPlug {
  hash: number
  name: string
  icon: string
  description?: string
  /** An enhanced perk: the gold arrow in the cell's corner. */
  enhanced?: boolean
}

/** A perk option; `ref` keys its tooltip in `PERK_REFS` (an enhanced plug shares its base perk's). */
export interface PerkOption extends DetailPlug {
  ref: number
}

export interface PerkColumn {
  socketIndex: number
  /** What the game calls the column's perks ("Barrel", "Trait", "Origin Trait"). */
  typeName: string
  origin: boolean
  /** The rolled perk's hash (the first option). */
  current: number
  options: PerkOption[]
}

export type ModKind = 'masterwork' | 'mod' | 'shader' | 'ornament'

/** One run of Clarity text (`x`) with its class names (`c`: bold, arc, enhancedArrow, …). */
export interface InsightRun {
  x?: string
  c?: string[]
}
/** One Clarity line; `spacer` in `c` is a gap. */
export interface InsightLine {
  c?: string[]
  t?: InsightRun[]
}

/** A perk's tooltip (the app's `PerkRef` and Clarity lines). */
export interface PerkRef {
  name: string
  description?: string
  enhancedDescription?: string
  /** Can no longer drop ("Retired"). */
  retired?: boolean
  /** Non-conditional investment by stat name — what a hover preview adds. */
  stats?: Record<string, number>
  insight?: InsightLine[]
}

/** A stat group's display curve: investment → shown value, clamped at `max`. */
export interface StatCurve {
  max: number
  points: [number, number][]
}

export interface WeaponDetails {
  /** The tile's id in `ITEM_TILE_SET`. */
  id: string
  itemHash: number
  /** 6 exotic, 5 legendary: the header plate. */
  tierType: number
  locked: boolean
  /** Copies in the inventory; over 1, the panel offers Compare. */
  copies?: number
  frame: DetailPlug
  columns: PerkColumn[]
  mods: (DetailPlug & { kind: ModKind })[]
  /** Live stats in the game's order. */
  stats: { name: string; value: number }[]
  /** Base investment per shown stat and the stat group's curves, for previews. */
  investment: Record<string, number>
  curves: Record<string, StatCurve>
}

export const PERK_REFS: Record<number, PerkRef> = {
  185041502: {
    name: 'Volatile Battery',
    description:
      'This battery simultaneously exists in multiple timelines, causing the weapon to Overcharge.\n\n  •  Greatly increases magazine size',
    stats: { Magazine: 40 },
    insight: [
      { t: [{ x: 'Sets the Magazine Size to 33, greatly exceeding that of any other fusion rifle.' }] },
      { c: ['spacer'] },
      {
        t: [
          { x: '▛ ' },
          {
            x: '...an energy cell pulling from multiple timelines, resulting in a charge surplus that can only be explained if the firing cycle began in...',
            c: ['bold'],
          },
          { x: '▟' },
        ],
      },
    ],
  },
  566815328: {
    name: "Rasputin's Arsenal",
    description: "Breaking a target's shield partially reloads this weapon's magazine.",
    insight: [
      {
        t: [
          { x: 'Refills' },
          {
            x: '50% of the Magazine (rounded up) from reserves upon breaking Elemental, Barrier Champion, or Player Shields.',
          },
        ],
      },
    ],
  },
  689005463: {
    name: 'Accelerated Coils',
    description: 'Speeds up charge.\n  •  Faster charge time\n  •  Decreases impact damage',
    stats: { Impact: -10 },
    insight: [{ t: [{ x: 'Decreases charge time by 40ms and damage by 2%.' }] }],
  },
  806917387: {
    name: 'Temporal Unlimiter',
    description:
      'Defeating targets builds stacks of Overcharge.\n\n[Alternate Weapon Action]  : When fully Overcharged, swap firing modes. In this mode, hold the trigger to charge up and fire Linear Fusion Rifle shots that cause an ignition on precision final blows.',
    insight: [
      { t: [{ x: "Kills in Auto Rifle mode grant 'Overcharge' stacks. Maximum of 6 Stacks." }] },
      { c: ['spacer'] },
      {
        t: [
          { x: 'Tier 1 and 2 Minors, as well as Tier 1 Elites' },
          { x: 'grant 1 stack. All other enemy tiers and players grant 2 stacks.' },
        ],
      },
      { c: ['spacer'] },
      {
        t: [
          {
            x: 'At 6 stacks, hold [Reload] to change this Fusion Rifle into a Linear Fusion Rifle. Grants three Hobgoblin-like shots that deal ',
          },
          { x: '1475' },
          { x: '[PVP: 537]' },
          { x: 'precision damage and 200% increased damage against ' },
          { x: 'Champions' },
          { x: '. Stowing after activation removes all charged shots.' },
        ],
      },
      { c: ['spacer'] },
      {
        t: [
          { x: 'Precision Kills while in this mode trigger a ' },
          { x: 'Solar Ignition that deals 5% more damage than base.' },
        ],
      },
      { c: ['spacer'] },
      { t: [{ x: 'Exiting Linear Mode refills the magazine.' }] },
    ],
  },
  831391274: {
    name: 'Hatchling',
    description:
      "Precision final blows or rapidly defeating targets with this weapon spawns a Threadling at the target's location.",
    enhancedDescription:
      "Precision final blows or rapidly defeating targets with this weapon spawns a Threadling at the target's location. There's a chance to spawn an increased amount of Threadlings.",
    insight: [
      {
        t: [
          { x: 'Scoring a Precision Kill or 3 kills within 3 seconds of each other spawns a ' },
          { c: ['strand'] },
          { x: "Threadling at the target's location." },
        ],
      },
      { c: ['spacer'] },
      { t: [{ c: ['enhancedArrow'] }, { x: 'Spawns an additional hatchling every ? activations.' }] },
    ],
  },
  839105230: {
    name: 'Arrowhead Brake',
    description: 'Lightly vented barrel.\n  •  Greatly controls recoil\n  •  Increases handling speed',
    stats: { 'Recoil Direction': 30, Handling: 10 },
  },
  990298390: {
    name: 'Hand-Laid Stock',
    description: 'This weapon is optimized for recoil control.\n  •  Increases stability',
    stats: { Stability: 10 },
  },
  1089671869: {
    name: 'Elemental Honing',
    description:
      'Dealing unique elemental damage grants this weapon a stacking damage bonus. This bonus is increased for kinetic weapons.',
    enhancedDescription:
      'Dealing unique elemental damage grants this weapon a stacking damage bonus for an improved duration. This bonus is increased for kinetic weapons.',
    insight: [
      {
        t: [
          {
            x: 'Dealing Elemental Damage grants a stack of Elemental Honing for 20 (↑ 23) seconds for each unique Element used. Maximum of 5 stacks.',
          },
        ],
      },
      { c: ['spacer'] },
      { t: [{ x: 'Gaining a stack refreshes the buff duration. Duration cannot be refreshed once at 5 stacks.' }] },
      { c: ['spacer'] },
      { t: [{ x: 'Buff can be activated while stowed. Kinetic Damage does not trigger the buff.' }] },
      { c: ['spacer'] },
      { t: [{ x: 'Weapon damage increase at 1|2|3|4|5 stacks by weapon damage type:' }] },
      { t: [{ x: '• Kinetic: 10%|20%|30%|35%|40%' }] },
      { t: [{ x: '• Elemental (PVE): 2.5%|10%|20%|30%|35%' }] },
      { t: [{ x: '• Elemental (PVP): 1.25%|5%|20%|30%|35%' }] },
    ],
  },
  1140096971: {
    name: 'Seraph Rounds',
    description:
      'Rounds overpenetrate targets and bounce off hard surfaces.\n• Slightly increases range\n• Increases stability',
    stats: { Range: 3, Stability: 7 },
    insight: [
      {
        t: [
          {
            x: 'Combines the overpenetration from Armor-Piercing Rounds, the guaranteed ricochets from Ricochet Rounds, and the flinch increase from High-Caliber Rounds.',
          },
        ],
      },
    ],
  },
  1168162263: {
    name: 'Outlaw',
    description: 'Precision kills greatly decrease reload time.',
    enhancedDescription: 'Precision final blows greatly decrease reload time for an improved duration.',
    insight: [
      {
        t: [
          {
            x: 'Precision Kills grant 70 Reload Speed with a 0.9x decreased Reload Animation Duration for 6 (↑ 7) seconds.',
          },
        ],
      },
      { c: ['spacer'] },
      { t: [{ x: 'Buff is removed on stow.' }] },
    ],
  },
  1428297954: {
    name: 'Perpetual Motion',
    description: 'This weapon gains bonus stability, handling, and reload speed while the wielder is in motion.',
    enhancedDescription:
      'This weapon gains bonus stability, handling, and reload speed while the wielder is in motion for a short duration.',
    insight: [
      { t: [{ x: 'While moving at a minimum of 2 meters per second:' }] },
      { t: [{ x: "Grants a Stack of 'Perpetual Motion' after 2 seconds and a second Stack after 10 (↑ 9) seconds." }] },
      { c: ['spacer'] },
      {
        t: [
          {
            x: 'Each Stack provides 10 Stability, 10 Handling, and 10 Reload Speed. All Stacks are removed if movement speed is below 2 m/s for 0.5 seconds.',
          },
        ],
      },
      { c: ['spacer'] },
      { t: [{ x: 'Works and can activate while stowed.' }] },
      { c: ['spacer'] },
      { t: [{ c: ['enhancedArrow'] }, { x: 'Second Stack is gained 1 second sooner.' }] },
    ],
  },
  1441682018: {
    name: 'Linear Compensator',
    description:
      "This weapon's launch barrel is well-balanced.\n  •  Slightly increases projectile speed\n  •  Slightly increases blast radius\n  •  Slightly increases stability",
    stats: { Stability: 5, Velocity: 5, 'Blast Radius': 5 },
  },
  1482024992: {
    name: 'Smallbore',
    description: 'Dual strength barrel.\n  •  Increases range\n  •  Increases stability',
    stats: { Stability: 7, Range: 7 },
  },
  1570042021: {
    name: 'Heating Up',
    description: 'Final blows with this weapon increase accuracy and stability while improving vertical recoil.',
    enhancedDescription:
      'Final blows with this weapon increase accuracy and stability while improving vertical recoil for a longer duration.',
    insight: [
      { t: [{ x: 'Weapon Kills grant a Stack of Heating Up for 5.5 (↑ 6.5) seconds. Maximum of 2 Stacks.' }] },
      { c: ['spacer'] },
      { t: [{ x: 'Benefits at 1|2 Stacks of Heating Up:' }] },
      { t: [{ x: '• 15|30 Stability' }] },
      { t: [{ x: '• 20|40 Recoil Direction' }] },
      { t: [{ x: '• 15%|25% decreased Accuracy Cone Size' }] },
      { t: [{ x: '• 15%|25% decreased ' }, { x: 'Accuracy Cone Growth' }] },
      { c: ['spacer'] },
      { t: [{ x: 'Buff remains active while stowed.' }] },
    ],
  },
  1844523823: {
    name: 'Confined Launch',
    description:
      "This weapon's launch parameters are particularly stable.\n  •  Greatly increases stability\n  •  Increases blast radius\n  •  Decreases projectile speed",
    stats: { Stability: 15, Velocity: -10, 'Blast Radius': 10 },
  },
  2173046394: {
    name: 'Voltshot',
    description:
      'Reloading this weapon after defeating a target overcharges this weapon for a short period of time, causing it to jolt on its next hit.',
    enhancedDescription:
      'Reloading this weapon after defeating a target overcharges this weapon for an improved short period of time, causing it to jolt on its next hit.',
    insight: [
      { t: [{ x: 'Finishing a reload within 5.3 seconds of a Weapon Kill grants Voltshot for 7 (↑ 8) seconds.' }] },
      { c: ['spacer'] },
      {
        t: [
          { x: 'While Voltshot is active, your next Weapon Hit consumes the buff and applies ' },
          { c: ['arc'] },
          { x: 'Jolt to the target.' },
        ],
      },
      { c: ['spacer'] },
      { t: [{ x: 'Applied ' }, { c: ['arc'] }, { x: "Jolt's damage (generally) does not count as Weapon Damage." }] },
      { c: ['spacer'] },
      { t: [{ c: ['enhancedArrow'] }, { x: 'Buff can be held 1 second longer.' }] },
    ],
  },
  2327629476: {
    name: "Forge's Kin",
    description:
      'Black Armory weapon final blows briefly grant ammo generation, reload speed, and damage against combatants when the weapon is redrawn. Buff potency and duration increases for each equipped Black Armory weapon.',
    enhancedDescription:
      'Black Armory weapon final blows briefly grant significantly more ammo generation, reload speed, and damage against combatants when the weapon is redrawn. Buff potency and duration significantly increases for each equipped Black Armory weapon.',
    insight: [
      {
        t: [
          {
            x: "Kills with Black Armory Weapons, or readying a Black Armory weapon within 7 seconds of any weapon kill, grants 'Forge's Kin'. Maximum of 3 stacks. Timer begins upon readying the weapon and cannot be refreshed.",
          },
        ],
      },
      { c: ['spacer'] },
      {
        t: [
          {
            x: 'Equipping and performing the above conditions with additional Black Armory weapons increases the potency and duration of the buff.',
          },
        ],
      },
      { c: ['spacer'] },
      { t: [{ x: "Forge's Kin provides the following benefits with 1|2|3 Black Armory Weapons equipped:" }] },
      { t: [{ x: '• 5|7|9 Second Buff Duration' }] },
      { t: [{ x: '• 15|?|? Reload Speed' }] },
      { t: [{ x: '• ?|?|? Ammo Generation' }] },
      {
        t: [
          { x: '• 0%|5% (' },
          { c: ['enhancedArrow'] },
          { x: '7%)|10% (' },
          { c: ['enhancedArrow'] },
          { x: '13%) Increased Damage Against Combatants' },
        ],
      },
      { c: ['spacer'] },
      {
        t: [
          { x: 'The exotic weapons ' },
          { x: "Izanagi's Burden, Jötunn, and Le Monarque" },
          { x: 'count as Black Armory weapons for the purposes of the origin trait, but do not recieve its benefits.' },
        ],
      },
    ],
  },
  2489430594: {
    name: 'Indomitability',
    description:
      'Final blows grant grenade energy when playing a Light subclass or melee energy when playing a Darkness subclass.',
    enhancedDescription:
      'Final blows grant improved grenade energy when playing a Light subclass or improved melee energy when playing a Darkness subclass.',
    insight: [
      { t: [{ x: "Weapon Kills grant ability energy based on your Super's elemental alignment:" }] },
      { t: [{ x: '• Light Super: 5% Grenade Ability Energy' }] },
      { t: [{ x: '• Dark Super: 5% Melee Ability Energy' }] },
      { c: ['spacer'] },
      {
        t: [
          {
            x: "Ability energy gained may be significantly decreased based on your selected ability's Chunk Energy Scalar. Learn more about this mechanic in ",
          },
          { x: 'our explainer blog post on the Clarity website' },
          { x: '.' },
        ],
      },
    ],
  },
  2720533289: {
    name: 'Magnificent Howl',
    description:
      'The number of precision final blows before reloading affects the total rounds granted with increased range and damage. Precision final blows with Magnificent Howl active extend the effect for additional rounds.',
    enhancedDescription:
      'The number of precision final blows before reloading affects the total rounds granted with increased range and damage. Precision final blows with Magnificent Howl active extend the effect for additional rounds. Improves reload.',
    insight: [
      {
        t: [
          { x: "Scoring a Precision Kill grants 1 Stack of 'Precision Final Blows' up to the maximum of 10 Stacks." },
        ],
      },
      { c: ['spacer'] },
      {
        t: [
          {
            x: "Reloading converts 'Precision Final Blows' Stacks into 'Magnificent Howl' Stacks. Having active 'Magnificent Howl' Stacks prevents you from gaining 'Precision Final Blows' Stacks.",
          },
        ],
      },
      { c: ['spacer'] },
      {
        t: [
          {
            x: 'Each shot consumes 1 Stack of Magnificent Howl, granting 50% (↑ 55%) increased damage and ?% increased Damage Falloff Distance.',
          },
        ],
      },
      { c: ['spacer'] },
      { t: [{ x: 'Precision Kills with buffed shots refund a Stack of Magnificent Howl.' }] },
      { c: ['spacer'] },
      { t: [{ c: ['enhancedArrow'] }, { x: 'Buff is increased by 10% (50%🠚55%).' }] },
    ],
  },
  2822142346: {
    name: 'High-Velocity Rounds',
    description:
      "This weapon's projectiles are particularly light and quick.\n  •  Increases projectile speed\n  •  Increases reload speed",
    stats: { Velocity: 10, 'Reload Speed': 10 },
  },
  2846385770: {
    name: 'Rangefinder',
    description:
      'Aiming this weapon increases its effective range and zoom magnification. Increased projectile velocity while aiming Rocket Launchers, Grenade Launchers, and Bows.',
    enhancedDescription:
      'Aiming this weapon increases its effective range and zoom magnification, and improves handling. Increased projectile velocity while aiming Rocket Launchers, Grenade Launchers, and Bows.',
    insight: [
      { t: [{ x: 'Aiming Down Sights grants the following benefits:' }] },
      { t: [{ x: '• 10 Range' }] },
      { t: [{ x: '• 10% increased Effective Zoom' }] },
      { t: [{ x: '• 5% increased Projectile Speed' }] },
      { c: ['spacer'] },
      {
        t: [
          { x: 'The Effective Zoom increase pushes out Aim Assist Falloff by 10%, reduces ' },
          { x: '(Absolute) Recoil' },
          {
            x: " by 10% and narrows the Accuracy and Aim Assist Cones by the same amount. (This is the normal behavior of Zoom and isn't unique to Rangefinder)",
          },
        ],
      },
      { c: ['spacer'] },
      { t: [{ c: ['enhancedArrow'] }, { x: 'Passively grants 5 Handling.' }] },
    ],
  },
  2859149211: {
    name: 'Beacon Rounds',
    description:
      'Final blows with this weapon grant your projectiles tracking and increase reload speed. Dealing further damage extends the duration.',
    enhancedDescription:
      'Final blows with this weapon grant your projectiles tracking and increase reload speed for an improved duration. Dealing further damage extends the duration.',
    insight: [
      { t: [{ x: 'Kills with the weapon grant a Stack of Beacon Rounds for 6 (↑ 7) seconds. Maximum of 4 Stacks.' }] },
      { c: ['spacer'] },
      {
        t: [
          {
            x: 'Scoring futher Hits with the weapon can extend the buff duration up to the maximum of 4 seconds. Buff can be activated while stowed.',
          },
        ],
      },
      { c: ['spacer'] },
      {
        t: [
          {
            x: 'Each Stack grants increased projectile tracking. Projectile Tracking is only in effect while the Targeted Reticle is active.',
          },
        ],
      },
      { c: ['spacer'] },
      { t: [{ x: 'Grants the following while you have active Stacks:' }] },
      { t: [{ x: '• 15 Reload Speed' }] },
      { t: [{ x: '• 0.9x Reload Duration Multiplier' }] },
      { t: [{ x: '• 45% increased Projectile Tracking Cone size' }] },
    ],
  },
  2888557110: {
    name: 'Full Court',
    description: 'Increases detonation damage as the projectile travels further before exploding.',
    enhancedDescription:
      'Increases detonation damage as the projectile travels farther before exploding. Increases blast radius.',
    insight: [
      {
        t: [
          {
            x: 'Starts linearly increasing Detonation and Burn (DoT) damage 0.2 seconds after the grenade projectile is fired.',
          },
        ],
      },
      { c: ['spacer'] },
      { t: [{ x: 'Reaches maximum strength after 1.1 seconds at a 35% damage increase.' }] },
      { c: ['spacer'] },
      {
        t: [
          {
            x: 'The damage increase is finalized at the point of detonation and any lingering effects left will not increase it further.',
          },
        ],
      },
      { c: ['spacer'] },
      { t: [{ c: ['enhancedArrow'] }, { x: 'Passively grants 5 Blast Radius.' }] },
    ],
  },
  2978966579: {
    name: 'Chill Clip',
    description: 'Direct hits with the top half of the magazine cause a detonation that slows nearby targets.',
    enhancedDescription: 'Direct hits with the majority of the magazine cause a detonation that slows nearby targets.',
    insight: [
      { t: [{ x: 'While at/above 50% (↑ 40%) of the Base Magazine Capacity:' }] },
      {
        t: [
          { x: 'Direct Hits apply 60 ' },
          { c: ['stasis'] },
          { x: 'Slow Stacks for ' },
          { x: '4' },
          { x: ' ' },
          { x: '[PVP: 1.5]' },
          { x: ' seconds (' },
          { x: '8' },
          { x: ' ' },
          { x: '[PVP: 2]' },
          { x: ' with ' },
          { c: ['stasis'] },
          { x: 'Whisper of Durance) to enemies within 4 meters of the target.' },
        ],
      },
      { c: ['spacer'] },
      {
        t: [
          { x: 'Micro-Missile Sidearms and Rapid-Fire Fusion Rifles only apply 40 ' },
          { c: ['stasis'] },
          { x: 'Slow Stacks.' },
        ],
      },
      { c: ['spacer'] },
      { t: [{ x: 'Only activates once per shot/burst.' }] },
      { c: ['spacer'] },
      { t: [{ c: ['enhancedArrow'] }, { x: 'Magazine capacity thershold is lowered by 10% (50%🠚40%).' }] },
    ],
  },
  3038247973: {
    name: 'Explosive Payload',
    description: 'Projectiles create an area-of-effect detonation on impact.',
    enhancedDescription: 'Projectiles create an area-of-effect detonation on impact. Improves reload.',
    insight: [
      {
        t: [
          { x: "Splits off 50% of the weapon's bodyshot damage into an Explosive Payload that detonates on impact." },
        ],
      },
      { c: ['spacer'] },
      {
        t: [
          { x: 'The Payload deals 30% increased damage in PvE and staggers PvE Combatants more. ' },
          { x: 'On Hand Cannons, the Payload deals 7% decreased damage in PvP.' },
        ],
      },
      { c: ['spacer'] },
      {
        t: [
          {
            x: 'The remaining Impact damage portion receives an increased Crit Multiplier to compensate for the Payload not benefitting from crits.',
          },
        ],
      },
      { c: ['spacer'] },
      {
        t: [
          {
            x: "[PvE] Total damage is increased by 15% of the weapon's bodyshot damage. For crits, the overall increase is roughly equal to 15% divided by the Crit Multiplier.",
          },
        ],
      },
      { c: ['spacer'] },
      { t: [{ x: '[PvP] Total damage remains roughly the same but can vary by 1-2% in either direction for crits.' }] },
      { c: ['spacer'] },
      { t: [{ c: ['enhancedArrow'] }, { x: 'Passively grants 5 Reload Speed.' }] },
    ],
  },
  3078487919: {
    name: 'Bait and Switch',
    description: 'Deal damage with all equipped weapons within a short time to give this weapon a damage boost.',
    enhancedDescription:
      'Deal damage with all equipped weapons within a short time to give this weapon a damage boost for an improved duration.',
    insight: [
      {
        t: [
          {
            x: 'Dealing damage with a weapon starts a 7 second timer. Dealing additional weapon damage resets the timer to 7 seconds.',
          },
        ],
      },
      { c: ['spacer'] },
      {
        t: [
          {
            x: "Dealing damage with all 3 of your weapons without letting the timer run out grants you 'Bait and Switch' for 10 (↑ 11) seconds, granting 30% increased damage.",
          },
        ],
      },
      { c: ['spacer'] },
      {
        t: [
          {
            x: 'Timer is disabled while Bait and Switch is active, requiring a full activation sequence once the buff expires.',
          },
        ],
      },
    ],
  },
  3081867624: {
    name: 'Master of Arms',
    description: "Kills with any weapon improve this weapon's damage for a short time.",
    enhancedDescription: "Final blows with any weapon improve this weapon's damage for an improved duration.",
    insight: [
      {
        t: [
          {
            x: 'Scoring a Kill with any weapon grants Master of Arms x1, granting 15% increased damage for 7 (↑ 8) seconds.',
          },
        ],
      },
      { c: ['spacer'] },
      {
        t: [
          {
            x: 'Scoring a Kill with any weapon with Master of Arms active grants Master of Arms x2, granting 25% increased damage for 4 (↑ 5) seconds.',
          },
        ],
      },
      { c: ['spacer'] },
      { t: [{ x: 'Master of Arms x2 expiring reverts the buff back to Master of Arms x1.' }] },
    ],
  },
  3142289711: {
    name: 'Accurized Rounds',
    description: 'This weapon can fire longer distances.\n  •  Increases range',
    stats: { Range: 10 },
  },
  3300816228: {
    name: 'Auto-Loading Holster',
    description: 'The holstered weapon is automatically reloaded after a short period of time.',
    enhancedDescription: 'The holstered weapon is automatically reloaded after an improved short period of time.',
    insight: [
      { t: [{ x: 'Refills stowed weapon from reserves after 3.5 (↑ 3.3) seconds of it being stowed.' }] },
      { c: ['spacer'] },
      { t: [{ c: ['enhancedArrow'] }, { x: 'Activation time is reduced by 0.2 seconds.' }] },
    ],
  },
  3301904089: {
    name: 'Spike Grenades',
    description: 'Grenades fired from this weapon do increased damage on direct hits.\n  •  Increases stability',
    stats: { Stability: 10 },
    insight: [
      { t: [{ x: 'Increases Grenade Impact damage:' }] },
      { t: [{ x: '• 12.12% increase on ' }, { x: 'Special Grenade Launchers' }] },
      { t: [{ x: '• 12.5% increase on ' }, { x: 'Power Grenade Launchers' }] },
      { c: ['spacer'] },
      {
        t: [
          {
            x: 'Due to the ratio of Detonation and Impact damage being tied to the Blast Radius stat on Grenade Launchers, a lower stat will provide a slightly higher overall damage increase.',
          },
        ],
      },
    ],
  },
  3363267119: {
    name: 'Souldrinker',
    description: 'Gain health based on the number of hits before reloading.',
    insight: [
      {
        t: [
          {
            x: 'Finishing a Reload restores health based on the number of hits scored with the weapon before reloading.',
          },
        ],
      },
      { c: ['spacer'] },
      { t: [{ x: 'Scoring 100% of the Magazine as hits restores 50 HP. No known upper limit to the total amount.' }] },
      { c: ['spacer'] },
      { t: [{ x: "Glaive Melee Hits don't count. Grenade Launcher hits each count as 50% of the Magazine." }] },
    ],
  },
  3418782618: {
    name: 'Rewind Rounds',
    description: "When this weapon's magazine is empty, it refills from reserves based on the number of hits.",
    enhancedDescription:
      "When this weapon's magazine is empty, it more effectively refills from reserves based on the number of hits.",
    insight: [
      { t: [{ x: 'Upon emptying the Magazine:' }] },
      { t: [{ x: 'Refills 60% (↑ 70%) of the number of Hits landed (rounded up) into the Magazine from reserves.' }] },
      { c: ['spacer'] },
      {
        t: [
          {
            x: 'Hits are counted from either your last reload or the last time the perk was triggered. Does not require Direct Hits.',
          },
        ],
      },
      { c: ['spacer'] },
      { t: [{ x: 'Requires firing 28.75% of the Magazine Capacity for the refill to activate.' }] },
      { c: ['spacer'] },
      { t: [{ x: 'Cannot load the Magazine beyond its base capacity.' }] },
      { c: ['spacer'] },
      { t: [{ x: 'Hits after triggering a refill do not count while the Rewind Rounds buff is active (1? second).' }] },
      { c: ['spacer'] },
      { t: [{ x: 'Adaptive Burst Linear Fusion Rifle behavior:' }] },
      { t: [{ x: '• Each individual bolt in the burst counts as a Hit' }] },
      {
        t: [
          {
            x: '• Refill amount is uniquely 14% (↑ 16.33%) of the number of Hits rounded up (numbers are subject to change once we get more data points)',
          },
        ],
      },
      { c: ['spacer'] },
      { t: [{ c: ['enhancedArrow'] }, { x: 'Refill amount is increased by 16.66% (60%⁠🠚⁠70%).' }] },
    ],
  },
  3454102905: {
    name: 'Problem Solver',
    description:
      'Dealing sustained damage to Champion, miniboss, or boss combatants exhausts them and grants this weapon handling and reload speed.\n\nExhausted targets deal reduced outgoing damage.',
    enhancedDescription:
      'Dealing sustained damage to Champion, miniboss, or boss combatants exhausts them and grants this weapon handling and reload speed for a longer duration.\n\nExhausted targets deal reduced outgoing damage.',
    insight: [
      {
        t: [
          { x: 'Upon scoring multiple Direct Hits within 5 seconds of each against a ' },
          { x: 'Champion, Miniboss, or Boss' },
          { x: 'Combatant:' },
        ],
      },
      { t: [{ x: '• Exhausts the combatant for 5 seconds' }] },
      { t: [{ x: '• Grants 50? Reload Speed and 50? Handling for 10 seconds' }] },
      { c: ['spacer'] },
      { t: [{ x: 'Hit requirements by weapon type:' }] },
      { t: [{ x: '• Fusion Rifles: 12' }] },
      { t: [{ x: '• Rocket Pulses: 11' }] },
      { t: [{ x: '• Bows and Grenade Launchers: 3' }] },
    ],
  },
  3492396210: {
    name: 'Implosion Rounds',
    description:
      "This weapon's projectiles travel faster and have a controlled explosion.\n  •  Increases projectile speed\n  •  Greatly increases stability\n  •  Decreases blast radius",
    stats: { Velocity: 10, Stability: 15, 'Blast Radius': -10 },
  },
  3525010810: {
    name: 'Quick Launch',
    description:
      "This weapon's barrel provides faster projectiles and much faster aiming.\n  •  Greatly increases handling speed\n  •  Increases projectile speed",
    stats: { Velocity: 10, Handling: 15 },
  },
  3987942396: {
    name: 'Envious Arsenal',
    description: 'Dealing damage with both other weapons before readying this weapon refills it from reserves.',
    enhancedDescription:
      'Dealing damage with both other weapons before readying this weapon refills it from reserves. Increases ammo generation.',
    insight: [
      {
        t: [
          { x: 'Dealing any damage with both of your other weapons ' },
          { x: 'refills' },
          { x: ' the magazine from reserves upon readying the weapon.' },
        ],
      },
      { c: ['spacer'] },
      {
        t: [
          { c: ['enhancedArrow'] },
          { x: 'Passively grants 10 Ammo Generation stat (equivalent of an Ammo Generation armor mod).' },
        ],
      },
    ],
  },
  4104185692: {
    name: 'Frenzy',
    description:
      'Being in combat for an extended time increases damage, handling, and reload for this weapon until you are out of combat.',
    enhancedDescription:
      'Being in combat for an extended time increases damage, handling, and reload for this weapon for an improved duration until you are out of combat.',
    insight: [
      { t: [{ x: 'After being in Combat for 12 seconds:' }] },
      { t: [{ x: 'Grants 15% increased damage, 100 Handling, and 100 Reload Speed for 7.2 seconds.' }] },
      { c: ['spacer'] },
      { t: [{ x: 'Works and can activate while stowed. Dealing and receiving damage refreshes the buff duration.' }] },
      { c: ['spacer'] },
      {
        t: [
          {
            x: 'For Frenzy, being in Combat is defined as having either dealt or received damage within the last 5 (↑ 5.5) seconds.',
          },
        ],
      },
      { c: ['spacer'] },
      { t: [{ x: 'Self-damage and environmental damage do not count.' }] },
      { c: ['spacer'] },
      { t: [{ c: ['enhancedArrow'] }, { x: 'Allowed time between damage exchanges extended by 0.5 seconds.' }] },
    ],
  },
}

/** By tile id (`ITEM_TILE_SET`). */
export const ITEM_DETAILS: Record<string, WeaponDetails> = {
  'vex-mythoclast': {
    id: 'vex-mythoclast',
    itemHash: 4289226715,
    tierType: 6,
    locked: true,
    frame: {
      hash: 3610750208,
      name: 'Timeless Mythoclast',
      icon: icon(`${B}00828876f483906277c0a1930ed737fe.png`),
      description:
        'This weapon fires singular bolts in full auto. When the magazine is emptied, ammo is pulled from across timelines to refill it based on the number of shots landed.',
    },
    columns: [
      {
        socketIndex: 1,
        typeName: 'Barrel',
        origin: false,
        current: 839105230,
        options: [
          {
            hash: 839105230,
            name: 'Arrowhead Brake',
            icon: icon(`${B}8f7fb54687aa52a9c2595d90ce9c9417.png`),
            description: 'Lightly vented barrel.\n  •  Greatly controls recoil\n  •  Increases handling speed',
            ref: 839105230,
          },
        ],
      },
      {
        socketIndex: 2,
        typeName: 'Battery',
        origin: false,
        current: 185041502,
        options: [
          {
            hash: 185041502,
            name: 'Volatile Battery',
            icon: icon(`${B}468b38c8abc137199a7c0b00c271ae17.png`),
            description:
              'This battery simultaneously exists in multiple timelines, causing the weapon to Overcharge.\n\n  •  Greatly increases magazine size',
            ref: 185041502,
          },
        ],
      },
      {
        socketIndex: 3,
        typeName: 'Trait',
        origin: false,
        current: 806917387,
        options: [
          {
            hash: 806917387,
            name: 'Temporal Unlimiter',
            icon: icon(`${B}f2479e7a93fae100b252a48ed2c4da19.png`),
            description:
              'Defeating targets builds stacks of Overcharge.\n\n[Alternate Weapon Action]  : When fully Overcharged, swap firing modes. In this mode, hold the trigger to charge up and fire Linear Fusion Rifle shots that cause an ignition on precision final blows.',
            ref: 806917387,
          },
        ],
      },
      {
        socketIndex: 4,
        typeName: 'Stock',
        origin: false,
        current: 990298390,
        options: [
          {
            hash: 990298390,
            name: 'Hand-Laid Stock',
            icon: icon(`${B}11fe23229c61287c89916f094b26652f.png`),
            description: 'This weapon is optimized for recoil control.\n  •  Increases stability',
            ref: 990298390,
          },
        ],
      },
    ],
    mods: [
      {
        hash: 2931483505,
        name: 'Default Ornament',
        icon: icon(`${B}3bb544f2136894a13a73875639f376d5.png`),
        description: 'Restores your weapon to its default appearance.',
        kind: 'ornament',
      },
    ],
    stats: [
      { name: 'Impact', value: 31 },
      { name: 'Range', value: 85 },
      { name: 'Stability', value: 40 },
      { name: 'Handling', value: 60 },
      { name: 'Reload Speed', value: 60 },
      { name: 'Aim Assistance', value: 75 },
      { name: 'Airborne Effectiveness', value: 19 },
      { name: 'Ammo Generation', value: 40 },
      { name: 'Zoom', value: 15 },
      { name: 'Recoil Direction', value: 100 },
      { name: 'Rounds Per Minute', value: 400 },
      { name: 'Magazine', value: 33 },
    ],
    investment: {
      Impact: 90,
      Range: 85,
      Stability: 30,
      Handling: 50,
      'Reload Speed': 60,
      'Aim Assistance': 75,
      'Airborne Effectiveness': 19,
      'Ammo Generation': 40,
      Zoom: 15,
      'Recoil Direction': 80,
      'Rounds Per Minute': 10,
      Magazine: 0,
    },
    curves: {
      Impact: {
        max: 100,
        points: [
          [0, 18],
          [20, 21],
          [80, 29],
          [90, 31],
          [100, 33],
        ],
      },
      Range: {
        max: 100,
        points: [
          [0, 0],
          [100, 100],
        ],
      },
      Stability: {
        max: 100,
        points: [
          [0, 0],
          [100, 100],
        ],
      },
      Handling: {
        max: 100,
        points: [
          [0, 0],
          [100, 100],
        ],
      },
      'Reload Speed': {
        max: 100,
        points: [
          [0, 0],
          [100, 100],
        ],
      },
      'Aim Assistance': {
        max: 100,
        points: [
          [0, 0],
          [100, 100],
        ],
      },
      'Airborne Effectiveness': {
        max: 100,
        points: [
          [0, 0],
          [100, 100],
        ],
      },
      'Ammo Generation': {
        max: 100,
        points: [
          [0, 0],
          [100, 100],
        ],
      },
      Zoom: {
        max: 100,
        points: [
          [0, 0],
          [100, 100],
        ],
      },
      'Recoil Direction': {
        max: 100,
        points: [
          [0, 0],
          [100, 100],
        ],
      },
      'Rounds Per Minute': {
        max: 100,
        points: [
          [0, 360],
          [10, 400],
          [20, 450],
          [80, 600],
          [100, 720],
        ],
      },
      Magazine: {
        max: 100,
        points: [
          [0, 25],
          [10, 27],
          [20, 29],
          [30, 31],
          [40, 33],
          [50, 35],
          [60, 37],
          [70, 39],
          [80, 41],
          [90, 43],
          [100, 45],
        ],
      },
    },
  },
  'mint-retrograde': {
    id: 'mint-retrograde',
    itemHash: 3285784871,
    tierType: 5,
    locked: true,
    frame: {
      hash: 2928496916,
      name: 'Micro-Missile Frame',
      icon: icon(`${B}0362f949c16fe72358a5c7bb93be3f60.png`),
      description: 'Fires self-propelled micro-missiles that explode on impact for high damage.',
    },
    columns: [
      {
        socketIndex: 1,
        typeName: 'Launcher Barrel',
        origin: false,
        current: 3250572790,
        options: [
          {
            hash: 3250572790,
            name: 'Quick Launch',
            icon: icon(`${B}dfad5d8b00b79c4393943b791a624874.png`),
            description:
              "This weapon's barrel provides faster projectiles and much faster aiming.\n  •  Greatly increases handling speed\n  •  Increases projectile speed",
            enhanced: true,
            ref: 3525010810,
          },
          {
            hash: 1639399262,
            name: 'Linear Compensator',
            icon: icon(`${B}5059f4059a4c59d0003f8fedf8987b78.png`),
            description:
              "This weapon's launch barrel is well-balanced.\n  •  Slightly increases projectile speed\n  •  Slightly increases blast radius\n  •  Slightly increases stability",
            enhanced: true,
            ref: 1441682018,
          },
        ],
      },
      {
        socketIndex: 2,
        typeName: 'Magazine',
        origin: false,
        current: 2108812838,
        options: [
          {
            hash: 2108812838,
            name: 'High-Velocity Rounds',
            icon: icon(`${B}2a2b757cd73305126990cd19ad011a2c.png`),
            description:
              "This weapon's projectiles are particularly light and quick.\n  •  Increases projectile speed\n  •  Increases reload speed",
            enhanced: true,
            ref: 2822142346,
          },
          {
            hash: 3807404750,
            name: 'Implosion Rounds',
            icon: icon(`${B}3ec484f0a65df7da9bbc5582c708574b.png`),
            description:
              "This weapon's projectiles travel faster and have a controlled explosion.\n  •  Increases projectile speed\n  •  Greatly increases stability\n  •  Decreases blast radius",
            enhanced: true,
            ref: 3492396210,
          },
        ],
      },
      {
        socketIndex: 3,
        typeName: 'Trait',
        origin: false,
        current: 1563455254,
        options: [
          {
            hash: 1563455254,
            name: 'Rewind Rounds',
            icon: icon(`${B}a201fd61905b802867b677cf927e6e04.png`),
            description:
              "When this weapon's magazine is empty, it more effectively refills from reserves based on the number of hits.",
            enhanced: true,
            ref: 3418782618,
          },
          {
            hash: 1135494563,
            name: 'Beacon Rounds',
            icon: icon(`${B}53b269a1760611b75170abde8ff1032c.png`),
            description:
              'Final blows with this weapon grant your projectiles tracking and increase reload speed for an improved duration. Dealing further damage extends the duration.',
            enhanced: true,
            ref: 2859149211,
          },
          {
            hash: 102912326,
            name: 'Hatchling',
            icon: icon(`${B}2f7e898e2231900ac968ffb2080fc02b.png`),
            description:
              "Precision final blows or rapidly defeating targets with this weapon spawns a Threadling at the target's location. There's a chance to spawn an increased amount of Threadlings.",
            enhanced: true,
            ref: 831391274,
          },
        ],
      },
      {
        socketIndex: 4,
        typeName: 'Trait',
        origin: false,
        current: 3007133316,
        options: [
          {
            hash: 3007133316,
            name: 'Frenzy',
            icon: icon(`${B}23e06f4ced1b3e6476f342978ff5bb37.png`),
            description:
              'Being in combat for an extended time increases damage, handling, and reload for this weapon for an improved duration until you are out of combat.',
            enhanced: true,
            ref: 4104185692,
          },
          {
            hash: 496047945,
            name: 'Elemental Honing',
            icon: icon(`${B}ac0323ff44f720a8db7ae9f4dee59af4.png`),
            description:
              'Dealing unique elemental damage grants this weapon a stacking damage bonus for an improved duration. This bonus is increased for kinetic weapons.',
            enhanced: true,
            ref: 1089671869,
          },
          {
            hash: 2963273944,
            name: 'Master of Arms',
            icon: icon(`${B}fce1ea2064814689d7ca08a2acdb1d23.png`),
            description: "Final blows with any weapon improve this weapon's damage for an improved duration.",
            enhanced: true,
            ref: 3081867624,
          },
        ],
      },
      {
        socketIndex: 8,
        typeName: 'Origin Trait',
        origin: true,
        current: 3454102905,
        options: [
          {
            hash: 3454102905,
            name: 'Problem Solver',
            icon: icon(`${B}4ffd402a283074e0b635f7b1d963b331.png`),
            description:
              'Dealing sustained damage to Champion, miniboss, or boss combatants exhausts them and grants this weapon handling and reload speed.\n\nExhausted targets deal reduced outgoing damage.',
            ref: 3454102905,
          },
        ],
      },
    ],
    mods: [
      {
        hash: 4248210736,
        name: 'Default Shader',
        icon: icon(`${B}96831e244728f0350340bb7d5d05b463.png`),
        description: 'Restores your gear to its default colors.',
        kind: 'shader',
      },
      {
        hash: 1588595445,
        name: 'Counterbalance Stock',
        icon: icon(`${B}4fe8955049eee3e89c4de69dbceb5ab2.png`),
        kind: 'mod',
      },
      {
        hash: 186337601,
        name: 'Masterworked: Handling',
        icon: icon(`${B}1e7d84d19417ae11a03a7041a6b7ef1d.jpg`),
        description: 'Maximized stats.',
        kind: 'masterwork',
      },
      {
        hash: 3854296178,
        name: 'Default Ornament',
        icon: icon(`${B}3bb544f2136894a13a73875639f376d5.png`),
        description: 'Restores your weapon to its default appearance.',
        kind: 'ornament',
      },
    ],
    stats: [
      { name: 'Blast Radius', value: 72 },
      { name: 'Velocity', value: 81 },
      { name: 'Stability', value: 42 },
      { name: 'Handling', value: 46 },
      { name: 'Reload Speed', value: 36 },
      { name: 'Aim Assistance', value: 74 },
      { name: 'Airborne Effectiveness', value: 20 },
      { name: 'Ammo Generation', value: 9 },
      { name: 'Zoom', value: 20 },
      { name: 'Recoil Direction', value: 75 },
      { name: 'Rounds Per Minute', value: 200 },
      { name: 'Magazine', value: 5 },
    ],
    investment: {
      'Blast Radius': 72,
      Velocity: 59,
      Stability: 42,
      Handling: 20,
      'Reload Speed': 25,
      'Aim Assistance': 74,
      'Airborne Effectiveness': 20,
      'Ammo Generation': 9,
      Zoom: 20,
      'Recoil Direction': 60,
      'Rounds Per Minute': 0,
      Magazine: 40,
    },
    curves: {
      'Blast Radius': {
        max: 100,
        points: [
          [0, 0],
          [100, 100],
        ],
      },
      Velocity: {
        max: 100,
        points: [
          [0, 0],
          [100, 100],
        ],
      },
      Stability: {
        max: 100,
        points: [
          [0, 0],
          [100, 100],
        ],
      },
      Handling: {
        max: 100,
        points: [
          [0, 0],
          [100, 100],
        ],
      },
      'Reload Speed': {
        max: 100,
        points: [
          [0, 0],
          [100, 100],
        ],
      },
      'Aim Assistance': {
        max: 100,
        points: [
          [0, 0],
          [100, 100],
        ],
      },
      'Airborne Effectiveness': {
        max: 100,
        points: [
          [0, 0],
          [100, 100],
        ],
      },
      'Ammo Generation': {
        max: 100,
        points: [
          [0, 0],
          [100, 100],
        ],
      },
      Zoom: {
        max: 100,
        points: [
          [0, 0],
          [100, 100],
        ],
      },
      'Recoil Direction': {
        max: 100,
        points: [
          [0, 0],
          [100, 100],
        ],
      },
      'Rounds Per Minute': {
        max: 100,
        points: [
          [0, 200],
          [10, 260],
          [40, 300],
          [50, 415],
          [70, 360],
          [90, 450],
        ],
      },
      Magazine: {
        max: 100,
        points: [
          [0, 3],
          [19, 3],
          [20, 4],
          [39, 4],
          [40, 5],
          [59, 5],
          [60, 6],
          [79, 6],
          [80, 7],
          [99, 7],
          [100, 8],
        ],
      },
    },
  },
  'kindled-orchid': {
    id: 'kindled-orchid',
    itemHash: 3961462214,
    tierType: 5,
    locked: false,
    copies: 2,
    frame: {
      hash: 1294026524,
      name: 'Adaptive Frame',
      icon: icon(`${B}967fb4abc6ab98f74639d6c08e5f56ee.png`),
      description: 'A well-rounded grip, reliable and sturdy.',
    },
    columns: [
      {
        socketIndex: 1,
        typeName: 'Barrel',
        origin: false,
        current: 1482024992,
        options: [
          {
            hash: 1482024992,
            name: 'Smallbore',
            icon: icon(`${B}7d1bb6a623f14959a47156ee71acfc3a.png`),
            description: 'Dual strength barrel.\n  •  Increases range\n  •  Increases stability',
            ref: 1482024992,
          },
        ],
      },
      {
        socketIndex: 2,
        typeName: 'Magazine',
        origin: false,
        current: 3142289711,
        options: [
          {
            hash: 3142289711,
            name: 'Accurized Rounds',
            icon: icon(`${B}d85024478504205359c7fb52dbc4f6b6.png`),
            description: 'This weapon can fire longer distances.\n  •  Increases range',
            ref: 3142289711,
          },
        ],
      },
      {
        socketIndex: 3,
        typeName: 'Trait',
        origin: false,
        current: 509594246,
        options: [
          {
            hash: 509594246,
            name: 'Rangefinder',
            icon: icon(`${B}74270d52bec24f1f5f4c987f5f37fce9.png`),
            description:
              'Aiming this weapon increases its effective range and zoom magnification, and improves handling. Increased projectile velocity while aiming Rocket Launchers, Grenade Launchers, and Bows.',
            enhanced: true,
            ref: 2846385770,
          },
          {
            hash: 1347741687,
            name: 'Outlaw',
            icon: icon(`${B}382df469a091c33e190ee583b64923e8.png`),
            description: 'Precision final blows greatly decrease reload time for an improved duration.',
            enhanced: true,
            ref: 1168162263,
          },
        ],
      },
      {
        socketIndex: 4,
        typeName: 'Trait',
        origin: false,
        current: 3042219245,
        options: [
          {
            hash: 3042219245,
            name: 'Magnificent Howl',
            icon: icon(`${B}986aeac26e30b3d5509e83f10a953da7.png`),
            description:
              'The number of precision final blows before reloading affects the total rounds granted with increased range and damage. Precision final blows with Magnificent Howl active extend the effect for additional rounds. Improves reload.',
            enhanced: true,
            ref: 2720533289,
          },
          {
            hash: 64866129,
            name: 'Explosive Payload',
            icon: icon(`${B}31f02e5f3bae68ecdfdd3f899cf931c7.png`),
            description: 'Projectiles create an area-of-effect detonation on impact. Improves reload.',
            enhanced: true,
            ref: 3038247973,
          },
        ],
      },
      {
        socketIndex: 8,
        typeName: 'Origin Trait',
        origin: true,
        current: 2327629476,
        options: [
          {
            hash: 2327629476,
            name: "Forge's Kin",
            icon: icon(`${B}87b2e30a913f17f2eedaf153365547b6.png`),
            description:
              'Black Armory weapon final blows briefly grant ammo generation, reload speed, and damage against combatants when the weapon is redrawn. Buff potency and duration increases for each equipped Black Armory weapon.',
            ref: 2327629476,
          },
        ],
      },
    ],
    mods: [
      {
        hash: 4248210736,
        name: 'Default Shader',
        icon: icon(`${B}96831e244728f0350340bb7d5d05b463.png`),
        description: 'Restores your gear to its default colors.',
        kind: 'shader',
      },
      {
        hash: 2323986101,
        name: 'Empty Mod Socket',
        icon: icon(`${B}431cc8304da4f5eb44c5c10a5c1866ce.jpg`),
        description: 'No mod currently selected.',
        kind: 'mod',
      },
      {
        hash: 150943603,
        name: 'Tier 5: Range',
        icon: icon(`${B}95af3923bdbdf11438504ddeb498afe8.jpg`),
        description: 'Moderately improved stats.',
        kind: 'masterwork',
      },
      {
        hash: 3854296178,
        name: 'Default Ornament',
        icon: icon(`${B}3bb544f2136894a13a73875639f376d5.png`),
        description: 'Restores your weapon to its default appearance.',
        kind: 'ornament',
      },
    ],
    stats: [
      { name: 'Impact', value: 84 },
      { name: 'Range', value: 68 },
      { name: 'Stability', value: 69 },
      { name: 'Handling', value: 60 },
      { name: 'Reload Speed', value: 46 },
      { name: 'Aim Assistance', value: 80 },
      { name: 'Airborne Effectiveness', value: 22 },
      { name: 'Ammo Generation', value: 60 },
      { name: 'Zoom', value: 14 },
      { name: 'Recoil Direction', value: 99 },
      { name: 'Rounds Per Minute', value: 140 },
      { name: 'Magazine', value: 10 },
    ],
    investment: {
      Impact: 40,
      Range: 46,
      Stability: 62,
      Handling: 55,
      'Reload Speed': 46,
      'Aim Assistance': 80,
      'Airborne Effectiveness': 22,
      'Ammo Generation': 60,
      Zoom: 14,
      'Recoil Direction': 99,
      'Rounds Per Minute': 60,
      Magazine: 60,
    },
    curves: {
      Impact: {
        max: 100,
        points: [
          [0, 78],
          [40, 84],
          [80, 92],
          [100, 100],
        ],
      },
      Range: {
        max: 100,
        points: [
          [0, 0],
          [100, 100],
        ],
      },
      Stability: {
        max: 100,
        points: [
          [0, 0],
          [100, 100],
        ],
      },
      Handling: {
        max: 100,
        points: [
          [0, 0],
          [100, 100],
        ],
      },
      'Reload Speed': {
        max: 100,
        points: [
          [0, 0],
          [100, 100],
        ],
      },
      'Aim Assistance': {
        max: 100,
        points: [
          [0, 0],
          [100, 100],
        ],
      },
      'Airborne Effectiveness': {
        max: 100,
        points: [
          [0, 0],
          [100, 100],
        ],
      },
      'Ammo Generation': {
        max: 100,
        points: [
          [0, 0],
          [100, 100],
        ],
      },
      Zoom: {
        max: 100,
        points: [
          [0, 0],
          [100, 100],
        ],
      },
      'Recoil Direction': {
        max: 100,
        points: [
          [0, 0],
          [100, 100],
        ],
      },
      'Rounds Per Minute': {
        max: 100,
        points: [
          [0, 90],
          [10, 100],
          [20, 120],
          [60, 140],
          [90, 150],
          [100, 180],
        ],
      },
      Magazine: {
        max: 100,
        points: [
          [0, 4],
          [9, 4],
          [10, 5],
          [19, 5],
          [20, 6],
          [29, 6],
          [30, 7],
          [39, 7],
          [40, 8],
          [49, 8],
          [50, 9],
          [59, 9],
          [60, 10],
          [69, 10],
          [70, 11],
          [79, 11],
          [80, 12],
          [89, 12],
          [90, 13],
          [99, 13],
          [100, 14],
        ],
      },
    },
  },
  'ikelos-smg': {
    id: 'ikelos-smg',
    itemHash: 2149683300,
    tierType: 5,
    locked: true,
    frame: {
      hash: 1525239159,
      name: 'Aggressive Frame',
      icon: icon(`${B}64209c4fd20513b33109c374179d0958.png`),
      description: 'High damage, high recoil.',
    },
    columns: [
      {
        socketIndex: 1,
        typeName: 'Barrel',
        origin: false,
        current: 3048246338,
        options: [
          {
            hash: 3048246338,
            name: 'Arrowhead Brake',
            icon: icon(`${B}8f7fb54687aa52a9c2595d90ce9c9417.png`),
            description: 'Lightly vented barrel.\n  •  Greatly controls recoil\n  •  Increases handling speed',
            enhanced: true,
            ref: 839105230,
          },
        ],
      },
      {
        socketIndex: 2,
        typeName: 'Magazine',
        origin: false,
        current: 463405747,
        options: [
          {
            hash: 463405747,
            name: 'Seraph Rounds',
            icon: icon(`${B}5e825cbfd6fbcef65358f27334368681.png`),
            description:
              'Rounds overpenetrate targets and bounce off hard surfaces.\n• Slightly increases range\n• Increases stability',
            enhanced: true,
            ref: 1140096971,
          },
        ],
      },
      {
        socketIndex: 3,
        typeName: 'Trait',
        origin: false,
        current: 2014892510,
        options: [
          {
            hash: 2014892510,
            name: 'Perpetual Motion',
            icon: icon(`${B}8b9a4582016210723532907414759e69.png`),
            description:
              'This weapon gains bonus stability, handling, and reload speed while the wielder is in motion for a short duration.',
            enhanced: true,
            ref: 1428297954,
          },
        ],
      },
      {
        socketIndex: 4,
        typeName: 'Trait',
        origin: false,
        current: 1720528630,
        options: [
          {
            hash: 1720528630,
            name: 'Voltshot',
            icon: icon(`${B}a71ffb1cb221ea64fa77ab473f8a3a61.png`),
            description:
              'Reloading this weapon after defeating a target overcharges this weapon for an improved short period of time, causing it to jolt on its next hit.',
            enhanced: true,
            ref: 2173046394,
          },
        ],
      },
      {
        socketIndex: 8,
        typeName: 'Origin Trait',
        origin: true,
        current: 566815328,
        options: [
          {
            hash: 566815328,
            name: "Rasputin's Arsenal",
            icon: icon(`${B}44efbb5de18ddc290c38e12dca746c7b.png`),
            description: "Breaking a target's shield partially reloads this weapon's magazine.",
            ref: 566815328,
          },
        ],
      },
    ],
    mods: [
      {
        hash: 4248210736,
        name: 'Default Shader',
        icon: icon(`${B}96831e244728f0350340bb7d5d05b463.png`),
        description: 'Restores your gear to its default colors.',
        kind: 'shader',
      },
      { hash: 736000386, name: 'Freehand Grip', icon: icon(`${B}1b434a10fc6808d489063618687c4463.png`), kind: 'mod' },
      {
        hash: 2697220197,
        name: 'Masterworked: Range',
        icon: icon(`${B}2ed55f129d92647218ccb05f31e31cc8.jpg`),
        description: 'Maximized stats.',
        kind: 'masterwork',
      },
      {
        hash: 3854296178,
        name: 'Default Ornament',
        icon: icon(`${B}3bb544f2136894a13a73875639f376d5.png`),
        description: 'Restores your weapon to its default appearance.',
        kind: 'ornament',
      },
    ],
    stats: [
      { name: 'Impact', value: 22 },
      { name: 'Range', value: 58 },
      { name: 'Stability', value: 33 },
      { name: 'Handling', value: 74 },
      { name: 'Reload Speed', value: 24 },
      { name: 'Aim Assistance', value: 37 },
      { name: 'Airborne Effectiveness', value: 13 },
      { name: 'Ammo Generation', value: 45 },
      { name: 'Zoom', value: 14 },
      { name: 'Recoil Direction', value: 100 },
      { name: 'Rounds Per Minute', value: 720 },
      { name: 'Magazine', value: 32 },
    ],
    investment: {
      Impact: 30,
      Range: 44,
      Stability: 25,
      Handling: 62,
      'Reload Speed': 24,
      'Aim Assistance': 37,
      'Airborne Effectiveness': 13,
      'Ammo Generation': 45,
      Zoom: 14,
      'Recoil Direction': 90,
      'Rounds Per Minute': 70,
      Magazine: 40,
    },
    curves: {
      Impact: {
        max: 100,
        points: [
          [0, 15],
          [10, 20],
          [50, 25],
          [100, 35],
        ],
      },
      Range: {
        max: 100,
        points: [
          [0, 0],
          [100, 100],
        ],
      },
      Stability: {
        max: 100,
        points: [
          [0, 0],
          [100, 100],
        ],
      },
      Handling: {
        max: 100,
        points: [
          [0, 0],
          [100, 100],
        ],
      },
      'Reload Speed': {
        max: 100,
        points: [
          [0, 0],
          [100, 100],
        ],
      },
      'Aim Assistance': {
        max: 100,
        points: [
          [0, 0],
          [100, 100],
        ],
      },
      'Airborne Effectiveness': {
        max: 100,
        points: [
          [0, 0],
          [100, 100],
        ],
      },
      'Ammo Generation': {
        max: 100,
        points: [
          [0, 0],
          [100, 100],
        ],
      },
      Zoom: {
        max: 100,
        points: [
          [0, 0],
          [100, 100],
        ],
      },
      'Recoil Direction': {
        max: 100,
        points: [
          [0, 0],
          [100, 100],
        ],
      },
      'Rounds Per Minute': {
        max: 100,
        points: [
          [0, 600],
          [50, 600],
          [60, 600],
          [70, 720],
          [90, 900],
          [100, 900],
        ],
      },
      Magazine: {
        max: 100,
        points: [
          [0, 27],
          [9, 28],
          [10, 28],
          [19, 29],
          [20, 29],
          [29, 30],
          [30, 30],
          [39, 32],
          [40, 32],
          [49, 33],
          [50, 33],
          [59, 34],
          [60, 34],
          [69, 35],
          [70, 35],
          [79, 37],
          [80, 37],
          [89, 38],
          [90, 38],
          [99, 39],
          [100, 39],
        ],
      },
    },
  },
  'edge-transit': {
    id: 'edge-transit',
    itemHash: 3736001863,
    tierType: 5,
    locked: false,
    frame: {
      hash: 1294026524,
      name: 'Adaptive Frame',
      icon: icon(`${B}967fb4abc6ab98f74639d6c08e5f56ee.png`),
      description: 'A well-rounded grip, reliable and sturdy.',
    },
    columns: [
      {
        socketIndex: 1,
        typeName: 'Launcher Barrel',
        origin: false,
        current: 3250572790,
        options: [
          {
            hash: 3250572790,
            name: 'Quick Launch',
            icon: icon(`${B}dfad5d8b00b79c4393943b791a624874.png`),
            description:
              "This weapon's barrel provides faster projectiles and much faster aiming.\n  •  Greatly increases handling speed\n  •  Increases projectile speed",
            enhanced: true,
            ref: 3525010810,
          },
          {
            hash: 3471392239,
            name: 'Confined Launch',
            icon: icon(`${B}0a783b44bf9fc49b4bed0a93dfa21d5d.png`),
            description:
              "This weapon's launch parameters are particularly stable.\n  •  Greatly increases stability\n  •  Increases blast radius\n  •  Decreases projectile speed",
            enhanced: true,
            ref: 1844523823,
          },
        ],
      },
      {
        socketIndex: 2,
        typeName: 'Magazine',
        origin: false,
        current: 409713597,
        options: [
          {
            hash: 409713597,
            name: 'Spike Grenades',
            icon: icon(`${B}05302d5b12e5f68541622766f18d3797.png`),
            description:
              'Grenades fired from this weapon do increased damage on direct hits.\n  •  Increases stability',
            enhanced: true,
            ref: 3301904089,
          },
          {
            hash: 3807404750,
            name: 'Implosion Rounds',
            icon: icon(`${B}3ec484f0a65df7da9bbc5582c708574b.png`),
            description:
              "This weapon's projectiles travel faster and have a controlled explosion.\n  •  Increases projectile speed\n  •  Greatly increases stability\n  •  Decreases blast radius",
            enhanced: true,
            ref: 3492396210,
          },
        ],
      },
      {
        socketIndex: 3,
        typeName: 'Trait',
        origin: false,
        current: 2817499044,
        options: [
          {
            hash: 2817499044,
            name: 'Envious Arsenal',
            icon: icon(`${B}234bcd9dc9f5e3ec850a8eac748afbde.png`),
            description:
              'Dealing damage with both other weapons before readying this weapon refills it from reserves. Increases ammo generation.',
            enhanced: true,
            ref: 3987942396,
          },
          {
            hash: 3528046508,
            name: 'Auto-Loading Holster',
            icon: icon(`${B}e4262099a1c2cea78b48a6680c5248c9.png`),
            description: 'The holstered weapon is automatically reloaded after an improved short period of time.',
            enhanced: true,
            ref: 3300816228,
          },
        ],
      },
      {
        socketIndex: 4,
        typeName: 'Trait',
        origin: false,
        current: 3744057135,
        options: [
          {
            hash: 3744057135,
            name: 'Bait and Switch',
            icon: icon(`${B}bc91e95edfbc9163dd88339a93b66913.png`),
            description:
              'Deal damage with all equipped weapons within a short time to give this weapon a damage boost for an improved duration.',
            enhanced: true,
            ref: 3078487919,
          },
          {
            hash: 1905598698,
            name: 'Full Court',
            icon: icon(`${B}b3153ac6eb5bc0315ef2d4c11c327a84.png`),
            description:
              'Increases detonation damage as the projectile travels farther before exploding. Increases blast radius.',
            enhanced: true,
            ref: 2888557110,
          },
        ],
      },
      {
        socketIndex: 8,
        typeName: 'Origin Trait',
        origin: true,
        current: 2489430594,
        options: [
          {
            hash: 2489430594,
            name: 'Indomitability',
            icon: icon(`${B}82a2dd97afec22865d0a1098c1de59ff.png`),
            description:
              'Final blows grant grenade energy when playing a Light subclass or melee energy when playing a Darkness subclass.',
            ref: 2489430594,
          },
        ],
      },
    ],
    mods: [
      {
        hash: 4248210736,
        name: 'Default Shader',
        icon: icon(`${B}96831e244728f0350340bb7d5d05b463.png`),
        description: 'Restores your gear to its default colors.',
        kind: 'shader',
      },
      { hash: 3336648220, name: 'Backup Mag', icon: icon(`${B}a974d8aa42cab11175b34cef77c265d7.png`), kind: 'mod' },
      {
        hash: 4105787916,
        name: 'Tier 8: Velocity',
        icon: icon(`${B}bbb5b083694aa6b15904ddad69a41ae1.jpg`),
        description: 'Remarkably improved stats.',
        kind: 'masterwork',
      },
      {
        hash: 3854296178,
        name: 'Default Ornament',
        icon: icon(`${B}3bb544f2136894a13a73875639f376d5.png`),
        description: 'Restores your weapon to its default appearance.',
        kind: 'ornament',
      },
    ],
    stats: [
      { name: 'Blast Radius', value: 50 },
      { name: 'Velocity', value: 51 },
      { name: 'Stability', value: 54 },
      { name: 'Handling', value: 58 },
      { name: 'Reload Speed', value: 39 },
      { name: 'Aim Assistance', value: 62 },
      { name: 'Airborne Effectiveness', value: 6 },
      { name: 'Ammo Generation', value: 38 },
      { name: 'Zoom', value: 13 },
      { name: 'Recoil Direction', value: 70 },
      { name: 'Rounds Per Minute', value: 120 },
      { name: 'Magazine', value: 7 },
    ],
    investment: {
      'Blast Radius': 50,
      Velocity: 32,
      Stability: 42,
      Handling: 42,
      'Reload Speed': 39,
      'Aim Assistance': 62,
      'Airborne Effectiveness': 6,
      'Ammo Generation': 38,
      Zoom: 13,
      'Recoil Direction': 70,
      'Rounds Per Minute': 50,
      Magazine: 60,
    },
    curves: {
      'Blast Radius': {
        max: 100,
        points: [
          [0, 0],
          [100, 100],
        ],
      },
      Velocity: {
        max: 100,
        points: [
          [0, 0],
          [100, 100],
        ],
      },
      Stability: {
        max: 100,
        points: [
          [0, 0],
          [100, 100],
        ],
      },
      Handling: {
        max: 100,
        points: [
          [0, 0],
          [100, 100],
        ],
      },
      'Reload Speed': {
        max: 100,
        points: [
          [0, 0],
          [100, 100],
        ],
      },
      'Aim Assistance': {
        max: 100,
        points: [
          [0, 0],
          [100, 100],
        ],
      },
      'Airborne Effectiveness': {
        max: 100,
        points: [
          [0, 0],
          [100, 100],
        ],
      },
      'Ammo Generation': {
        max: 100,
        points: [
          [0, 0],
          [100, 100],
        ],
      },
      Zoom: {
        max: 100,
        points: [
          [0, 0],
          [100, 100],
        ],
      },
      'Recoil Direction': {
        max: 100,
        points: [
          [0, 0],
          [100, 100],
        ],
      },
      'Rounds Per Minute': {
        max: 100,
        points: [
          [0, 72],
          [10, 90],
          [20, 100],
          [30, 106],
          [40, 113],
          [50, 120],
          [60, 128],
          [70, 140],
          [80, 150],
          [90, 165],
          [100, 180],
        ],
      },
      Magazine: {
        max: 100,
        points: [
          [0, 1],
          [9, 1],
          [10, 1],
          [19, 1],
          [20, 2],
          [29, 2],
          [30, 3],
          [39, 3],
          [40, 4],
          [49, 4],
          [50, 5],
          [59, 5],
          [60, 6],
          [69, 6],
          [70, 6],
          [79, 6],
          [80, 7],
          [89, 7],
          [90, 7],
          [99, 7],
          [100, 8],
        ],
      },
    },
  },
  deliverance: {
    id: 'deliverance',
    itemHash: 768621510,
    tierType: 5,
    locked: false,
    frame: {
      hash: 1636108362,
      name: 'Precision Frame',
      icon: icon(`${B}e9dd736124e8ef94048901a279a5bb18.png`),
      description: "This weapon's recoil pattern is more predictably vertical.",
    },
    columns: [
      {
        socketIndex: 1,
        typeName: 'Barrel',
        origin: false,
        current: 839105230,
        options: [
          {
            hash: 839105230,
            name: 'Arrowhead Brake',
            icon: icon(`${B}8f7fb54687aa52a9c2595d90ce9c9417.png`),
            description: 'Lightly vented barrel.\n  •  Greatly controls recoil\n  •  Increases handling speed',
            ref: 839105230,
          },
        ],
      },
      {
        socketIndex: 2,
        typeName: 'Battery',
        origin: false,
        current: 689005463,
        options: [
          {
            hash: 689005463,
            name: 'Accelerated Coils',
            icon: icon(`${B}a51d91da9fb0a4c8f45b2ffa89e51ad7.png`),
            description: 'Speeds up charge.\n  •  Faster charge time\n  •  Decreases impact damage',
            ref: 689005463,
          },
        ],
      },
      {
        socketIndex: 3,
        typeName: 'Trait',
        origin: false,
        current: 2748258257,
        options: [
          {
            hash: 2748258257,
            name: 'Heating Up',
            icon: icon(`${B}39d2032b3c5bc7a5b2fe391c64ccb7db.png`),
            description:
              'Final blows with this weapon increase accuracy and stability while improving vertical recoil for a longer duration.',
            enhanced: true,
            ref: 1570042021,
          },
        ],
      },
      {
        socketIndex: 4,
        typeName: 'Trait',
        origin: false,
        current: 344235611,
        options: [
          {
            hash: 344235611,
            name: 'Chill Clip',
            icon: icon(`${B}ee011569c060e6aef51ad201cafdfd32.png`),
            description: 'Direct hits with the majority of the magazine cause a detonation that slows nearby targets.',
            enhanced: true,
            ref: 2978966579,
          },
        ],
      },
      {
        socketIndex: 8,
        typeName: 'Origin Trait',
        origin: true,
        current: 3363267119,
        options: [
          {
            hash: 3363267119,
            name: 'Souldrinker',
            icon: icon(`${B}d1d46a090e99d041b16ba37abba19fe1.png`),
            description: 'Gain health based on the number of hits before reloading.',
            ref: 3363267119,
          },
        ],
      },
    ],
    mods: [
      {
        hash: 4248210736,
        name: 'Default Shader',
        icon: icon(`${B}96831e244728f0350340bb7d5d05b463.png`),
        description: 'Restores your gear to its default colors.',
        kind: 'shader',
      },
      {
        hash: 2323986101,
        name: 'Empty Mod Socket',
        icon: icon(`${B}431cc8304da4f5eb44c5c10a5c1866ce.jpg`),
        description: 'No mod currently selected.',
        kind: 'mod',
      },
      {
        hash: 4283235136,
        name: 'Tier 6: Reload Speed',
        icon: icon(`${B}e3a74e6dd4c520ea17eb1fdaf2128213.jpg`),
        description: 'Considerably improved stats.',
        kind: 'masterwork',
      },
      {
        hash: 3854296178,
        name: 'Default Ornament',
        icon: icon(`${B}3bb544f2136894a13a73875639f376d5.png`),
        description: 'Restores your weapon to its default appearance.',
        kind: 'ornament',
      },
    ],
    stats: [
      { name: 'Impact', value: 75 },
      { name: 'Range', value: 62 },
      { name: 'Stability', value: 52 },
      { name: 'Handling', value: 42 },
      { name: 'Reload Speed', value: 40 },
      { name: 'Aim Assistance', value: 67 },
      { name: 'Airborne Effectiveness', value: 9 },
      { name: 'Ammo Generation', value: 39 },
      { name: 'Zoom', value: 16 },
      { name: 'Recoil Direction', value: 100 },
      { name: 'Charge Time', value: 800 },
      { name: 'Magazine', value: 6 },
    ],
    investment: {
      Impact: 60,
      Range: 62,
      Stability: 52,
      Handling: 32,
      'Reload Speed': 34,
      'Aim Assistance': 67,
      'Airborne Effectiveness': 9,
      'Ammo Generation': 39,
      Zoom: 16,
      'Recoil Direction': 80,
      'Charge Time': 40,
      Magazine: 46,
    },
    curves: {
      Impact: {
        max: 100,
        points: [
          [0, 50],
          [100, 100],
        ],
      },
      Range: {
        max: 100,
        points: [
          [0, 0],
          [100, 100],
        ],
      },
      Stability: {
        max: 100,
        points: [
          [0, 0],
          [100, 100],
        ],
      },
      Handling: {
        max: 100,
        points: [
          [0, 0],
          [100, 100],
        ],
      },
      'Reload Speed': {
        max: 100,
        points: [
          [0, 0],
          [100, 100],
        ],
      },
      'Aim Assistance': {
        max: 100,
        points: [
          [0, 0],
          [100, 100],
        ],
      },
      'Airborne Effectiveness': {
        max: 100,
        points: [
          [0, 0],
          [100, 100],
        ],
      },
      'Ammo Generation': {
        max: 100,
        points: [
          [0, 0],
          [100, 100],
        ],
      },
      Zoom: {
        max: 100,
        points: [
          [0, 0],
          [100, 100],
        ],
      },
      'Recoil Direction': {
        max: 100,
        points: [
          [0, 0],
          [100, 100],
        ],
      },
      'Charge Time': {
        max: 100,
        points: [
          [0, 1000],
          [10, 967],
          [20, 933],
          [30, 833],
          [40, 800],
          [50, 767],
          [60, 667],
          [70, 633],
          [80, 567],
          [90, 533],
          [100, 500],
        ],
      },
      Magazine: {
        max: 100,
        points: [
          [0, 3],
          [9, 4],
          [10, 4],
          [19, 4],
          [20, 4],
          [29, 5],
          [30, 5],
          [39, 5],
          [40, 5],
          [49, 6],
          [50, 6],
          [59, 6],
          [60, 6],
          [69, 7],
          [70, 7],
          [79, 7],
          [80, 7],
          [89, 8],
          [90, 8],
          [99, 8],
          [100, 8],
        ],
      },
    },
  },
}
