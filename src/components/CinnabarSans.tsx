import { CurvedCard, CurvedCopy, CurvedFacts } from './Curved'
import Reveal from './Reveal'
import { SheetClip, SheetImg, SheetIntro, SheetPage } from './Sheet'
import { useIsMobile } from '../hooks/useIsMobile'
import { CURVED_BODY_SIZE, sheetGap } from '../sheetStyle'

/*
  `/work/cinnabar-sans` (Nov 25 2026), hand-built on the curved cards with no `projects`
  entry, like Thinking States. Short on purpose: the intro, the family set live as the
  hero (the name in Medium over the alphabet), then Cinnabar
  Studio, the local editing tool built for the font (~/Developer/cinnabar-sans,
  `tools/studio.py`): a clip of the shape editor and a still of its kerning and
  whole-font controls. Both were captured off a throwaway copy of the Studio on its own
  port, so the running one's unsaved edits were never at risk; the clip is frame-stepped
  (scratchpad `rec.cjs`, Playwright at 2x), the cursor drawn into the page.
*/

const ASSET = '/work/cinnabar'

/** Cinnabar's red, the thumbnail's block, on Contact with white ink. */
const RED = '#e34234'
const THEME = {
  '--color-orange': RED,
  '--color-orange-hover': '#c9382b',
  '--color-on-accent': '#ffffff',
} as React.CSSProperties

/** The thumbnail's cream: the site's own, fixed in both themes since it sits on the red. */
const CREAM = '#f5efe0'

const FACTS = [
  { heading: 'Tools', items: ['Claude Opus', 'Python', 'fontmake'] },
  { heading: 'Skills', items: ['Type design', 'Tool building', 'Design engineering'] },
]

const WORD = 'Cinnabar Sans'

export default function CinnabarSans() {
  const isMobile = useIsMobile()

  return (
    <div style={THEME}>
      <SheetPage>
        <SheetIntro
          icon={`${ASSET}/icon.svg`}
          title="Cinnabar Sans"
          helper={['Typeface', '2026']}
          description={[
            'Cinnabar Sans is my own typeface. It started as Geist, reshaped for rounder bowls, a shorter lowercase and lighter horizontals, with Inter’s R and a mixed in. Now it’s a family of its own: no3y Code ships it, and this site is set in it.',
          ]}
          inset={0}
          bodySize={CURVED_BODY_SIZE}
        />

        <div style={{ display: 'flex', flexDirection: 'column', gap: sheetGap(isMobile) }}>
          <CurvedCard
            media={<Specimen />}
            copy={
              <CurvedCopy
                heading="The family"
                body={['Nine weights from Thin to Black, each with an italic.']}
              />
            }
            side={<CurvedFacts facts={FACTS} />}
          />

          <Reveal>
            <CurvedCard
              media={
                <SheetClip
                  video={{
                    src: `${ASSET}/studio-shape.mp4`,
                    hevc: `${ASSET}/studio-shape-hevc.mp4`,
                    poster: `${ASSET}/studio-shape-poster.jpg`,
                    alt: 'Cinnabar Studio’s shape editor: two points on the g’s ear are selected and dragged out, then the g is shown at Thin, Regular, Bold and Black with the ear moved in each',
                    aspect: '2880 / 1800',
                  }}
                />
              }
              copy={
                <CurvedCopy
                  heading="Cinnabar Studio"
                  caption="Moving the g’s ear, then checking it at Thin, Regular, Bold and Black."
                  body={[
                    'Font editors are built for drawing a typeface from scratch. I only wanted to fix what I noticed in real text, so the same evening I started the font, I built my own tool for it with Claude.',
                    'Cinnabar Studio is a local page that sets the font big in whatever I type. Double-click a letter and its outline opens with every point. A move applies to every weight and the italic at once, so the family still blends from Thin to Black.',
                  ]}
                />
              }
            />
          </Reveal>

          <Reveal>
            <CurvedCard
              media={
                <SheetImg
                  shot={{
                    src: `${ASSET}/studio-kern.webp`,
                    alt: 'Cinnabar Studio: “Typography, by hand” set large at Medium with kerning values under each pair, the T and y pair selected, and its kerning panel showing the value at every weight beside the x-height, cap height, weight and tracking controls',
                    aspect: '3200 / 2000',
                  }}
                />
              }
              copy={
                <CurvedCopy
                  heading="The controls"
                  caption="Kerning T and y at Medium, with its value at every weight."
                  body={[
                    'Click between two letters to kern them, or on a letter to change its spacing. The whole-font controls nudge x-height, cap height, stroke weight and tracking a percent at a time.',
                    'Save writes the sources, rebuilds the fonts and commits. While I edit, a no3y Code dev app redraws in the new build about a second later, so I see each change in the UI it’s made for. Over two days that came to more than 450 edits, 329 of them points moved in the shape editor.',
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
 * The hero: the family's name on the thumbnail's red, live type rather than a picture,
 * with the alphabet under it a size down. One weight (Medium, the thumbnail's g) and
 * upright throughout. Sized off the box (`cqw`), so the lines fill it at any width.
 */
function Specimen() {
  const type: React.CSSProperties = {
    margin: 0,
    fontFamily: "'Cinnabar Interface', sans-serif",
    fontWeight: 500,
    whiteSpace: 'nowrap',
  }
  const alphabet: React.CSSProperties = { ...type, fontSize: '4.4cqw', lineHeight: 1.3 }

  return (
    <div
      role="img"
      aria-label="Cinnabar Sans in Medium, with the alphabet in capitals and lowercase under it"
      // The box is the container, so the lengths inside it (`cqw`) are shares of its width.
      style={{ containerType: 'inline-size', background: RED, color: CREAM, aspectRatio: '16 / 8' }}
    >
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '4cqw', padding: '0 6cqw' }}>
        <p aria-hidden style={{ ...type, fontSize: '11cqw', lineHeight: 1, letterSpacing: '-0.02em' }}>
          {WORD}
        </p>
        <div aria-hidden>
          <p style={alphabet}>ABCDEFGHIJKLMNOPQRSTUVWXYZ</p>
          <p style={alphabet}>abcdefghijklmnopqrstuvwxyz</p>
        </div>
      </div>
    </div>
  )
}
