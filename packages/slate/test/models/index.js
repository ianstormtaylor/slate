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
      const tests = fs
        .readdirSync(testsDir)
        .filter(t => t[0] != '.')
        .map(t => basename(t, extname(t)))

      for (const test of tests) {
        it(test, async () => {
          const module = require(resolve(testsDir, test))
          const { input, output, schema, flags, customChange } = module
          const s = Schema.create(schema)
          const expected = output.toJSON()
          const actual = input
            .change(flags)
            .setValue({ schema: s })
            .withoutNormalization(customChange)
            .value.toJSON()

          assert.deepEqual(actual, expected)
        })
      }
    })
  })

  describe('node', () => {
    describe('node', () => {
      const testsDir = resolve(__dirname, 'node')
      const tests = fs
        .readdirSync(testsDir)
        .filter(t => t[0] != '.')
        .map(t => basename(t, extname(t)))

      for (const test of tests) {
        it(test, async () => {
          const run = require(resolve(testsDir, test)).default
          run()
        })
      }
    })
  })

  require('./text/')
  require('./leaf/')
})
