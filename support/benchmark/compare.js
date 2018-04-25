/* eslint-disable no-console */

import chalk from 'chalk'
import baseline from '../../tmp/benchmark-baseline'
import comparison from '../../tmp/benchmark-comparison'

/**
 * Constants.
 */

const THRESHOLD = 0.333

/**
 * Print.
 */

console.log()
console.log(`  benchmarks`)

baseline.forEach((suite, i) => {
  console.log(`    ${suite.name}`)

  suite.benchmarks.forEach((base, j) => {
    console.log(`      ${base.title}`)
    for (const elapsedKey of ['user', 'hr']) {
      const comp = comparison[i].benchmarks[j]
      if (!comp) return

      const b = base.iterations / base[elapsedKey] * 1000
      const c = comp.iterations / comp[elapsedKey] * 1000
      const threshold = b * THRESHOLD
      const slower = b / c > 1 + threshold
      const faster = c / b > 1 + threshold
      const percent = Math.round(Math.abs(b - c) / b * 100)
      const emojiPercent =
        b > c ? percent : Math.round(Math.abs(c - b) / c * 100)

      let output = `${b.toFixed(2)} → ${c.toFixed(2)} ops/sec`
      if (slower) output = chalk.red(`${output} (${percent}% slower)`)
      else if (faster) output = chalk.green(`${output} (${percent}% faster)`)
      else output = chalk.gray(output)

      if (emojiPercent > 1000) output += ' 😱'
      else if (faster && emojiPercent > 100) output += ' 🙌'
      else if (slower && emojiPercent > 100) output += ' 😟'
      console.log(`        ${elapsedKey} : ${output}`)
    }
  })
})

console.log()
