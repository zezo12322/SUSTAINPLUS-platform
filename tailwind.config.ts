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
        // Deep Navy — primary brand colour
        primary: {
          DEFAULT: '#0C1D32',
          dark: '#081320',
          light: '#16335C',
          50: '#f0f3f8',
          100: '#dbe2ee',
          200: '#bac8dd',
          300: '#8ba2c4',
          400: '#5a76a3',
          500: '#3a5685',
          600: '#284169',
          700: '#1c3052',
          800: '#142440',
          900: '#0C1D32',
        },
        // Premium Gold — accent
        gold: {
          DEFAULT: '#AF8443',
          dark: '#8f6a35',
          light: '#c8a368',
          50: '#faf6ef',
          100: '#f1e6d3',
          200: '#e3cba6',
          300: '#d2ac74',
          400: '#c0914f',
          500: '#AF8443',
          600: '#8f6a35',
          700: '#6d5129',
          800: '#4d391e',
          900: '#332615',
        },
        accent: {
          DEFAULT: '#AF8443',
          dark: '#8f6a35',
          light: '#c8a368',
        },
        sp: {
          bg: '#ffffff',
          'bg-secondary': '#f6f5f2',
          'bg-card': '#ffffff',
          text: '#0C1D32',
          'text-secondary': '#33383F',
          'text-muted': '#6b7280',
          border: '#e4e2dd',
          footer: '#0C1D32',
        },
      },
      fontFamily: {
        cairo: ['Cairo', 'Noto Sans Arabic', 'sans-serif'],
        montserrat: ['Montserrat', 'Segoe UI', 'system-ui', 'sans-serif'],
        sans: ['Montserrat', 'Segoe UI', 'system-ui', '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        'sp': '0.5rem',
      },
    },
  },
  plugins: [],
}

export default config
