// This is a dummy tailwind config file used to provide intellisense.
// To configure your global tailwind settings, modify the imported theme object.
const { theme } = require('./design/tailwind/theme')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  important: 'html',
  theme: {
    ...theme,
  },
}
