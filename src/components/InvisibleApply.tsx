import { useState, type CSSProperties, type ReactNode } from 'react'
import Header from './Header'
import ProjectIntro, { SectionCopy, WideMedia } from './ProjectIntro'
import WorkGate from './WorkGate'
import { color, radius, space, spacePx, type } from '../design-system/tokens'
import { useIsMobile } from '../hooks/useIsMobile'
import {
  PROJECT_COPY_MAX,
  PROJECT_MAX,
  PROJECT_MOBILE_PAD,
  PROJECT_SECTION_GAP,
  PROJECT_STACK_GAP,
  projectPad,
  projectWide,
} from '../layout'
import { isUnlocked } from '../workGate'

/*
  The page sits on the shared project frame (`layout.ts`), like the other
  Invisible studies: each row's copy flush left on the copy measure under the
  shared `ProjectIntro`, with the media below it,
  rather than the copy-left / media-right 1225 grid the frame draws (`331:50280`).
*/
/** The content column, which every media width is a share of. */
const CONTENT_WIDTH = PROJECT_MAX
/** The space above a row — see `InvisibleOnboarding`'s `LEAD`. */
const LEAD = { section: PROJECT_SECTION_GAP.desktop, tight: 120, close: spacePx['3xl'] } as const
const LEAD_MOBILE = { section: PROJECT_SECTION_GAP.mobile, tight: 64, close: spacePx['2xl'] } as const

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

/** Intro to hero — the Meridial onboarding study's. */
const HERO_GAP = { desktop: space['5xl'], mobile: space['3xl'] } as const

/*
  The hero stage borrows the onboarding study's: the same Meridial plate (its
  info panel's blue easing into the magenta's wash) and the same lift on the
  windows. It is the same product, so it takes the same colour.
*/
const PLATE = 'linear-gradient(135deg, #dff2fe 0%, #eef2fd 50%, #f9ecf7 100%)'
const WINDOW_SHADOW = [
  '0 1px 3px rgba(20, 40, 60, 0.08)',
  '0 8px 24px -4px rgba(30, 70, 100, 0.14)',
  '0 28px 56px -16px rgba(30, 70, 100, 0.22)',
].join(', ')
/** The stage the windows are placed on, as on the onboarding study. */
const STAGE = { width: 1160, height: 660 } as const
/**
 * The browser shots bake their window edge in: a 2px grey stroke round a 16px
 * corner, with the dark shell outside it (at the 2456 export). On the light
 * plate the baked corner shows as a dark wedge, so each shot is cropped
 * `SHOT_INSET` px in and rounded at `SHOT_RADIUS` — concentric with the baked
 * curve and clear of its stroke — and `SHOT_STROKE`, the baked stroke's own
 * grey, is drawn back on at 1px (the 2px export stroke at the shot's size on
 * the page). Inset and radius are export px, written as shares so they scale.
 */
const SHOT_INSET = 4
const SHOT_RADIUS = 12
const SHOT_STROKE = '#8b8b8a'
/** How far a row's plate reaches past its media slot on each side (`MediaPanel`). */
const PLATE_BLEED = 48

const bodyStyle: CSSProperties = {
  margin: 0,
  ...type['body-xl'],
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
  const pad = isMobile ? PROJECT_MOBILE_PAD : projectPad()

  if (!unlocked) return <WorkGate onUnlock={() => setUnlocked(true)} barInset={pad} />

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
        barInset={pad}
      />

      <main
        style={{
          boxSizing: 'border-box',
          padding: isMobile ? `0 ${pad} 64px` : `0 ${pad} 80px`,
        }}
      >
        <div
          style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
          }}
        >
          <Hero />

          <StoryRow
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
              bare
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

/**
 * The opening, laid out like the Meridial onboarding study's: the intro, then a
 * hero stage straight under it across the full column.
 */
function Hero() {
  const isMobile = useIsMobile()

  return (
    <section style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
      <ProjectIntro
        title="Users can apply to projects on Meridial"
        helper="Invisible Technologies"
        description="Experts on Meridial had no way to find more work on the platform, so staffing every AI training project ran through Greenhouse and external job boards. I designed how experts explore and apply to projects inside Meridial."
      />
      <div
        style={{
          marginTop: isMobile ? HERO_GAP.mobile : HERO_GAP.desktop,
          ...(isMobile ? null : projectWide()),
        }}
      >
        <Showcase />
      </div>
    </section>
  )
}

/**
 * Explore in front and the split view behind it, on the Meridial plate. As on
 * the onboarding study, positions are shares of a 1160 × 660 stage and both
 * windows run off it — the front one past the foot, the back one past the
 * right — so no window shows its lower corners floating short of the edge.
 * Mobile keeps the front window alone.
 */
function Showcase() {
  const isMobile = useIsMobile()

  const front = (
    <ShowcaseWindow
      src={media.explore}
      alt="Meridial Explore in a browser — a grid of project cards with Best match, Language and Expertise filters"
      aspect={MEDIA_ASPECT.explore}
    />
  )

  if (isMobile) {
    return (
      <div
        style={{
          overflow: 'hidden',
          borderRadius: radius['2xl'],
          background: PLATE,
          padding: '24px 16px 0',
        }}
      >
        <div style={{ marginBottom: '-12%' }}>{front}</div>
      </div>
    )
  }

  const at = (left: number, top: number, width: number): CSSProperties => ({
    position: 'absolute',
    left: `${(left / STAGE.width) * 100}%`,
    top: `${(top / STAGE.height) * 100}%`,
    width: `${(width / STAGE.width) * 100}%`,
  })

  return (
    <div
      style={{
        position: 'relative',
        aspectRatio: `${STAGE.width} / ${STAGE.height}`,
        overflow: 'hidden',
        borderRadius: radius['2xl'],
        background: PLATE,
      }}
    >
      <div style={at(540, 52, 700)}>
        <ShowcaseWindow
          src={media.detail}
          alt="Explore split view in a browser — project list on the left, application progress and job details on the right"
          aspect={MEDIA_ASPECT.detail}
        />
      </div>
      <div style={at(40, 120, 880)}>{front}</div>
    </div>
  )
}

function ShowcaseWindow({ src, alt, aspect }: { src: string; alt: string; aspect: string }) {
  const [w, h] = aspect.split('/').map(Number)
  const cropW = w - 2 * SHOT_INSET
  const cropH = h - 2 * SHOT_INSET
  const share = (px: number, of: number) => `${(px / of) * 100}%`

  // The wrapper is the cropped window, so its corner and shadow land inside the baked edge.
  return (
    <div
      style={{
        position: 'relative',
        aspectRatio: `${cropW} / ${cropH}`,
        overflow: 'hidden',
        borderRadius: `${share(SHOT_RADIUS, cropW)} / ${share(SHOT_RADIUS, cropH)}`,
        boxShadow: WINDOW_SHADOW,
      }}
    >
      <img
        src={src}
        alt={alt}
        style={{
          position: 'absolute',
          left: `-${share(SHOT_INSET, cropW)}`,
          top: `-${share(SHOT_INSET, cropH)}`,
          width: share(w, cropW),
          height: share(h, cropH),
          maxWidth: 'none',
          display: 'block',
        }}
      />
      {/* The stroke rides over the shot, on the same corner. */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 'inherit',
          boxShadow: `inset 0 0 0 1px ${SHOT_STROKE}`,
          pointerEvents: 'none',
        }}
      />
    </div>
  )
}

/**
 * One stacked row: heading + copy on the copy measure, flush left, media below it at
 * `width`. `children` is optional — Users / Jobs and My focus are copy on
 * their own. `lead` is the space above the row, as on the other studies.
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
        alignItems: 'flex-start',
        gap: `${isMobile ? PROJECT_STACK_GAP.mobile : PROJECT_STACK_GAP.desktop}px`,
      }}
    >
      {heading ? (
        <SectionCopy heading={heading}>{body}</SectionCopy>
      ) : (
        <div style={{ width: '100%', maxWidth: `${PROJECT_COPY_MAX}px` }}>{body}</div>
      )}
      {children &&
        (width ? (
          <div style={{ width: mediaWidth(width) }}>{children}</div>
        ) : (
          <WideMedia>{children}</WideMedia>
        ))}
    </section>
  )
}

function Paragraphs({ children }: { children: ReactNode }) {
  return <div style={{ display: 'flex', flexDirection: 'column', gap: space.lg }}>{children}</div>
}

/**
 * A row's media. The browser shots stand on the hero's Meridial plate with the
 * same window shadow, as onboarding's shots do, rather than floating bare on the
 * dark shell — a light browser window straight on the dark page read as a
 * cut-out. The invitations shot is already a rounded plate in the file, so it
 * stands on its own (`bare`).
 */
function MediaPanel({
  src,
  alt,
  aspect,
  bare,
}: {
  src: string
  alt: string
  aspect: string
  bare?: boolean
}) {
  const isMobile = useIsMobile()

  if (bare) {
    return (
      <img
        src={src}
        alt={alt}
        style={{ display: 'block', width: '100%', aspectRatio: aspect, borderRadius: MOCKUP_RADIUS }}
      />
    )
  }

  if (isMobile) {
    return (
      <div style={{ borderRadius: radius['2xl'], background: PLATE, padding: '16px' }}>
        <ShowcaseWindow src={src} alt={alt} aspect={aspect} />
      </div>
    )
  }

  /*
    The plate runs wider than the media slot it sits in — up to `PLATE_BLEED` a
    side, never closer than 24 to the viewport — and takes the same amount back
    as padding, so the window keeps its size and only the plate grows. `100%`
    here is the `WideMedia` slot.
  */
  const bleed = `max(0px, min(${PLATE_BLEED}px, calc((100vw - 100%) / 2 - 24px)))`
  return (
    <div
      style={{
        borderRadius: radius['2xl'],
        background: PLATE,
        margin: `0 calc(-1 * ${bleed})`,
        padding: `48px calc(48px + ${bleed})`,
      }}
    >
      <ShowcaseWindow src={src} alt={alt} aspect={aspect} />
    </div>
  )
}
