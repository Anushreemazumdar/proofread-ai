/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f5f7ff',
          100: '#ebf0fe',
          200: '#d6e0fd',
          300: '#b3c7fb',
          400: '#85a4f7',
          500: '#6380f2',
          600: '#475fe6',
          700: '#384acb',
          800: '#303da4',
          900: '#2c3782',
          950: '#1b214f',
        }
      }
    },
  },
  plugins: [],
}
