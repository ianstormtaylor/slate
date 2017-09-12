
import assert from 'assert'
import fs from 'fs'
import { Schema } from '../..'
import { basename, extname, resolve } from 'path'

/**
 * Tests.
 */

describe('schemas', () => {
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
})
