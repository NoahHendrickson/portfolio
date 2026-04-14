export default function About() {
  return (
    <section
      id="about"
      style={{
        background: "#171717",
        margin: '0 auto',
        padding: '120px 280px',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        color: 'var(--color-text-primary)',
      }}
    >
      <h2
        style={{
          margin: 0,
          fontSize: 'clamp(28px, 3.5vw, 40px)',
          fontWeight: 500,
          lineHeight: 1,
        }}
      >
        Me in general
      </h2>
      <p
        style={{
          margin: 0,
          fontSize: 'clamp(18px, 2.2vw, 30px)',
          fontWeight: 500,
          lineHeight: 1.4,
        }}
      >
        WIP  {/* I am a high performing IC Product designer who can lead, execute and
        deliver projects on time and of high quality. I love digging in to solve
        challenging problems, complex flows and sometimes spending way to much
        time on tiny interactions. While my favorite thing to do is be heads
        down designing I have experience delegating and managing multiple
        people on a project. */}
      </p>
      <p
        style={{
          margin: 0,
          fontSize: 'clamp(18px, 2.2vw, 30px)',
          fontWeight: 500,
          lineHeight: 1.3,
        }}
      >
        {/* I&rsquo;m an attitude enhancer, even in the deepest darkest shit storms
        I am able to stay calm and find the right balance of humor and tenacity. */}
      </p>
    </section>
  )
}
