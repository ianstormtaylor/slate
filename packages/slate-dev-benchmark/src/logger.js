/* eslint-disable no-console */

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
 * @retrun {void}
 */

function log(message, ...args) {
  if (IS_TEST) return

  return console.log(message, ...args)
}

/*
 * Log a error `message`
*/

function errorLog(message, ...args) {
  console.error(message, ...args)
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

    const header = {
      user: 'user:',
      hr: 'real:',
    }

    for (const key of ['user', 'hr']) {
      log(
        `${prefix + prefix + prefix}${header[key]} * ${cycles} cycles: ${
          report[key]
        } ms; ( ${cycles * 1000 / report[key]} ops/sec)`
      )
    }
    return log(`${prefix + prefix + prefix}cycles: ${cycles}`)
  }
  return log(obj)
}

module.exports = { logger, errorLog, log }
