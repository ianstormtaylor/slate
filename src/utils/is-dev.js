const __DEV__ = (
  typeof process !== 'undefined' &&
  process.env &&
  process.env.NODE_ENV !== 'production'
)

/**
 * Return true if running slate in development
 * @return {Boolean} dev
 */

export default function isDev() {
  return __DEV__
}
