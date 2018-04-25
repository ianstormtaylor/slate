/* eslint-disable no-console */

/**
 * Is in development?
 *
 * @type {Boolean}
 */

const IS_DEV =
  typeof process !== 'undefined' &&
  process.env &&
  process.env.NODE_ENV !== 'production'

/**
 * Has console?
 *
 * @type {Boolean}
 */

const HAS_CONSOLE =
  typeof console != 'undefined' &&
  typeof console.log == 'function' &&
  typeof console.warn == 'function' &&
  typeof console.error == 'function'

/**
 * IS in test
 */

const IS_TEST =
  typeof process !== 'undefined' &&
  process.env &&
  process.env.BABEL_ENV === 'test'

/**
 * Log a `message`
 *
 * @param {String} message
 * @param {Any} ...args
 */

function log(message, ...args) {
  if (!IS_DEV) {
    return
  }
  if (IS_TEST) return

  if (HAS_CONSOLE) {
    console.log(message, ...args)
  }
}

/*
 * Log a error `message`
*/

function errorLog(message, ...args) {
  if (!IS_DEV) {
    return
  }

  if (HAS_CONSOLE) {
    console.error(message, ...args)
  }
}

/**
 * Logging benchmark result
 */

function logger(obj) {
  const prefix = '    '
  if (obj.isRepository) {
    return log(`Repository ${obj.name} is running`)
  }
  if (obj.isSuite) {
    return log(`${prefix}- Suite ${obj.name} is running`)
  }
  if (obj.isBench) {
    if (!obj.isFinished) {
      return log(`${prefix + prefix}- Bench ${obj.name} is running`)
    }
    const { report } = obj
    const { cycles } = report
    for (const key of ['user', 'system', 'all', 'hr']) {
      log(
        `${prefix + prefix + prefix}${key} * ${cycles} cycles: ${
          report[key]
        } ms; ( ${cycles * 1000 / report[key]} ops/sec)`
      )
    }
    return log(`${prefix + prefix + prefix}cycles: ${cycles}`)
  }
  return log(obj)
}
module.exports = { logger, errorLog, log }
