import { useState, type CSSProperties, type ReactNode } from 'react'
import Header from './Header'
import ProjectIntro, { SectionCopy, WideMedia } from './ProjectIntro'
import WorkGate from './WorkGate'
import { color, radius, space, type } from '../design-system/tokens'
import { useIsMobile } from '../hooks/useIsMobile'
import {
  PROJECT_MOBILE_PAD,
  PROJECT_SECTION_GAP,
  PROJECT_STACK_GAP,
  projectPad,
  projectWide,
} from '../layout'
import { isUnlocked } from '../workGate'

/*
  The page sits on the shared project frame (`layout.ts`): the capped column,
  the hero breaking out of it, and each section's heading and copy stacked
  flush left on the copy measure with its media across the whole column.
*/
/** Intro to hero shot — the Meridial onboarding study's. */
const HERO_GAP = { desktop: space['5xl'], mobile: space['3xl'] } as const

/**
 * Outer clip on the mockups — `ProjectStory`'s `MOCKUP_RADIUS`, so the screenshot
 * and the library panel land on the same corner as every other project page.
 */
const MOCKUP_RADIUS = radius.xl


/*
  Both screenshots come out of section `319:30670` whole rather than as loose
  captures the page composes. The blueprint is two task windows on a Monterey
  gradient (the wallpaper is a Figma gradient, so there is nothing to rebuild in
  CSS) and the library is its own dark panel — the frame's 32px pad, 36px column
  gap and 24px row gap are all inside the export, which is why `LibraryPanel` is
  gone. Both are wide landscape compositions: the blueprint fills the hero's
  1320, the library the 1160 column.

  The library export bakes Figma's `#1e1e1e` canvas outside a ~9.5px corner. It
  is left in rather than cut to transparent because `MOCKUP_RADIUS` clips further
  in than that, so the wedge never renders — re-check that if the radius drops.
*/
const media = {
  blueprint: '/work/invisible/synapse/blueprint.jpg',
  library: '/work/invisible/synapse/library.webp',
} as const

/** Each export's own ratio, so neither is stretched. */
const MEDIA_ASPECT = {
  blueprint: '1328 / 586',
  library: '2554 / 1682',
} as const

/** Every section's copy — onboarding's `body-xl`, on the shell's secondary ink. */
const bodyStyle: CSSProperties = {
  margin: 0,
  ...type['body-xl'],
  color: color.text.secondary,
}

export default function InvisibleSynapse() {
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
      <Header leading="back" showProfile={false} barInset={pad} />

      <main style={{ padding: isMobile ? `0 ${pad} 96px` : `0 ${pad} 160px` }}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: `${isMobile ? PROJECT_SECTION_GAP.mobile : PROJECT_SECTION_GAP.desktop}px`,
          }}
        >
          <Hero />

          {/*
            The problem, the process and the blueprint told as one story: a single
            paragraph under the blueprint, which now opens the page as its hero.
          */}
          <Section
            title="The process"
            body={
              <p style={bodyStyle}>
                Our legacy platform was not designed for AI training tasks, so it was too rigid to
                support the range of client use cases we needed. We couldn’t quickly show clients we
                were capable of the work, building interfaces was extremely complicated, spinning up
                an interface and its data schema took weeks, and the UX for our experts was very
                poor. I met with the team that built the foundation of our “next-gen” annotation
                platform to ask questions, offer suggestions, and understand what they needed from
                design, and I interviewed subject-matter experts, users, and operations managers to
                learn what an AI training interface needed to support. From there, I started with an
                RLHF interface to establish the product’s foundation. One clear UX improvement was
                adding in-context instructions to guide users through each task: the right panel
                housed those instructions, while tooltips pointed to the elements that required
                input.
              </p>
            }
          />

          <Section
            title="Make it reusable"
            body={
              <p style={bodyStyle}>
                I created reusable Figma components so designing interfaces for new use cases and
                clients was faster and more consistent.
              </p>
            }
          >
            <WideMedia>
              <img
                src={media.library}
                alt="The Figma component library — header, tooling group and panel components beside the prompt, response and review-response sets, over a board of task composites"
                loading="lazy"
                decoding="async"
                style={{
                  display: 'block',
                  width: '100%',
                  aspectRatio: MEDIA_ASPECT.library,
                  borderRadius: MOCKUP_RADIUS,
                }}
              />
            </WideMedia>
          </Section>
        </div>
      </main>
    </div>
  )
}

/**
 * The opening, laid out like the Meridial onboarding study's: the intro, then
 * the hero shot under it, breaking out of the column the way onboarding's
 * showcase does. The blueprint is the page's most product-like visual, so it
 * opens the page and "The process" below it is copy only.
 */
function Hero() {
  const isMobile = useIsMobile()

  return (
    <section style={{ display: 'flex', flexDirection: 'column' }}>
      <ProjectIntro
        title="Launching New AI Training Interfaces"
        helper="Invisible Technologies"
        description={[
          'I led design for the launch of Synapse, Invisible’s annotation platform. I created reusable components for AI training tasks and directed the experience through high-fidelity mockups tailored to specific client requirements.',
          'The small team included me, three to four engineers, and a product manager. The project did not follow a traditional product roadmap or launch process: the foundation was built before I joined to define and direct the UX.',
        ]}
      />
      <img
        src={media.blueprint}
        alt="Two RLHF task windows side by side — a Step 1 tooltip on the prompt composer, a Step 2 tooltip on annotating a pair of model responses"
        fetchPriority="high"
        style={{
          display: 'block',
          marginTop: isMobile ? HERO_GAP.mobile : HERO_GAP.desktop,
          ...(isMobile ? { width: '100%' } : projectWide()),
          aspectRatio: MEDIA_ASPECT.blueprint,
          borderRadius: MOCKUP_RADIUS,
        }}
      />
    </section>
  )
}

/**
 * One section on the shared project frame: heading and copy flush left on the
 * copy measure, and whatever follows (`children`) underneath across the column.
 */
function Section({
  title,
  body,
  children,
}: {
  title: string
  body: ReactNode
  children?: ReactNode
}) {
  const isMobile = useIsMobile()

  return (
    <section
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: `${isMobile ? PROJECT_STACK_GAP.mobile : PROJECT_STACK_GAP.desktop}px`,
      }}
    >
      <SectionCopy heading={title}>{body}</SectionCopy>
      {children}
    </section>
  )
}
