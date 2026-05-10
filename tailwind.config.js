/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        shadow: {
          950: '#020008',
          900: '#06000f',
          800: '#0d0020',
          700: '#150030',
        },
        purple: {
          400: '#c084fc',
          500: '#a855f7',
          600: '#8B5CF6',
          700: '#7c3aed',
        },
        cyan: {
          400: '#22D3EE',
          500: '#06b6d4',
        },
        neon: {
          purple: '#8B5CF6',
          cyan: '#22D3EE',
          pink: '#ec4899',
          green: '#10b981',
        }
      },
      fontFamily: {
        display: ['"Rajdhani"', 'sans-serif'],
        body: ['"Exo 2"', 'sans-serif'],
        mono: ['"Share Tech Mono"', 'monospace'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
        'aurora': 'aurora 8s ease infinite',
        'particle': 'particle 20s linear infinite',
        'scan': 'scan 3s linear infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'spin-slow': 'spin 8s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 20px #8B5CF6, 0 0 40px #8B5CF660' },
          '50%': { boxShadow: '0 0 40px #8B5CF6, 0 0 80px #8B5CF680, 0 0 120px #8B5CF640' },
        },
        aurora: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}
