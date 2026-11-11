/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        vortex: {
          bg: '#0A0B0E',
          surface: '#101217',
          card: '#151821',
          hover: '#1D212D',
          border: '#252B3B',
          red: '#EF4444',
          redDark: '#DC2626',
          redDeep: '#991B1B',
          redGlow: '#F87171',
          primary: '#EF4444',
          accent: '#EF4444',
          text: '#F1F5F9',
          muted: '#94A3B8',
          amber: '#F59E0B',
          gold: '#F59E0B',
          cyan: '#06B6D4',
          emerald: '#10B981',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'Outfit', 'Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        'glow-red': '0 0 25px -2px rgba(239, 68, 68, 0.45)',
        'glow-crimson': '0 0 35px -2px rgba(220, 38, 38, 0.55)',
        'card-vortex': '0 10px 30px -5px rgba(0, 0, 0, 0.8), 0 0 1px 1px rgba(239, 68, 68, 0.1)',
      }
    },
  },
  plugins: [],
}
