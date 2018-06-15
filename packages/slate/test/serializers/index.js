import { t as assert } from 'jest-t-assert' // eslint-disable-line import/no-extraneous-dependencies
import fs from 'fs'
import { Value } from '../../src'
import { basename, extname, resolve } from 'path'

/**
 * Tests.
 */

describe('serializers', () => {
  describe('raw', () => {
    describe('deserialize()', () => {
      const dir = resolve(__dirname, './raw/deserialize')
      const tests = fs
        .readdirSync(dir)
        .filter(t => t[0] != '.')
        .map(t => basename(t, extname(t)))

      for (const test of tests) {
        it(test, async () => {
          const module = require(resolve(dir, test))
          const { input, output, options } = module
          const actual = Value.fromJSON(input, options).toJSON()
          const expected = output.toJSON()
          assert.deepEqual(actual, expected)
        })
      }
    })

    describe('serialize()', () => {
      const dir = resolve(__dirname, './raw/serialize')
      const tests = fs
        .readdirSync(dir)
        .filter(t => t[0] != '.')
        .map(t => basename(t, extname(t)))

      for (const test of tests) {
        it(test, async () => {
          const module = require(resolve(dir, test))
          const { input, output, options } = module
          const actual = input.toJSON(options)
          const expected = output
          assert.deepEqual(actual, expected)
        })
      }
    })
  })
})
