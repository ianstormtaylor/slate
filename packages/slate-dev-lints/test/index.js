import { readdirSync, lstatSync } from 'fs'
import { resolve } from 'path'

describe('slate-dev-lints', () => {
  const RuleTester = require('eslint').RuleTester

  const parserOptions = {
    ecmaVersion: 2018,
    sourceType: 'module',
  }
  const ruleTester = new RuleTester({ parserOptions })
  const categories = readdirSync(__dirname).filter(dirname =>
    lstatSync(resolve(__dirname, dirname)).isDirectory()
  )

  for (const category of categories) {
    describe(category, () => {
      const testDir = resolve(__dirname, category)
      const tests = readdirSync(testDir).filter(
        x => x.match(/.js$/) && x[0] !== '.'
      )

      for (const test of tests) {
        const module = require(resolve(testDir, test))
        module.default(ruleTester, test.replace(/.js$/, ''))
      }
    })
  }
})
