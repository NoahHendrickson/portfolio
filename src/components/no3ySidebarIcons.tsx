/**
 * no3y Code's sidebar glyphs (Nov 25 2026). The app draws Hugeicons now (free, Stroke Rounded),
 * through a shim that keeps lucide's names, and fills the "themed" ones under every fork palette
 * by a derived mask. `no3ySidebarGlyphs.ts` holds those drawings as the app's own code produced
 * them, so these match the running app glyph for glyph; see No3ySidebar.tsx. Phosphor duotone
 * (with a fill weight under Inlet and Basic) was the set until then. The worktree mark and the
 * provider marks are not from the set and stay as the app draws them. Colour rides `currentColor`.
 */
import { createElement, useId, type CSSProperties } from 'react'
import { GLYPHS, type GlyphName, type GlyphPart } from './no3ySidebarGlyphs'

type IconProps = { size?: number; width?: number; height?: number; style?: CSSProperties }

const draw = ([tag, attrs]: GlyphPart, index: number) => createElement(tag, { ...attrs, key: index })

/** One glyph on the set's 24 grid at its 1.5 stroke, the app's `HugeGlyph`. */
function Glyph({ name, size = 16, width, height, style }: IconProps & { name: GlyphName }) {
  const maskId = `n3sb-icon-${useId().replace(/[^\w-]/g, '')}`
  const { bodies, knockouts, plain } = GLYPHS[name]
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      width={width ?? size}
      height={height ?? size}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ display: 'block', flexShrink: 0, ...style }}
    >
      {knockouts.length > 0 ? (
        <>
          <defs>
            <mask id={maskId} maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
              <rect width="24" height="24" fill="white" stroke="none" />
              {knockouts.map(draw)}
            </mask>
          </defs>
          <g mask={`url(#${maskId})`}>{bodies.map(draw)}</g>
        </>
      ) : (
        bodies.map(draw)
      )}
      {plain.map(draw)}
    </svg>
  )
}

export const AlarmClock = (props: IconProps) => <Glyph name="AlarmClock" {...props} />
export const ArrowLeft = (props: IconProps) => <Glyph name="ArrowLeft" {...props} />
export const ArrowRight = (props: IconProps) => <Glyph name="ArrowRight" {...props} />
export const ArrowUpDown = (props: IconProps) => <Glyph name="ArrowUpDown" {...props} />
export const ChartDonut = (props: IconProps) => <Glyph name="ChartDonut" {...props} />
export const Check = (props: IconProps) => <Glyph name="Check" {...props} />
export const ChevronDown = (props: IconProps) => <Glyph name="ChevronDown" {...props} />
export const CircleAlert = (props: IconProps) => <Glyph name="CircleAlert" {...props} />
export const CircleAlertFill = (props: IconProps) => <Glyph name="CircleAlert" {...props} />
export const CircleDot = (props: IconProps) => <Glyph name="CircleDot" {...props} />
export const CircleHalf = (props: IconProps) => <Glyph name="CircleHalf" {...props} />
export const CircleSlash = (props: IconProps) => <Glyph name="CircleSlash" {...props} />
export const Clock = (props: IconProps) => <Glyph name="Clock" {...props} />
export const Code = (props: IconProps) => <Glyph name="Code" {...props} />
export const EllipsisVertical = (props: IconProps) => <Glyph name="EllipsisVertical" {...props} />
export const Folder = (props: IconProps) => <Glyph name="Folder" {...props} />
export const FolderClosed = (props: IconProps) => <Glyph name="FolderClosed" {...props} />
export const FolderOpen = (props: IconProps) => <Glyph name="FolderOpen" {...props} />
export const FolderPlus = (props: IconProps) => <Glyph name="FolderPlus" {...props} />
export const Folders = (props: IconProps) => <Glyph name="Folders" {...props} />
export const GitMerge = (props: IconProps) => <Glyph name="GitMerge" {...props} />
export const GitPullRequest = (props: IconProps) => <Glyph name="GitPullRequest" {...props} />
export const GitPullRequestDraft = (props: IconProps) => <Glyph name="GitPullRequestDraft" {...props} />
export const Laptop = (props: IconProps) => <Glyph name="Laptop" {...props} />
export const MessageSquareDashed = (props: IconProps) => <Glyph name="MessageSquareDashed" {...props} />
export const MessageSquareText = (props: IconProps) => <Glyph name="MessageSquareText" {...props} />
export const Music = (props: IconProps) => <Glyph name="Music" {...props} />
export const NavigationArrow = (props: IconProps) => <Glyph name="NavigationArrow" {...props} />
export const PanelLeft = (props: IconProps) => <Glyph name="PanelLeftClose" {...props} />
export const PanelLeftClose = (props: IconProps) => <Glyph name="PanelLeftClose" {...props} />
export const Pin = (props: IconProps) => <Glyph name="Pin" {...props} />
export const PinOff = (props: IconProps) => <Glyph name="PinOff" {...props} />
export const Plus = (props: IconProps) => <Glyph name="Plus" {...props} />
export const RefreshCw = (props: IconProps) => <Glyph name="RefreshCw" {...props} />
export const Search = (props: IconProps) => <Glyph name="Search" {...props} />
export const Settings = (props: IconProps) => <Glyph name="Settings" {...props} />
export const Zap = (props: IconProps) => <Glyph name="Zap" {...props} />

/** The section labels' fold caret (Petals, the status headers): a filled triangle on a 14 grid. */
export function Caret({ size = 14, style }: { size?: number; style?: CSSProperties }) {
  return (
    <svg aria-hidden viewBox="0 0 14 14" width={size} height={size} fill="none" style={{ display: 'block', flexShrink: 0, ...style }}>
      <path
        d="M7 8.75C7.92231 8.75 10.5 5.25003 10.5 5.25003L3.5 5.25C3.50854 5.26159 6.07917 8.75 7 8.75Z"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth={0.875}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function Worktree({ size = 16, width, height, style }: IconProps) {
  return (
    <svg aria-hidden viewBox="0 0 32 32" width={width ?? size} height={height ?? size} fill="none"  style={{ display: 'block', flexShrink: 0, ...style }}>
      <path opacity="0.2" d="M26 13C27.1046 13 28 12.1046 28 11C28 9.89543 27.1046 9 26 9C24.8954 9 24 9.89543 24 11C24 12.1046 24.8954 13 26 13Z" fill="currentColor" /><path opacity="0.2" d="M6 13C7.10457 13 8 12.1046 8 11C8 9.89543 7.10457 9 6 9C4.89543 9 4 9.89543 4 11C4 12.1046 4.89543 13 6 13Z" fill="currentColor" /><path d="M16 10L16 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><path d="M16 10C17.6569 10 19 8.65685 19 7C19 5.34315 17.6569 4 16 4C14.3431 4 13 5.34315 13 7C13 8.65685 14.3431 10 16 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><path d="M26 14C27.6569 14 29 12.6569 29 11C29 9.34315 27.6569 8 26 8C24.3431 8 23 9.34315 23 11C23 12.6569 24.3431 14 26 14Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><path d="M6 14C7.65685 14 9 12.6569 9 11C9 9.34315 7.65685 8 6 8C4.34315 8 3 9.34315 3 11C3 12.6569 4.34315 14 6 14Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><path d="M16 28C17.6569 28 19 26.6569 19 25C19 23.3431 17.6569 22 16 22C14.3431 22 13 23.3431 13 25C13 26.6569 14.3431 28 16 28Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><path d="M23.5 12.4433L16 16.7735" stroke="currentColor" strokeWidth="2" /><path d="M8.5977 12.5L15.9993 16.7735" stroke="currentColor" strokeWidth="2" />
    </svg>
  )
}

export function Claude({ size = 16, width, height, style }: IconProps) {
  return (
    <svg aria-hidden viewBox="0 0 256 257" width={width ?? size} height={height ?? size} fill="#d97757" preserveAspectRatio="xMidYMid" style={{ display: 'block', flexShrink: 0, ...style }}>
      <path d="m50.228 170.321 50.357-28.257.843-2.463-.843-1.361h-2.462l-8.426-.518-28.775-.778-24.952-1.037-24.175-1.296-6.092-1.297L0 125.796l.583-3.759 5.12-3.434 7.324.648 16.202 1.101 24.304 1.685 17.629 1.037 26.118 2.722h4.148l.583-1.685-1.426-1.037-1.101-1.037-25.147-17.045-27.22-18.017-14.258-10.37-7.713-5.25-3.888-4.925-1.685-10.758 7-7.713 9.397.649 2.398.648 9.527 7.323 20.35 15.75L94.817 91.9l3.889 3.24 1.555-1.102.195-.777-1.75-2.917-14.453-26.118-15.425-26.572-6.87-11.018-1.814-6.61c-.648-2.723-1.102-4.991-1.102-7.778l7.972-10.823L71.42 0 82.05 1.426l4.472 3.888 6.61 15.101 10.694 23.786 16.591 32.34 4.861 9.592 2.592 8.879.973 2.722h1.685v-1.556l1.36-18.211 2.528-22.36 2.463-28.776.843-8.1 4.018-9.722 7.971-5.25 6.222 2.981 5.12 7.324-.713 4.73-3.046 19.768-5.962 30.98-3.889 20.739h2.268l2.593-2.593 10.499-13.934 17.628-22.036 7.778-8.749 9.073-9.657 5.833-4.601h11.018l8.1 12.055-3.628 12.443-11.342 14.388-9.398 12.184-13.48 18.147-8.426 14.518.778 1.166 2.01-.194 30.46-6.481 16.462-2.982 19.637-3.37 8.88 4.148.971 4.213-3.5 8.62-20.998 5.184-24.628 4.926-36.682 8.685-.454.324.519.648 16.526 1.555 7.065.389h17.304l32.21 2.398 8.426 5.574 5.055 6.805-.843 5.184-12.962 6.611-17.498-4.148-40.83-9.721-14-3.5h-1.944v1.167l11.666 11.406 21.387 19.314 26.767 24.887 1.36 6.157-3.434 4.86-3.63-.518-23.526-17.693-9.073-7.972-20.545-17.304h-1.36v1.814l4.73 6.935 25.017 37.59 1.296 11.536-1.814 3.76-6.481 2.268-7.13-1.297-14.647-20.544-15.1-23.138-12.185-20.739-1.49.843-7.194 77.448-3.37 3.953-7.778 2.981-6.48-4.925-3.436-7.972 3.435-15.749 4.148-20.544 3.37-16.333 3.046-20.285 1.815-6.74-.13-.454-1.49.194-15.295 20.999-23.267 31.433-18.406 19.702-4.407 1.75-7.648-3.954.713-7.064 4.277-6.286 25.47-32.405 15.36-20.092 9.917-11.6-.065-1.686h-.583L44.07 198.125l-12.055 1.555-5.185-4.86.648-7.972 2.463-2.593 20.35-13.999-.064.065Z" />
    </svg>
  )
}

export function OpenAI({ size = 16, width, height, style }: IconProps) {
  return (
    <svg aria-hidden viewBox="100 100 411 411" width={width ?? size} height={height ?? size} fill="currentColor" preserveAspectRatio="xMidYMid" style={{ display: 'block', flexShrink: 0, ...style }}>
      <path fillRule="evenodd" clipRule="evenodd" d="M252.794 108.802C289.191 99.0484 326.265 110.305 351.148 135.135C385.113 126.072 422.85 134.862 449.492 161.505C476.136 188.149 484.925 225.888 475.862 259.85V259.854C500.696 284.735 511.95 321.81 502.198 358.207C492.447 394.602 464.161 421.084 430.215 430.217C421.083 464.162 394.603 492.448 358.206 502.199C321.812 511.951 284.734 500.693 259.852 475.864C225.887 484.927 188.15 476.137 161.507 449.495C134.864 422.851 126.073 385.111 135.136 351.149C110.304 326.266 99.0496 289.192 108.801 252.795C118.552 216.4 146.84 189.918 180.784 180.785C189.917 146.841 216.396 118.553 252.794 108.802ZM374.292 407.145C374.292 411.271 372.092 415.086 368.517 417.148L283.723 466.102C302.487 480.585 327.555 486.459 352.217 479.852C386.997 470.532 410.068 439.312 410.555 405.006V317.717C410.555 315.08 409.125 312.621 406.843 311.303L374.292 292.509V407.145ZM251.868 415.897C248.296 417.959 243.893 417.959 240.317 415.897L155.526 366.942C152.366 390.436 159.811 415.08 177.866 433.136H177.863C203.325 458.594 241.896 462.962 271.85 446.232L347.449 402.586C349.735 401.268 351.148 398.8 351.148 396.163V358.579L251.868 415.897ZM368.602 220.628C366.319 219.309 363.474 219.318 361.191 220.637L328.641 239.431L427.921 296.749C431.496 298.811 433.697 302.627 433.697 306.752V404.661C455.622 395.654 473.244 376.881 479.851 352.218C489.169 317.442 473.668 281.85 444.201 264.274L368.602 220.628ZM177.303 206.34C155.377 215.348 137.756 234.122 131.148 258.783C121.832 293.561 137.331 329.153 166.799 346.727L242.398 390.373C244.68 391.692 247.525 391.684 249.807 390.366L282.357 371.572L183.078 314.253C179.504 312.189 177.303 308.375 177.303 304.251V206.34ZM259.849 279.145V331.858L305.5 358.213L351.15 331.858V279.145L305.5 252.789L259.849 279.145ZM327.276 144.9C308.512 130.418 283.445 124.543 258.782 131.15C224.002 140.471 200.931 171.691 200.445 205.995V293.286C200.445 295.923 201.875 298.381 204.158 299.7L236.707 318.493V203.856C236.707 199.731 238.909 195.916 242.483 193.853L327.276 144.9ZM433.137 177.867C407.675 152.407 369.103 148.038 339.149 164.769L263.55 208.415C261.265 209.734 259.852 212.202 259.852 214.838V252.423L359.132 195.105C362.703 193.041 367.108 193.041 370.682 195.105L455.473 244.06C458.635 220.567 451.189 195.922 433.135 177.867H433.137Z" />
    </svg>
  )
}

