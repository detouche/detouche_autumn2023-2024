/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        's-accent-25': '#FFF5E9',
        's-accent-50': '#FFEFDA',
        's-accent-100': '#F9E2C3',
        's-accent-150': '#F8D8AC',
        's-accent-250': '#F5B45A',
        's-accent-300': '#E99E36',
        's-accent-400': '#DB9027',
        's-accent-500': '#C98424',
        's-accent-900': '#AC7529',
        's-gray-25': '#F9F9F9',
        's-gray-50': '#F4F4F4',
        's-gray-100': '#F0F0F0',
        's-gray-150': '#E3E3E3',
        's-gray-200': '#C9CACD',
        's-gray-300': '#727477',
        's-gray-400': '#5C5F62',
        's-gray-500': '#48494C',
        's-gray-900': '#323232',
        's-green-100': '#74B78E',
        's-green-300': '#4AB073',
        's-green-400': '#319358',
        's-error-100': '#F78C8C',
        's-error-300': '#EC4646',
        's-error-400': '#EC4646',
        's-error-900': '#B12323',
      },
      boxShadow: {
        'accent3px': '0px 0px 0px 3px #F9E2C3'
      }
    },
  },
  plugins: [],
}

