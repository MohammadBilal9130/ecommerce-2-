/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        gangster: {
          950: '#070707',
          900: '#0E0E0E',
          850: '#141414',
          800: '#1C1C1C',
          700: '#2A2A2A',
          600: '#3D3D3D',
          500: '#5A5A5A',
          red: {
            DEFAULT: '#DC2626',
            light: '#EF4444',
            dark: '#991B1B',
            glow: '#FF1F48'
          },
          gold: {
            DEFAULT: '#F59E0B',
            light: '#FBBF24',
            dark: '#B45309',
            glow: '#FFD700'
          }
        }
      },
      fontFamily: {
        display: ['"Cabinet Grotesk"', '"Syne"', '"Montserrat"', 'sans-serif'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'red-glow': '0 0 25px -5px rgba(220, 38, 38, 0.4)',
        'gold-glow': '0 0 25px -5px rgba(245, 158, 11, 0.4)',
        'card-dark': '0 10px 30px -10px rgba(0, 0, 0, 0.8)',
      },
      animation: {
        'pulse-fast': 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'marquee': 'marquee 25s linear infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        }
      }
    },
  },
  plugins: [],
}
