import assert from 'assert'
import fs from 'fs'
import { resolve } from 'path'
import isPlainObject from 'is-plain-object'

describe('utils', () => {
  const dir = resolve(__dirname)
  const categories = fs
    .readdirSync(dir)
    .filter(c => c[0] != '.' && c != 'index.js')
  for (const category of categories) {
    describe(category, () => {
      const categoryDir = resolve(dir, category)
      const methods = fs.readdirSync(categoryDir).filter(c => c[0] != '.')
      for (const method of methods) {
        const module = require(resolve(categoryDir, method))
        const { input, output, skip } = module
        const t = skip ? it.skip : it

        t(method.replace(/\.js$/, ''), () => {
          const actual = module.default(input)
          if (actual === output) return true
          if (isPlainObject(actual)) {
            assert.deepEqual(actual, output)
          } else {
            assert.deepEqual(actual.toJSON(), output.toJSON())
          }
        })
      }
    })
  }
})
