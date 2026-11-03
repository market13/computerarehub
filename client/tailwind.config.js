/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: '#1b2269',
          navyDark: '#121748',
          blue: '#2B38D1',
          blueLight: '#3b49e8',
          red: '#DD3842',
          redHover: '#c52832',
          gold: '#fdb800',
          bg: '#f8fafc',
          surface: '#ffffff',
          surfaceMuted: '#f1f5f9',
          border: '#e2e8f0',
          borderDark: '#cbd5e1',
          textDark: '#1e293b',
          textMuted: '#64748b',
          green: '#16a34a',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['"Bai Jamjuree"', 'sans-serif'],
        condensed: ['"Saira Condensed"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        'brand': '0 2px 10px rgba(27, 34, 105, 0.08)',
        'brand-hover': '0 8px 24px rgba(27, 34, 105, 0.14)',
        'card': '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
      }
    },
  },
  plugins: [],
}
