import { useState, type CSSProperties, type ReactNode } from 'react'
import Header from './Header'
import WorkGate from './WorkGate'
import { color, radius, space, spacePx, type } from '../design-system/tokens'
import { useIsMobile } from '../hooks/useIsMobile'
import { copyMeasure, copyPad, PROJECT_MOBILE_PAD, shellPad } from '../layout'
import { isUnlocked } from '../workGate'

/*
  The page runs no3y Code's stacked rhythm, the same as the other Invisible
  studies: a centred 700px copy column with the media below it rather than the
  copy-left / media-right 1225 grid the frame draws (`331:50280`).
*/
/** The content column at the 1512 frame, which every media width is a share of. */
const CONTENT_WIDTH = 1272
/** The centred copy column — the title block and every row's heading + body. */
const COPY_WIDTH = 700
/** Copy to media inside one row. */
const STACK_GAP = 80
/** The space above a row — see `InvisibleOnboarding`'s `LEAD`. */
const LEAD = { title: 120, section: 200, tight: 120, close: spacePx['3xl'] } as const
const LEAD_MOBILE = { title: 64, section: 120, tight: 64, close: spacePx['2xl'] } as const

/** Outer clip on the mockups — `ProjectStory`'s `MOCKUP_RADIUS`. */
const MOCKUP_RADIUS = radius.xl

/** Holds the drawn px until the column reaches the frame's width, then takes its share. */
const mediaWidth = (px: number) => `min(100%, max(${px}px, ${(px / CONTENT_WIDTH) * 100}%))`

/*
  The four product shots come out of the frame whole, each the browser chrome
  plus the Meridial window (`379:24380`, `379:24381`, `379:25622`, `379:26863`).
  They fill the content column at the export's own ratio.

  The invitations shot is node `338:7979` as drawn (948 × 839, shipped at 2×).
*/
const media = {
  invitations: '/work/invisible/apply/invitations.png',
  home: '/work/invisible/apply/home.png',
  explore: '/work/invisible/apply/explore.png',
  detail: '/work/invisible/apply/detail.png',
  apply: '/work/invisible/apply/apply.png',
} as const

const MEDIA_ASPECT = {
  invitations: '1896 / 1678',
  home: '2456 / 1707',
  explore: '2456 / 1707',
  detail: '2454 / 1708',
  apply: '2456 / 1707',
} as const

const INVITATIONS_WIDTH = 948

const bodyStyle: CSSProperties = {
  margin: 0,
  fontSize: type['body-l'].fontSize,
  fontWeight: type['body-l'].fontWeight,
  lineHeight: type['body-l'].lineHeight,
  letterSpacing: 0,
  color: color.text.secondary,
}

const listStyle: CSSProperties = {
  ...bodyStyle,
  display: 'flex',
  flexDirection: 'column',
  gap: space.sm,
  margin: 0,
  paddingLeft: space.xl,
  listStyleType: 'decimal',
}

export default function InvisibleApply() {
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
        trailingInset={isMobile ? pad : copyPad(COPY_WIDTH)}
      />

      <main
        style={{
          boxSizing: 'border-box',
          padding: isMobile ? `24px ${pad} 64px` : `32px ${pad} 80px`,
        }}
      >
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
            width={INVITATIONS_WIDTH}
            body={
              <p style={{ ...bodyStyle, color: color.text.primary }}>
                At Invisible, we use Greenhouse and external job boards to recruit people for AI
                training projects. This became a prominent bottleneck for our hiring team and a bad
                experience for our existing users because they could not find new or more work on
                the platform. The hiring team had to do a lot of manual work to ensure there
                weren't duplicate users applying through Greenhouse who already had accounts. We
                needed a simple and efficient way for our current users to find and apply to new
                projects so that we could meet the demand of our clients.
              </p>
            }
          >
            <MediaPanel
              src={media.invitations}
              alt="The old invitations tool — a table of project invites with status, dates and a search field"
              aspect={MEDIA_ASPECT.invitations}
              radius
            />
          </StoryRow>

          <StoryRow
            lead="tight"
            heading="Users"
            body={
              <Paragraphs>
                <p style={bodyStyle}>
                  This feature significantly affected three user groups.
                </p>
                <ol style={listStyle}>
                  <li>
                    Experts: People completing AI training tasks, including generalists and
                    specialists in fields such as medicine, finance, and software development.
                  </li>
                  <li>
                    Delivery managers: People who oversee projects on clients’ behalf and ensure
                    that teams deliver high-quality work on time.
                  </li>
                  <li>
                    Hiring: The team that supports delivery managers by sourcing talent for
                    projects.
                  </li>
                </ol>
              </Paragraphs>
            }
          />

          <StoryRow
            lead="close"
            heading="The jobs to be done"
            body={
              <ol style={listStyle}>
                <li>
                  Experts can explore and apply to AI training projects on Meridial.
                </li>
                <li>
                  Delivery managers can independently source talent by creating and posting
                  projects on Meridial.
                </li>
                <li>
                  The hiring team can focus on external talent and spend less time manually
                  reviewing and deduplicating applicants.
                </li>
              </ol>
            }
          />

          <StoryRow
            lead="close"
            heading="My focus"
            body={
              <p style={bodyStyle}>
                My primary focus for the UX and UI was the expert persona. This was a brand-new
                pattern and object on the platform, so I needed to be involved in the foundation
                and the conceptual model: what it means to apply to a project, and what a project
                is. I worked closely with engineering and product to define these new objects and
                put forth a simple, clear mental model so experts could find and apply to new
                projects easily.
              </p>
            }
          />

          <StoryRow
            lead="tight"
            body={
              <p style={bodyStyle}>
                On the homepage, we wanted to guide new users toward two actions: applying to
                projects and referring people to them, so even if a user did not find a project
                they thought they were a good fit for, they could still get value out of the
                platform.
              </p>
            }
          >
            <MediaPanel
              src={media.home}
              alt="Meridial home in a browser — Apply to projects and Refer and earn over a Projects for you row"
              aspect={MEDIA_ASPECT.home}
            />
          </StoryRow>

          <StoryRow
            lead="tight"
            body={
              <Paragraphs>
                <p style={bodyStyle}>
                  The Explore page lets users search, filter, and sort projects, then apply to them.
                  By default, projects are sorted by “Best match” based on the user’s profile and
                  each project’s requirements.
                </p>
                <p style={bodyStyle}>
                  I kept the page clean and the controls minimal. I chose the “Language” and
                  “Expertise” filters based on data from the job board on our marketing site, where
                  most users relied on them to search for projects.
                </p>
              </Paragraphs>
            }
          >
            <MediaPanel
              src={media.explore}
              alt="Meridial Explore in a browser — a grid of project cards with Best match, Language and Expertise filters"
              aspect={MEDIA_ASPECT.explore}
            />
          </StoryRow>

          <StoryRow
            lead="tight"
            body={
              <Paragraphs>
                <p style={bodyStyle}>
                  Selecting a project turns the Explore page into a split view, with the project list
                  on the left and project details on the right.
                </p>
                <p style={bodyStyle}>
                  I ordered the sections of the panel to reflect what we would like users to do and
                  what I think users would want to know. So the actions they can take on that
                  project are at the top, and second would be the application progress and then the
                  project description. I put the application progress section above the project
                  description because users may have progress toward an application that they've
                  never even clicked on because the assessments and some of the application steps
                  are shared between projects. And so they may actually be very close to completing
                  an application without having done anything for that one specifically. So I wanted
                  to surface that ahead of the job description.
                </p>
              </Paragraphs>
            }
          >
            <MediaPanel
              src={media.detail}
              alt="Explore split view in a browser — project list on the left, application progress and job details on the right"
              aspect={MEDIA_ASPECT.detail}
            />
          </StoryRow>

          <StoryRow
            lead="tight"
            body={
              <p style={bodyStyle}>
                After a user submits their application they'll get a confirmation modal and a quick
                explainer of the next steps on what they can do.
              </p>
            }
          >
            <MediaPanel
              src={media.apply}
              alt="Thank you for applying modal in a browser — next steps for ID, address and a security video, plus apply to more projects"
              aspect={MEDIA_ASPECT.apply}
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
        maxWidth: copyMeasure(COPY_WIDTH),
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
          letterSpacing: 0,
        }}
      >
        Users can apply to projects on Meridial
      </h1>
    </section>
  )
}

/**
 * One stacked row: heading + copy on the centred 700 column, media below it at
 * `width`. `children` is optional — Users / Jobs and the Expert brief are copy
 * on their own. `lead` is the space above the row, as on the other studies.
 */
function StoryRow({
  heading,
  body,
  children,
  width,
  lead = 'section',
}: {
  heading?: string
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
          maxWidth: copyMeasure(COPY_WIDTH),
          minWidth: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: space.xl,
        }}
      >
        {heading && (
          <h2
            style={{
              margin: 0,
              fontSize: '24px',
              fontWeight: 600,
              lineHeight: 'normal',
              letterSpacing: 0,
              color: color.text.primary,
            }}
          >
            {heading}
          </h2>
        )}
        {body}
      </div>
      {children && <div style={{ width: width ? mediaWidth(width) : '100%' }}>{children}</div>}
    </section>
  )
}

function Paragraphs({ children }: { children: ReactNode }) {
  return <div style={{ display: 'flex', flexDirection: 'column', gap: space.lg }}>{children}</div>
}

function MediaPanel({
  src,
  alt,
  aspect,
  radius,
}: {
  src: string
  alt: string
  aspect: string
  /** The invitations plate is a rounded rect in the file; the browser shots already carry their own chrome. */
  radius?: boolean
}) {
  return (
    <img
      src={src}
      alt={alt}
      style={{
        display: 'block',
        width: '100%',
        aspectRatio: aspect,
        ...(radius ? { borderRadius: MOCKUP_RADIUS } : null),
      }}
    />
  )
}
