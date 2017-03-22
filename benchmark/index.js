
import fs from 'fs'
import path from 'path'
import readMetadata from 'read-metadata'
import { Raw } from '..'

/**
 * Benchmarks.
 */

const outer = path.resolve(__dirname, './fixtures')
const types = fs.readdirSync(outer)

types.forEach((type) => {
  suite(type, () => {
    set('iterations', 100) // eslint-disable-line no-undef
    set('mintime', 2000) // eslint-disable-line no-undef

    const inner = path.resolve(outer, type)
    const benchmarks = fs.readdirSync(inner)

    benchmarks.forEach((benchmark) => {
      if (benchmark[0] === '.') return

      const dir = path.resolve(inner, benchmark)
      const input = readMetadata.sync(path.resolve(dir, 'input.yaml'))
      const initial = Raw.deserialize(input, { terse: true })
      const module = require(dir)
      const run = module.default
      const state = module.before ? module.before(initial) : initial

      bench(benchmark, () => { // eslint-disable-line no-undef
        run(state)
        if (module.after) module.after()
      })
    })
  })
})
