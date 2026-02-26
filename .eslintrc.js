module.exports = {
  extends: 'next',
  settings: {
    next: {
      rootDir: 'apps/next/'
    }
  },
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  rules: {
    'no-console': 'warn',
    '@typescript-eslint/no-explicit-any': 'warn',
    'no-restricted-imports': [
      'error',
      {
        paths: [
          {
            name: 'react-redux',
            message:
              'Redux has been replaced by Zustand. Use useAppSelector from app/redux/hooks or useStore from app/store.'
          }
        ]
      }
    ]
  }
}
