/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dulzura: {
          cream: '#FFFBF5',
          rose: '#FCE7F0',
          pink: '#E88DA9',
          chocolate: '#3D231D',
          darkChoco: '#261512',
          gold: '#D4AF37',
          warmGray: '#F7F4EF',
          softRed: '#E65A5A'
        }
      },
      fontFamily: {
        sans: ['Manrope', 'Arial', 'sans-serif'],
        serif: ['Montserrat', 'Arial', 'sans-serif']
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideLeft: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        }
      },
      animation: {
        fadeIn: 'fadeIn 0.25s ease-out forwards',
        slideLeft: 'slideLeft 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      }
    },
  },
  plugins: [],
}
