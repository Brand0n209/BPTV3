/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./views/**/*.ejs",
    "./public/js/**/*.js"
  ],
  theme: {
    extend: {
      maxWidth: {
        16: '4rem',   // same as w-16
        56: '14rem',  // same as w-56
      }
    },
  },
  plugins: [],
};
