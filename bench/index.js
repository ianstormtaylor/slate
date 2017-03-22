
/**
 * Polyfills.
 */

require('jsdom-global/register')

/**
 * Dependencies.
 */

const fs = require('fs')
const path = require('path')
const readMetadata = require('read-metadata')
const { __clear } = require('../lib/utils/memoize')
const { Raw } = require('..')

/**
 * Benchmarks.
 */

suite('benchmarks', () => {
  set('iterations', 200) // eslint-disable-line no-undef
  set('mintime', 2000) // eslint-disable-line no-undef

  const fixtures = path.resolve(__dirname, './fixtures')
  const benchmarks = fs.readdirSync(fixtures)

  benchmarks.forEach((benchmark) => {
    if (benchmark[0] === '.') return
    if (benchmark === 'normalize-document-twice') return

    const dir = path.resolve(fixtures, benchmark)
    const input = readMetadata.sync(path.resolve(dir, 'input.yaml'))
    const initial = Raw.deserialize(input, { terse: true })
    const module = require(dir)
    const run = module.default
    const state = module.before ? module.before(initial) : initial

    bench(benchmark, () => { // eslint-disable-line no-undef
      run(state)
    })

    after(() => {
      __clear()
    })
  })
})
