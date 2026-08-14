import { useState, type CSSProperties, type ReactNode } from 'react'
import Header from './Header'
import WorkGate from './WorkGate'
import { color, radius, space, type } from '../design-system/tokens'
import { useIsMobile } from '../hooks/useIsMobile'
import { shellPad } from '../layout'
import { isUnlocked } from '../workGate'

const CONTENT_WIDTH = 1225
const ROW_GAP = 80

/**
 * Each row in the frame splits the 1225 column differently, so the widths ride
 * along with the row rather than living on the page. They're rendered as `fr`
 * shares, so copy and media scale together below the design width.
 */
const SPLITS = {
  problem: { copy: 412, media: 733 },
  process: { copy: 413, media: 732 },
  library: { copy: 388, media: 757 },
} as const

const media = {
  blueprint: '/work/invisible/synapse/blueprint.png',
  library: [
    '/work/invisible/synapse/library-1.png',
    '/work/invisible/synapse/library-2.png',
    '/work/invisible/synapse/library-3.png',
  ],
} as const

/** Aspect of each library shot, kept from the source capture. */
const LIBRARY_ASPECTS = ['2044 / 1528', '2098 / 1568', '3396 / 876'] as const

/** The wash behind the library shots is the frame's own panel, not a theme surface. */
const LIBRARY_PANEL = 'rgba(255, 255, 255, 0.24)'

/** The legacy-platform diagram is drawn in the frame, so its palette is literal too. */
const DIAGRAM = {
  bg: '#e6e1cd',
  card: '#2c2b2b',
  bar: '#ffb5b5',
  barActive: '#ff5b5b',
  width: 733,
  height: 430,
} as const

const bodyStyle: CSSProperties = {
  margin: 0,
  fontSize: type['body-l'].fontSize,
  fontWeight: type['body-l'].fontWeight,
  lineHeight: '21px',
  letterSpacing: 'normal',
  color: color.text.secondary,
}

export default function InvisibleSynapse() {
  const isMobile = useIsMobile()
  const [unlocked, setUnlocked] = useState(isUnlocked)

  if (!unlocked) return <WorkGate onUnlock={() => setUnlocked(true)} />

  return (
    <div
      style={{
        minHeight: '100vh',
        background: color.bg.primary,
        color: color.text.primary,
      }}
    >
      <Header leading="back" showProfile={false} barInset={shellPad()} />

      <main
        style={{
          boxSizing: 'border-box',
          // Shared left edge with every other page (see `layout.ts`).
          padding: isMobile ? '24px 20px 64px' : `32px 0 80px ${shellPad()}`,
        }}
      >
        <div
          style={{
            width: isMobile ? '100%' : `min(${CONTENT_WIDTH}px, calc(100vw - 240px))`,
            display: 'flex',
            flexDirection: 'column',
            gap: isMobile ? space['4xl'] : '120px',
          }}
        >
          <Hero isMobile={isMobile} />

          <StoryRow
            heading="the problem"
            split={SPLITS.problem}
            body={
              <Paragraphs>
                <p style={{ ...bodyStyle, color: color.text.primary }}>
                  Our legacy platform for AI training tasks was not created with that type of work
                  in mind. Therefore it was far too strict and inflexible to support the different
                  use cases we needed for our clients.
                </p>
                {/* The frame runs the lead-in and its list as one text block, no gap between. */}
                <div style={{ ...bodyStyle, color: color.text.primary }}>
                  <p style={{ margin: 0 }}>This created multiple issues:</p>
                  {/* Tailwind's preflight strips list markers, so the frame's
                      numbering is set back on explicitly. */}
                  <ol style={{ margin: 0, paddingInlineStart: '24px', listStyleType: 'decimal' }}>
                    <li>We couldn’t quickly show clients we were capable of the work.</li>
                    <li>Building interfaces was extremely complicated.</li>
                    <li>Spinning up an interface and its data schema took weeks.</li>
                    <li>The UX for our experts was very poor.</li>
                  </ol>
                </div>
              </Paragraphs>
            }
          >
            <LegacyDiagram />
          </StoryRow>

          <StoryRow
            heading="the process"
            split={SPLITS.process}
            body={
              <>
                <Paragraphs gap={space.lg}>
                  <p style={bodyStyle}>
                    I met with the team who built the foundation of our “next-gen” annotations
                    platform to ask questions, make suggestions and understand what they thought
                    they needed from a Designer.
                  </p>
                  <p style={bodyStyle}>
                    I interviewed some SMEs, users and operations managers to understand the
                    problems and the needs for an AI training interface.
                  </p>
                </Paragraphs>
                <SectionHeading>the blueprint</SectionHeading>
                <p style={bodyStyle}>
                  I started with an RLHF interface to lay the foundation for our new product. One
                  clear UX improvement we needed to add was instructions in the interface that guide
                  you through the task. The right panel now housed instructions and gave users a
                  tooltip that points to the element where input is needed.
                </p>
              </>
            }
          >
            <img
              src={media.blueprint}
              alt="RLHF task interface with a step-by-step instructions panel and tooltips pointing at the prompt composer"
              style={{
                display: 'block',
                width: '100%',
                aspectRatio: `${SPLITS.process.media} / 772`,
              }}
            />
          </StoryRow>

          <StoryRow
            heading="make it re-usable"
            split={SPLITS.library}
            body={
              <p style={bodyStyle}>
                I created reusable Figma components so designing interfaces for new use cases and
                clients was faster and more consistent.
              </p>
            }
          >
            <LibraryPanel />
          </StoryRow>
        </div>
      </main>
    </div>
  )
}

function Hero({ isMobile }: { isMobile: boolean }) {
  return (
    <section
      style={{
        width: isMobile ? '100%' : '720px',
        display: 'flex',
        flexDirection: 'column',
        gap: space.lg,
      }}
    >
      <h1
        style={{
          margin: 0,
          fontSize: isMobile ? '36px' : '56px',
          fontWeight: 600,
          lineHeight: 'normal',
          letterSpacing: '-1.6px',
        }}
      >
        Launching New AI Training Interfaces
      </h1>

      <Paragraphs gap={space.lg}>
        <p style={{ ...bodyStyle, color: color.text.primary }}>
          I led the design for the launch of Invisible’s annotations platform, Synapse. I was
          responsible for creating reusable custom components built for AI training tasks. I
          design-directed through high-fidelity mockups and custom interface designs tailored to
          specific client requirements.
        </p>
        <p style={{ ...bodyStyle, color: color.text.primary }}>
          This was a small team of myself, 3-4 engineers and a PM. This project did not follow a
          traditional product roadmap or launch. The foundation was built before I was brought in to
          support and direct the UX of the product.
        </p>
      </Paragraphs>
    </section>
  )
}

function StoryRow({
  heading,
  body,
  children,
  split,
}: {
  heading: string
  body: ReactNode
  children: ReactNode
  split: { copy: number; media: number }
}) {
  const isMobile = useIsMobile()

  return (
    <section
      style={
        isMobile
          ? {
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              gap: space['2xl'],
            }
          : {
              width: '100%',
              display: 'grid',
              gridTemplateColumns: `${split.copy}fr ${split.media}fr`,
              columnGap: `${(ROW_GAP / CONTENT_WIDTH) * 100}%`,
              alignItems: 'start',
            }
      }
    >
      <div
        style={{
          minWidth: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: space.xl,
        }}
      >
        <SectionHeading>{heading}</SectionHeading>
        {body}
      </div>
      {children}
    </section>
  )
}

function SectionHeading({ children }: { children: ReactNode }) {
  return (
    <h2
      style={{
        margin: 0,
        fontSize: '24px',
        fontWeight: 600,
        lineHeight: 'normal',
        letterSpacing: '-1.6px',
        color: color.text.muted,
      }}
    >
      {children}
    </h2>
  )
}

function Paragraphs({ children, gap = space.xl }: { children: ReactNode; gap?: string }) {
  return <div style={{ display: 'flex', flexDirection: 'column', gap }}>{children}</div>
}

/**
 * The "legacy platform" illustration is drawn in the frame rather than captured,
 * so it's rebuilt as proportional boxes — same trick as the onboarding charts.
 */
function LegacyDiagram() {
  const pctX = (px: number) => `${(px / DIAGRAM.width) * 100}%`
  const pctY = (px: number) => `${(px / DIAGRAM.height) * 100}%`

  return (
    <div
      role="img"
      aria-label="A rigid legacy task layout: one fixed panel above two locked panes"
      style={{
        position: 'relative',
        width: '100%',
        aspectRatio: `${DIAGRAM.width} / ${DIAGRAM.height}`,
        overflow: 'hidden',
        borderRadius: radius.xl,
        background: DIAGRAM.bg,
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: pctX(154),
          top: pctY(72.942),
          width: pctX(426),
          height: pctY(306.3),
          borderRadius: radius['2xl'],
          background: DIAGRAM.card,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: pctX(178),
          top: pctY(96.942),
          width: pctX(378),
          height: pctY(95.031),
          borderRadius: radius.lg,
          background: DIAGRAM.bar,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: pctX(178),
          top: pctY(215.973),
          width: pctX(216.369),
          height: pctY(139.269),
          borderRadius: radius.lg,
          background: DIAGRAM.barActive,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: pctX(418.369),
          top: pctY(215.973),
          width: pctX(137.631),
          height: pctY(139.269),
          borderRadius: radius.lg,
          background: '#ffffff',
        }}
      />
    </div>
  )
}

/**
 * The component library sits on a tinted panel. Its padding and the gaps between
 * shots are percentages of the panel width, so the inset holds its proportion
 * instead of crushing the shots when the column narrows.
 */
function LibraryPanel() {
  const inset = (px: number) => `${(px / SPLITS.library.media) * 100}%`

  return (
    <div
      style={{
        boxSizing: 'border-box',
        width: '100%',
        padding: `${inset(24)} ${inset(80)}`,
        borderRadius: radius.lg,
        background: LIBRARY_PANEL,
        overflow: 'hidden',
      }}
    >
      {media.library.map((src, index) => (
        <img
          key={src}
          src={src}
          alt={
            index === 2
              ? 'Component library page of task panel variants'
              : 'Figma component library of annotation interface pieces'
          }
          style={{
            display: 'block',
            width: '100%',
            aspectRatio: LIBRARY_ASPECTS[index],
            // Flex `gap` in percent resolves against an indefinite block size, so
            // the rhythm is a top margin — that one resolves against the width.
            marginTop: index === 0 ? 0 : inset(24),
          }}
        />
      ))}
    </div>
  )
}
