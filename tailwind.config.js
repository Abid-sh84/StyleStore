/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#2dd4bf', // teal-400
          DEFAULT: '#0d9488', // teal-600
          dark: '#0f766e', // teal-700
        },
        secondary: {
          light: '#34d399', // emerald-400
          DEFAULT: '#059669', // emerald-600
          dark: '#047857', // emerald-700
        },
      },
    },
  },
  plugins: [],
};
