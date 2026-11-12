import { useState } from 'react'
import { CurvedCard, CurvedCopy } from './Curved'
import Reveal from './Reveal'
import { SheetImg, SheetIntro, SheetPage } from './Sheet'
import WorkGate from './WorkGate'
import { useIsMobile } from '../hooks/useIsMobile'
import { CURVED_BODY_SIZE, sheetGap } from '../sheetStyle'
import { isUnlocked } from '../workGate'

/*
  `/work/invisible/synapse`, on the curved cards no3y Code runs (`Curved.tsx`, Nov 9
  2026): the intro, the blueprint on a rounded card with "The process" on a tab
  hanging off its foot, then the library with "Make it reusable" the same way.

  Both screenshots come out of section `319:30670` whole rather than as loose
  captures the page composes. The blueprint is two task windows on a Monterey
  gradient (the wallpaper is a Figma gradient, so there is nothing to rebuild in
  CSS) and the library is its own dark panel — the frame's 32px pad, 36px column
  gap and 24px row gap are all inside the export.
*/
const media = {
  blueprint: '/work/invisible/synapse/blueprint.jpg',
  library: '/work/invisible/synapse/library.webp',
} as const

/**
 * The library export bakes Figma's `#1e1e1e` canvas outside its panel's ~25px
 * corner (export px), so it is cropped this far in on every side — past the
 * whole corner, and well inside the panel's 64px pad.
 */
const LIBRARY_INSET = 26

/**
 * The page re-points the accent to a purplish pink off the blueprint's
 * Monterey wallpaper — its magenta waves (~#9e2e92) brightened to read as a
 * button — so Contact matches the hero, as onboarding and D2 Conflux do with
 * their products' colours (Nov 5 2026). White ink holds on it (~4.6:1).
 */
const THEME = {
  '--color-orange': '#c03fb4',
  '--color-orange-hover': '#a3339a',
  '--color-on-accent': '#ffffff',
} as React.CSSProperties

export default function InvisibleSynapse() {
  const isMobile = useIsMobile()
  const [unlocked, setUnlocked] = useState(isUnlocked)

  if (!unlocked) return <WorkGate onUnlock={() => setUnlocked(true)} />

  return (
    <div style={THEME}>
      <SheetPage>
        <SheetIntro
          title="Launching New AI Training Interfaces"
          helper="Invisible Technologies"
          description={[
            'I led design for the launch of Synapse, Invisible’s annotation platform. I created reusable components for AI training tasks and directed the experience through high-fidelity mockups tailored to specific client requirements.',
            'The small team included me, three to four engineers, and a product manager. The project did not follow a traditional product roadmap or launch process: the foundation was built before I joined to define and direct the UX.',
          ]}
          inset={0}
          bodySize={CURVED_BODY_SIZE}
        />

        <div style={{ display: 'flex', flexDirection: 'column', gap: sheetGap(isMobile) }}>
          {/*
            The problem, the process and the blueprint told as one story: a single
            paragraph under the blueprint, which opens the page as its hero.
          */}
          <CurvedCard
            media={
              <SheetImg
                priority
                shot={{
                  src: media.blueprint,
                  alt: 'Two RLHF task windows side by side: a Step 1 tooltip on the prompt composer, a Step 2 tooltip on annotating a pair of model responses',
                  aspect: '1328 / 586',
                }}
              />
            }
            copy={
              <CurvedCopy
                heading="The process"
                body="Our legacy platform was not designed for AI training tasks, so it was too rigid to support the range of client use cases we needed. We couldn’t quickly show clients we were capable of the work, building interfaces was extremely complicated, spinning up an interface and its data schema took weeks, and the UX for our experts was very poor. I met with the team that built the foundation of our “next-gen” annotation platform to ask questions, offer suggestions, and understand what they needed from design, and I interviewed subject-matter experts, users, and operations managers to learn what an AI training interface needed to support. From there, I started with an RLHF interface to establish the product’s foundation. One clear UX improvement was adding in-context instructions to guide users through each task: the right panel housed those instructions, while tooltips pointed to the elements that required input."
              />
            }
          />

          <Reveal>
            <CurvedCard
              media={
                <InsetImg
                  src={media.library}
                  alt="The Figma component library: header, tooling group and panel components beside the prompt, response and review-response sets, over a board of task composites"
                  width={2554}
                  height={1682}
                  inset={LIBRARY_INSET}
                />
              }
              copy={
                <CurvedCopy
                  heading="Make it reusable"
                  body="I created reusable Figma components so designing interfaces for new use cases and clients was faster and more consistent."
                />
              }
            />
          </Reveal>
        </div>
      </SheetPage>
    </div>
  )
}

/** A still across its card, cropped `inset` export px in on every side. */
function InsetImg({
  src,
  alt,
  width,
  height,
  inset,
}: {
  src: string
  alt: string
  width: number
  height: number
  inset: number
}) {
  const cropW = width - 2 * inset
  const cropH = height - 2 * inset
  const share = (px: number, of: number) => `${(px / of) * 100}%`

  return (
    <div style={{ position: 'relative', aspectRatio: `${cropW} / ${cropH}`, overflow: 'hidden' }}>
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        style={{
          position: 'absolute',
          left: `-${share(inset, cropW)}`,
          top: `-${share(inset, cropH)}`,
          width: share(width, cropW),
          height: share(height, cropH),
          maxWidth: 'none',
          display: 'block',
        }}
      />
    </div>
  )
}
