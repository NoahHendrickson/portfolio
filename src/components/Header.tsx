import TabBar, { type Tab } from './TabBar'
import ContactMenu from './ContactMenu'
import { useIsMobile } from '../hooks/useIsMobile'

type Props = {
  active: Tab
  /** Horizontal inset for the tab bar row. Pass '0' when the parent already pads the page. */
  barInset?: string
  /** Horizontal inset for the profile row. Pass '0' when the parent already pads the page. */
  contentInset?: string
  /**
   * Horizontal offset for the tab bar, cancelling out a change in the column width
   * so the tabs stay put while the column animates. See `TAB_SHIFT` in App.tsx.
   */
  tabShift?: string
  /** Pass `false` on pages whose design is just the tab bar. */
  showProfile?: boolean
}

export default function Header({
  active,
  barInset = '24px',
  contentInset = '80px',
  tabShift,
  showProfile = true,
}: Props) {
  const isMobile = useIsMobile()
  const bar = isMobile ? '20px' : barInset
  const content = isMobile ? '20px' : contentInset

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {/* Tab bar — tabs centered, Contact pinned right */}
      <div
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          // Tabs centre on desktop; on mobile they sit left so the Contact button has room.
          justifyContent: isMobile ? 'flex-start' : 'center',
          padding: isMobile ? `12px ${bar}` : `16px ${bar}`,
        }}
      >
        <div className="tab-shift" style={{ transform: tabShift ? `translateX(${tabShift})` : undefined }}>
          <TabBar active={active} />
        </div>
        <div style={{ position: 'absolute', right: bar, top: isMobile ? '10px' : '16px' }}>
          <ContactMenu />
        </div>
      </div>

      {/* Profile row */}
      {showProfile && (
        <div style={{ padding: isMobile ? `20px ${content}` : `32px ${content}` }}>
          <ProfileRow />
        </div>
      )}
    </div>
  )
}

function DiamondDots({ opacity = '0.35' }: { opacity?: string }) {
  const dotStyle: React.CSSProperties = {
    width: '4px',
    height: '4px',
    backgroundColor: `rgba(15,14,14,${opacity})`,
    position: 'absolute',
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
          borderRadius: isMobile ? '14px' : '20px',
          objectFit: 'cover',
        }}
      />
      {!isMobile && (
        <div
          className="flex flex-col items-center justify-between py-1"
          style={{ height: '80px' }}
        >
          <DiamondDots />
          <DiamondDots />
          <DiamondDots />
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
