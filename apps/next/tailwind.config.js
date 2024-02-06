const { theme } = require('app/config/tailwind/theme')

const { withTV } = require('tailwind-variants/transformer')

module.exports = withTV({
  content: [
    './pages/**/*.{js,jsx,ts,tsx}',
    './app/**/*.{js,jsx,ts,tsx}',
    './stories/**/*.{js,jsx,ts,tsx}',
    '../../packages/**/*.{js,jsx,ts,tsx}'
  ],
  presets: [require('nativewind/preset')],
  important: 'html',

  darkMode: ['class'],
  theme: {
    ...theme
  }
})
