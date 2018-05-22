/* eslint-disable no-console */

import chalk from 'chalk'
import baseline from '../../tmp/benchmark-baseline'
import comparison from '../../tmp/benchmark-comparison'
import { existsSync } from 'fs'
import figures from 'figures'

/**
 * Constants.
 */

let THRESHOLD = 0.333
const configPath = '../../tmp/benchmark-config.js'
if (existsSync(configPath)) {
  const alternative = require(configPath).THRESHOLD
  if (typeof alternative === 'number' && alternative > 0) {
    THRESHOLD = alternative
  }
}

/**
 * Print.
 */

console.log()
console.log(`  benchmarks`)

baseline.forEach((suite, i) => {
  console.log(`    ${suite.name}`)

  suite.benchmarks.forEach((base, j) => {
    const compared = { user: {}, hr: {} }

    for (const key of Object.keys(compared)) {
      const comp = comparison[i].benchmarks[j]
      if (!comp) return
      const b = base.iterations / base[key] * 1000
      const c = comp.iterations / comp[key] * 1000
      const balancePercent =
        b > c ? Math.round(Math.abs(b - c) / c * 100) : (c - b) / b * 100

      const output = `${b.toFixed(2)} -> ${c.toFixed(2)} ops/sec`
      compared[key].baseOutput = output
      compared[key].percentOutput = `${balancePercent.toFixed(2)}% ${
        c > b ? 'faster' : 'slower'
      }`
      compared[key].percentValue = balancePercent
      compared[key].b = b
      compared[key].c = c
      compared[key].isFaster = c > b
    }

    const { user, hr } = compared

    if (
      user.percentValue < THRESHOLD * 100 &&
      hr.percentValue < THRESHOLD * 100
    ) {
      console.log(
        chalk.grey(
          `      ${figures.tick} ${base.name}: ${user.baseOutput} (${
            user.percentOutput
          })`
        )
      )
      return
    }

    if (user.isFaster === hr.isFaster) {
      if (user.isFaster) {
        console.log(chalk.green(`      ${figures.star} ${base.name}:`))
        console.log(
          `            user: ${user.baseOutput} (${user.percentOutput})`
        )
        console.log(`            real: ${hr.baseOutput} (${hr.percentOutput})`)
        return
      }
      console.log(chalk.red(`      ${figures.cross} ${base.name}:`))
      console.log(
        `            user: ${user.baseOutput} (${user.percentOutput})`
      )
      console.log(`            real: ${hr.baseOutput} (${hr.percentOutput})`)
      return
    }

    console.log(chalk.red(`      ${figures.questionMarkPrefix} ${base.name}:`))
    console.log(`            user: ${user.baseOutput} (${user.percentOutput})`)
    console.log(`            real: ${hr.baseOutput} (${hr.percentOutput})`)
  })
})

console.log()
