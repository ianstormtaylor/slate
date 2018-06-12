import { readdirSync, lstatSync } from 'fs'
import { resolve } from 'path'
import assert from 'assert'

describe('slate-dev-lints', () => {
  const categories = readdirSync(__dirname).filter(dirname =>
    lstatSync(resolve(__dirname, dirname)).isDirectory()
  )

  for (const category of categories) {
    describe(category, () => {
      const testDir = resolve(__dirname, category)
      const tests = readdirSync(testDir).filter(x => x.length && x[0] !== '.')

      for (const test of tests) {
        it(test.replace(/.js$/, ''), () => {
          const module = require(resolve(testDir, test))
          const { input, output } = module
          const actual = module.default(input)
          if (!output) return
          if (output === actual) return
          assert.deepEqual(output.toJSON(), actual.toJSON())
        })
      }
    })
  }
})
