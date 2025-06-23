/** @type {import('tailwindcss').Config} */
export default {
  content: ['./*.html', './*.ts'],
  theme: {
    extend: {
      colors: {
        primary: '#f8f4f2',
        active: '#fbede0',
        secondary: '#e1dedb',
        text: '#383533',
      },
      fontFamily: {
        rubik: ['Rubik', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
