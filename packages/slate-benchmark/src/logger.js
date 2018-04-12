/* eslint-disable no-console */
import {
  RepositoryType,
  SuiteType,
  BenchType,
  TimerType,
} from './components/types'

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
 * Log a `message` at `level`.
 *
 * @param {String} level
 * @param {String} message
 * @param {Any} ...args
 */

export function log(level, message, ...args) {
  if (!IS_DEV) {
    return
  }

  if (HAS_CONSOLE) {
    console.log(message, ...args)
  }
}

export function errorLog(level, message, ...args) {
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

export default function logger(obj) {
  const prefix = '    '
  if (obj[RepositoryType]) {
    return log(`Repository ${obj.name} is running`)
  }
  if (obj[SuiteType]) {
    return log(`${prefix}- Suite ${obj.name} is running`)
  }
  if (obj[BenchType]) {
    if (!obj.isFinished) {
      return log(`${prefix + prefix}- Bench ${obj.name} is running`)
    }
    const { report } = obj
    const { cycles } = report
    for (const key of ['user', 'system', 'all']) {
      log(
        `${prefix + prefix + prefix}${key} * ${cycles} cycles: ${report[key]}`
      )
    }
    return log(`${prefix + prefix + prefix}cycles: ${cycles}`)
  }
  if (obj[TimerType]) {
    const timerPrefix = prefix + prefix + prefix
    const { user, system, all } = obj.data
    log(`${timerPrefix}- user: ${user} seconds`)
    log(`${timerPrefix}- system: ${system} seconds`)
    return log(`${timerPrefix}- all: ${all} seconds`)
  }
  return log(obj)
}
