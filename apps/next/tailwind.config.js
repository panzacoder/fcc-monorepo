const { theme } = require('app/design/tailwind/theme')

module.exports = {
  content: [
    './pages/**/*.{js,jsx,ts,tsx}',
    './app/**/*.{js,jsx,ts,tsx}',
    './stories/**/*.{js,jsx,ts,tsx}',
    '../../packages/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  important: 'html',

  darkMode: ['class'],
  theme: {
    ...theme,
  },
}
