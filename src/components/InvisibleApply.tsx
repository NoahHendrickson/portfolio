import { useState, type CSSProperties, type ReactNode } from 'react'
import { CurvedCard, CurvedCopy, CurvedMedia } from './Curved'
import Reveal from './Reveal'
import { SheetImg, SheetIntro, SheetPage } from './Sheet'
import WorkGate from './WorkGate'
import { radius, space } from '../design-system/tokens'
import { useIsMobile } from '../hooks/useIsMobile'
import { CURVED_BODY_SIZE, SHEET_BODY, SHEET_HEADING, sheetGap } from '../sheetStyle'
import { MERIDIAL_PLATE, MERIDIAL_THEME } from '../meridialTheme'
import { isUnlocked } from '../workGate'

/*
  `/work/invisible/apply`, on the curved cards no3y Code runs (`Curved.tsx`, Nov 9
  2026): the intro, the hero stage on a rounded card, then each section as its media
  on a card with its copy on a tab hanging off the card's foot. The problem, the
  jobs to be done and My focus stay as one run of copy under the board, with Users
  as a card of its own beside it.

  The product's colour stays inside the media: the windows stand on the
  Meridial plate, as on the onboarding study, while the page is the site's.
*/

/*
  The four product shots come out of the frame whole, each the browser chrome
  plus the Meridial window (`379:24380`, `379:24381`, `379:25622`, `379:26863`).
  The invitations shot is node `338:7979` as drawn (948 × 839, shipped at 2×).
*/
const media = {
  invitations: '/work/invisible/apply/invitations.webp',
  home: '/work/invisible/apply/home.webp',
  explore: '/work/invisible/apply/explore.webp',
  detail: '/work/invisible/apply/detail.webp',
  apply: '/work/invisible/apply/apply.webp',
} as const

const MEDIA_ASPECT = {
  invitations: '1896 / 1678',
  home: '2456 / 1707',
  explore: '2456 / 1707',
  detail: '2454 / 1708',
  apply: '2456 / 1707',
} as const

/*
  The plate is the onboarding study's (`MERIDIAL_PLATE`), with the same lift on
  the windows. It is the
  same product, so it takes the same colour. The card rounds the plate; the
  windows on it keep their own corner and shadow.
*/
const PLATE = MERIDIAL_PLATE
const WINDOW_SHADOW = [
  '0 1px 3px rgba(20, 40, 60, 0.08)',
  '0 8px 24px -4px rgba(30, 70, 100, 0.14)',
  '0 28px 56px -16px rgba(30, 70, 100, 0.22)',
].join(', ')
/** The stage the hero's windows are placed on, as on the onboarding study. */
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

/** The invitations board is nearly square, so it's held to what fits on a laptop's screen. */
const INVITATIONS_MAX = 620

const PARAGRAPH: CSSProperties = { ...SHEET_BODY, fontSize: CURVED_BODY_SIZE }

const listStyle: CSSProperties = {
  ...PARAGRAPH,
  display: 'flex',
  flexDirection: 'column',
  gap: space.sm,
  // Tailwind's preflight strips list markers, so the numbering is set back on here.
  paddingLeft: '1.25em',
  listStyleType: 'decimal',
}

export default function InvisibleApply() {
  const isMobile = useIsMobile()
  const [unlocked, setUnlocked] = useState(isUnlocked)

  if (!unlocked) return <WorkGate onUnlock={() => setUnlocked(true)} />

  return (
    <div style={MERIDIAL_THEME}>
      {/* Meridial's magenta on Contact, as on the onboarding study (Nov 5 2026). */}
      <SheetPage>
        <SheetIntro
          title="Users can apply to projects on Meridial"
          helper="Invisible Technologies"
          description={[
            'Experts on Meridial had no way to find more work on the platform, so staffing every AI training project ran through Greenhouse and external job boards. I designed how experts explore and apply to projects inside Meridial.',
          ]}
          inset={0}
          bodySize={CURVED_BODY_SIZE}
        />

        <div style={{ display: 'flex', flexDirection: 'column', gap: sheetGap(isMobile) }}>
          {/* The intro carries the hero's words, so it is a card with no tab. */}
          <CurvedMedia>
            <Showcase />
          </CurvedMedia>

          <Reveal>
            <CurvedCard
              media={
                <div style={{ background: PLATE, padding: isMobile ? '16px' : '48px', display: 'flex', justifyContent: 'center' }}>
                  <div style={{ width: '100%', maxWidth: INVITATIONS_MAX, borderRadius: radius.lg, overflow: 'hidden' }}>
                    <SheetImg
                      shot={{
                        src: media.invitations,
                        alt: 'The old invitations tool: a table of project invites with status, dates and a search field',
                        aspect: MEDIA_ASPECT.invitations,
                      }}
                    />
                  </div>
                </div>
              }
              copy={
                <CurvedCopy
                  heading="The problem"
                  body="At Invisible, we use Greenhouse and external job boards to recruit people for AI training projects. This became a prominent bottleneck for our hiring team and a bad experience for our existing users because they could not find new or more work on the platform. The hiring team had to do a lot of manual work to ensure there weren't duplicate users applying through Greenhouse who already had accounts. We needed a simple and efficient way for our current users to find and apply to new projects so that we could meet the demand of our clients."
                >
                  <Part heading="The jobs to be done">
                    <ol style={listStyle}>
                      <li>Experts can explore and apply to AI training projects on Meridial.</li>
                      <li>Delivery managers can independently source talent by creating and posting projects on Meridial.</li>
                      <li>
                        The hiring team can focus on external talent and spend less time manually reviewing and deduplicating
                        applicants.
                      </li>
                    </ol>
                  </Part>
                  <Part heading="My focus">
                    <p style={PARAGRAPH}>
                      My primary focus for the UX and UI was the expert persona. This was a brand-new pattern and object on the
                      platform, so I needed to be involved in the foundation and the conceptual model: what it means to apply to
                      a project, and what a project is. I worked closely with engineering and product to define these new objects
                      and put forth a simple, clear mental model so experts could find and apply to new projects easily.
                    </p>
                  </Part>
                </CurvedCopy>
              }
              side={
                <CurvedCopy heading="Users">
                  <p style={PARAGRAPH}>This feature significantly affected three user groups.</p>
                  <ol style={listStyle}>
                    <li>
                      Experts: People completing AI training tasks, including generalists and specialists in fields such as
                      medicine, finance, and software development.
                    </li>
                    <li>
                      Delivery managers: People who oversee projects on clients’ behalf and ensure that teams deliver
                      high-quality work on time.
                    </li>
                    <li>Hiring: The team that supports delivery managers by sourcing talent for projects.</li>
                  </ol>
                </CurvedCopy>
              }
            />
          </Reveal>

          <Reveal>
            <CurvedCard
              media={
                <MediaPanel
                  src={media.home}
                  alt="Meridial home in a browser: Apply to projects and Refer and earn over a Projects for you row"
                  aspect={MEDIA_ASPECT.home}
                />
              }
              copy={
                <CurvedCopy
                  body={[
                    'On the homepage, we wanted to guide new users toward two actions: applying to projects and referring people to them, so even if a user did not find a project they thought they were a good fit for, they could still get value out of the platform.',
                  ]}
                />
              }
            />
          </Reveal>

          <Reveal>
            <CurvedCard
              media={
                <MediaPanel
                  src={media.explore}
                  alt="Meridial Explore in a browser: a grid of project cards with Best match, Language and Expertise filters"
                  aspect={MEDIA_ASPECT.explore}
                />
              }
              copy={
                <CurvedCopy
                  body={[
                    'The Explore page lets users search, filter, and sort projects, then apply to them. By default, projects are sorted by “Best match” based on the user’s profile and each project’s requirements.',
                    'I kept the page clean and the controls minimal. I chose the “Language” and “Expertise” filters based on data from the job board on our marketing site, where most users relied on them to search for projects.',
                  ]}
                />
              }
            />
          </Reveal>

          <Reveal>
            <CurvedCard
              media={
                <MediaPanel
                  src={media.detail}
                  alt="Explore split view in a browser: project list on the left, application progress and job details on the right"
                  aspect={MEDIA_ASPECT.detail}
                />
              }
              copy={
                <CurvedCopy
                  body={[
                    'Selecting a project turns the Explore page into a split view, with the project list on the left and project details on the right.',
                    "I ordered the sections of the panel to reflect what we would like users to do and what I think users would want to know. So the actions they can take on that project are at the top, and second would be the application progress and then the project description. I put the application progress section above the project description because users may have progress toward an application that they've never even clicked on because the assessments and some of the application steps are shared between projects. And so they may actually be very close to completing an application without having done anything for that one specifically. So I wanted to surface that ahead of the job description.",
                  ]}
                />
              }
            />
          </Reveal>

          <Reveal>
            <CurvedCard
              media={
                <MediaPanel
                  src={media.apply}
                  alt="Thank you for applying modal in a browser: next steps for ID, address and a security video, plus apply to more projects"
                  aspect={MEDIA_ASPECT.apply}
                />
              }
              copy={
                <CurvedCopy
                  body={[
                    "After a user submits their application they'll get a confirmation modal and a quick explainer of the next steps on what they can do.",
                  ]}
                />
              }
            />
          </Reveal>
        </div>
      </SheetPage>
    </div>
  )
}


/**
 * The hero: Explore in front and the split view behind it, on the Meridial
 * plate. As on the onboarding study, positions are
 * shares of a 1160 × 660 stage and both windows run off it — the front one past
 * the foot, the back one past the right — so no window shows its lower corners
 * floating short of the edge. Mobile keeps the front window alone.
 */
function Showcase() {
  const isMobile = useIsMobile()

  const front = (
    <ShowcaseWindow
      src={media.explore}
      alt="Meridial Explore in a browser: a grid of project cards with Best match, Language and Expertise filters"
      aspect={MEDIA_ASPECT.explore}
    />
  )

  if (isMobile) {
    return (
      <div style={{ overflow: 'hidden', background: PLATE, padding: '24px 16px 0' }}>
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
        background: PLATE,
      }}
    >
      <div style={at(540, 52, 700)}>
        <ShowcaseWindow
          src={media.detail}
          alt="Explore split view in a browser: project list on the left, application progress and job details on the right"
          aspect={MEDIA_ASPECT.detail}
        />
      </div>
      <div style={at(40, 120, 880)}>{front}</div>
    </div>
  )
}

function ShowcaseWindow({
  src,
  alt,
  aspect,
  lazy,
}: {
  src: string
  alt: string
  aspect: string
  /** A row's shot, below the fold: fetched as it nears the viewport. */
  lazy?: boolean
}) {
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
        loading={lazy ? 'lazy' : 'eager'}
        fetchPriority={lazy ? 'auto' : 'high'}
        decoding="async"
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
 * A browser shot on the Meridial plate, the window on it at 48 padding (16 on a
 * phone) — a light browser window straight on a dark page read as a cut-out.
 */
function MediaPanel({ src, alt, aspect }: { src: string; alt: string; aspect: string }) {
  const isMobile = useIsMobile()
  return (
    <div style={{ background: PLATE, padding: isMobile ? '16px' : '48px' }}>
      <ShowcaseWindow src={src} alt={alt} aspect={aspect} lazy />
    </div>
  )
}

/** A headed part inside one tab's copy, spaced off the part above. */
function Part({ heading, children }: { heading: string; children: ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: space.lg, marginTop: space.xl }}>
      <h3 style={{ ...SHEET_HEADING, fontSize: '18px' }}>{heading}</h3>
      {children}
    </div>
  )
}
