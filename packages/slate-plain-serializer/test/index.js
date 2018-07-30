/* eslint-disable import/no-extraneous-dependencies */
import Plain from 'slate-plain-serializer'
import { t as assert } from 'jest-t-assert' // eslint-disable-line import/no-extraneous-dependencies
import fs from 'fs'
import { Value, KeyUtils } from 'slate'
import { basename, extname, resolve } from 'path'

describe('slate-plain-serializer', () => {
  beforeEach(KeyUtils.resetGenerator)

  describe('deserialize()', () => {
    const dir = resolve(__dirname, './deserialize')
    const tests = fs
      .readdirSync(dir)
      .filter(t => t[0] != '.')
      .map(t => basename(t, extname(t)))

    for (const test of tests) {
      it(test, async () => {
        const module = require(resolve(dir, test))
        const { input, output, options } = module
        const value = Plain.deserialize(input, options)
        const actual = Value.isValue(value) ? value.toJSON() : value
        const expected = Value.isValue(output) ? output.toJSON() : output
        assert.deepEqual(actual, expected)
      })
    }
  })

  describe('serialize()', () => {
    const dir = resolve(__dirname, './serialize')
    const tests = fs
      .readdirSync(dir)
      .filter(t => t[0] != '.')
      .map(t => basename(t, extname(t)))

    for (const test of tests) {
      it(test, async () => {
        const module = require(resolve(dir, test))
        const { input, output, options } = module
        const string = Plain.serialize(input, options)
        const actual = string
        const expected = output
        assert.deepEqual(actual, expected)
      })
    }
  })
})
