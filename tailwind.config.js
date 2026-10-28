/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Newsreader"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      colors: {
        paper: {
          DEFAULT: 'var(--bg-primary)',
          secondary: 'var(--bg-secondary)',
          elevated: 'var(--bg-elevated)',
          sunken: 'var(--bg-sunken)',
        },
        vault: {
          DEFAULT: 'var(--bg-vault)',
          light: 'var(--bg-vault-light)',
        },
        ink: {
          DEFAULT: 'var(--text-primary)',
          secondary: 'var(--text-secondary)',
          muted: 'var(--text-muted)',
        },
        bank: {
          DEFAULT: 'var(--accent-primary)',
          hover: 'var(--accent-primary-hover)',
          soft: 'var(--accent-primary-soft)',
        },
        bullion: {
          DEFAULT: 'var(--accent-secondary)',
          soft: 'var(--accent-secondary-soft)',
        },
        carmine: {
          DEFAULT: 'var(--semantic-danger)',
          soft: 'var(--semantic-danger-soft)',
        },
        rule: {
          DEFAULT: 'var(--border-hairline)',
          strong: 'var(--border-strong)',
        }
      }
    },
  },
  plugins: [],
}
