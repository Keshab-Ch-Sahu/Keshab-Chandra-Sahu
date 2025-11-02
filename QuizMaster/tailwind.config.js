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
        primary: {
          light: '#d76d77',
          DEFAULT: '#3a1c71',
          dark: '#2d1655'
        },
        secondary: {
          light: '#ffaf7b',
          DEFAULT: '#d76d77',
          dark: '#a85560'
        }
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(to right, #3a1c71, #d76d77, #ffaf7b)',
        'gradient-dark': 'linear-gradient(to right, #0f0c29, #302b63, #24243e)'
      }
    },
  },
  plugins: [],
}
