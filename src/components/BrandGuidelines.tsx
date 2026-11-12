import type { CSSProperties, ReactNode } from 'react'
import { CalmButton } from './ContactButtons'
import { CurvedCopy } from './Curved'
import { Interlock, Piece } from './Interlock'
import { TextureCanvas } from './PixelTexture'
import Reveal from './Reveal'
import { SheetIntro, SheetPage } from './Sheet'
import {
  GlyphSheet,
  LeafField,
  LeafSwatch,
  LeavesApart,
  Lockup,
  MarkConstruction,
  Mono,
  RadiusScale,
  SpinePost,
  Treatments,
  WordmarkConstruction,
} from './brand/BrandArt'
import { radius, space } from '../design-system/tokens'
import { useIsMobile } from '../hooks/useIsMobile'
import { useTexturePaused } from '../hooks/useTexturePaused'
import { CURVED_BODY_SIZE, TEXT_SOFT, sheetGap } from '../sheetStyle'
import { DEFAULT_SETTINGS, LANDING_SETTINGS } from '../textureSettings'

/*
  `/work/noey-brand` (Nov 12 2026): the brand guidelines from the Figma file
  (`h7PWAQCOhl8NwRoFTs3Cbu`, the V2 set: art straight on the card, no panel
  inside it) as a page, with the social posts sprinkled through. It doesn't
  run the other project pages' card-and-tab rhythm: each section is an
  `Interlock`, one surface traced round a grid of pieces, so on a wide screen
  the pieces step and notch into each other and the posts sit in notches the
  surface wraps round. It breaks out of the column (`Wide`) to 1560. The art is
  live, drawn from the site's own data (`BrandArt`), and the texture runs; only
  the posts and the wallpaper are exports. A phone stacks the pieces as cards.
*/

const IMG = '/work/brand'

/** Wider than the column on a big screen, centred on it; the column itself below that. */
function Wide({ children }: { children: ReactNode }) {
  const width = 'max(100%, min(1560px, calc(100vw - 96px)))'
  return <div style={{ width, marginLeft: `calc((100% - ${width}) / 2)` }}>{children}</div>
}

type Post = { src: string; alt: string; w: number; h: number }
const POSTS = {
  smirk: { src: 'post-01-smirk', alt: 'The rail’s smirk face, huge, in lime on hot pink with a violet echo', w: 1080, h: 1080 },
  pinwheel: { src: 'post-02-pinwheel', alt: 'The mark’s four leaves, huge, spinning out from the centre on sky blue with violet echoes', w: 1080, h: 1080 },
  stickers: { src: 'post-03-stickers', alt: 'A four by four sheet of colored tiles, each with a glyph cut in, on purple', w: 1080, h: 1080 },
  joined: { src: 'post-04-joined', alt: 'Orange, magenta and lime shapes joined with concave curves on cream', w: 1080, h: 1080 },
  flood: { src: 'post-05-flood', alt: 'The texture flooding the frame in patches of bright color', w: 1080, h: 1350 },
  spine: { src: 'post-06-spine', alt: 'A cream spine with pills growing out of it, a face in each, on deep blue', w: 1080, h: 1080 },
  heart: { src: 'post-08-heart', alt: 'A pixel heart built of crimson tiles with glyphs cut in, on mint', w: 1080, h: 1080 },
  blocks: { src: 'post-09-blocks', alt: 'The Noey wordmark repeated in colored blocks on violet', w: 1080, h: 1350 },
  stimmy: { src: 'post-10-stimmy', alt: 'The texture gray above and in color below, the I’m overstimulated button at the seam', w: 1080, h: 1920 },
  clash: { src: 'post-11-clash', alt: 'Nine clashing color squares, each with one glyph over an echo in a third color', w: 1080, h: 1080 },
  streaks: { src: 'post-12-streaks', alt: 'Rows of colored streaks on deep indigo, each ending in a tile', w: 1080, h: 1350 },
} satisfies Record<string, Post>

/**
 * A post on the page, its 16 corners concentric with the surface's 24 notch round it.
 * `fill` takes the whole height of its cell, cropping the post to the cell's shape, for a
 * post whose row is set taller by the pieces beside it (it then adds no height of its own).
 */
function PostImg({ post, fill = false }: { post: Post; fill?: boolean }) {
  const img = (
    <img
      src={`${IMG}/${post.src}.webp`}
      alt={post.alt}
      width={post.w}
      height={post.h}
      loading="lazy"
      decoding="async"
      style={
        fill
          ? { position: 'absolute', inset: 0, display: 'block', width: '100%', height: '100%', objectFit: 'cover' }
          : { display: 'block', width: '100%', height: 'auto', borderRadius: radius.xl }
      }
    />
  )
  if (!fill) return img
  return (
    <div style={{ position: 'relative', height: '100%', minHeight: 240, borderRadius: radius.xl, overflow: 'hidden' }}>{img}</div>
  )
}

/**
 * The whole series at a glance: every post as a small square (a tall one cropped
 * to its middle), and the leaf pattern in the last cell, on the surface beside
 * the last two posts.
 */
function PostSheet() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: space.sm }}>
      {Object.values(POSTS).map((post) => (
        <img
          key={post.src}
          src={`${IMG}/${post.src}.webp`}
          alt=""
          width={post.w}
          height={post.h}
          loading="lazy"
          decoding="async"
          style={{ display: 'block', width: '100%', height: 'auto', aspectRatio: '1', objectFit: 'cover', borderRadius: radius.md }}
        />
      ))}
      <div aria-hidden style={{ position: 'relative', aspectRatio: '1', borderRadius: radius.md, overflow: 'hidden' }}>
        <LeafField cols={4} rows={4} />
      </div>
    </div>
  )
}

/** A section's words on the surface. */
function Copy({ heading, body, children }: { heading: string; body: string | string[]; children?: ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: space.xl }}>
      <CurvedCopy heading={heading} body={body}>
        {children}
      </CurvedCopy>
    </div>
  )
}

/**
 * The swatches' spacing: a gap (16) between them, between their two rows (the grid's
 * own gap, with no padding either side of it), and in from the surface's edge.
 */
const SWATCH_GAP = 16

/** A colour's name and values, under its swatch. */
function SwatchLabel({ name, values }: { name: string; values: string[] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2, padding: `0 ${space.sm} ${space.sm}` }}>
      <span style={{ fontSize: '15px', fontWeight: 500 }}>{name}</span>
      {values.map((value) => (
        <Mono key={value}>{value}</Mono>
      ))}
    </div>
  )
}

/** A label over a piece's art. */
function Caption({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return <Mono style={{ display: 'block', marginBottom: space.lg, ...style }}>{children}</Mono>
}

/** Desktop areas, or the same pieces stacked one to a row on a phone. */
function layout(isMobile: boolean, areas: string[], stack: string[]) {
  return isMobile ? { areas: stack, columns: '1fr', join: false } : { areas }
}

const LEAVES: [string, string, string][] = [
  ['Green', '#26B846', '#3AED62'],
  ['Orange', '#F95B1C', '#FF8F0C'],
  ['Yellow', '#FCB01A', '#FFD233'],
  ['Teal', '#008755', '#08B776'],
]
const NEUTRALS: [string, string][] = [
  ['Char', '#171615'],
  ['Raised', '#1D1F1E'],
  ['Ink', '#0F0E0E'],
  ['Stone', '#45423D'],
  ['Cream raised', '#EBE4D3'],
  ['Paper', '#ECEDE6'],
  ['Cream', '#F5EFE0'],
]

export default function BrandGuidelines() {
  const isMobile = useIsMobile()
  const paused = useTexturePaused()
  const gap = sheetGap(isMobile)

  return (
    <SheetPage>
      <SheetIntro
        title="Noey brand"
        helper={['Brand identity', '2026']}
        description={[
          'I would describe my style as color puke and kind of art poppy. I really like the connective, fluid look and animation for the UI that feels very natural and organic juxtaposed with pixel art and stuff that is very rigid. I think that’s just a nice play on each other.',
          'That’s what I wanted to do for my personal brand is definitely pixel art forward, very colorful along with some organic vibes to it. It’s also heavily inspired, I think, a little bit by Legos, where I started out with these primary colors of the green, the orange, the yellow, and the blue, which felt very Lego-esque to me.',
        ]}
        inset={0}
        bodySize={CURVED_BODY_SIZE}
      />

      <div style={{ display: 'flex', flexDirection: 'column', gap }}>
        {/* Hero: the lockup over the landing texture, the copy on a tab, two posts in its notch. */}
        <Wide>
          <Interlock
            {...layout(
              isMobile,
              ['hero hero hero hero hero hero hero hero hero hero hero hero', 'copy copy copy copy copy copy smirk smirk smirk stickers stickers stickers'],
              ['hero', 'copy', 'smirk', 'stickers'],
            )}
          >
            <Piece area="hero" flush style={{ minHeight: isMobile ? 360 : 560, overflow: 'hidden', borderRadius: radius['2xl'] }}>
              <TextureCanvas
                {...LANDING_SETTINGS}
                paused={paused}
                mirror
                fill
                label="A wavering edge of pixel faces, leaves and shapes in the four leaf colors"
                wrapStyle={{
                  position: 'absolute',
                  top: 0,
                  bottom: 0,
                  right: 0,
                  width: isMobile ? '100%' : '62%',
                  maskImage: 'linear-gradient(to right, transparent 0, #000 14%)',
                  WebkitMaskImage: 'linear-gradient(to right, transparent 0, #000 14%)',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  left: isMobile ? 24 : 56,
                  bottom: isMobile ? 24 : 56,
                  right: isMobile ? 24 : undefined,
                }}
              >
                <Lockup square={isMobile ? 4 : 8} />
              </div>
            </Piece>
            <Piece area="copy">
              <Copy
                heading="Squares and curves"
                body={[
                  'Two things run through everything: pixel art drawn on a grid of squares, and soft surfaces that join with concave curves. The pixels are the content; the curves hold it.',
                  'The colors come from the leaf mark: four leaves, each a base and a highlight, bright like a box of bricks.',
                ]}
              >
                <div>
                  <CalmButton always />
                </div>
              </Copy>
            </Piece>
            <Piece area="smirk" bare>
              <PostImg post={POSTS.smirk} />
            </Piece>
            <Piece area="stickers" bare>
              <PostImg post={POSTS.stickers} />
            </Piece>
          </Interlock>
        </Wide>

        {/* Logo: construction, the leaves apart, the word on its blocks, the lockups; the mark post in a notch. */}
        <Reveal>
          <Wide>
            <Interlock
              {...layout(
                isMobile,
                [
                  'cons cons cons cons cons leaves leaves leaves leaves mark mark mark',
                  'cons cons cons cons cons word word word word word word word',
                  'copy copy copy copy copy lock lock lock lock page page page',
                ],
                ['copy', 'cons', 'leaves', 'word', 'lock', 'page', 'mark'],
              )}
            >
              <Piece area="cons" style={{ display: 'flex', flexDirection: 'column' }}>
                <Caption>Construction / 23 × 23</Caption>
                <div style={{ flex: 1, display: 'grid', placeItems: 'center' }}>
                  <MarkConstruction square={18} />
                </div>
              </Piece>
              <Piece area="leaves" style={{ display: 'flex', flexDirection: 'column' }}>
                <Caption>One leaf, turned four ways</Caption>
                <div style={{ flex: 1, display: 'grid', placeItems: 'center' }}>
                  <LeavesApart square={11} />
                </div>
              </Piece>
              <Piece area="mark" bare>
                <PostImg post={POSTS.pinwheel} fill={!isMobile} />
              </Piece>
              <Piece area="word">
                <Caption>Word / 13 × 3 blocks</Caption>
                <WordmarkConstruction square={12} />
              </Piece>
              <Piece area="copy">
                <Copy
                  heading="The leaf mark"
                  body="Four leaves on a 23 × 23 grid, each the same 9 × 13 leaf turned a quarter. The word is the same squares in blocks of three, set 4.6 squares from the mark. It only scales in whole squares, so the edges stay sharp."
                />
              </Piece>
              {/* One lockup on the surface, one on the page itself: whichever theme is on, both grounds show. */}
              <Piece area="lock" style={{ display: 'flex', flexDirection: 'column' }}>
                <Caption>Lockup / on the surface</Caption>
                <div style={{ flex: 1, display: 'grid', placeItems: 'center' }}>
                  <Lockup square={4} />
                </div>
              </Piece>
              <Piece area="page" bare style={{ display: 'flex', flexDirection: 'column', padding: `${space.xl} 0 0 ${space.xl}` }}>
                <Caption>On the page</Caption>
                <div style={{ flex: 1, display: 'grid', placeItems: 'center' }}>
                  <Lockup square={4} />
                </div>
              </Piece>
            </Interlock>
          </Wide>
        </Reveal>

        {/* Colour: the clash post in the top-left notch, the four leaves beside it, accents and neutrals under. */}
        <Reveal>
          <Wide>
            <Interlock
              {...layout(
                isMobile,
                [
                  'clash clash clash clash leaves leaves leaves leaves leaves leaves leaves leaves',
                  'copy copy copy copy swatches swatches swatches swatches swatches swatches swatches swatches',
                ],
                ['copy', 'leaves', 'swatches', 'clash'],
              )}
            >
              <Piece area="clash" bare>
                <PostImg post={POSTS.clash} />
              </Piece>
              {/* One piece, so the swatches sit a gap apart (16) and a gap in from the surface's edge, like the post beside them. */}
              <Piece area="leaves" style={{ padding: isMobile ? SWATCH_GAP : `${SWATCH_GAP}px ${SWATCH_GAP}px 0`, display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, minmax(0, 1fr))', gap: SWATCH_GAP }}>
                {LEAVES.map(([name, base, highlight]) => (
                  <div key={name} style={{ display: 'flex', flexDirection: 'column', gap: space.md }}>
                    <LeafSwatch base={base} highlight={highlight} minHeight={isMobile ? 160 : 200} />
                    <SwatchLabel name={name} values={[base, highlight]} />
                  </div>
                ))}
              </Piece>
              <Piece area="copy">
                <Copy
                  heading="Four leaves, toy-brick bright"
                  body="Each leaf is a base and a highlight, flat and saturated. They sit on char or cream, which swap places between dark and light mode. Orange doubles as the accent; sky blue swaps in for one highlight on the texture."
                />
              </Piece>
              <Piece
                area="swatches"
                style={{ padding: isMobile ? SWATCH_GAP : `0 ${SWATCH_GAP}px ${SWATCH_GAP}px`, display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : '1fr 1fr 2fr', gap: SWATCH_GAP }}
              >
                {[
                  ['Accent', '#F95B1C'],
                  ['Sky', '#44AAF8'],
                ].map(([name, hex]) => (
                  <div key={name} style={{ display: 'flex', flexDirection: 'column', gap: space.md }}>
                    <div style={{ flex: 1, minHeight: 120, background: hex, borderRadius: radius.xl }} />
                    <SwatchLabel name={name} values={[hex]} />
                  </div>
                ))}
                <div style={{ display: 'flex', flexDirection: 'column', gap: space.md, gridColumn: isMobile ? '1 / -1' : undefined }}>
                  <div style={{ flex: 1, minHeight: 120, display: 'flex', borderRadius: radius.xl, overflow: 'hidden' }}>
                    {NEUTRALS.map(([name, hex]) => (
                      <div key={name} title={`${name} ${hex}`} style={{ flex: 1, background: hex }} />
                    ))}
                  </div>
                  <SwatchLabel name="Char and cream" values={['#171615 · #F5EFE0 and the steps between']} />
                </div>
              </Piece>
            </Interlock>
          </Wide>
        </Reveal>

        {/* Posts: the flood and the leaf pattern beside the wallpaper. */}
        <Reveal>
          <Wide>
            <Interlock
              {...layout(isMobile, ['flood flood flood flood parade parade parade parade wall wall wall wall'], ['flood', 'parade', 'wall'])}
            >
              <Piece area="flood" bare>
                <PostImg post={POSTS.flood} />
              </Piece>
              {/* The original leaf pattern, full bleed, in the portrait post's box. */}
              <Piece area="parade" bare>
                <div style={{ position: 'relative', aspectRatio: '1080 / 1350', borderRadius: radius.xl, overflow: 'hidden' }}>
                  <LeafField />
                </div>
              </Piece>
              <Piece area="wall" style={{ display: 'flex', flexDirection: 'column', gap: space['2xl'], justifyContent: 'space-between' }}>
                <Copy heading="Take one home" body="The flood post, cut for an iPhone 16 Pro at 1206 × 2622." />
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: space.xl, flexWrap: 'wrap' }}>
                  <div
                    style={{
                      width: isMobile ? 150 : 'min(190px, 45%)',
                      aspectRatio: '1206 / 2622',
                      borderRadius: 28,
                      overflow: 'hidden',
                      boxShadow: '0 0 0 5px var(--color-text-primary)',
                      margin: 5,
                    }}
                  >
                    <img
                      src={`${IMG}/wallpaper-iphone-16-pro.webp`}
                      alt="The flood pattern as a phone wallpaper"
                      width={1206}
                      height={2622}
                      loading="lazy"
                      decoding="async"
                      style={{ display: 'block', width: '100%', height: '100%' }}
                    />
                  </div>
                  <a
                    href={`${IMG}/wallpaper-iphone-16-pro.png`}
                    download="noey-wallpaper-iphone-16-pro.png"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      height: 36,
                      padding: '0 16px',
                      borderRadius: radius.full,
                      background: 'var(--color-bg-cream)',
                      color: 'var(--color-ink)',
                      fontSize: '14px',
                      fontWeight: 500,
                      textDecoration: 'none',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    Download wallpaper
                  </a>
                </div>
              </Piece>
            </Interlock>
          </Wide>
        </Reveal>

        {/* Pixel art: every glyph, the heart post in the notch, the chrome's own glyphs under. */}
        <Reveal>
          <Wide>
            <Interlock
              {...layout(
                isMobile,
                [
                  'sheet sheet sheet sheet sheet sheet sheet sheet heart heart heart heart',
                  'copy copy copy copy copy copy copy copy copy copy . .',
                ],
                ['copy', 'sheet', 'heart'],
              )}
            >
              <Piece area="sheet">
                <GlyphSheet size={isMobile ? 40 : 52} />
              </Piece>
              <Piece area="heart" bare>
                <PostImg post={POSTS.heart} fill={!isMobile} />
              </Piece>
              <Piece area="copy">
                <Copy
                  heading="Everything is squares"
                  body="Every glyph fits a 16-square cell, so a face, a leaf and an arrow can trade places in the texture. One flat color per shape, whole squares only."
                />
              </Piece>
            </Interlock>
          </Wide>
        </Reveal>

        {/* Texture: live, paused beside it, the treatments; the story post down the right, wrapped under. */}
        <Reveal>
          <Wide>
            <Interlock
              {...layout(
                isMobile,
                [
                  'live live live live live live live live stimmy stimmy stimmy stimmy',
                  'still still still still treat treat treat treat stimmy stimmy stimmy stimmy',
                  'copy copy copy copy copy copy copy copy copy copy . .',
                ],
                ['copy', 'live', 'still', 'treat', 'stimmy'],
              )}
            >
              <Piece area="live" flush style={{ minHeight: isMobile ? 320 : 460, overflow: 'hidden', borderRadius: radius['2xl'] }}>
                <TextureCanvas
                  {...DEFAULT_SETTINGS}
                  shape="circle"
                  paused={paused}
                  fill
                  label="A live circle of the texture: pixel faces, leaves and shapes in patches of color"
                  wrapStyle={{ position: 'absolute', inset: 16, width: 'auto', height: 'auto', justifyContent: 'center', alignItems: 'center' }}
                />
                <Mono style={{ position: 'absolute', left: 32, top: 28 }}>Live / move your pointer over it</Mono>
              </Piece>
              <Piece area="stimmy" bare>
                <PostImg post={POSTS.stimmy} />
              </Piece>
              <Piece area="still" flush style={{ minHeight: isMobile ? 260 : 300, overflow: 'hidden', borderRadius: radius['2xl'] }}>
                <TextureCanvas
                  {...DEFAULT_SETTINGS}
                  shape="circle"
                  paused
                  ripple="off"
                  fill
                  label="The same texture paused, every color turned to a gray of its own brightness"
                  wrapStyle={{ position: 'absolute', inset: 16, width: 'auto', height: 'auto', justifyContent: 'center', alignItems: 'center' }}
                />
                <Mono style={{ position: 'absolute', left: 32, top: 28 }}>Paused</Mono>
              </Piece>
              <Piece area="treat">
                <Caption>Six ways to fill a cell</Caption>
                <Treatments size={isMobile ? 64 : 72} />
              </Piece>
              <Piece area="copy">
                <Copy
                  heading="The living texture"
                  body="ASCII art with the pixel glyphs in place of letters. Patches of color drift, glyphs flip, streaks slide through and a blob follows the pointer on the home page. Every page that shows it has a button to pause it, and paused, every color turns to a gray of its own brightness."
                />
              </Piece>
            </Interlock>
          </Wide>
        </Reveal>

        {/* Shape and type: two posts down the left, the rule, the radii and the type stepping beside them. */}
        <Reveal>
          <Wide>
            <Interlock
              {...layout(
                isMobile,
                [
                  'joined joined joined joined rule rule rule rule radius radius radius radius',
                  'spine spine spine spine type type type type type type . .',
                ],
                ['rule', 'radius', 'joined', 'type', 'spine'],
              )}
            >
              <Piece area="joined" bare>
                <PostImg post={POSTS.joined} />
              </Piece>
              {/* Drawn live, so its spine is the page's own colour in either theme. */}
              <Piece area="spine" bare>
                <div style={{ borderRadius: radius.xl, overflow: 'hidden' }}>
                  <SpinePost />
                </div>
              </Piece>
              <Piece area="rule">
                <Copy
                  heading="Round the surface, never the pixel"
                  body="Outer corners round at 24 and inside corners turn concave at 24, so neighbouring surfaces read as one piece. This page is laid out that way. The pixel art inside keeps its hard square edges."
                />
              </Piece>
              <Piece area="radius">
                <Caption>Radius</Caption>
                <RadiusScale />
              </Piece>
              <Piece area="type" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: space.xl }}>
                <Caption style={{ marginBottom: 0 }}>Type / Geist</Caption>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: space['2xl'], flexWrap: 'wrap' }}>
                  <span style={{ fontSize: isMobile ? '120px' : '200px', fontWeight: 500, lineHeight: 0.8, letterSpacing: '-0.02em' }}>Aa</span>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: space.sm, paddingBottom: space.sm }}>
                    <span style={{ fontSize: '30px', fontWeight: 500, lineHeight: 1.2 }}>One family</span>
                    <span style={{ fontSize: '16px', lineHeight: 1.4, color: TEXT_SOFT }}>Medium for headings, Regular for reading.</span>
                    <Mono>Geist Mono for specs · 23 × 23 · #F95B1C</Mono>
                  </div>
                </div>
              </Piece>
            </Interlock>
          </Wide>
        </Reveal>

        {/* Posts: the last two, beside a word on what they are. */}
        <Reveal>
          <Wide>
            <Interlock
              {...layout(isMobile, ['copy copy copy copy blocks blocks blocks blocks streaks streaks streaks streaks'], ['copy', 'blocks', 'streaks'])}
            >
              <Piece area="copy" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: space['2xl'] }}>
                <Copy
                  heading="Posts"
                  body="Then I played: the glyphs, the mark and the curves at poster size, in color pairs you wouldn’t usually put together, with as few words as possible."
                />
                <PostSheet />
              </Piece>
              <Piece area="blocks" bare>
                <PostImg post={POSTS.blocks} />
              </Piece>
              <Piece area="streaks" bare>
                <PostImg post={POSTS.streaks} />
              </Piece>
            </Interlock>
          </Wide>
        </Reveal>
      </div>
    </SheetPage>
  )
}
