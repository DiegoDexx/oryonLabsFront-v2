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
        crm: {
          sidebar:  '#0B1A3E',
          active:   '#1A3268',
          muted:    '#8B98B5',
          label:    '#5C6B8A',
          page:     '#F7F9FC',
          accent:   '#1B86C9',
          border:   '#E5E9F2',
          text:     '#0B1220',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
