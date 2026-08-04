import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const FIGMA_CAPTURE_SRC = 'https://mcp.figma.com/mcp/html-to-design/capture.js'

/**
 * Loads Figma's html-to-design capture script, which backs the `/send-to-figma`
 * workflow. It's only useful against the dev server, so it's injected here rather
 * than sitting in `index.html` — that keeps a third-party script off the deployed
 * site instead of shipping it to every visitor.
 */
function figmaCapture(): Plugin {
  return {
    name: 'figma-capture-dev-only',
    apply: 'serve',
    transformIndexHtml: () => [
      { tag: 'script', attrs: { src: FIGMA_CAPTURE_SRC, async: true }, injectTo: 'head' },
    ],
  }
}

export default defineConfig({
  plugins: [figmaCapture(), react(), tailwindcss()],
})
