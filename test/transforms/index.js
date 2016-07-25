
import assert from 'assert'
import fs from 'fs'
import readMetadata from 'read-metadata'
import strip from '../helpers/strip-dynamic'
import toCamel from 'to-camel-case'
import { Raw, State } from '../..'
import { equal, strictEqual } from '../helpers/assert-json'
import { resolve } from 'path'

/**
 * Tests.
 */

describe('transforms', () => {
  const dir = resolve(__dirname, './fixtures')
  const transforms = fs.readdirSync(dir)

  for (const transform of transforms) {
    describe(`${toCamel(transform)}()`, () => {
      const dir = resolve(__dirname, './fixtures', transform)
      const tests = fs.readdirSync(dir)

      for (const test of tests) {
        it(test, () => {
          const innerDir = resolve(dir, test)
          const fn = require(innerDir).default
          const input = readMetadata.sync(resolve(innerDir, 'input.yaml'))
          const expected = readMetadata.sync(resolve(innerDir, 'output.yaml'))

          let state = Raw.deserialize(input)
          state = fn(state)
          const output = Raw.serialize(state)
          strictEqual(strip(output), strip(expected))
        })
      }
    })
  }
})
