
import assert from 'assert'
import fs from 'fs'
import { Schema } from '../..'
import { basename, extname, resolve } from 'path'

/**
 * Tests.
 */

describe('models', () => {
  describe('change', () => {
    describe('withoutNormalization', () => {
      const testsDir = resolve(__dirname, 'change')
      const tests = fs.readdirSync(testsDir).filter(t => t[0] != '.').map(t => basename(t, extname(t)))

      for (const test of tests) {
        it(test, async () => {
          const module = require(resolve(testsDir, test))
          const { input, output, schema, normalize, flags, customChange } = module
          const s = Schema.create(schema)
          const expected = output.toJSON()
          const change = input
            .change(flags)
            .setValue({ schema: s })
          if (normalize === undefined) {
            // undefined is a special flag which causes the test to examine how the
            // flag restoration behaves after the user has cleared the normalize flag
            change.unsetOperationFlag('normalize')
          }
          const actual = change
            .withoutNormalization(customChange)
            .value.toJSON()

          assert.deepEqual(change.flags.normalize, normalize)
          assert.deepEqual(actual, expected)
        })
      }
    })
  })
})
