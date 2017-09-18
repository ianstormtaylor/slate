
import assert from 'assert'
import fs from 'fs'
import { basename, extname, resolve } from 'path'

/**
 * Tests.
 */

describe('history', async () => {
  const dir = resolve(__dirname)
  const methods = fs.readdirSync(dir).filter(d => d[0] != '.' && d != 'index.js')

  for (const method of methods) {
    describe(method, () => {
      const testDir = resolve(dir, method)
      const tests = fs.readdirSync(testDir).filter(f => f[0] != '.' && !!~f.indexOf('.js')).map(f => basename(f, extname(f)))

      for (const test of tests) {
        const module = require(resolve(testDir, test))
        const { input, output, skip } = module
        const fn = module.default
        const t = skip ? it.skip : it

        t(test, async () => {
          const next = fn(input)
          const opts = { preserveSelection: true, preserveStateData: true }
          const actual = next.toJSON(opts)
          const expected = output.toJSON(opts)
          assert.deepEqual(actual, expected)
        })
      }
    })
  }
})
