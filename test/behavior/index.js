
import assert from 'assert'
import fs from 'fs'
import readYaml from 'read-yaml-promise'
import toCamel from 'to-camel-case'
import { Stack, Raw } from '../..'
import { resolve } from 'path'

/**
 * Tests.
 */

describe('behavior', () => {
  const fixturesDir = resolve(__dirname, 'fixtures')
  const events = fs.readdirSync(fixturesDir)

  for (const event of events) {
    if (event[0] == '.') continue

    describe(`${toCamel(event)}`, () => {
      const testsDir = resolve(__dirname, 'fixtures', event)
      const tests = fs.readdirSync(testsDir)

      for (const test of tests) {
        if (test[0] === '.') continue

        it(test, async () => {
          const dir = resolve(__dirname, 'fixtures', event, test)
          const input = await readYaml(resolve(dir, 'input.yaml'))
          const expected = await readYaml(resolve(dir, 'output.yaml'))
          const module = require(dir)
          const fn = module.default

          let state = Raw.deserialize(input, { terse: true })
          const props = module.props || {}
          const stack = Stack.create(props)
          state = fn(state, stack)

          const output = Raw.serialize(state, {
            terse: true,
            preserveKeys: true,
            preserveSelection: true,
          })

          assert.deepEqual(output, expected)
        })
      }
    })
  }
})
