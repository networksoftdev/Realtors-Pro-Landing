/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./**/index.html", "./js/**/*.js"],
  theme: {
    extend: {
      colors: {
        'primary': 'var(--primary, #0f0f0f)',
      }
    },
    screens: {
      'xs': '480px',
      'sm': '640px', // 160px
      'md': '768px',// 128px
      // '2md': '896px', // 128px
      'md-lg': '992px', // 96px
      'lg': '1024px', // 32px
      'xl': '1280px', // 256px
      '2xl': '1536px', // 256px
      '3xl': '1920px', // 384px
      '4xl': '2560px', // 540px
      '5xl': '3840px', // 1280px
      '6xl': '5120px', // 1280px
    }
  },
  plugins: [],
}

