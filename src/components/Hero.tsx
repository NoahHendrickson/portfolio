export default function Hero() {
  return (
    <h1
      style={{
        maxWidth: '1200px',
        fontSize: 'clamp(40px, 6vw, 80px)',
        fontWeight: 600,
        color: 'var(--color-bg-primary)',
        lineHeight: 1.05,
        letterSpacing: '-0.02em',
        margin: 0,
        textWrap: 'balance',
      }}
    >
      Product Designer{' '}
      <span style={{ fontWeight: 400 }}>x</span>
      <br />
      <span style={{ opacity: 0.7 }}>Design Engineer</span>
    </h1>
  )
}
