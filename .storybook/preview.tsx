import type { Preview } from '@storybook/react-vite'
import { IconContext } from '@phosphor-icons/react'
import { ICON_DEFAULTS } from '../src/design-system/icons'
import '../src/index.css'

/**
 * Storybook renders on the site's own dark shell. Stories that document the
 * cream content column set their own surface locally.
 */
const preview: Preview = {
  parameters: {
    layout: 'fullscreen',
    controls: { expanded: true },
    backgrounds: { disable: true },
    options: {
      storySort: {
        order: ['Foundations', ['Colors', 'Typography', 'Spacing & Radius', 'Icons'], 'Components'],
      },
    },
  },
  decorators: [
    (Story) => (
      <IconContext.Provider value={ICON_DEFAULTS}>
        <div
          style={{
            minHeight: '100vh',
            padding: 'var(--space-4xl)',
            background: 'var(--color-bg-primary)',
            color: 'var(--color-text-primary)',
            fontFamily: "'Geist Variable', sans-serif",
            WebkitFontSmoothing: 'antialiased',
          }}
        >
          <Story />
        </div>
      </IconContext.Provider>
    ),
  ],
}

export default preview
