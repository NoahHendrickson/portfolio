export default function Hero() {
  return (
    <p
      style={{
        maxWidth: '1200px',
        fontSize: 'clamp(14px, 3.3vw, 50px)',
        fontWeight: 600,
        color: 'var(--color-text-primary)',
        lineHeight: 1.5,
        margin: '0 auto',
        textWrap: 'balance',
        textShadow: '0 2px 8px rgba(0, 0, 0, 0.4)',
      }}
    >
      I&apos;m a Product Designer obsessed with crafting
      <br />
      beautiful UX &amp; UI. Figma+Claude+Storybook
      <br />
      is my favorite celebrity throuple.
    </p>
  )
}
