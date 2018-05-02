/* eslint-disable no-console */

import chalk from 'chalk'
import baseline from '../../tmp/benchmark-baseline'
import comparison from '../../tmp/benchmark-comparison'
import { existsSync } from 'fs'

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
    console.log(`      ${base.name}`)
    for (const elapsedKey of ['user', 'hr']) {
      const comp = comparison[i].benchmarks[j]
      if (!comp) return

      const b = base.iterations / base[elapsedKey] * 1000
      const c = comp.iterations / comp[elapsedKey] * 1000
      const slower = b / c > 1 + THRESHOLD
      const faster = c / b > 1 + THRESHOLD
      const percent = Math.round(Math.abs(b - c) / c * 100)
      const balancePercent = b > c ? percent : (c - b) / b * 100

      let output = `${b.toFixed(2)} → ${c.toFixed(2)} ops/sec`
      if (slower) output = chalk.red(`${output} (${balancePercent}% slower)`)
      else if (faster)
        output = chalk.green(`${output} (${balancePercent}% faster)`)
      else output = chalk.gray(output)

      if (balancePercent > 1000) output += ' 😱'
      else if (faster && balancePercent > 100) output += ' 🙌'
      else if (slower && balancePercent > 100) output += ' 😟'
      console.log(`        ${elapsedKey} : ${output}`)
    }
  })
})

console.log()
