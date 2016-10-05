const Benchmark = require('benchmark')
const fs = require('fs')
const readMetadata = require('read-metadata')
const toCamel = require('to-camel-case')
const { Raw } = require('..')
const { resolve } = require('path')

/**
 * Performance benchmark
 */

console.log('Benchmark\n')

let suite = new Benchmark.Suite()

const suiteDir = resolve(__dirname, './operations')
const operations = fs.readdirSync(suiteDir)

for (const operation of operations) {
  if (operation[0] == '.') continue

  const operationDir = resolve(suiteDir, operation)
  const fn = require(operationDir)
  const input = readMetadata.sync(resolve(operationDir, 'input.yaml'))

  let state = Raw.deserialize(input, { terse: true })

  // add tests
  suite.add({
    name: operation,
    fn: () => {
      return fn(state)
    }
  })
}


suite
  .on('cycle', (event) => {
    console.log(String(event.target))
  })
  // run async to properly flush logs
  .run({ 'async': true })

