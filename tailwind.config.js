/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#21808d',
        'bg-primary': '#1a1a1a',
        'bg-secondary': '#2d2d2d',
        'text-primary': '#ffffff',
        'text-secondary': '#b0b0b0'
      },
      screens: {
        xs: '360px',
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
      }
    }
  },
  plugins: [
  require('@tailwindcss/forms'),
  require('@tailwindcss/typography'),
  require('tailwindcss-3d') // tiny utility plug-in
]

};