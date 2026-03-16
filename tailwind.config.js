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
        // White + Wood Cooler Aesthetic (primary)
        stone: {
          50: '#F9F9F8',
          100: '#F3F3F1',
          200: '#EBEBE8',
          300: '#E2E2DE',
          400: '#D4D4CF',
        },
        charcoal: '#1C1C1C',
        'charcoal-light': '#2A2A2A',
        oak: '#8B7355',
        'oak-light': '#A0826D',
        ash: {
          DEFAULT: '#A8A39D',
          light: '#C4BFB8',
          warm: '#B8A99A',
        },
        // Legacy / accents
        sand: '#D9C7B8',
        clay: '#B66E41',
        'clay-dark': '#9A5A33',
        forest: '#3F5E45',
        'forest-light': '#4E7356',
        cream: '#F4EFEA',
        'cream-dark': '#EBE3DB',
        darkwood: '#4A2F21',
        'darkwood-light': '#5C3A2A',
        warm: {
          50: '#FAF7F4',
          100: '#F4EFEA',
          200: '#E8DFD5',
          300: '#D9C7B8',
          400: '#C4A88E',
          500: '#B66E41',
          600: '#9A5A33',
          700: '#4A2F21',
          800: '#3D2619',
          900: '#2E1C12',
          950: '#1C110B',
        },
        'dark-bg': '#1A1210',
        'dark-card': '#241C18',
        'dark-border': '#3A2E27',
        'dark-surface': '#2E2420',
      },
      fontFamily: {
        sans: ['DM Sans', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Playfair Display', 'Outfit', 'DM Sans', 'serif'],
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '30': '7.5rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-in-right': 'slideInRight 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [],
}
