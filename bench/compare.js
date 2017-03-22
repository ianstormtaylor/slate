/* eslint-disable no-console */

import chalk from 'chalk'
import baseline from '../tmp/bench-baseline'
import comparison from '../tmp/bench-comparison'

/**
 * Constants.
 */

const THRESHOLD = 0.2

/**
 * Print.
 */

baseline.forEach((suite, i) => {
  console.log()
  console.log(`  ${suite.name}`)

  suite.benchmarks.forEach((base, j) => {
    const comp = comparison[i].benchmarks[j]
    const b = (base.iterations / base.elapsed)
    const c = (comp.iterations / comp.elapsed)
    const threshold = b * THRESHOLD
    const slower = (b - c) > threshold
    const faster = (b - c) < (0 - threshold)
    const percent = Math.round(Math.abs(b - c) / b * 100)

    let output = `${b.toFixed(2)} --> ${c.toFixed(2)} iterations/sec`
    if (slower) output = chalk.red(`${output} (${percent}% slower)`)
    if (faster) output = chalk.green(`${output} (${percent}% faster)`)

    console.log(`    ${base.title}`)
    console.log(`      ${output}`)
  })

  console.log()
})
