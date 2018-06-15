import { t as assert } from 'jest-t-assert' // eslint-disable-line import/no-extraneous-dependencies
import fs from 'fs'
import { Schema } from '../../src'
import { basename, extname, resolve } from 'path'

/**
 * Tests.
 */

describe('schema', () => {
  describe('core', () => {
    const testsDir = resolve(__dirname, 'core')
    const tests = fs
      .readdirSync(testsDir)
      .filter(t => t[0] != '.')
      .map(t => basename(t, extname(t)))

    for (const test of tests) {
      it(test, async () => {
        const module = require(resolve(testsDir, test))
        const { input, output, schema } = module
        const s = Schema.create(schema)
        const expected = output
        const actual = input
          .change()
          .setValue({ schema: s })
          .normalize()
          .value.toJSON()

        assert.deepEqual(actual, expected)
      })
    }
  })

  describe('custom', () => {
    const testsDir = resolve(__dirname, 'custom')
    const tests = fs
      .readdirSync(testsDir)
      .filter(t => t[0] != '.')
      .map(t => basename(t, extname(t)))

    for (const test of tests) {
      it(test, async () => {
        const module = require(resolve(testsDir, test))
        const { input, output, schema } = module
        const s = Schema.create(schema)
        const expected = output.toJSON()
        const actual = input
          .change()
          .setValue({ schema: s })
          .normalize()
          .value.toJSON()

        assert.deepEqual(actual, expected)
      })
    }
  })
})
