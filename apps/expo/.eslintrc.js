module.exports = {
  extends: ['../../.eslintrc.js'],
  settings: {
    next: undefined
  },
  rules: {
    '@next/next/no-html-link-for-pages': 'off'
  },
  ignorePatterns: ['ios/', 'android/', '.expo/']
}
