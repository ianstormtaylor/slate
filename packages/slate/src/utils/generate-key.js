import KeyUtils from './key-utils'
import logger from 'slate-dev-logger'

function generateKey() {
  logger.deprecate(
    `0.35.0`,
    'The `generateKey()` util is deprecrated. Use the `KeyUtils.create()` helper instead.'
  )

  return KeyUtils.create()
}

function setKeyGenerator(fn) {
  logger.deprecate(
    `0.35.0`,
    'The `setKeyGenerator()` util is deprecrated. Use the `KeyUtils.setGenerator()` helper instead.'
  )

  return KeyUtils.setGenerator(fn)
}

function resetKeyGenerator() {
  logger.deprecate(
    `0.35.0`,
    'The `resetKeyGenerator()` util is deprecrated. Use the `KeyUtils.resetGenerator()` helper instead.'
  )

  return KeyUtils.resetGenerator()
}

export default generateKey
export { setKeyGenerator, resetKeyGenerator }
