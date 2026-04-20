/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: { sans: ['Nunito', 'sans-serif'] },
      colors: {
        amber: { DEFAULT: '#F59E0B', dark: '#D97706', light: '#FEF3C7' },
        teal: { DEFAULT: '#5BC8D4', dark: '#0891B2' },
      },
    },
  },
  plugins: [],
}
