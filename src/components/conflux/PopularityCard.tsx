import { useState, type CSSProperties, type ReactNode } from 'react'
import { CARD_BG, FG, FG_MUTED, FONT, SHADOW_RAISED, icon } from './confluxTheme'
import {
  POPULARITY_COLUMNS,
  POPULARITY_COMBOS,
  POPULARITY_HOW,
  POPULARITY_SAMPLE,
  POPULARITY_TOP_ROLL,
  isPicked,
  percent,
  pickRoll,
  type Roll,
} from './weaponsData'
import { WeaponTip } from './WeaponTip'
import './weapons.css'

/**
 * D2 Conflux's Popularity card (`weapon-popularity-card.tsx`) for Fatebringer
 * (Timelost), rebuilt from a DOM dump of the running app: the heading with its
 * info tip, the five most run perk combos, then every perk column with its share
 * and a bar graded green to red within the column. Picking works as the app's
 * does — a tile picks its perk (a combo both of its perks), picking a picked one
 * un-picks it, and "Try most popular roll" picks the top roll — though here a
 * pick only lights the tiles; there's no perk grid or stats to update.
 */

/** The card's hairline and the section rules (foreground 12%). */
const LINE = 'rgb(252 252 245 / 0.12)'

export default function PopularityCard({ style }: { style?: CSSProperties }) {
  const [picked, setPicked] = useState<Roll>({})
  const pick = (roll: Roll) => setPicked((current) => pickRoll(current, roll))
  const columns = POPULARITY_COLUMNS
  return (
    <div
      style={{
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        width: 384,
        maxWidth: '100%',
        padding: '12px 0',
        overflow: 'hidden',
        background: CARD_BG,
        border: `1px solid ${LINE}`,
        boxShadow: SHADOW_RAISED,
        color: FG,
        fontFamily: FONT,
        fontSize: 14,
        fontWeight: 400,
        lineHeight: '20px',
        textAlign: 'start',
        WebkitFontSmoothing: 'antialiased',
        MozOsxFontSmoothing: 'grayscale',
        ...style,
      }}
    >
      <Section title="Popularity" first action={<HowPopularityWorks />} />
      <Section title="Perk combos">
        {/* As many to a row as fit, stretched across the card. */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(5.5rem, 1fr))', gap: 8 }}>
          {POPULARITY_COMBOS.map((combo) => {
            const left = columns[combo.leftColumn].perks[combo.left]
            const right = columns[combo.rightColumn].perks[combo.right]
            const roll = { [combo.leftColumn]: combo.left, [combo.rightColumn]: combo.right }
            return (
              <ShareCell
                key={`${combo.left},${combo.right}`}
                label={`${left.name} + ${right.name}`}
                share={combo.share}
                selected={isPicked(picked, roll)}
                onClick={() => pick(roll)}
              >
                <span style={{ display: 'flex', gap: 4 }}>
                  <PerkIcon src={left.icon} />
                  <PerkIcon src={right.icon} />
                </span>
              </ShareCell>
            )
          })}
        </div>
      </Section>
      <Section
        title="Individual perks"
        action={
          <button
            type="button"
            className="cfx-wpn-btn cfx-wpn-ring cfx-wpn-glow"
            onClick={() => pick(POPULARITY_TOP_ROLL)}
            style={{
              display: 'inline-block',
              height: 28,
              padding: '0 10px',
              background: 'rgb(252 252 245 / 0.1)',
              fontSize: 12,
              fontWeight: 400,
              lineHeight: '16px',
              whiteSpace: 'nowrap',
            }}
          >
            Try most popular roll
          </button>
        }
      >
        {/* The columns share the card's width, scrolling only if they can't fit. */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${columns.length}, minmax(3.25rem, 1fr))`,
            gap: 6,
            paddingBottom: 4,
            overflowX: 'auto',
          }}
        >
          {columns.map(({ label, perks }, column) => {
            const high = Math.max(...perks.map((p) => p.share))
            const low = Math.min(...perks.map((p) => p.share))
            return (
              <section
                key={label}
                aria-label={label}
                style={{ display: 'flex', flexDirection: 'column', gap: 6, minWidth: 0 }}
              >
                {perks.map((perk, index) => (
                  <ShareCell
                    key={perk.name}
                    label={`${label}: ${perk.name}`}
                    share={perk.share}
                    bar={perk.grade}
                    glow={high > low}
                    selected={isPicked(picked, { [column]: index })}
                    onClick={() => pick({ [column]: index })}
                  >
                    <PerkIcon src={perk.icon} />
                  </ShareCell>
                ))}
              </section>
            )
          })}
        </div>
      </Section>
    </div>
  )
}

/**
 * One titled part of the card. Every section after the first opens on a rule
 * edge to edge; a section with a body ends its header in another, under the title.
 */
function Section({
  title,
  first = false,
  action,
  children,
}: {
  title: string
  first?: boolean
  action?: ReactNode
  children?: ReactNode
}) {
  const body = children != null
  return (
    <section
      aria-label={title}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        borderTop: first ? undefined : `1px solid ${LINE}`,
        paddingTop: first ? 0 : 8,
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: action ? 'minmax(0, 1fr) auto' : 'minmax(0, 1fr)',
          alignItems: 'start',
          gap: 6,
          padding: `0 12px ${body ? 8 : 0}px`,
          boxShadow: body ? `inset 0 -1px 0 ${LINE}` : undefined,
        }}
      >
        <div style={{ alignSelf: 'center', fontSize: 14, fontWeight: 500, lineHeight: 1.375 }}>{title}</div>
        {action && <div style={{ justifySelf: 'end', alignSelf: 'center' }}>{action}</div>}
      </div>
      {body && <div style={{ padding: '0 12px' }}>{children}</div>}
    </section>
  )
}

/** The info icon at the right of the heading: how the numbers are worked out. */
function HowPopularityWorks() {
  return (
    <WeaponTip
      side="bottom"
      align="end"
      maxWidth={288}
      lineHeight="16px"
      label={
        <div style={{ display: 'grid', gap: 6 }}>
          {POPULARITY_HOW.map((line) => (
            <p key={line} style={{ margin: 0 }}>
              {line}
            </p>
          ))}
          <p style={{ margin: 0, color: FG_MUTED }}>{POPULARITY_SAMPLE}</p>
        </div>
      }
      type="button"
      aria-label="How popularity is worked out"
      className="cfx-wpn-btn cfx-wpn-quiet cfx-wpn-glow"
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 28, height: 28, padding: 0 }}
    >
      <InfoIcon />
    </WeaponTip>
  )
}

function PerkIcon({ src }: { src: string }) {
  return (
    <img
      src={icon(src)}
      alt=""
      width={32}
      height={32}
      loading="lazy"
      decoding="async"
      style={{ display: 'block', width: 32, height: 32 }}
    />
  )
}

/**
 * One perk or combo: its icon(s), the share under them, and for a perk a bar as
 * wide as the share in its grade's colour, glowing faintly from the bottom. The
 * name is in the tooltip.
 */
function ShareCell({
  label,
  share,
  bar,
  glow = false,
  selected,
  onClick,
  children,
}: {
  label: string
  share: number
  /** The share bar's colour; no bar without one. */
  bar?: string
  /** Glow in `bar`'s colour; off for a column whose perks all share one value. */
  glow?: boolean
  selected: boolean
  onClick: () => void
  children: ReactNode
}) {
  return (
    <WeaponTip
      label={label}
      type="button"
      aria-pressed={selected}
      aria-label={`${label}, ${percent(share)}`}
      onClick={onClick}
      className="cfx-wpn-btn cfx-wpn-cell cfx-wpn-ring cfx-wpn-glow"
      data-glow={bar && glow ? '' : undefined}
      style={
        {
          '--cfx-grade': bar,
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 4,
          width: '100%',
          minWidth: 52,
          padding: '6px 6px 4px',
        } as CSSProperties
      }
    >
      {children}
      <span style={{ display: 'block', fontSize: 11, lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>
        {percent(share)}
      </span>
      {bar && (
        <span aria-hidden style={{ display: 'block', width: '100%', height: 4, background: 'rgb(252 252 245 / 0.15)' }}>
          <span style={{ display: 'block', height: '100%', width: `${Math.max(share * 100, 2)}%`, background: bar }} />
        </span>
      )}
    </WeaponTip>
  )
}

/** Hugeicons' InformationCircleIcon at stroke 2, as the app renders it. */
function InfoIcon() {
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
      aria-hidden="true"
      style={{ display: 'block', width: 16, height: 16 }}
    >
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
      <path d="M12 16V12" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
      <path
        d="M12.125 8.25H12M12.25 8.25C12.25 8.11193 12.1381 8 12 8C11.8619 8 11.75 8.11193 11.75 8.25C11.75 8.38807 11.8619 8.5 12 8.5C12.1381 8.5 12.25 8.38807 12.25 8.25Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  )
}
