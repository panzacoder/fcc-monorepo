// @ts-check

const { theme } = require('app/config/tailwind/theme')

/**
 * @type {import('tailwindcss').Config}
 */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    '../../packages/**/*.{js,jsx,ts,tsx}'
  ],
  presets: [require('nativewind/preset')],
  plugins: [require('tailwindcss-animate')],
  darkMode: ['class'],
  theme: {
    ...theme
  }
}
