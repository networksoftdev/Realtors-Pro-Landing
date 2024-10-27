/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./**/index.html", "./js/**/*.js"],
  theme: {
    extend: {
      colors: {
        'primary': 'var(--primary, #0f0f0f)',
      }
    },
  },
  plugins: [],
}

