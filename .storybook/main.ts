import type { StorybookConfig } from '@storybook/react-vite'

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(ts|tsx)'],
  framework: { name: '@storybook/react-vite', options: {} },
  async viteFinal(config) {
    // `figmaCapture` in vite.config.ts injects a third-party script into the dev
    // server's HTML. That's for the app's /send-to-figma flow, not for Storybook.
    config.plugins = (config.plugins ?? []).filter(
      (plugin) =>
        !(plugin && typeof plugin === 'object' && 'name' in plugin && plugin.name === 'figma-capture-dev-only'),
    )
    return config
  },
}

export default config
