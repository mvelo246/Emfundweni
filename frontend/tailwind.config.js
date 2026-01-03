/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#B0E0E6',
        'primary-dark': '#87CEEB',
        'primary-light': '#E0F7FA',
        secondary: '#4682B4',
        accent: '#00CED1',
      },
    },
  },
  plugins: [],
}

