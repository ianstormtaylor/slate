/* eslint-disable no-console */

import chalk from 'chalk'
import baseline from '../tmp/benchmark-baseline'
import comparison from '../tmp/benchmark-comparison'

/**
 * Constants.
 */

const THRESHOLD = 0.2

/**
 * Print.
 */

console.log()
console.log(`  benchmarks`)

baseline.forEach((suite, i) => {
  console.log(`    ${suite.name}`)

  suite.benchmarks.forEach((base, j) => {
    const comp = comparison[i].benchmarks[j]
    if (!comp) return

    const b = base.iterations / base.elapsed * 100
    const c = comp.iterations / comp.elapsed * 100
    const threshold = b * THRESHOLD
    const slower = (b - c) > threshold
    const faster = (b - c) < (0 - threshold)
    const percent = Math.round(Math.abs(b - c) / b * 100)

    let output = `${b.toFixed(2)} → ${c.toFixed(2)} iterations/sec`
    if (slower) output = chalk.red(`${output} (${percent}% slower)`)
    else if (faster) output = chalk.green(`${output} (${percent}% faster)`)
    else output = chalk.gray(output)

    if (percent > 1000) output += ' 😱'
    else if (faster && percent > 100) output += ' 🙌'
    else if (slower && percent > 100) output += ' 😟'

    console.log(`      ${base.title}`)
    console.log(`        ${output}`)
  })
})

console.log()
