
import assert from 'assert'
import fs from 'fs-promise' // eslint-disable-line import/no-extraneous-dependencies
import toCamel from 'to-camel-case' // eslint-disable-line import/no-extraneous-dependencies
import { basename, extname, resolve } from 'path'

/**
 * Tests.
 */

describe('changes', async () => {
  const dir = resolve(__dirname)
  const categories = fs.readdirSync(dir).filter(c => c[0] != '.' && c != 'index.js')

  for (const category of categories) {
    describe(category, () => {
      const categoryDir = resolve(dir, category)
      const methods = fs.readdirSync(categoryDir).filter(c => c[0] != '.')

      for (const method of methods) {
        describe(toCamel(method), () => {
          const testDir = resolve(categoryDir, method)
          const tests = fs.readdirSync(testDir).filter(t => t[0] != '.' && !!~t.indexOf('.js')).map(t => basename(t, extname(t)))

          for (const test of tests) {
            it(test, async () => {
              const module = require(resolve(testDir, test))
              const { input, output } = module
              const fn = module.default
              const change = input.change()
              fn(change)
              const opts = { preseveSelection: true, preserveStateData: true }
              const actual = change.state.toJSON(opts)
              const expected = output.toJSON(opts)
              assert.deepEqual(actual, expected)
            })
          }
        })
      }
    })
  }
})
