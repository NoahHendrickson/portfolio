# Motion-design craft for premium software UI product videos (dev-tool / AI launches)

Source-quality note for the writer: the web has very little first-party writing from top studios (Buck, Linear, Apple, Stripe, Vercel) breaking down their launch films. Searches for "how we made" breakdowns of Linear, Raycast, Arc, Framer and Vercel launch videos returned nothing usable. Most numeric guidance below comes from (a) UI-motion practitioners (Emil Kowalski's published standards file, Jakub Krehel's skill files), (b) platform docs (Apple App Store app previews, X help, Netflix timed-text), and (c) screen-recording tool vendors and small studios with a commercial stake. Treat vendor numbers as working heuristics, not standards. Where a claim came only through a search-result summary rather than a page I fetched, it is marked "(search summary)".

## Camera: push-ins, zoom-to-detail, pans, parallax, 3D tilt, holding still

### Takeaway
Use one primary camera move per shot (a slow push-in, small tilt or slide) plus at most one supporting move; zoom roughly 1.3x–2x (2.5x is the ceiling), start the zoom about 0.5s before the action, keep each zoom under ~5s, cap it at around three zoom moments per minute, and keep the camera still while the UI itself is acting so text stays readable.

### Cited Findings
- Recommended zoom range for desktop UI is about 1.5x–2x; 2.5x is "tight" and only for a single small element, held briefly — [Screenify: auto-zoom](https://www.screenify.studio/blog/2026-04-10-auto-zoom-screen-recording) (search summary)
- A more conservative range: 1.3x–2x. Stay near 1.3x when the viewer still needs the surrounding interface; go toward 2x for small text — [ZoomCap](https://zoomcap.live/blog/why-screen-recordings-look-bad) (search summary)
- Beyond ~2.5x the viewer loses all surrounding context and no longer knows where on screen they are; past ~2x small camera movements get amplified into lurches and compression artifacts show — [Screenify](https://www.screenify.studio/blog/2026-04-10-auto-zoom-screen-recording); [Tenzen](https://tenzen.studio/blog/smooth-zoom-pan-screen-recording/) (search summary; the two claims were spread across these vendor posts)
- Zoom timing: start zooming about half a second before the click, hold while explaining, zoom out once the action finishes, keep each zoom under about five seconds — [Recorded](https://recorded.app/en/blog/creating-effective-product-demos/) (search summary)
- Restraint: "three zoom moments per minute, tops"; zooming on every click makes none of them stand out; avoid zooming during navigation (menu opens, page transitions) and keep the camera still during actions — vendor guides in the same set: [Screenify](https://www.screenify.studio/blog/2026-04-10-auto-zoom-screen-recording), [Tenzen](https://tenzen.studio/blog/smooth-zoom-pan-screen-recording/), [CreateADemo](https://createademo.com/blog/how-to-add-a-zoom-effect-to-a-video) (search summary; exact attribution among these not confirmed)
- Capture resolution has to support the zoom: a 2x zoom on a 720p recording shows a 640×360 slice blown up; record at a higher resolution than you publish — [ZoomCap](https://zoomcap.live/blog/why-screen-recordings-look-bad) (search summary)
- Screen Studio (the reference tool for this look) exposes zoom speed as four presets — Slow, Mellow, Quick, Rapid — and auto-zooms to where clicks happened, with manual zooms added on a timeline — [Screen Studio guide](https://www.screen.studio/guide/animations-motion) (search summary; page 404'd when fetched)
- Screen Studio's "screen animation" offers **Focused** (stabilises quickly, so content is easier to follow and read) vs **Smooth** (more fluid, for creative content not focused on reading); motion blur can be applied separately to cursor movement, zoom in/out, and panning while zoomed — [Screen Studio: Look & Feel](https://screen.studio/guide/animations)
- Users report Screen Studio has no way to customise the default automatic-zoom range — [Screen Studio feature hub](https://hub.screen.studio/p/custom-settings-for-default-automatic-zoom-range)
- Pick one primary movement (slow push-in, tilt, slide, or two-device reveal) plus at most one supporting movement; a push-in fails when it zooms past legibility; the device is not the story — motion should help the viewer notice what the app does — [AppLaunchFlow: animated device mockups](https://www.applaunchflow.com/blog/animated-device-mockups)
- A good tilt pattern is "small angle → UI transition → return"; avoid a dramatic spin as the story — [AppLaunchFlow](https://www.applaunchflow.com/blog/animated-device-mockups) (search summary)
- For a screen or front-facing product, a push-in or static hold usually works better than an orbit — [Seedance camera-movement guide](https://seedance2video.io/blog/ai-video-camera-movements-image-to-video-prompts) (search summary)
- Studio workflow for UI-led explainers: design screens in Figma, prep in Illustrator, animate in After Effects with null objects driving the camera, syncing layer motion with the UI so a pan reads as camera movement — [Skillshare: SaaS Explainer Animation](https://www.skillshare.com/en/classes/saas-explainer-animation-from-ui-design-to-motion-in-after-effects/1147733669) (search summary)
- Apple's App Store preview rules prefer native UI resolution "rather than zooming in on the view" and straightforward transitions (dissolves, fades), avoiding transitions that imply functionality the app doesn't have — [Apple: App previews](https://developer.apple.com/app-store/app-previews/)

### Inferences
- Apple's "don't zoom" rule is for store previews where honesty about the real UI matters; launch films routinely zoom. The common ground is "zoom only as far as legibility needs, and never fake behaviour."
- A practical recipe from the above: camera moves happen *between* UI actions (ease into position ~0.5s ahead), then the camera holds while the UI animates, then eases out. Moving camera + moving UI at once is what reads as "too much."
- Screen Studio's Focused vs Smooth split maps onto a general rule: overdamped / fast-settling camera for reading beats, softer drift for atmosphere beats (hero openers, end cards).

### Gaps
- No primary source found giving actual push-in rates, parallax depth offsets, or 3D tilt angles (degrees) from a named studio or a Linear/Apple/Stripe film. These numbers would have to come from frame-analysing the films themselves.
- No first-party breakdown of Screen Studio's spring parameters behind Slow/Mellow/Quick/Rapid.
- One search summary attributed an "orient → act → respond → hold" four-phase model to [better-design.com](https://better-design.com/principles/motion/product-interactions), but the fetched page did not contain it; treat that model as unverified.

## Timing and easing: durations, eases, springs, stagger, overshoot, beat length, total length

### Takeaway
UI elements inside the video should move on strong ease-out curves (e.g. `cubic-bezier(0.23, 1, 0.32, 1)`), mostly 150–300ms for small UI and up to ~500ms for panels, entering from scale 0.9–0.97 + opacity 0 with 30–80ms stagger and only light spring bounce (0.1–0.3); total length is converging on 40–70s for a hero film, ~30s for paid cutdowns and 6–15s for social hooks.

### Cited Findings
- UI durations (Emil Kowalski's published review standards): button press feedback 100–160ms; tooltips/small popovers 125–200ms; dropdowns 150–250ms; modals and drawers 200–500ms; general UI ceiling under 300ms (modals, drawers, sheets, toasts excepted); toasts 400ms; entrance example 300ms ease-out fade with 8px translate — [Emil Kowalski, review-animations STANDARDS.md](https://raw.githubusercontent.com/emilkowalski/skills/main/skills/review-animations/STANDARDS.md)
- Curves: strong ease-out for enter/exit `cubic-bezier(0.23, 1, 0.32, 1)`; strong ease-in-out for on-screen movement `cubic-bezier(0.77, 0, 0.175, 1)`; iOS-like drawer `cubic-bezier(0.32, 0.72, 0, 1)`; never `ease-in` on UI; constant motion uses linear — [Kowalski STANDARDS.md](https://raw.githubusercontent.com/emilkowalski/skills/main/skills/review-animations/STANDARDS.md)
- Springs: Apple-style `duration: 0.5, bounce: 0.2` recommended; bounce range 0.1–0.3, avoided in most UI; traditional physics example mass 1 / stiffness 100 / damping 10 — [Kowalski STANDARDS.md](https://raw.githubusercontent.com/emilkowalski/skills/main/skills/review-animations/STANDARDS.md)
- Entry start state `scale(0.9–0.97)` with opacity 0, never `scale(0)`; crossfade masking blur ~2px (keep under 20px); press `scale(0.97)` — [Kowalski STANDARDS.md](https://raw.githubusercontent.com/emilkowalski/skills/main/skills/review-animations/STANDARDS.md)
- Stagger: 30–80ms between items (example delays 50ms and 90ms for the 2nd and 3rd items) — [Kowalski STANDARDS.md](https://raw.githubusercontent.com/emilkowalski/skills/main/skills/review-animations/STANDARDS.md)
- Debug motion by slowing it 2–5× — [Kowalski STANDARDS.md](https://raw.githubusercontent.com/emilkowalski/skills/main/skills/review-animations/STANDARDS.md)
- Jakub Krehel: enter = opacity + small translateY + blur (blur gives a "materialising" effect); exits subtler and shorter than enters (community file example: −12px, 150ms exit vs 300ms enter) — [Krehel, better-ui animations.md](https://github.com/jakubkrehel/skills/blob/main/skills/better-ui/animations.md); [community summary of Krehel](https://github.com/rbaumier/skills/blob/main/ui-animations/references/jakub-krehel.md) (search summary)
- Linear motion feels robotic; ease-in/ease-out curves for SaaS; snappier feel for B2B tools, softer/slower for consumer apps — [Tenscope](https://www.tenscope.com/ui-ux-guide/mastering-saas-motion-design-to-drive-product-adoption) (search summary; vendor)
- Hero film length: 40–70s in 2026 (FAQ widens to 40–90s), down from 90–120s two years earlier; paid cutdowns ~30s; social hooks 6–15s; "A 60-second film with one job will out-perform a 120-second film with four" — [Composition: State of SaaS launch videos 2026](https://www.composition.agency/insights/saas-launch-video-trends-2026)
- Alternative studio view: launch video 30–45s — [ADDX Studio launch guide](https://addxstudio.com/work/saas-product-launch-video-guide); product demo 60–75s — [ADDX Studio demo guide](https://addxstudio.com/work/saas-product-demo-video-guide) (search summary)
- Apple App Store previews: up to 30 seconds each, up to three per language, each showing something new — [Apple: App previews](https://developer.apple.com/app-store/app-previews/)
- X: max upload length long cited as 2:20; Twitter historically recommended ~15 seconds as ideal; a 2025 marketer guide says ≤60s for the Video Tab — [Meltwater](https://www.meltwater.com/en/blog/guide-to-posting-videos-to-twitter); [dlvr.it](https://dlvrit.com/blog/?p=22249) (search summary; lengths conflict and are not from X's own docs)
- Per-beat holds for text: Netflix caps English subtitles at ~20 characters per second for adult content (17 for children's), with events between 5/6 of a second and 7 seconds — [Netflix: reading speed](https://backlothelp.netflix.com/hc/en-us/articles/115001352212-How-is-reading-speed-measured-Do-punctuation-and-spaces-count); [Netflix supplementals/marketing timed-text guide](https://backlothelp.netflix.com/hc/en-us/articles/115000239632-Timed-Text-Style-Guide-Supplementals-Marketing-Assets); [CaptionX summary](https://caption-x.com/blog/subtitle-reading-speed-study) (the 20 vs 17 split is from the CaptionX summary; another source cites 17 cps for Netflix overall, so figures conflict)
- Older "six-second rule": a two-line 64-character subtitle on screen ≥6s (~10.5 cps) — [Szarkowska et al.](https://ueaeprints.uea.ac.uk/id/eprint/100082/1/6_Szarkowska_et_al.pdf) (search summary)

### Inferences
- In-video UI motion can use the same values as shipped UI (150–300ms, strong ease-out). But because a video viewer is watching rather than doing, many editors run the *showcase* moments (a panel opening, a card landing) toward the top of the range (300–500ms) so the eye catches them; this is an inference, not sourced.
- Text-card hold time from the subtitle data: ~15–20 cps reading speed plus roughly 0.5–1s for the eye to land. A 40-character headline ≈ 2–3s minimum on screen; for a cold social viewer, err longer (closer to 10–12 cps, i.e. 3.5–4s).
- For a 40–60s hero: a 3s hook, ~5–8 beats of 4–7s each, and a 3–5s end card fits the 40–70s window.

### Gaps
- No studio source gave concrete overshoot percentages or frame counts for UI-promo "anticipation" beats specifically.
- No measured analysis of Linear/Apple/Stripe film cut rates or average shot length was found.

## Simplification: recreated UI vs screenshots, one idea per beat, focus and callouts

### Takeaway
The premium look comes from showing the product's feel rather than a tour: one idea and one action per beat, no competing controls animating at once, readable (often recreated or cleaned) UI, and clean cause-and-effect; Apple's store rules are the honesty floor (no faked functionality).

### Cited Findings
- "Show the product, not a product tour": glimpses and interactions that suggest how it feels to use; guided UI walkthroughs belong on the product page; packing many UI shots into the hero film tends to produce a video people don't finish; every shot should do two jobs — [Composition](https://www.composition.agency/insights/saas-launch-video-trends-2026)
- Motion design (crisp 4K vector animation, kinetic type, custom sound) over raw screen recordings; a long screen recording with quiet voiceover fails to stop the scroll — [ADDX Studio](https://addxstudio.com/work/saas-product-launch-video-guide) and [ADDX: why motion design not a screen recording](https://addxstudio.com/work/why-your-saas-launch-needs-a-motion-design-video) (vendor)
- One action per scene; don't animate several competing controls at once — reported in search summary of [better-design.com](https://better-design.com/principles/motion/product-interactions) (not found on the fetched page; unverified)
- Keep the cause-and-effect sequence intact: change a button to its loading/submitted state only after the click, unless the product really behaves differently — [Demotion: cursor and click animation](https://trydemotion.com/blog/cursor-click-animation-after-effects) (search summary)
- Apple: footage must show only in-app content, no hands or over-the-shoulder shots; touch hotspots or graphic elements may demonstrate interaction; avoid transitions implying functionality the app lacks; disclose paywalled/login features — [Apple: App previews](https://developer.apple.com/app-store/app-previews/)

### Inferences
- For an agentic-coding tool, simplification usually means: seeded fake data with short, legible names; one thread/agent in focus; secondary panels dimmed or blurred; type enlarged by the camera zoom rather than by redesigning the UI (keeps it honest per Apple's spirit).
- Focus techniques (dimming non-focused UI to ~30–50% or blurring it) are standard in launch films, but I found no sourced numeric values for them.

### Gaps
- No sourced numbers for dim/blur amounts, callout styles, or spotlight masks.
- No primary source comparing recreated (vector-rebuilt) UI vs real captures for audience trust or performance.

## Typography and text overlays: kinetic type, captions for muted autoplay, headline cards

### Takeaway
Design for sound-off: on-screen text carries the narrative, captions are mandatory on X/LinkedIn-style feeds, and every text card must stay up long enough to read (use subtitle reading speeds, ~15–20 cps, as the floor).

### Cited Findings
- Many viewers watch muted and read faster than they listen, so on-screen text should drive the narrative — [Composition](https://www.composition.agency/insights/saas-launch-video-trends-2026)
- Apple: previews play muted by default, so use copy to add context; keep text legible, easy to understand, and on screen long enough to read; avoid dates/seasonal references and prices — [Apple: App previews](https://developer.apple.com/app-store/app-previews/)
- The often-quoted "85% of Facebook video is watched without sound" comes from a 2016 Digiday article based on publisher-reported figures (LittleThings, Mic ~85%; PopSugar 50–80%; MEC clients 85–90% silent), not a formal study — [Digiday](https://digiday.com/media/silent-world-facebook-video/); [Tubefilter](https://www.tubefilter.com/2016/05/17/85-percent-facebook-video-views-without-volume/amp/)
- X videos autoplay muted; don't rely on viewers unmuting; use captions and an opening that works with sound on or off — [Meltwater](https://www.meltwater.com/en/blog/guide-to-posting-videos-to-twitter); [Brightcove](https://old.brightcove.com/resources/blog/best-practices-social-video-how-use-twitter-business/) (search summary)
- X's help centre says captions appear automatically on iOS/Android in the timeline but not all videos have them; autoplay is a user setting — [X Help: videos](https://help.x.com/en/using-x/x-videos); a UCLA guide claims X needs open (burned-in) captions, which conflicts with X's page — [UCLA brand video best practices](https://www.brand.ucla.edu/application/video/best-practices) (search summary)
- Descript suggests animated text and motion graphics can carry a launch video entirely, avoiding voiceover so it works without sound — [Descript: product launch videos](https://descript.com/blog/article/product-launch-videos) (search summary)

### Inferences
- Burned-in text (headline cards and in-frame captions) is safer than relying on X's auto-captions, given the conflicting sources and that a no-VO film has no speech to caption.
- For phone viewing of a 16:9 film in a feed, headline type should be very large relative to frame height; no sourced px/percentage was found (see Gaps).

### Gaps
- No credible source gave minimum type sizes (px at 1080p, or % of frame height) for mobile feed legibility.
- No sourced kinetic-type timing values (per-word reveal rates, etc.) specific to product films.

## Cursor and interaction: paths, click feedback, typing speed, AI streaming

### Takeaway
Cursor paths should be short, gently curved arcs that move fast and nearly stop at the target before the click, with a small ripple at the exact contact point; typed prompts read as human at ~50–60ms per character with jitter, while AI output can stream much faster (~5–20ms per character) and still read.

### Cited Findings
- Reshape the cursor's motion path into a slight curve rather than a straight line; keep arcs short, because a big arc crosses unrelated controls and implies interest in them; an overshoot makes the click look hesitant — [Demotion: cursor and click animation in After Effects](https://trydemotion.com/blog/cursor-click-animation-after-effects) (search summary)
- Move fast, then nearly stop at the click moment so the click reads; refine speed (Easy Ease) separately from path shape; put a marker on the click frame to trigger the click animation — [Demotion](https://trydemotion.com/blog/cursor-click-animation-after-effects) (search summary)
- Click ripple: start at the actual contact point, stay subordinate to the control, small; if a click looks theatrical, remove one feedback effect — [Demotion](https://trydemotion.com/blog/cursor-click-animation-after-effects) (search summary)
- Smooth arcs rather than zigzags make click highlights look cleaner in screen recordings — [Screenify: smooth cursor](https://www.screenify.studio/blog/2026-04-20-smooth-cursor-recording) (search summary)
- Screen Studio cursor animation style presets: Smooth, Medium, Rapid, None; smoothing can be disabled per clip; motion blur on cursor movement is adjustable — [Screen Studio: Look & Feel](https://screen.studio/guide/animations); [Screen Studio: disable smooth mouse movement](https://screen.studio/guide/disable-smooth-mouse-movement)
- Typing speed: ~60ms per character (~16 cps) reads as realistic human typing; ~20ms (~50 cps) as fast — [TextToolbox typewriter generator](https://texttoolbox.net/typewriter-effect-generator/) (search summary); library defaults 50–100ms per character — [Magic UI](https://magicui.design/docs/components/typing-animation), [React Bits](https://reactbits.dev/text-animations/text-type)
- AI streaming: one production chat UI uses 5ms per character (~200 cps) and finds it readable without feeling slow — [Upstash: smooth streaming in AI SDK v5](https://upstash.com/blog/smooth-streaming)
- Add random jitter to inter-character delay for a natural feel; keep the caret blink on a different rhythm than typing — [jsdev: ChatGPT typing effect](https://jsdev.space/howto/chatgpt-typing-effect/) (search summary)

### Inferences
- In a launch film, a 200 cps stream of a long answer is still too long to watch; the usual craft move is to time-compress (speed ramp, or jump-cut to the finished state) once the viewer has seen it start streaming. Show the first line or two at real speed, then accelerate. Not sourced; flag as practice.
- Typed prompts should be short so a human typing speed costs only 1–3s; long prompts can be "pasted" or typed at 2–3× speed.

### Gaps
- No authoritative frame counts for the pre-click pause or ripple duration.
- No source on hiding the cursor during camera moves, or on cursor scale in zoomed shots.

## Color and backdrop

### Takeaway
The sourced evidence here is thin: practitioners agree the backdrop should be a reusable brand system, and Screen Studio-style wallpapers/gradients are the norm, but I found no authoritative guidance with numbers on gradients, textures, or light vs dark UI on backdrops.

### Cited Findings
- Build a visual language reusable for ~12 months rather than a one-off film — [Composition](https://www.composition.agency/insights/saas-launch-video-trends-2026)
- Match animation style and tone to the product — [Jitter blog: marketing video production](https://blog.jitter.video/marketing-video-production/) (search summary)
- Vercel Ship's brand motion moved from magnetic particles (2024) to a fluid, ray-marched surface (2025), developed across Cinema4D, Figma and Flux — [Vercel: Designing and building the Ship conference platform](https://vercel.com/blog/designing-and-building-the-vercel-ship-conference-platform) (search summary; brand/site motion, not a launch film)

### Inferences
- A contrast rule of thumb: dark UI on a mid-to-bright saturated backdrop and light UI on a deeper backdrop keep the window edge readable; unsourced.

### Gaps
- No studio source on gradient construction, grain/texture amounts, or brand color proportion in UI films.

## Sound: music, UI SFX, and whether it matters on muted X

### Takeaway
Sound must be optional (X and most feeds autoplay muted), but it still lifts the unmuted viewing: one score throughout, ~90–115 BPM, a small palette of 3–5 short UI sounds (<1s each) used only where they mark a cause→effect, synced to the visible state change.

### Cited Findings
- Use the product's own sounds as hooks (a payment click, a transfer swoosh, a notification chime); lean on one sound and let it linger; bring the sound designer in at storyboard, not edit — [Composition](https://www.composition.agency/insights/saas-launch-video-trends-2026)
- Consider a single score across the whole piece for continuity; UI sound effects can reinforce functionality — [Apple: App previews](https://developer.apple.com/app-store/app-previews/)
- Tempo: 80–100 BPM for most SaaS demos, avoid >120 BPM in product-focused content — [Komet Media](https://www.kometmedia.com/tutorials/sound-design-and-music-for-b2b-video); 90–115 BPM for product demos — [Foxi Music](https://www.foximusic.com/blog/video-production-styles-music-guide/); a music seller pitches 114–126 — [Audiodrome](https://audiodrome.net/collections/music-for-product-demo-videos-collection/) (search summary; sources conflict, seller has a stake)
- Keep UI SFX under 1 second; pick 3–5 core SFX types and reuse them — [Avocado AI](https://www.avocadoai.co/blog/how-to/ai-sound-effects-product-demos-2026) (search summary)
- A subtle sound repeated every half-second becomes more intrusive than a stronger sound used once; give each sound a job (connect input to result, mark completion), don't click on every movement; a completion chime should land on the visible ready state, not the initial click — [OpenDesign: sound design for product videos](https://open-design.ai/blog/sound-design-product-videos/) (search summary)
- X autoplays muted; openers must work with sound on or off — [Meltwater](https://www.meltwater.com/en/blog/guide-to-posting-videos-to-twitter); [Brightcove](https://old.brightcove.com/resources/blog/best-practices-social-video-how-use-twitter-business/) (search summary)
- Silent viewing did not necessarily hurt brand lift or purchase intent for native ads (2016 publisher/agency reports) — [Tubefilter](https://www.tubefilter.com/2016/05/17/85-percent-facebook-video-views-without-volume/amp/)

### Inferences
- Since most feed views are silent, put the sound budget into the hero/landing-page version (where people unmute or click to play) and make the social cut fully legible without it.

### Gaps
- No current (post-2020) X-specific data on what share of views are unmuted.

## Storytelling structure for a 15–60s feature video

### Takeaway
Hook in the first 2–3 seconds with what the viewer gets (not the logo or founder story), one job per film, a short problem beat, a reveal carried by product motion, then a clear CTA/end card; if a founder appears, 15–30s at the end.

### Cited Findings
- Viewers often leave around second six; the first three seconds need a punchy hook; the first five should say what you get and why now; don't open with the company name or origin story — [Composition](https://www.composition.agency/insights/saas-launch-video-trends-2026)
- A 30–45s template: 0:00–0:03 hook (show the core pain visually; "2 seconds to hook"), 0:04–0:15 agitation (the tedious old way), 0:16–0:35 reveal (native UI motion), 0:36–0:45 CTA (URL, launch-day offer) — [ADDX Studio](https://addxstudio.com/work/saas-product-launch-video-guide) (vendor)
- Plan a system of 5–7 clips: hero film, 2–3 social cuts with different rhythms, a 6s teaser, a founder piece, site explainer motion; founder segments 15–30s at the end, written like explaining it to a friend; avoid AI-generated hero films and spokespeople — [Composition](https://www.composition.agency/insights/saas-launch-video-trends-2026)
- Production time for a bespoke 60–90s hero plus social cut pack: 4–8 weeks, ~6 typical — [Composition](https://www.composition.agency/insights/saas-launch-video-trends-2026)
- Post across X, LinkedIn, YouTube, Product Hunt in a concentrated 4–6 hour window — [ADDX Studio](https://addxstudio.com/work/saas-product-launch-video-guide) (vendor)
- Each video should show something new; the first can give an overview, later ones single features; choose a strong poster frame for when autoplay is off — [Apple: App previews](https://developer.apple.com/app-store/app-previews/)
- End with a clear call to action — [Loom/Atlassian](https://www.atlassian.com/blog/loom/product-launch-video) (search summary)

### Inferences
- For a 15s social cut: hook + one reveal + end card (roughly 3 / 9 / 3s). For a 45–60s hero: hook, one problem beat, 3–4 feature beats of one idea each, end card.
- The poster-frame advice matters for X too: the first frame should already read as the product and its promise, since many viewers see it before motion starts.

### Gaps
- No named, primary analyses of specific Linear, Apple, Stripe, Cursor or Claude launch films (shot lists, beat timings) were found; those would need direct frame-by-frame study.
