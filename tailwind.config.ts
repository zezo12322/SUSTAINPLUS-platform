import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1e6b3f',
          dark: '#14502e',
          light: '#2d9b5a',
          50: '#f0faf4',
          100: '#dcf3e6',
          200: '#bbe7ce',
          300: '#87d4ab',
          400: '#4db97f',
          500: '#2d9b5a',
          600: '#1e6b3f',
          700: '#14502e',
          800: '#103f24',
          900: '#0d341e',
        },
        accent: {
          DEFAULT: '#f0a500',
          dark: '#c98a00',
          light: '#f5bc40',
        },
        sp: {
          bg: '#ffffff',
          'bg-secondary': '#f4f8f5',
          'bg-card': '#ffffff',
          text: '#1a1a1a',
          'text-secondary': '#555555',
          'text-muted': '#888888',
          border: '#e0e0e0',
          footer: '#0f3d22',
        },
      },
      fontFamily: {
        cairo: ['Cairo', 'Noto Sans Arabic', 'sans-serif'],
        sans: ['Segoe UI', 'system-ui', '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        'sp': '0.5rem',
      },
    },
  },
  plugins: [],
}

export default config
