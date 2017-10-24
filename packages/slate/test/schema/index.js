
import assert from 'assert'
import fs from 'fs'
import { Schema } from '../..'
import { basename, extname, resolve } from 'path'

/**
 * Tests.
 */

describe('schema', () => {
  describe('core', () => {
    const innerDir = resolve(__dirname, 'core')
    const tests = fs.readdirSync(innerDir).filter(t => t[0] != '.').map(t => basename(t, extname(t)))

    for (const test of tests) {
      it(test, async () => {
        const module = require(resolve(innerDir, test))
        const { input, output, schema } = module
        const s = Schema.create(schema)
        const actual = input.change().normalize(s).state.toJSON()
        const expected = output
        assert.deepEqual(actual, expected)
      })
    }
  })

  const dir = resolve(__dirname)
  const categories = fs.readdirSync(dir).filter(c => c[0] != '.' && c != 'index.js')

  for (const category of categories) {
    if (category == 'core') continue

    describe(category, () => {
      const categoryDir = resolve(dir, category)
      const reasons = fs.readdirSync(categoryDir).filter(c => c[0] != '.')

      for (const reason of reasons) {
        describe(reason, () => {
          const testDir = resolve(categoryDir, reason)
          const tests = fs.readdirSync(testDir).filter(t => t[0] != '.' && !!~t.indexOf('.js')).map(t => basename(t, extname(t)))

          for (const test of tests) {
            it(test, async () => {
              const module = require(resolve(testDir, test))
              const { input, output, schema } = module
              const s = Schema.create(schema)
              const actual = input.change().normalize(s).state.toJSON()
              const expected = output.toJSON()
              assert.deepEqual(actual, expected)
            })
          }
        })
      }
    })
  }
})
