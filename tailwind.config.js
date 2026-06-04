/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#060F27',
          light: '#0B1A3E',
          lighter: '#0E214A',
        },
        cyan: {
          DEFAULT: '#0090C9',
          medium: '#0284C7',
          dark: '#0369A1',
          light: '#38BDF8',
          pale: '#E0F2FE',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
