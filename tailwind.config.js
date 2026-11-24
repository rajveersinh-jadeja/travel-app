/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#EFEEEB',
        foreground: '#18181B',
        muted: {
          DEFAULT: '#F4F3F0',
          foreground: '#71717A',
        },
        canvas: '#EFEEEB',
        card: '#FFFFFF',
        charcoal: '#18181B',
        'charcoal-secondary': '#71717A',
        'charcoal-muted': '#A1A1AA',
        azure: {
          DEFAULT: '#1A94FF',
          light: '#E8F4FF',
          dark: '#0B76D8',
        },
        surface: {
          muted: '#F4F3F0',
          border: '#E5E4E0',
          line: '#ECEAE5',
        }
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"SF Pro Display"',
          '"SF Pro Text"',
          '"Segoe UI"',
          'Roboto',
          'sans-serif'
        ],
      },
      boxShadow: {
        'subtle': '0 2px 8px rgba(24, 24, 27, 0.06)',
        'elevated': '0 8px 24px -4px rgba(24, 24, 27, 0.10), 0 2px 6px -1px rgba(24, 24, 27, 0.04)',
        'pin': '0 4px 14px rgba(0, 0, 0, 0.16)',
        'floating': '0 12px 32px rgba(24, 24, 27, 0.12), 0 2px 8px rgba(24, 24, 27, 0.06)',
      },
      borderRadius: {
        'pin': '14px',
      }
    },
  },
  plugins: [],
}
