function DiamondDivider() {
  const dotStyle = {
    width: '5.33px',
    height: '5.33px',
    backgroundColor: 'rgba(0,0,0,0.16)',
    position: 'absolute',
  }
  return (
    <div style={{ position: 'relative', width: '16px', height: '16px', flexShrink: 0, transform: 'rotate(45deg)' }}>
      <div style={{ ...dotStyle, top: '5.33px', left: '0' }} />
      <div style={{ ...dotStyle, top: '0', left: '5.33px' }} />
      <div style={{ ...dotStyle, top: '5.33px', left: '10.67px' }} />
      <div style={{ ...dotStyle, top: '10.67px', left: '5.33px' }} />
    </div>
  )
}

export default function Hero() {
  return (
    <div className="flex flex-col gap-6">
      <p style={{ fontSize: '30px', fontWeight: 500, color: 'var(--color-text-primary)', lineHeight: 1.4, margin: 0 }}>
        I&apos;m a Product designer obsessed with crafting beautiful UX &amp; UI.
        Figma+Claude+Storybook is my favorite celebrity throuple. Designing in
        code to boost quality and speed.
      </p>

      <div className="flex items-center gap-6 flex-wrap">
        <p style={{ fontSize: '20px', fontWeight: 500, color: 'rgba(0,0,0,0.65)', margin: 0, whiteSpace: 'nowrap' }}>
          Currently @{' '}
          <a
            href="https://invisibletech.ai/"
            target="_blank"
            rel="noreferrer"
            style={{ color: 'rgba(0,0,0,0.65)', textDecoration: 'underline' }}
          >
            Invisible ↗
          </a>
        </p>
        <DiamondDivider />
        <p style={{ fontSize: '20px', fontWeight: 500, color: 'rgba(0,0,0,0.65)', margin: 0, whiteSpace: 'nowrap' }}>
          4yrs of experience
        </p>
        <DiamondDivider />
        <p style={{ fontSize: '20px', fontWeight: 500, color: 'rgba(0,0,0,0.65)', margin: 0, whiteSpace: 'nowrap' }}>
          Zero sugar soda addict
        </p>
      </div>
    </div>
  )
}
