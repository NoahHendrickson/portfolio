import {
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type ReactNode,
} from 'react'
import { createPortal } from 'react-dom'
import { FG, FG_MUTED, FONT } from './confluxTheme'
import { BREAKERS, ITEM_COPIES, PIP_LEFT, PIP_SIDE, pipFill, pipTop, type ItemTileData } from './itemData'
import {
  ITEM_DETAILS,
  PERK_REFS,
  type DetailPlug,
  type InsightLine,
  type InsightRun,
  type PerkColumn,
  type PerkOption,
  type PerkRef,
  type StatCurve,
  type WeaponDetails,
} from './itemDetailsData'
import './itemDetails.css'

/**
 * D2 Conflux's item details panel (`components/manager/item-details.tsx`), the card a
 * tile on the Items page opens, rebuilt for a weapon as the app draws it in its popover
 * (dark + Slate, plain lines; read off a DOM dump of the running app, Nov 5 2026): the
 * rarity plate with the watermark, tier pips, lock, element / type / champion and
 * Power; the frame row; the perk grid (the rolled perk filled blue, the alternatives
 * a tiered roll carries beside it, the lone origin trait bare), the masterwork, weapon
 * mod and cosmetics; the stat bars; and the tag buttons, with Compare when there are
 * copies. Hovering a perk shows its tooltip (Bungie's text, the enhanced tier, Clarity's
 * community insight) and previews its stat change in green and red; clicking picks it
 * (several columns at once), Apply perks swaps them in (a short "Applying…", then the
 * roll and stats take them), Reset drops the picks; the lock and tags toggle. Nothing
 * leaves the page. Fills its container's width; the app's own popover is at least 300.
 */
export default function ItemDetails({ item, style }: { item: ItemTileData; style?: CSSProperties }) {
  const details = ITEM_DETAILS[item.id]
  const copies = ITEM_COPIES[item.id] ?? details?.copies ?? 1
  /** Per weapon, so switching tiles and back keeps what was done to each. */
  const [locked, setLocked] = useState<Record<string, boolean>>({})
  const [tags, setTags] = useState<Record<string, Tag | undefined>>({})
  const [applied, setApplied] = useState<Record<string, Record<number, number>>>({})
  if (!details) return null
  const isLocked = locked[item.id] ?? details.locked
  const tag = tags[item.id]
  return (
    <div
      className="cfx-det"
      role="group"
      aria-label={`${item.name} details`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        // The popover's d2-glass under plain lines, its frame white 32% (PANEL_FRAME).
        backgroundColor: 'rgb(76 92 120 / 0.92)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgb(255 255 255 / 0.32)',
        boxShadow: '0 2px 16px rgb(0 0 0 / 0.25)',
        color: FG,
        fontFamily: FONT,
        fontSize: 14,
        lineHeight: '20px',
        fontWeight: 400,
        textAlign: 'start',
        WebkitFontSmoothing: 'antialiased',
        MozOsxFontSmoothing: 'grayscale',
        ...style,
      }}
    >
      <Header item={item} details={details} locked={isLocked} onLock={() => setLocked((l) => ({ ...l, [item.id]: !isLocked }))} />
      <WeaponRollPanel
        key={item.id}
        details={details}
        applied={applied[item.id] ?? NONE}
        onApply={(changes) => setApplied((a) => ({ ...a, [item.id]: { ...a[item.id], ...changes } }))}
      />
      <div style={{ ...SECTION, flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 4, borderBottom: 0 }}>
        <div role="group" aria-label="Tag" style={{ display: 'contents' }}>
          {PANEL_TAGS.map((t) => (
            <button
              key={t}
              type="button"
              title={TAG_LABELS[t]}
              aria-label={TAG_LABELS[t]}
              aria-pressed={tag === t}
              className="cfx-det-tag cfx-det-ring cfx-det-focus"
              onClick={() => setTags((all) => ({ ...all, [item.id]: tag === t ? undefined : t }))}
            >
              <HugeIcon paths={TAG_ICONS[t]} size={12} />
            </button>
          ))}
        </div>
        {copies > 1 && (
          <button
            type="button"
            className="cfx-det-tag cfx-det-ring cfx-det-focus"
            style={{ gap: 4, padding: '0 12px', fontSize: 12.8, lineHeight: LEADING, fontWeight: 500 }}
          >
            <HugeIcon paths={COMPARE_ICON} size={14} />
            Compare {copies} copies
          </button>
        )}
      </div>
    </div>
  )
}

const NONE: Record<number, number> = {}

/** Text sizes inherit `text-sm`'s 20/14 line, as Tailwind's ratio, under the 14px panel. */
const LEADING = 20 / 14

/** A section of the panel: 12px in, a foreground/24 rule under it (none on the last). */
const SECTION: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
  padding: 12,
  borderBottom: '1px solid rgb(252 252 245 / 0.24)',
}

const MUTED = FG_MUTED
const POSITIVE = '#62b96a'
const DESTRUCTIVE = '#ff8f84'
const EXOTIC_LINE = '#e2c04b'

/* ── Header ─────────────────────────────────────────────────────────── */

/** The rarity plate per tier type (`TIER_HEADER`): exotic gold with black type, legendary purple. */
const TIER_HEADER: Record<number, { bg: string; dark: boolean }> = {
  6: { bg: '#ceae33', dark: true },
  5: { bg: '#522f65', dark: false },
  4: { bg: '#5076a3', dark: false },
  3: { bg: '#366f42', dark: false },
  2: { bg: '#c3bcb4', dark: true },
}

/** Watermark box in the plate's top-left corner, as in the game's inspect screen. */
const WATERMARK_PX = 64

/**
 * The rarity plate: name and the lock, then element, type and champion with Power on
 * the right; the season watermark and tier pips in the corner. Masterworked: a gold
 * rule along the bottom with a faint gold glow rising from it.
 */
function Header({
  item,
  details,
  locked,
  onLock,
}: {
  item: ItemTileData
  details: WeaponDetails
  locked: boolean
  onLock: () => void
}) {
  const plate = TIER_HEADER[details.tierType] ?? { bg: 'rgb(252 252 245 / 0.1)', dark: false }
  const lockLabel = locked ? 'Unlock' : 'Lock'
  const breaker = item.breaker ? BREAKERS[item.breaker] : undefined
  const pips = item.tier !== undefined && item.tier >= 2 && item.tier <= 5 ? item.tier : 0
  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        gap: 4,
        minHeight: 68,
        overflow: 'hidden',
        padding: '10px 12px 10px 26px',
        backgroundColor: plate.bg,
        color: plate.dark ? '#000' : '#fff',
        flexShrink: 0,
        ...(item.masterworked
          ? { borderBottom: '2px solid #ffcf11', boxShadow: 'inset 0 -6px 8px rgb(255 207 17 / 0.13)' }
          : null),
      }}
    >
      {(item.watermark || pips > 0) && (
        <span aria-hidden style={{ position: 'absolute', top: 0, left: 0, width: WATERMARK_PX, height: WATERMARK_PX, pointerEvents: 'none' }}>
          {item.watermark && (
            <>
              <span
                style={{
                  position: 'absolute',
                  top: 0,
                  bottom: 0,
                  left: 0,
                  width: '26.042%',
                  backgroundImage: 'linear-gradient(rgb(0 0 0 / 0.75) 0px, transparent 95%)',
                }}
              />
              <span
                style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundColor: '#fff',
                  transform: 'translate(-1.5625%, -1.5625%)',
                  maskImage: `url(${item.watermark})`,
                  WebkitMaskImage: `url(${item.watermark})`,
                  maskMode: 'luminance',
                  maskSize: '100% 100%',
                  WebkitMaskSize: '100% 100%',
                }}
              />
            </>
          )}
          {pips > 0 && (
            <span style={{ position: 'absolute', inset: 0 }}>
              {Array.from({ length: pips }, (_, i) => (
                <span
                  key={i}
                  style={{
                    position: 'absolute',
                    aspectRatio: '1',
                    width: PIP_SIDE,
                    left: PIP_LEFT,
                    top: pipTop(i),
                    transform: 'rotate(45deg)',
                    borderRadius: '12%',
                    backgroundImage: pipFill(pips),
                  }}
                />
              ))}
            </span>
          )}
        </span>
      )}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
        <p style={{ margin: 0, fontSize: 15, lineHeight: 1.25, fontWeight: 500 }}>{item.name}</p>
        <button
          type="button"
          title={`${lockLabel} (in game too)`}
          aria-label={lockLabel}
          aria-pressed={locked}
          onClick={onLock}
          className="cfx-det-lock cfx-det-focus"
        >
          <HugeIcon paths={locked ? LOCK_ICON : UNLOCK_ICON} size={14} />
        </button>
      </div>
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <span
          style={{
            display: 'flex',
            flexShrink: 0,
            alignItems: 'center',
            gap: 6,
            fontSize: 13,
            lineHeight: LEADING,
            whiteSpace: 'nowrap',
            color: plate.dark ? 'rgb(0 0 0 / 0.65)' : 'rgb(255 255 255 / 0.65)',
          }}
        >
          <img src={item.damageIcon} alt="" width={14} height={14} draggable={false} style={{ display: 'block', width: 14, height: 14 }} />
          {item.typeName}
          {breaker && (
            <span title={`Stuns ${breaker.name}`} style={{ display: 'flex', alignItems: 'center', gap: 4, marginLeft: 6 }}>
              <img
                src={breaker.icon}
                alt=""
                width={14}
                height={14}
                draggable={false}
                style={{ display: 'block', width: 14, height: 14, ...(plate.dark ? { filter: 'brightness(0)' } : null) }}
              />
              {breaker.name}
            </span>
          )}
        </span>
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'baseline',
            gap: '0.3em',
            fontSize: 11,
            lineHeight: LEADING,
            fontWeight: 500,
            fontVariantNumeric: 'tabular-nums',
            whiteSpace: 'nowrap',
          }}
        >
          <PowerGlyph />
          {item.power}
        </span>
      </div>
    </div>
  )
}

/** Destiny's hollow light-level diamond (`power-value.tsx`), verbatim. */
function PowerGlyph() {
  return (
    <svg
      width="6"
      height="6"
      viewBox="0 0 6 6"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      style={{ display: 'inline-block', width: '0.55em', height: '0.55em', flexShrink: 0, transform: 'translateY(-0.05em)' }}
    >
      <path
        d="M4.27246 1.72754L6 3L4.27246 4.27246L3 6L1.72754 4.27246L0 3L1.72754 1.72754L3 0L4.27246 1.72754ZM2.54199 2.54199L1.91992 3L2.54199 3.45801L3 4.08008L3.45801 3.45801L4.08008 3L3.45801 2.54199L3 1.91992L2.54199 2.54199Z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </svg>
  )
}

/** The enhanced-perk arrow (`enhanced-arrow.tsx`), verbatim: a solid head over a fading stem. */
function EnhancedArrow({ style }: { style?: CSSProperties }) {
  const fade = useId()
  return (
    <svg viewBox="0 0 10 10" aria-hidden fill="currentColor" style={style}>
      <defs>
        <linearGradient id={fade} x1="0" y1="5" x2="0" y2="10" gradientUnits="userSpaceOnUse">
          <stop stopColor="currentColor" stopOpacity="0.9" />
          <stop offset="1" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d="M5 0L9.65 5H0.35L5 0Z" />
      <rect x="3.08" y="5" width="3.84" height="5" fill={`url(#${fade})`} />
      <rect x="3.08" y="5" width="0.45" height="5" />
      <rect x="6.47" y="5" width="0.45" height="5" />
    </svg>
  )
}

/* ── Hugeicons (the app's @hugeicons/core-free-icons, as HugeiconsIcon renders them) ── */

type IconPath = { d: string; cap?: boolean; join?: boolean } | { circle: [number, number, number]; transform?: string; cap?: boolean; join?: boolean }

const P = (d: string, cap = true, join = true): IconPath => ({ d, cap, join })

const LOCK_ICON: IconPath[] = [
  P('M12 14.5V17.5M13 14.5C13 15.0523 12.5523 15.5 12 15.5C11.4477 15.5 11 15.0523 11 14.5C11 13.9477 11.4477 13.5 12 13.5C12.5523 13.5 13 13.9477 13 14.5Z'),
  P('M16.5 9V6.5C16.5 4.01472 14.4853 2 12 2C9.51471 2 7.49999 4.01472 7.49999 6.5V9'),
  P(
    'M4.2678 18.8447C4.49268 20.515 5.87612 21.8235 7.55965 21.9009C8.97627 21.966 10.4153 22 12 22C13.5847 22 15.0237 21.966 16.4403 21.9009C18.1239 21.8235 19.5073 20.515 19.7322 18.8447C19.8789 17.7547 20 16.6376 20 15.5C20 14.3624 19.8789 13.2453 19.7322 12.1553C19.5073 10.485 18.1239 9.17649 16.4403 9.09909C15.0237 9.03397 13.5847 9 12 9C10.4153 9 8.97627 9.03397 7.55965 9.09909C5.87612 9.17649 4.49268 10.485 4.2678 12.1553C4.12104 13.2453 3.99999 14.3624 3.99999 15.5C3.99999 16.6376 4.12104 17.7547 4.2678 18.8447Z',
  ),
]
const UNLOCK_ICON: IconPath[] = [
  P('M12 14.5V17.5M13 14.5C13 15.0523 12.5523 15.5 12 15.5C11.4477 15.5 11 15.0523 11 14.5C11 13.9477 11.4477 13.5 12 13.5C12.5523 13.5 13 13.9477 13 14.5Z'),
  P('M7.5 9V6.5C7.5 4.01472 9.51472 2 12 2C13.9593 2 15.8664 3.25221 16.5 5'),
  P(
    'M4.26781 18.8447C4.49269 20.515 5.87613 21.8235 7.55966 21.9009C8.97627 21.966 10.4153 22 12 22C13.5847 22 15.0237 21.966 16.4403 21.9009C18.1239 21.8235 19.5073 20.515 19.7322 18.8447C19.879 17.7547 20 16.6376 20 15.5C20 14.3624 19.879 13.2453 19.7322 12.1553C19.5073 10.485 18.1239 9.17649 16.4403 9.09909C15.0237 9.03397 13.5847 9 12 9C10.4153 9 8.97627 9.03397 7.55966 9.09909C5.87613 9.17649 4.49269 10.485 4.26781 12.1553C4.12104 13.2453 4 14.3624 4 15.5C4 16.6376 4.12104 17.7547 4.26781 18.8447Z',
  ),
]
const COMPARE_ICON: IconPath[] = [
  P('M19 17L19 11C19 8.17157 19 6.75736 18.1213 5.87868C17.2426 5 15.8284 5 13 5H10M10 5C10 4.29977 11.9943 2.99153 12.5 2.5M10 5C10 5.70023 11.9943 7.00847 12.5 7.5'),
  P('M5 7.5L5 13.5C5 16.3284 5 17.7426 5.87868 18.6213C6.75736 19.5 8.17157 19.5 11 19.5H14M14 19.5C14 20.2002 12.0057 21.5085 11.5 22M14 19.5C14 18.7998 12.0057 17.4915 11.5 17'),
  { circle: [19, 19, 2], cap: false, join: false },
  { circle: [5, 5, 2], cap: false, join: false },
]

type Tag = 'favorite' | 'keep' | 'junk'
/** The tags the panel offers (`PANEL_TAGS`) and their labels. */
const PANEL_TAGS: readonly Tag[] = ['favorite', 'keep', 'junk']
const TAG_LABELS: Record<Tag, string> = { favorite: 'Favorite', keep: 'Keep', junk: 'Junk' }
/** DIM's tag glyphs (`tag-icons.ts`): heart, tag, bin. */
const TAG_ICONS: Record<Tag, IconPath[]> = {
  favorite: [
    P(
      'M10.4107 19.9677C7.58942 17.858 2 13.0348 2 8.69444C2 5.82563 4.10526 3.5 7 3.5C8.5 3.5 10 4 12 6C14 4 15.5 3.5 17 3.5C19.8947 3.5 22 5.82563 22 8.69444C22 13.0348 16.4106 17.858 13.5893 19.9677C12.6399 20.6776 11.3601 20.6776 10.4107 19.9677Z',
    ),
  ],
  keep: [
    { circle: [1.5, 1.5, 1.5], transform: 'matrix(1 0 0 -1 16 8.00024)' },
    P(
      'M2.77423 11.1439C1.77108 12.2643 1.7495 13.9546 2.67016 15.1437C4.49711 17.5033 6.49674 19.5029 8.85633 21.3298C10.0454 22.2505 11.7357 22.2289 12.8561 21.2258C15.8979 18.5022 18.6835 15.6559 21.3719 12.5279C21.6377 12.2187 21.8039 11.8397 21.8412 11.4336C22.0062 9.63798 22.3452 4.46467 20.9403 3.05974C19.5353 1.65481 14.362 1.99377 12.5664 2.15876C12.1603 2.19608 11.7813 2.36233 11.472 2.62811C8.34412 5.31646 5.49781 8.10211 2.77423 11.1439Z',
      false,
      false,
    ),
    P('M7.00002 14.0002L10 17.0002'),
  ],
  junk: [
    P(
      'M19.5 5.5L18.8803 15.5251C18.7219 18.0864 18.6428 19.3671 18.0008 20.2879C17.6833 20.7431 17.2747 21.1273 16.8007 21.416C15.8421 22 14.559 22 11.9927 22C9.42312 22 8.1383 22 7.17905 21.4149C6.7048 21.1257 6.296 20.7408 5.97868 20.2848C5.33688 19.3626 5.25945 18.0801 5.10461 15.5152L4.5 5.5',
      true,
      false,
    ),
    P(
      'M3 5.5H21M16.0557 5.5L15.3731 4.09173C14.9196 3.15626 14.6928 2.68852 14.3017 2.39681C14.215 2.3321 14.1231 2.27454 14.027 2.2247C13.5939 2 13.0741 2 12.0345 2C10.9688 2 10.436 2 9.99568 2.23412C9.8981 2.28601 9.80498 2.3459 9.71729 2.41317C9.32164 2.7167 9.10063 3.20155 8.65861 4.17126L8.05292 5.5',
      true,
      false,
    ),
    P('M9.5 16.5L9.5 10.5', true, false),
    P('M14.5 16.5L14.5 10.5', true, false),
  ],
}

/** An icon as `HugeiconsIcon` renders it: a 24-unit stroked SVG in currentColor, 1.5 wide. */
function HugeIcon({ paths, size }: { paths: IconPath[]; size: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      style={{ display: 'block', flexShrink: 0, width: size, height: size }}
    >
      {paths.map((p, i) => {
        const stroke = {
          stroke: 'currentColor',
          strokeWidth: 1.5,
          ...(p.cap !== false ? { strokeLinecap: 'round' as const } : null),
          ...(p.join !== false ? { strokeLinejoin: 'round' as const } : null),
        }
        return 'd' in p ? (
          <path key={i} d={p.d} {...stroke} />
        ) : (
          <circle key={i} cx={p.circle[0]} cy={p.circle[1]} r={p.circle[2]} transform={p.transform} {...stroke} />
        )
      })}
    </svg>
  )
}

/* ── Stats ──────────────────────────────────────────────────────────── */

/** Counts and times read as numbers, not 0–100 bars (`WEAPON_STAT_NUMBERS`). */
const STAT_NUMBERS = ['Rounds Per Minute', 'Charge Time', 'Draw Time', 'Swing Speed', 'Magazine', 'Ammo Capacity']

const clamp = (value: number) => Math.min(Math.max(value, 0), 100)

/** An investment value on a stat group's display curve, rounded half to even (`interpolateStat`). */
function interpolate(investment: number, curve: StatCurve) {
  const value = Math.min(Math.max(investment, 0), curve.max)
  const { points } = curve
  const end = points.findIndex(([at]) => at > value)
  if (end < 0) return points[points.length - 1][1]
  if (end === 0) return points[0][1]
  const [fromValue, fromWeight] = points[end - 1]
  const [toValue, toWeight] = points[end]
  const exact = fromWeight + ((value - fromValue) / (toValue - fromValue)) * (toWeight - fromWeight)
  const floor = Math.floor(exact)
  if (Math.abs(exact - floor - 0.5) > 1e-9) return Math.round(exact)
  return floor % 2 === 0 ? floor : floor + 1
}

/** Displayed stats with the given perks slotted (`weaponDisplayStats`): base investment plus their stats. */
function displayStats(details: WeaponDetails, refs: number[]): Record<string, number> {
  const out: Record<string, number> = {}
  for (const [name, base] of Object.entries(details.investment)) {
    let investment = base
    for (const ref of refs) investment += PERK_REFS[ref]?.stats?.[name] ?? 0
    const curve = details.curves[name]
    out[name] = curve ? interpolate(investment, curve) : investment
  }
  return out
}

/** `stats` moved by what swapping `from` perks for `to` perks changes; bars stay in 0–100. */
function shifted(details: WeaponDetails, stats: Record<string, number>, from: number[], to: number[]) {
  const before = displayStats(details, from)
  const after = displayStats(details, to)
  const out: Record<string, number> = {}
  for (const [name, value] of Object.entries(stats)) {
    const next = value + ((after[name] ?? 0) - (before[name] ?? 0))
    out[name] = STAT_NUMBERS.includes(name) ? next : clamp(next)
  }
  return out
}

/** Name, value, and bar per stat on one line; a previewed change shows green or red. */
function StatRows({ stats, preview }: { stats: { name: string; value: number }[]; preview?: Record<string, number> }) {
  return (
    <dl
      style={{
        display: 'grid',
        gridTemplateColumns: 'auto 1.75rem 1fr',
        alignItems: 'center',
        columnGap: 8,
        rowGap: 2,
        margin: 0,
        fontSize: 11,
        lineHeight: LEADING,
      }}
    >
      {stats.map(({ name, value: base }) => {
        const value = preview?.[name] ?? base
        const bar = !STAT_NUMBERS.includes(name)
        const low = clamp(Math.min(value, base))
        const high = clamp(Math.max(value, base))
        return (
          <div key={name} style={{ display: 'contents' }}>
            <dt style={{ color: MUTED, textAlign: 'right' }}>{name}</dt>
            <dd
              style={{
                margin: 0,
                fontVariantNumeric: 'tabular-nums',
                color: value > base ? POSITIVE : value < base ? DESTRUCTIVE : undefined,
              }}
            >
              {value}
            </dd>
            <dd
              aria-hidden
              style={{ position: 'relative', height: 6, margin: 0, backgroundColor: bar ? 'rgb(252 252 245 / 0.1)' : undefined }}
            >
              {bar && (
                <>
                  <span
                    style={{ position: 'absolute', top: 0, bottom: 0, left: 0, width: `${low}%`, backgroundColor: 'rgb(252 252 245 / 0.8)' }}
                  />
                  {value !== base && (
                    <span
                      style={{
                        position: 'absolute',
                        top: 0,
                        bottom: 0,
                        left: `${low}%`,
                        width: `${high - low}%`,
                        backgroundColor: value > base ? POSITIVE : DESTRUCTIVE,
                      }}
                    />
                  )}
                </>
              )}
            </dd>
          </div>
        )
      })}
    </dl>
  )
}

/* ── Roll ───────────────────────────────────────────────────────────── */

/** How long the replica's "Applying…" lasts before the picks go in. */
const APPLY_MS = 700

/**
 * The weapon's roll: frame, perks, mods, stats (`WeaponRollPanel`). Hovering a perk it
 * rolled previews its stat change; clicking picks it (several columns at once), and
 * Apply perks swaps them in. `applied` holds what earlier applies put in each socket.
 */
function WeaponRollPanel({
  details,
  applied,
  onApply,
}: {
  details: WeaponDetails
  applied: Record<number, number>
  onApply: (changes: Record<number, number>) => void
}) {
  const [hovered, setHovered] = useState<{ socketIndex: number; hash: number } | null>(null)
  /** Picked perk per socket index (only where it differs from what's in the socket). */
  const [picked, setPicked] = useState<Record<number, number>>({})
  const [applying, setApplying] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  useEffect(() => () => clearTimeout(timer.current), [])

  const { columns } = details
  const optionFor = (c: PerkColumn, hash: number) => c.options.find((o) => o.hash === hash)
  /** What's in the socket now. */
  const current = (c: PerkColumn): PerkOption => optionFor(c, applied[c.socketIndex] ?? c.current) ?? c.options[0]
  // What each column would hold: the hovered perk, else the picked one, else the current.
  const chosen = (c: PerkColumn): PerkOption => {
    const hash = hovered?.socketIndex === c.socketIndex ? hovered.hash : (picked[c.socketIndex] ?? current(c).hash)
    return optionFor(c, hash) ?? current(c)
  }
  const changes = columns.flatMap((c) => {
    const hash = picked[c.socketIndex]
    return hash !== undefined && hash !== current(c).hash ? [{ socketIndex: c.socketIndex, hash }] : []
  })

  // The live stats, moved by any applied swap; then the preview of the chosen perks on top.
  const original = columns.map((c) => c.options.find((o) => o.hash === c.current)?.ref ?? c.options[0].ref)
  const now = columns.map((c) => current(c).ref)
  const liveMap = shifted(details, Object.fromEntries(details.stats.map((s) => [s.name, s.value])), original, now)
  const stats = details.stats.map((s) => ({ name: s.name, value: liveMap[s.name] ?? s.value }))
  const previewing = hovered !== null || changes.length > 0
  const preview = previewing ? shifted(details, liveMap, now, columns.map((c) => chosen(c).ref)) : undefined

  const pick = (c: PerkColumn, hash: number) =>
    setPicked((prev) => {
      const next = { ...prev }
      if (hash === current(c).hash || prev[c.socketIndex] === hash) delete next[c.socketIndex]
      else next[c.socketIndex] = hash
      return next
    })

  const apply = () => {
    if (changes.length === 0) return
    setApplying(true)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => {
      onApply(Object.fromEntries(changes.map((c) => [c.socketIndex, c.hash])))
      setApplying(false)
      setPicked({})
    }, APPLY_MS)
  }

  const masterwork = details.mods.find((m) => m.kind === 'masterwork')
  // Masterwork and weapon mod on the left, the cosmetics (shader, ornament) past a rule.
  const gearMods = details.mods.filter((m) => m.kind === 'mod')
  const cosmetics = details.mods.filter((m) => m.kind === 'shader' || m.kind === 'ornament')

  return (
    <>
      <FrameRow plug={details.frame} />
      <div style={{ ...SECTION, gap: 16 }}>
        {/* Inset (p-1, given back by -m-1) so the scroller doesn't clip the hover ring. */}
        <div
          role="group"
          aria-label="Perks"
          className="cfx-det-perks"
          style={{ display: 'flex', gap: 8, overflowX: 'auto', margin: -4, padding: 4 }}
        >
          {columns.map((column) =>
            column.origin && column.options.length <= 1 ? (
              <div key={column.socketIndex} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <PlainPlug plug={current(column)} perk={PERK_REFS[current(column).ref]} />
              </div>
            ) : (
              <PerkColumnView
                key={column.socketIndex}
                column={column}
                current={current(column).hash}
                selected={picked[column.socketIndex] ?? current(column).hash}
                onHover={(hash) => setHovered(hash === null ? null : { socketIndex: column.socketIndex, hash })}
                onPick={(hash) => pick(column, hash)}
              />
            ),
          )}
        </div>
        {(masterwork || gearMods.length > 0 || cosmetics.length > 0) && (
          <div role="group" aria-label="Mods" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            {(masterwork || gearMods.length > 0) && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                {masterwork && <PlainPlug plug={masterwork} size={MOD_PX} />}
                {gearMods.map((mod) => (
                  <PlugBadge key={mod.hash} plug={mod} size={MOD_PX - 2} />
                ))}
              </div>
            )}
            {(masterwork || gearMods.length > 0) && cosmetics.length > 0 && (
              <span aria-hidden style={{ display: 'block', width: 1, height: 24, backgroundColor: 'rgb(252 252 245 / 0.12)' }} />
            )}
            {cosmetics.length > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                {cosmetics.map((mod) => (
                  <PlugBadge key={mod.hash} plug={mod} size={MOD_PX - 2} />
                ))}
              </div>
            )}
          </div>
        )}
        {changes.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8 }}>
            <button type="button" className="cfx-det-btn cfx-det-ring" disabled={applying} onClick={apply}>
              {applying ? 'Applying…' : `Apply ${changes.length === 1 ? 'perk' : `${changes.length} perks`}`}
            </button>
            <button type="button" className="cfx-det-btn" data-variant="ghost" disabled={applying} onClick={() => setPicked({})}>
              Reset
            </button>
          </div>
        )}
      </div>
      <div style={SECTION}>
        <StatRows stats={stats} preview={preview} />
      </div>
    </>
  )
}

/** Masterwork and mod icons, including the mods' 1px line. */
const MOD_PX = 36

/** Perk cells: 40px with a 30px icon. */
const PERK_CELL: CSSProperties = {
  position: 'relative',
  display: 'flex',
  flexShrink: 0,
  alignItems: 'center',
  justifyContent: 'center',
  width: 40,
  height: 40,
}

function PlugIcon({ plug, size }: { plug: DetailPlug; size: number }) {
  return (
    <img
      src={plug.icon}
      alt=""
      width={size}
      height={size}
      draggable={false}
      decoding="async"
      style={{ display: 'block', width: size, height: size, maxWidth: 'none', pointerEvents: 'none' }}
    />
  )
}

/** A plug's name over its description: the frame, mod and masterwork tooltips. */
function PlugText({ plug }: { plug: DetailPlug }) {
  return (
    <>
      <p style={{ margin: 0, fontWeight: 500 }}>{plug.name}</p>
      {plug.description && <p style={{ margin: 0, color: MUTED }}>{plug.description}</p>}
    </>
  )
}

/** The frame (intrinsic) on its own row under the header: icon and name. */
function FrameRow({ plug }: { plug: DetailPlug }) {
  return (
    <DetTip
      as="div"
      side="right"
      label={<PlugText plug={plug} />}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '8px 16px',
        fontSize: 12,
        lineHeight: '16px',
        backgroundColor: 'rgb(252 252 245 / 0.04)',
        flexShrink: 0,
      }}
    >
      <PlugIcon plug={plug} size={24} />
      {plug.name}
    </DetTip>
  )
}

/**
 * A plug shown without a cell (the masterwork, a lone origin trait), with its tooltip
 * on hover: the perk tooltip for a perk, else its name and description.
 */
function PlainPlug({ plug, perk, size }: { plug: DetailPlug; perk?: PerkRef; size?: number }) {
  return (
    <DetTip
      as="span"
      side="right"
      aria-label={plug.name}
      label={perk ? <PerkTooltip perk={perk} /> : <PlugText plug={plug} />}
      style={size ? { display: 'block' } : PERK_CELL}
    >
      <PlugIcon plug={plug} size={size ?? 30} />
    </DetTip>
  )
}

/** A socketed plug's icon in the mods' 1px line, with its name and description below it. */
function PlugBadge({ plug, size }: { plug: DetailPlug; size: number }) {
  return (
    <DetTip
      as="span"
      side="bottom"
      maxWidth={320}
      label={<PlugText plug={plug} />}
      style={{ display: 'block', border: '1px solid rgb(252 252 245 / 0.15)' }}
    >
      <PlugIcon plug={plug} size={size} />
    </DetTip>
  )
}

/**
 * One perk column: every option it rolled. The perk it will have is filled blue; when
 * another one is picked, the one in the socket now keeps a faint blue fill.
 */
function PerkColumnView({
  column,
  current,
  selected,
  onHover,
  onPick,
}: {
  column: PerkColumn
  current: number
  selected: number
  onHover: (hash: number | null) => void
  onPick: (hash: number) => void
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {column.options.map((option) => {
        const isSelected = option.hash === selected
        const isCurrent = option.hash === current
        const state = isSelected ? 'selected' : isCurrent ? 'current' : 'option'
        return (
          <DetTip
            key={option.hash}
            as="button"
            side="right"
            type="button"
            aria-label={isCurrent ? `${option.name} (equipped)` : option.name}
            aria-pressed={isSelected}
            data-state={state}
            className={`cfx-det-perk cfx-det-focus${state === 'option' ? ' cfx-det-ring' : ''}`}
            onClick={() => onPick(option.hash)}
            onPointerEnter={() => !isSelected && onHover(option.hash)}
            onPointerLeave={() => onHover(null)}
            label={<PerkTooltip perk={PERK_REFS[option.ref] ?? { name: option.name, description: option.description }} />}
          >
            <PlugIcon plug={option} size={30} />
            {option.enhanced && (
              <EnhancedArrow style={{ position: 'absolute', top: 2, left: 2, width: 10, height: 10, color: EXOTIC_LINE }} />
            )}
          </DetTip>
        )
      })}
    </div>
  )
}

/* ── Perk tooltip (`weapons/perk-tooltip.tsx`) ───────────────────────── */

const ENHANCED: CSSProperties = { fontWeight: 500, color: EXOTIC_LINE }
/** The arrow sized to the surrounding text. */
const INLINE_ARROW: CSSProperties = { display: 'inline-block', width: '0.9em', height: '0.9em', verticalAlign: '-0.05em' }

/** Clarity's class names, as the app colours them (Tailwind's rose / sky / orange-300 for champions). */
const CLASS_STYLE: Record<string, CSSProperties> = {
  bold: { fontWeight: 500, color: FG },
  arc: { color: '#5ec8e8' },
  solar: { color: '#e87a32' },
  void: { color: '#b888e0' },
  stasis: { color: '#6b9fff' },
  strand: { color: '#3cce74' },
  kinetic: { color: FG },
  primary: { color: FG },
  special: { color: '#3cce74' },
  heavy: { color: '#b888e0' },
  barrier: { color: 'oklch(89.2% 0.058 10.001)' },
  overload: { color: 'oklch(82.8% 0.111 230.318)' },
  unstoppable: { color: 'oklch(83.7% 0.128 66.29)' },
}
const classStyle = (names: string[] | undefined): CSSProperties | undefined =>
  names?.length ? Object.assign({}, ...names.map((n) => CLASS_STYLE[n] ?? {})) : undefined

/**
 * Numbers stand out; `(↑ …)` enhanced values and Clarity's `🠚` transitions go gold.
 * Groups, in order: an enhanced value (inside the brackets), a transition, a number.
 */
const HIGHLIGHT = /\(↑ ([^)]+)\)|(🠚)|([+-]?\d+(?:\.\d+)?(?:%|x|s|ms|HP)?)/g

function highlight(text: string): ReactNode[] {
  const nodes: ReactNode[] = []
  let at = 0
  for (const match of text.matchAll(HIGHLIGHT)) {
    const index = match.index ?? 0
    if (index > at) nodes.push(text.slice(at, index))
    const [, enhanced, transition, number] = match
    nodes.push(
      enhanced !== undefined ? (
        <span key={index} style={ENHANCED}>
          (<EnhancedArrow style={INLINE_ARROW} /> {enhanced})
        </span>
      ) : transition ? (
        <span key={index} style={ENHANCED}>
          →
        </span>
      ) : (
        <span key={index} style={{ fontWeight: 500, color: FG }}>
          {number}
        </span>
      ),
    )
    at = index + match[0].length
  }
  if (at < text.length) nodes.push(text.slice(at))
  return nodes
}

function Run({ part }: { part: InsightRun }) {
  if (part.c?.includes('enhancedArrow'))
    return (
      <span style={{ ...ENHANCED, marginRight: '0.25em' }}>
        <EnhancedArrow style={INLINE_ARROW} />
      </span>
    )
  if (!part.x) return null
  // Links can't be followed from a hover tooltip; they stay plain text.
  return <span style={classStyle(part.c)}>{highlight(part.x)}</span>
}

function ClarityLines({ lines }: { lines: InsightLine[] }) {
  return lines.map((line, i) =>
    line.c?.includes('spacer') ? (
      <div key={i} aria-hidden style={{ height: 8 }} />
    ) : (
      <p key={i} style={{ margin: 0, ...classStyle(line.c) }}>
        {line.t?.map((part, j) => (
          <Run key={j} part={part} />
        ))}
      </p>
    ),
  )
}

/** A perk's tooltip body: Bungie's description, the enhanced tier, then Clarity's insight. */
function PerkTooltip({ perk }: { perk: PerkRef }) {
  return (
    <div style={{ display: 'grid', gap: 8, whiteSpace: 'normal' }}>
      <p style={{ margin: 0, fontWeight: 500, color: FG, textTransform: 'uppercase', letterSpacing: '0.025em' }}>
        {perk.name}
        {perk.retired && (
          <span style={{ marginLeft: 8, fontWeight: 400, textTransform: 'none', letterSpacing: 'normal', color: MUTED }}>Retired</span>
        )}
      </p>
      {perk.description && <p style={{ margin: 0, color: MUTED }}>{perk.description}</p>}
      {perk.enhancedDescription && (
        <p style={{ margin: 0, color: MUTED }}>
          <span style={ENHANCED}>
            <EnhancedArrow style={INLINE_ARROW} /> Enhanced:{' '}
          </span>
          {perk.enhancedDescription}
        </p>
      )}
      {perk.insight && (
        <div style={{ borderTop: '1px solid rgb(252 252 245 / 0.1)', paddingTop: 8, color: MUTED }}>
          <p style={{ margin: '0 0 6px', fontSize: 10, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Community insight from Clarity
          </p>
          <ClarityLines lines={perk.insight} />
        </div>
      )}
    </div>
  )
}

/* ── Tooltip (`ui/tooltip.tsx` on Base UI, delay 0) ─────────────────── */

const SIDE_OFFSET = 6
const COLLISION_PADDING = 5
const TOUCH_HOLD_MS = 450
const TOUCH_HOLD_SLOP_PX = 10
const HOLD_CLICK_MS = 400
/** A tip opening this soon after another closed opens at once, unanimated. */
const GROUP_MS = 400

/** The delay group, shared by every tip in the panel. */
const group = { open: 0, closedAt: 0 }
const inGroup = () => group.open > 0 || performance.now() - group.closedAt < GROUP_MS

/**
 * The app's tooltip as the panel uses it: a frosted slate plate (`d2-glass` +
 * `bg-panel-strong`), square, hairline, soft shadow, 6px off its trigger. `right` sits
 * beside the trigger aligned to its top (flipping left, then under it, when the window
 * has no room), `bottom` centred under it (flipping above). Hover opens it at once,
 * keyboard focus too, pressing the trigger closes it until the pointer leaves, and on
 * touch a still finger held for 450ms opens it and swallows the tap that ends the hold.
 */
function DetTip({
  as,
  side,
  maxWidth = 384,
  label,
  children,
  onPointerEnter,
  onPointerLeave,
  ...rest
}: HTMLAttributes<HTMLElement> & {
  as: 'button' | 'span' | 'div'
  side: 'right' | 'bottom'
  /** `max-w-sm` beside a perk, `max-w-xs` under a mod. */
  maxWidth?: number
  label: ReactNode
  type?: 'button'
  'data-state'?: string
  children: ReactNode
}) {
  const [open, setOpen] = useState<false | 'animate' | 'instant'>(false)
  const triggerRef = useRef<HTMLElement | null>(null)
  const popupRef = useRef<HTMLDivElement | null>(null)
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const hold = useRef<{ x: number; y: number } | null>(null)
  const swallow = useRef(false)
  const pressed = useRef(false)

  const show = () => {
    clearTimeout(timer.current)
    const instant = inGroup()
    setOpen((was) => was || (instant ? 'instant' : 'animate'))
  }
  const hide = () => {
    clearTimeout(timer.current)
    setOpen(false)
  }

  useEffect(() => {
    if (!open) return
    group.open += 1
    const close = () => setOpen(false)
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && close()
    const capture = { capture: true }
    document.addEventListener('keydown', onKey)
    document.addEventListener('scroll', close, capture)
    const onDown = (event: PointerEvent) => event.pointerType === 'touch' && close()
    document.addEventListener('pointerdown', onDown, capture)
    return () => {
      group.open -= 1
      group.closedAt = performance.now()
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('scroll', close, capture)
      document.removeEventListener('pointerdown', onDown, capture)
    }
  }, [open])

  useEffect(() => () => clearTimeout(timer.current), [])

  useLayoutEffect(() => {
    const trigger = triggerRef.current
    const popup = popupRef.current
    if (!open || !trigger || !popup) return
    const place = () => {
      const t = trigger.getBoundingClientRect()
      const w = popup.offsetWidth
      const h = popup.offsetHeight
      const vw = document.documentElement.clientWidth
      const vh = window.innerHeight
      const fitsX = (x: number) => x >= COLLISION_PADDING && x + w <= vw - COLLISION_PADDING
      const shiftX = (x: number) => Math.min(Math.max(x, COLLISION_PADDING), vw - COLLISION_PADDING - w)
      const shiftY = (y: number) => Math.min(Math.max(y, COLLISION_PADDING), vh - COLLISION_PADDING - h)
      let x: number
      let y: number
      let origin: string
      const right = t.right + SIDE_OFFSET
      const left = t.left - SIDE_OFFSET - w
      if (side === 'right' && (fitsX(right) || fitsX(left))) {
        const onRight = fitsX(right)
        x = onRight ? right : left
        y = shiftY(t.top)
        origin = `${onRight ? -SIDE_OFFSET : w + SIDE_OFFSET}px ${t.top - y}px`
      } else {
        const below = t.bottom + SIDE_OFFSET
        const above = t.top - SIDE_OFFSET - h
        const onTop = below + h > vh - COLLISION_PADDING && above >= COLLISION_PADDING
        x = shiftX(t.left + t.width / 2 - w / 2)
        y = onTop ? above : below
        origin = `${t.left + t.width / 2 - x}px ${onTop ? `calc(100% + ${SIDE_OFFSET}px)` : `-${SIDE_OFFSET}px`}`
      }
      popup.style.transform = `translate(${Math.round(x)}px, ${Math.round(y)}px)`
      const inner = popup.firstElementChild as HTMLElement | null
      if (inner) inner.style.transformOrigin = origin
      popup.style.visibility = 'visible'
    }
    place()
    window.addEventListener('resize', place)
    return () => window.removeEventListener('resize', place)
  }, [open, side])

  const Trigger = as as 'span'
  return (
    <>
      <Trigger
        {...rest}
        ref={triggerRef}
        onPointerEnter={(event) => {
          onPointerEnter?.(event)
          if (event.pointerType === 'touch' || pressed.current) return
          show()
        }}
        onPointerLeave={(event) => {
          onPointerLeave?.(event)
          if (event.pointerType === 'touch') return
          pressed.current = false
          hide()
        }}
        onPointerDown={(event) => {
          if (event.pointerType !== 'touch') {
            pressed.current = true
            hide()
            return
          }
          clearTimeout(timer.current)
          hold.current = { x: event.clientX, y: event.clientY }
          timer.current = setTimeout(() => {
            hold.current = null
            swallow.current = true
            show()
          }, TOUCH_HOLD_MS)
        }}
        onPointerMove={(event) => {
          const start = hold.current
          if (start && Math.hypot(event.clientX - start.x, event.clientY - start.y) > TOUCH_HOLD_SLOP_PX) {
            hold.current = null
            clearTimeout(timer.current)
          }
        }}
        onPointerUp={() => {
          if (hold.current) {
            hold.current = null
            clearTimeout(timer.current)
          }
          if (swallow.current) setTimeout(() => (swallow.current = false), HOLD_CLICK_MS)
        }}
        onPointerCancel={() => {
          hold.current = null
          clearTimeout(timer.current)
        }}
        onClickCapture={(event) => {
          if (!swallow.current) return
          swallow.current = false
          event.preventDefault()
          event.stopPropagation()
        }}
        onFocus={(event) => {
          if (event.currentTarget.matches(':focus-visible')) show()
        }}
        onBlur={hide}
      >
        {children}
      </Trigger>
      {open &&
        createPortal(
          <div
            ref={popupRef}
            className="cfx-det-tip"
            style={{ position: 'fixed', top: 0, left: 0, zIndex: 1000, pointerEvents: 'none', visibility: 'hidden' }}
          >
            <div
              role="tooltip"
              className={open === 'animate' ? 'cfx-det-tip-in' : undefined}
              style={{
                width: 'fit-content',
                maxWidth: `min(${maxWidth}px, calc(100vw - 1rem))`,
                padding: '8px 12px',
                background: 'rgb(55 67 88 / 0.82)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid rgb(252 252 245 / 0.15)',
                boxShadow: '0 2px 16px rgb(0 0 0 / 0.25)',
                color: FG,
                fontFamily: FONT,
                fontSize: 12,
                fontWeight: 400,
                lineHeight: 1.625,
                whiteSpace: 'pre-line',
                textAlign: 'start',
                WebkitFontSmoothing: 'antialiased',
                MozOsxFontSmoothing: 'grayscale',
              }}
            >
              {label}
            </div>
          </div>,
          document.body,
        )}
    </>
  )
}
