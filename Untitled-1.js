/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Custom color palette for ClassCheck
        base: '#0f1117',     // main background
        card: '#1a1d24',     // raised surfaces
        brand: '#6366f1',    // accent/CTA color
        surface: '#1f2937',  // secondary surfaces
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
      },
      boxShadow: {
        'card': '0 10px 25px -5px rgba(0, 0, 0, 0.6)',
        'card-hover': '0 15px 35px -5px rgba(0, 0, 0, 0.7)',
        'inner-light': 'inset 0 1px 0 rgba(255, 255, 255, 0.1)',
        'glow': '0 0 20px rgba(99, 102, 241, 0.3)',
      },
      animation: {
        'blob': 'blob 7s infinite',
        'float': 'float 3s ease-in-out infinite',
        'shake': 'shake 0.4s ease-in-out',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
      },
      keyframes: {
        blob: {
          '0%': {
            transform: 'translate(0px, 0px) scale(1)',
          },
          '33%': {
            transform: 'translate(30px, -50px) scale(1.1)',
          },
          '66%': {
            transform: 'translate(-20px, 20px) scale(0.9)',
          },
          '100%': {
            transform: 'translate(0px, 0px) scale(1)',
          },
        },
        float: {
          '0%, 100%': {
            transform: 'translateY(0px)',
          },
          '50%': {
            transform: 'translateY(-10px)',
          },
        },
        shake: {
          '0%, 100%': {
            transform: 'translateX(0)',
          },
          '10%, 30%, 50%, 70%, 90%': {
            transform: 'translateX(-2px)',
          },
          '20%, 40%, 60%, 80%': {
            transform: 'translateX(2px)',
          },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      perspective: {
        '1000': '1000px',
        '1500': '1500px',
      },
      transformStyle: {
        'preserve-3d': 'preserve-3d',
      },
      rotate: {
        'x-3': 'rotateX(3deg)',
        'y-2': 'rotateY(2deg)',
        'x-6': 'rotateX(6deg)',
        'y-6': 'rotateY(6deg)',
      },
      scale: {
        '102': '1.02',
        '103': '1.03',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      zIndex: {
        '100': '100',
      },
      transitionProperty: {
        'height': 'height',
        'spacing': 'margin, padding',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    // Custom plugin for 3D transforms
    function({ addUtilities }) {
      const newUtilities = {
        '.perspective-1000': {
          perspective: '1000px',
        },
        '.perspective-1500': {
          perspective: '1500px',
        },
        '.preserve-3d': {
          transformStyle: 'preserve-3d',
        },
        '.rotate-x-3': {
          transform: 'rotateX(3deg)',
        },
        '.rotate-y-2': {
          transform: 'rotateY(2deg)',
        },
        '.rotate-x-6': {
          transform: 'rotateX(6deg)',
        },
        '.rotate-y-6': {
          transform: 'rotateY(6deg)',
        },
        '.transform-3d-pop': {
          transform: 'translateZ(60px)',
        },
        '.backface-hidden': {
          backfaceVisibility: 'hidden',
        },
        '.glass': {
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
        },
        '.glass-dark': {
          background: 'rgba(0, 0, 0, 0.3)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        },
      }
      addUtilities(newUtilities)
    },
  ],
}
