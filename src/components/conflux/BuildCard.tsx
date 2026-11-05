import { Fragment, useState, type CSSProperties, type ReactNode } from 'react'
import { CARD_BG, CARD_LINE, FG, FG_MUTED, FONT, SHADOW_RAISED, icon } from './confluxTheme'
import {
  BALANCED_TUNING,
  BUILD,
  BUILD_CARD_WIDTH,
  EXOTIC,
  MASTERWORK_TOTAL,
  MATERIALS,
  PIECE_MASTERWORK,
  PIECES,
  PIP_BOXES,
  PIP_GOLD,
  STATS,
  TITLES,
} from './optimizerData'
import OptimizerTooltip from './OptimizerTooltip'
import './optimizer.css'

/**
 * One D2 Conflux optimizer result, rebuilt from the live app's DOM (`BuildRow` in
 * `build-results.tsx`, `BuildActions`, dark + slate, plain lines). The header — the
 * exotic at 56px, the total and six stats, the gold power and the unknown-masterwork
 * "?" — toggles the breakdown: the five pieces against the six stats, the Armor totals
 * / Mods / Tuning / Total rows, and what the masterworks would still cost. The footer
 * is always there: Dream build on the left, then icon actions whose labels slide open
 * on hover or focus, and the green SAVE AS LOADOUT. Every control shows the app's
 * hover, focus and pressed states; none of them act. Translucent; sits on `SLATE`.
 */

/** `--power-gold` and `--positive` (dark). */
const POWER_GOLD = '#ffcf11'
const POSITIVE = '#62b96a'
const mix = (pct: number) => `color-mix(in srgb, ${FG} ${pct}%, transparent)`
/** The card's inner rules (`border-foreground/8`). */
const RULE = `1px solid ${mix(8)}`

/** `d2-label`: small uppercase column headers. */
const LABEL: CSSProperties = {
  fontSize: 11,
  lineHeight: '16px',
  fontWeight: 500,
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  color: FG_MUTED,
}
const TABULAR: CSSProperties = { fontVariantNumeric: 'tabular-nums' }
const TRUNCATE: CSSProperties = { overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }
const subgrid = (rowGap: number): CSSProperties => ({
  gridColumn: '1 / -1',
  display: 'grid',
  gridTemplateColumns: 'subgrid',
  alignItems: 'center',
  rowGap,
  padding: '16px 0',
})
/** `Button variant="outline"`, sized for an icon with a sliding label. */
const ACTION: CSSProperties = {
  display: 'inline-flex',
  flexShrink: 0,
  alignItems: 'center',
  justifyContent: 'center',
  gap: 0,
  height: 32,
  padding: '0 8px',
  margin: 0,
  boxSizing: 'border-box',
  borderRadius: 0,
  backgroundClip: 'padding-box',
  color: FG,
  fontFamily: 'inherit',
  fontSize: 14,
  lineHeight: '20px',
  fontWeight: 500,
  whiteSpace: 'nowrap',
  userSelect: 'none',
  cursor: 'pointer',
}
const ICON: CSSProperties = { display: 'block', width: 16, height: 16, flexShrink: 0, pointerEvents: 'none' }

export default function BuildCard({
  style,
  width,
  defaultOpen = true,
}: {
  /** Merged onto the card's root. */
  style?: CSSProperties
  /** The card's width; defaults to the app's (649), never wider than its container. */
  width?: CSSProperties['width']
  /** Start expanded (the default) or collapsed to the header and footer. */
  defaultOpen?: boolean
}) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div
      className="cfx-opt-root cfx-opt-build cfx-opt-ring"
      style={
        {
          '--cfx-opt-fg': FG,
          '--cfx-opt-muted': FG_MUTED,
          position: 'relative',
          boxSizing: 'border-box',
          width: width ?? BUILD_CARD_WIDTH,
          maxWidth: '100%',
          border: `1px solid ${CARD_LINE}`,
          background: CARD_BG,
          // The popularity card's raised shadow, so the cards sit alike on the Slate (Nov 5 2026).
          boxShadow: SHADOW_RAISED,
          color: FG,
          fontFamily: FONT,
          fontSize: 16,
          fontWeight: 400,
          lineHeight: '24px',
          textAlign: 'start',
          containerType: 'inline-size',
          containerName: 'cfx-build',
          ...style,
        } as CSSProperties
      }
    >
      <div style={{ overflow: 'hidden' }}>
        <button
          type="button"
          className="cfx-opt-head"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
          style={{
            display: 'flex',
            width: '100%',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 16,
            margin: 0,
            padding: 8,
            border: 0,
            borderRadius: 0,
            color: 'inherit',
            font: 'inherit',
            textAlign: 'left',
            cursor: 'pointer',
          }}
        >
          <div style={{ display: 'flex', minWidth: 0, flex: '1 1 0%', alignItems: 'center', gap: 16 }}>
            <ArmorThumb size={56} icon={EXOTIC.icon} watermark={EXOTIC.watermark} alt={EXOTIC.name} />
            <div style={{ display: 'flex', minWidth: 0, flexDirection: 'column', justifyContent: 'center', gap: 8 }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', columnGap: 16, rowGap: 4 }}>
                <span style={{ fontSize: 16, lineHeight: '24px', fontWeight: 500, ...TABULAR }}>{BUILD.total}</span>
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    columnGap: 32,
                    rowGap: 4,
                    fontSize: 16,
                    lineHeight: '24px',
                    fontWeight: 500,
                    ...TABULAR,
                  }}
                >
                  {STATS.map((s, i) => (
                    <span key={s.key} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <img
                        src={icon(s.glyph)}
                        alt={s.label}
                        title={s.label}
                        width={16}
                        height={16}
                        decoding="async"
                        style={{ display: 'inline-block', width: 20, height: 20, flexShrink: 0 }}
                      />
                      {BUILD.stats[i]}
                    </span>
                  ))}
                </div>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', columnGap: 16, rowGap: 4 }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                  <PowerValue value={BUILD.power} title={TITLES.gearPower} />
                </span>
                <span aria-hidden style={{ width: 1, height: 15, flexShrink: 0, background: mix(16) }} />
                <span
                  title={`To fully masterwork: ${MATERIALS.map((m, i) => `${MASTERWORK_TOTAL[i].toLocaleString()} ${m.name}`).join(' · ')}`}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
                >
                  <MaterialCost counts={MASTERWORK_TOTAL} header />
                </span>
              </div>
            </div>
          </div>
          <span
            aria-hidden
            style={{
              display: 'flex',
              width: 32,
              height: 32,
              flexShrink: 0,
              alignItems: 'center',
              justifyContent: 'center',
              color: FG,
            }}
          >
            <ChevronIcon open={open} />
          </span>
        </button>

        {open && (
          <div className="cfx-opt-breakdown" style={{ borderTop: RULE }}>
            {/* Shared column tracks, so the totals line up under each piece's stats. */}
            <div className="cfx-opt-grid" style={{ display: 'grid', alignItems: 'center', borderBottom: RULE }}>
              <div style={subgrid(16)}>
                <div style={LABEL}>Armor</div>
                {STATS.map((s) => (
                  <div key={s.key} style={LABEL}>
                    <span className="cfx-opt-narrow-only">
                      <OptimizerTooltip label={s.label}>
                        {(tip) => (
                          <img
                            {...tip}
                            src={icon(s.glyph)}
                            alt={s.label}
                            tabIndex={0}
                            width={16}
                            height={16}
                            decoding="async"
                            style={{ display: 'inline-block', width: 16, height: 16, flexShrink: 0 }}
                          />
                        )}
                      </OptimizerTooltip>
                    </span>
                    <span className="cfx-opt-wide-only">{s.label}</span>
                  </div>
                ))}
                <div style={LABEL}>
                  <span className="cfx-opt-wide-only">Tuning</span>
                </div>

                {PIECES.map((piece, pi) => (
                  <Fragment key={pi}>
                    <div style={{ display: 'flex', minWidth: 0, alignItems: 'center', gap: 8 }}>
                      <ArmorThumb size={32} icon={piece.icon} watermark={piece.watermark} alt="" />
                      <div style={{ display: 'flex', minWidth: 0, flexDirection: 'column', justifyContent: 'center' }}>
                        <span style={{ ...TRUNCATE, fontSize: 14, lineHeight: '20px' }}>{piece.name}</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <PowerValue value={piece.power} title={TITLES.power} />
                        </div>
                      </div>
                    </div>
                    {piece.stats.map((v, i) => (
                      <div key={i} className="cfx-opt-stat-cell" style={{ fontSize: 14, lineHeight: '20px', ...TABULAR }}>
                        {v || ''}
                      </div>
                    ))}
                    <div style={{ display: 'flex', height: 32, alignItems: 'center' }}>
                      <OptimizerTooltip label={BALANCED_TUNING.label}>
                        {(tip) => (
                          <img
                            {...tip}
                            src={icon(BALANCED_TUNING.icon)}
                            alt={BALANCED_TUNING.label}
                            tabIndex={0}
                            width={16}
                            height={16}
                            decoding="async"
                            style={{ display: 'inline-block', width: 24, height: 24, flexShrink: 0 }}
                          />
                        )}
                      </OptimizerTooltip>
                    </div>
                  </Fragment>
                ))}
              </div>

              <div className="cfx-opt-rule" style={{ gridColumn: '1 / -1', borderTop: RULE }} />

              <div style={subgrid(24)}>
                <TotalsRow label="Armor totals" values={BUILD.armorTotals} />
                <TotalsRow label="Mods" secondary values={BUILD.mods.map((v) => <Delta value={v} />)} />
                <TotalsRow label="Tuning" secondary values={BUILD.tuning.map((v) => <Delta value={v} />)} />
                <TotalsRow label="Total" values={BUILD.stats} />
              </div>

              <div className="cfx-opt-rule" style={{ gridColumn: '1 / -1', borderTop: RULE }} />

              {/* What finishing the masterworks would cost; the stats already assume it. */}
              <div style={{ gridColumn: '1 / -1', padding: '16px 0' }}>
                <div style={{ ...LABEL, marginBottom: 8 }}>Masterwork</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 14, lineHeight: '20px' }}>
                  {PIECES.map((piece, pi) => {
                    const mw = PIECE_MASTERWORK[pi]
                    // A finished piece has nothing left to list, as in the app.
                    if (!mw) return null
                    return (
                      <div key={pi} style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', columnGap: 12, rowGap: 2 }}>
                        <span style={{ ...TRUNCATE, minWidth: 0 }}>{piece.name}</span>
                        <span style={{ color: FG_MUTED, fontVariantNumeric: 'tabular-nums' }}>
                          {mw.level}/{mw.max}
                        </span>
                        <MaterialCost counts={mw.cost} />
                      </div>
                    )
                  })}
                  <div
                    style={{
                      marginTop: 4,
                      display: 'flex',
                      flexWrap: 'wrap',
                      alignItems: 'center',
                      columnGap: 12,
                      rowGap: 2,
                      fontWeight: 500,
                    }}
                  >
                    <span>To finish</span>
                    <MaterialCost counts={MASTERWORK_TOTAL} />
                  </div>
                  <p style={{ margin: 0, fontSize: 12, lineHeight: '16px', color: FG_MUTED }}>
                    Stats above already assume every piece is fully masterworked.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Always shown; the breakdown above already ends on a rule. */}
        <div style={{ borderTop: open ? undefined : RULE }}>
          <div
            className="cfx-opt-footer"
            style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'flex-end', gap: 8, padding: 8 }}
          >
            <RevealAction
              style={{ marginRight: 'auto' }}
              touch="always"
              icon={<SparklesIcon />}
              label={
                <>
                  Dream<span className="cfx-opt-coarse-narrow-hide"> build</span>
                </>
              }
            />
            <RevealAction touch="never" pressed={false} icon={<HeartIcon />} label="Favorite these pieces" />
            <RevealAction icon={<ShirtIcon />} label="Equip items" />
            <RevealAction icon={<CopyIcon />} label="Copy item IDs" />
            <RevealAction icon={<LinkSquareIcon />} label="Open in DIM" />
            <button
              type="button"
              className="cfx-opt-equip cfx-opt-ring"
              style={{
                display: 'inline-flex',
                flexShrink: 0,
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                height: 32,
                padding: '0 12px',
                margin: 0,
                boxSizing: 'border-box',
                borderRadius: 0,
                color: FG,
                fontFamily: 'inherit',
                fontSize: 12,
                lineHeight: '16px',
                fontWeight: 500,
                letterSpacing: '0.02em',
                textTransform: 'uppercase',
                whiteSpace: 'nowrap',
                userSelect: 'none',
                cursor: 'pointer',
              }}
            >
              <span>
                Save<span className="cfx-opt-coarse-narrow-hide"> as loadout</span>
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

/** One totals row: a label and six values, and an empty Tuning cell. */
function TotalsRow({
  label,
  secondary = false,
  values,
}: {
  label: string
  secondary?: boolean
  values: readonly ReactNode[]
}) {
  const cell: CSSProperties = { fontSize: 14, lineHeight: '20px', fontWeight: 500 }
  return (
    <>
      <div style={{ ...cell, ...TRUNCATE, color: secondary ? FG_MUTED : undefined }}>{label}</div>
      {values.map((v, i) => (
        <div key={i} style={{ ...cell, ...TABULAR }}>
          {v}
        </div>
      ))}
      <div />
    </>
  )
}

/** A bonus: "+n" in the game's stat-gain green, 0 in the secondary grey. */
function Delta({ value }: { value: number }) {
  if (!value) return <span style={{ color: FG_MUTED }}>0</span>
  return <span style={{ color: POSITIVE }}>+{value}</span>
}

/**
 * An item's art the app's way (`ArmorThumb`): the icon, a strip fading down from 75%
 * black on its left, the season glyph lifted off Bungie's watermark as a luminance
 * mask over white, and gear tier 5's gold pips down the strip.
 */
function ArmorThumb({ size, icon: art, watermark, alt }: { size: number; icon: string; watermark: string; alt: string }) {
  return (
    <span
      style={{
        position: 'relative',
        display: 'inline-block',
        width: size,
        height: size,
        flexShrink: 0,
        overflow: 'hidden',
        borderRadius: 0,
      }}
    >
      <img
        src={icon(art)}
        alt={alt}
        width={size}
        height={size}
        loading="lazy"
        decoding="async"
        style={{ display: 'block', width: '100%', height: '100%', maxWidth: 'none' }}
      />
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
          translate: '-1.5625% -1.5625%',
          maskImage: `url(${icon(watermark)})`,
          maskMode: 'luminance',
          maskSize: '100% 100%',
        }}
      />
      <span aria-hidden style={{ pointerEvents: 'none', position: 'absolute', inset: 0 }}>
        {PIP_BOXES.map((box, i) => (
          <span
            key={i}
            style={{
              position: 'absolute',
              aspectRatio: '1',
              rotate: '45deg',
              borderRadius: '12%',
              backgroundImage: PIP_GOLD,
              ...box,
            }}
          />
        ))}
      </span>
    </span>
  )
}

/** Destiny's gold light level: the hollow diamond beside a tabular number. */
function PowerValue({ value, title }: { value: number; title: string }) {
  return (
    <span
      title={title}
      style={{
        display: 'inline-flex',
        flexShrink: 0,
        alignItems: 'center',
        gap: 2,
        color: POWER_GOLD,
        fontSize: 12,
        lineHeight: '16px',
        fontWeight: 500,
        whiteSpace: 'nowrap',
        ...TABULAR,
      }}
    >
      <svg
        width="6"
        height="6"
        viewBox="0 0 6 6"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
        style={{ display: 'inline-block', width: '0.55em', height: '0.55em', flexShrink: 0, translate: '0 -0.05em' }}
      >
        <path
          d="M4.27246 1.72754L6 3L4.27246 4.27246L3 6L1.72754 4.27246L0 3L1.72754 1.72754L3 0L4.27246 1.72754ZM2.54199 2.54199L1.91992 3L2.54199 3.45801L3 4.08008L3.45801 3.45801L4.08008 3L3.45801 2.54199L3 1.91992L2.54199 2.54199Z"
          fill="currentColor"
          fillRule="evenodd"
        />
      </svg>
      {value}
    </span>
  )
}

/**
 * An icon action whose label slides open on hover or keyboard focus (the app's
 * `RevealAction` + `RevealLabel`). On touch, `always` stays open, `wide` opens once the
 * card is 46rem wide, `never` stays shut.
 */
function RevealAction({
  icon: glyph,
  label,
  touch = 'wide',
  pressed,
  style,
}: {
  icon: ReactNode
  label: ReactNode
  touch?: 'always' | 'wide' | 'never'
  pressed?: boolean
  style?: CSSProperties
}) {
  return (
    <span className="cfx-opt-reveal" style={{ display: 'inline-flex', ...style }}>
      <button type="button" className="cfx-opt-btn cfx-opt-ring" aria-pressed={pressed} style={ACTION}>
        {glyph}
        <span className="cfx-opt-reveal-label" data-touch={touch}>
          <span style={{ overflow: 'hidden' }}>
            <span style={{ display: 'block', paddingLeft: 6, paddingRight: 4 }}>{label}</span>
          </span>
        </span>
      </button>
    </span>
  )
}

/* ── The app's inline SVGs (Hugeicons free set), as it renders them ────────── */

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      color="currentColor"
      className="cfx-opt-chevron"
      style={{ ...ICON, transform: open ? 'rotate(180deg)' : undefined }}
    >
      <path
        d="M18 9.00005C18 9.00005 13.5811 15 12 15C10.4188 15 6 9 6 9"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  )
}

function SparklesIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" color="currentColor" aria-hidden style={ICON}>
      <path
        d="M15 2L15.5387 4.39157C15.9957 6.42015 17.5798 8.00431 19.6084 8.46127L22 9L19.6084 9.53873C17.5798 9.99569 15.9957 11.5798 15.5387 13.6084L15 16L14.4613 13.6084C14.0043 11.5798 12.4202 9.99569 10.3916 9.53873L8 9L10.3916 8.46127C12.4201 8.00431 14.0043 6.42015 14.4613 4.39158L15 2Z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
      <path
        d="M7 12L7.38481 13.7083C7.71121 15.1572 8.84275 16.2888 10.2917 16.6152L12 17L10.2917 17.3848C8.84275 17.7112 7.71121 18.8427 7.38481 20.2917L7 22L6.61519 20.2917C6.28879 18.8427 5.15725 17.7112 3.70827 17.3848L2 17L3.70827 16.6152C5.15725 16.2888 6.28879 15.1573 6.61519 13.7083L7 12Z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  )
}

function HeartIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      color="currentColor"
      strokeWidth="2"
      stroke="currentColor"
      aria-hidden
      style={ICON}
    >
      <path
        d="M10.4107 19.9677C7.58942 17.858 2 13.0348 2 8.69444C2 5.82563 4.10526 3.5 7 3.5C8.5 3.5 10 4 12 6C14 4 15.5 3.5 17 3.5C19.8947 3.5 22 5.82563 22 8.69444C22 13.0348 16.4106 17.858 13.5893 19.9677C12.6399 20.6776 11.3601 20.6776 10.4107 19.9677Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  )
}

function ShirtIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" color="currentColor" aria-hidden style={ICON}>
      <path
        d="M6 9V16.6841C6 18.4952 6 19.4008 6.58579 19.9635C7.89989 21.2257 15.8558 21.4604 17.4142 19.9635C18 19.4008 18 18.4952 18 16.6841V9"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.5"
      />
      <path
        d="M5.74073 12L3.04321 9.38915C2.34774 8.71602 2 8.37946 2 7.96123C2 7.543 2.34774 7.20644 3.04321 6.53331L5.04418 4.59664C5.39088 4.26107 5.56423 4.09329 5.77088 3.96968C5.97753 3.84607 6.21011 3.77103 6.67526 3.62096L8.32112 3.08997C8.56177 3.01233 8.68209 2.97351 8.76391 3.02018C8.84573 3.06686 8.87157 3.2013 8.92324 3.47018C9.19358 4.87684 10.4683 5.94185 12 5.94185C13.5317 5.94185 14.8064 4.87684 15.0768 3.47018C15.1284 3.2013 15.1543 3.06686 15.2361 3.02018C15.3179 2.97351 15.4382 3.01233 15.6789 3.08997L17.3247 3.62096C17.7899 3.77103 18.0225 3.84607 18.2291 3.96968C18.4358 4.09329 18.6091 4.26107 18.9558 4.59664L20.9568 6.53331C21.6523 7.20644 22 7.543 22 7.96123C22 8.37946 21.6523 8.71602 20.9568 9.38915L18.2593 12"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  )
}

function CopyIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" color="currentColor" aria-hidden style={ICON}>
      <path
        d="M7.5 14.5C7.5 11.2002 7.5 9.55025 8.52513 8.52513C9.55025 7.5 11.2002 7.5 14.5 7.5C17.7998 7.5 19.4497 7.5 20.4749 8.52513C21.5 9.55025 21.5 11.2002 21.5 14.5C21.5 17.7998 21.5 19.4497 20.4749 20.4749C19.4497 21.5 17.7998 21.5 14.5 21.5C11.2002 21.5 9.55025 21.5 8.52513 20.4749C7.5 19.4497 7.5 17.7998 7.5 14.5Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
      <path
        d="M7.5 16.5C6.10355 16.5 5.40533 16.5 4.84402 16.3036C3.83866 15.9518 3.0482 15.1613 2.69641 14.156C2.5 13.5947 2.5 12.8964 2.5 11.5V9.5C2.5 6.20017 2.5 4.55025 3.52513 3.52513C4.55025 2.5 6.20017 2.5 9.5 2.5H11.5C12.8964 2.5 13.5947 2.5 14.156 2.69641C15.1613 3.0482 15.9518 3.83866 16.3036 4.84402C16.5 5.40533 16.5 6.10355 16.5 7.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  )
}

function LinkSquareIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" color="currentColor" aria-hidden style={ICON}>
      <path
        d="M11.0991 3.00012C7.45013 3.00669 5.53932 3.09629 4.31817 4.31764C3.00034 5.63568 3.00034 7.75704 3.00034 11.9997C3.00034 16.2424 3.00034 18.3638 4.31817 19.6818C5.63599 20.9999 7.75701 20.9999 11.9991 20.9999C16.241 20.9999 18.3621 20.9999 19.6799 19.6818C20.901 18.4605 20.9906 16.5493 20.9972 12.8998"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
      <path
        d="M20.556 3.49612L11.0487 13.0586M20.556 3.49612C20.062 3.00151 16.7343 3.04761 16.0308 3.05762M20.556 3.49612C21.05 3.99074 21.0039 7.32273 20.9939 8.02714"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  )
}

/**
 * A row of material icons with counts, as the app's `MaterialCost` draws it — "◇ 35,000
 * ● 30 ◆ 13 ▲ 3", 16px icons rounded 2px on a 10px gap. `header` is the collapsed card's
 * treatment (Figma 86:862): rarest first, 12px medium counts, thousands as "140k", and
 * a 0.5px rarity frame on the shard, prism and core.
 */
function MaterialCost({ counts, header = false }: { counts: readonly number[]; header?: boolean }) {
  const order = MATERIALS.map((m, i) => ({ ...m, count: counts[i] }))
  const shown = header ? [...order].reverse() : order
  const format = (n: number) => {
    if (!header || n < 1000) return n.toLocaleString()
    const k = n / 1000
    return `${k >= 10 ? Math.round(k) : Math.round(k * 10) / 10}k`
  }
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: header ? 12 : 10,
        fontVariantNumeric: 'tabular-nums',
        ...(header && { fontSize: 12, lineHeight: '16px', fontWeight: 500 }),
      }}
    >
      {shown.map((m) => (
        <span
          key={m.name}
          title={`${m.count.toLocaleString()} ${m.name}`}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 4, whiteSpace: 'nowrap' }}
        >
          <img
            src={icon(m.icon)}
            alt={m.name}
            width={16}
            height={16}
            decoding="async"
            style={{
              display: 'inline-block',
              width: 16,
              height: 16,
              flexShrink: 0,
              boxSizing: 'border-box',
              ...(header
                ? 'frame' in m && m.frame
                  ? { border: `0.5px solid ${m.frame}` }
                  : null
                : { borderRadius: 2 }),
            }}
          />
          {format(m.count)}
        </span>
      ))}
    </span>
  )
}
