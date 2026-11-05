import { useEffect, useId, useRef, useState, type CSSProperties, type KeyboardEvent, type ReactNode } from 'react'
import { CARD_BG, CARD_LINE, FG, FG_MUTED, FONT, SHADOW_RAISED, icon } from './confluxTheme'
import {
  AMMO_COLOR,
  CATALOG_UPDATED,
  SORTS,
  WEAPON_TOTAL,
  nameplate,
  searchWeapons,
  sortLabel,
  type Sort,
  type WeaponRow,
} from './weaponsData'
import { WeaponTip } from './WeaponTip'
import './weapons.css'

/**
 * D2 Conflux's weapon search (`weapon-browser.tsx`, `weapon-search-box.tsx`),
 * trimmed to the search bar and the top seven results, rebuilt from a DOM dump
 * of the running app. Each row is a nameplate tinted by its element — the icon
 * with its season watermark, the name, the type's silhouette and the element,
 * frame, ammo and champion glyphs, each named in a tooltip — and opens its
 * weapon on click (here it only takes the open weapon's frame and brighter
 * plate). Typing filters the seven by name and the count follows; the sort menu
 * reorders them.
 *
 * The bar runs 24px past the list on both sides (16 on a phone), as it does in
 * the app, where it is a full-bleed band; the root is that band's width, 560.
 */

const VISUALLY_HIDDEN: CSSProperties = {
  position: 'absolute',
  width: 1,
  height: 1,
  margin: -1,
  padding: 0,
  overflow: 'hidden',
  clip: 'rect(0, 0, 0, 0)',
  whiteSpace: 'nowrap',
  border: 0,
}

export default function WeaponList({ style }: { style?: CSSProperties }) {
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState<Sort>('season-desc')
  // A weapon always stays open: the last one picked, else the top result.
  const [picked, setPicked] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const results = searchWeapons(query, sort)
  const current = picked ?? results[0]?.name
  const count = query.trim() ? results.length : WEAPON_TOTAL
  return (
    <div
      style={{
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        width: 560,
        maxWidth: '100%',
        // A card like the others (Nov 5 2026): the app's panel has no frame of its own,
        // and on the Slate the bar and rows read as loose pieces. The cards' fill, 1px
        // line and raised shadow, with the rows' foot padded off its edge.
        paddingBottom: 16,
        overflow: 'hidden',
        background: CARD_BG,
        border: `1px solid ${CARD_LINE}`,
        boxShadow: SHADOW_RAISED,
        color: FG,
        fontFamily: FONT,
        fontSize: 16,
        fontWeight: 400,
        lineHeight: '24px',
        textAlign: 'start',
        WebkitFontSmoothing: 'antialiased',
        MozOsxFontSmoothing: 'grayscale',
        ...style,
      }}
    >
      <div
        className="cfx-wpn-bar"
        style={{
          boxSizing: 'border-box',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: 6,
          minHeight: 48,
          cursor: 'text',
          background: 'rgb(252 252 245 / 0.08)',
          // The card's own line closes the bar's top.
          borderTop: 'none',
        }}
        onMouseDown={(event) => {
          if (event.target === event.currentTarget) {
            event.preventDefault()
            inputRef.current?.focus()
          }
        }}
      >
        <SearchIcon />
        <input
          ref={inputRef}
          type="text"
          aria-label="Search weapons"
          autoComplete="off"
          spellCheck={false}
          placeholder="Search"
          className="cfx-wpn-input"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Escape' && query) {
              event.preventDefault()
              setQuery('')
            }
          }}
          style={{
            flex: '1 1 0%',
            minWidth: 128,
            height: 28,
            margin: 0,
            padding: 0,
            border: 0,
            outline: 'none',
            background: 'transparent',
            color: 'inherit',
            fontFamily: 'inherit',
            fontWeight: 400,
          }}
        />
        {query && (
          <button
            type="button"
            aria-label="Clear search"
            className="cfx-wpn-btn cfx-wpn-quiet cfx-wpn-outline"
            onClick={() => {
              setQuery('')
              inputRef.current?.focus()
            }}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 28, height: 28, padding: 0 }}
          >
            <ClearIcon />
          </button>
        )}
        <span
          role="status"
          title={`${count.toLocaleString('en-US')} weapons\nCatalog updated ${CATALOG_UPDATED}`}
          style={{ marginLeft: 'auto', flexShrink: 0, fontSize: 14, lineHeight: '20px', fontVariantNumeric: 'tabular-nums' }}
        >
          {count.toLocaleString('en-US')}
          <span style={VISUALLY_HIDDEN}> weapons</span>
        </span>
        <SortMenu sort={sort} onSort={setSort} />
      </div>

      <div className="cfx-wpn-rows">
        {results.length === 0 ? (
          <div style={{ padding: '48px 0', textAlign: 'center' }}>
            <p style={{ margin: 0 }}>No weapons match this search.</p>
            <p style={{ margin: '8px 0 0', fontSize: 14, lineHeight: '20px', color: FG_MUTED }}>
              Try removing a filter or searching for a different perk.
            </p>
          </div>
        ) : (
          <ul
            aria-label="Weapons"
            style={{ display: 'flex', flexDirection: 'column', gap: 4, margin: 0, padding: 0, listStyle: 'none' }}
          >
            {results.map((weapon) => (
              <li key={weapon.name} style={{ height: 40 }}>
                <Row weapon={weapon} current={weapon.name === current} onOpen={() => setPicked(weapon.name)} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

/**
 * A nameplate, like the game's roster: the icon square at the left edge, then
 * the name, the type's silhouette, and element, frame, ammo and champion icons
 * on a wash of the element's colour.
 */
function Row({ weapon, current, onOpen }: { weapon: WeaponRow; current: boolean; onOpen: () => void }) {
  const ammoMask = `url("${icon(weapon.ammoIcon)}") center / contain no-repeat`
  const typeMask = `url("${icon(weapon.typeIcon)}") center / contain no-repeat`
  return (
    <button
      type="button"
      className="cfx-wpn-btn cfx-wpn-row"
      aria-current={current || undefined}
      aria-label={`View ${weapon.name} perks`}
      onClick={onOpen}
      style={{
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        width: '100%',
        height: '100%',
        padding: '0 12px 0 0',
        overflow: 'hidden',
        textAlign: 'left',
        textShadow: '0 1px 2px rgb(0 0 0 / 0.5)',
        background: nameplate(weapon.element, current),
      }}
    >
      <span style={{ position: 'relative', display: 'block', flexShrink: 0, width: 38, height: 38, background: 'rgb(252 252 245 / 0.05)' }}>
        <img src={icon(weapon.icon)} alt="" width={38} height={38} loading="lazy" decoding="async" style={{ display: 'block' }} />
        {/* The season watermark: our own fading strip down the left, and Bungie's
            glyph as a luminance mask over white, so only the glyph shows. */}
        <span
          aria-hidden
          style={{
            pointerEvents: 'none',
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            width: '26.042%',
            backgroundImage: 'linear-gradient(to bottom, rgb(0 0 0 / 0.75), transparent 95%)',
          }}
        />
        <span
          aria-hidden
          style={{
            pointerEvents: 'none',
            position: 'absolute',
            inset: 0,
            background: '#fff',
            transform: 'translate(-1.5625%, -1.5625%)',
            maskImage: `url("${icon(weapon.watermark)}")`,
            WebkitMaskImage: `url("${icon(weapon.watermark)}")`,
            maskMode: 'luminance',
            maskSize: '100% 100%',
            WebkitMaskSize: '100% 100%',
          }}
        />
      </span>
      {/* A set width (shrinking alike on every row) so the icons after it line up. */}
      <p
        style={{
          flex: '0 1 240px',
          minWidth: 0,
          margin: 0,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          fontSize: 15,
          lineHeight: 1.5,
        }}
      >
        {weapon.name}
      </p>
      <IconTip label={weapon.type}>
        <span
          role="img"
          aria-label={weapon.type}
          style={{ display: 'block', flexShrink: 0, width: 44, height: 12, background: FG, mask: typeMask, WebkitMask: typeMask }}
        />
      </IconTip>
      <span style={{ display: 'flex', flexShrink: 0, alignItems: 'center', gap: 16 }}>
        <IconTip label={weapon.element}>
          <img src={icon(weapon.elementIcon)} alt={weapon.element} width={18} height={18} loading="lazy" decoding="async" style={{ display: 'block', flexShrink: 0 }} />
        </IconTip>
        {/* Kept as a slot of its own, so the columns hold. */}
        <span style={{ display: 'flex', flexShrink: 0, width: 20, height: 20 }}>
          <IconTip label={weapon.frame}>
            <img src={icon(weapon.frameIcon)} alt={weapon.frame} width={20} height={20} loading="lazy" decoding="async" style={{ display: 'block' }} />
          </IconTip>
        </span>
        <IconTip label={`${weapon.ammo} ammo`}>
          <span
            role="img"
            aria-label={weapon.ammo}
            style={{
              display: 'inline-block',
              flexShrink: 0,
              width: 30,
              height: 30,
              margin: '-6px 0',
              background: AMMO_COLOR[weapon.ammo],
              mask: ammoMask,
              WebkitMask: ammoMask,
            }}
          />
        </IconTip>
        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {weapon.champions.map((champion) => (
            <IconTip key={champion.name} label={`Anti-${champion.name}`}>
              <img
                src={icon(champion.icon)}
                alt={`Anti-${champion.name}`}
                width={18}
                height={18}
                loading="lazy"
                decoding="async"
                style={{ display: 'block', flexShrink: 0 }}
              />
            </IconTip>
          ))}
        </span>
      </span>
    </button>
  )
}

/** A row icon's name in a tooltip, quick to open; the trigger is a span inside the row's button. */
function IconTip({ label, children }: { label: string; children: ReactNode }) {
  return (
    <WeaponTip label={label} delay={100} as="span" style={{ display: 'flex', flexShrink: 0, alignItems: 'center' }}>
      {children}
    </WeaponTip>
  )
}

/**
 * The sort button at the end of the bar and its menu (the app's Base UI
 * dropdown): "Sort by" over the three orders, the current one checked, lit
 * under the pointer or the arrow keys, closing on a pick, Escape, Tab or a
 * press outside.
 */
function SortMenu({ sort, onSort }: { sort: Sort; onSort: (sort: Sort) => void }) {
  const [open, setOpen] = useState(false)
  const [lit, setLit] = useState<number | null>(null)
  const wrapRef = useRef<HTMLSpanElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const id = useId()
  const label = sortLabel(sort)

  useEffect(() => {
    if (!open) return
    menuRef.current?.focus()
    const onDown = (event: PointerEvent) => {
      if (!wrapRef.current?.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener('pointerdown', onDown, true)
    return () => document.removeEventListener('pointerdown', onDown, true)
  }, [open])

  const openWith = (highlight: number | null) => {
    setLit(highlight)
    setOpen(true)
  }
  const close = (refocus: boolean) => {
    setOpen(false)
    if (refocus) triggerRef.current?.focus()
  }
  const choose = (index: number) => {
    onSort(SORTS[index][0])
    close(true)
  }
  const checked = SORTS.findIndex(([value]) => value === sort)

  const onMenuKey = (event: KeyboardEvent) => {
    const last = SORTS.length - 1
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault()
        setLit((i) => (i == null || i >= last ? 0 : i + 1))
        break
      case 'ArrowUp':
        event.preventDefault()
        setLit((i) => (i == null || i <= 0 ? last : i - 1))
        break
      case 'Home':
        event.preventDefault()
        setLit(0)
        break
      case 'End':
        event.preventDefault()
        setLit(last)
        break
      case 'Enter':
      case ' ':
        event.preventDefault()
        if (lit != null) choose(lit)
        break
      case 'Escape':
        event.preventDefault()
        close(true)
        break
      case 'Tab':
        close(false)
        break
    }
  }

  return (
    <span ref={wrapRef} style={{ position: 'relative', display: 'flex', flexShrink: 0 }}>
      <button
        ref={triggerRef}
        id={`${id}-trigger`}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? `${id}-menu` : undefined}
        aria-label={`Sort weapons: ${label}`}
        title={`Sort: ${label}`}
        className="cfx-wpn-btn cfx-wpn-quiet cfx-wpn-outline"
        onClick={() => (open ? close(false) : openWith(null))}
        onKeyDown={(event) => {
          if (!open && (event.key === 'ArrowDown' || event.key === 'ArrowUp')) {
            event.preventDefault()
            openWith(checked)
          }
        }}
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 28, height: 28, padding: 0 }}
      >
        <SortIcon />
      </button>
      {open && (
        <div
          ref={menuRef}
          id={`${id}-menu`}
          role="menu"
          tabIndex={-1}
          aria-labelledby={`${id}-trigger`}
          aria-activedescendant={lit != null ? `${id}-item-${lit}` : undefined}
          className="cfx-wpn-menu-in"
          onKeyDown={onMenuKey}
          onMouseLeave={() => setLit(null)}
          style={{
            position: 'absolute',
            top: 'calc(100% + 4px)',
            right: 0,
            zIndex: 50,
            boxSizing: 'border-box',
            width: 176,
            padding: 4,
            background: 'rgb(82 88 100 / 0.4)',
            backdropFilter: 'blur(36px) saturate(1.1)',
            WebkitBackdropFilter: 'blur(36px) saturate(1.1)',
            border: '1px solid rgb(252 252 245 / 0.15)',
            boxShadow: '0 2px 16px rgb(0 0 0 / 0.25)',
            transformOrigin: '100% -4px',
            outline: 'none',
            color: FG,
            cursor: 'default',
            textShadow: 'none',
          }}
        >
          <div role="group" aria-labelledby={`${id}-label`}>
            <div
              id={`${id}-label`}
              aria-hidden
              style={{ padding: '4px 6px', fontSize: 12, fontWeight: 500, lineHeight: '16px', color: FG_MUTED }}
            >
              Sort by
            </div>
          </div>
          <div role="group">
            {SORTS.map(([value, name], index) => (
              <div
                key={value}
                id={`${id}-item-${index}`}
                role="menuitemradio"
                aria-checked={value === sort}
                tabIndex={-1}
                className="cfx-wpn-item"
                data-highlighted={lit === index ? '' : undefined}
                onMouseMove={() => lit !== index && setLit(index)}
                onClick={() => choose(index)}
                style={{
                  position: 'relative',
                  boxSizing: 'border-box',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  height: 32,
                  padding: '0 32px 0 6px',
                  fontSize: 14,
                  lineHeight: '20px',
                  userSelect: 'none',
                }}
              >
                {value === sort && (
                  <span
                    aria-hidden
                    style={{ position: 'absolute', right: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}
                  >
                    <CheckIcon />
                  </span>
                )}
                {name}
              </div>
            ))}
          </div>
        </div>
      )}
    </span>
  )
}

/* Hugeicons' glyphs as the app renders them (stroke 1.5). */

function SearchIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      color="currentColor"
      aria-hidden="true"
      style={{ display: 'block', flexShrink: 0, width: 16, height: 16, pointerEvents: 'none' }}
    >
      <path d="M17 17L21 21" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
      <path
        d="M19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19C15.4183 19 19 15.4183 19 11Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  )
}

function ClearIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      color="currentColor"
      aria-hidden="true"
      style={{ display: 'block', width: 16, height: 16 }}
    >
      <path d="M18 6L6.00081 17.9992M17.9992 18L6 6.00085" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
    </svg>
  )
}

function SortIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      color="currentColor"
      aria-hidden="true"
      style={{ display: 'block', width: 16, height: 16 }}
    >
      <path d="M7 4V20" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
      <path d="M17 19L17 4" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
      <path
        d="M10 6.99998C10 6.99998 7.79053 4.00001 6.99998 4C6.20942 3.99999 4 7 4 7"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
      <path d="M20 17C20 17 17.7905 20 17 20C16.2094 20 14 17 14 17" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      color="currentColor"
      aria-hidden="true"
      style={{ display: 'block', width: 16, height: 16, color: FG }}
    >
      <path d="M5 14L8.5 17.5L19 6.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
    </svg>
  )
}
