/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./**/index.html", "./js/**/*.js"],
  theme: {
    extend: {
      colors: {
        'primary': 'var(--primary, #0f0f0f)',
        // Black → gold brand palette
        ink: {
          DEFAULT: '#0a0a0a',
          950: '#050505',
          900: '#0a0a0a',
          800: '#121212',
          700: '#1a1a1a',
          600: '#242424',
          500: '#2e2a22',
        },
        gold: {
          50: '#fbf8ee',
          100: '#f5edd0',
          200: '#ecdba0',
          300: '#e2c56b',
          400: '#d4af37',
          500: '#c19a2e',
          600: '#a67c24',
          700: '#855f1f',
          800: '#6e4e20',
          900: '#5d421f',
          950: '#35230e',
        },
      },
      fontFamily: {
        display: ['"Cormorant SC"', 'Georgia', 'serif'],
        sans: ['Montserrat', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        accent: ['"Josefin Sans"', 'ui-sans-serif', 'sans-serif'],
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #f5edd0 0%, #e2c56b 25%, #d4af37 50%, #a67c24 75%, #e2c56b 100%)',
        'black-gold': 'linear-gradient(180deg, #050505 0%, #0a0a0a 45%, #1a140a 80%, #35230e 100%)',
        'gold-radial': 'radial-gradient(ellipse at top, rgba(212,175,55,0.18), transparent 60%)',
      },
      boxShadow: {
        gold: '0 10px 30px -10px rgba(212, 175, 55, 0.45)',
      },
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

