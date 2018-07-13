/**
 * Dependencies.
 */

import slt1 from '../src'
import assert from 'assert'
import fs from 'fs'
import { Value, resetKeyGenerator } from 'slate'
import { basename, extname, resolve } from 'path'

/**
 * Reset Slate's internal key generator state before each text.
 */

beforeEach(() => {
  resetKeyGenerator()
})

/**
 * Tests.
 */

describe('slate-slt1-serializer', () => {
  describe('deserialize(falsy)', () => {
    assert(Value.isValue(slt1.deserialize(null)))
  })

  describe('deserialize(JSON)', () => {
    const toJson = require('./deserialize/to-json')
    const value = slt1.deserialize(toJson.output)
    assert(Value.isValue(value))
    const reserialized = slt1.serialize(value)
    assert.deepEqual(reserialized, toJson.input)
  })

  describe('deserialize(slt)', () => {
    const dir = resolve(__dirname, './deserialize')
    const tests = fs
      .readdirSync(dir)
      .filter(t => t[0] != '.')
      .map(t => basename(t, extname(t)))

    for (const test of tests) {
      it(test, async () => {
        const module = require(resolve(dir, test))
        const { input, output, options } = module
        const value = slt1.deserialize(input, options)
        const actual = Value.isValue(value) ? value.toJSON() : value
        const expected = Value.isValue(output) ? output.toJSON() : output
        assert.deepEqual(actual, expected)
      })
    }
  })

  describe('serialize(value)', () => {
    const dir = resolve(__dirname, './serialize')
    const tests = fs
      .readdirSync(dir)
      .filter(t => t[0] != '.')
      .map(t => basename(t, extname(t)))

    for (const test of tests) {
      it(test, async () => {
        const module = require(resolve(dir, test))
        const { input, output, options } = module
        const string = slt1.serialize(input, options)
        const actual = string
        const expected = output
        assert.deepEqual(actual, expected)
        const reserialized = slt1.deserialize(actual)
        assert.deepEqual(input.toJSON(), reserialized.toJSON())
      })
    }
  })
})
