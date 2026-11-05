import type { CSSProperties, ReactNode } from 'react'
import { FONT, ITEM_BACKING, ITEM_FRAME, ITEM_FRAME_MASTERWORK } from './confluxTheme'
import { CRAFT_GLYPHS } from './craftGlyphs'
import {
  BREAKERS,
  CHAMPION_FOOTER,
  CRAFT_GLYPH_SIZE,
  CRAFT_GLYPH_X,
  CRAFT_GLYPH_Y,
  ITEM_TILE_SET,
  PIP_LEFT,
  PIP_SIDE,
  ROOMY_FOOTER,
  TILE_FOOTER,
  TILE_GAP,
  TILE_WIDTH,
  pipFill,
  pipTop,
  tileLabel,
  type ItemTileData,
} from './itemData'
import './loadout.css'

/**
 * An item's art the way D2 Conflux's `ArmorThumb` draws it: the icon on the dark
 * backing, Bungie's watermark redrawn (its black strip swapped for a fading one flush
 * with the art, the season glyph kept as a luminance mask over white), the masterwork's
 * inner gold glow, and the gear-tier pips down the strip. Shared with the loadout card.
 */
export function ItemArt({
  src,
  alt = '',
  watermark,
  tier,
  masterworked = false,
  craft,
  scale = 1,
  className,
  style,
}: {
  src: string
  alt?: string
  watermark?: string
  tier?: number
  masterworked?: boolean
  /** A crafted or enhanced weapon: its glyph and a red glow in the bottom-right corner. */
  craft?: 'crafted' | 'enhanced'
  /** Scales the glow with the tile (1 at the app's 58px art). */
  scale?: number
  className?: string
  style?: CSSProperties
}) {
  const pips = tier !== undefined && tier >= 2 && tier <= 5 ? tier : 0
  return (
    <span
      className={className}
      style={{
        position: 'relative',
        display: 'inline-block',
        flexShrink: 0,
        overflow: 'hidden',
        backgroundColor: ITEM_BACKING,
        ...style,
      }}
    >
      <img
        src={src}
        alt={alt}
        draggable={false}
        decoding="async"
        style={{ display: 'block', width: '100%', height: '100%', maxWidth: 'none', pointerEvents: 'none' }}
      />
      {watermark && (
        <>
          <span
            aria-hidden
            style={{
              ...OVERLAY,
              right: 'auto',
              width: '26.042%',
              backgroundImage: 'linear-gradient(rgb(0 0 0 / 0.75) 0px, transparent 95%)',
            }}
          />
          <span
            aria-hidden
            style={{
              ...OVERLAY,
              backgroundColor: '#fff',
              transform: 'translate(-1.5625%, -1.5625%)',
              maskImage: `url(${watermark})`,
              maskMode: 'luminance',
              maskSize: '100% 100%',
            }}
          />
        </>
      )}
      {masterworked && (
        <span
          aria-hidden
          style={{
            ...OVERLAY,
            boxShadow: `inset 0 0 ${6 * scale}px ${1 * scale}px rgba(255, 235, 103, 0.45)`,
          }}
        />
      )}
      {craft && <CraftedGlyph kind={craft} />}
      {pips > 0 && (
        <span aria-hidden style={OVERLAY}>
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
  )
}

const OVERLAY: CSSProperties = { position: 'absolute', inset: 0, pointerEvents: 'none' }

/**
 * The crafted (shaped) or enhanced glyph in the art's bottom-right corner, as the app
 * draws it (`CraftedGlyph` in `armor-thumb.tsx`): the user's own vector glyph fitted to
 * its box in #E7806A, over a red glow fading out from the corner, with a soft red
 * drop shadow. Vectors, so it stays sharp at any tile size.
 */
function CraftedGlyph({ kind }: { kind: 'crafted' | 'enhanced' }) {
  const glyph = CRAFT_GLYPHS[kind]
  const scale = CRAFT_GLYPH_SIZE[kind] / Math.max(glyph.width, glyph.height)
  const w = glyph.width * scale
  const h = glyph.height * scale
  return (
    <>
      <span
        aria-hidden
        style={{ ...OVERLAY, backgroundImage: 'radial-gradient(circle at 100% 100%, rgb(219 100 75 / 0.55), transparent 32%)' }}
      />
      <svg
        aria-hidden
        viewBox="0 0 96 96"
        style={{ ...OVERLAY, width: '100%', height: '100%', filter: 'drop-shadow(0 0 2px rgb(219 100 75 / 0.75))' }}
      >
        <svg
          x={CRAFT_GLYPH_X - w / 2}
          y={CRAFT_GLYPH_Y - h / 2}
          width={w}
          height={h}
          viewBox={`0 0 ${glyph.width} ${glyph.height}`}
          fill="#E7806A"
        >
          {glyph.paths.map((d) => (
            <path key={d} d={d} />
          ))}
        </svg>
      </svg>
    </>
  )
}

/**
 * The tile's label bar: the frame colour (it is the frame's own fill showing under the
 * art), black 11px medium tabular type, contents pushed right.
 */
export function TileFooter({
  scale = 1,
  roomy = true,
  children,
}: {
  scale?: number
  roomy?: boolean
  children: ReactNode
}) {
  return (
    <span
      style={{
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
        height: TILE_FOOTER * scale,
        padding: `0 ${2 * scale}px`,
        gap: roomy ? 2 * scale : 0,
        fontFamily: FONT,
        fontSize: 11 * scale,
        lineHeight: 1,
        fontWeight: 500,
        color: '#000',
        fontVariantNumeric: 'tabular-nums',
        whiteSpace: 'nowrap',
      }}
    >
      <span style={{ flex: 1 }} />
      {children}
    </span>
  )
}

/**
 * One Items-page inventory cell (`components/manager/item-tile.tsx`): the art in a 1px
 * frame — grey, or gold with the inner glow once masterworked — over a label bar in
 * the frame colour with the element glyph and Power. Hover rings it 2px off (pointer
 * only); keyboard focus draws the white selected frame and glow. Its title is the
 * app's (name, type, Power), its accessible name the same joined with commas.
 * `size` is the tile's CSS width (the app's 60 by default); frame, bar, type, glyph
 * and glow all scale with it.
 */
export function ItemTile({
  item,
  size = TILE_WIDTH,
  selected = false,
  onSelect,
  style,
}: {
  item: ItemTileData
  size?: number
  /** Its details are showing: the white selected frame and glow (`d2-tile-selected`). */
  selected?: boolean
  /** Click, Enter or Space picks it (the app opens its details there). */
  onSelect?: () => void
  style?: CSSProperties
}) {
  const f = size / TILE_WIDTH
  const frame = Math.max(1, Math.round(f))
  const label = tileLabel(item)
  return (
    <div
      role="button"
      tabIndex={0}
      className="cfx-item-tile"
      title={label}
      aria-label={label.split('\n').join(', ')}
      aria-pressed={onSelect ? selected : undefined}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key !== 'Enter' && e.key !== ' ') return
        e.preventDefault()
        onSelect?.()
      }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        alignSelf: 'start',
        width: size,
        padding: frame,
        backgroundColor: item.masterworked ? ITEM_FRAME_MASTERWORK : ITEM_FRAME,
        ...(selected ? { boxShadow: TILE_SELECTED } : null),
        ...style,
      }}
    >
      <ItemArt
        src={item.icon}
        watermark={item.watermark}
        tier={item.tier}
        masterworked={item.masterworked}
        craft={item.craft}
        scale={f}
        style={{ width: size - 2 * frame, height: size - 2 * frame }}
      />
      <TileFooter scale={f} roomy={size >= ROOMY_FOOTER}>
        {/* The champion it stuns, beside the element; Bungie's glyph is white, so blacken it. */}
        {item.breaker && size >= CHAMPION_FOOTER && (
          <img
            src={BREAKERS[item.breaker].icon}
            alt=""
            draggable={false}
            style={{ width: 12 * f, height: 12 * f, flexShrink: 0, pointerEvents: 'none', filter: 'brightness(0)' }}
          />
        )}
{item.archetypeIcon && (
          <img
            src={item.archetypeIcon}
            alt=""
            draggable={false}
            style={{ width: 12 * f, height: 12 * f, flexShrink: 0, pointerEvents: 'none', filter: 'brightness(0)' }}
          />
        )}
        {item.damageIcon && (
                  <img
            src={item.damageIcon}
            alt=""
            draggable={false}
            style={{
              width: 12 * f,
              height: 12 * f,
              flexShrink: 0,
              pointerEvents: 'none',
              ...(item.kinetic ? { opacity: 0.5, filter: 'brightness(0)' } : null),
            }}
          />
        )}
        {item.power}
      </TileFooter>
    </div>
  )
}

/** d2-tile-selected: the white 1px frame and its soft glow. */
const TILE_SELECTED = '0 0 0 1px rgb(255 255 255 / 0.85), 0 0 8px 1px rgb(255 255 255 / 0.25)'

/**
 * The six tiles in a 3-column grid on the app's 8px gap (scaled with `size`): Vex
 * Mythoclast, Mint Retrograde (tier 5), Kindled Orchid (tier 3), IKELOS_SMG (crafted),
 * Edge Transit (tier 4), Deliverance (crafted). With `onSelect`, clicking a tile (or
 * Enter / Space on it) passes its id up, and the `selected` one wears the white frame.
 */
export function ItemTileSet({
  size = TILE_WIDTH,
  columns = 3,
  selected,
  onSelect,
  style,
}: {
  size?: number
  /** Tiles to a row (3 by default; 6 lays the set in one row). */
  columns?: number
  /** The id (`ITEM_TILE_SET`) of the tile whose details are showing. */
  selected?: string
  onSelect?: (id: string) => void
  style?: CSSProperties
}) {
  const gap = TILE_GAP * (size / TILE_WIDTH)
  return (
    <div
      role="group"
      aria-label="Inventory tiles"
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, ${size}px)`,
        gap,
        width: 'max-content',
        ...style,
      }}
    >
      {ITEM_TILE_SET.map((item) => (
        <ItemTile
          key={item.id}
          item={item}
          size={size}
          selected={item.id === selected}
          onSelect={onSelect ? () => onSelect(item.id) : undefined}
        />
      ))}
    </div>
  )
}

/**
 * An empty inventory cell, after the app's `EmptyTile`: the game's bracket corners
 * (`d2-brackets`, 6px arms, 1px) over a faint fill, a square the tile's width (the
 * app's runs a label bar's height longer; the square reads finished), scaled with `size`. Since Nov 5 2026 it reads like the loadout drawer's empty slot
 * without being it: the brackets at the app's usual 40% (the Items page's 20% all but
 * vanished at the collage's scale) and a small thin plus centred in it (26% of the width read big).
 */
export function EmptyTile({ size = TILE_WIDTH, style }: { size?: number; style?: CSSProperties }) {
  const f = size / TILE_WIDTH
  const len = `${6 * f}px`
  const line = 'color-mix(in srgb, #fcfcf5 40%, transparent)'
  const plus = Math.round(size * 0.18)
  const stroke = Math.max(1, 1.5 * f)
  const arm = (pos: string, w: string, h: string) => `linear-gradient(${line}, ${line}) ${pos} / ${w} ${h} no-repeat`
  return (
    <span
      aria-hidden
      style={{
        display: 'block',
        flexShrink: 0,
        alignSelf: 'start',
        width: size,
        height: size,
        background: [
          arm('top left', len, '1px'),
          arm('top left', '1px', len),
          arm('top right', len, '1px'),
          arm('top right', '1px', len),
          arm('bottom left', len, '1px'),
          arm('bottom left', '1px', len),
          arm('bottom right', len, '1px'),
          arm('bottom right', '1px', len),
        ].join(', '),
        backgroundColor: 'color-mix(in srgb, #fcfcf5 4%, transparent)',
        position: 'relative',
        ...style,
      }}
    >
      {/* The plus, centred. */}
      <svg
        width={plus}
        height={plus}
        viewBox="0 0 24 24"
        style={{ position: 'absolute', left: (size - plus) / 2, top: (size - plus) / 2 }}
      >
        <path
          d="M12 0v24M0 12h24"
          stroke="rgb(252 252 245 / 0.75)"
          strokeWidth={(stroke * 24) / plus}
          fill="none"
        />
      </svg>
    </span>
  )
}
