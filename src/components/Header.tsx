import { ArrowLeft } from '@phosphor-icons/react'
import TabBar, { type Tab } from './TabBar'
import ContactMenu from './ContactMenu'
import { VARIANTS } from '../design-system/buttonStyles'
import { control, radius, space, type } from '../design-system/tokens'
import { useIsMobile } from '../hooks/useIsMobile'
import AppLink from '../AppLink'

type Props = {
  active?: Tab
  /**
   * `tabs` is the Me / Design chrome. `back` swaps them for a Back pill — used
   * on project pages so the tab bar doesn't sit above a second Back.
   */
  leading?: 'tabs' | 'back'
  /** Horizontal inset for the tab bar row. Pass '0' when the parent already pads the page. */
  barInset?: string
  /** Horizontal inset for the profile row. Pass '0' when the parent already pads the page. */
  contentInset?: string
  /**
   * Right-side inset for the pinned Contact menu and the rows' right padding.
   * Defaults to `barInset` — right for full-width pages, where the shared
   * gutter is symmetric. The tabs pass the fixed page gutter instead, because
   * their header sits inside a column narrower than the viewport and the
   * growing left inset would drag Contact toward the column's centre.
   */
  trailingInset?: string
  /** Pass `false` on pages whose design is just the tab bar. */
  showProfile?: boolean
}

export default function Header({
  active = 'me',
  leading = 'tabs',
  barInset = '120px',
  contentInset = '120px',
  trailingInset,
  showProfile = true,
}: Props) {
  const isMobile = useIsMobile()
  const bar = isMobile ? '20px' : barInset
  const content = isMobile ? '20px' : contentInset
  const trailing = isMobile ? '20px' : (trailingInset ?? barInset)

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {/* Leading control left-aligned with page content, Contact pinned right */}
      <div
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
          padding: isMobile ? `12px ${trailing} 12px ${bar}` : `16px ${trailing} 16px ${bar}`,
        }}
      >
        {leading === 'back' ? <BackLink /> : <TabBar active={active} />}
        <div style={{ position: 'absolute', right: trailing, top: isMobile ? '10px' : '16px' }}>
          <ContactMenu />
        </div>
      </div>

      {/* Profile row */}
      {showProfile && (
        <div
          style={{
            padding: isMobile
              ? `20px ${content}`
              : `32px ${trailing} 32px ${content}`,
          }}
        >
          <ProfileRow />
        </div>
      )}
    </div>
  )
}

/**
 * Ghost pill matching the Design tab's controls. Kept as an `<a>` — `Button`
 * renders a <button>, and nesting one inside a link is invalid.
 */
function BackLink() {
  return (
    <AppLink
      href="/work"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: space.sm,
        height: control.sm,
        boxSizing: 'border-box',
        padding: `0 ${space.lg}`,
        borderRadius: radius.full,
        border: `1px solid ${VARIANTS.ghost.default.borderColor}`,
        background: VARIANTS.ghost.default.background,
        color: VARIANTS.ghost.default.color,
        fontSize: type['label-m'].fontSize,
        fontWeight: type['label-m'].fontWeight,
        lineHeight: type['label-m'].lineHeight,
        textDecoration: 'none',
        whiteSpace: 'nowrap',
      }}
    >
      <ArrowLeft size={16} />
      Back
    </AppLink>
  )
}

/** Four dots in a diamond, sitting between the two profile images. */
function DiamondDots() {
  const dotStyle: React.CSSProperties = {
    position: 'absolute',
    width: '4px',
    height: '4px',
    backgroundColor: 'rgba(236,237,230,0.16)',
  }
  return (
    <div style={{ position: 'relative', width: '12px', height: '12px', transform: 'rotate(45deg)' }}>
      <div style={{ ...dotStyle, top: '4px', left: '0' }} />
      <div style={{ ...dotStyle, top: '0', left: '4px' }} />
      <div style={{ ...dotStyle, top: '4px', left: '8px' }} />
      <div style={{ ...dotStyle, top: '8px', left: '4px' }} />
    </div>
  )
}

export function ProfileRow() {
  const isMobile = useIsMobile()
  const profileSize = isMobile ? 56 : 80

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '12px' : '16px' }}>
      <img
        src="/profile.jpg"
        alt="Noah"
        style={{
          width: `${profileSize}px`,
          height: `${profileSize}px`,
          borderRadius: isMobile ? 'var(--radius-lg)' : '20px',
          objectFit: 'cover',
        }}
      />
      {!isMobile && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: `${profileSize}px`,
          }}
        >
          <DiamondDots />
        </div>
      )}
      <img
        src="/pixel-flower.png"
        alt=""
        style={{ width: `${profileSize}px`, height: `${profileSize}px`, objectFit: 'contain' }}
      />
    </div>
  )
}
