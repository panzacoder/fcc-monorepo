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
      'warn',
      {
        paths: [
          {
            name: 'app/redux/store',
            message:
              'Use useAppSelector/useAppDispatch hooks from app/redux/hooks instead of importing store directly.'
          }
        ]
      }
    ]
  }
}
