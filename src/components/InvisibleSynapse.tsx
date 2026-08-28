import { useState, type CSSProperties, type ReactNode } from 'react'
import Header from './Header'
import WorkGate from './WorkGate'
import { color, radius, space, type } from '../design-system/tokens'
import { useIsMobile } from '../hooks/useIsMobile'
import { copyPad, PROJECT_MOBILE_PAD, shellPad } from '../layout'
import { isUnlocked } from '../workGate'

/*
  The page runs no3y Code's stacked rhythm, the same as the onboarding study:
  a centred 700px copy column with the media below it rather than the
  copy-left / media-right 1225 grid the frame draws. See `InvisibleOnboarding`.
*/
/** The content column at the 1512 frame, which every media width is a share of. */
const CONTENT_WIDTH = 1272
/** The centred copy column — the title block and every row's heading + body. */
const COPY_WIDTH = 700
/** Copy to media inside one row. */
const STACK_GAP = 80
/** The space above a row — see `InvisibleOnboarding`'s `LEAD`. */
const LEAD = { title: 120, section: 200, tight: 120 } as const
const LEAD_MOBILE = { title: 64, section: 120, tight: 64 } as const

/**
 * Outer clip on the mockups — `ProjectStory`'s `MOCKUP_RADIUS`, so the screenshot,
 * the diagram and the library panel all land on the same corner as every other
 * project page. The boxes drawn *inside* the diagram keep their own smaller radii.
 */
const MOCKUP_RADIUS = radius.xl

/** Holds the drawn px until the column reaches the frame's width, then takes its share. */
const mediaWidth = (px: number) => `min(100%, max(${px}px, ${(px / CONTENT_WIDTH) * 100}%))`

/*
  Both screenshots come out of section `319:30670` whole rather than as loose
  captures the page composes. The blueprint is two task windows on a Monterey
  gradient (the wallpaper is a Figma gradient, so there is nothing to rebuild in
  CSS) and the library is its own dark panel — the frame's 32px pad, 36px column
  gap and 24px row gap are all inside the export, which is why `LibraryPanel` is
  gone. Both are wide landscape compositions, so unlike the diagram they fill the
  content column; at 1272 that is 2.09× and 2.01× of their exports.

  The library export bakes Figma's `#1e1e1e` canvas outside a ~9.5px corner. It
  is left in rather than cut to transparent because `MOCKUP_RADIUS` clips further
  in than that, so the wedge never renders — re-check that if the radius drops.
*/
const media = {
  blueprint: '/work/invisible/synapse/blueprint.jpg',
  library: '/work/invisible/synapse/library.png',
} as const

/** Each export's own ratio, so neither is stretched. */
const MEDIA_ASPECT = {
  blueprint: '1328 / 586',
  library: '2554 / 1682',
} as const

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
  lineHeight: type['body-l'].lineHeight,
  letterSpacing: 'normal',
  color: color.text.secondary,
}

export default function InvisibleSynapse() {
  const isMobile = useIsMobile()
  const [unlocked, setUnlocked] = useState(isUnlocked)
  const pad = isMobile ? PROJECT_MOBILE_PAD : shellPad()

  if (!unlocked) return <WorkGate onUnlock={() => setUnlocked(true)} />

  return (
    <div
      style={{
        minHeight: '100vh',
        background: color.bg.primary,
        color: color.text.primary,
      }}
    >
      <Header
        leading="back"
        showProfile={false}
        barInset={isMobile ? pad : copyPad(COPY_WIDTH)}
        trailingInset={pad}
      />

      <main
        style={{
          boxSizing: 'border-box',
          /*
            Symmetric gutter with the column centred inside it — `shellPad()` is
            itself viewport-centred, so this still resolves the same left edge as
            every other page (see `layout.ts`).
          */
          padding: isMobile ? `24px ${pad} 64px` : `32px ${pad} 80px`,
        }}
      >
        {/* One track, no gap — the hero and every row carry their own lead. */}
        <div
          style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Hero isMobile={isMobile} />

          <StoryRow
            lead="title"
            heading="The problem"
            width={DIAGRAM.width}
            body={
              <Paragraphs>
                <p style={{ ...bodyStyle, color: color.text.primary }}>
                  Our legacy platform was not designed for AI training tasks, so it was too rigid to
                  support the range of client use cases we needed.
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

          {/*
            The frame runs "the process" and "the blueprint" as one row, with the
            second heading buried mid-copy beside a single screenshot. Stacked,
            that heading has nowhere to sit, so the two become their own beats —
            the process copy stands alone and the blueprint takes the shot, on a
            tight lead so the pair still reads as one section.
          */}
          <StoryRow
            heading="The process"
            body={
              <Paragraphs gap={space.lg}>
                <p style={bodyStyle}>
                  I met with the team that built the foundation of our “next-gen” annotation platform
                  to ask questions, offer suggestions, and understand what they needed from design.
                </p>
                <p style={bodyStyle}>
                  I also interviewed subject-matter experts, users, and operations managers to learn
                  what an AI training interface needed to support.
                </p>
              </Paragraphs>
            }
          />

          <StoryRow
            lead="tight"
            heading="The blueprint"
            body={
              <p style={bodyStyle}>
                I started with an RLHF interface to establish the product’s foundation. One clear UX
                improvement was adding in-context instructions to guide users through each task. The
                right panel housed those instructions, while tooltips pointed to the elements that
                required input.
              </p>
            }
          >
            <img
              src={media.blueprint}
              alt="Two RLHF task windows side by side — a Step 1 tooltip on the prompt composer, a Step 2 tooltip on annotating a pair of model responses"
              style={{
                display: 'block',
                width: '100%',
                aspectRatio: MEDIA_ASPECT.blueprint,
                borderRadius: MOCKUP_RADIUS,
              }}
            />
          </StoryRow>

          <StoryRow
            heading="Make it reusable"
            body={
              <p style={bodyStyle}>
                I created reusable Figma components so designing interfaces for new use cases and
                clients was faster and more consistent.
              </p>
            }
          >
            <img
              src={media.library}
              alt="The Figma component library — header, tooling group and panel components beside the prompt, response and review-response sets, over a board of task composites"
              style={{
                display: 'block',
                width: '100%',
                aspectRatio: MEDIA_ASPECT.library,
                borderRadius: MOCKUP_RADIUS,
              }}
            />
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
        width: '100%',
        maxWidth: `${COPY_WIDTH}px`,
        display: 'flex',
        flexDirection: 'column',
        gap: space.lg,
      }}
    >
      <h1
        style={{
          margin: 0,
          fontSize: isMobile ? '34px' : 'clamp(40px, 4vw, 56px)',
          fontWeight: 600,
          lineHeight: 'normal',
          letterSpacing: '-0.029em',
        }}
      >
        Launching New AI Training Interfaces
      </h1>

      <Paragraphs gap={space.lg}>
        <p style={{ ...bodyStyle, color: color.text.primary }}>
          I led design for the launch of Synapse, Invisible’s annotation platform. I created reusable
          components for AI training tasks and directed the experience through high-fidelity mockups
          tailored to specific client requirements.
        </p>
        <p style={{ ...bodyStyle, color: color.text.primary }}>
          The small team included me, three to four engineers, and a product manager. The project did
          not follow a traditional product roadmap or launch process: the foundation was built before
          I joined to define and direct the UX.
        </p>
      </Paragraphs>
    </section>
  )
}

/**
 * One stacked row: heading + copy on the centred 700 column, media below it at
 * `width`. `children` is optional — "The process" is copy on its own. `lead` is
 * the space above the row, as on the onboarding study.
 */
function StoryRow({
  heading,
  body,
  children,
  width,
  lead = 'section',
}: {
  heading: string
  body: ReactNode
  children?: ReactNode
  width?: number
  lead?: keyof typeof LEAD
}) {
  const isMobile = useIsMobile()

  return (
    <section
      style={{
        width: '100%',
        marginTop: `${(isMobile ? LEAD_MOBILE : LEAD)[lead]}px`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: isMobile ? space['2xl'] : `${STACK_GAP}px`,
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: `${COPY_WIDTH}px`,
          minWidth: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: space.xl,
        }}
      >
        <SectionHeading>{heading}</SectionHeading>
        {body}
      </div>
      {children && <div style={{ width: width ? mediaWidth(width) : '100%' }}>{children}</div>}
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
        letterSpacing: '-0.067em',
        color: color.text.primary,
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
        borderRadius: MOCKUP_RADIUS,
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
