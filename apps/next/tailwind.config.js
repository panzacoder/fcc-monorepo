/**
 * Tailwind CSS v4 config for Next.js
 * Most configuration is now in CSS via @theme directive
 * See packages/app/config/tailwind/global.css
 */

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,jsx,ts,tsx}',
    './app/**/*.{js,jsx,ts,tsx}',
    './stories/**/*.{js,jsx,ts,tsx}',
    '../../packages/**/*.{js,jsx,ts,tsx}'
  ],
  darkMode: 'class'
}
