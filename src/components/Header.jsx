import { Button } from '@noey-17/yearn-ui'

function DiamondDots({ opacity = '0.22' }) {
  const dotStyle = {
    width: '5.33px',
    height: '5.33px',
    backgroundColor: `rgba(0,0,0,${opacity})`,
    position: 'absolute',
  }
  return (
    <div style={{ position: 'relative', width: '16px', height: '16px', transform: 'rotate(45deg)' }}>
      <div style={{ ...dotStyle, top: '5.33px', left: '0' }} />
      <div style={{ ...dotStyle, top: '0', left: '5.33px' }} />
      <div style={{ ...dotStyle, top: '5.33px', left: '10.67px' }} />
      <div style={{ ...dotStyle, top: '10.67px', left: '5.33px' }} />
    </div>
  )
}

function DropdownArrow() {
  return <img src="/icons/arrow-drop-down.svg" alt="" width={24} height={24} />
}

export default function Header() {
  return (
    <div className="flex items-center justify-between">
      {/* Profile photo + decorative dots */}
      <div className="flex items-center gap-2">
        <img
          src="/profile.jpg"
          alt="Noah"
          style={{
            width: '100px',
            height: '100px',
            borderRadius: '24px',
            objectFit: 'cover',
          }}
        />
        <div className="flex flex-col items-center justify-between py-1" style={{ height: '100px' }}>
          <DiamondDots />
          <DiamondDots />
          <DiamondDots />
          <DiamondDots />
        </div>
      </div>

      {/* Contact button */}
      <Button variant="primary" size="lg" trailingIcon={<DropdownArrow />}>
        Contact
      </Button>
    </div>
  )
}
