const isDev =
  typeof __DEV__ !== 'undefined'
    ? __DEV__
    : process.env.NODE_ENV !== 'production'

/* eslint-disable no-console */
function debug(...args: unknown[]): void {
  if (isDev) {
    console.log('[DEBUG]', ...args)
  }
}

function info(...args: unknown[]): void {
  if (isDev) {
    console.info('[INFO]', ...args)
  }
}

function warn(...args: unknown[]): void {
  if (isDev) {
    console.warn('[WARN]', ...args)
  }
}

function error(...args: unknown[]): void {
  console.error('[ERROR]', ...args)
}
/* eslint-enable no-console */

export const logger = {
  debug,
  info,
  warn,
  error
}
