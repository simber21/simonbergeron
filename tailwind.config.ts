import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        terminal: {
          bg: '#0d0d16',
          border: '#1e1e2e',
          green: '#00ff9f',
          dim: '#555555',
          muted: '#888888',
          text: '#c9d1d9',
        },
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'ui-monospace', 'monospace'],
      },
    },
  },
} satisfies Config
