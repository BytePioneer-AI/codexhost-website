/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './download/index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          '"SF Pro Display"',
          '-apple-system',
          'BlinkMacSystemFont',
          '"PingFang SC"',
          '"Hiragino Sans GB"',
          '"Microsoft YaHei"',
          'sans-serif',
        ],
        mono: [
          '"JetBrains Mono"',
          'ui-monospace',
          'SFMono-Regular',
          'Menlo',
          'Monaco',
          'Consolas',
          'monospace',
        ],
      },
      colors: {
        canvas: 'var(--canvas)',
        'canvas-subtle': 'var(--canvas-subtle)',
        'surface-card': 'var(--surface-card)',
        'surface-muted': 'var(--surface-muted)',
        ink: 'var(--ink)',
        'ink-secondary': 'var(--ink-secondary)',
        'ink-muted': 'var(--ink-muted)',
        hairline: 'var(--hairline)',
        'hairline-strong': 'var(--hairline-strong)',
        cta: 'var(--cta-bg)',
        'cta-ink': 'var(--cta-ink)',
        'cta-hover': 'var(--cta-hover)',
      },
      boxShadow: {
        subtle: '0 1px 2px rgba(0, 0, 0, 0.04)',
        'hero-window': '0 20px 60px -20px rgba(0, 0, 0, 0.08)',
      },
    },
  },
  plugins: [],
};
