/**
 * no3y Code's sidebar glyphs, copied out of the running app's DOM rather than
 * redrawn — see No3ySidebar.tsx. The app routes most of them through a shim
 * that keeps lucide's names over Phosphor's duotone paths (the 20% tint path
 * behind the solid one), so they are not the portfolio's own `@phosphor-icons`
 * set at its default weight, and a few (the provider marks, the pixel logo) are
 * not Phosphor at all. Each takes the box it is drawn in; colour rides
 * `currentColor` except where the app hard-codes a fill.
 */
import type { CSSProperties } from 'react'

type IconProps = { size?: number; width?: number; height?: number; style?: CSSProperties }

export function PanelLeft({ size = 16, width, height, style }: IconProps) {
  return (
    <svg aria-hidden viewBox="0 0 256 256" width={width ?? size} height={height ?? size} fill="currentColor"  style={{ display: 'block', flexShrink: 0, ...style }}>
      <path d="M88,48V208H40a8,8,0,0,1-8-8V56a8,8,0,0,1,8-8Z" opacity="0.2" /><path d="M216,40H40A16,16,0,0,0,24,56V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40ZM40,56H80V200H40ZM216,200H96V56H216V200Z" />
    </svg>
  )
}

export function Search({ size = 16, width, height, style }: IconProps) {
  return (
    <svg aria-hidden viewBox="0 0 256 256" width={width ?? size} height={height ?? size} fill="currentColor"  style={{ display: 'block', flexShrink: 0, ...style }}>
      <path d="M192,112a80,80,0,1,1-80-80A80,80,0,0,1,192,112Z" opacity="0.2" /><path d="M229.66,218.34,179.6,168.28a88.21,88.21,0,1,0-11.32,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z" />
    </svg>
  )
}

export function NavigationArrow({ size = 16, width, height, style }: IconProps) {
  return (
    <svg aria-hidden viewBox="0 0 256 256" width={width ?? size} height={height ?? size} fill="currentColor"  style={{ display: 'block', flexShrink: 0, ...style }}>
      <path d="M234.35,129,152,152,129,234.35a8,8,0,0,1-15.21.27l-65.28-176A8,8,0,0,1,58.63,48.46l176,65.28A8,8,0,0,1,234.35,129Z" opacity="0.2" /><path d="M237.33,106.21,61.41,41l-.16-.05A16,16,0,0,0,40.9,61.25a1,1,0,0,0,.05.16l65.26,175.92A15.77,15.77,0,0,0,121.28,248h.3a15.77,15.77,0,0,0,15-11.29l.06-.2,21.84-78,78-21.84.2-.06a16,16,0,0,0,.62-30.38ZM149.84,144.3a8,8,0,0,0-5.54,5.54L121.3,232l-.06-.17L56,56l175.82,65.22.16.06Z" />
    </svg>
  )
}

export function FolderPlus({ size = 16, width, height, style }: IconProps) {
  return (
    <svg aria-hidden viewBox="0 0 256 256" width={width ?? size} height={height ?? size} fill="currentColor"  style={{ display: 'block', flexShrink: 0, ...style }}>
      <path d="M128,80H32V56a8,8,0,0,1,8-8H92.69a8,8,0,0,1,5.65,2.34Z" opacity="0.2" /><path d="M216,72H131.31L104,44.69A15.86,15.86,0,0,0,92.69,40H40A16,16,0,0,0,24,56V200.62A15.4,15.4,0,0,0,39.38,216H216.89A15.13,15.13,0,0,0,232,200.89V88A16,16,0,0,0,216,72ZM92.69,56l16,16H40V56ZM216,200H40V88H216Zm-88-88a8,8,0,0,1,8,8v16h16a8,8,0,0,1,0,16H136v16a8,8,0,0,1-16,0V152H104a8,8,0,0,1,0-16h16V120A8,8,0,0,1,128,112Z" />
    </svg>
  )
}

export function ChartDonut({ size = 16, width, height, style }: IconProps) {
  return (
    <svg aria-hidden viewBox="0 0 256 256" width={width ?? size} height={height ?? size} fill="currentColor"  style={{ display: 'block', flexShrink: 0, ...style }}>
      <path d="M224,128a96,96,0,0,1-96,96V168a40,40,0,0,0,0-80V32A96,96,0,0,1,224,128Z" opacity="0.2" /><path d="M128,24a8,8,0,0,0-8,8V88a8,8,0,0,0,8,8,32,32,0,1,1-27.72,16,8,8,0,0,0-2.93-10.93l-48.5-28A8,8,0,0,0,37.92,76,104,104,0,1,0,128,24ZM48.09,91.1,83,111.26A48.09,48.09,0,0,0,80,128c0,1.53.08,3,.22,4.52L41.28,143A88.16,88.16,0,0,1,48.09,91.1Zm-2.67,67.31,39-10.44A48.1,48.1,0,0,0,120,175.32v40.31A88.2,88.2,0,0,1,45.42,158.41ZM136,215.63V175.32a48,48,0,0,0,0-94.65V40.36a88,88,0,0,1,0,175.27Z" />
    </svg>
  )
}

export function Zap({ size = 16, width, height, style }: IconProps) {
  return (
    <svg aria-hidden viewBox="0 0 256 256" width={width ?? size} height={height ?? size} fill="currentColor"  style={{ display: 'block', flexShrink: 0, ...style }}>
      <path d="M96,240l16-80L48,136,160,16,144,96l64,24Z" opacity="0.2" /><path d="M215.79,118.17a8,8,0,0,0-5-5.66L153.18,90.9l14.66-73.33a8,8,0,0,0-13.69-7l-112,120a8,8,0,0,0,3,13l57.63,21.61L88.16,238.43a8,8,0,0,0,13.69,7l112-120A8,8,0,0,0,215.79,118.17ZM109.37,214l10.47-52.38a8,8,0,0,0-5-9.06L62,132.71l84.62-90.66L136.16,94.43a8,8,0,0,0,5,9.06l52.8,19.8Z" />
    </svg>
  )
}

export function ArrowUpDown({ size = 16, width, height, style }: IconProps) {
  return (
    <svg aria-hidden viewBox="0 0 256 256" width={width ?? size} height={height ?? size} fill="currentColor"  style={{ display: 'block', flexShrink: 0, ...style }}>
      <path d="M117.66,170.34a8,8,0,0,1,0,11.32l-32,32a8,8,0,0,1-11.32,0l-32-32a8,8,0,0,1,11.32-11.32L72,188.69V48a8,8,0,0,1,16,0V188.69l18.34-18.35A8,8,0,0,1,117.66,170.34Zm96-96-32-32a8,8,0,0,0-11.32,0l-32,32a8,8,0,0,0,11.32,11.32L168,67.31V208a8,8,0,0,0,16,0V67.31l18.34,18.35a8,8,0,0,0,11.32-11.32Z" />
    </svg>
  )
}

export function Settings({ size = 16, width, height, style }: IconProps) {
  return (
    <svg aria-hidden viewBox="0 0 256 256" width={width ?? size} height={height ?? size} fill="currentColor"  style={{ display: 'block', flexShrink: 0, ...style }}>
      <path d="M207.86,123.18l16.78-21a99.14,99.14,0,0,0-10.07-24.29l-26.7-3a81,81,0,0,0-6.81-6.81l-3-26.71a99.43,99.43,0,0,0-24.3-10l-21,16.77a81.59,81.59,0,0,0-9.64,0l-21-16.78A99.14,99.14,0,0,0,77.91,41.43l-3,26.7a81,81,0,0,0-6.81,6.81l-26.71,3a99.43,99.43,0,0,0-10,24.3l16.77,21a81.59,81.59,0,0,0,0,9.64l-16.78,21a99.14,99.14,0,0,0,10.07,24.29l26.7,3a81,81,0,0,0,6.81,6.81l3,26.71a99.43,99.43,0,0,0,24.3,10l21-16.77a81.59,81.59,0,0,0,9.64,0l21,16.78a99.14,99.14,0,0,0,24.29-10.07l3-26.7a81,81,0,0,0,6.81-6.81l26.71-3a99.43,99.43,0,0,0,10-24.3l-16.77-21A81.59,81.59,0,0,0,207.86,123.18ZM128,168a40,40,0,1,1,40-40A40,40,0,0,1,128,168Z" opacity="0.2" /><path d="M128,80a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160Zm88-29.84q.06-2.16,0-4.32l14.92-18.64a8,8,0,0,0,1.48-7.06,107.6,107.6,0,0,0-10.88-26.25,8,8,0,0,0-6-3.93l-23.72-2.64q-1.48-1.56-3-3L186,40.54a8,8,0,0,0-3.94-6,107.29,107.29,0,0,0-26.25-10.86,8,8,0,0,0-7.06,1.48L130.16,40Q128,40,125.84,40L107.2,25.11a8,8,0,0,0-7.06-1.48A107.6,107.6,0,0,0,73.89,34.51a8,8,0,0,0-3.93,6L67.32,64.27q-1.56,1.49-3,3L40.54,70a8,8,0,0,0-6,3.94,107.71,107.71,0,0,0-10.87,26.25,8,8,0,0,0,1.49,7.06L40,125.84Q40,128,40,130.16L25.11,148.8a8,8,0,0,0-1.48,7.06,107.6,107.6,0,0,0,10.88,26.25,8,8,0,0,0,6,3.93l23.72,2.64q1.49,1.56,3,3L70,215.46a8,8,0,0,0,3.94,6,107.71,107.71,0,0,0,26.25,10.87,8,8,0,0,0,7.06-1.49L125.84,216q2.16.06,4.32,0l18.64,14.92a8,8,0,0,0,7.06,1.48,107.21,107.21,0,0,0,26.25-10.88,8,8,0,0,0,3.93-6l2.64-23.72q1.56-1.48,3-3L215.46,186a8,8,0,0,0,6-3.94,107.71,107.71,0,0,0,10.87-26.25,8,8,0,0,0-1.49-7.06Zm-16.1-6.5a73.93,73.93,0,0,1,0,8.68,8,8,0,0,0,1.74,5.48l14.19,17.73a91.57,91.57,0,0,1-6.23,15L187,173.11a8,8,0,0,0-5.1,2.64,74.11,74.11,0,0,1-6.14,6.14,8,8,0,0,0-2.64,5.1l-2.51,22.58a91.32,91.32,0,0,1-15,6.23l-17.74-14.19a8,8,0,0,0-5-1.75h-.48a73.93,73.93,0,0,1-8.68,0,8.06,8.06,0,0,0-5.48,1.74L100.45,215.8a91.57,91.57,0,0,1-15-6.23L82.89,187a8,8,0,0,0-2.64-5.1,74.11,74.11,0,0,1-6.14-6.14,8,8,0,0,0-5.1-2.64L46.43,170.6a91.32,91.32,0,0,1-6.23-15l14.19-17.74a8,8,0,0,0,1.74-5.48,73.93,73.93,0,0,1,0-8.68,8,8,0,0,0-1.74-5.48L40.2,100.45a91.57,91.57,0,0,1,6.23-15L69,82.89a8,8,0,0,0,5.1-2.64,74.11,74.11,0,0,1,6.14-6.14A8,8,0,0,0,82.89,69L85.4,46.43a91.32,91.32,0,0,1,15-6.23l17.74,14.19a8,8,0,0,0,5.48,1.74,73.93,73.93,0,0,1,8.68,0,8.06,8.06,0,0,0,5.48-1.74L155.55,40.2a91.57,91.57,0,0,1,15,6.23L173.11,69a8,8,0,0,0,2.64,5.1,74.11,74.11,0,0,1,6.14,6.14,8,8,0,0,0,5.1,2.64l22.58,2.51a91.32,91.32,0,0,1,6.23,15l-14.19,17.74A8,8,0,0,0,199.87,123.66Z" />
    </svg>
  )
}

export function PinOff({ size = 16, width, height, style }: IconProps) {
  return (
    <svg aria-hidden viewBox="0 0 256 256" width={width ?? size} height={height ?? size} fill="currentColor"  style={{ display: 'block', flexShrink: 0, ...style }}>
      <path d="M229.66,98.34,172.39,155.8c11.46,22.93-1.72,45.86-10.11,57a8,8,0,0,1-12,.83L42.34,105.76A8,8,0,0,1,43,93.85c29.65-23.92,57.4-10,57.4-10l57.27-57.46a8,8,0,0,1,11.31,0L229.66,87A8,8,0,0,1,229.66,98.34Z" opacity="0.2" /><path d="M53.92,34.62A8,8,0,1,0,42.08,45.38L67.37,73.2A69.82,69.82,0,0,0,38,87.63a16,16,0,0,0-1.29,23.78L85,159.71,42.34,202.34a8,8,0,0,0,11.32,11.32L96.29,171l48.29,48.29A16,16,0,0,0,155.9,224c.38,0,.75,0,1.13,0a15.93,15.93,0,0,0,11.64-6.33,89.75,89.75,0,0,0,11.58-20.27l21.84,24a8,8,0,1,0,11.84-10.76ZM155.9,208,48,100.08C58.23,91.83,69.2,87.72,80.66,87.81l87.16,95.88C165.59,193.56,160.24,202.23,155.9,208Zm79.42-104-44.64,44.79a8,8,0,1,1-11.33-11.3L224,92.7,163.32,32,122.1,73.35a8,8,0,0,1-11.33-11.29L152,20.7a16,16,0,0,1,22.63,0l60.69,60.68A16,16,0,0,1,235.32,104Z" />
    </svg>
  )
}

export function Clock({ size = 16, width, height, style }: IconProps) {
  return (
    <svg aria-hidden viewBox="0 0 256 256" width={width ?? size} height={height ?? size} fill="currentColor"  style={{ display: 'block', flexShrink: 0, ...style }}>
      <path d="M224,128a96,96,0,1,1-96-96A96,96,0,0,1,224,128Z" opacity="0.2" /><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm64-88a8,8,0,0,1-8,8H128a8,8,0,0,1-8-8V72a8,8,0,0,1,16,0v48h48A8,8,0,0,1,192,128Z" />
    </svg>
  )
}

export function Check({ size = 16, width, height, style }: IconProps) {
  return (
    <svg aria-hidden viewBox="0 0 256 256" width={width ?? size} height={height ?? size} fill="currentColor"  style={{ display: 'block', flexShrink: 0, ...style }}>
      <path d="M232.49,80.49l-128,128a12,12,0,0,1-17,0l-56-56a12,12,0,1,1,17-17L96,183,215.51,63.51a12,12,0,0,1,17,17Z" />
    </svg>
  )
}

export function Pin({ size = 16, width, height, style }: IconProps) {
  return (
    <svg aria-hidden viewBox="0 0 256 256" width={width ?? size} height={height ?? size} fill="currentColor"  style={{ display: 'block', flexShrink: 0, ...style }}>
      <path d="M229.66,98.34,172.39,155.8c11.46,22.93-1.72,45.86-10.11,57a8,8,0,0,1-12,.83L42.34,105.76A8,8,0,0,1,43,93.85c29.65-23.92,57.4-10,57.4-10l57.27-57.46a8,8,0,0,1,11.31,0L229.66,87A8,8,0,0,1,229.66,98.34Z" opacity="0.2" /><path d="M235.32,81.37,174.63,20.69a16,16,0,0,0-22.63,0L98.37,74.49c-10.66-3.34-35-7.37-60.4,13.14a16,16,0,0,0-1.29,23.78L85,159.71,42.34,202.34a8,8,0,0,0,11.32,11.32L96.29,171l48.29,48.29A16,16,0,0,0,155.9,224c.38,0,.75,0,1.13,0a15.93,15.93,0,0,0,11.64-6.33c19.64-26.1,17.75-47.32,13.19-60L235.33,104A16,16,0,0,0,235.32,81.37ZM224,92.69h0l-57.27,57.46a8,8,0,0,0-1.49,9.22c9.46,18.93-1.8,38.59-9.34,48.62L48,100.08c12.08-9.74,23.64-12.31,32.48-12.31A40.13,40.13,0,0,1,96.81,91a8,8,0,0,0,9.25-1.51L163.32,32,224,92.68Z" />
    </svg>
  )
}

export function Laptop({ size = 16, width, height, style }: IconProps) {
  return (
    <svg aria-hidden viewBox="0 0 256 256" width={width ?? size} height={height ?? size} fill="currentColor"  style={{ display: 'block', flexShrink: 0, ...style }}>
      <path d="M216,72V176H40V72A16,16,0,0,1,56,56H200A16,16,0,0,1,216,72Z" opacity="0.2" /><path d="M232,168h-8V72a24,24,0,0,0-24-24H56A24,24,0,0,0,32,72v96H24a8,8,0,0,0-8,8v16a24,24,0,0,0,24,24H216a24,24,0,0,0,24-24V176A8,8,0,0,0,232,168ZM48,72a8,8,0,0,1,8-8H200a8,8,0,0,1,8,8v96H48ZM224,192a8,8,0,0,1-8,8H40a8,8,0,0,1-8-8v-8H224ZM152,88a8,8,0,0,1-8,8H112a8,8,0,0,1,0-16h32A8,8,0,0,1,152,88Z" />
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

export function GitMerge({ size = 16, width, height, style }: IconProps) {
  return (
    <svg aria-hidden viewBox="0 0 256 256" width={width ?? size} height={height ?? size} fill="currentColor"  style={{ display: 'block', flexShrink: 0, ...style }}>
      <path d="M104,56A24,24,0,1,1,80,32,24,24,0,0,1,104,56Z" opacity="0.2" /><path d="M208,112a32.05,32.05,0,0,0-30.69,23l-42.21-6a8,8,0,0,1-4.95-2.71L94.43,84.55A32,32,0,1,0,72,87v82a32,32,0,1,0,16,0V101.63l30,35a24,24,0,0,0,14.83,8.14l44,6.28A32,32,0,1,0,208,112ZM64,56A16,16,0,1,1,80,72,16,16,0,0,1,64,56ZM96,200a16,16,0,1,1-16-16A16,16,0,0,1,96,200Zm112-40a16,16,0,1,1,16-16A16,16,0,0,1,208,160Z" />
    </svg>
  )
}

export function GitPullRequest({ size = 16, width, height, style }: IconProps) {
  return (
    <svg aria-hidden viewBox="0 0 256 256" width={width ?? size} height={height ?? size} fill="currentColor"  style={{ display: 'block', flexShrink: 0, ...style }}>
      <path d="M96,64A24,24,0,1,1,72,40,24,24,0,0,1,96,64ZM200,168a24,24,0,1,0,24,24A24,24,0,0,0,200,168Z" opacity="0.2" /><path d="M104,64A32,32,0,1,0,64,95v66a32,32,0,1,0,16,0V95A32.06,32.06,0,0,0,104,64ZM56,64A16,16,0,1,1,72,80,16,16,0,0,1,56,64ZM88,192a16,16,0,1,1-16-16A16,16,0,0,1,88,192Zm120-31V110.63a23.85,23.85,0,0,0-7-17L163.31,56H192a8,8,0,0,0,0-16H144a8,8,0,0,0-8,8V96a8,8,0,0,0,16,0V67.31L189.66,105a8,8,0,0,1,2.34,5.66V161a32,32,0,1,0,16,0Zm-8,47a16,16,0,1,1,16-16A16,16,0,0,1,200,208Z" />
    </svg>
  )
}

export function GitPullRequestDraft({ size = 16, width, height, style }: IconProps) {
  return (
    <svg aria-hidden viewBox="0 0 256 256" width={width ?? size} height={height ?? size} fill="currentColor"  style={{ display: 'block', flexShrink: 0, ...style }}>
      <path d="M224,128a96,96,0,1,1-96-96A96,96,0,0,1,224,128Z" opacity="0.2" /><path d="M96.26,37A8,8,0,0,1,102,27.29a104.11,104.11,0,0,1,52,0,8,8,0,0,1-2,15.75,8.15,8.15,0,0,1-2-.26,88.09,88.09,0,0,0-44,0A8,8,0,0,1,96.26,37ZM53.79,55.14a104,104,0,0,0-26,45,8,8,0,1,0,15.42,4.26,87.91,87.91,0,0,1,22-38.08A8,8,0,0,0,53.79,55.14ZM43.21,151.55a8,8,0,1,0-15.42,4.28,104,104,0,0,0,26,45,8,8,0,1,0,11.41-11.21A88.14,88.14,0,0,1,43.21,151.55ZM150,213.22a88,88,0,0,1-44,0,8,8,0,1,0-4,15.49,104.11,104.11,0,0,0,52,0,8,8,0,0,0-4-15.49ZM222.65,146a8,8,0,0,0-9.85,5.57,87.88,87.88,0,0,1-22,38.09,8,8,0,1,0,11.42,11.21,104.05,104.05,0,0,0,26-45A8,8,0,0,0,222.65,146Zm-9.86-41.54a8,8,0,0,0,15.42-4.28,104,104,0,0,0-26-45,8,8,0,1,0-11.41,11.21A88.14,88.14,0,0,1,212.79,104.45Z" />
    </svg>
  )
}

export function FolderOpen({ size = 16, width, height, style }: IconProps) {
  return (
    <svg aria-hidden viewBox="0 0 256 256" width={width ?? size} height={height ?? size} fill="currentColor"  style={{ display: 'block', flexShrink: 0, ...style }}>
      <path d="M208,88v24H69.77a8,8,0,0,0-7.59,5.47L32,208V64a8,8,0,0,1,8-8H93.33a8,8,0,0,1,4.8,1.6L128,80h72A8,8,0,0,1,208,88Z" opacity="0.2" /><path d="M245,110.64A16,16,0,0,0,232,104H216V88a16,16,0,0,0-16-16H130.67L102.94,51.2a16.14,16.14,0,0,0-9.6-3.2H40A16,16,0,0,0,24,64V208a8,8,0,0,0,8,8H211.1a8,8,0,0,0,7.59-5.47l28.49-85.47A16.05,16.05,0,0,0,245,110.64ZM93.34,64,123.2,86.4A8,8,0,0,0,128,88h72v16H69.77a16,16,0,0,0-15.18,10.94L40,158.7V64Zm112,136H43.1l26.67-80H232Z" />
    </svg>
  )
}

export function FolderClosed({ size = 16, width, height, style }: IconProps) {
  return (
    <svg aria-hidden viewBox="0 0 256 256" width={width ?? size} height={height ?? size} fill="currentColor"  style={{ display: 'block', flexShrink: 0, ...style }}>
      <path d="M128,80H32V56a8,8,0,0,1,8-8H92.69a8,8,0,0,1,5.65,2.34Z" opacity="0.2" /><path d="M216,72H131.31L104,44.69A15.86,15.86,0,0,0,92.69,40H40A16,16,0,0,0,24,56V200.62A15.4,15.4,0,0,0,39.38,216H216.89A15.13,15.13,0,0,0,232,200.89V88A16,16,0,0,0,216,72ZM92.69,56l16,16H40V56ZM216,200H40V88H216Z" />
    </svg>
  )
}

export function ChevronDown({ size = 16, width, height, style }: IconProps) {
  return (
    <svg aria-hidden viewBox="0 0 256 256" width={width ?? size} height={height ?? size} fill="currentColor"  style={{ display: 'block', flexShrink: 0, ...style }}>
      <path d="M216.49,104.49l-80,80a12,12,0,0,1-17,0l-80-80a12,12,0,0,1,17-17L128,159l71.51-71.52a12,12,0,0,1,17,17Z" />
    </svg>
  )
}

export function EllipsisVertical({ size = 16, width, height, style }: IconProps) {
  return (
    <svg aria-hidden viewBox="0 0 256 256" width={width ?? size} height={height ?? size} fill="currentColor"  style={{ display: 'block', flexShrink: 0, ...style }}>
      <path d="M112,60a16,16,0,1,1,16,16A16,16,0,0,1,112,60Zm16,52a16,16,0,1,0,16,16A16,16,0,0,0,128,112Zm0,68a16,16,0,1,0,16,16A16,16,0,0,0,128,180Z" />
    </svg>
  )
}

export function Plus({ size = 16, width, height, style }: IconProps) {
  return (
    <svg aria-hidden viewBox="0 0 256 256" width={width ?? size} height={height ?? size} fill="currentColor"  style={{ display: 'block', flexShrink: 0, ...style }}>
      <path d="M228,128a12,12,0,0,1-12,12H140v76a12,12,0,0,1-24,0V140H40a12,12,0,0,1,0-24h76V40a12,12,0,0,1,24,0v76h76A12,12,0,0,1,228,128Z" />
    </svg>
  )
}

export function CircleHalf({ size = 16, width, height, style }: IconProps) {
  return (
    <svg aria-hidden viewBox="0 0 256 256" width={width ?? size} height={height ?? size} fill="currentColor"  style={{ display: 'block', flexShrink: 0, ...style }}>
      <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24ZM40,128a88.1,88.1,0,0,1,88-88V216A88.1,88.1,0,0,1,40,128Z" />
    </svg>
  )
}

export function CircleAlertFill({ size = 16, width, height, style }: IconProps) {
  return (
    <svg aria-hidden viewBox="0 0 256 256" width={width ?? size} height={height ?? size} fill="currentColor"  style={{ display: 'block', flexShrink: 0, ...style }}>
      <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm-8,56a8,8,0,0,1,16,0v56a8,8,0,0,1-16,0Zm8,104a12,12,0,1,1,12-12A12,12,0,0,1,128,184Z" />
    </svg>
  )
}

export function AlarmClock({ size = 16, width, height, style }: IconProps) {
  return (
    <svg aria-hidden viewBox="0 0 256 256" width={width ?? size} height={height ?? size} fill="currentColor"  style={{ display: 'block', flexShrink: 0, ...style }}>
      <path d="M216,136a88,88,0,1,1-88-88A88,88,0,0,1,216,136Z" opacity="0.2" /><path d="M128,40a96,96,0,1,0,96,96A96.11,96.11,0,0,0,128,40Zm0,176a80,80,0,1,1,80-80A80.09,80.09,0,0,1,128,216ZM61.66,37.66l-32,32A8,8,0,0,1,18.34,58.34l32-32A8,8,0,0,1,61.66,37.66Zm176,32a8,8,0,0,1-11.32,0l-32-32a8,8,0,0,1,11.32-11.32l32,32A8,8,0,0,1,237.66,69.66ZM184,128a8,8,0,0,1,0,16H128a8,8,0,0,1-8-8V80a8,8,0,0,1,16,0v48Z" />
    </svg>
  )
}

export function Folder({ size = 16, width, height, style }: IconProps) {
  return (
    <svg aria-hidden viewBox="0 0 256 256" width={width ?? size} height={height ?? size} fill="currentColor"  style={{ display: 'block', flexShrink: 0, ...style }}>
      <path d="M128,80H32V56a8,8,0,0,1,8-8H92.69a8,8,0,0,1,5.65,2.34Z" opacity="0.2" /><path d="M216,72H131.31L104,44.69A15.86,15.86,0,0,0,92.69,40H40A16,16,0,0,0,24,56V200.62A15.4,15.4,0,0,0,39.38,216H216.89A15.13,15.13,0,0,0,232,200.89V88A16,16,0,0,0,216,72ZM92.69,56l16,16H40V56ZM216,200H40V88H216Z" />
    </svg>
  )
}

export function CircleAlert({ size = 16, width, height, style }: IconProps) {
  return (
    <svg aria-hidden viewBox="0 0 256 256" width={width ?? size} height={height ?? size} fill="currentColor"  style={{ display: 'block', flexShrink: 0, ...style }}>
      <path d="M224,128a96,96,0,1,1-96-96A96,96,0,0,1,224,128Z" opacity="0.2" /><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm-8-80V80a8,8,0,0,1,16,0v56a8,8,0,0,1-16,0Zm20,36a12,12,0,1,1-12-12A12,12,0,0,1,140,172Z" />
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

export function BrandMark({ size = 16, width, height, style }: IconProps) {
  return (
    <svg aria-hidden viewBox="0 0 23 23" width={width ?? size} height={height ?? size} fill="currentColor" shapeRendering="crispEdges" style={{ display: 'block', flexShrink: 0, ...style }}>
      <g fill="#000000"><rect height="1" width="1" x="11" y="0" /><rect height="1" width="3" x="10" y="1" /><rect height="1" width="1" x="9" y="2" /><rect height="1" width="1" x="11" y="2" /><rect height="1" width="1" x="13" y="2" /><rect height="1" width="1" x="8" y="3" /><rect height="1" width="1" x="11" y="3" /><rect height="1" width="1" x="14" y="3" /><rect height="1" width="1" x="7" y="4" /><rect height="1" width="1" x="11" y="4" /><rect height="1" width="1" x="15" y="4" /><rect height="1" width="1" x="7" y="5" /><rect height="1" width="1" x="9" y="5" /><rect height="1" width="1" x="11" y="5" /><rect height="1" width="1" x="13" y="5" /><rect height="1" width="1" x="15" y="5" /><rect height="1" width="1" x="7" y="6" /><rect height="1" width="3" x="10" y="6" /><rect height="1" width="1" x="15" y="6" /><rect height="1" width="6" x="4" y="7" /><rect height="1" width="1" x="11" y="7" /><rect height="1" width="4" x="15" y="7" /><rect height="1" width="1" x="3" y="8" /><rect height="1" width="2" x="10" y="8" /><rect height="1" width="1" x="13" y="8" /><rect height="1" width="1" x="15" y="8" /><rect height="1" width="1" x="19" y="8" /><rect height="1" width="1" x="2" y="9" /><rect height="1" width="1" x="5" y="9" /><rect height="1" width="1" x="8" y="9" /><rect height="1" width="1" x="11" y="9" /><rect height="1" width="1" x="15" y="9" /><rect height="1" width="1" x="17" y="9" /><rect height="1" width="1" x="20" y="9" /><rect height="1" width="1" x="1" y="10" /><rect height="1" width="1" x="6" y="10" /><rect height="1" width="1" x="12" y="10" /><rect height="1" width="1" x="14" y="10" /><rect height="1" width="1" x="16" y="10" /><rect height="1" width="1" x="21" y="10" /><rect height="1" width="23" x="0" y="11" /><rect height="1" width="1" x="1" y="12" /><rect height="1" width="1" x="6" y="12" /><rect height="1" width="1" x="9" y="12" /><rect height="1" width="1" x="12" y="12" /><rect height="1" width="1" x="16" y="12" /><rect height="1" width="1" x="21" y="12" /><rect height="1" width="1" x="2" y="13" /><rect height="1" width="1" x="5" y="13" /><rect height="1" width="1" x="8" y="13" /><rect height="1" width="1" x="11" y="13" /><rect height="1" width="1" x="14" y="13" /><rect height="1" width="1" x="17" y="13" /><rect height="1" width="1" x="20" y="13" /><rect height="1" width="1" x="3" y="14" /><rect height="1" width="3" x="10" y="14" /><rect height="1" width="1" x="19" y="14" /><rect height="1" width="6" x="4" y="15" /><rect height="1" width="1" x="11" y="15" /><rect height="1" width="6" x="13" y="15" /><rect height="1" width="1" x="7" y="16" /><rect height="1" width="3" x="10" y="16" /><rect height="1" width="1" x="15" y="16" /><rect height="1" width="1" x="7" y="17" /><rect height="1" width="1" x="9" y="17" /><rect height="1" width="1" x="11" y="17" /><rect height="1" width="1" x="13" y="17" /><rect height="1" width="1" x="15" y="17" /><rect height="1" width="1" x="7" y="18" /><rect height="1" width="1" x="11" y="18" /><rect height="1" width="1" x="15" y="18" /><rect height="1" width="1" x="8" y="19" /><rect height="1" width="1" x="11" y="19" /><rect height="1" width="1" x="14" y="19" /><rect height="1" width="1" x="9" y="20" /><rect height="1" width="1" x="11" y="20" /><rect height="1" width="1" x="13" y="20" /><rect height="1" width="3" x="10" y="21" /><rect height="1" width="1" x="11" y="22" /></g><g fill="var(--fork-brand-mark-left, #008755)"><rect height="1" width="3" x="7" y="8" /><rect height="1" width="1" x="4" y="9" /><rect height="1" width="2" x="6" y="9" /><rect height="1" width="2" x="9" y="9" /><rect height="1" width="3" x="3" y="10" /><rect height="1" width="5" x="7" y="10" /><rect height="1" width="4" x="2" y="12" /><rect height="1" width="2" x="7" y="12" /><rect height="1" width="2" x="10" y="12" /><rect height="1" width="2" x="3" y="13" /><rect height="1" width="2" x="6" y="13" /><rect height="1" width="2" x="9" y="13" /><rect height="1" width="6" x="4" y="14" /></g><g fill="var(--fork-brand-mark-left-light, #08b776)"><rect height="1" width="3" x="4" y="8" /><rect height="1" width="1" x="3" y="9" /><rect height="1" width="1" x="2" y="10" /></g><g fill="var(--fork-brand-mark-top, #26b846)"><rect height="1" width="1" x="10" y="2" /><rect height="1" width="2" x="9" y="3" /><rect height="1" width="1" x="12" y="3" /><rect height="1" width="3" x="8" y="4" /><rect height="1" width="2" x="12" y="4" /><rect height="1" width="1" x="8" y="5" /><rect height="1" width="1" x="10" y="5" /><rect height="1" width="1" x="12" y="5" /><rect height="1" width="2" x="8" y="6" /><rect height="1" width="1" x="13" y="6" /><rect height="1" width="1" x="10" y="7" /><rect height="1" width="3" x="12" y="7" /><rect height="1" width="1" x="12" y="8" /><rect height="1" width="1" x="14" y="8" /><rect height="1" width="3" x="12" y="9" /><rect height="1" width="1" x="13" y="10" /></g><g fill="var(--fork-brand-mark-top-light, #3aed62)"><rect height="1" width="1" x="12" y="2" /><rect height="1" width="1" x="13" y="3" /><rect height="1" width="1" x="14" y="4" /><rect height="1" width="1" x="14" y="5" /><rect height="1" width="1" x="14" y="6" /></g><g fill="var(--fork-brand-mark-right, #f95b1c)"><rect height="1" width="3" x="16" y="8" /><rect height="1" width="1" x="16" y="9" /><rect height="1" width="2" x="18" y="9" /><rect height="1" width="1" x="15" y="10" /><rect height="1" width="4" x="17" y="10" /><rect height="1" width="3" x="13" y="12" /><rect height="1" width="3" x="17" y="12" /><rect height="1" width="2" x="12" y="13" /><rect height="1" width="2" x="15" y="13" /><rect height="1" width="1" x="18" y="13" /><rect height="1" width="3" x="13" y="14" /></g><g fill="var(--fork-brand-mark-bottom, #fcb01a)"><rect height="1" width="1" x="10" y="15" /><rect height="1" width="1" x="12" y="15" /><rect height="1" width="1" x="9" y="16" /><rect height="1" width="2" x="13" y="16" /><rect height="1" width="1" x="10" y="17" /><rect height="1" width="1" x="12" y="17" /><rect height="1" width="1" x="14" y="17" /><rect height="1" width="2" x="9" y="18" /><rect height="1" width="3" x="12" y="18" /><rect height="1" width="1" x="10" y="19" /><rect height="1" width="2" x="12" y="19" /><rect height="1" width="1" x="12" y="20" /></g><g fill="var(--fork-brand-mark-right-light, #ff8f0c)"><rect height="1" width="1" x="20" y="12" /><rect height="1" width="1" x="19" y="13" /><rect height="1" width="3" x="16" y="14" /></g><g fill="var(--fork-brand-mark-bottom-light, #ffd233)"><rect height="1" width="1" x="8" y="16" /><rect height="1" width="1" x="8" y="17" /><rect height="1" width="1" x="8" y="18" /><rect height="1" width="1" x="9" y="19" /><rect height="1" width="1" x="10" y="20" /></g>
    </svg>
  )
}

export function Wordmark({ size = 16, width, height, style }: IconProps) {
  return (
    <svg aria-hidden viewBox="0 0 13 3" width={width ?? size} height={height ?? size} fill="currentColor" shapeRendering="crispEdges" style={{ display: 'block', flexShrink: 0, ...style }}>
      <rect height="1" width="1" x="0" y="0" /><rect height="1" width="1" x="1" y="0" /><rect height="1" width="1" x="4" y="0" /><rect height="1" width="1" x="7" y="0" /><rect height="1" width="1" x="8" y="0" /><rect height="1" width="1" x="10" y="0" /><rect height="1" width="1" x="12" y="0" /><rect height="1" width="1" x="0" y="1" /><rect height="1" width="1" x="2" y="1" /><rect height="1" width="1" x="5" y="1" /><rect height="1" width="1" x="7" y="1" /><rect height="1" width="1" x="11" y="1" /><rect height="1" width="1" x="0" y="2" /><rect height="1" width="1" x="2" y="2" /><rect height="1" width="1" x="4" y="2" /><rect height="1" width="1" x="8" y="2" /><rect height="1" width="1" x="10" y="2" />
    </svg>
  )
}

